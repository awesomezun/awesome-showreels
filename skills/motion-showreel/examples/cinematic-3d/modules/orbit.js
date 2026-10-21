// orbit: the 궤도 일곱 trailer's kit (a project module). The Earth is a WebGL2 shader (an analytic sphere with fbm
// continents and clouds, city lights on the night side, a scattering shell for the atmosphere, the sun and stars);
// the station is flat-shaded 3D on Canvas2D (tiny3d), lit by the same sun; a lens flare, the scope bars and the
// trailer's cards are 2D. Without WebGL2 the Earth falls back to a gradient disc.
(() => {
  // ───────── tiny3d: a small flat-shaded 3D renderer on Canvas2D (perspective camera, painter's sort, lambert light) ─────────
  // Shared by the 3D examples of the 24-style series; each example carries its own copy inside its module.
  const T3 = {};
  T3.v = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
  const V = T3.v;
  // rotations of a point about the origin
  T3.rx = (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
  T3.ry = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
  T3.rz = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
  // camera: eye, target, fov (vertical, radians), up = +y; screen centre (cx, cy)
  T3.camera = (eye, target, fov = 0.8, o = {}) => {
    const f = V.norm(V.sub(target, eye)), r = V.norm(V.cross(f, [0, 1, 0])), u = V.cross(r, f), k = (H / 2) / Math.tan(fov / 2);
    return { eye, f, r, u, k, cx: o.cx ?? W / 2, cy: o.cy ?? H / 2 };
  };
  T3.project = (cam, p) => { const d = V.sub(p, cam.eye), z = V.dot(d, cam.f); return [cam.cx + V.dot(d, cam.r) * cam.k / z, cam.cy - V.dot(d, cam.u) * cam.k / z, z]; };
  // a face: {pts: [[x,y,z]...] (counter-clockwise seen from outside), col, emit (0..1 self-lit), line (edge colour), alpha, ds (two-sided)}
  T3.face = (pts, col, o = {}) => ({ pts, col, ...o });
  // primitives (centred at c; size w x h x d along x, y, z)
  T3.box = (c, w, h, d, col, o = {}) => {
    const [x, y, z] = c, a = w / 2, b = h / 2, e = d / 2, P = (i, j, k) => [x + i * a, y + j * b, z + k * e];
    const F = [[P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], [P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)], [P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)],
      [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)], [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)], [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)]];
    const names = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    return F.map((pts, i) => ({ pts, col: (o.cols && o.cols[names[i]]) || col, name: names[i], ...o, cols: undefined })).filter(f => !(o.skip || []).includes(f.name));
  };
  // a cylinder along axis 'x' | 'y' | 'z', n sides, with caps
  T3.cyl = (c, r, len, n, col, o = {}) => {
    const ax = o.axis || 'y', out = [], ring = (s) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 + (o.rot || 0), u = Math.cos(a) * r, v = Math.sin(a) * r;
      return ax === 'y' ? [c[0] + u, c[1] + s, c[2] + v] : ax === 'x' ? [c[0] + s, c[1] + u, c[2] + v] : [c[0] + u, c[1] + v, c[2] + s]; });
    const A = ring(-len / 2), B = ring(len / 2);
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; out.push({ pts: ax === 'y' ? [A[j], A[i], B[i], B[j]] : [A[i], A[j], B[j], B[i]], col: o.side || col, ...o }); }   // outward normals
    if (o.caps !== false) { out.push({ pts: ax === 'y' ? B.slice().reverse() : B.slice(), col: o.cap || col, ...o }); out.push({ pts: ax === 'y' ? A.slice() : A.slice().reverse(), col: o.cap || col, ...o }); }
    return out;
  };
  // transform a list of faces by fn(point)
  T3.map = (faces, fn) => faces.map(f => ({ ...f, pts: f.pts.map(fn) }));
  T3.move = (faces, d) => T3.map(faces, p => V.add(p, d));
  // render: light = direction towards the light; amb = ambient; fog = {col, near, far}
  T3.render = (ctx, cam, faces, o = {}) => {
    const L = V.norm(o.light || [-0.4, 0.8, 0.6]), amb = o.amb ?? 0.35, list = [];
    for (const f of faces) {
      if (f.alpha === 0) continue;
      const p0 = f.pts[0], n = V.norm(V.cross(V.sub(f.pts[1], p0), V.sub(f.pts[2], p0)));
      const c = f.pts.reduce((a, p) => V.add(a, p), [0, 0, 0]).map(v => v / f.pts.length), toEye = V.sub(cam.eye, c);
      let facing = V.dot(n, toEye) > 0; if (!facing && !f.ds) continue;
      const pr = f.pts.map(p => T3.project(cam, p)); if (pr.some(q => q[2] <= (o.near ?? 1))) continue;
      const nn = facing ? n : V.mul(n, -1), diff = Math.max(0, V.dot(nn, L)), spec = Math.pow(Math.max(0, V.dot(V.norm(V.add(L, V.norm(toEye))), nn)), o.shine ?? 24) * (f.spec ?? o.spec ?? 0.25);
      const depth = Math.hypot(toEye[0], toEye[1], toEye[2]) + (f.bias || 0);
      list.push({ f, pr, k: f.emit ? 1 : amb + (1 - amb) * diff, spec, depth });
    }
    list.sort((a, b) => b.depth - a.depth);
    for (const it of list) {
      const { f, pr } = it, rgb = parseColor(f.col);
      let k = it.k, r = rgb[0] * k + 255 * it.spec, g = rgb[1] * k + 255 * it.spec, b = rgb[2] * k + 255 * it.spec;
      if (o.fog) { const q = clamp((it.depth - o.fog.near) / (o.fog.far - o.fog.near)), fc = parseColor(o.fog.col); r = lerp(r, fc[0], q); g = lerp(g, fc[1], q); b = lerp(b, fc[2], q); }
      ctx.beginPath(); pr.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath();
      ctx.globalAlpha = f.alpha ?? 1; ctx.fillStyle = `rgb(${Math.min(255, r) | 0},${Math.min(255, g) | 0},${Math.min(255, b) | 0})`; ctx.fill();
      if (f.line || o.line) { ctx.strokeStyle = f.line || o.line; ctx.lineWidth = f.lw ?? o.lw ?? 1.2; ctx.lineJoin = 'round'; ctx.stroke(); }
      else { ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.8; ctx.stroke(); }   // hides hairline gaps between faces
      ctx.globalAlpha = 1;
    }
    return list.length;
  };
  const K = { T3 }, COL = { space: '#03050A', ink: '#EEF2F8', ink2: '#AAB4C4', gold: '#E8B964', sky: '#6FA8FF', dawn: '#FF9A4D' };
  K.COL = COL;
  // world units: the Earth's radius is 64, its centre 68 below the station (an altitude of 400 km, to scale)
  const R = 64, CE = [0, -68, 0];
  K.R = R; K.CE = CE;
  let cv = null, gl = null, prog = null, ok = null; const U = {};
  const VS = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes, uFull, uC;
uniform vec3 uEye, uF, uR, uU, uSun, uCE;
uniform float uK, uRad, uTime, uSpin, uExp, uStars, uHalo;
out vec4 o;
float h31(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vn(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1, 0, 0)), f.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), f.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
float fbm(vec3 p, int n) { float a = .5, s = 0.; for (int i = 0; i < 8; i++) { if (i >= n) break; s += a * vn(p); p = p * 2.03 + 1.7; a *= .5; } return s; }
vec2 sph(vec3 ro, vec3 rd, vec3 c, float r) { vec3 oc = ro - c; float b = dot(oc, rd), h = b * b - dot(oc, oc) + r * r; if (h < 0.) return vec2(-1.); h = sqrt(h); return vec2(-b - h, -b + h); }
mat3 spinY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0, -s, 0, 1, 0, s, 0, c); }
mat3 tiltZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0, -s, c, 0, 0, 0, 1); }
// the atmosphere along a segment: a thin shell; brighter where it is lit, orange at the terminator, and much brighter
// looking towards the sun (forward scattering)
vec3 atmo(vec3 ro, vec3 rd, float t0, float t1, float dk) {
  float Ra = uRad * 1.02, Hs = uRad * .006; vec3 acc = vec3(0.); float L = (t1 - t0) / 12.;
  for (int i = 0; i < 12; i++) { vec3 p = ro + rd * (t0 + L * (float(i) + .5)); vec3 n = p - uCE; float r = length(n); n /= r;
    float d = exp(-(r - uRad) / Hs), mu = dot(n, uSun);
    float lit = smoothstep(-.18, .25, mu), dusk = exp(-pow((mu + .02) / .12, 2.));
    acc += d * L * (vec3(.30, .55, 1.) * lit + vec3(1., .45, .15) * dusk * dk); }
  float ph = 1. + 6. * pow(max(dot(rd, uSun), 0.), 12.);
  return acc * ph * (.9 / Hs) * .05; }
vec3 surface(vec3 p, vec3 rd) {
  vec3 n = normalize(p - uCE), q = spinY(uSpin) * tiltZ(1.05) * n;          // tilted, so the station flies over mid-latitudes, not the pole
  float mu = dot(n, uSun), lit = smoothstep(-.06, .2, mu), lat = abs(q.y);
  vec3 w = q * 2.2 + .35 * vec3(fbm(q * 3. + 1., 4), fbm(q * 3. + 5., 4), fbm(q * 3. + 9., 4));          // warped, so coasts wander
  float e = fbm(w, 6), land = smoothstep(.5, .515, e);
  float dry = smoothstep(.45, .62, fbm(q * 5. + 7., 4)) * (1. - smoothstep(.45, .7, lat));
  vec3 ground = mix(vec3(.06, .11, .05), vec3(.38, .30, .18), dry);
  ground = mix(ground, vec3(.2, .2, .15), smoothstep(.68, .85, lat)) * (.7 + .6 * fbm(q * 16., 4));
  float ice = smoothstep(.93, .97, lat + .08 * fbm(q * 8., 3));
  vec3 ocean = mix(vec3(.004, .018, .055), vec3(.01, .06, .13), smoothstep(.36, .5, e));                // lighter on the shelves
  vec3 col = mix(mix(ocean, ground, land), vec3(.85, .88, .93), ice) * lit;
  col += (1. - land) * (1. - ice) * pow(max(dot(reflect(rd, n), uSun), 0.), 80.) * vec3(1., .85, .6) * 1.5 * lit;   // glint
  vec3 cw = q * vec3(7., 11., 7.) + .8 * vec3(fbm(q * 3. + 3., 3), fbm(q * 3. + 8., 3), fbm(q * 3. + 4., 3)) + vec3(uTime * .006, 0., 0.);   // banded along latitude
  float cl = smoothstep(.6, .82, fbm(cw, 6));
  col = mix(col, vec3(.95, .97, 1.) * (lit * .95 + .008), cl * .85);
  float night = smoothstep(.03, -.12, mu);
  float city = land * (1. - ice) * (1. - cl * .85) * pow(smoothstep(.55, .8, fbm(q * 60., 3)), 2.) * smoothstep(.42, .6, fbm(q * 7. + 2., 3));
  col += city * night * vec3(1., .7, .3) * 3.2;
  return col; }
void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) * uFull / uRes;
  vec3 rd = normalize(uF * uK + uR * (px.x - uC.x) - uU * (px.y - uC.y)), ro = uEye, col = vec3(0.);
  vec2 hp = sph(ro, rd, uCE, uRad), ha = sph(ro, rd, uCE, uRad * 1.02);
  if (hp.x > 0.) { vec3 p = ro + rd * hp.x; col = surface(p, rd); col += atmo(ro, rd, max(ha.x, 0.), hp.x, .3) * vec3(.8, .75, .75); }
  else {
    float sd = dot(rd, uSun);
    col = vec3(smoothstep(.9999, .99996, sd) * 30. + pow(max(sd, 0.), 900.) * 6. + pow(max(sd, 0.), 40.) * .25) * vec3(1., .93, .82);
    vec3 sc = rd * 420.; float st = step(.9975, h31(floor(sc))) * h31(floor(sc) + 3.); col += uStars * st * st * vec3(.8, .88, 1.);
    if (ha.y > 0.) col += atmo(ro, rd, max(ha.x, 0.), ha.y, 1.4);
    float tc = dot(uCE - ro, rd); if (tc > 0.) { vec3 cp = ro + rd * tc; float dm = length(cp - uCE);
      col += vec3(.3, .55, 1.) * exp(-max(dm - uRad, 0.) / (uRad * .02)) * smoothstep(-.35, .4, dot(normalize(cp - uCE), uSun)) * uHalo; } }
  col *= uExp; col = 1. - exp(-col * 1.4); o = vec4(pow(col, vec3(.95)), 1.); }`;
  function init() {
    if (ok !== null) return ok;
    try {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      gl = cv.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false });
      if (!gl) return (ok = false);
      const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uFull', 'uC', 'uEye', 'uF', 'uR', 'uU', 'uSun', 'uCE', 'uK', 'uRad', 'uTime', 'uSpin', 'uExp', 'uStars', 'uHalo']) U[n] = gl.getUniformLocation(prog, n);
      ok = true;
    } catch (e) { console.warn('orbit: WebGL2 unavailable,', e.message); ok = false; }
    return ok;
  }
  K.sunDir = (az, el) => [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)];
  // s = {sun, time, spin, exp, stars, scale}
  K.earth = (ctx, cam, s = {}) => {
    if (!init()) { ctx.fillStyle = COL.space; ctx.fillRect(0, 0, W, H); const c = T3.project(cam, CE); if (c[2] > 0) { const r = R * cam.k / c[2]; const g = ctx.createRadialGradient(c[0], c[1], r * 0.9, c[0], c[1], r * 1.03); g.addColorStop(0, '#0A2440'); g.addColorStop(0.97, '#3D7FD0'); g.addColorStop(1, 'rgba(61,127,208,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r * 1.03, 0, TAU); ctx.fill(); } return; }
    const sc = s.scale ?? 1, rw = Math.round(W * sc), rh = Math.round(H * sc);
    if (cv.width !== rw || cv.height !== rh) { cv.width = rw; cv.height = rh; }
    gl.viewport(0, 0, rw, rh); gl.useProgram(prog);
    gl.uniform2f(U.uRes, rw, rh); gl.uniform2f(U.uFull, W, H); gl.uniform2f(U.uC, cam.cx, cam.cy);
    gl.uniform3fv(U.uEye, cam.eye); gl.uniform3fv(U.uF, cam.f); gl.uniform3fv(U.uR, cam.r); gl.uniform3fv(U.uU, cam.u); gl.uniform1f(U.uK, cam.k);
    gl.uniform3fv(U.uSun, V.norm(s.sun || [0, 0.2, -1])); gl.uniform3fv(U.uCE, CE); gl.uniform1f(U.uRad, R);
    gl.uniform1f(U.uTime, s.time || 0); gl.uniform1f(U.uSpin, s.spin || 0); gl.uniform1f(U.uExp, s.exp ?? 1); gl.uniform1f(U.uStars, s.stars ?? 1); gl.uniform1f(U.uHalo, s.halo ?? 0.35);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cv, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
  };
  // how much of the sun shows past the Earth's limb, seen from the camera (0 hidden, 1 clear)
  K.sunVis = (cam, sun) => { const toC = V.sub(CE, cam.eye), d = Math.hypot(...toC), limb = Math.asin(Math.min(1, R / d)), ang = Math.acos(clamp(V.dot(V.norm(sun), V.mul(toC, 1 / d)), -1, 1));
    return clamp((ang - limb + 0.004) / 0.02); };
  // the lens flare: a starburst at the sun, an anamorphic streak, and ghosts mirrored through the frame's centre
  K.flare = (ctx, cam, sun, a = 1) => {
    if (a <= 0.01) return; const sp = T3.project(cam, V.add(cam.eye, V.mul(V.norm(sun), 1000))); if (sp[2] <= 0) return;
    const [x, y] = sp; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 420 * a); g.addColorStop(0, `rgba(255,236,205,${0.85 * a})`); g.addColorStop(0.15, `rgba(255,190,120,${0.32 * a})`); g.addColorStop(1, 'rgba(255,160,90,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 440, y - 440, 880, 880);
    const sg = ctx.createLinearGradient(x - 1100, 0, x + 1100, 0); sg.addColorStop(0, 'rgba(110,170,255,0)'); sg.addColorStop(0.5, `rgba(170,210,255,${0.7 * a})`); sg.addColorStop(1, 'rgba(110,170,255,0)');
    ctx.fillStyle = sg; ctx.fillRect(x - 1100, y - 3, 2200, 6); ctx.globalAlpha = 0.5; ctx.fillRect(x - 700, y - 12, 1400, 24); ctx.globalAlpha = 1;
    for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI + 0.13, l = (i % 2 ? 150 : 260) * a; ctx.strokeStyle = `rgba(255,230,200,${0.22 * a})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - Math.cos(an) * l, y - Math.sin(an) * l); ctx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); ctx.stroke(); }
    const cx = W / 2, cy = H / 2, G = [[0.45, 34, '120,200,255', 0.12], [0.8, 70, '255,170,90', 0.08], [1.25, 22, '160,255,200', 0.14], [1.6, 120, '120,140,255', 0.06], [1.95, 44, '255,120,160', 0.08]];
    for (const [k, r, c, al] of G) { const gx = x + (cx - x) * k, gy = y + (cy - y) * k, gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); gg.addColorStop(0, `rgba(${c},${al * a})`); gg.addColorStop(0.8, `rgba(${c},${al * a * 0.6})`); gg.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gx, gy, r, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  // the station: a spine along z, a turning ring on four spokes, four solar wings, radiators; centred at c
  K.station = (spin = 0, c = [0, 0, 0], yaw = 0, pitch = 0) => {
    const F = [], hull = '#B9BEC6', dark = '#3A3F48', panel = '#1F3358', gold = '#B8893A';
    F.push(...T3.cyl([0, 0, 0], 0.13, 2.6, 16, hull, { axis: 'z', cap: dark, spec: 0.5 }));
    F.push(...T3.cyl([0, 0, 1.0], 0.22, 0.5, 16, hull, { axis: 'z', cap: dark, spec: 0.5 }));
    F.push(...T3.cyl([0, 0, -0.9], 0.2, 0.36, 16, gold, { axis: 'z', cap: dark, spec: 0.6 }));
    const ring = [];
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; ring.push(...T3.map(T3.box([0, 0, 0], 0.235, 0.13, 0.17, hull, { spec: 0.4 }), p => V.add(T3.rz(p, a + Math.PI / 2), [Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0]))); }
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.4; ring.push(...T3.map(T3.box([0.5, 0, 0], 0.8, 0.04, 0.04, dark), p => T3.rz(p, a))); }
    F.push(...T3.map(ring, p => T3.rz(p, spin)));
    for (const sx of [-1, 1]) for (const sz of [-0.55, 0.3]) {
      F.push(...T3.box([sx * 1.05, 0, sz], 1.6, 0.015, 0.42, panel, { spec: 0.9, ds: true, line: 'rgba(200,170,90,0.55)', lw: 1 }));
      F.push(...T3.box([sx * 0.2, 0, sz], 0.4, 0.03, 0.03, dark)); }
    F.push(...T3.box([0, 0.5, -0.2], 0.05, 0.8, 0.35, '#E8EBEF', { spec: 0.3, ds: true }));
    return T3.map(F, p => V.add(T3.ry(T3.rx(p, pitch), yaw), c));
  };
  K.drawStation = (ctx, cam, faces, sun, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; T3.render(ctx, cam, faces, { light: sun, amb: 0.2, spec: 0.5, shine: 30, near: 0.05 }); ctx.restore(); };
  // the scope bars (2.39:1) and the cards
  K.BAR = Math.round((H - W / 2.39) / 2);
  K.bars = (ctx, k = 1) => { ctx.fillStyle = '#000'; const h = K.BAR * k; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); };
  K.f = (size, w = 600, fam = FAM.serif) => `${w} ${size}px ${fam}`;
  // a trailer card: fades in, holds, fades out; letter-spaced, centred
  K.card = (ctx, s, x, y, size, lt, o = {}) => {
    const fi = clamp((lt - (o.at ?? 0)) / (o.fin ?? 0.8)), fo = o.out != null ? 1 - clamp((lt - o.out) / 0.6) : 1, a = Ease.ioSine(fi) * fo; if (a <= 0) return;
    ctx.save(); ctx.font = K.f(size, o.w ?? 600, o.fam || FAM.serif); ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = (o.track ?? size * 0.12) + 'px';
    ctx.globalAlpha *= a; ctx.fillStyle = o.color || COL.ink; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; ctx.fillText(s, x + (o.drift ?? 0) * lt, y); ctx.restore();
  };
  window.ORBIT = K;
})();

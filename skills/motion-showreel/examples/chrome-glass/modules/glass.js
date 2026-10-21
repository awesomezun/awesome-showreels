// glass: the 글래스 노트 reel's kit (a project module). One WebGL2 raymarcher draws the bottle: thick glass that bends
// whatever the scene has drawn behind it (the 2D layer is uploaded as a texture and read through the refracted rays,
// one IOR per colour channel), champagne liquid inside, a chrome cap, a soft reflection on the floor. The result is
// composited over the 2D scene; chrome lettering is 2D. Without WebGL2 the bottle falls back to a flat 2D drawing.
(() => {
  const K = {}, COL = { bg: '#090B11', bg2: '#121620', ink: '#F4F6FA', ink2: '#C3CAD6', silver: '#C9D1DC', lilac: '#B9A7FF', aqua: '#8FE3E8', liquid: '#E9C98F' };
  K.COL = COL;
  let cv = null, gl = null, prog = null, tex = null, ok = null; const U = {};
  // camera (same convention as tiny3d): eye, target, vertical fov; screen centre cx, cy
  const V = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(...a) || 1; return a.map(v => v / l); } };
  K.camera = (eye, target, fov = 0.5, o = {}) => { const f = V.norm(V.sub(target, eye)), r = V.norm(V.cross(f, [0, 1, 0])), u = V.cross(r, f);
    return { eye, f, r, u, k: (H / 2) / Math.tan(fov / 2), cx: o.cx ?? W / 2, cy: o.cy ?? H / 2 }; };
  K.orbit = (yaw, pitch, dist, target = [0, 0.5, 0], fov = 0.5, o = {}) => K.camera([target[0] + dist * Math.sin(yaw) * Math.cos(pitch), target[1] + dist * Math.sin(pitch), target[2] + dist * Math.cos(yaw) * Math.cos(pitch)], target, fov, o);
  K.project = (cam, p) => { const d = V.sub(p, cam.eye), z = V.dot(d, cam.f); return [cam.cx + V.dot(d, cam.r) * cam.k / z, cam.cy - V.dot(d, cam.u) * cam.k / z, z]; };

  // ───────── the raymarcher ─────────
  const VS = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes, uFull, uC;
uniform vec3 uEye, uF, uR, uU, uTint;
uniform float uK, uRot, uCapY, uLevel, uSlosh, uTime, uLight, uBackZ, uFloor, uShow;
uniform sampler2D uBack;
out vec4 o;
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdRB(vec3 p, vec3 b, float r) { vec3 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.) - r; }
float sdCyl(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.) + length(max(d, 0.)); }
vec3 loc(vec3 p) { p.xz = rot(uRot) * p.xz; return p; }
float sdGlass(vec3 p) { p = loc(p);
  float body = sdRB(p - vec3(0., .40, 0.), vec3(.30, .40, .15), .045);
  body -= .028 * clamp(1. - p.x * p.x / .09, 0., 1.);                 // front and back bow out a little: a lens
  body = max(body, (abs(p.x) * .8 + abs(p.z) * .6) - .318);          // bevelled vertical edges
  float neck = sdCyl(p - vec3(0., .84, 0.), .055, .05);
  return min(body, neck); }
float sdInner(vec3 p) { p = loc(p); return sdRB(p - vec3(0., .45, 0.), vec3(.235, .31, .085), .04); }
float levAt(vec3 q) { return uLevel + uSlosh * (q.x * cos(uTime * 1.7) * .5 + .012 * sin(q.x * 16. + uTime * 3.)); }
float sdLiquid(vec3 p) { vec3 q = loc(p); return max(sdInner(p), q.y - levAt(q)); }
float sdCap(vec3 p) { p = loc(p); p.y -= .89 + .105 + uCapY;
  float c = sdCyl(p, .118, .105) - .008;                            // a round chrome cap, softened edges
  c = max(c, -(abs(p.y + .072) - .005));                            // a fine groove near the base
  c = max(c, -(abs(p.y - .06) - .003));                             // and one near the top
  return c; }
vec3 nG(vec3 p) { vec2 e = vec2(.0007, 0.); return normalize(vec3(sdGlass(p + e.xyy) - sdGlass(p - e.xyy), sdGlass(p + e.yxy) - sdGlass(p - e.yxy), sdGlass(p + e.yyx) - sdGlass(p - e.yyx))); }
vec3 nC(vec3 p) { vec2 e = vec2(.0007, 0.); return normalize(vec3(sdCap(p + e.xyy) - sdCap(p - e.xyy), sdCap(p + e.yxy) - sdCap(p - e.yxy), sdCap(p + e.yyx) - sdCap(p - e.yyx))); }
// the studio as seen in reflections from point q: a dark room with a soft horizon, and softboxes that are real
// rectangles in it (a front strip that sweeps with uLight, two side strips, a ceiling panel)
float rectZ(vec3 q, vec3 d, float z, vec4 r) { if (abs(d.z) < 1e-4) return 0.; float t = (z - q.z) / d.z; if (t < 0.) return 0.; vec3 h = q + d * t;
  return smoothstep(r.y, r.y * .6, abs(h.x - r.x)) * smoothstep(r.w, r.w * .9, abs(h.y - r.z)); }
float rectX(vec3 q, vec3 d, float x, vec4 r) { if (abs(d.x) < 1e-4) return 0.; float t = (x - q.x) / d.x; if (t < 0.) return 0.; vec3 h = q + d * t;
  return smoothstep(r.y, r.y * .6, abs(h.z - r.x)) * smoothstep(r.w, r.w * .9, abs(h.y - r.z)); }
float rectY(vec3 q, vec3 d, float y, vec4 r) { if (abs(d.y) < 1e-4) return 0.; float t = (y - q.y) / d.y; if (t < 0.) return 0.; vec3 h = q + d * t;
  return smoothstep(r.y, r.y * .7, abs(h.x - r.x)) * smoothstep(r.w, r.w * .7, abs(h.z - r.z)); }
vec3 envAt(vec3 q, vec3 d) {
  float el = d.y, az = atan(d.x, d.z);
  vec3 c = el > 0. ? mix(vec3(.05, .06, .08), vec3(.012, .015, .022), smoothstep(0., .8, el)) : vec3(.01, .011, .014) + vec3(.03, .035, .045) * exp(el * 14.);
  c += vec3(.55, .6, .7) * exp(-abs(el) * 40.) * .5;                      // the horizon
  c += vec3(1.) * 2.4 * rectZ(q, d, 4., vec4(uLight * 2.2, .35, 1.2, 1.6));
  c += vec3(1.) * 1.5 * rectX(q, d, -3., vec4(.6, .45, 1.2, 1.4));
  c += vec3(.95, .97, 1.) * 1.2 * rectX(q, d, 3., vec4(-.4, .3, 1.1, 1.3));
  c += vec3(1.) * 1.0 * rectY(q, d, 4., vec4(0., 1.2, 0., .6));
  vec3 iri = .5 + .5 * cos(6.2831 * (vec3(0., .33, .67) + az * .3 + el * 1.4 + uTime * .04));
  c += iri * .07 * exp(-abs(el - .1) * 6.);
  return c; }
vec3 env(vec3 d) { return envAt(vec3(0., .5, 0.), d); }
// what lies behind: the 2D layer on a plane at z = uBackZ, read where the ray meets it
vec3 back(vec3 q, vec3 d) {
  if (d.z < -.02) { float t = (uBackZ - q.z) / d.z; vec3 P = q + d * t; vec3 v = P - uEye; float z = dot(v, uF);
    if (z > .05) { vec2 s = vec2(uC.x + dot(v, uR) * uK / z, uC.y - dot(v, uU) * uK / z) / uFull; return texture(uBack, s).rgb; } }
  return env(d) * .6; }
float fres(vec3 rd, vec3 n) { return .04 + .96 * pow(1. - max(dot(-rd, n), 0.), 5.); }
vec3 glass(vec3 p, vec3 rd, bool full) {
  vec3 n = nG(p); float F = fres(rd, n); vec3 refl = envAt(p, reflect(rd, n));
  vec3 d1 = refract(rd, n, 1. / 1.5); vec3 q = p - n * .002;
  float tt = 0., liq = 0., edge = 0., surf = 0.;
  for (int i = 0; i < 56; i++) { vec3 x = q + d1 * tt; float d = -sdGlass(x), st = clamp(d, .004, .03), si = sdInner(x);
    if (sdLiquid(x) < 0.) liq += st; edge += exp(-abs(si) * 220.) * st;
    if (si < 0.) { vec3 lq = loc(x); surf += exp(-abs(lq.y - levAt(lq)) * 260.) * st; }
    if (d < .0012) break; tt += st; }
  vec3 x = q + d1 * tt, n2 = -nG(x), col;
  for (int c = 0; c < 3; c++) { float ior = 1.5 + float(c - 1) * .025; vec3 d2 = refract(d1, n2, ior); if (dot(d2, d2) < .01) d2 = reflect(d1, n2);
    vec3 b = full ? back(x, d2) : env(d2) * .6; col[c] = b[c]; }
  col *= mix(vec3(1.), uTint, 1. - exp(-liq * 9.));
  col += surf * vec3(1., .93, .78) * 2.2 + uTint * (1. - exp(-liq * 5.)) * .22;   // the surface line, and a little light held in the liquid
  col += edge * vec3(.85, .92, 1.) * .9;
  col *= .92;
  return mix(col, refl, F) + refl * .05; }
vec3 chrome(vec3 p, vec3 rd) { vec3 n = nC(p), r = reflect(rd, n); float F = fres(rd, n);
  return envAt(p, r) * mix(vec3(.85, .88, .93), vec3(1.), F) + vec3(.02, .022, .028); }
vec2 march(vec3 ro, vec3 rd, int n, float tmax) { float t = 0.;
  for (int i = 0; i < 128; i++) { if (i >= n) break; vec3 p = ro + rd * t; float g = sdGlass(p), c = sdCap(p), d = min(g, c);
    if (d < .0006) return vec2(t, g < c ? 1. : 2.); t += d * .9; if (t > tmax) break; }
  return vec2(-1., 0.); }
void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) * uFull / uRes;
  vec3 rd = normalize(uF * uK + uR * (px.x - uC.x) - uU * (px.y - uC.y)), ro = uEye;
  vec2 h = march(ro, rd, 120, 14.);
  float tf = rd.y < 0. ? -ro.y / rd.y : 1e9;
  if (h.y > 0. && h.x < tf) { vec3 p = ro + rd * h.x; vec3 c = h.y < 1.5 ? glass(p, rd, true) : chrome(p, rd);
    c = 1. - exp(-c * 1.25); o = vec4(pow(c, vec3(.92)), uShow); return; }
  if (uFloor > 0. && tf < 1e8) { vec3 pf = ro + rd * tf, rr = reflect(rd, vec3(0., 1., 0.));
    vec2 g = march(pf + rr * .002, rr, 64, 3.);
    if (g.y > 0.) { vec3 p = pf + rr * g.x; vec3 c = g.y < 1.5 ? glass(p, rr, false) : chrome(p, rr);
      c = 1. - exp(-c * 1.25); float a = uFloor * .32 * exp(-g.x * 3.5) * smoothstep(9., 2., tf); o = vec4(c, a * uShow); return; } }
  o = vec4(0.); }`;
  function init() {
    if (ok !== null) return ok;
    try {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      gl = cv.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false, alpha: true });
      if (!gl) return (ok = false);
      const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uFull', 'uC', 'uEye', 'uF', 'uR', 'uU', 'uTint', 'uK', 'uRot', 'uCapY', 'uLevel', 'uSlosh', 'uTime', 'uLight', 'uBackZ', 'uFloor', 'uShow', 'uBack']) U[n] = gl.getUniformLocation(prog, n);
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ok = true;
    } catch (e) { console.warn('glass: WebGL2 unavailable,', e.message); ok = false; }
    return ok;
  }
  // s = {rot, capY, level, slosh, time, light, tint, floor, show, backZ}
  K.bottle = (ctx, cam, s = {}) => {
    if (!init()) return fallback(ctx, cam, s);
    const sc = s.scale ?? 1, rw = Math.round(W * sc), rh = Math.round(H * sc);
    if (cv.width !== rw || cv.height !== rh) { cv.width = rw; cv.height = rh; }
    gl.viewport(0, 0, rw, rh); gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas); gl.uniform1i(U.uBack, 0);
    gl.uniform2f(U.uRes, rw, rh); gl.uniform2f(U.uFull, W, H); gl.uniform2f(U.uC, cam.cx, cam.cy);
    gl.uniform3fv(U.uEye, cam.eye); gl.uniform3fv(U.uF, cam.f); gl.uniform3fv(U.uR, cam.r); gl.uniform3fv(U.uU, cam.u); gl.uniform1f(U.uK, cam.k);
    const tint = parseColor(s.tint || COL.liquid).slice(0, 3).map(v => v / 255);
    gl.uniform3f(U.uTint, tint[0], tint[1], tint[2]);
    gl.uniform1f(U.uRot, s.rot || 0); gl.uniform1f(U.uCapY, s.capY || 0); gl.uniform1f(U.uLevel, s.level ?? 0.55); gl.uniform1f(U.uSlosh, s.slosh || 0);
    gl.uniform1f(U.uTime, s.time || 0); gl.uniform1f(U.uLight, s.light ?? 0.4); gl.uniform1f(U.uBackZ, s.backZ ?? -0.9); gl.uniform1f(U.uFloor, s.floor ?? 1); gl.uniform1f(U.uShow, s.show ?? 1);
    gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cv, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
  };
  // a flat bottle for browsers without WebGL2
  function fallback(ctx, cam, s) {
    const a = K.project(cam, [0, 0.82, 0]), b = K.project(cam, [0, 0, 0]), h = b[1] - a[1], w = h * 0.74, x = a[0] - w / 2;
    ctx.save(); ctx.globalAlpha *= s.show ?? 1; const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.2, 'rgba(255,255,255,0.08)'); g.addColorStop(1, 'rgba(255,255,255,0.22)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, a[1], w, h, w * 0.08); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(242,227,198,0.35)'; ctx.fillRect(x + w * 0.1, a[1] + h * (1 - (s.level ?? 0.55) / 0.82), w * 0.8, h * ((s.level ?? 0.55) / 0.82) - h * 0.1);
    const c = K.project(cam, [0, 1.0 + (s.capY || 0), 0]), cw = w * 0.42; ctx.fillStyle = '#C9D1DC'; ctx.fillRect(c[0] - cw / 2, c[1] - cw * 0.45, cw, cw * 0.9); ctx.restore();
  }

  // ───────── the 2D studio and lettering ─────────
  K.studio = (ctx, cam, o = {}) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05070B'); g.addColorStop(0.55, o.mid || '#0F131C'); g.addColorStop(1, '#07090D');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const c = K.project(cam, [0, 0.5, -0.9]), r = 900;
    const rg = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); rg.addColorStop(0, o.glow || 'rgba(150,160,190,0.20)'); rg.addColorStop(1, 'rgba(150,160,190,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  };
  // fine vertical lines on the backdrop behind the bottle: the glass bends them, so its thickness shows
  K.lines = (ctx, cam, a = 1) => { if (a <= 0) return; const c = K.project(cam, [0, 0.45, -0.9]); ctx.save(); ctx.globalAlpha *= a;
    for (let i = -16; i <= 16; i++) { const x = c[0] + i * 26; ctx.fillStyle = `rgba(210,220,240,${0.16 * (1 - Math.abs(i) / 17)})`; ctx.fillRect(x - 1.5, c[1] - 420, 3, 840); }
    ctx.restore(); };
  // a coloured field behind the bottle (the notes scene): a soft vertical panel of colour
  K.field = (ctx, col, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  K.f = (size, w = 700, fam = FAM.display) => `${w} ${size}px ${fam}`;
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size, o.w ?? 700); ctx.fillStyle = o.color || COL.ink; ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.alpha ?? 1;
    if (o.track) ctx.letterSpacing = o.track + 'px'; ctx.fillText(s, x, y); ctx.restore(); };
  // a line that comes up through a soft blur
  K.fade = (ctx, s, x, y, size, lt, o = {}) => { const p = Ease.outC(clamp((lt - (o.at ?? 0)) / (o.dur ?? 0.9))); if (p <= 0) return;
    ctx.save(); ctx.filter = p < 1 ? `blur(${(1 - p) * 10}px)` : 'none'; K.text(ctx, s, x, y + (1 - p) * 24, size, { ...o, alpha: (o.alpha ?? 1) * p }); ctx.restore(); };
  // chrome lettering: an extruded steel edge, a horizon gradient on the face, a sheen that sweeps across
  K.chrome = (ctx, s, x, y, size, o = {}) => {
    const a = o.alpha ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = K.f(size, o.w ?? 800); ctx.textAlign = o.align || 'left';
    if (o.track) ctx.letterSpacing = o.track + 'px';
    const dep = Math.max(2, size * 0.045);
    for (let i = dep; i > 0; i -= 1) { ctx.fillStyle = i > dep * 0.5 ? '#1A1F29' : '#3A4252'; ctx.fillText(s, x + i * 0.35, y + i); }
    const top = y - size * 0.8, g = ctx.createLinearGradient(0, top, 0, y + size * 0.1);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.36, '#C7CFDB'); g.addColorStop(0.5, '#59627A'); g.addColorStop(0.53, '#2A3040'); g.addColorStop(0.6, '#DCE3EE'); g.addColorStop(0.8, '#9AA5B8'); g.addColorStop(1, '#E9EEF6');
    ctx.fillStyle = g; ctx.fillText(s, x, y);
    ctx.lineWidth = Math.max(1, size * 0.012); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.strokeText(s, x, y);
    if (o.sheen != null) { const w = ctx.measureText(s).width, x0 = ctx.textAlign === 'center' ? x - w / 2 : x, sx = x0 - size + (w + size * 2) * o.sheen;
      const sg = ctx.createLinearGradient(sx - size * 0.45, 0, sx + size * 0.45, 0);
      sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.8)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillText(s, x, y); }
    ctx.restore();
  };
  window.GLASS = K;
})();

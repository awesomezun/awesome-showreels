// tok: the 톡톡 스파클링 reel's liquid kit (a project module). Glossy candy liquid as metaballs in a WebGL2 fragment
// shader: every pixel sums the field of up to 40 balls (r² / d², each with its own colour, so merging blobs mix their
// colours by contribution) plus an optional text field (the name drawn once, blurred, used as a soft distance), takes
// its normal from the analytic gradient (steep at the rim, flat inside), and is lit with a soft diffuse, a sharp
// specular highlight, a darker saturated rim and a brighter core; a soft drop shadow is the same field offset.
// Rendered at half size and scaled up; a flat 2D fallback draws circles. Bubbles and sparkles are drawn in 2D on top.
(() => {
  const K = {}, MAXB = 40, SC = 0.5;
  K.COL = { bg: '#FFF4E8', pink: '#FF5C7A', lime: '#6ED04E', grape: '#9B5DE5', candy: '#FF7A93', ink: '#3B2440', white: '#FFFFFF' };
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform int uN; uniform vec4 uB[${MAXB}]; uniform vec3 uC[${MAXB}];
uniform sampler2D uT; uniform float uTK; uniform vec3 uTC; uniform float uS;
out vec4 o;
void field(vec2 p, out float f, out vec2 g, out vec3 col) {
  f = 0.; g = vec2(0.); col = vec3(0.); float wsum = 0.;
  for (int i = 0; i < ${MAXB}; i++) { if (i >= uN) break; vec2 d = p - uB[i].xy; float r2 = uB[i].z * uB[i].z, q = dot(d, d) + 1.;
    float v = r2 / q; f += v; g += -2. * r2 * d / (q * q); float w = v * v; col += uC[i] * w; wsum += w; }
  if (uTK > 0.) { vec2 uv = p / uRes; float t = texture(uT, uv).r, tx = texture(uT, uv + vec2(1.5 / uRes.x, 0.)).r - texture(uT, uv - vec2(1.5 / uRes.x, 0.)).r, ty = texture(uT, uv + vec2(0., 1.5 / uRes.y)).r - texture(uT, uv - vec2(0., 1.5 / uRes.y)).r;
    float v = uTK * t * 2.6; f += v; g += uTK * 2.6 * vec2(tx, ty) / 3.; float w = v * v; col += uTC * w; wsum += w; }
  col /= max(wsum, 1e-5);
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float f; vec2 g; vec3 col; field(p, f, g, col);
  float sf; vec2 sg; vec3 sc; field(p - vec2(10., 16.) * uS, sf, sg, sc);
  float gl = length(g) + 1e-4, aa = clamp((f - 1.) / (gl * 1.2) + .5, 0., 1.);
  float sh = smoothstep(.8, 1.05, sf) * .16 * (1. - aa);
  vec3 n = normalize(vec3(-g * 26. * uS / max(f, .6), 1.));
  vec3 L = normalize(vec3(-.45, -.65, .75));
  float dif = .62 + .38 * dot(n, L), spec = pow(max(dot(reflect(-L, n), vec3(0., 0., 1.)), 0.), 70.), fr = pow(1. - n.z, 1.6);
  vec3 c = col * dif; c = mix(c, col * .72, fr * .55); c = mix(c, col * 1.18 + .08, smoothstep(1.6, 4., f) * .35);
  c += vec3(1.) * spec * .9; c += vec3(1.) * smoothstep(.985, 1., n.z) * smoothstep(1.2, 2.2, f) * .06;
  o = vec4(c * aa, aa + sh) ; if (aa < .01) o = vec4(0., 0., 0., sh);
}`;
  let cv = null, gl = null, prog = null, U = {}, ok = null, tex = null, texKey = '';
  const init = () => {
    if (ok !== null) return ok;
    try {
      cv = document.createElement('canvas'); cv.width = Math.round(W * SC); cv.height = Math.round(H * SC);
      gl = cv.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false, alpha: true }); if (!gl) return (ok = false);
      const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uN', 'uB', 'uC', 'uT', 'uTK', 'uTC', 'uS']) U[n] = gl.getUniformLocation(prog, n);
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      ok = true;
    } catch (e) { console.warn('tok: WebGL2 unavailable,', e.message); ok = false; }
    return ok;
  };
  // the text field: lines [{s, x, y, size}] drawn white and blurred into a texture (once per key)
  const setText = (lines) => {
    const key = JSON.stringify(lines); if (key === texKey) return; texKey = key;
    const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height); g.scale(SC, SC); g.filter = `blur(${6}px)`; g.fillStyle = '#FFF'; g.textAlign = 'center';
    for (const l of lines) { g.font = K.F(l.size); g.fillText(l.s, l.x, l.y); }
    gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  };
  // balls: [{x, y, r, col}] in frame px; o.text = {lines, k 0..1, col}
  K.liquid = (ctx, balls, o = {}) => {
    const bs = balls.filter(b => b.r > 0.5).slice(0, MAXB);
    if (!init()) { for (const b of bs) { ctx.fillStyle = b.col; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); } return; }
    gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(prog);
    const B = new Float32Array(MAXB * 4), Cc = new Float32Array(MAXB * 3);
    bs.forEach((b, i) => { B.set([b.x * SC, b.y * SC, b.r * SC, 0], i * 4); const c = parseColor(b.col); Cc.set([c[0] / 255, c[1] / 255, c[2] / 255], i * 3); });
    gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1i(U.uN, bs.length); gl.uniform4fv(U.uB, B); gl.uniform3fv(U.uC, Cc); gl.uniform1f(U.uS, SC);
    const tk = o.text ? clamp(o.text.k) : 0; gl.uniform1f(U.uTK, tk);
    if (o.text) { setText(o.text.lines); const c = parseColor(o.text.col || K.COL.candy); gl.uniform3f(U.uTC, c[0] / 255, c[1] / 255, c[2] / 255); } else gl.uniform3f(U.uTC, 1, 1, 1);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U.uT, 0);
    gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    ctx.save(); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cv, 0, 0, W, H); ctx.restore();
  };
  // CPU copy of the field, to keep 2D bubbles inside the liquid
  K.fieldAt = (balls, x, y) => balls.reduce((f, b) => f + b.r * b.r / ((x - b.x) ** 2 + (y - b.y) ** 2 + 1), 0);
  K.bubbles = (ctx, balls, lt, n = 40, seed = 1) => {
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) { const b = balls[i % balls.length]; if (!b || b.r < 30) continue; const ph = (lt * (0.35 + 0.3 * hash(i * 3 + seed)) + hash(i * 7 + seed)) % 1;
      const x = b.x + (hash(i * 5 + seed) - 0.5) * b.r * 1.2 + 6 * Math.sin(lt * 4 + i), y = b.y + b.r * 0.8 - ph * b.r * 1.7, r = 3 + 6 * hash(i * 9 + seed);
      if (K.fieldAt(balls, x, y) < 1.6) continue; ctx.globalAlpha = Math.sin(Math.PI * ph); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  };
  K.ground = (ctx) => { ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.fillStyle = 'rgba(255,92,122,0.06)';
    for (let y = 40; y < H; y += 80) for (let x = 40 + ((y / 80) % 2) * 40; x < W; x += 80) { ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display'); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'center'; const sc = o.pop ? 0.6 + 0.4 * Ease.outBack(clamp(a), 2.2) : 1; ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillText(s, 0, 12 * (1 - clamp(a)) * (o.pop ? 0 : 1)); ctx.restore(); };
  // a falling drop: a ball that falls from y0 to y1 by t0..t1 (accelerating), stretched while it falls
  K.drop = (lt, x, y0, y1, t0, t1, r, col) => { const u = (lt - t0) / (t1 - t0); if (u < 0 || u > 1.15) return []; const y = lerp(y0, y1, Math.min(1, u) ** 2);
    return u <= 1 ? [{ x, y, r, col }, { x, y: y - r * 0.9, r: r * 0.7, col }, { x, y: y - r * 1.6, r: r * 0.45, col }] : []; };
  // a splash crown at (x, y) started at t0: droplets thrown up and out on arcs
  K.crown = (lt, x, y, t0, col, n = 7, size = 1) => { const u = lt - t0; if (u < 0 || u > 0.9) return []; const out = [];
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k - (n - 1) / 2) * 0.32, v = 520 * size * (0.8 + 0.3 * hash(k + x)); out.push({ x: x + Math.cos(a) * v * u, y: y + Math.sin(a) * v * u + 900 * u * u, r: (16 + 8 * hash(k * 3 + x)) * size * (1 - u / 0.9), col }); }
    return out; };
  window.TOK = K;
})();

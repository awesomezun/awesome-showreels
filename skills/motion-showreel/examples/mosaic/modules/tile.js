// tile: the 유리 타일 정원 reel's glass-mosaic kit (a project module). A wall of 160 × 90 glass tiles (14,400) drawn by
// one WebGL2 fragment shader: each pixel finds its tile, reads the tile's colour from two small pictures (before and
// after, one texel per tile, quantised to a glass palette) and turns the tile about its vertical axis when the flip
// wave reaches it (a radial or straight front with a little random delay per tile): it narrows, shows its dark edge
// and opens on the other colour. Bevel light, a per-tile tint, a glint band and a few tiles twinkling in place keep the
// glass alive. The pictures are drawn by code at tile resolution. A 2D fallback fills rectangles.
(() => {
  const M = {}, GW = 160, GH = 90, TS = 12, TAU = Math.PI * 2;
  Object.assign(M, { GW, GH, TS });
  M.COL = { ink: '#1E3D7A', line: '#2F6FD0', white: '#F4F1EA', grout: '#C9C4BA', pink: '#EE6F9A' };
  M.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  const PAL = ['#F4F1EA', '#DCD8CF', '#BFE3F5', '#8CCBEA', '#3E8FD0', '#2F6FD0', '#1E3D7A', '#FFE9A6', '#FFD45C', '#F7A8C4', '#EE6F9A', '#E8434F', '#F28C3A', '#9B6BD3',
    '#B6DC8E', '#7DBB63', '#4E9A43', '#2F6B35', '#8A5A36', '#5A3A22', '#2B2B33', '#FFF3F7', '#E9F6F2'].map(c => parseColor(c));
  // ---- the pictures, drawn at one pixel per tile -------------------------------------------------------------------
  const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
  const sky = (g, top = '#8CCBEA', bot = '#E9F6F2', y1 = 60) => { const gr = g.createLinearGradient(0, 0, 0, y1); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, GW, GH); };
  const sun = (g, x, y) => { g.fillStyle = '#FFE9A6'; circ(g, x, y, 11); g.fillStyle = '#FFD45C'; circ(g, x, y, 8); };
  const hills = (g) => { g.fillStyle = '#B6DC8E'; g.beginPath(); g.moveTo(0, 62); for (let x = 0; x <= GW; x += 2) g.lineTo(x, 54 + 4 * Math.sin(x * 0.05) + 3 * Math.sin(x * 0.13 + 1)); g.lineTo(GW, GH); g.lineTo(0, GH); g.fill();
    g.fillStyle = '#7DBB63'; g.fillRect(0, 64, GW, 26); g.fillStyle = '#4E9A43'; for (let i = 0; i < 46; i++) g.fillRect(Math.floor(hash(i) * GW), 66 + Math.floor(hash(i + 5) * 23), 2, 1); };
  const tree = (g, sway = 0) => { g.strokeStyle = '#5A3A22'; g.lineCap = 'round'; g.lineWidth = 4; g.beginPath(); g.moveTo(44, 86); g.quadraticCurveTo(48, 64, 46, 42); g.stroke();
    g.lineWidth = 2; for (const [x, y] of [[30, 30], [62, 28], [38, 20], [56, 40], [24, 42]]) { g.beginPath(); g.moveTo(46, 50); g.lineTo(x + sway * 0.6, y); g.stroke(); }
    const cols = ['#F7A8C4', '#EE6F9A', '#FFF3F7', '#F7A8C4'];
    for (let i = 0; i < 120; i++) { const a = hash(i * 3.1) * TAU, d = Math.sqrt(hash(i * 5.7)), x = 45 + Math.cos(a) * d * 27, y = 31 + Math.sin(a) * d * 19; g.fillStyle = cols[i % 4]; circ(g, x + sway * (1 - y / 60), y, 2.4 + hash(i) * 1.6); } };
  const tulips = (g, lean = 0) => { const heads = ['#E8434F', '#FFD45C', '#9B6BD3', '#EE6F9A', '#F28C3A'];
    for (let k = 0; k < 10; k++) { const x = 84 + k * 7.4, h = 13 + hash(k * 9) * 7, tx = x + lean * (0.6 + 0.4 * hash(k)); g.strokeStyle = '#2F6B35'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, 86); g.quadraticCurveTo(x, 86 - h / 2, tx, 86 - h); g.stroke();
      g.fillStyle = '#4E9A43'; g.beginPath(); g.ellipse(x + 2, 82, 1.5, 4, 0.5, 0, TAU); g.fill(); g.fillStyle = heads[k % 5]; g.beginPath(); g.moveTo(tx - 3, 86 - h - 4); g.lineTo(tx - 1.5, 86 - h - 1); g.lineTo(tx, 86 - h - 4); g.lineTo(tx + 1.5, 86 - h - 1); g.lineTo(tx + 3, 86 - h - 4); g.lineTo(tx + 3, 86 - h + 1); g.quadraticCurveTo(tx, 86 - h + 4, tx - 3, 86 - h + 1); g.fill(); } };
  const fly = (g, x, y, c, open = 1) => { g.fillStyle = c; g.beginPath(); g.ellipse(x - 2, y - 1, 2.6 * open, 2.2, -0.4, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 2, y - 1, 2.6 * open, 2.2, 0.4, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(x - 1.5, y + 2, 1.8 * open, 1.4, 0.3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 1.5, y + 2, 1.8 * open, 1.4, -0.3, 0, TAU); g.fill(); g.fillStyle = '#2B2B33'; g.fillRect(x - 0.5, y - 2, 1, 5); };
  const petals = (g, off) => { g.fillStyle = '#F7A8C4'; for (let i = 0; i < 30; i++) { const x = ((hash(i * 3) * 210 + off) % 210) - 20, y = 6 + hash(i * 7) * 50 + 4 * Math.sin((x + i * 9) * 0.08); g.beginPath(); g.ellipse(x, y, 1.6, 1.0, x * 0.1, 0, TAU); g.fill(); } };
  const garden = (k) => (g) => { sky(g); sun(g, 134, 16); hills(g); petals(g, k * 14); tree(g, [0, 1.5, 0, -1.5][k % 4]); tulips(g, [0, 2, 1, -1][k % 4]);
    fly(g, 100 + k * 3, 30 - (k % 2) * 3, '#F28C3A', [1, 0.4, 1, 0.4][k % 4]); fly(g, 118 - k * 2, 44 + (k % 2) * 2, '#3E8FD0', [0.4, 1, 0.4, 1][k % 4]); };
  // a seed that grows: soil and sky, the plant at x 80
  const plant = (stage) => (g) => { sky(g, '#BFE3F5', '#FFF3F7', 70); if (stage >= 5) sun(g, 132, 18); g.fillStyle = '#8A5A36'; g.fillRect(0, 74, GW, 16); g.fillStyle = '#5A3A22'; for (let i = 0; i < 40; i++) g.fillRect(Math.floor(hash(i + 50) * GW), 76 + Math.floor(hash(i + 70) * 13), 2, 1);
    const top = 74 - [0, 8, 24, 40, 46, 50][stage]; g.strokeStyle = '#4E9A43'; g.lineWidth = stage >= 3 ? 2.6 : 1.8;
    if (stage === 0) { g.fillStyle = '#5A3A22'; g.beginPath(); g.ellipse(80, 72, 3.5, 2.5, 0, 0, TAU); g.fill(); g.fillStyle = '#8A5A36'; g.beginPath(); g.ellipse(80, 74, 9, 3, 0, Math.PI, TAU); g.fill(); return; }
    g.beginPath(); g.moveTo(80, 74); g.quadraticCurveTo(78, (74 + top) / 2, 80, top); g.stroke();
    const leaf = (y, s, side) => { g.fillStyle = '#7DBB63'; g.beginPath(); g.ellipse(80 + side * s * 0.9, y, s, s * 0.42, side * -0.5, 0, TAU); g.fill(); g.strokeStyle = '#4E9A43'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(80, y); g.lineTo(80 + side * s * 1.6, y - side * 0); g.stroke(); };
    if (stage === 1) { leaf(top + 1, 3.5, -1); leaf(top + 1, 3.5, 1); return; }
    leaf(top + (stage === 2 ? 3 : 18), stage === 2 ? 8 : 10, -1); leaf(top + (stage === 2 ? 5 : 20), stage === 2 ? 8 : 10, 1); if (stage >= 3) { leaf(top + 32, 9, 1); leaf(top + 34, 9, -1); }
    if (stage === 3) { g.fillStyle = '#7DBB63'; g.beginPath(); g.ellipse(80, top - 4, 4, 7, 0, 0, TAU); g.fill(); g.fillStyle = '#EE6F9A'; g.beginPath(); g.ellipse(80, top - 8, 2.6, 3.4, 0, 0, TAU); g.fill(); return; }
    const R = stage === 4 ? 9 : 19, cy = top - R * 0.55;
    for (let p = 0; p < 5; p++) { const a = -Math.PI / 2 + p * TAU / 5, rx = 80 + Math.cos(a) * R * 0.62, ry = cy + Math.sin(a) * R * 0.62; g.fillStyle = p % 2 ? '#EE6F9A' : '#F7A8C4'; g.beginPath(); g.ellipse(rx, ry, R * 0.5, R * 0.36, a, 0, TAU); g.fill(); }
    g.fillStyle = '#FFD45C'; circ(g, 80, cy, R * 0.24); if (stage === 5) { fly(g, 108, 22, '#FFD45C', 1); g.fillStyle = '#2B2B33'; g.fillRect(107, 21, 3, 1); } };
  const IMG = {
    wall: (g) => { g.fillStyle = '#F4F1EA'; g.fillRect(0, 0, GW, GH); g.fillStyle = '#1E3D7A'; g.fillRect(0, 58, GW, 1); g.fillStyle = '#2F6FD0'; g.fillRect(0, 59, GW, 5); g.fillStyle = '#1E3D7A'; g.fillRect(0, 64, GW, 1); g.fillStyle = '#DCD8CF'; g.fillRect(0, 84, GW, 6); },
    // the end: one big cherry blossom on the sky, a branch with smaller ones
    bloom: (g) => { sky(g, '#8CCBEA', '#E9F6F2', 90); g.strokeStyle = '#5A3A22'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(160, 6); g.quadraticCurveTo(120, 14, 92, 10); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(132, 10); g.lineTo(118, 26); g.stroke();
      const blossom = (x, y, R, rot) => { for (let p = 0; p < 5; p++) { const a = rot + p * TAU / 5, px = x + Math.cos(a) * R * 0.55, py = y + Math.sin(a) * R * 0.55; g.fillStyle = '#FFF3F7'; g.beginPath(); g.ellipse(px, py, R * 0.52, R * 0.4, a, 0, TAU); g.fill();
        g.fillStyle = '#F7A8C4'; g.beginPath(); g.ellipse(x + Math.cos(a) * R * 0.38, y + Math.sin(a) * R * 0.38, R * 0.3, R * 0.2, a, 0, TAU); g.fill(); g.fillStyle = '#8CCBEA'; circ(g, x + Math.cos(a) * R * 1.02, y + Math.sin(a) * R * 1.02, R * 0.09); }
        g.fillStyle = '#EE6F9A'; circ(g, x, y, R * 0.22); g.fillStyle = '#FFD45C'; for (let s = 0; s < 10; s++) { const a = s * TAU / 10; circ(g, x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3, Math.max(0.8, R * 0.05)); } };
      blossom(114, 52, 34, -0.3); blossom(146, 30, 13, 0.4); blossom(96, 14, 9, 0.1); blossom(150, 74, 10, 1); petals(g, 30); },
    g0: garden(0), g1: garden(1), g2: garden(2), g3: garden(3),
    s0: plant(0), s1: plant(1), s2: plant(2), s3: plant(3), s4: plant(4), s5: plant(5),
  };
  const CAN = new Map();
  M.img = (name) => { if (CAN.has(name)) return CAN.get(name); const b = makeBuf(GW, GH); IMG[name](b.g); const d = b.g.getImageData(0, 0, GW, GH), px = d.data;
    // nearest glass colour after a little noise, so gradients break into mixed tiles instead of bands
    for (let i = 0; i < px.length; i += 4) { const nz = name === 'wall' ? 0 : (hash(i * 0.0731 + 3) - 0.5) * 30; let best = 0, bd = 1e9; for (let k = 0; k < PAL.length; k++) { const c = PAL[k], e = (px[i] + nz - c[0]) ** 2 * 0.8 + (px[i + 1] + nz - c[1]) ** 2 + (px[i + 2] + nz - c[2]) ** 2 * 0.7; if (e < bd) { bd = e; best = k; } }
      px[i] = PAL[best][0]; px[i + 1] = PAL[best][1]; px[i + 2] = PAL[best][2]; px[i + 3] = 255; }
    b.g.putImageData(d, 0, 0); CAN.set(name, { c: b.c, px }); return CAN.get(name); };
  // ---- the wall ----------------------------------------------------------------------------------------------------
  const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float;
uniform vec2 uRes, uGrid, uO, uDir; uniform float uTS, uT, uDur, uJit, uSpd, uMode, uTime, uTw, uDiff; uniform vec3 uGrout;
uniform sampler2D uA, uB;
out vec4 o;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y), g = p / uTS, id = floor(g), f = fract(g) - .5;
  vec3 grout = uGrout * (.93 + .07 * h(id + 3.1));
  float d = uMode < .5 ? length(id - uO) : dot(id - uO, uDir);
  float u = clamp((uT - d / uSpd - h(id) * uJit) / uDur, 0., 1.);
  float tw = fract(uTime * .23 + h(id + 9.7) * 13.), tu = (h(id + 4.2) < uTw) ? clamp(tw / .05, 0., 1.) : 0.;
  vec2 uv = (id + .5) / uGrid; vec3 ca = texture(uA, uv).rgb, cb = texture(uB, uv).rgb;
  if (uDiff > .5 && distance(ca, cb) < .01) u = 0.;
  float th = u * 3.14159265 + tu * 6.2831853, c = cos(th), s = abs(sin(th));
  vec3 col = u < .5 ? ca : cb;
  col *= .9 + .16 * h(id + 7.3);
  float hw = .43 * abs(c) * (1. + .12 * s), hh = .43 * (1. + .12 * s), aa = 1. / uTS;
  float m = smoothstep(hw + aa, hw - aa, abs(f.x)) * smoothstep(hh + aa, hh - aa, abs(f.y));
  vec2 q = vec2(f.x / max(hw, 1e-3), f.y / hh);
  col *= (.92 + .1 * (-q.x * sign(c) - q.y) * .5) * mix(.55, 1., abs(c));
  float bev = smoothstep(.7, 1., max(abs(q.x), abs(q.y)));
  col = mix(col, col * ((q.x * sign(c) + q.y) < 0. ? 1.22 : .72), bev * .55);
  col += smoothstep(.05, 0., abs(fract((p.x * .6 + p.y) / 2600. - uTime * .09) - .5)) * .3 * (1. - bev);
  col += smoothstep(.3, 0., length(q - vec2(-.42 * sign(c), -.42))) * .3 * abs(c);
  o = vec4(mix(grout, min(col, vec3(1.)), m), 1.);
  if (id.x < 0. || id.y < 0. || id.x >= uGrid.x || id.y >= uGrid.y) o = vec4(0.);
}`;
  let cv = null, gl = null, prog = null, U = {}, ok = null, cv2 = null; const TEX = new Map();
  const init = () => {
    if (ok !== null) return ok;
    try {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      gl = cv.getContext('webgl2', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false, alpha: true }); if (!gl) return (ok = false);
      const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ['uRes', 'uGrid', 'uO', 'uDir', 'uTS', 'uT', 'uDur', 'uJit', 'uSpd', 'uMode', 'uTime', 'uTw', 'uDiff', 'uGrout', 'uA', 'uB']) U[n] = gl.getUniformLocation(prog, n);
      ok = true;
    } catch (e) { console.warn('tile: WebGL2 unavailable,', e.message); ok = false; }
    return ok;
  };
  const tex = (name) => { if (TEX.has(name)) return TEX.get(name); const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.NEAREST], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, M.img(name).c); TEX.set(name, t); return t; };
  const WAVE = { o: [80, 45], mode: 0, dir: [1, 0], spd: 120, dur: 0.3, jit: 0.15, diff: false };
  // where a flip wave has got to: the same formula as the shader, for 2D work that follows the wave
  M.flipAt = (st, i, j) => { const w = st.wave, d = w.mode ? (i - w.o[0]) * w.dir[0] + (j - w.o[1]) * w.dir[1] : Math.hypot(i - w.o[0], j - w.o[1]); return clamp((st.t - d / w.spd - hash(i * 0.1 + j * 7.3) * w.jit) / w.dur); };
  // st: {a, b, t, wave, tw, time}; renders the wall and returns the canvas (W × H)
  M.wall = (st) => { const w = Object.assign({}, WAVE, st.wave || {});
    if (init()) {
      gl.viewport(0, 0, W, H); gl.useProgram(prog); const gc = parseColor(M.COL.grout);
      gl.uniform2f(U.uRes, W, H); gl.uniform2f(U.uGrid, GW, GH); gl.uniform1f(U.uTS, TS); gl.uniform2f(U.uO, w.o[0], w.o[1]); gl.uniform2f(U.uDir, w.dir[0], w.dir[1]);
      gl.uniform1f(U.uT, st.t || 0); gl.uniform1f(U.uDur, w.dur); gl.uniform1f(U.uJit, w.jit); gl.uniform1f(U.uSpd, w.spd); gl.uniform1f(U.uMode, w.mode); gl.uniform1f(U.uTime, st.time || 0); gl.uniform1f(U.uTw, st.tw || 0); gl.uniform1f(U.uDiff, w.diff ? 1 : 0);
      gl.uniform3f(U.uGrout, gc[0] / 255, gc[1] / 255, gc[2] / 255);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex(st.a)); gl.uniform1i(U.uA, 0); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex(st.b || st.a)); gl.uniform1i(U.uB, 1);
      gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3); return cv;
    }
    if (!cv2) cv2 = makeBuf(W, H); const g = cv2.g, A = M.img(st.a).px, B = M.img(st.b || st.a).px, s2 = Object.assign({}, st, { wave: w }); g.fillStyle = M.COL.grout; g.fillRect(0, 0, W, H);
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) { const k = (j * GW + i) * 4, same = A[k] === B[k] && A[k + 1] === B[k + 1] && A[k + 2] === B[k + 2], u = w.diff && same ? 0 : M.flipAt(s2, i, j), P = u < 0.5 ? A : B, hw = 5.2 * Math.abs(Math.cos(u * Math.PI));
      g.fillStyle = `rgb(${P[k]},${P[k + 1]},${P[k + 2]})`; g.fillRect(i * TS + 6 - hw, j * TS + 0.8, hw * 2, TS - 1.6); }
    return cv2.c;
  };
  // the wall onto the frame, through a camera {s, x, y} (scale about the centre, then shift)
  M.draw = (ctx, st, cam = {}) => { const c = M.wall(st), s = cam.s || 1; ctx.save(); ctx.translate(W / 2 + (cam.x || 0), H / 2 + (cam.y || 0)); ctx.scale(s, s); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(c, -W / 2, -H / 2, W, H); ctx.restore(); };
  // a run of flips: base picture, then [{at (s), to, wave}] in order -> the state at lt
  M.state = (lt, base, flips, extra = {}) => { let a = base, b = base, t = 0, wave = WAVE;
    for (let i = 0; i < flips.length; i++) { const f = flips[i]; if (lt < f.at) break; a = i ? flips[i - 1].to : base; b = f.to; t = lt - f.at; wave = Object.assign({}, WAVE, f.wave || {}); }
    return Object.assign({ a, b, t, wave }, extra); };
  M.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = M.F(size, o.fam || 'display'); ctx.textAlign = o.align || 'left';
    const yy = y + 12 * (1 - clamp(a)); ctx.lineJoin = 'round'; if (o.halo !== false) { ctx.shadowColor = 'rgba(255,255,255,0.95)'; ctx.shadowBlur = size * 0.3; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = size * 0.07; ctx.strokeText(s, x, yy); ctx.strokeText(s, x, yy); ctx.shadowBlur = 0; }
    ctx.fillStyle = ctx.strokeStyle = o.color || M.COL.ink; if ((o.fam || 'display') === 'display') { ctx.lineWidth = size * 0.035; ctx.strokeText(s, x, yy); } ctx.fillText(s, x, yy); ctx.restore(); };
  // the work's label plate: a white card with a navy rule, sliding up a little as it appears
  M.plaque = (ctx, x, y, w, h, a) => { if (a <= 0) return; const e = clamp(a); ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, 16 * (1 - e)); ctx.fillStyle = 'rgba(20,30,60,0.25)'; rr(ctx, x + 6, y + 8, w, h, 10); ctx.fill();
    ctx.fillStyle = 'rgba(250,248,242,0.95)'; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.fillStyle = M.COL.line; ctx.fillRect(x + 28, y + 26, 6, h - 52); ctx.restore(); };
  // a commuter in silhouette walking along the corridor floor (x, ground y, height, phase, facing)
  M.walker = (ctx, x, y, h, ph, dir, col) => { const sw = Math.sin(ph) * 0.42; ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
    ctx.lineWidth = h * 0.09; for (const s of [1, -1]) { ctx.beginPath(); ctx.moveTo(0, -h * 0.48); ctx.lineTo(Math.sin(sw * s) * h * 0.26, -h * 0.48 + Math.cos(sw * s) * h * 0.48); ctx.stroke(); }
    rr(ctx, -h * 0.11, -h * 0.86, h * 0.22, h * 0.42, h * 0.08); ctx.fill(); ctx.beginPath(); ctx.arc(0, -h * 0.94, h * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = h * 0.06; for (const s of [1, -1]) { ctx.beginPath(); ctx.moveTo(0, -h * 0.8); ctx.lineTo(-Math.sin(sw * s) * h * 0.2, -h * 0.52); ctx.stroke(); } ctx.restore(); };
  window.TILE = M;
})();

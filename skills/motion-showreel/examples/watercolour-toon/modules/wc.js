// wc: the 비 오는 날의 밤톨이 reel's watercolour picture-book kit (a project module). Washes are wobbly closed shapes
// laid in two uneven layers with a darker pigment edge and paper granulation multiplied inside; lines are a brown brush
// pen whose shapes boil slightly on twos; a paper sheet (cached) sits under everything and its grain is multiplied over
// the finished frame. Characters act from keyframes (W.act): poses ease between beats, with breathing, blinking and a
// walk cycle added on top. Hi Melody for the lines, Gowun Dodum for the small print.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { paper: '#FBF6EC', ink: '#4A3426', hog: '#8B5A3C', hogD: '#5E3A24', cream: '#F3DFC1', leaf: '#6BA34A', leafD: '#3E7D3A', sky: '#9FB7C9', rain: '#7E9DB5',
    bun: '#ECE8F0', bunD: '#B8B0C8', pink: '#F2A0AE', ground: '#A9C77A', water: '#8FB3CF' };
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  K.S = 1.3;                                            // characters and the leaf, relative to their drawn size
  K.q = (t) => Math.floor(t * 12) / 12;
  const boil = (t) => Math.floor(t * 12) % 3;
  // ---- paper and grain -------------------------------------------------------------------------------------------
  let paper = null, grain = null, grainPat = null, tmp = null;
  const rng = (s) => () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const papers = () => { if (paper) return; paper = makeBuf(W, H); const g = paper.g, r = rng(11); g.fillStyle = K.COL.paper; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, rad = 120 + r() * 380, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(${r() < 0.5 ? '210,190,160' : '255,255,250'},0.12)`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H, a = r() * TAU, l = 6 + r() * 26; g.strokeStyle = 'rgba(150,130,100,0.08)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    grain = makeBuf(256, 256); const gg = grain.g, d = gg.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = 200 + r() * 55 - (r() < 0.06 ? 50 : 0); d.data[i] = v; d.data[i + 1] = v - 4; d.data[i + 2] = v - 10; d.data[i + 3] = 255; } gg.putImageData(d, 0, 0);
    tmp = makeBuf(W, H); };
  K.paper = (ctx) => { papers(); ctx.drawImage(paper.c, 0, 0); };
  // the paper's tooth over the finished frame
  K.finish = (ctx) => { papers(); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.28; ctx.fillStyle = ctx.createPattern(grain.c, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); };
  const pat = (ctx) => { papers(); return ctx.createPattern(grain.c, 'repeat'); };
  // ---- shapes, washes and lines -----------------------------------------------------------------------------------
  // a wobbly ellipse as points; seed fixes the wobble, amp is its size relative to the radius
  K.wob = (cx, cy, rx, ry, seed, amp = 0.06, n = 40, rot = 0) => { const out = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, w = 1 + amp * (Math.sin(a * 2 + seed * 1.7) * 0.6 + Math.sin(a * 5 + seed * 3.1) * 0.4 + Math.sin(a * 9 + seed) * 0.2);
    const x = Math.cos(a) * rx * w, y = Math.sin(a) * ry * w; out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return out; };
  const smooth = (ctx, p) => { const n = p.length; ctx.beginPath(); ctx.moveTo((p[0][0] + p[n - 1][0]) / 2, (p[0][1] + p[n - 1][1]) / 2); for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } ctx.closePath(); };
  K.smooth = smooth;
  K.wash = (ctx, pts, col, o = {}) => { const a = o.a ?? 0.6; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    ctx.save(); smooth(ctx, pts); ctx.fillStyle = rgba(col, a); ctx.fill(); ctx.translate(o.dx ?? 3, o.dy ?? 4); smooth(ctx, pts); ctx.fillStyle = rgba(col, a * 0.3); ctx.fill(); ctx.restore();
    ctx.save(); smooth(ctx, pts); ctx.strokeStyle = rgba(mix(col, '#2A1A10', 0.3), Math.min(1, a * 0.75)); ctx.lineWidth = o.edge ?? 3.5; ctx.stroke();
    if (o.grain !== false) { ctx.clip(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.5; ctx.fillStyle = pat(ctx); ctx.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8); }
    if (o.light) { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 0.35; const g = ctx.createRadialGradient(x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.3, 2, x0 + (x1 - x0) * 0.35, y0 + (y1 - y0) * 0.3, (x1 - x0) * 0.5);
      g.addColorStop(0, 'rgba(255,255,250,0.9)'); g.addColorStop(1, 'rgba(255,255,250,0)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    ctx.restore(); };
  // a brush-pen line through points (open), slightly thicker in the middle
  K.line = (ctx, pts, w = 4, col = K.COL.ink, a = 0.85) => { ctx.save(); ctx.strokeStyle = rgba(col, a); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < pts.length - 1; i++) { const u = i / Math.max(1, pts.length - 2); ctx.lineWidth = w * (0.55 + 0.6 * Math.sin(Math.PI * u)); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); } ctx.restore(); };
  K.outline = (ctx, pts, w = 3.5, a = 0.75) => { ctx.save(); smooth(ctx, pts); ctx.strokeStyle = rgba(K.COL.ink, a); ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); };
  // a wash or picture revealed by a soft circle that grows: wet paint blooming from a point
  K.bloom = (ctx, draw, cx, cy, r, soft = 120) => { if (r <= 0) return; papers(); const g = tmp.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); draw(g);
    g.globalCompositeOperation = 'destination-in'; const m = g.createRadialGradient(cx, cy, Math.max(0, r - soft), cx, cy, r); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over'; ctx.drawImage(tmp.c, 0, 0); };
  // ---- the scene: sky, hills, a far tree line and the ground, all washes (cached per weather) --------------------------
  const land = new Map();
  // a band across the page: a wavy top edge from top(x), down to y1, as dense points so smoothing keeps its corners
  const band = (top, y1, seed) => { const out = []; for (let x = -60; x <= W + 60; x += 40) out.push([x, top(x) + 6 * Math.sin(x * 0.05 + seed)]); out.push([W + 60, y1], [W / 2, y1 + 4], [-60, y1]); return out; };
  K.land = (ctx, weather = 'rain') => { if (!land.has(weather)) { papers(); const b = makeBuf(W, H), g = b.g; g.drawImage(paper.c, 0, 0); const wet = weather === 'rain';
      const skyP = []; for (let x = -60; x <= W + 60; x += 40) skyP.push([x, -60]); for (let x = W + 60; x >= -60; x -= 40) skyP.push([x, 610 + 14 * Math.sin(x * 0.01)]);
      K.wash(g, skyP, wet ? '#A3B6C6' : '#BCD6E8', { a: wet ? 0.6 : 0.5, edge: 1.5 });
      if (wet) for (let i = 0; i < 7; i++) K.wash(g, K.wob(60 + i * 310, 110 + 60 * (i % 2), 280, 100, i + 3, 0.14), '#8399AE', { a: 0.3, edge: 1.5 });
      else for (let i = 0; i < 3; i++) K.wash(g, K.wob(300 + i * 640, 140 + 40 * (i % 2), 200, 60, i + 3, 0.12), '#FFFFFF', { a: 0.5, edge: 1, grain: false });
      K.wash(g, band((x) => 560 - 40 * Math.sin(x / 300) - 20 * Math.sin(x / 110), 800, 1), wet ? '#93B48C' : '#A2C989', { a: 0.6 });
      for (let i = 0; i < 10; i++) K.wash(g, K.wob(60 + i * 210, 600 - 30 * Math.sin(i * 1.3), 120, 84, i + 20, 0.16), i % 2 ? '#6E9A62' : '#7FAA6C', { a: 0.5 });
      K.wash(g, band((x) => 706 + 16 * Math.sin(x / 260), H + 60, 2), wet ? '#A3C07A' : '#B2CF84', { a: 0.68 });
      K.wash(g, band((x) => 880 + 30 * Math.sin(x / 400 + 1), H + 60, 3), wet ? '#97B66E' : '#A6C878', { a: 0.35, edge: 2 });
      for (let i = 0; i < 70; i++) { const x = hash(i * 3) * W, y = 740 + hash(i * 7) * 320; K.line(g, [[x, y], [x + 4, y - 18], [x + 8, y - 26]], 3, '#5E8A45', 0.5); }
      land.set(weather, b.c); }
    ctx.drawImage(land.get(weather), 0, 0); };
  K.puddle = (ctx, x, y, rx, t, seed, rings = true) => { K.wash(ctx, K.wob(x, y, rx, rx * 0.22, seed, 0.08), K.COL.water, { a: 0.55, edge: 2.5 });
    if (rings) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2.5; for (let k = 0; k < 3; k++) { const ph = (t * 0.9 + hash(seed + k) ) % 1, cx = x + (hash(seed * 3 + k) - 0.5) * rx, r = ph * rx * 0.35; ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(cx, y, r, r * 0.25, 0, 0, TAU); ctx.stroke(); } ctx.restore(); } };
  // rain: wobbly streaks; k is its strength 0..1
  K.rain = (ctx, t, k = 1, wind = 60) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = rgba('#5F7F9C', 0.7 * k); ctx.lineCap = 'round'; const n = Math.round(190 * k);
    for (let i = 0; i < n; i++) { const sp = 900 + 300 * hash(i * 3), y = ((hash(i * 7) * (H + 300) + t * sp) % (H + 300)) - 150, x = ((hash(i) * (W + 200) + t * wind) % (W + 200)) - 100 + (y / H) * 40, l = 30 + 30 * hash(i * 5);
      ctx.lineWidth = 2.5 + 2 * hash(i * 9); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l * wind / sp, y + l); ctx.stroke(); } ctx.restore(); };
  // ---- acting: keyframes [{b (beat), ...pose}] -> pose at beat b (eased); each key inherits what it leaves out ------
  K.act = (keys, b) => { const full = []; let cur = {}; for (const k of keys) { cur = Object.assign({}, cur, k); full.push(cur); }
    if (b <= full[0].b) return Object.assign({}, full[0]); const last = full[full.length - 1]; if (b >= last.b) return Object.assign({}, last);
    let i = 0; while (full[i + 1].b <= b) i++; const k0 = full[i], k1 = full[i + 1], u0 = (b - k0.b) / (k1.b - k0.b), u = k1.e === 'back' ? Ease.outBack ? Ease.outBack(u0) : 1 + 2.2 * Math.pow(u0 - 1, 3) + 1.2 * Math.pow(u0 - 1, 2) : u0 * u0 * (3 - 2 * u0);
    const out = {}; for (const key of Object.keys(k1)) { const a = k0[key], c = k1[key]; out[key] = typeof c === 'number' && typeof a === 'number' ? a + (c - a) * u : c; } return out; };
  // ---- 밤톨이: a round little hedgehog with a chestnut-burr back, facing right (dir -1 faces left) -------------------------
  K.hog = (ctx, p, t) => { const bo = boil(t), br = Math.sin(t * 3.2) * 0.015, sq = (p.sq || 0) + br, sx = 1 + sq * 0.7, sy = 1 - sq, s = (p.s || 1) * K.S, wk = p.walk || 0, blink = Math.max(p.blink || 0, (t % 3.1) < 0.12 ? 1 : 0);
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale((p.dir || 1) * s, s); ctx.rotate(p.tilt || 0); ctx.scale(sx, sy);
    for (const f of [-1, 1]) { const lift = Math.max(0, Math.sin(wk * Math.PI + (f > 0 ? 0 : Math.PI))) * 16; K.wash(ctx, K.wob(f * 38 + 6, -8 - lift, 30, 14, 7 + f + bo, 0.08), K.COL.hogD, { a: 0.75, edge: 2.5, grain: false }); }
    const body = K.wob(0, -112, 128, 108, 3 + bo * 0.4, 0.04, 44);
    // spikes: short strokes radiating from the back
    for (let i = 0; i < 34; i++) { const a = Math.PI * (0.58 + 1.0 * i / 33), r0 = 104, r1 = 140 + 10 * Math.sin(i * 2.3 + bo), cx = -6, cy = -116; K.line(ctx, [[cx + Math.cos(a) * r0 * 1.15, cy + Math.sin(a) * r0], [cx + Math.cos(a + 0.05) * r1 * 1.15, cy + Math.sin(a + 0.05) * r1]], 9, K.COL.hogD, 0.8); }
    K.wash(ctx, body, K.COL.hog, { a: 0.85, light: true }); K.wash(ctx, K.wob(56, -96, 74, 80, 5 + bo * 0.4, 0.05), K.COL.cream, { a: 0.9 });
    K.wash(ctx, K.wob(112, -112, 44, 30, 8, 0.05, 30, -0.1), K.COL.cream, { a: 0.95, edge: 2.5 }); ctx.fillStyle = '#3B2A20'; ctx.beginPath(); ctx.arc(150, -116, 11, 0, TAU); ctx.fill();
    K.wash(ctx, K.wob(-6, -206, 22, 20, 9, 0.06), K.COL.hog, { a: 0.9, edge: 2.5 });
    const ex = 80 + (p.lookX || 0) * 8, ey = -138 + (p.lookY || 0) * 8; if (blink > 0.5) K.line(ctx, [[ex - 11, ey], [ex, ey + 4], [ex + 11, ey]], 4); else { ctx.fillStyle = '#2A1C14'; ctx.beginPath(); ctx.ellipse(ex, ey, 9, 11, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + 3, ey - 4, 3.2, 0, TAU); ctx.fill(); }
    ctx.fillStyle = rgba(K.COL.pink, 0.55); ctx.beginPath(); ctx.ellipse(84, -100, 15, 9, 0, 0, TAU); ctx.fill();
    const sm = p.smile || 0; if (sm > 0.5) { ctx.fillStyle = '#8A3A3A'; ctx.beginPath(); ctx.moveTo(112, -94); ctx.quadraticCurveTo(122, -76, 134, -94); ctx.closePath(); ctx.fill(); } else K.line(ctx, [[114, -94], [122, -90 + 4 * sm], [130, -95]], 3);
    // arms: the front one can hold the leaf (armF = angle), the back one hangs
    const arm = (x0, y0, ang, col) => { K.line(ctx, [[x0, y0], [x0 + Math.cos(ang) * 24, y0 + Math.sin(ang) * 24], [x0 + Math.cos(ang) * 46, y0 + Math.sin(ang) * 46]], 15, col, 0.95); };
    arm(28, -84, p.armB ?? 1.9, K.COL.hogD); arm(64, -76, p.armF ?? 1.2, K.COL.hog);
    ctx.restore(); };
  // the hand of the front arm in frame coordinates (for the leaf stem)
  K.hogHand = (p) => { const s = (p.s || 1) * K.S, d = p.dir || 1, sq = p.sq || 0, ang = p.armF ?? 1.2, x = 64 + Math.cos(ang) * 46, y = -76 + Math.sin(ang) * 46, tl = p.tilt || 0;
    const xx = x * (1 + sq * 0.7), yy = y * (1 - sq), rx = xx * Math.cos(tl) - yy * Math.sin(tl), ry = xx * Math.sin(tl) + yy * Math.cos(tl); return [p.x + d * s * rx, p.y + s * ry]; };
  // ---- the bunny: round, pale, long ears that droop (ears 1) when wet and stand when happy (ears 0) ----------------------
  K.bun = (ctx, p, t) => { const bo = boil(t), sh = (p.shiver || 0) * Math.sin(K.q(t) * 60) * 4, sq = (p.sq || 0) + Math.sin(t * 3.6 + 1) * 0.015, s = (p.s || 1) * K.S, ears = p.ears || 0, blink = Math.max(p.blink || 0, ((t + 1.3) % 2.7) < 0.12 ? 1 : 0);
    ctx.save(); ctx.translate(p.x + sh, p.y); ctx.scale((p.dir || 1) * s, s); ctx.rotate(p.tilt || 0); ctx.scale(1 + sq * 0.7, 1 - sq);
    for (const f of [-1, 1]) K.wash(ctx, K.wob(f * 36, -8, 34, 14, 4 + f + bo, 0.08), K.COL.bunD, { a: 0.7, edge: 2.5, grain: false });
    K.wash(ctx, K.wob(-92, -60, 26, 24, 6 + bo, 0.08), '#FFFFFF', { a: 0.95, edge: 2.5 });
    K.wash(ctx, K.wob(-8, -82, 96, 80, 2 + bo * 0.4, 0.04), K.COL.bun, { a: 0.95, light: true });
    for (const [ex, ph] of [[18, 0], [48, 0.5]]) { const a = -1.45 + ears * 2.0 + Math.sin(t * 2 + ph) * 0.04 + ph * 0.25, len = 128; ctx.save(); ctx.translate(ex, -200); ctx.rotate(a + Math.PI / 2);
      K.wash(ctx, K.wob(0, -len / 2, 24, len / 2, 11 + ex + bo, 0.05), K.COL.bun, { a: 0.95, edge: 3 }); K.wash(ctx, K.wob(0, -len / 2 + 6, 11, len / 2 - 18, 12 + ex, 0.05), K.COL.pink, { a: 0.55, edge: 1.5, grain: false }); ctx.restore(); }
    K.wash(ctx, K.wob(34, -174, 66, 58, 3 + bo * 0.4, 0.04), K.COL.bun, { a: 0.97, light: true });
    const ex = 58 + (p.lookX || 0) * 7, ey = -184 + (p.lookY || 0) * 7; if (blink > 0.5) K.line(ctx, [[ex - 9, ey], [ex, ey + 4], [ex + 9, ey]], 3.5); else { ctx.fillStyle = '#2A1C24'; ctx.beginPath(); ctx.ellipse(ex, ey, 8, 10, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ex + 3, ey - 4, 3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = K.COL.pink; ctx.beginPath(); ctx.ellipse(96, -168, 8, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(K.COL.pink, 0.5); ctx.beginPath(); ctx.ellipse(66, -150, 13, 8, 0, 0, TAU); ctx.fill();
    const sm = p.smile || 0; K.line(ctx, [[84, -152], [90, -146 + 5 * sm], [98, -153]], 3);
    if ((p.wet || 0) > 0) for (let i = 0; i < 4; i++) { const ph = (t * 1.3 + i * 0.25) % 1; ctx.fillStyle = rgba(K.COL.water, 0.8 * (1 - ph) * p.wet); ctx.beginPath(); ctx.ellipse(-60 + i * 40, -40 + ph * 50, 5, 8, 0, 0, TAU); ctx.fill(); }
    ctx.restore(); };
  // ---- the leaf umbrella: a big heart-shaped leaf on its stem, held at hand [x, y]; tilt leans it ----------------------
  K.leaf = (ctx, hand, t, o = {}) => { const [hx, hy] = hand, top = [hx + (o.lean || 0) * 60 * K.S, hy - (o.len || 230) * K.S], s = (o.s || 1) * K.S, bo = boil(t);
    K.line(ctx, [[hx, hy], [lerp(hx, top[0], 0.5) + 6, lerp(hy, top[1], 0.5)], top], 11, K.COL.leafD, 0.9);
    ctx.save(); ctx.translate(top[0], top[1]); ctx.rotate((o.lean || 0) * 0.25 + Math.sin(t * 1.4) * 0.03); ctx.scale(s, s);
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40, a = Math.PI * (1 + u), r = 220 * (1 - 0.18 * Math.pow(Math.sin(u * Math.PI), 6)) * (1 + 0.04 * Math.sin(u * 23 + bo)); pts.push([Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.55 - 10]); }
    pts.push([200, 20], [60, 30], [0, 60], [-60, 30], [-200, 20]); K.wash(ctx, pts, K.COL.leaf, { a: 0.85, light: true });
    for (let k = -3; k <= 3; k++) K.line(ctx, [[0, 10], [k * 40, -50], [k * 74, -100 + Math.abs(k) * 22]], 3, K.COL.leafD, 0.7);
    ctx.restore(); return top; };
  K.heart = (ctx, x, y, s, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-26, -6, -14, -30, 0, -14); ctx.bezierCurveTo(14, -30, 26, -6, 0, 12); ctx.fillStyle = rgba('#E86A86', 0.8); ctx.fill(); ctx.strokeStyle = rgba('#B04060', 0.6); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
  // hand-lettered line with a little bleed
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display'); ctx.textAlign = o.align || 'left'; const c = o.color || K.COL.ink, yy = y + 10 * (1 - clamp(a));
    ctx.fillStyle = rgba(c, 0.25); ctx.fillText(s, x + 2, yy + 3); ctx.fillStyle = rgba(c, 0.9); ctx.fillText(s, x, yy); ctx.restore(); };
  window.WC = K;
})();

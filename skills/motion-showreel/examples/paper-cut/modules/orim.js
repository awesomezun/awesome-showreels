// orim: the 오림 공방 reel's paper-cut kit (a project module). A square of coloured hanji folded three times into an
// eighth (in half, in half again, then on the diagonal), cut with scissors whose blades open and close along each
// outline (the cut piece falls away), and unfolded again: each fold is a flap reflected across its crease, so what was
// cut through all eight layers comes out as one pattern with the square's symmetry; half shapes cut on a crease open
// into whole ones. Paper carries fibres and lies on a cream sheet with a soft shadow; held to a lamp, the holes glow.
// Type is Song Myung for titles and Gowun Dodum for labels.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { table: '#F1E9DA', red: '#C8372D', indigo: '#2E4677', pink: '#E06C8A', green: '#4E8F5A', ink: '#3A2A22', gold: '#F2B640' };
  K.R = 400;
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  const R = K.R, PAD = 30, SZ = 2 * R + 2 * PAD;
  let tableC = null, fib = null;
  K.table = (ctx) => {
    if (!tableC) { tableC = makeBuf(); const g = tableC.g; g.fillStyle = K.COL.table; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 2600; i++) { const x = hash(i * 1.3) * W, y = hash(i * 2.9) * H, a = hash(i * 4.1) * Math.PI, l = 6 + 28 * hash(i * 7.3); g.strokeStyle = i % 3 ? 'rgba(160,140,110,0.12)' : 'rgba(255,255,255,0.5)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
      const v = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, W * 0.7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(110,80,40,0.18)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }
    ctx.drawImage(tableC.c, 0, 0);
  };
  const fibres = () => { if (!fib) { fib = makeBuf(SZ, SZ); const g = fib.g;
    for (let i = 0; i < 1400; i++) { const x = hash(i * 3.7) * SZ, y = hash(i * 5.3) * SZ, a = hash(i * 1.9) * Math.PI, l = 8 + 30 * hash(i * 2.2); g.strokeStyle = i % 2 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } }
    return fib.c; };

  // ───────── designs: holes in the eighth W0 = {0 <= y <= x <= R} (origin at the centre, y down) ─────────
  const circle = (cx, cy, r, n = 28) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * TAU) * r, cy + Math.sin(i / n * TAU) * r]);
  const tear = (cx, cy, len, w, a, n = 30) => Array.from({ length: n }, (_, i) => { const t = i / n * TAU, x = Math.cos(t) * len / 2, y = Math.sin(t) * w / 2 * (0.55 + 0.45 * Math.cos(t)); return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; });
  const diamond = (cx, cy, r, a = Math.PI / 4) => [0, 1, 2, 3].map(k => [cx + Math.cos(a + k * Math.PI / 2) * r, cy + Math.sin(a + k * Math.PI / 2) * r * (k % 2 ? 0.6 : 1)]);
  const lens = (x0, y0, x1, y1, w, n = 20) => { const out = [], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    for (let i = 0; i <= n; i++) { const u = i / n, b = Math.sin(Math.PI * u) * w / 2; out.push([x0 + dx * u + nx * b, y0 + dy * u + ny * b]); } for (let i = n - 1; i > 0; i--) { const u = i / n, b = Math.sin(Math.PI * u) * w / 2; out.push([x0 + dx * u - nx * b, y0 + dy * u - ny * b]); } return out; };
  const pol = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  const P8 = Math.PI / 8;
  K.DESIGNS = {
    rosette: () => [circle(0, 0, 26), circle(150, 0, 30), tear(...pol(250, P8), 92, 46, P8), diamond(...pol(300, Math.PI / 4), 38), circle(...pol(372, Math.PI / 16), 13), circle(...pol(372, 3 * Math.PI / 16), 13),
      lens(...pol(96, 0.12), ...pol(190, 0.3), 20), lens(...pol(96, 0.66), ...pol(190, 0.48), 20), ...[50, 130, 210, 290, 370].map(y => circle(R, y, 17))],
    snow: () => [circle(0, 0, 40), ...[90, 170, 250, 330].map((r, i) => circle(r, 0, 12 + 4 * (i % 2))), ...[120, 230, 340].map(r => circle(...pol(r, Math.PI / 4), 16)), lens(...pol(60, P8), ...pol(320, P8), 26),
      ...[110, 200, 290].map(r => lens(...pol(r, P8 - 0.25), ...pol(r + 40, P8 + 0.25), 12)), ...[30, 110, 190, 270, 350].map(y => diamond(R, y, 20, 0))],
    plum: () => [circle(0, 0, 20), ...[0, 1, 2].map(k => tear(...pol(120 + k * 110, P8), 70, 52, P8 + Math.PI / 2 * (k % 2))), circle(...pol(210, 0.02), 34), circle(...pol(320, Math.PI / 4 - 0.02), 30),
      lens(...pol(150, 0.3), ...pol(300, 0.5), 16), ...[60, 160, 260, 360].map(y => circle(R, y, 26))],
    wheel: () => [diamond(0, 0, 46, 0), ...[0, 1, 2, 3].map(k => lens(...pol(80 + k * 70, 0.05), ...pol(140 + k * 70, Math.PI / 4 - 0.05), 22)), circle(...pol(350, P8), 24), circle(220, 0, 20),
      ...[40, 120, 200, 280, 360].map(y => tear(R, y, 50, 30, Math.PI))],
  };
  const D4 = [[1, 0, 0, 1], [0, 1, 1, 0], [-1, 0, 0, 1], [0, 1, -1, 0], [1, 0, 0, -1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, -1, -1, 0]];
  const path = (g, pts) => { pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
  // the full unfolded sheet: paper with every hole in all eight positions (cached per design and colour)
  const CACHE = new Map();
  K.sheetBuf = (design, col, holes = true) => {
    const key = `${design}|${col}|${holes}`; if (CACHE.has(key)) return CACHE.get(key);
    const b = makeBuf(SZ, SZ), g = b.g; g.translate(SZ / 2, SZ / 2);
    g.fillStyle = col; g.fillRect(-R, -R, 2 * R, 2 * R); g.globalCompositeOperation = 'source-atop'; g.drawImage(fibres(), -SZ / 2, -SZ / 2);
    if (holes) { g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
      for (const h of K.DESIGNS[design]()) for (const [a, b2, c, d] of D4) { g.beginPath(); path(g, h.map(([x, y]) => [a * x + b2 * y, c * x + d * y])); g.fill(); } }
    CACHE.set(key, b.c); return b.c;
  };
  // the folded eighth while it is being cut: holes done so far are out; returns {canvas}
  let wedgeB = null;
  K.wedgeBuf = (design, col, done) => {
    if (!wedgeB) wedgeB = makeBuf(SZ, SZ); const g = wedgeB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, SZ, SZ); g.translate(SZ / 2, SZ / 2);
    g.fillStyle = col; g.fillRect(-R, -R, 2 * R, 2 * R); g.globalCompositeOperation = 'source-atop'; g.drawImage(fibres(), -SZ / 2, -SZ / 2);
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; K.DESIGNS[design]().forEach((h, i) => { if (done(i) >= 1) { g.beginPath(); path(g, h); g.fill(); } });
    return wedgeB.c;
  };

  // ───────── folding: u = 0 (folded to an eighth) .. 3 (open) ─────────
  const W0 = [[0, 0], [R, 0], [R, R]], W1 = [[0, 0], [R, R], [0, R]], Q = [[0, 0], [R, 0], [R, R], [0, R]], Qf = [[0, 0], [0, R], [-R, R], [-R, 0]],
    HB = [[-R, 0], [R, 0], [R, R], [-R, R]], HT = [[-R, -R], [R, -R], [R, 0], [-R, 0]];
  const region = (g, src, poly, M, back) => { g.save(); if (M) g.transform(...M); g.beginPath(); path(g, poly); g.clip(); g.drawImage(src, -SZ / 2, -SZ / 2);
    if (back) { g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(-R - 5, -R - 5, 2 * R + 10, 2 * R + 10); } g.restore(); };
  const parts = (u) => {        // the static region and the moving flap with its matrix (in sheet coordinates)
    if (u >= 3) return [[HB, null], [HT, null]];
    if (u >= 2) { const c = Math.cos(Math.PI * (3 - u)); return [[HB, null], [HT, [1, 0, 0, c, 0, 0], c < 0]]; }
    if (u >= 1) { const c = Math.cos(Math.PI * (2 - u)); return [[Q, null], [Qf, [c, 0, 0, 1, 0, 0], c < 0]]; }
    const c = Math.cos(Math.PI * (1 - Math.max(0, u))), a = (1 + c) / 2, b = (1 - c) / 2;     // reflect across y = x by c
    return [[W0, null], [W1, [a, b, b, a, 0, 0], c < 0]];
  };
  // draw the sheet at (x, y), scale s, fold state u, from src (a sheet buffer); rot turns the whole sheet
  K.sheet = (ctx, x, y, s, u, src, o = {}) => {
    const P = parts(u);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
    ctx.save(); ctx.translate(10, 16); ctx.filter = 'blur(12px) brightness(0)'; ctx.globalAlpha = 0.28; for (const [poly, M] of P) region(ctx, src, poly, M); ctx.restore();
    for (const [poly, M, back] of P) region(ctx, src, poly, M, back);
    if (u < 3 && u > 0) {     // a soft shadow along the crease under the moving flap
      ctx.save(); ctx.globalAlpha = 0.18 * Math.sin(Math.PI * (u % 1)); ctx.strokeStyle = '#000'; ctx.lineWidth = 24; ctx.filter = 'blur(10px)'; ctx.beginPath();
      if (u >= 2) { ctx.moveTo(-R, 0); ctx.lineTo(R, 0); } else if (u >= 1) { ctx.moveTo(0, 0); ctx.lineTo(0, R); } else { ctx.moveTo(0, 0); ctx.lineTo(R, R); } ctx.stroke(); ctx.restore(); }
    ctx.restore();
  };
  // scissors at (x, y) pointing along a, blades opening with `open` 0..1
  K.scissors = (ctx, x, y, a, open) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); const sp = 0.05 + 0.32 * open;
    for (const sgn of [1, -1]) { ctx.save(); ctx.rotate(sgn * sp);
      ctx.fillStyle = '#B9C0C6'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-150, -9 * sgn); ctx.lineTo(-150, 3 * sgn); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#C8372D'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(-200, 22 * sgn, 34, 22, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(-150, 0, 7, 0, TAU); ctx.fill(); ctx.restore();
  };
  K.HOLES = (design) => K.DESIGNS[design]();
  K.pathOf = path;
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display', o.w ?? 400); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 12 * (1 - clamp(a))); ctx.restore(); };
  window.ORIM = K;
})();

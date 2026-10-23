// bau: the 조형 연구소 여름 학교 reel's constructivist kit (a project module). A cream sheet ruled into 120-pixel
// modules; primary shapes (a circle, a square, a triangle, bars, quarter arcs) that move one module per beat and turn
// about a corner in quarter turns, each step eased and landing exactly on the grid; every ink is printed by multiply
// with a small misregistration, so overlaps darken like overprinted plates; heavy grotesque type that also moves in
// whole modules. Display Gothic A1 Black, text Do Hyeon.
(() => {
  const K = {}, M = 120, TAU = Math.PI * 2;
  K.M = M;
  K.COL = { paper: '#EFE8D8', red: '#D7263D', blue: '#1B4F9C', yellow: '#F2C230', ink: '#161616', grid: 'rgba(22,22,22,0.08)' };
  const C = K.COL;
  K.F = (size, fam = 'display', w = 900) => `${w} ${size}px ${FAM[fam]}`;
  let paperC = null;
  K.paper = (ctx, o = {}) => {
    if (!paperC) { paperC = makeBuf(); const g = paperC.g; g.fillStyle = C.paper; g.fillRect(0, 0, W, H); for (let i = 0; i < 9000; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.25)' : 'rgba(120,100,70,0.06)'; g.fillRect(hash(i * 1.1) * W, hash(i * 2.3) * H, 1 + hash(i) * 2, 1); } }
    ctx.drawImage(paperC.c, 0, 0);
    if (o.grid !== false) { ctx.save(); ctx.globalAlpha = clamp(o.grid ?? 1); ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 0; x <= W; x += M) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = 0; y <= H; y += M) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore(); }
  };
  // a step path: positions in modules [[cx, cy], ...] visited one per beat from t0; returns the eased point at lt
  K.steps = (pts, lt, t0, beat, ease = Ease.ioC) => { const u = (lt - t0) / beat; if (u <= 0) return pts[0]; const k = Math.min(pts.length - 1, Math.floor(u)); if (k >= pts.length - 1) return pts[pts.length - 1];
    const f = ease(clamp((u - k) / 0.55)); return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]; };
  // ink: draw shape(s) in a colour by multiply, misregistered by a few px per colour
  const MIS = { red: [3, -2], blue: [-2, 2], yellow: [2, 3], ink: [0, 0] };
  K.ink = (ctx, col, fn, a = 1) => { if (a <= 0) return; const k = Object.keys(C).find(n => C[n] === col) || 'ink', [dx, dy] = MIS[k] || [0, 0];
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha *= clamp(a); ctx.translate(dx, dy); ctx.fillStyle = col; ctx.beginPath(); fn(ctx); ctx.fill(); ctx.restore(); };
  K.circle = (ctx, cx, cy, r, col, a) => K.ink(ctx, col, g => g.arc(cx, cy, r, 0, TAU), a);
  K.rect = (ctx, x, y, w, h, col, a, rot = 0, px = x, py = y) => K.ink(ctx, col, g => { if (rot) { g.translate(px, py); g.rotate(rot); g.translate(-px, -py); } g.rect(x, y, w, h); }, a);
  K.tri = (ctx, pts, col, a, rot = 0, px = 0, py = 0) => K.ink(ctx, col, g => { if (rot) { g.translate(px, py); g.rotate(rot); g.translate(-px, -py); } pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }, a);
  K.arc = (ctx, cx, cy, r, a0, a1, col, a) => K.ink(ctx, col, g => { g.moveTo(cx, cy); g.arc(cx, cy, r, a0, a1); g.closePath(); }, a);
  // a quarter turn about a pivot on the beat: returns the angle at lt (turns of 90 degrees counted from t0)
  K.turn = (lt, t0, beat, n = 1, every = 1) => { const u = (lt - t0) / (beat * every); if (u <= 0) return 0; const k = Math.min(n, Math.floor(u)), f = k >= n ? 0 : Ease.ioC(clamp((u - k) / 0.5)); return (k + f) * Math.PI / 2; };
  // type that slides in from one module away, letter by letter on a stagger
  K.word = (ctx, s, x, y, size, lt, o = {}) => { ctx.save(); ctx.font = K.F(size, o.fam || 'display', o.w ?? 900); ctx.textAlign = 'left'; let xx = x;
    [...s].forEach((ch, i) => { const u = clamp((lt - i * (o.stagger ?? 0.05)) / 0.3); if (u > 0) { const e = Ease.outQuint(u); ctx.globalAlpha = 1; ctx.fillStyle = o.color || C.ink; ctx.save(); ctx.beginPath(); ctx.rect(xx - 4, y - size, ctx.measureText(ch).width + 8, size * 1.25); ctx.clip(); ctx.fillText(ch, xx, y + (1 - e) * size); ctx.restore(); } xx += ctx.measureText(ch).width; });
    ctx.restore(); return xx - x; };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'sans', o.w ?? 400); ctx.fillStyle = o.color || C.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y); ctx.restore(); };
  window.BAU = K;
})();

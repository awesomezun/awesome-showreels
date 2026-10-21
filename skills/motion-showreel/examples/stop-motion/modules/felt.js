// felt: the 털뭉치 공방 reel's kit (a project module). Stop motion with felt: scenes step their time at 8 frames a second
// and the camera shifts and the exposure flickers a little from frame to frame, as if each frame were shot by hand.
// Felt is a fill dusted with short fibres in lighter and darker shades and a fuzzy edge; stitches are dashed thread
// lines; buttons, a needle with yarn, a cutting mat with a grid, paper tags on string. Handwriting in Gamja Flower.
(() => {
  const K = {}, COL = { mat: '#2F7D5B', mat2: '#3B8E69', grid: 'rgba(220,240,225,0.35)', ink: '#4A3426', thread: '#FFF4E0', bear: '#A8754F', bear2: '#C99A72', pink: '#F2A6B3', cream: '#F6E7CF', rabbit: '#EDE4DA', cat: '#E8A15A', paper: '#FFF8EA' };
  K.COL = COL;
  K.FPS = 8; K.step = (t) => Math.floor(t * K.FPS) / K.FPS; K.frame = (t) => Math.floor(t * K.FPS);
  const shade = (hex, k) => { const c = parseColor(hex); return `rgb(${Math.min(255, c[0] * k) | 0},${Math.min(255, c[1] * k) | 0},${Math.min(255, c[2] * k) | 0})`; };
  // the hand-shot camera: a small shift and turn per frame; call begin/end around a scene
  K.begin = (ctx, t) => { const f = K.frame(t); ctx.save(); ctx.translate(W / 2 + (hash(f * 1.7) - 0.5) * 5, H / 2 + (hash(f * 2.3) - 0.5) * 4); ctx.rotate((hash(f * 3.1) - 0.5) * 0.004); ctx.translate(-W / 2, -H / 2); };
  K.end = (ctx, t) => { ctx.restore(); const f = K.frame(t), e = (hash(f * 5.7) - 0.5) * 0.06; ctx.fillStyle = e > 0 ? `rgba(255,248,230,${e})` : `rgba(30,20,10,${-e})`; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 1.0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,12,4,0.35)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  // a felt fill of a path built by fn(ctx); bbox [x, y, w, h] for the fibres
  K.felt = (ctx, fn, col, bb, o = {}) => { const [x, y, w, h] = bb;
    ctx.save(); ctx.shadowColor = 'rgba(20,30,20,0.35)'; ctx.shadowBlur = o.lift ?? 10; ctx.shadowOffsetY = (o.lift ?? 10) * 0.5; ctx.beginPath(); fn(ctx); ctx.fillStyle = col; ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); fn(ctx); ctx.clip(); ctx.lineWidth = 1.3; const n = Math.min(900, (w * h) / 140);
    for (let i = 0; i < n; i++) { const fx = x + hash(i * 1.37 + x * 0.013) * w, fy = y + hash(i * 2.71 + y * 0.017) * h, a = hash(i * 4.1) * Math.PI, l = 4 + hash(i * 7.7) * 7; ctx.strokeStyle = i % 3 ? shade(col, 1.12) : shade(col, 0.82); ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(a) * l, fy + Math.sin(a) * l); ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.beginPath(); fn(ctx); ctx.strokeStyle = shade(col, 0.88); ctx.lineWidth = 2.5; ctx.setLineDash([2, 3]); ctx.stroke(); ctx.restore();
    if (o.stitch) { ctx.save(); ctx.translate(0, 0); ctx.beginPath(); o.stitch(ctx); ctx.strokeStyle = COL.thread; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.setLineDash(o.dash || [14, 11]); ctx.lineDashOffset = 0; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowOffsetY = 2; ctx.shadowBlur = 2; ctx.stroke(); ctx.restore(); } };
  K.circleFelt = (ctx, x, y, r, col, o = {}) => K.felt(ctx, c => c.arc(x, y, r, 0, TAU), col, [x - r, y - r, 2 * r, 2 * r], { ...o, stitch: o.stitched ? c => c.arc(x, y, r * 0.86, 0, TAU) : null });
  K.ellFelt = (ctx, x, y, rx, ry, col, o = {}) => K.felt(ctx, c => c.ellipse(x, y, rx, ry, o.rot ?? 0, 0, TAU), col, [x - rx, y - ry, 2 * rx, 2 * ry], { ...o, stitch: o.stitched ? c => c.ellipse(x, y, rx - 16, ry - 16, o.rot ?? 0, 0, TAU) : null });
  K.button = (ctx, x, y, r, col = '#6B4A32') => { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = shade(col, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, TAU); ctx.stroke(); ctx.fillStyle = shade(col, 0.5); for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.arc(x + dx * r * 0.25, y + dy * r * 0.25, r * 0.1, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = COL.thread; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r * 0.25, y - r * 0.25); ctx.lineTo(x + r * 0.25, y + r * 0.25); ctx.moveTo(x + r * 0.25, y - r * 0.25); ctx.lineTo(x - r * 0.25, y + r * 0.25); ctx.stroke(); };
  // the doll: kind bear / rabbit / cat; parts appear by p (0..1 per part list); wave = arm angle
  K.doll = (ctx, x, y, s, kind = 'bear', o = {}) => { const col = kind === 'bear' ? COL.bear : kind === 'rabbit' ? COL.rabbit : COL.cat, inner = kind === 'rabbit' ? COL.pink : COL.cream, show = o.show ?? 9;
    if (show > 0) { if (kind === 'rabbit') { K.ellFelt(ctx, x - 45 * s, y - 330 * s, 30 * s, 90 * s, col, { rot: -0.15 }); K.ellFelt(ctx, x + 45 * s, y - 330 * s, 30 * s, 90 * s, col, { rot: 0.15 }); K.ellFelt(ctx, x - 45 * s, y - 330 * s, 14 * s, 60 * s, COL.pink, { rot: -0.15, lift: 2 }); K.ellFelt(ctx, x + 45 * s, y - 330 * s, 14 * s, 60 * s, COL.pink, { rot: 0.15, lift: 2 }); }
      else if (kind === 'cat') { for (const d of [-1, 1]) K.felt(ctx, c => { c.moveTo(x + d * 30 * s, y - 280 * s); c.lineTo(x + d * 95 * s, y - 330 * s); c.lineTo(x + d * 100 * s, y - 240 * s); c.closePath(); }, col, [x - 100 * s, y - 330 * s, 200 * s, 90 * s]); }
      else { K.circleFelt(ctx, x - 80 * s, y - 290 * s, 36 * s, col); K.circleFelt(ctx, x + 80 * s, y - 290 * s, 36 * s, col); K.circleFelt(ctx, x - 80 * s, y - 290 * s, 18 * s, inner, { lift: 2 }); K.circleFelt(ctx, x + 80 * s, y - 290 * s, 18 * s, inner, { lift: 2 }); } }
    if (show > 1) K.ellFelt(ctx, x, y - 90 * s, 105 * s, 110 * s, col, { stitched: true });
    if (show > 2) { const w = o.wave ?? 0; ctx.save(); ctx.translate(x + 95 * s, y - 140 * s); ctx.rotate(-0.4 - w); K.ellFelt(ctx, 30 * s, 0, 45 * s, 26 * s, col); ctx.restore(); ctx.save(); ctx.translate(x - 95 * s, y - 140 * s); ctx.rotate(0.4); K.ellFelt(ctx, -30 * s, 0, 45 * s, 26 * s, col); ctx.restore();
      K.ellFelt(ctx, x - 55 * s, y + 10 * s, 42 * s, 30 * s, col); K.ellFelt(ctx, x + 55 * s, y + 10 * s, 42 * s, 30 * s, col); }
    if (show > 3) K.circleFelt(ctx, x, y - 230 * s, 105 * s, col, { stitched: true });
    if (show > 4) { K.ellFelt(ctx, x, y - 200 * s, 42 * s, 30 * s, inner, { lift: 3 }); ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.ellipse(x, y - 212 * s, 12 * s, 8 * s, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(x, y - 204 * s); ctx.lineTo(x, y - 190 * s); ctx.stroke(); }
    if (show > 5) { K.button(ctx, x - 42 * s, y - 252 * s, 15 * s, '#3A2A20'); K.button(ctx, x + 42 * s, y - 252 * s, 15 * s, '#3A2A20'); }
    if (show > 6) { ctx.fillStyle = 'rgba(240,120,130,0.45)'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + d * 72 * s, y - 210 * s, 16 * s, 10 * s, 0, 0, TAU); ctx.fill(); } }
    if (show > 7) K.button(ctx, x, y - 80 * s, 13 * s, '#D94B4B'); };
  // the cutting mat with its grid and ruler numbers
  K.mat = (ctx, o = {}) => { ctx.fillStyle = '#8A6A4A'; ctx.fillRect(0, 0, W, H); const x0 = o.x0 ?? 60, y0 = o.y0 ?? 50, w = W - 2 * x0, h = H - 2 * y0;
    ctx.fillStyle = COL.mat; ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = COL.grid; ctx.lineWidth = 1.2; for (let x = x0 + 40; x < x0 + w; x += 40) { ctx.lineWidth = ((x - x0) / 40) % 5 === 0 ? 2.2 : 1; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + h); ctx.stroke(); }
    for (let y = y0 + 40; y < y0 + h; y += 40) { ctx.lineWidth = ((y - y0) / 40) % 5 === 0 ? 2.2 : 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(230,245,235,0.6)'; ctx.font = '400 22px sans-serif'; for (let i = 1; i < w / 200; i++) ctx.fillText(String(i * 5), x0 + i * 200 + 4, y0 + 22); };
  // a paper label with a stitched border for lines of handwriting
  K.label = (ctx, x, y, w, h, o = {}) => { ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(o.rot ?? -0.015); ctx.translate(-(x + w / 2), -(y + h / 2)); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5; ctx.fillStyle = o.col || COL.paper;
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; ctx.lineTo(x + u * w, y + (hash(i * 3.3 + x) - 0.5) * 6); } for (let i = 0; i <= 40; i++) { const u = 1 - i / 40; ctx.lineTo(x + u * w, y + h + (hash(i * 5.1 + y) - 0.5) * 6); } ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = o.thread || '#C9776A'; ctx.lineWidth = 3; ctx.setLineDash([12, 9]); ctx.strokeRect(x + 14, y + 14, w - 28, h - 28); ctx.restore(); };
  K.hand = (ctx, s, x, y, size, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `400 ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  // a needle trailing yarn from (ax, ay) to the needle at (x, y)
  K.needle = (ctx, x, y, ang, ax, ay, col = '#E8574F') => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax + 80, ay - 160, x - 140, y - 60, x - Math.cos(ang) * 60, y - Math.sin(ang) * 60); ctx.stroke();
    ctx.translate(x, y); ctx.rotate(ang); const g = ctx.createLinearGradient(-90, 0, 40, 0); g.addColorStop(0, '#9AA3AD'); g.addColorStop(0.5, '#F2F5F8'); g.addColorStop(1, '#8A939D'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-90, -4); ctx.lineTo(30, -2); ctx.lineTo(48, 0); ctx.lineTo(30, 2); ctx.lineTo(-90, 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2F7D5B'; ctx.beginPath(); ctx.ellipse(-78, 0, 7, 2, 0, 0, TAU); ctx.fill(); ctx.restore(); };
  window.FELT = K;
})();

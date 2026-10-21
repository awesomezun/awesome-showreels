// clay: the 말랑베이커리 reel's kit (a project module). Plasticine in 2D: every shape is filled in its colour, lit from
// the top left with a soft highlight and a darker lower edge, dusted with a fine fingerprint speckle, and its outline
// "boils" a little on every new frame because the scenes step their time at 12 frames a second, like stop motion.
// Bread characters with faces, an oven, a scooter, houses, steam. Titles in Jua, small text in Dongle.
(() => {
  const K = {}, COL = { wall: '#FCE9D8', table: '#F2C9A0', crust: '#D9954F', crust2: '#B8732F', inside: '#FFF1D6', ink: '#5A3A2A', coral: '#F28B82', sky: '#9FD3E6', mint: '#A8DDB5', cream: '#FFF6E8', choco: '#7A4A32' };
  K.COL = COL;
  K.step = (t, fps = 12) => Math.floor(t * fps) / fps;          // stop-motion time
  const shade = (hex, k) => { const c = parseColor(hex); return `rgb(${Math.min(255, c[0] * k) | 0},${Math.min(255, c[1] * k) | 0},${Math.min(255, c[2] * k) | 0})`; };
  K.shade = shade;
  let boilSeed = 0; K.boil = (t) => { boilSeed = Math.floor(t * 12); };
  // a closed wobbly path from a function (u in 0..1) -> [x, y]; jittered per stop-motion frame
  const wob = (fn, n, amp, seed) => { const pts = []; for (let i = 0; i < n; i++) { const [x, y] = fn(i / n); const j = amp * (hash(i * 1.7 + seed * 3.1 + boilSeed * 0.37) - 0.5); pts.push([x + j, y + j * 0.8]); } return pts; };
  const path = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => { const [px, py] = pts[(i - 1 + pts.length) % pts.length], mx = (px + x) / 2, my = (py + y) / 2; i ? ctx.quadraticCurveTo(px, py, mx, my) : ctx.moveTo(mx, my); }); const [lx, ly] = pts[pts.length - 1], [fx, fy] = pts[0]; ctx.quadraticCurveTo(lx, ly, (lx + fx) / 2, (ly + fy) / 2); ctx.closePath(); };
  // clay fill of a path: base, a highlight from the top left, a darker rim below, speckle
  K.clayFill = (ctx, pts, col, o = {}) => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), w = x1 - x0, h = y1 - y0;
    ctx.save(); path(ctx, pts); ctx.fillStyle = col; ctx.fill(); ctx.clip();
    const g = ctx.createRadialGradient(x0 + w * 0.3, y0 + h * 0.25, 0, x0 + w * 0.3, y0 + h * 0.25, Math.max(w, h) * 0.9); g.addColorStop(0, 'rgba(255,255,255,0.38)'); g.addColorStop(0.45, 'rgba(255,255,255,0.06)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = g; ctx.fillRect(x0 - 2, y0 - 2, w + 4, h + 4);
    ctx.lineWidth = Math.max(4, Math.min(w, h) * 0.12); ctx.strokeStyle = 'rgba(80,40,20,0.12)'; ctx.stroke();
    if (o.speckle !== false) { const n = Math.min(160, (w * h) / 900); for (let i = 0; i < n; i++) { const sx = x0 + hash(i * 1.3 + x0 * 0.01) * w, sy = y0 + hash(i * 2.9 + y0 * 0.01) * h; ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.18)' : 'rgba(60,30,10,0.10)'; ctx.fillRect(sx, sy, 2.2, 2.2); } }
    ctx.restore(); };
  K.blob = (ctx, fn, col, o = {}) => { const pts = wob(fn, o.n ?? 40, o.amp ?? 2.2, o.seed ?? 1); if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(90,50,30,0.25)'; ctx.shadowBlur = o.sb ?? 18; ctx.shadowOffsetY = o.so ?? 8; path(ctx, pts); ctx.fillStyle = col; ctx.fill(); ctx.restore(); } K.clayFill(ctx, pts, col, o); return pts; };
  K.ell = (ctx, x, y, rx, ry, col, o = {}) => K.blob(ctx, u => [x + Math.cos(u * TAU) * rx, y + Math.sin(u * TAU) * ry], col, o);
  K.rrect = (ctx, x, y, w, h, r, col, o = {}) => K.blob(ctx, u => { const per = 2 * (w + h - 4 * r) + TAU * r; let d = u * per; const seg = [w - 2 * r, Math.PI / 2 * r, h - 2 * r, Math.PI / 2 * r, w - 2 * r, Math.PI / 2 * r, h - 2 * r, Math.PI / 2 * r];
      const fns = [k => [x + r + k, y], k => { const a = -Math.PI / 2 + k / r; return [x + w - r + Math.cos(a) * r, y + r + Math.sin(a) * r]; }, k => [x + w, y + r + k], k => { const a = k / r; return [x + w - r + Math.cos(a) * r, y + h - r + Math.sin(a) * r]; },
        k => [x + w - r - k, y + h], k => { const a = Math.PI / 2 + k / r; return [x + r + Math.cos(a) * r, y + h - r + Math.sin(a) * r]; }, k => [x, y + h - r - k], k => { const a = Math.PI + k / r; return [x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]; }];
      for (let i = 0; i < 8; i++) { if (d <= seg[i] || i === 7) return fns[i](Math.min(d, seg[i])); d -= seg[i]; } }, col, { n: 56, ...o });
  K.shadow = (ctx, x, y, rx, ry, a = 0.25) => { ctx.save(); const g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, `rgba(90,50,30,${a})`); g.addColorStop(1, 'rgba(90,50,30,0)'); ctx.fillStyle = g; ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore(); };
  // a face: two eyes, cheeks, a smile; blink at t
  K.face = (ctx, x, y, s, t, o = {}) => { const blink = (Math.floor(t * 12) % 41) < 2; ctx.save(); ctx.fillStyle = COL.ink;
    for (const dx of [-1, 1]) { if (blink) ctx.fillRect(x + dx * 22 * s - 7 * s, y - 2 * s, 14 * s, 4 * s); else { ctx.beginPath(); ctx.ellipse(x + dx * 22 * s, y, 6.5 * s, 8 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(x + dx * 22 * s - 2 * s, y - 3 * s, 2.2 * s, 0, TAU); ctx.fill(); ctx.fillStyle = COL.ink; } }
    ctx.fillStyle = 'rgba(242,120,110,0.45)'; for (const dx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + dx * 38 * s, y + 14 * s, 9 * s, 5.5 * s, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = COL.ink; ctx.lineWidth = 4 * s; ctx.lineCap = 'round'; ctx.beginPath(); if (o.open) { ctx.fillStyle = '#C0504A'; ctx.ellipse(x, y + 16 * s, 9 * s, 7 * s, 0, 0, TAU); ctx.fill(); } else ctx.arc(x, y + 8 * s, 10 * s, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); ctx.restore(); };
  // a loaf: kind = 'milk' (a tall square loaf), 'salt' (a curled roll), 'red' (a round bun); sq = squash (-1..1)
  K.loaf = (ctx, x, y, s, t, kind = 'milk', o = {}) => { const sq = o.sq ?? 0, sx = s * (1 + 0.18 * sq), sy = s * (1 - 0.18 * sq);
    K.shadow(ctx, x, y + 4, 120 * sx, 18 * s, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.translate(-x, -y);
    if (kind === 'milk') { K.rrect(ctx, x - 100 * sx, y - 150 * sy, 200 * sx, 150 * sy, 28 * s, COL.crust, { seed: 3 }); K.ell(ctx, x - 48 * sx, y - 150 * sy, 62 * sx, 50 * sy, COL.crust2, { seed: 4, shadow: false }); K.ell(ctx, x + 48 * sx, y - 150 * sy, 62 * sx, 50 * sy, COL.crust2, { seed: 5, shadow: false }); K.face(ctx, x, y - 72 * sy, s, t, o); }
    else if (kind === 'salt') { K.ell(ctx, x, y - 62 * sy, 130 * sx, 62 * sy, '#E3A55E', { seed: 6 }); ctx.save(); ctx.strokeStyle = 'rgba(140,80,30,0.45)'; ctx.lineWidth = 5 * s; for (const k of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.ellipse(x + k * 150 * sx, y - 62 * sy, 22 * s, 56 * sy, 0, -1.2, 1.2); ctx.stroke(); } ctx.restore();
      ctx.fillStyle = '#FFFFFF'; for (let i = 0; i < 9; i++) ctx.fillRect(x - 70 * sx + hash(i * 3) * 140 * sx, y - 110 * sy + hash(i * 7) * 30 * sy, 5 * s, 5 * s); K.face(ctx, x, y - 52 * sy, s * 0.9, t, o); }
    else { K.ell(ctx, x, y - 70 * sy, 110 * sx, 72 * sy, '#C9783E', { seed: 7 }); ctx.fillStyle = '#3A2018'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - 20 * s + i * 10 * s, y - 128 * sy + (i % 2) * 6 * s, 3.5 * s, 0, TAU); ctx.fill(); } K.face(ctx, x, y - 64 * sy, s, t, o); }
    ctx.restore(); };
  K.steam = (ctx, x, y, t, a = 1, n = 4) => { for (let i = 0; i < n; i++) { const ph = (t * 0.6 + i / n) % 1, xx = x + (i - (n - 1) / 2) * 34 + Math.sin(ph * 6 + i) * 14, yy = y - ph * 170; ctx.save(); ctx.globalAlpha = a * Math.sin(Math.PI * ph) * 0.8; K.ell(ctx, xx, yy, 18 + ph * 16, 16 + ph * 14, '#FFFFFF', { shadow: false, speckle: false, seed: i + 20 }); ctx.restore(); } };
  K.bg = (ctx, o = {}) => { ctx.fillStyle = o.wall || COL.wall; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 260; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.35)' : 'rgba(150,100,60,0.06)'; ctx.fillRect(hash(i * 3.1) * W, hash(i * 7.3) * H, 3, 3); }
    if (o.table !== false) { const ty = o.ty ?? 820; K.rrect(ctx, -40, ty, W + 80, H - ty + 60, 30, o.tableCol || COL.table, { seed: 9, shadow: false }); } };
  // squishy title: Jua letters, each squashed on its own beat, with a thick coloured edge and a soft drop
  K.title = (ctx, s, x, y, size, lt, o = {}) => { ctx.save(); ctx.font = `400 ${size}px ${FAM.display}`; ctx.textAlign = 'left'; let cx = o.align === 'center' ? x - ctx.measureText(s).width / 2 : x;
    [...s].forEach((ch, i) => { const w = ctx.measureText(ch).width, p = (lt - (o.at ?? 0) - i * (o.step ?? 0.06)) / 0.35; if (p <= 0) { cx += w; return; } const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) { cx += w; return; }
      const sq = 0.06 * Math.sin(K.step(lt) * 7 + i); ctx.save(); ctx.translate(cx + w / 2, y); ctx.scale(e * (1 + sq), e * (1 - sq)); ctx.lineJoin = 'round';
      ctx.fillStyle = 'rgba(90,50,30,0.25)'; ctx.fillText(ch, -w / 2 + 4, 10); ctx.lineWidth = size * 0.16; ctx.strokeStyle = o.edge || '#FFFFFF'; ctx.strokeText(ch, -w / 2, 0); ctx.fillStyle = o.color || COL.choco; ctx.fillText(ch, -w / 2, 0); ctx.restore(); cx += w; });
    ctx.restore(); };
  K.small = (ctx, s, x, y, size, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `400 ${size}px ${FAM.sans}`; ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  window.CLAY = K;
})();

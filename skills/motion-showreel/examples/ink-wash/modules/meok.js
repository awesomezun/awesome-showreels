// meok: the 도성 한 바퀴 reel's kit (a project module). Korean ink landscape on rice paper, as a hand scroll: ranges of
// mountains laid down as bleeding washes (darkest at the ridge, fading down, softened by blur), the fortress wall as
// a brush stroke that follows the ridge with its parapet ticks, pines, gate pavilions, mist, a moon; strokes paint
// themselves with a pressure profile and dry-brush bristles; one red seal. Brush calligraphy in Nanum Brush Script,
// labels in Song Myung.
(() => {
  const K = {}, COL = { paper: '#F1EADC', paper2: '#E6DCC8', ink: '#16130F', red: '#B8322A' };
  K.COL = COL;
  const ink = (a) => `rgba(22,19,15,${a})`;
  K.paper = (ctx, o = {}) => { ctx.fillStyle = o.col || COL.paper; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.lineWidth = 1; for (let i = 0; i < 500; i++) { const x = hash(i * 1.37) * W, y = hash(i * 2.91) * H, a = hash(i * 5.3) * Math.PI, l = 6 + hash(i * 7.7) * 22; ctx.strokeStyle = i % 2 ? 'rgba(150,130,100,0.10)' : 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,70,40,0.22)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  // a ridge: y of the skyline at world x for range k (seeded); base = the foot of the range
  K.ridge = (x, k, base, amp) => base - amp * (0.55 + 0.25 * Math.sin(x * 0.0021 + k * 1.7) + 0.14 * Math.sin(x * 0.0063 + k * 3.1) + 0.06 * Math.sin(x * 0.017 + k));
  // a range as a wash: the ridge filled down to the foot, darkest at the ridge
  K.range = (ctx, k, base, amp, cam, par, tone, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.filter = `blur(${o.blur ?? 6}px)`;
    ctx.beginPath(); ctx.moveTo(-50, base + 60); for (let sx = -50; sx <= W + 50; sx += 16) ctx.lineTo(sx, K.ridge(sx + cam * par, k, base, amp)); ctx.lineTo(W + 50, base + 60); ctx.closePath();
    const g = ctx.createLinearGradient(0, base - amp, 0, base + 40); g.addColorStop(0, ink(tone)); g.addColorStop(0.45, ink(tone * 0.55)); g.addColorStop(1, ink(0)); ctx.fillStyle = g; ctx.fill(); ctx.restore(); };
  // a brush stroke along points; p = how much is painted (0..1); w = the widest width; o.dry = bristle texture
  K.stroke = (ctx, pts, w, p = 1, o = {}) => { if (p <= 0 || pts.length < 2) return; const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1], upto = tot * p, prof = u => w * (0.3 + 0.7 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15 + 0.04)), 0.55)) * (u > 0.85 ? 1 - (u - 0.85) * 3 : 1);
    const left = [], right = [];
    for (let i = 0; i < pts.length; i++) { if (L[i] > upto) break; const [x, y] = pts[i], [x2, y2] = pts[Math.min(pts.length - 1, i + 1)], [x0, y0] = pts[Math.max(0, i - 1)], dx = x2 - x0, dy = y2 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, ww = prof(L[i] / tot) / 2;
      left.push([x + nx * ww, y + ny * ww]); right.push([x - nx * ww, y - ny * ww]); }
    if (left.length < 2) return;
    ctx.save(); ctx.fillStyle = ink(o.a ?? 0.88); ctx.beginPath(); left.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]); ctx.closePath(); ctx.fill();
    if (o.dry !== false) { ctx.lineCap = 'round';   /* dry brush: streaks of paper showing through */ for (let b = 0; b < 7; b++) { const off = (b / 6 - 0.5) * 0.9, seed = b * 13 + (o.seed ?? 0); ctx.lineWidth = 1.2 + hash(seed) * 2; ctx.strokeStyle = `rgba(241,234,220,${0.45 + 0.4 * hash(seed + 1)})`;
        ctx.beginPath(); let on = false; for (let i = 0; i < left.length; i++) { const u = L[i] / tot, gap = hash(seed * 3.3 + Math.floor(u * 18)) < 0.25 + 0.6 * u; const x = lerp(right[i][0], left[i][0], 0.5 + off), y = lerp(right[i][1], left[i][1], 0.5 + off); if (gap) { on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } else on = false; } ctx.stroke(); } }
    ctx.restore(); };
  // the wall along range k between screen xs: a stroke a little under the ridge, with parapet ticks; p = painted part
  K.wall = (ctx, k, base, amp, cam, par, x0, x1, p = 1, o = {}) => { const pts = []; for (let sx = x0; sx <= x1; sx += 14) pts.push([sx, K.ridge(sx + cam * par, k, base, amp) + 18]);
    K.stroke(ctx, pts, o.w ?? 22, p, { seed: 3, a: 0.9 }); const n = Math.floor(pts.length * p);
    ctx.save(); ctx.strokeStyle = ink(0.85); ctx.lineCap = 'round'; for (let i = 2; i < n; i += 3) { const [x, y] = pts[i]; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x + 1, y - 26); ctx.stroke(); } ctx.restore(); return pts; };
  K.pine = (ctx, x, y, s, p = 1) => { if (p <= 0) return; K.stroke(ctx, [[x, y], [x + 8 * s, y - 60 * s], [x - 6 * s, y - 120 * s], [x + 10 * s, y - 180 * s]], 14 * s, p, { seed: x, a: 0.85 });
    if (p > 0.5) { ctx.save(); ctx.globalAlpha *= clamp((p - 0.5) * 2); for (const [dx, dy, w] of [[-30, -170, 90], [25, -140, 80], [-20, -110, 70], [30, -80, 60]]) { ctx.fillStyle = ink(0.75); ctx.filter = 'blur(1.5px)'; ctx.beginPath(); ctx.ellipse(x + dx * s, y + dy * s, w * s / 2, 12 * s, -0.05, 0, TAU); ctx.fill(); } ctx.restore(); } };
  // a gate pavilion: stone base with an arch, a two-tier roof with upturned eaves
  K.gate = (ctx, x, y, s, p = 1) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(p * 1.5);
    ctx.fillStyle = ink(0.55); ctx.fillRect(x - 160 * s, y - 120 * s, 320 * s, 120 * s); ctx.fillStyle = COL.paper; ctx.beginPath(); ctx.moveTo(x - 50 * s, y); ctx.lineTo(x - 50 * s, y - 60 * s); ctx.arc(x, y - 60 * s, 50 * s, Math.PI, 0); ctx.lineTo(x + 50 * s, y); ctx.closePath(); ctx.fill();
    const roof = (yy, hw, hh) => { ctx.fillStyle = ink(0.88); ctx.beginPath(); ctx.moveTo(x - hw * s - 30 * s, yy - 18 * s); ctx.quadraticCurveTo(x - hw * s * 0.6, yy, x, yy - 4 * s); ctx.quadraticCurveTo(x + hw * s * 0.6, yy, x + hw * s + 30 * s, yy - 18 * s); ctx.lineTo(x + hw * s * 0.7, yy - hh * s); ctx.lineTo(x - hw * s * 0.7, yy - hh * s); ctx.closePath(); ctx.fill(); };
    ctx.fillStyle = ink(0.4); ctx.fillRect(x - 110 * s, y - 175 * s, 220 * s, 55 * s); roof(y - 170 * s, 160, 50); ctx.fillStyle = ink(0.4); ctx.fillRect(x - 80 * s, y - 250 * s, 160 * s, 40 * s); roof(y - 245 * s, 120, 45); ctx.restore(); };
  K.mist = (ctx, y, t, a = 0.6) => { ctx.save(); for (let i = 0; i < 3; i++) { const x = ((t * (14 + i * 6) + i * 700) % (W + 1200)) - 600, g = ctx.createRadialGradient(x, y + i * 30, 0, x, y + i * 30, 520); g.addColorStop(0, `rgba(245,240,230,${a})`); g.addColorStop(1, 'rgba(245,240,230,0)'); ctx.fillStyle = g; ctx.save(); ctx.translate(x, y + i * 30); ctx.scale(1, 0.25); ctx.translate(-x, -(y + i * 30)); ctx.fillRect(x - 520, y + i * 30 - 520, 1040, 1040); ctx.restore(); } ctx.restore(); };
  // the red seal with carved (white) characters, two per column
  K.seal = (ctx, x, y, s, chars, p = 1) => { if (p <= 0) return; const e = p >= 1 ? 1 : 1 + 0.3 * (1 - p); ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(-0.04); ctx.globalAlpha *= clamp(p * 2);
    ctx.fillStyle = COL.red; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const u = i / 24, side = Math.floor(u * 4), f = u * 4 - side, j = (hash(i * 3.7) - 0.5) * 4; const P = [[-s / 2 + f * s, -s / 2 + j], [s / 2 + j, -s / 2 + f * s], [s / 2 - f * s, s / 2 + j], [-s / 2 + j, s / 2 - f * s]][Math.min(3, side)]; i ? ctx.lineTo(P[0], P[1]) : ctx.moveTo(P[0], P[1]); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = COL.paper; ctx.font = `400 ${s * 0.4}px ${FAM.serif}`; ctx.textAlign = 'center'; const c = [...chars]; c.forEach((ch, i) => { const col = Math.floor(i / 2), row = i % 2; ctx.fillText(ch, (c.length > 2 ? (col === 0 ? s * 0.2 : -s * 0.2) : 0), -s * 0.08 + row * s * 0.42); }); ctx.restore(); };
  K.brush = (ctx, s, x, y, size, lt, o = {}) => { const p = clamp((lt - (o.at ?? 0)) / (o.dur ?? 0.9)); if (p <= 0) return; ctx.save(); ctx.font = `400 ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : x;
    ctx.beginPath(); ctx.rect(x0 - 20, y - size * 1.1, (w + 40) * Ease.outC(p), size * 1.5); ctx.clip(); ctx.fillStyle = o.color || ink(0.92); ctx.fillText(s, x, y); ctx.restore(); };
  K.label = (ctx, s, x, y, size, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `400 ${size}px ${FAM.serif}`; ctx.textAlign = o.align || 'left'; ctx.letterSpacing = (o.track ?? 4) + 'px'; ctx.fillStyle = o.color || ink(0.8); ctx.fillText(s, x, y); ctx.restore(); };
  // tiny walkers on the wall
  K.walkers = (ctx, pts, u0, t, n = 3) => { ctx.save(); ctx.fillStyle = ink(0.85); for (let i = 0; i < n; i++) { const idx = Math.floor(clamp(u0 - i * 0.012) * (pts.length - 1)), [x, y] = pts[idx] || pts[0], bob = Math.abs(Math.sin(t * 6 + i)) * 2; ctx.beginPath(); ctx.arc(x, y - 44 - bob, 5, 0, TAU); ctx.fill(); ctx.fillRect(x - 3, y - 39 - bob, 6, 14); } ctx.restore(); };
  // where a brushed line ends, for placing the seal after it
  K.brushWidth = (ctx, s, size) => { ctx.save(); ctx.font = `400 ${size}px ${FAM.display}`; const w = ctx.measureText(s).width; ctx.restore(); return w; };
  window.MEOK = K;
})();

// bp: the 폴드원 E1 reel's blueprint kit (a project module). A blueprint sheet (deep blue, a minor and a major grid,
// a drawing frame and a title block); white line work drawn on along its length; dimension lines with arrowheads and
// extension lines; leader callouts; and the bike itself as a list of strokes in two halves, so the front half can fold
// round the hinge (projected as cos θ), the stem can fold down and the seat post can drop.
(() => {
  const K = {};
  K.COL = { bg: '#0F3A78', bg2: '#0A2C5E', line: '#EAF2FF', cyan: '#8FD8FF', yellow: '#FFD45E', dim: 'rgba(234,242,255,0.75)', grid: 'rgba(234,242,255,0.07)', grid2: 'rgba(234,242,255,0.15)' };
  K.f = (size, w = 600, mono = false) => `${w} ${size}px ${mono ? FAM.mono : FAM.display}`;
  K.sheet = (ctx, o = {}) => {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#134486'); g.addColorStop(1, K.COL.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  // the grid and the frame, drawn inside the current transform (the sheet may be tilted)
  K.grid = (ctx, o = {}) => {
    ctx.save(); ctx.lineWidth = 1;
    ctx.strokeStyle = K.COL.grid; ctx.beginPath(); for (let x = -400; x <= W + 400; x += 24) { ctx.moveTo(x, -300); ctx.lineTo(x, H + 300); } for (let y = -300; y <= H + 300; y += 24) { ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); } ctx.stroke();
    ctx.strokeStyle = K.COL.grid2; ctx.beginPath(); for (let x = -360; x <= W + 400; x += 120) { ctx.moveTo(x, -300); ctx.lineTo(x, H + 300); } for (let y = -300; y <= H + 300; y += 120) { ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); } ctx.stroke();
    if (o.frame !== false) { ctx.strokeStyle = K.COL.line; ctx.globalAlpha = 0.55; ctx.lineWidth = 3; ctx.strokeRect(60, 50, W - 120, H - 100); ctx.lineWidth = 1.2; ctx.strokeRect(72, 62, W - 144, H - 124); }
    ctx.restore();
  };
  // ───────── line work ─────────
  const LEN = new WeakMap();
  const cum = p => { let c = LEN.get(p); if (!c) { c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); LEN.set(p, c); } return c; };
  K.stroke = (ctx, p, u, o = {}) => {
    if (u <= 0 || p.length < 2) return; const c = cum(p), L = c[c.length - 1] * clamp(u);
    ctx.save(); ctx.strokeStyle = o.color || K.COL.line; ctx.lineWidth = o.w ?? 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.alpha ?? 1; if (o.dash) ctx.setLineDash(o.dash);
    if (o.glow) { ctx.shadowColor = o.color || K.COL.line; ctx.shadowBlur = o.glow; }
    ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) { if (c[i] <= L) ctx.lineTo(p[i][0], p[i][1]); else { const k = (L - c[i - 1]) / (c[i] - c[i - 1]); ctx.lineTo(lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)); break; } }
    ctx.stroke(); ctx.restore();
  };
  K.circ = (cx, cy, r, n = 64, a0 = -Math.PI / 2) => Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(a0 + i / n * TAU) * r, cy + Math.sin(a0 + i / n * TAU) * r]);
  K.seg = (a, b) => [a, b];
  // a dimension: extension lines, a dimension line with arrows at offset, the label in the middle; p = 0..1
  K.dim = (ctx, a, b, off, label, p, o = {}) => {
    if (p <= 0) return; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * off, ny = dx / L * off, ux = dx / L, uy = dy / L;
    const A = [a[0] + nx, a[1] + ny], Bp = [b[0] + nx, b[1] + ny], col = o.color || K.COL.cyan;
    K.stroke(ctx, [a, [a[0] + nx * 1.12, a[1] + ny * 1.12]], clamp(p * 3), { w: 1.5, color: col });
    K.stroke(ctx, [b, [b[0] + nx * 1.12, b[1] + ny * 1.12]], clamp(p * 3), { w: 1.5, color: col });
    const q = Ease.ioC(clamp((p - 0.2) / 0.6)), mid = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2];
    K.stroke(ctx, [mid, [lerp(mid[0], A[0], q), lerp(mid[1], A[1], q)]], 1, { w: 2, color: col });
    K.stroke(ctx, [mid, [lerp(mid[0], Bp[0], q), lerp(mid[1], Bp[1], q)]], 1, { w: 2, color: col });
    if (q > 0.98) [[A, 1], [Bp, -1]].forEach(([P, s]) => { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(P[0] + (ux * 16 - uy * 6) * s, P[1] + (uy * 16 + ux * 6) * s); ctx.lineTo(P[0] + (ux * 16 + uy * 6) * s, P[1] + (uy * 16 - ux * 6) * s); ctx.closePath(); ctx.fill(); ctx.restore(); });
    const lp = clamp((p - 0.7) / 0.3); if (lp > 0) { ctx.save(); ctx.globalAlpha *= lp; ctx.font = K.f(o.size ?? 30, 700, true); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(label).width + 20;
      ctx.translate(mid[0], mid[1]); ctx.rotate(Math.atan2(dy, dx)); ctx.fillStyle = K.COL.bg; ctx.fillRect(-w / 2, -20, w, 40); ctx.fillStyle = col; ctx.fillText(label, 0, 1); ctx.restore(); }
  };
  // a callout: a dot on the part, a leader with an elbow, the label (two lines allowed)
  K.callout = (ctx, at, to, lines, p, o = {}) => {
    if (p <= 0) return; const col = o.color || K.COL.cyan;
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(at[0], at[1], 7 * clamp(p * 4), 0, TAU); ctx.fill(); ctx.restore();
    const el = [to[0] - (to[0] > at[0] ? 40 : -40), to[1]];
    K.stroke(ctx, [at, el, to], clamp((p - 0.1) / 0.5), { w: 2, color: col });
    const lp = clamp((p - 0.55) / 0.35); if (lp <= 0) return;
    ctx.save(); ctx.globalAlpha *= lp; ctx.textAlign = to[0] > at[0] ? 'left' : 'right'; const x = to[0] + (to[0] > at[0] ? 14 : -14);
    ctx.font = K.f(o.size ?? 38, 700); ctx.fillStyle = K.COL.line; ctx.textBaseline = 'middle'; ctx.fillText(lines[0], x, to[1] - (lines[1] ? 22 : 0));
    if (lines[1]) { ctx.font = K.f((o.size ?? 38) * 0.72, 500, true); ctx.fillStyle = col; ctx.fillText(lines[1], x, to[1] + 24); }
    ctx.restore();
  };
  // the title block (bottom right of the sheet)
  K.titleBlock = (ctx, p, o = {}) => {
    if (p <= 0) return; const x = W - 72 - 620, y = H - 62 - 170, C = K.COL;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.strokeRect(x, y, 620, 170);
    ctx.beginPath(); ctx.moveTo(x, y + 80); ctx.lineTo(x + 620, y + 80); ctx.moveTo(x + 400, y + 80); ctx.lineTo(x + 400, y + 170); ctx.stroke();
    ctx.fillStyle = C.line; ctx.font = K.f(44, 700); ctx.textBaseline = 'middle'; ctx.fillText(o.title || '폴드원 E1  측면도', x + 24, y + 42);
    ctx.font = K.f(22, 500, true); ctx.fillStyle = C.cyan; ctx.fillText(o.no || 'DWG FO-E1-001  ·  1:10', x + 24, y + 112); ctx.fillText('가상의 제품 · 예제', x + 24, y + 146);
    ctx.fillText('SHEET 1/1', x + 424, y + 112); ctx.fillText('2026', x + 424, y + 146); ctx.restore();
  };
  // ───────── the bike (side view, px), with its fold ─────────
  const DX = -200, DY = -60, RW = [560 + DX, 720 + DY], FW = [1240 + DX, 720 + DY], R = 200, HINGE = [960 + DX, 470 + DY], BB = [820 + DX, 720 + DY], SC = [760 + DX, 480 + DY], HT0 = [1150 + DX, 430 + DY], HT1 = [1170 + DX, 500 + DY];
  K.BIKE = { RW, FW, R, HINGE, BB, SC, HT0, HT1 };
  const wheel = (c, r) => { const out = [K.circ(c[0], c[1], r, 72), K.circ(c[0], c[1], r * 0.86, 72), K.circ(c[0], c[1], 16, 24)]; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; out.push([[c[0] + Math.cos(a) * 16, c[1] + Math.sin(a) * 16], [c[0] + Math.cos(a + 0.5) * r * 0.86, c[1] + Math.sin(a + 0.5) * r * 0.86]]); } return out; };
  // strokes as {p, part: 'rear' | 'front' | 'stem' | 'seat'}
  K.strokes = () => {
    const S = [];
    wheel(RW, R).forEach(p => S.push({ p, part: 'rear' }));
    S.push({ p: [RW, BB], part: 'rear' }, { p: [RW, SC], part: 'rear' }, { p: [BB, SC], part: 'rear' }, { p: [SC, HINGE], part: 'rear' });
    S.push({ p: [[BB[0] + 10, BB[1] - 30], [HINGE[0] - 10, HINGE[1] + 30]], part: 'rear' });                                  // down tube (rear piece)
    S.push({ p: [[BB[0] + 40, BB[1] - 90], [HINGE[0] - 30, HINGE[1] + 100], [HINGE[0] + 5, HINGE[1] + 120], [BB[0] + 70, BB[1] - 60], [BB[0] + 40, BB[1] - 90]], part: 'battery' });  // battery
    S.push({ p: K.circ(BB[0], BB[1], 34, 32), part: 'rear' }, { p: [[BB[0] - 60, BB[1] + 40], [BB[0] + 60, BB[1] - 40]], part: 'rear' });
    S.push({ p: [SC, [SC[0] - 18, SC[1] - 150]], part: 'seat' }, { p: [[SC[0] - 90, SC[1] - 160], [SC[0] + 50, SC[1] - 165], [SC[0] + 40, SC[1] - 140], [SC[0] - 80, SC[1] - 138], [SC[0] - 90, SC[1] - 160]], part: 'seat' });
    S.push({ p: [HINGE, HT0], part: 'front' }, { p: [HT0, HT1], part: 'front' }, { p: [HT1, FW], part: 'front' }, { p: [[HINGE[0] + 10, HINGE[1] + 30], HT1], part: 'front' });
    wheel(FW, R).forEach(p => S.push({ p, part: 'front' }));
    S.push({ p: [HT0, [HT0[0] - 30, HT0[1] - 200]], part: 'stem' }, { p: [[HT0[0] - 110, HT0[1] - 200], [HT0[0] + 40, HT0[1] - 200]], part: 'stem' });
    S.push({ p: K.circ(HINGE[0], HINGE[1], 14, 20), part: 'hinge' });
    return S;
  };
  // fold: 0..1 -> the front half turns round the hinge's vertical axis (cos θ, θ 0 -> 180°, a small rise mid-turn),
  // the stem folds down beside the wheel (stemFold 0..1), the seat post drops (seat 0..1)
  K.xform = (part, pt, f) => {
    let [x, y] = pt;
    if (part === 'stem' && f.stem > 0) { const bx = HT0[0], by = HT0[1], a = -f.stem * 1.9, dx = x - bx, dy = y - by; x = bx + dx * Math.cos(a) - dy * Math.sin(a); y = by + dx * Math.sin(a) + dy * Math.cos(a); }
    if ((part === 'front' || part === 'stem') && f.fold > 0) { const th = f.fold * Math.PI; x = HINGE[0] + (x - HINGE[0]) * Math.cos(th); y += -Math.sin(th) * 30 * ((x - HINGE[0]) / 400); }
    if (part === 'seat') y += f.seat * 120;
    if (part === 'battery' && f.bat) { x -= 70 * f.bat; y += 150 * f.bat; }
    return [x, y];
  };
  K.bike = (ctx, u, f = { fold: 0, stem: 0, seat: 0 }, o = {}) => {
    const S = K.strokes(), lens = S.map(s => { let L = 0; for (let i = 1; i < s.p.length; i++) L += Math.hypot(s.p[i][0] - s.p[i - 1][0], s.p[i][1] - s.p[i - 1][1]); return L; }), tot = lens.reduce((a, b) => a + b, 0);
    let acc = 0;
    S.forEach((s, i) => { const a = acc / tot; acc += lens[i]; const q = clamp((u - a) / (lens[i] / tot)); if (q <= 0) return;
      const p = s.p.map(pt => K.xform(s.part, pt, f)), behind = s.part === 'front' || s.part === 'stem' ? Math.cos(f.fold * Math.PI) < 0 : false;
      K.stroke(ctx, p, q, { w: s.part === 'hinge' ? 3 : 3.2, color: s.part === 'hinge' ? K.COL.yellow : (o.hi && o.hi.includes(s.part)) ? K.COL.cyan : K.COL.line, alpha: behind ? 0.75 : 1, glow: o.glow }); });
  };
  // the sheet seen at an angle (k = 1) or flat (k = 0), around the frame centre
  K.tilt = (ctx, k) => { ctx.translate(W / 2, H / 2); ctx.transform(1, -0.09 * k, 0.34 * k, 1 - 0.24 * k, 0, 0); ctx.scale(1 - 0.1 * k, 1 - 0.1 * k); ctx.translate(-W / 2, -H / 2 + 40 * k); };
  window.BP = K;
})();

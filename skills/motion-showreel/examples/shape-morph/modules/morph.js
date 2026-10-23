// morph: the 한 점 플래너 reel's shape kit (a project module). One shape that never cuts: every interface state is an
// outline resampled to the same number of points, and each change starts from the previous scene's state; the second
// outline is rotated (a cyclic shift of its points) to the alignment that moves the points least, then the points are
// carried by a damped spring that overshoots, so the shape stretches past its target and settles. Details that are
// not the shape (a label, a check mark, a knob, the calendar grid) are drawn inside or beside it. Pretendard.
(() => {
  const K = {}, N = 240, TAU = Math.PI * 2;
  K.COL = { bg: '#F5F3EE', ink: '#16161A', coral: '#FF5A3C', soft: '#E7E3DA', mute: '#8A867E' };
  K.F = (size, w = 800) => `${w} ${size}px ${FAM.display}`;
  const CX = 960, CY = 500;
  K.CX = CX; K.CY = CY;
  const rrect = (w, h, r, cx = CX, cy = CY) => resample(roundRectPoints({ x: cx - w / 2, y: cy - h / 2, w, h, r }, 400), N);
  const arcBand = (r0, r1, a0, a1) => { const pts = []; for (let i = 0; i <= 120; i++) { const a = a0 + (a1 - a0) * i / 120; pts.push([CX + Math.cos(a) * r1, CY + Math.sin(a) * r1]); }
    for (let i = 0; i <= 20; i++) { const a = a1 + Math.PI * i / 20; pts.push([CX + Math.cos(a1) * (r0 + r1) / 2 + Math.cos(a) * (r1 - r0) / 2, CY + Math.sin(a1) * (r0 + r1) / 2 + Math.sin(a) * (r1 - r0) / 2]); }
    for (let i = 0; i <= 120; i++) { const a = a1 - (a1 - a0) * i / 120; pts.push([CX + Math.cos(a) * r0, CY + Math.sin(a) * r0]); }
    for (let i = 0; i <= 20; i++) { const a = a0 + Math.PI + Math.PI * i / 20; pts.push([CX + Math.cos(a0) * (r0 + r1) / 2 + Math.cos(a) * (r1 - r0) / 2, CY + Math.sin(a0) * (r0 + r1) / 2 + Math.sin(a) * (r1 - r0) / 2]); }
    return resample(pts, N); };
  const bars = () => { const hs = [210, 300, 250, 390, 340], bw = 96, gap = 26, x0 = CX - (5 * bw + 4 * gap) / 2, base = CY + 200, pts = [[x0, base]];
    hs.forEach((h, i) => { const x = x0 + i * (bw + gap); pts.push([x, base - h], [x + bw, base - h], [x + bw, base - 30], [x + bw + gap, base - 30]); });
    pts.pop(); pts.push([x0 + 5 * bw + 4 * gap, base]); return resample(pts, N); };
  const bubble = () => { const r = roundRectPoints({ x: CX - 260, y: CY - 130, w: 520, h: 220, r: 60 }, 400); const out = [];
    for (const p of r) { out.push(p); } const k = out.findIndex(([x, y]) => y > CY + 89 && x < CX - 40); out.splice(k, 0, [CX - 90, CY + 90], [CX - 150, CY + 170], [CX - 150, CY + 90]); return resample(out, N); };
  K.SHAPES = {
    dot: () => resample(circlePoints(CX, CY, 64, 400), N),
    pill: () => rrect(600, 170, 85),
    check: () => rrect(240, 240, 56),
    loader: () => arcBand(100, 148, -Math.PI / 2, Math.PI),
    toggle: () => rrect(380, 190, 95),
    calendar: () => rrect(640, 580, 48),
    chart: bars,
    bubble,
  };
  const CACHE = {};
  const area = pts => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a; };
  K.shape = (k) => { if (CACHE[k]) return CACHE[k]; let pts = K.SHAPES[k](); if (Math.sign(area(pts)) !== Math.sign(area(K.SHAPES.dot()))) pts = pts.slice().reverse(); return (CACHE[k] = pts); };   // one winding for all
  // B rotated (cyclic shift) to sit best on A
  const ALIGN = {};
  K.aligned = (a, b) => { const key = a + '>' + b; if (ALIGN[key]) return ALIGN[key]; const A = K.shape(a), B = K.shape(b); let best = 0, bd = Infinity;
    for (let s = 0; s < N; s += 2) { let d = 0; for (let i = 0; i < N; i += 4) { const q = B[(i + s) % N]; d += (A[i][0] - q[0]) ** 2 + (A[i][1] - q[1]) ** 2; } if (d < bd) { bd = d; best = s; } }
    return (ALIGN[key] = B.map((_, i) => B[(i + best) % N])); };
  // the outline between from and to at local time lt (spring from t0), optionally spun about the centre
  K.outline = (from, to, lt, o = {}) => { const A = K.shape(from), B = K.aligned(from, to), k = lt <= (o.t0 ?? 0) ? 0 : spring(lt - (o.t0 ?? 0), o.f ?? 2.3, o.z ?? 0.42);
    const sp = o.spin ?? 0; return A.map((p, i) => { let x = lerp(p[0], B[i][0], k), y = lerp(p[1], B[i][1], k); if (sp) { const dx = x - CX, dy = y - CY; x = CX + dx * Math.cos(sp) - dy * Math.sin(sp); y = CY + dx * Math.sin(sp) + dy * Math.cos(sp); } return [x, y]; }); };
  K.fill = (ctx, pts, col) => { ctx.fillStyle = col; pathFrom(ctx, pts); ctx.fill(); };
  K.ground = (ctx) => { ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.w ?? 800); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'center'; ctx.fillText(s, x, y + 14 * (1 - Ease.outC(clamp(a)))); ctx.restore(); };
  // the previous scene's state in this cut (the shape this scene starts from)
  K.prev = (env, fallback) => { const sc = (REEL.plan && REEL.plan.scenes) || [], i = sc.findIndex(s => s.id === env.id); const p = i > 0 ? sc[i - 1].id : null; return (p && K.STATE[p]) || fallback; };
  K.SCOL = { dot: '#16161A', pill: '#FF5A3C', check: '#16161A', loader: '#FF5A3C', toggle: '#16161A', calendar: '#16161A', chart: '#FF5A3C', bubble: '#FF5A3C' };
  // one scene: the shape springs from the previous state to its own at lt = 0 (o.t0 later), its colour crossfading
  K.scene = (ctx, env, to, o = {}) => { const from = K.prev(env, o.from || 'dot'), lt = env.lt, k = clamp(lt / 0.35);
    const br = 1 + (o.breathe ?? 1) * 0.045 * Math.sin(lt * 3.1);   // idle breathing so a held state is never still
    const pts = K.outline(from, to, lt, o).map(([x, y]) => [K.CX + (x - K.CX) * br, K.CY + (y - K.CY) * br]); K.fill(ctx, pts, o.color || mix(K.SCOL[from], K.SCOL[to], k));
    K.ripples(ctx, env, pts, o.breathe ?? 1, o.color || K.SCOL[to]); return { pts, from }; };
  // a soft ring that leaves the shape on every beat after the first second (amp 0 = none)
  K.ripples = (ctx, env, pts, amp = 1, col = K.COL.ink) => { if (amp <= 0) return;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3;
    onBeats(env, 1, (i, dt) => { const g = 1 + dt * 0.55, a = 0.22 * amp * clamp(1 - dt / 0.7); if (a <= 0.003) return; ctx.globalAlpha = a; ctx.beginPath(); pts.forEach(([x, y], j) => { const X = K.CX + (x - K.CX) * g, Y = K.CY + (y - K.CY) * g; j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); ctx.stroke(); }, { from: 0.9, until: env.dur + 0.01 });
    ctx.restore(); };
  K.STATE = { hook: 'dot', button: 'pill', check: 'check', loader: 'loader', toggle: 'toggle', calendar: 'calendar', chart: 'chart', bubble: 'bubble', end: 'dot' };
  window.MORPH = K;
})();

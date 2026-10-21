// neon: the 센티넬 X reel's kit (a project module). Neon on black: every line is drawn three times (a wide soft glow,
// a coloured tube, a near-white core) with additive blending; tubes switch on with the stutter of a real neon sign.
// A network of nodes carries cyan packets; attacks travel the same edges unseen until the radar sweep crosses them,
// then they burn magenta, get a ring and are stopped at a node with a shield pulse.
(() => {
  const K = {}, COL = { bg: '#030407', cyan: '#2EF2FF', mag: '#FF2E9A', white: '#F4FBFF', dim: '#0E3A44', ink2: '#8FA6B2' };
  K.COL = COL;
  const rgba = (hex, a) => { const c = parseColor(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  K.rgba = rgba;
  // a neon stroke of the current path builder fn(ctx); a = brightness 0..1
  K.tube = (ctx, fn, col, a = 1, w = 4) => { if (a <= 0.01) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, al, c] of [[w * 6, 0.10, col], [w * 2.6, 0.28, col], [w, 0.95, col], [w * 0.4, 0.9, '#FFFFFF']]) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = lw; ctx.beginPath(); fn(ctx); ctx.stroke(); }
    ctx.restore(); };
  // neon lettering: glow, coloured outline, white core fill
  K.ntext = (ctx, s, x, y, size, col, a = 1, o = {}) => { if (a <= 0.01) return; ctx.save(); ctx.font = `${o.w ?? 400} ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.letterSpacing = (o.track ?? 0) + 'px';
    ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col; ctx.shadowBlur = size * 0.45 * a; ctx.fillStyle = rgba(col, 0.55 * a); ctx.fillText(s, x, y); ctx.shadowBlur = size * 0.15;
    ctx.lineWidth = Math.max(1.5, size * 0.035); ctx.strokeStyle = rgba(col, 0.9 * a); ctx.strokeText(s, x, y); ctx.shadowBlur = 0; ctx.fillStyle = rgba('#FFFFFF', 0.85 * a); ctx.fillText(s, x, y); ctx.restore(); };
  // the stutter of a neon tube switching on: returns 0/1-ish brightness for local time lt since its switch-on
  K.flicker = (lt, seed = 1) => { if (lt < 0) return 0; if (lt > 0.55) return 1; const k = Math.floor(lt * 40); return hash(k * 3.1 + seed * 7.7) > 0.45 + 0.4 * (1 - lt / 0.55) ? 1 : 0.08; };
  K.plain = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = `${o.w ?? 400} ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.letterSpacing = (o.track ?? 0) + 'px'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillStyle = o.color || COL.ink2; ctx.fillText(s, x, y); ctx.restore(); };
  // the mark: a shield with an X cut through it
  K.mark = (ctx, x, y, s, a = 1, col = COL.cyan) => { K.tube(ctx, c => { c.moveTo(x, y - s); c.lineTo(x + s * 0.82, y - s * 0.62); c.lineTo(x + s * 0.72, y + s * 0.25); c.quadraticCurveTo(x + s * 0.5, y + s * 0.8, x, y + s); c.quadraticCurveTo(x - s * 0.5, y + s * 0.8, x - s * 0.72, y + s * 0.25); c.lineTo(x - s * 0.82, y - s * 0.62); c.closePath(); }, col, a, s * 0.05);
    K.tube(ctx, c => { c.moveTo(x - s * 0.36, y - s * 0.36); c.lineTo(x + s * 0.36, y + s * 0.42); c.moveTo(x + s * 0.36, y - s * 0.36); c.lineTo(x - s * 0.36, y + s * 0.42); }, COL.mag, a, s * 0.05); };
  // ───────── the network ─────────
  const NODES = [[1180, 540], [960, 330], [1420, 300], [1660, 470], [1580, 760], [1290, 860], [990, 760], [800, 540], [1130, 170], [1760, 200], [1820, 700], [1450, 990], [880, 960], [700, 300]];
  const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 8], [2, 8], [2, 9], [3, 9], [3, 10], [4, 10], [4, 11], [5, 11], [6, 12], [7, 13], [1, 13], [5, 12], [2, 3]];
  K.NODES = NODES; K.EDGES = EDGES; K.CORE = 0;
  // where the network sits: every node goes through this (scale, then shift), set per scene with K.view()
  let VW = { sc: 1, dx: 0, dy: 0 }; K.view = (sc = 1, dx = 0, dy = 0) => { VW = { sc, dx, dy }; };
  const nodeAt = (i, sh = [0, 0]) => [NODES[i][0] * VW.sc + VW.dx + sh[0], NODES[i][1] * VW.sc + VW.dy + sh[1]];
  const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  K.net = (ctx, t, o = {}) => { const a = o.a ?? 1, sh = o.shift || [0, 0], N = NODES.map((_, i) => nodeAt(i, sh));
    EDGES.forEach(([i, j], e) => { const on = o.reveal ? clamp((o.reveal - e * 0.05) / 0.3) : 1; if (on <= 0) return; const A = N[i], B = lerp2(N[i], N[j], on);
      K.tube(ctx, c => { c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); }, COL.cyan, 0.32 * a, 2);
      if (on >= 1) for (let k = 0; k < 2; k++) { const p = ((t * (0.35 + 0.1 * (e % 3)) + k * 0.5 + e * 0.13) % 1), q = lerp2(N[i], N[j], (e + k) % 2 ? p : 1 - p); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(COL.cyan, 0.9 * a); ctx.shadowColor = COL.cyan; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(q[0], q[1], 4, 0, TAU); ctx.fill(); ctx.restore(); } });
    N.forEach(([x, y], i) => { const on = o.reveal ? clamp((o.reveal - i * 0.04) / 0.2) : 1; if (on <= 0) return; const r = i === 0 ? 34 : 14; K.tube(ctx, c => c.arc(x, y, r * on, 0, TAU), COL.cyan, (i === 0 ? 0.9 : 0.55) * a, i === 0 ? 4 : 2.5); });
    return N; };
  // the radar sweep from the core: angle = t * TAU / period; a fading wedge behind the line
  K.radarAngle = (t, period) => (t / period) * TAU - Math.PI / 2;
  K.radar = (ctx, t, period, a = 1, sh = [0, 0], R = 900) => { const [cx, cy] = nodeAt(0, sh), ang = K.radarAngle(t, period);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 24; k++) { const a0 = ang - k * 0.03; ctx.fillStyle = rgba(COL.cyan, 0.05 * a * (1 - k / 24)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0 - 0.03, a0); ctx.closePath(); ctx.fill(); }
    ctx.restore(); K.tube(ctx, c => { c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); }, COL.cyan, 0.6 * a, 2);
    for (const r of [180, 360, 540]) K.tube(ctx, c => c.arc(cx, cy, r, 0, TAU), COL.cyan, 0.08 * a, 1.5); };
  // an attack: from an outside point along node path [n1, n2, ..., core-1 hop]; t0 start, speed px/s, blocked at the
  // last node. It is invisible until the sweep passes over it; returns its state for labels.
  K.attack = (ctx, t, A, period, sh = [0, 0]) => { const pts = [A.from, ...A.path.map(i => nodeAt(i, sh))], segs = [];
    let total = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
    const travel = (t - A.t0) * A.speed, done = travel >= total; if (t < A.t0) return null;
    let d = Math.min(travel, total), i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; } const p = lerp2(pts[i], pts[i + 1], clamp(d / segs[i]));
    // revealed once the sweep has crossed its bearing after it started
    // revealed when the sweep first crosses its entry bearing after it set off (deterministic: any frame on its own)
    const [cx, cy] = nodeAt(0, sh), bear = Math.atan2(pts[0][1] - cy, pts[0][0] - cx);
    let seen = Infinity; for (let k = Math.floor(A.t0 / period) - 1; k < Math.floor(A.t0 / period) + 3; k++) { const ts = ((bear + Math.PI / 2) / TAU + k) * period; if (ts >= A.t0) { seen = ts; break; } }
    const vis = clamp((t - seen) / 0.12), tEnd = A.t0 + total / A.speed;
    if (!done) { // a dark trail you cannot see, then the magenta burn
      if (vis > 0) { K.tube(ctx, c => { c.moveTo(pts[Math.max(0, i)][0], pts[Math.max(0, i)][1]); c.lineTo(p[0], p[1]); }, COL.mag, 0.7 * vis, 3);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(COL.mag, vis); ctx.shadowColor = COL.mag; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, TAU); ctx.fill(); ctx.restore();
        const ring = 26 + 10 * Math.sin(t * 12); K.tube(ctx, c => c.arc(p[0], p[1], ring, 0, TAU), COL.mag, 0.6 * vis, 2); } }
    else { const k = (t - tEnd) / 0.6; if (k < 1) { const [bx, by] = pts[pts.length - 1]; K.tube(ctx, c => c.arc(bx, by, 30 + 140 * Ease.outC(k), 0, TAU), COL.cyan, 1 - k, 4);
      for (let j = 0; j < 10; j++) { const an = j / 10 * TAU, r = 20 + 90 * Ease.outC(k); K.tube(ctx, c => { c.moveTo(bx + Math.cos(an) * r * 0.6, by + Math.sin(an) * r * 0.6); c.lineTo(bx + Math.cos(an) * r, by + Math.sin(an) * r); }, COL.mag, 1 - k, 2); } } }
    return { p, vis, done, tEnd, blockedAt: pts[pts.length - 1] }; };
  K.grid = (ctx, a = 1) => { ctx.save(); ctx.strokeStyle = rgba(COL.cyan, 0.05 * a); ctx.lineWidth = 1; for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore(); };
  window.NEON = K;
})();

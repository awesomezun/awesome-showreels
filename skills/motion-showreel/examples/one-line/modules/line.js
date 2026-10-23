// line: the 이음 만년필 reel's one-line kit (a project module). One continuous gold line in world coordinates (a nib
// with its slit and breather hole, cursive loops, steam falling into a cup, the cup, its saucer, a table line, an
// open notebook with writing, a potted plant, a sweep over the top and a heart), joined by smooth connectors so it
// never lifts. It is drawn by a timing in which corners cost more than straights (the pen slows at turns), a camera
// that follows the nib from a little behind it, and a fountain pen riding the tip; a glint can run along the finished
// line. Type is Nanum Myeongjo with Gowun Batang.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { bg: '#13203A', bg2: '#0D1729', gold: '#E3B657', gold2: '#F6DA94', cream: '#F2E8D2' };
  K.F = (size, fam = 'display', w = 800) => `${w} ${size}px ${FAM[fam]}`;
  const P = [];
  const at = () => P[P.length - 1];
  const add = (pts) => { for (const p of pts) { const q = at(); if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.5) P.push([p[0], p[1]]); } };
  const cubic = (a, b, c, d, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; });
  const dirOf = () => { const a = P[P.length - 2], b = at(), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  // a smooth connector from the current end to q, leaving along the current direction and arriving along qdir
  const join = (q, qdir, k = 0.4) => { const a = at(), d = dirOf(), L = Math.hypot(q[0] - a[0], q[1] - a[1]) * k; add(cubic(a, [a[0] + d[0] * L, a[1] + d[1] * L], [q[0] - qdir[0] * L, q[1] - qdir[1] * L], q)); };
  const ell = (cx, cy, rx, ry, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
  const T = (pts, dx, dy, s = 1) => pts.map(([x, y]) => [dx + x * s, dy + y * s]);
  const MARK = {};
  // ── the drawing ──
  // 1. the nib (tip at (-950, 380), 560 tall): right edge up, across the top, left edge down, up the slit, round the
  //    breather hole, up to a curl and out through the top
  const nibR = [[0, 0], [28, -80], [58, -170], [86, -260], [106, -340], [114, -400], [108, -470], [94, -530], [78, -560]];
  add(T(nibR, -950, 380)); add(T(nibR.slice().reverse().map(([x, y]) => [-x, y]), -950, 380));
  add(T([[0, -40], [0, -120], [0, -200], [0, -296]], -950, 380)); add(T(ell(0, -318, 22, 22, Math.PI / 2, Math.PI / 2 + TAU, 40), -950, 380));
  add(T([[0, -340], [0, -400], [12, -440], [40, -462], [56, -452], [44, -428], [16, -436], [0, -470], [0, -560]], -950, 380));
  MARK.nib = P.length;
  // 2. cursive loops across the top
  join([-860, -380], [1, 0.2]);
  for (let i = 0; i <= 150; i++) { const t = i / 150 * 3; add([[-860 + 250 * t + 92 * Math.sin(TAU * t), -380 - 105 * (1 - Math.cos(TAU * t)) + 30 * t]]); }
  MARK.loops = P.length;
  // 3. steam falling into a cup, the cup, its handle, the saucer
  join([40, -140], [0.2, 1]);
  add(cubic([40, -140], [90, -80], [-10, -20], [60, 40], 30)); add(cubic([60, 40], [100, 80], [70, 100], [90, 118], 12));
  add(ell(100, 120, 122, 22, Math.PI * 0.42, Math.PI * 0.42 + TAU, 60));
  add(cubic([-22, 120], [-26, 280], [40, 380], [100, 382], 24)); add(cubic([100, 382], [160, 380], [226, 280], [222, 120], 24));
  add(cubic([222, 120], [222, 150], [214, 170], [216, 182], 6)); add(cubic([216, 182], [330, 160], [340, 320], [208, 300], 24));
  add(cubic([208, 300], [200, 360], [250, 410], [330, 418], 12)); add(ell(100, 420, 236, 40, 0, TAU, 72));
  MARK.cup = P.length;
  // 4. the table line into an open notebook, then a line of writing across the right page
  join([460, 430], [1, 0]);
  const lb = cubic([460, 430], [560, 400], [700, 392], [785, 400], 20);      // left page: bottom, spine, top, outer edge, then
  add(lb); add([[785, 400], [785, 132]]); add(cubic([785, 132], [700, 120], [560, 120], [460, 160], 20)); add([[460, 160], [460, 430]]);   // back along
  add(lb); add(cubic([785, 400], [880, 392], [1010, 400], [1110, 430], 20)); add([[1110, 430], [1110, 160]]); add(cubic([1110, 160], [1010, 128], [880, 124], [785, 132], 20));   // the right page
  for (let r = 0; r < 4; r++) { const y = 196 + r * 52, x0 = 820, x1 = 1070 - (r === 3 ? 90 : 0); add([[x0, y - 20]]);
    for (let i = 0; i <= 40; i++) { const u = i / 40, x = lerp(x0, x1, u); add([[x, y + 8 * Math.sin(u * 44 + r) - 6 * Math.abs(Math.sin(u * 13 + r * 2))]]); } }
  MARK.book = P.length;
  // 5. a potted plant: the pot, a stem with leaves out and back on each side
  join([1360, 430], [1, 0]);
  add([[1360, 430], [1340, 300], [1560, 300], [1540, 430], [1450, 430], [1450, 300]]);
  for (let k = 0; k < 5; k++) { const y = 260 - k * 75, s = k % 2 ? 1 : -1, len = 120 - k * 12;
    add([[1450 + 6 * s, y + 20], [1450, y]]); add(cubic([1450, y], [1450 + s * len * 0.5, y - 70], [1450 + s * len, y - 40], [1450 + s * len, y - 10], 14)); add(cubic([1450 + s * len, y - 10], [1450 + s * len * 0.6, y + 20], [1450 + s * 20, y + 10], [1450, y - 4], 14)); }
  add([[1450, -110], [1452, -170]]);
  MARK.plant = P.length;
  // 6. a sweep over the top and a heart near the middle, the end of the line
  join([1300, -470], [-0.6, -1]);
  add(cubic([1300, -470], [1000, -650], [700, -470], [420, -560], 30));
  const heart = Array.from({ length: 61 }, (_, i) => { const t = i / 60 * TAU; return [340 + 6.4 * (16 * Math.sin(t) ** 3), -560 - 6.4 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; });
  join(heart[0], [-1, 0.2]); add(heart); add(cubic([340, -592], [240, -560], [120, -600], [-40, -580], 16));
  MARK.end = P.length;

  // ── timing: corners cost more ──
  const cost = [0];
  for (let i = 1; i < P.length; i++) {
    const a = P[Math.max(0, i - 2)], b = P[i - 1], c = P[i], l = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const t1 = Math.atan2(b[1] - a[1], b[0] - a[0]), t2 = Math.atan2(c[1] - b[1], c[0] - b[0]); let turn = Math.abs(t2 - t1); if (turn > Math.PI) turn = TAU - turn;
    cost.push(cost[i - 1] + l + 60 * turn);
  }
  K.P = P; K.COST = cost; K.MARK = Object.fromEntries(Object.entries(MARK).map(([k, v]) => [k, cost[Math.min(v, cost.length - 1)]]));
  K.TOTAL = cost[cost.length - 1];
  const idxAt = (c) => { let lo = 0, hi = cost.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cost[m] < c) lo = m + 1; else hi = m; } return lo; };
  K.pointAt = (c) => { c = Math.max(0, Math.min(K.TOTAL, c)); const i = Math.max(1, idxAt(c)), a = P[i - 1], b = P[i], f = (c - cost[i - 1]) / Math.max(1e-6, cost[i] - cost[i - 1]); return [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; };
  // camera: a point a little behind the tip (the mean of samples over `lag` of cost), zoom z, plus an offset
  K.cam = (c, z, o = {}) => { let x = 0, y = 0; const n = 10, lag = o.lag ?? 260; for (let k = 0; k < n; k++) { const p = K.pointAt(c - lag * k / (n - 1)); x += p[0]; y += p[1]; } return { cx: x / n + (o.dx || 0), cy: y / n + (o.dy || 0), z }; };
  K.mixCam = (a, b, k) => ({ cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k)) });
  K.toScreen = (cam, [x, y]) => [W / 2 + (x - cam.cx) * cam.z, H / 2 + (y - cam.cy) * cam.z];
  K.ground = (ctx) => { const g = ctx.createRadialGradient(W * 0.5, H * 0.45, 100, W * 0.5, H * 0.5, W * 0.75); g.addColorStop(0, '#1A2B4C'); g.addColorStop(1, K.COL.bg2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  // the line up to cost c, seen through cam; o.glint draws a bright travelling highlight on the finished line
  K.draw = (ctx, c, cam, o = {}) => {
    const n = idxAt(c); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.cx, -cam.cy);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = K.COL.gold; ctx.lineWidth = (o.w ?? 3.6) / cam.z; ctx.shadowColor = 'rgba(227,182,87,0.55)'; ctx.shadowBlur = 10;
    ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1]); const tip = K.pointAt(c); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
    if (o.glint != null) { const g0 = o.glint, i0 = idxAt(g0 - 500), i1 = idxAt(g0); ctx.strokeStyle = K.COL.gold2; ctx.lineWidth = 6 / cam.z; ctx.shadowColor = 'rgba(255,240,200,0.9)'; ctx.shadowBlur = 18; ctx.beginPath(); for (let i = i0; i <= i1; i++) i > i0 ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1]); ctx.stroke(); }
    ctx.restore(); return K.toScreen(cam, tip);
  };
  // the fountain pen riding the tip (screen space, held at a fixed angle)
  K.pen = (ctx, [x, y], a = 1, lt = 0) => {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(-0.95 + 0.04 * Math.sin(lt * 3));
    ctx.fillStyle = K.COL.gold; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -46); ctx.lineTo(-16, -46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0B1220'; rr(ctx, -20, -250, 40, 206, 14); ctx.fill(); ctx.fillStyle = K.COL.gold; ctx.fillRect(-20, -120, 40, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(-12, -240, 6, 180);
    ctx.fillStyle = 'rgba(246,218,148,0.9)'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill(); ctx.restore();
  };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display', o.w ?? 800); ctx.fillStyle = o.color || K.COL.cream; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 10 * (1 - clamp(a))); ctx.restore(); };
  K.FULL = { cx: 250, cy: 64, z: 0.6 };
  window.ONE = K;
})();

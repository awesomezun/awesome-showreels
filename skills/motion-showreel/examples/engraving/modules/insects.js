// insects: the plates of the 한반도 곤충 도감 reel (a project module on top of dong.js). Each insect is a list of
// timed burin lines in its own coordinates (origin at the body, about one plate unit per pixel at scale 1), built once:
// outlines first, then legs and antennae, then the hatching that shades each dome; plus a colour shape for the wash.
// `sp` compresses the engraving time (the specimen sheet engraves four insects quickly).
(() => {
  const K = DONG, TAU = Math.PI * 2, MEMO = new Map();
  const memo = (key, fn) => { if (!MEMO.has(key)) MEMO.set(key, fn()); return MEMO.get(key); };
  const tm = (list, t0, sp) => list.map(l => ({ ...l, t0: t0 + l.t0 * sp, d: l.d * sp }));
  // a jointed leg: points with widths, little spines on the second segment
  const leg = (pts, w, t0) => {
    const out = []; for (let i = 0; i < pts.length - 1; i++) out.push({ pts: [[...pts[i], 1], [...pts[i + 1], 0.8]], w: w * (1 - i * 0.28), t0: t0 + i * 0.12, d: 0.25, swell: 0.3 });
    const [a, b] = [pts[1], pts[2]]; for (let k = 1; k <= 3; k++) { const f = k / 4, x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f), dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
      out.push({ pts: [[x, y, 1], [x - dy / d * 10 + dx / d * 6, y + dx / d * 10 + dy / d * 6, 0.4]], w: 2.4, t0: t0 + 0.4 + k * 0.04, d: 0.12, swell: 0.2 }); }
    return out;
  };
  const curve = (P, n = 20) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return P.length === 3 ? [u * u * P[0][0] + 2 * u * t * P[1][0] + t * t * P[2][0], u * u * P[0][1] + 2 * u * t * P[1][1] + t * t * P[2][1]]
    : [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; });
  const offset = (pts, d) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, dd = typeof d === 'function' ? d(i / (pts.length - 1)) : d; return [p[0] - dy / l * dd, p[1] + dx / l * dd]; });
  const smooth = (P, n = 8) => { const out = []; for (let i = 0; i < P.length; i++) { const p0 = P[(i - 1 + P.length) % P.length], p1 = P[i], p2 = P[(i + 1) % P.length], p3 = P[(i + 2) % P.length];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(j => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } out.push(out[0]); return out; };
  const mirror = list => list.map(l => ({ ...l, pts: l.pts.map(p => [-p[0], p[1], p[2]]) }));
  K.smooth = smooth;

  // ───────── 사슴벌레, a stag beetle seen from above ─────────
  K.beetle = (t0 = 0, sp = 1) => memo(`beetle${t0},${sp}`, () => {
    const L = [];
    L.push(K.outline(K.ell(0, 90, 122, 182), 4.5, 0, 0.7), K.outline(K.ell(0, -128, 114, 64), 4, 0.25, 0.5), K.outline(K.ell(0, -238, 94, 54), 4, 0.45, 0.45));
    L.push({ pts: [[0, -88, 1], [0, 90, 1.2], [0, 270, 0.6]], w: 3.5, t0: 0.6, d: 0.4, swell: 0.3 });
    const half = [];
    const mand = (s) => {            // one mandible: a curved horn with an inner tooth, hatched along its length
      const c = curve([[s * 58, -282], [s * 120, -360], [s * 95, -460], [s * 30, -500]], 24);
      const A = offset(c, f => s * (15 * (1 - f) + 2)), B = offset(c, f => -s * (15 * (1 - f) + 2));
      const out = [K.outline(A, 3.6, 0.7, 0.45), K.outline(B, 3.6, 0.7, 0.45), ...K.band(A, B, 6, 2.6, 1.6, 0.35, (f) => 0.3 + 1.0 * (s > 0 ? f : 1 - f))];
      const m = c[12]; out.push({ pts: [[m[0], m[1], 1], [m[0] - s * 42, m[1] - 8, 0.5], [m[0] - s * 52, m[1] - 22, 0.2]], w: 7, t0: 0.85, d: 0.3, swell: 0.25 });
      return out;
    };
    half.push(...mand(1));
    half.push(...leg([[100, -150], [205, -212], [255, -302], [268, -362]], 9, 0.95), ...leg([[116, -36], [232, -20], [300, -84], [344, -66]], 9, 1.05), ...leg([[112, 128], [222, 196], [282, 306], [300, 356]], 9, 1.15));
    half.push({ pts: [[72, -262, 1], [150, -302, 0.7], [178, -272, 0.5]], w: 3, t0: 1.0, d: 0.3, swell: 0.2 });
    for (let k = 0; k < 3; k++) half.push({ pts: [[160 + k * 7, -296 + k * 9, 1], [176 + k * 7, -306 + k * 9, 0.4]], w: 3, t0: 1.25 + k * 0.03, d: 0.1, swell: 0.2 });
    L.push(...half, ...mirror(half));
    L.push(...K.dome(0, 90, 122, 182, 0, { n: 30, wmax: 3.6, t0: 1.3, span: 1.3, dir: 'long', cross: 0.6 }));
    L.push(...K.dome(0, -128, 114, 64, 0, { n: 15, wmax: 3.2, t0: 1.7, span: 0.8, dir: 'across', cross: 0.66 }));
    L.push(...K.dome(0, -238, 94, 54, 0, { n: 12, wmax: 3.0, t0: 1.9, span: 0.7, dir: 'across', cross: 0.66 }));
    for (const s of [-1, 1]) L.push(...K.dome(s * 88, -240, 14, 12, 0, { n: 4, wmax: 3, t0: 2.1, span: 0.2, cross: false }));
    return tm(L, t0, sp);
  });
  K.beetleWash = (g, stroke) => { const f = (pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); stroke ? g.stroke() : g.fill(); };
    f(K.ell(0, 90, 122, 182)); f(K.ell(0, -128, 114, 64)); f(K.ell(0, -238, 94, 54));
    for (const s of [-1, 1]) { const c = curve([[s * 58, -282], [s * 120, -360], [s * 95, -460], [s * 30, -500]], 24); g.save(); g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); c.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); } };

  // ───────── 호랑나비, a swallowtail with its wings spread ─────────
  const FW = smooth([[8, -6], [40, -60], [120, -150], [230, -225], [330, -250], [372, -232], [360, -180], [330, -110], [285, -45], [220, -8], [120, 8], [30, 10]], 6);
  const HW = smooth([[14, 12], [110, 22], [210, 40], [275, 80], [290, 140], [265, 195], [240, 230], [252, 300], [238, 324], [212, 300], [200, 245], [160, 220], [100, 190], [50, 140], [18, 70]], 6);
  const toward = (pts, k, o = [12, 0]) => pts.map(([x, y]) => [o[0] + (x - o[0]) * k, o[1] + (y - o[1]) * k]);
  K.FW = FW; K.HW = HW;
  K.butterfly = (t0 = 0, sp = 1) => memo(`bfly${t0},${sp}`, () => {
    const half = [];
    half.push(K.outline(FW, 4, 0, 0.8), K.outline(HW, 4, 0.2, 0.8));
    const fv = [[230, -225], [300, -245], [365, -200], [340, -130], [300, -60], [240, -12]], hv = [[260, 70], [288, 140], [262, 200], [245, 300], [200, 245], [130, 205]];
    fv.forEach((p, i) => half.push({ pts: curve([[12, 0], [p[0] * 0.45, p[1] * 0.55 - 10], p], 14).map(q => [...q, 0.8]), w: 2.6, t0: 0.5 + i * 0.07, d: 0.4, swell: 0.4 }));
    hv.forEach((p, i) => half.push({ pts: curve([[14, 10], [p[0] * 0.5, p[1] * 0.45], p], 14).map(q => [...q, 0.8]), w: 2.6, t0: 0.65 + i * 0.07, d: 0.4, swell: 0.4 }));
    return tm(half, t0, sp);
  });
  // the dark bands, engraved as dense diagonal hatching clipped to the band; drawn separately because of the clip
  K.bands = (ctx, lt, t0 = 0, sp = 1) => {
    const bandF = [...FW.slice(0, 36), ...toward(FW.slice(0, 36), 0.8).reverse()], bandH = [...HW.slice(12, 60), ...toward(HW.slice(12, 60), 0.76).reverse()];
    for (const [poly, a0] of [[bandF, 1.1], [bandH, 1.4]]) {
      const p = (lt - t0 - a0 * sp) / (0.9 * sp); if (p <= 0) continue;
      ctx.save(); ctx.beginPath(); poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.clip(); ctx.fillStyle = K.COL.ink;
      for (let k = -60; k < 60; k++) { const x0 = k * 7; K.line(ctx, [[x0 - 300, 300, 1], [x0 + 300, -300, 1]], clamp(p * 1.6 - (k + 60) / 120 * 0.6), 2.4, { swell: 0.2 }); }
      for (let k = -40; k < 40; k++) { const x0 = k * 10; K.line(ctx, [[x0 - 300, -300, 1], [x0 + 300, 300, 1]], clamp(p * 1.4 - 0.5 - (k + 40) / 80 * 0.4), 1.6, { swell: 0.2 }); }
      ctx.restore();
    }
  };
  K.bflyBody = (t0 = 0, sp = 1) => memo(`bbody${t0},${sp}`, () => tm([
    K.outline(K.ell(0, 110, 17, 96), 3.2, 0.1, 0.4), ...K.dome(0, 110, 17, 96, 0, { n: 10, wmax: 2.4, t0: 0.4, span: 0.4, dir: 'across', cross: false }),
    K.outline(K.ell(0, 0, 23, 30), 3.2, 0.2, 0.3), ...K.dome(0, 0, 23, 30, 0, { n: 6, wmax: 2.6, t0: 0.5, span: 0.3, dir: 'across', cross: false }),
    K.outline(K.ell(0, -40, 14, 13), 3, 0.3, 0.2),
    { pts: [[-6, -50, 1], [-40, -120, 0.7], [-62, -158, 0.6]], w: 2.4, t0: 0.6, d: 0.3, swell: 0.2 }, { pts: [[6, -50, 1], [40, -120, 0.7], [62, -158, 0.6]], w: 2.4, t0: 0.6, d: 0.3, swell: 0.2 },
    K.outline(K.ell(-63, -162, 6, 8), 3, 0.85, 0.1), K.outline(K.ell(63, -162, 6, 8), 3, 0.85, 0.1)], t0, sp));
  K.bflyWash = (g, stroke) => { const f = (pts, mx) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(mx * x, y) : g.moveTo(mx * x, y)); g.closePath(); stroke ? g.stroke() : g.fill(); };
    for (const s of [-1, 1]) { f(FW, s); f(HW, s); } };
  K.bflySpots = (ctx, p) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= 0.85 * clamp(p);
    for (const s of [-1, 1]) { ctx.fillStyle = K.COL.blue; [[150, 222], [205, 238], [248, 196], [266, 140]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(s * x, y, 11, 0, TAU); ctx.fill(); });
      ctx.fillStyle = K.COL.red; ctx.beginPath(); ctx.arc(s * 104, 200, 15, 0, TAU); ctx.fill(); } ctx.restore(); };

  // ───────── the specimen sheet: 무당벌레, 매미, 잠자리, 메뚜기 ─────────
  K.ladybird = (t0, sp) => memo(`lady${t0},${sp}`, () => tm([K.outline(K.ell(0, 20, 92, 104), 4, 0, 0.5), { pts: [[0, -84, 1], [0, 124, 0.7]], w: 3, t0: 0.3, d: 0.3, swell: 0.3 },
    K.outline(K.ell(0, -92, 50, 30), 3.5, 0.2, 0.3), ...K.dome(0, -92, 50, 30, 0, { n: 10, wmax: 3.4, t0: 0.4, span: 0.3, dir: 'across', cross: 0.3 }),
    ...K.dome(0, 20, 92, 104, 0, { n: 18, wmax: 3, t0: 0.5, span: 0.7, dir: 'across', cross: 0.65 }),
    ...[[-45, -20], [45, -20], [-55, 50], [55, 50], [-25, 95], [25, 95], [0, -40]].map(([x, y], i) => ({ disc: [x, y, 15], t0: 1.0 + i * 0.05, d: 0.2 }))], t0, sp));
  K.cicada = (t0, sp) => memo(`cic${t0},${sp}`, () => { const half = [];
    const wing = smooth([[22, -50], [90, -40], [150, 60], [170, 200], [140, 250], [100, 200], [50, 60]], 6);
    half.push(K.outline(wing, 2.6, 0.3, 0.6)); [[150, 70], [160, 180], [120, 230], [80, 150]].forEach((p, i) => half.push({ pts: curve([[24, -46], [p[0] * 0.5, p[1] * 0.4], p], 12).map(q => [...q, 0.7]), w: 1.8, t0: 0.6 + i * 0.05, d: 0.3, swell: 0.4 }));
    return tm([...half, ...mirror(half), K.outline(K.ell(0, 30, 42, 112), 3.6, 0, 0.5), ...K.dome(0, 30, 42, 112, 0, { n: 14, wmax: 3.2, t0: 0.5, span: 0.6, dir: 'across', cross: 0.62 }),
      K.outline(K.ell(0, -92, 62, 26), 3.4, 0.2, 0.3), ...K.dome(0, -92, 62, 26, 0, { n: 7, wmax: 3, t0: 0.7, span: 0.3, dir: 'across', cross: false }),
      ...K.dome(-58, -96, 12, 12, 0, { n: 4, wmax: 4, t0: 0.9, span: 0.1, cross: 0 }), ...K.dome(58, -96, 12, 12, 0, { n: 4, wmax: 4, t0: 0.9, span: 0.1, cross: 0 })], t0, sp); });
  K.dragonfly = (t0, sp) => memo(`drag${t0},${sp}`, () => { const half = [];
    const fw = smooth([[16, -20], [120, -48], [250, -50], [280, -36], [250, -22], [120, -10]], 6), hw = smooth([[16, -2], [120, 4], [240, 18], [265, 34], [230, 40], [110, 30]], 6);
    half.push(K.outline(fw, 2.4, 0.2, 0.5), K.outline(hw, 2.4, 0.3, 0.5));
    for (let k = 1; k < 9; k++) { const x = 16 + k * 30; half.push({ pts: [[x, -18 - k * 3.2, 1], [x + 6, -12 - k * 0.1, 1]], w: 1.2, t0: 0.6 + k * 0.03, d: 0.1, swell: 0.1 }, { pts: [[x, 2 + k * 1.5, 1], [x + 4, 16 + k * 2, 1]], w: 1.2, t0: 0.7 + k * 0.03, d: 0.1, swell: 0.1 }); }
    const ab = []; for (let k = 0; k < 9; k++) ab.push(K.outline(K.ell(0, 44 + k * 36, 10 - k * 0.5, 18), 2.6, 0.1 + k * 0.04, 0.15), ...K.dome(0, 44 + k * 36, 10 - k * 0.5, 18, 0, { n: 3, wmax: 2.4, t0: 0.6 + k * 0.03, span: 0.1, dir: 'across', cross: false }));
    return tm([...half, ...mirror(half), K.outline(K.ell(0, -8, 26, 36), 3.4, 0, 0.3), ...K.dome(0, -8, 26, 36, 0, { n: 7, wmax: 3, t0: 0.4, span: 0.3, dir: 'across', cross: 0.6 }),
      ...K.dome(-20, -56, 20, 18, 0, { n: 6, wmax: 3.2, t0: 0.5, span: 0.2, cross: 0.55 }), ...K.dome(20, -56, 20, 18, 0, { n: 6, wmax: 3.2, t0: 0.5, span: 0.2, cross: 0.55 }), ...ab], t0, sp); });
  K.grasshopper = (t0, sp) => memo(`gh${t0},${sp}`, () => tm([K.outline(K.ell(30, 20, 150, 46, 0.06), 3.6, 0, 0.6), ...K.dome(30, 20, 150, 46, 0.06, { n: 14, wmax: 3, t0: 0.4, span: 0.6, dir: 'long', cross: 0.65 }),
    K.outline(K.ell(-150, -6, 44, 54, -0.3), 3.6, 0.15, 0.4), ...K.dome(-150, -6, 44, 54, -0.3, { n: 8, wmax: 3, t0: 0.5, span: 0.3, dir: 'across', cross: 0.6 }),
    ...K.dome(-168, -24, 12, 12, 0, { n: 4, wmax: 4, t0: 0.7, span: 0.1, cross: 0 }),
    { pts: [[-180, -50, 1], [-230, -150, 0.7], [-200, -230, 0.4]], w: 2.4, t0: 0.6, d: 0.3, swell: 0.2 },
    K.outline(K.ell(70, -30, 120, 26, -0.42), 3.6, 0.3, 0.5), ...K.band(K.ell(70, -30, 110, 18, -0.42, 20, Math.PI * 0.9, Math.PI * 1.9), K.ell(70, -30, 110, 18, -0.42, 20, Math.PI * 0.1, -Math.PI * 0.1), 5, 2.2, 0.7, 0.3),
    { pts: [[170, -76, 1], [210, 60, 0.8], [230, 90, 0.5]], w: 5, t0: 0.8, d: 0.3, swell: 0.2 },
    ...leg([[-90, 50], [-110, 110], [-140, 150], [-160, 160]], 5, 0.8), ...leg([[-40, 56], [-40, 120], [-60, 160], [-80, 168]], 5, 0.85)], t0, sp));
  K.drawBug = (ctx, list, lt, x, y, s, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const tips = K.lines(ctx, list, lt); ctx.restore(); return tips.map(([a, b]) => [x + a * s, y + b * s]); };
})();

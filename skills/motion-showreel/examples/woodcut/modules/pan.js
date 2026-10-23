// pan: the 솔뫼 양조장 reel's woodcut kit (a project module). A relief print in code: the key block is an ink layer
// on rice paper, and every white line is a V-gouge cut taken out of it: a tapered, ragged sliver cut along its length
// over time, wide where the picture is light and thin where it is dark, with a chip curling off the tip while it cuts.
// The ink carries wood grain and specks where it did not take; one vermilion plate prints under it, out of register
// until it is pressed; and the pull peels the sheet off with a curl. Display type is Black And White Picture.
(() => {
  const K = {}, COL = { paper: '#EFE6D2', paper2: '#E2D5BB', ink: '#191512', red: '#B4432A', wood: '#5A3E28' };
  K.COL = COL;
  const TAU = Math.PI * 2;
  let inkB = null, redB = null, paperC = null, speckC = null;
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;

  // ───────── paper, ink texture ─────────
  K.paperTex = () => {
    if (paperC) return paperC.c;
    paperC = makeBuf(); const g = paperC.g;
    g.fillStyle = COL.paper; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      const x = hash(i * 1.37) * W, y = hash(i * 2.91) * H, a = hash(i * 5.3) * Math.PI, l = 4 + hash(i * 7.7) * 26;
      g.strokeStyle = i % 3 ? 'rgba(150,128,96,0.10)' : 'rgba(255,252,240,0.45)'; g.lineWidth = 0.8 + hash(i * 3.3);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.05);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(110,80,40,0.22)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    return paperC.c;
  };
  K.paper = (ctx) => ctx.drawImage(K.paperTex(), 0, 0);
  // what the ink loses: long wood-grain streaks and small specks where it did not take (an alpha mask)
  K.speckTex = () => {
    if (speckC) return speckC.c;
    speckC = makeBuf(); const g = speckC.g;
    for (let i = 0; i < 260; i++) {           // grain: long, slightly wavy runs
      const y0 = hash(i * 9.1) * H, x0 = hash(i * 4.3) * W - 300, len = 200 + hash(i * 2.2) * 900, a = 0.05 + 0.12 * hash(i * 6.6);
      g.strokeStyle = `rgba(0,0,0,${a})`; g.lineWidth = 0.6 + 1.6 * hash(i * 1.9); g.beginPath();
      for (let x = 0; x <= len; x += 24) { const y = y0 + 6 * Math.sin((x0 + x) * 0.004 + i) + 2 * Math.sin((x0 + x) * 0.03 + i * 2); x ? g.lineTo(x0 + x, y) : g.moveTo(x0 + x, y); }
      g.stroke();
    }
    for (let i = 0; i < 5200; i++) {           // specks
      const x = hash(i * 3.71 + 0.3) * W, y = hash(i * 8.13 + 0.7) * H, r = 0.5 + 1.8 * hash(i * 1.11) ** 3;
      g.fillStyle = `rgba(0,0,0,${0.35 + 0.65 * hash(i * 2.57)})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
    return speckC.c;
  };

  // ───────── the key block (ink layer) ─────────
  // begin() hands out the cleared ink buffer; fill shapes with K.inkFill, cut with K.cut; end() textures it and prints
  K.begin = () => {
    if (!inkB) { inkB = makeBuf(); redB = makeBuf(); }
    const g = inkB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
    g.fillStyle = COL.ink; g.strokeStyle = COL.ink; return g;
  };
  K.end = (ctx, o = {}) => {
    const g = inkB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = o.speck ?? 1;
    g.drawImage(K.speckTex(), 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.drawImage(inkB.c, o.dx || 0, o.dy || 0); ctx.restore();
  };
  // the colour plate: drawn into its own buffer, printed (multiply) with a registration offset that settles when pressed
  K.redBegin = () => { if (!redB) { inkB = makeBuf(); redB = makeBuf(); } const g = redB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.fillStyle = COL.red; return g; };
  K.redEnd = (ctx, p, o = {}) => {   // p: 0 not printed .. 1 pressed; the offset springs from 14 px to about 1.5 px
    if (p <= 0) return; const g = redB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = 0.7;
    g.drawImage(K.speckTex(), 37, 11); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    const s = spring(clamp(p), 2.6, 0.5), dx = lerp(14, 1.5, s), dy = lerp(-10, -1, s);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha *= clamp(p * 4) * (o.alpha ?? 0.92); ctx.drawImage(redB.c, dx, dy); ctx.restore();
  };

  // ───────── cuts ─────────
  // a cut: points [[x, y, w?], ...] (w = width at that point, else o.w), taken out of g up to fraction u of its length;
  // the width is a lens (thin at both ends), ragged by a seeded wobble. Returns the tip [x, y, angle] while cutting.
  const CUM = new WeakMap();
  const cum = p => { let c = CUM.get(p); if (!c) { c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); CUM.set(p, c); } return c; };
  K.cut = (g, pts, u, o = {}) => {
    if (u <= 0 || pts.length < 2) return null;
    const c = cum(pts), L = c[c.length - 1], upto = L * clamp(u), seed = o.seed ?? 1, w0 = o.w ?? 6, taper = o.taper ?? 0.18;
    const left = [], right = []; let tip = null;
    for (let i = 0; i < pts.length; i++) {
      let [x, y, w] = pts[i]; w = w ?? w0;
      if (c[i] > upto) {          // the last, partial segment ends exactly at the tip
        const [px, py] = pts[i - 1], k = (upto - c[i - 1]) / Math.max(1e-6, c[i] - c[i - 1]);
        x = px + (x - px) * k; y = py + (y - py) * k;
      }
      const s = Math.min(c[i], upto) / L, j0 = pts[Math.max(0, i - 1)], j1 = pts[Math.min(pts.length - 1, i + 1)];
      const dx = j1[0] - j0[0], dy = j1[1] - j0[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      const lens = Math.min(1, Math.min(s, 1 - s) / taper) ** 0.7, rag = 1 + 0.28 * (hsh2(seed, i * 0.73) - 0.5) + 0.18 * Math.sin(i * 1.7 + seed);
      const hw = Math.max(0.3, w * lens * rag / 2);
      left.push([x + nx * hw, y + ny * hw]); right.push([x - nx * hw * (0.8 + 0.4 * hsh2(seed + 3, i)), y - ny * hw * (0.8 + 0.4 * hsh2(seed + 3, i))]);
      if (c[i] >= upto) { tip = [x, y, Math.atan2(dy, dx)]; break; }
    }
    if (left.length < 2) return null;
    g.save(); g.globalCompositeOperation = o.add ? 'source-over' : 'destination-out'; g.fillStyle = o.add ? COL.ink : '#000';
    g.beginPath(); left.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); for (let i = right.length - 1; i >= 0; i--) g.lineTo(right[i][0], right[i][1]); g.closePath(); g.fill(); g.restore();
    return u < 1 ? tip : null;
  };
  // run a list of cuts [{pts, t0, d, w, seed}] at local time lt (each cut takes d seconds from t0); returns active tips
  K.cuts = (g, list, lt, o = {}) => {
    const tips = [];
    for (const k of list) { const u = (lt - k.t0) / k.d; if (u <= 0) continue; const tip = K.cut(g, k.pts, u, { w: k.w, seed: k.seed, taper: k.taper, add: o.add }); if (tip) tips.push(tip); }
    return tips;
  };
  // a chip curling off each active tip (paper-coloured curl) and the gouge itself on the newest one
  K.chips = (ctx, tips, lt, o = {}) => {
    tips.forEach(([x, y, a], i) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      const r = 5 + 3 * Math.sin(lt * 30 + i); ctx.strokeStyle = COL.paper; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(-r * 0.6, -r, r, 0.3, 0.3 + 4.2); ctx.stroke(); ctx.restore();
    });
    if (o.tool && tips.length) K.gougeTool(ctx, tips[tips.length - 1], lt);
  };
  K.gougeTool = (ctx, [x, y, a], lt) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI); ctx.rotate(-0.35);
    ctx.fillStyle = '#9AA0A3'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(70, -7); ctx.lineTo(70, 7); ctx.closePath(); ctx.fill();   // steel
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(20, -2, 46, 2);
    ctx.fillStyle = '#7A5634'; rr(ctx, 66, -15, 150, 30, 14); ctx.fill();                                                            // handle
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; rr(ctx, 66, 4, 150, 11, 6); ctx.fill();
    ctx.restore();
  };

  // ───────── motifs: each returns {fill(g), cuts: [...], red(g)} built once for its arguments ─────────
  const MEMO = new Map();
  const memo = (key, fn) => { if (!MEMO.has(key)) MEMO.set(key, fn()); return MEMO.get(key); };
  // a ridge line y(x)
  K.ridge = (x, k, base, amp) => base - amp * (0.55 + 0.25 * Math.sin(x * 0.0024 + k * 1.9) + 0.13 * Math.sin(x * 0.0071 + k * 3.3) + 0.05 * Math.sin(x * 0.021 + k));
  // the sky around a sun: horizontal cuts, wide near the sun, stopping at the sun's halo; sun rings; rays
  K.sky = (cx, cy, R, y0, y1, o = {}) => memo(`sky${cx},${cy},${R},${y0},${y1},${o.t0 ?? 0},${o.span ?? 1.6}`, () => {
    const cuts = [], t0 = o.t0 ?? 0, span = o.span ?? 1.6;
    for (let k = 0; k < 6; k++) {            // rings: the sun is cut in concentric bands
      const r = R * (0.25 + 0.15 * k), pts = [];
      for (let a = 0; a <= TAU + 0.05; a += 0.12) pts.push([cx + Math.cos(a - 1.6) * r, cy + Math.sin(a - 1.6) * r, R * (0.07 - 0.006 * k)]);
      cuts.push({ pts, t0: t0 + k * 0.12, d: 0.42, seed: 10 + k, taper: 0.04 });
    }
    let j = 0;
    for (let y = y0; y < y1; y += 15) {
      const pts = [], dy = y - cy;
      for (let x = -40; x <= W + 40; x += 32) {
        const d = Math.hypot(x - cx, dy * 1.4), light = clamp(1 - (d - R * 1.25) / (W * 0.55));
        pts.push([x, y + 3 * Math.sin(x * 0.006 + y * 0.05), d < R * 1.18 ? 0.01 : 1.5 + 11 * light ** 1.6]);
      }
      // split the line around the halo so it does not cross the sun
      let seg = [];
      for (const p of pts) { if (p[2] < 0.1) { if (seg.length > 1) cuts.push({ pts: seg, t0: t0 + 0.5 + Math.abs(dy) / (y1 - y0) * span * 0.6 + hash(j) * 0.25, d: 0.5, seed: 30 + j }); seg = []; } else seg.push(p); j++; }
      if (seg.length > 1) cuts.push({ pts: seg, t0: t0 + 0.5 + Math.abs(dy) / (y1 - y0) * span * 0.6 + hash(j) * 0.25, d: 0.5, seed: 30 + j });
    }
    for (let k = 0; k < 14; k++) {           // short rays just outside the halo
      const a = -Math.PI * 0.95 + k * Math.PI * 0.9 / 13, r0 = R * 1.3, r1 = R * (1.62 + 0.18 * hash(k));
      cuts.push({ pts: [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, 9], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, 4]], t0: t0 + 0.75 + k * 0.05, d: 0.3, seed: 70 + k, taper: 0.3 });
    }
    return cuts;
  });
  // a range of mountains: the black shape (fill) and contour cuts under the ridge (thinner as they go down)
  K.mountain = (k, base, amp, o = {}) => memo(`mt${k},${base},${amp},${o.t0 ?? 0},${o.n ?? 6},${o.gap ?? 20},${o.wk ?? 7.5}`, () => {
    const t0 = o.t0 ?? 0, n = o.n ?? 6, gap = o.gap ?? 20, wk = o.wk ?? 7.5, cuts = [];
    const poly = [[-50, H + 50]]; for (let x = -50; x <= W + 50; x += 16) poly.push([x, K.ridge(x, k, base, amp)]); poly.push([W + 50, H + 50]);
    cuts.push({ pts: Array.from({ length: Math.ceil((W + 100) / 24) }, (_, i) => { const x = -50 + i * 24; return [x, K.ridge(x, k, base, amp) + 7, 4.5]; }), t0, d: 0.9, seed: 200 + k, taper: 0.05 });
    for (let i = 1; i <= n; i++) {
      const pts = [];
      for (let x = -50; x <= W + 50; x += 24) pts.push([x, K.ridge(x, k, base, amp) + 8 + i * gap + 5 * Math.sin(x * 0.011 + i * 2), Math.max(1.2, wk * (1 - i / (n + 1)) ** 1.3)]);
      cuts.push({ pts, t0: t0 + 0.15 + i * (0.6 / n), d: 0.8, seed: 210 + k * 20 + i });
    }
    return { poly, cuts };
  });
  K.fillPoly = (g, poly) => { g.beginPath(); poly.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); };
  // pines along a ridge: black silhouettes with carved highlight ticks on the lit side
  K.pines = (k, base, amp, xs, s = 1) => memo(`pn${k},${base},${amp},${xs.join(',')},${s}`, () => xs.map((x, i) => {
    const y = K.ridge(x, k, base, amp) + 4, h = (80 + 50 * hash(i * 3 + k)) * s, tiers = 4;
    const shape = [[x - 3 * s, y], [x + 3 * s, y]]; const parts = [];
    for (let j = 0; j < tiers; j++) { const ty = y - h * (0.22 + j * 0.2), w = h * (0.42 - j * 0.08); parts.push([[x - w, ty + h * 0.12], [x, ty - h * 0.14], [x + w, ty + h * 0.12]]); }
    const ticks = parts.map((p, j) => ({ pts: [[p[0][0] + 10 * s, p[0][1] - 4 * s, 3 * s], [x - 4 * s, p[1][1] + 14 * s, 2 * s]], seed: 300 + i * 7 + j }));
    return { x, y, h, shape, parts, ticks };
  }));
  K.drawPines = (g, pines, lt = 9, t0 = 0) => {
    for (const p of pines) {
      g.fillRect(p.x - 3, p.y - p.h * 0.3, 6, p.h * 0.3);
      for (const tri of p.parts) { g.beginPath(); g.moveTo(...tri[0]); g.lineTo(...tri[1]); g.lineTo(...tri[2]); g.closePath(); g.fill(); }
      p.ticks.forEach((tk, j) => K.cut(g, tk.pts, (lt - t0 - j * 0.05) / 0.2, { seed: tk.seed, taper: 0.4 }));
    }
  };
  // an onggi jar: the body path (centre cx, base y, height h); bands, a lit side of short vertical cuts, the rim
  K.jarPath = (g, cx, by, h, keep = false) => {
    const w = h * 0.42; if (!keep) g.beginPath(); g.moveTo(cx - w * 0.42, by); g.bezierCurveTo(cx - w * 1.25, by - h * 0.25, cx - w * 1.15, by - h * 0.8, cx - w * 0.45, by - h * 0.93);
    g.lineTo(cx - w * 0.5, by - h); g.lineTo(cx + w * 0.5, by - h); g.lineTo(cx + w * 0.45, by - h * 0.93);
    g.bezierCurveTo(cx + w * 1.15, by - h * 0.8, cx + w * 1.25, by - h * 0.25, cx + w * 0.42, by); g.closePath();
  };
  K.jar = (cx, by, h, t0 = 0) => memo(`jar${cx},${by},${h},${t0}`, () => {
    const w = h * 0.42, sk = h / 300, cuts = [], half = (yy) => { const u = (by - yy) / h; return w * (0.42 + 0.78 * Math.sin(Math.PI * clamp(u * 1.06)) ** 0.8); };
    for (let k = 1; k <= 4; k++) { const yy = by - h * (0.18 + 0.17 * k), hw = half(yy) * 0.93, pts = [];
      for (let a = -0.95; a <= 0.95; a += 0.1) pts.push([cx + Math.sin(a * Math.PI / 2) * hw, yy + 7 * sk * Math.cos(a * Math.PI / 2), 5 * Math.sqrt(sk)]);
      cuts.push({ pts, t0: t0 + 0.1 * k, d: 0.45, seed: 400 + k }); }
    for (let k = 0; k < 13; k++) { const yy = by - h * (0.12 + 0.055 * k), hw = half(yy), x0 = cx - hw * 0.72, ww = (3 + 9 * Math.sin(Math.PI * k / 12)) * Math.sqrt(sk);
      cuts.push({ pts: [[x0, yy - 4, ww], [x0 + hw * 0.18, yy - 4 - h * 0.03, ww * 0.6]], t0: t0 + 0.4 + k * 0.04, d: 0.25, seed: 440 + k, taper: 0.35 }); }
    cuts.push({ pts: [[cx - w * 0.48, by - h * 0.97, 4 * Math.sqrt(sk)], [cx + w * 0.48, by - h * 0.97, 4 * Math.sqrt(sk)]], t0: t0 + 0.9, d: 0.3, seed: 470 });
    return cuts;
  });
  // carved type: the text taken out of the block, revealed left to right by a ragged edge (p 0..1)
  K.carveText = (g, s, x, y, size, p, o = {}) => {
    if (p <= 0) return; g.save(); g.font = K.F(size, o.fam || 'display'); g.textBaseline = 'alphabetic'; g.textAlign = o.align || 'left';
    const w = g.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    g.beginPath(); const xe = x0 - 20 + (w + 40) * clamp(p); g.moveTo(x0 - 30, y - size * 1.2);
    for (let yy = y - size * 1.2; yy <= y + size * 0.4; yy += 10) g.lineTo(xe + 9 * Math.sin(yy * 0.7) + 6 * hash(yy), yy);
    g.lineTo(x0 - 30, y + size * 0.4); g.closePath(); g.clip();
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.fillText(s, x, y); g.restore();
  };
  // printed type (black ink on paper; it gets the ink's specks)
  K.printText = (g, s, x, y, size, a = 1, o = {}) => { if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); g.font = K.F(size, o.fam || 'display'); g.textAlign = o.align || 'left'; g.fillStyle = o.color || COL.ink; g.fillText(s, x, y + (1 - clamp(a)) * 10); g.restore(); };

  // ───────── the pull: the print peels off the block left to right with a curl ─────────
  let blockC = null, printC = null, showC = null, printKey = '';
  K.pull = (ctx, drawPrint, p, key) => {
    if (!printC || printKey !== key) { printC = makeBuf(); printKey = key; drawPrint(printC.g); showC = makeBuf(); showC.g.drawImage(inkB.c, 0, 0); blockC = null; }
    if (!blockC) {                         // the inked block under the sheet: dark wood where cut, black where raised, mirrored
      blockC = makeBuf(); const g = blockC.g;
      g.fillStyle = '#4B3322'; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 160; i++) { const y = hash(i * 4.1) * H; g.strokeStyle = `rgba(30,18,10,${0.2 + 0.3 * hash(i)})`; g.lineWidth = 1 + 3 * hash(i * 2); g.beginPath(); for (let x = 0; x <= W; x += 30) { const yy = y + 8 * Math.sin(x * 0.003 + i); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
      g.save(); g.translate(W, 0); g.scale(-1, 1); g.globalAlpha = 0.92; g.drawImage(showC.c, 0, 0); g.restore();
      const s = g.createLinearGradient(0, 0, W, H); s.addColorStop(0.3, 'rgba(255,255,255,0)'); s.addColorStop(0.5, 'rgba(255,255,255,0.07)'); s.addColorStop(0.7, 'rgba(255,255,255,0)'); g.fillStyle = s; g.fillRect(0, 0, W, H);
    }
    const x = lerp(-120, W + 260, clamp(p)), curl = 120 + 80 * Math.sin(Math.PI * clamp(p));
    ctx.drawImage(blockC.c, 0, 0);
    // the print, already lifted and flat, left of the curl
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, Math.max(0, x - curl * 0.2), H); ctx.clip(); ctx.drawImage(printC.c, 0, 0); ctx.restore();
    // the sheet still lying on the block, right of the curl: the back of the paper with the image showing through
    ctx.save(); ctx.beginPath(); ctx.rect(x + curl, 0, W, H); ctx.clip(); ctx.drawImage(K.paperTex(), 0, 0);
    ctx.globalAlpha = 0.12; ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(showC.c, 0, 0); ctx.restore();
    // the curl itself: a lit cylinder of paper with a shadow on the block
    if (p > 0 && p < 1) {
      const g2 = ctx.createLinearGradient(x - curl * 0.2, 0, x + curl, 0);
      g2.addColorStop(0, 'rgba(60,40,20,0.35)'); g2.addColorStop(0.25, '#F6EFDF'); g2.addColorStop(0.6, '#E8DCC2'); g2.addColorStop(0.92, '#B9A88A'); g2.addColorStop(1, 'rgba(30,20,10,0.5)');
      ctx.fillStyle = g2; ctx.fillRect(x - curl * 0.2, 0, curl * 1.2, H);
      const sh = ctx.createLinearGradient(x + curl, 0, x + curl + 60, 0); sh.addColorStop(0, 'rgba(0,0,0,0.35)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sh; ctx.fillRect(x + curl, 0, 60, H);
    }
  };
  K.resetPull = () => { printC = null; blockC = null; showC = null; printKey = ''; };
  window.PAN = K;
})();
// ───────── shared plates (used by more than one scene) ─────────
(() => {
  const K = PAN, TAU = Math.PI * 2;
  // the village at dusk inside a block border (x0, y0, w, h): red sun low behind the ranges, sky cuts, two ranges,
  // pines, the brewery (a tiled roof, posts, a chimney with smoke) and a red sign; lt drives the carving and the smoke
  K.village = (g, r, lt, o = {}) => {
    const x0 = o.x0 ?? 140, y0 = o.y0 ?? 200, w = o.w ?? W - 280, h = o.h ?? 760, t0 = o.t0 ?? 0, sx = x0 + w * 0.68, sy = y0 + h * 0.5;
    if (r) { r.beginPath(); r.arc(sx, sy, 150, 0, TAU); r.fill(); }
    g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
    g.fillRect(x0, y0, w, h);
    const far = K.mountain(4, y0 + h * 0.66, h * 0.28, { t0: t0 + 0.6, n: 9, gap: 14, wk: 10 });
    g.save(); g.beginPath(); g.moveTo(x0, y0); for (let x = x0; x <= x0 + w; x += 16) g.lineTo(x, K.ridge(x, 4, y0 + h * 0.66, h * 0.28)); g.lineTo(x0 + w, y0); g.closePath(); g.clip();
    K.cuts(g, K.sky(sx, sy, 150, y0 + 10, y0 + h * 0.66, { t0, span: 1.2 }), lt); g.restore();
    K.cuts(g, far.cuts, lt);
    const near = K.mountain(5, y0 + h * 0.86, h * 0.14, { t0: t0 + 0.9, n: 2, gap: 18 });
    K.cuts(g, near.cuts.slice(0, 1), lt);
    K.drawPines(g, K.pines(5, y0 + h * 0.86, h * 0.14, [x0 + 70, x0 + 150, x0 + 240, x0 + w - 260, x0 + w - 170, x0 + w - 90], 1.1), lt, t0 + 1.1);
    // the brewery: a white wall between dark posts, a door, a red sign under the eaves, a tiled roof with upturned
    // eaves cut in light rows, its outline cut white
    const bx = x0 + w * 0.42, by = y0 + h * 0.86, bw = 520;
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(bx - bw / 2 + 30, by - 150, bw - 60, 150); g.restore();
    for (let i = 0; i < 5; i++) g.fillRect(bx - bw / 2 + 30 + i * (bw - 72) / 4, by - 150, 12, 150);
    g.fillRect(bx - bw / 2 + 30, by - 150, bw - 60, 12);
    g.fillRect(bx - 46, by - 108, 92, 108);
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(bx - 3, by - 100, 6, 100); g.restore();
    if (r) { r.fillRect(bx - 90, by - 138, 180, 26); }
    g.lineWidth = 3; g.strokeRect(bx - 90, by - 138, 180, 26);
    g.beginPath(); g.moveTo(bx - bw / 2 - 60, by - 175); g.quadraticCurveTo(bx - bw / 2 + 10, by - 150, bx - bw / 2 + 40, by - 240);
    g.lineTo(bx + bw / 2 - 40, by - 240); g.quadraticCurveTo(bx + bw / 2 - 10, by - 150, bx + bw / 2 + 60, by - 175); g.lineTo(bx + bw / 2 + 20, by - 150); g.lineTo(bx - bw / 2 - 20, by - 150); g.closePath(); g.fill();
    const eave = []; for (let i = 0; i <= 30; i++) { const u = i / 30, x = lerp(bx - bw / 2 - 60, bx + bw / 2 + 60, u); eave.push([x, by - 160 - 14 * Math.sin(Math.PI * u) + (u < 0.12 ? -(0.12 - u) * 160 : u > 0.88 ? -(u - 0.88) * 160 : 0), 6]); }
    K.cut(g, eave, (lt - t0 - 1.1) / 0.5, { seed: 590, taper: 0.03 });
    for (let k = 0; k < 4; k++) {          // tile rows: scalloped cuts along the roof
      const yy = by - 226 + k * 17, pts = [];
      for (let x = bx - bw / 2 + 36 - k * 12; x <= bx + bw / 2 - 36 + k * 12; x += 10) pts.push([x, yy + 5 * Math.abs(Math.sin(x * 0.157)), 5]);
      K.cut(g, pts, (lt - t0 - 1.2 - k * 0.1) / 0.5, { seed: 600 + k, taper: 0.04 });
    }
    g.fillRect(bx + bw / 2 - 150, by - 300, 34, 70);                 // chimney
    for (let k = 0; k < 3; k++) {                                     // smoke: wavy cuts that drift up and to the left
      const ph = (lt * 0.35 + k / 3) % 1, pts = [];
      for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([bx + bw / 2 - 133 - u * 260 - ph * 80, by - 310 - u * 200 - ph * 60 + 14 * Math.sin(u * 6 + lt * 1.4 + k), 3 + 9 * (1 - u) * (1 - ph)]); }
      K.cut(g, pts, clamp((lt - t0 - 1.5) / 0.6), { seed: 640 + k, taper: 0.1 });
    }
    g.restore();
    return { bx, by, bw };
  };
  // the block border: a ragged black frame line around a plate
  K.border = (g, x0, y0, w, h) => { g.save(); g.lineWidth = 7; g.strokeStyle = K.COL.ink; g.beginPath();
    for (let i = 0; i <= 40; i++) { const u = i / 40; g.lineTo(x0 + w * u, y0 + 2 * Math.sin(i * 1.3)); } for (let i = 0; i <= 24; i++) { const u = i / 24; g.lineTo(x0 + w + 2 * Math.sin(i), y0 + h * u); }
    for (let i = 0; i <= 40; i++) { const u = i / 40; g.lineTo(x0 + w * (1 - u), y0 + h + 2 * Math.sin(i * 0.9)); } for (let i = 0; i <= 24; i++) { const u = i / 24; g.lineTo(x0 + 2 * Math.sin(i * 1.7), y0 + h * (1 - u)); }
    g.closePath(); g.stroke(); g.restore(); };
  // a slow push for the hold, so a finished print is never still
  K.push = (ctx, lt, dur, amt = 0.025) => { const z = 1 + amt * clamp(lt / Math.max(1, dur)); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
})();

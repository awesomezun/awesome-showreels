// crayon: the 꼬마 화가 reel's crayon kit (a project module). Every frame draws its crayon marks on one layer and
// then lets the paper's tooth break them (a fixed grain punched out with destination-out), so each stroke reads as
// wax dragged over paper. A line is three thin offset passes; it "boils" (its wobble is re-seeded eight times a
// second) like hand-drawn animation. Colour fills are zig-zag scribbles clipped to their shape, drawn at hand speed.
(() => {
  const K = {};
  let L = null, grain = null, paperTile = null;
  const R = n => hash(n);
  const sm = x => x * x * (3 - 2 * x);
  // smooth 1-D noise: -0.5..0.5, continuous in x
  const sn = (s, x) => { const i = Math.floor(x), f = x - i; return lerp(R(s * 7.13 + i * 1.97), R(s * 7.13 + (i + 1) * 1.97), sm(f)) - 0.5; };
  K.boil = t => Math.floor(t * 8);
  K.COL = { red: '#E2483A', orange: '#F2952B', yellow: '#F6C33B', green: '#58A846', lime: '#9CCB3B', sky: '#68B6E8', blue: '#3E7FD0',
    purple: '#8B5CC4', pink: '#EF7BA5', brown: '#8A5A2E', black: '#34323C', white: '#FFFDF6' };

  // ───────── paper ─────────
  function makePaper() {
    const b = makeBuf(512, 512), g = b.g;
    g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) {                         // short fibres
      const x = R(i * 3.1) * 512, y = R(i * 5.7) * 512, a = R(i * 1.3) * Math.PI, l = 4 + R(i * 2.9) * 14;
      g.strokeStyle = `rgba(120,88,40,${0.035 + 0.05 * R(i * 4.4)})`; g.lineWidth = 0.8;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 2, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(110,80,40,${0.04 + 0.06 * R(i * 9.1)})`; g.fillRect(R(i * 6.3) * 512, R(i * 8.7) * 512, 1.2, 1.2); }
    return b.c;
  }
  function makeGrain() {
    const n = 256, b = makeBuf(n, n), g = b.g, id = g.createImageData(n, n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const i = (y * n + x) * 4, a = R(x * 12.9898 + y * 78.233), f = R(Math.floor(x / 4) * 3.1 + y * 0.71);
      id.data[i + 3] = Math.min(255, (a > 0.6 ? (a - 0.6) / 0.4 * 230 : 0) + (f > 0.88 ? 140 : 0));
    }
    g.putImageData(id, 0, 0); return b.c;
  }
  K.paper = (ctx, P, o = {}) => {
    ctx.fillStyle = o.color || P.bg; ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, W * 0.8);
    v.addColorStop(0, 'rgba(255,252,240,0.35)'); v.addColorStop(1, 'rgba(170,130,70,0.10)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    if (!paperTile) paperTile = makePaper();
    ctx.save(); ctx.fillStyle = ctx.createPattern(paperTile, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
  };
  // the crayon layer: begin() hands out a cleared W x H canvas; end() breaks it with the paper tooth and lays it down
  K.begin = () => {
    if (!L) L = makeBuf(W, H);
    const g = L.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
    g.clearRect(0, 0, W, H); return g;
  };
  K.end = (ctx, o = {}) => {
    const g = L.g; if (!grain) grain = makeGrain();
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = o.tooth ?? 0.8;
    g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, W, H); g.restore();
    ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.drawImage(L.c, 0, 0); ctx.restore();
  };

  // ───────── point lists ─────────
  // a hand-drawn closed loop: radius wobble, a start angle and a small overshoot past the start (the hand goes round)
  K.loop = (cx, cy, rx, ry, seed = 1, o = {}) => {
    const n = o.n ?? 72, over = o.over ?? 0.1, a0 = R(seed * 3.3) * TAU, pts = [];
    for (let i = 0; i <= n * (1 + over); i++) {
      const q = i / n, a = a0 + q * TAU, wob = 1 + (o.wob ?? 0.05) * sn(seed, q * 6) * 2;
      pts.push([cx + Math.cos(a) * rx * wob, cy + Math.sin(a) * ry * wob]);
    }
    return pts;
  };
  // a polyline through corners, densified, each segment slightly bowed
  K.path = (corners, seed = 1, o = {}) => {
    const pts = [], step = o.step ?? 6;
    for (let i = 0; i < corners.length - 1; i++) {
      const [x0, y0] = corners[i], [x1, y1] = corners[i + 1], L0 = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(L0 / step));
      const nx = -(y1 - y0) / (L0 || 1), ny = (x1 - x0) / (L0 || 1), bow = (o.bow ?? 0.02) * L0 * (R(seed * 5 + i) - 0.5) * 2;
      for (let k = 0; k < n; k++) { const q = k / n, b = Math.sin(Math.PI * q) * bow; pts.push([lerp(x0, x1, q) + nx * b, lerp(y0, y1, q) + ny * b]); }
    }
    pts.push(corners[corners.length - 1].slice());
    return pts;
  };
  // a smooth curve through points (Catmull-Rom), for hills, strings and tails
  K.curve = (cps, per = 14) => {
    const out = [], n = cps.length, Q = i => cps[Math.max(0, Math.min(n - 1, i))];
    for (let i = 0; i < n - 1; i++) {
      const p0 = Q(i - 1), p1 = Q(i), p2 = Q(i + 1), p3 = Q(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(d => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
      }
    }
    out.push(cps[n - 1].slice()); return out;
  };

  // ───────── marks ─────────
  // a crayon line along pts, drawn up to fraction u; o: {color, w, seed, t, passes, jitter, alpha}
  K.line = (g, pts, u, o = {}) => {
    if (u <= 0 || !pts || pts.length < 2) return;
    const n = Math.max(2, Math.ceil(pts.length * clamp(u))), b = K.boil(o.t ?? 0), seed = (o.seed ?? 1) + b * 0.37, w = o.w ?? 7, J = o.jitter ?? 1.8;
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = o.color || K.COL.black;
    const passes = o.passes ?? 3;
    for (let k = 0; k < passes; k++) {
      g.globalAlpha = (o.alpha ?? 1) * (k === 0 ? 0.92 : 0.5);
      g.lineWidth = w * (k === 0 ? 0.78 : 0.42 + 0.22 * R(seed * 9 + k));
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const x = pts[i][0] + sn(seed * 3 + k * 11, i / 7) * J * 2 + (k ? (R(seed + k) - 0.5) * w * 0.35 : 0);
        const y = pts[i][1] + sn(seed * 5 + k * 13, i / 7) * J * 2 + (k ? (R(seed * 2 + k) - 0.5) * w * 0.35 : 0);
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
    g.restore();
  };
  // a scribble fill: zig-zag rows at angle a, gap px, inside clip(g); drawn row by row up to u
  K.fill = (g, clip, box, u, o = {}) => {
    if (u <= 0) return;
    const a = o.angle ?? -0.6, gap = o.gap ?? 11, ca = Math.cos(a), sa = Math.sin(a);
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2, D = Math.hypot(box.w, box.h) / 2 + gap, rows = Math.ceil((2 * D) / gap);
    const pts = [];
    for (let r = 0; r <= rows; r++) {
      const v = -D + r * gap, x0 = r % 2 ? D : -D, x1 = -x0;
      for (const uu of [x0, x1]) pts.push([cx + uu * ca - v * sa, cy + uu * sa + v * ca]);
    }
    const dense = K.path(pts, o.seed ?? 3, { step: 14, bow: 0.015 });
    g.save(); clip(g); g.clip();
    K.line(g, dense, u, { color: o.color, w: o.w ?? gap * 1.35, seed: o.seed ?? 3, t: o.t, passes: 2, jitter: 1.4, alpha: o.alpha ?? 0.9 });
    g.restore();
  };
  // text in crayon: a glyph at a time pops on (a slight tilt that settles), drawn into the crayon layer
  K.text = (g, s, x, y, lt, o = {}) => {
    const size = o.size ?? 96, chars = [...s], step = o.step ?? 0.06, dur = o.dur ?? 0.35, b = K.boil(o.t ?? lt);
    g.save(); g.font = `${o.weight ?? 700} ${size}px ${o.fam || FAM.display}`; g.textBaseline = 'alphabetic'; g.fillStyle = o.color || K.COL.black;
    let w = 0; const ws = chars.map(c => g.measureText(c).width + (o.ls ?? 0)); for (const v of ws) w += v;
    let cx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    chars.forEach((c, i) => {
      const p = clamp((lt - i * step) / dur);
      if (p > 0 && c !== ' ') {
        const e = Ease.outBack(p, 2.2), rot = (1 - e) * 0.25 + sn(i * 3 + 1, b * 0.9) * 0.03, dy = sn(i * 7 + 2, b * 0.9) * 2.4;
        g.save(); if (o.colors) g.fillStyle = o.colors[i % o.colors.length]; g.globalAlpha *= clamp(p * 2.5) * (o.alpha ?? 1); g.translate(cx + ws[i] / 2, y + dy); g.rotate(rot); g.scale(0.6 + 0.4 * e, 0.6 + 0.4 * e);
        g.fillText(c, -ws[i] / 2 + (o.ls ?? 0) / 2, 0);
        if (o.outline) { g.lineWidth = o.outline; g.strokeStyle = o.outlineColor || g.fillStyle; g.globalAlpha *= 0.6; g.strokeText(c, -ws[i] / 2, 0); }
        g.restore();
      }
      cx += ws[i];
    });
    g.restore(); return w;
  };
  // an underline scribbled under a word
  K.underline = (g, x0, x1, y, u, o = {}) => K.line(g, K.path([[x0, y], [x0 + (x1 - x0) * 0.5, y + 6], [x1, y - 2]], o.seed ?? 4, { bow: 0.06 }), u, { w: 9, ...o });

  // ───────── the drawing's things (u: 0..1 drawn; t: time for the boil) ─────────
  K.sun = (g, cx, cy, r, u, t, o = {}) => {
    const C = K.COL, rim = K.loop(cx, cy, r, r, 11, { wob: 0.04 });
    K.fill(g, gg => { gg.beginPath(); gg.arc(cx, cy, r * 1.02, 0, TAU); }, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r }, rm(u, 0.25, 0.75), { color: C.yellow, gap: 12, angle: 0.4, seed: 12, t });
    K.line(g, rim, rm(u, 0, 0.3), { color: C.orange, w: 9, seed: 13, t });
    const rays = o.rays ?? 10, spin = o.spin ?? 0;
    for (let i = 0; i < rays; i++) {
      const a = spin + i / rays * TAU, p = rm(u, 0.6 + i * 0.03, 0.75 + i * 0.03);
      K.line(g, K.path([[cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * 1.3], [cx + Math.cos(a) * r * 1.75, cy + Math.sin(a) * r * 1.75]], 20 + i), p, { color: C.orange, w: 8, seed: 21 + i, t });
    }
  };
  K.cloud = (g, cx, cy, s, u, t, seed = 5) => {
    const bumps = [[-1, 0.15, 0.5], [-0.45, -0.25, 0.62], [0.2, -0.35, 0.7], [0.8, -0.05, 0.55], [0.5, 0.3, 0.5], [-0.35, 0.35, 0.5]], pts = [];
    // the outer contour of the bumps: along each ray from the centre, the farthest circle edge
    const a0 = R(seed) * TAU;
    for (let i = 0; i <= 110; i++) {
      const a = a0 + i / 100 * TAU, ux = Math.cos(a), uy = Math.sin(a) / 0.85; let best = 0;
      for (const [bx, by, br] of bumps) { const d = bx * ux + by * uy, q = br * br - (bx * bx + by * by - d * d); if (q >= 0) best = Math.max(best, d + Math.sqrt(q)); }
      pts.push([cx + Math.cos(a) * best * s, cy + Math.sin(a) * best * s]);
    }
    K.fill(g, gg => { gg.beginPath(); bumps.forEach(([bx, by, br]) => { gg.moveTo(cx + bx * s + br * s, cy + by * s); gg.ellipse(cx + bx * s, cy + by * s, br * s, br * s * 0.85, 0, 0, TAU); }); },
      { x: cx - 1.6 * s, y: cy - s, w: 3.2 * s, h: 2 * s }, rm(u, 0.4, 1), { color: C().white, gap: 12, seed: seed + 9, t, alpha: 0.9 });
    K.line(g, pts, rm(u, 0, 0.6), { color: C().sky, w: 7, seed, t });
  };
  const C = () => K.COL;
  K.hills = (g, y0, u, t, o = {}) => {
    const C0 = K.COL, top = K.curve([[-40, y0 + 40], [300, y0 - 30], [700, y0 + 20], [1100, y0 - 50], [1500, y0 + 10], [1960, y0 - 20]], 18);
    K.fill(g, gg => { gg.beginPath(); top.forEach((p, i) => i ? gg.lineTo(p[0], p[1]) : gg.moveTo(p[0], p[1])); gg.lineTo(W + 40, H + 40); gg.lineTo(-40, H + 40); gg.closePath(); },
      { x: 0, y: y0 - 60, w: W, h: H - y0 + 60 }, rm(u, 0.3, 1), { color: o.color || C0.green, gap: 13, angle: -0.25, seed: 31, t });
    K.line(g, top, rm(u, 0, 0.4), { color: o.edge || '#3E8A33', w: 9, seed: 32, t });
  };
  K.house = (g, x, y, w, h, u, t, o = {}) => {
    const C0 = K.COL, seed = o.seed ?? 40, roofH = h * 0.55;
    const walls = K.path([[x, y], [x, y - h], [x + w, y - h], [x + w, y], [x - 4, y]], seed);
    const roof = K.path([[x - w * 0.12, y - h], [x + w / 2, y - h - roofH], [x + w * 1.12, y - h], [x - w * 0.12, y - h]], seed + 1);
    K.fill(g, gg => { gg.beginPath(); gg.rect(x, y - h, w, h); }, { x, y: y - h, w, h }, rm(u, 0.35, 0.6), { color: o.wall || C0.yellow, gap: 12, seed: seed + 2, t });
    K.fill(g, gg => { gg.beginPath(); gg.moveTo(x - w * 0.12, y - h); gg.lineTo(x + w / 2, y - h - roofH); gg.lineTo(x + w * 1.12, y - h); gg.closePath(); },
      { x: x - w * 0.12, y: y - h - roofH, w: w * 1.24, h: roofH }, rm(u, 0.5, 0.75), { color: o.roof || C0.red, gap: 11, angle: 0.5, seed: seed + 3, t });
    K.line(g, walls, rm(u, 0, 0.3), { color: C0.brown, w: 8, seed: seed + 4, t });
    K.line(g, roof, rm(u, 0.15, 0.4), { color: '#B33A2C', w: 8, seed: seed + 5, t });
    const dw = w * 0.24, dh = h * 0.48, wx = x + w * 0.6, ww = w * 0.24;
    K.line(g, K.path([[x + w * 0.16, y], [x + w * 0.16, y - dh], [x + w * 0.16 + dw, y - dh], [x + w * 0.16 + dw, y]], seed + 6), rm(u, 0.7, 0.85), { color: C0.brown, w: 7, seed: seed + 7, t });
    K.line(g, K.path([[wx, y - h * 0.55], [wx + ww, y - h * 0.55], [wx + ww, y - h * 0.55 - ww], [wx, y - h * 0.55 - ww], [wx, y - h * 0.55]], seed + 8), rm(u, 0.8, 0.95), { color: C0.blue, w: 7, seed: seed + 9, t });
    K.line(g, K.path([[wx + ww / 2, y - h * 0.55], [wx + ww / 2, y - h * 0.55 - ww]], seed + 10), rm(u, 0.9, 1), { color: C0.blue, w: 6, seed: seed + 11, t });
  };
  K.tree = (g, x, y, s, u, t, o = {}) => {
    const C0 = K.COL, seed = o.seed ?? 60;
    K.line(g, K.path([[x - s * 0.08, y], [x - s * 0.06, y - s * 0.9]], seed), rm(u, 0, 0.25), { color: C0.brown, w: 10, seed, t });
    K.line(g, K.path([[x + s * 0.08, y], [x + s * 0.06, y - s * 0.9]], seed + 1), rm(u, 0.05, 0.3), { color: C0.brown, w: 10, seed: seed + 1, t });
    K.fill(g, gg => { gg.beginPath(); gg.rect(x - s * 0.08, y - s * 0.9, s * 0.16, s * 0.9); }, { x: x - s * 0.1, y: y - s * 0.9, w: s * 0.2, h: s * 0.9 }, rm(u, 0.2, 0.4), { color: C0.brown, gap: 8, angle: 1.3, seed: seed + 2, t });
    const crown = K.loop(x, y - s * 1.15, s * 0.5, s * 0.45, seed + 3, { wob: 0.09 });
    K.fill(g, gg => { gg.beginPath(); gg.ellipse(x, y - s * 1.15, s * 0.5, s * 0.45, 0, 0, TAU); }, { x: x - s * 0.5, y: y - s * 1.6, w: s, h: s * 0.9 }, rm(u, 0.5, 1), { color: o.leaf || C0.green, gap: 12, seed: seed + 4, t });
    K.line(g, crown, rm(u, 0.35, 0.6), { color: '#3E8A33', w: 9, seed: seed + 5, t });
  };
  K.flower = (g, x, y, s, u, t, col, seed = 70) => {
    const C0 = K.COL;
    K.line(g, K.path([[x, y], [x + 2, y - s * 1.6]], seed), rm(u, 0, 0.4), { color: C0.green, w: 6, seed, t });
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU, px = x + 2 + Math.cos(a) * s * 0.5, py = y - s * 1.6 + Math.sin(a) * s * 0.5;
      K.line(g, K.loop(px, py, s * 0.32, s * 0.32, seed + i, { n: 18 }), rm(u, 0.4 + i * 0.08, 0.55 + i * 0.08), { color: col, w: 7, seed: seed + i, t });
    }
    K.line(g, K.loop(x + 2, y - s * 1.6, s * 0.18, s * 0.18, seed + 9, { n: 14 }), rm(u, 0.85, 1), { color: C0.yellow, w: 8, seed: seed + 9, t });
  };
  K.kite = (g, x, y, s, u, t, o = {}) => {
    const C0 = K.COL, seed = o.seed ?? 80, sw = Math.sin(t * 1.7) * 0.12;
    const P4 = [[0, -s], [s * 0.7, 0], [0, s * 1.2], [-s * 0.7, 0]].map(([px, py]) => [x + px * Math.cos(sw) - py * Math.sin(sw), y + px * Math.sin(sw) + py * Math.cos(sw)]);
    K.fill(g, gg => { gg.beginPath(); P4.forEach((p, i) => i ? gg.lineTo(p[0], p[1]) : gg.moveTo(p[0], p[1])); gg.closePath(); }, { x: x - s, y: y - s, w: 2 * s, h: 2.4 * s }, rm(u, 0.3, 0.7), { color: o.color || C0.pink, gap: 10, seed: seed + 1, t });
    K.line(g, K.path([...P4, P4[0]], seed), rm(u, 0, 0.35), { color: '#C2456F', w: 8, seed, t });
    K.line(g, K.path([P4[0], P4[2]], seed + 2), rm(u, 0.35, 0.45), { color: '#C2456F', w: 5, seed: seed + 2, t });
    K.line(g, K.path([P4[1], P4[3]], seed + 3), rm(u, 0.4, 0.5), { color: '#C2456F', w: 5, seed: seed + 3, t });
    // the tail waves; three bows on it
    const tail = []; for (let i = 0; i <= 24; i++) { const q = i / 24; tail.push([P4[2][0] - q * s * 0.6 + Math.sin(q * 8 - t * 5) * s * 0.18, P4[2][1] + q * s * 2.2]); }
    K.line(g, tail, rm(u, 0.5, 0.8), { color: C0.purple, w: 5, seed: seed + 4, t });
    [8, 15, 22].forEach((k, i) => { const p = tail[k]; K.line(g, K.path([[p[0] - 12, p[1] - 8], [p[0] + 12, p[1] + 8], [p[0] + 12, p[1] - 8], [p[0] - 12, p[1] + 8], [p[0] - 12, p[1] - 8]], seed + 5 + i), rm(u, 0.8 + i * 0.05, 0.9 + i * 0.05), { color: [C0.orange, C0.sky, C0.yellow][i], w: 6, seed: seed + 5 + i, t }); });
    return P4[2];
  };
  // a child as children draw them: a round head, a smile, a triangle dress, stick arms and legs
  K.kid = (g, x, y, s, u, t, o = {}) => {
    const C0 = K.COL, seed = o.seed ?? 90, wave = Math.sin(t * 3) * 0.25 * (o.wave ?? 1);
    K.line(g, K.loop(x, y - s * 1.55, s * 0.32, s * 0.34, seed, { wob: 0.05 }), rm(u, 0, 0.25), { color: C0.black, w: 7, seed, t });
    K.line(g, K.curve([[x - s * 0.13, y - s * 1.5], [x, y - s * 1.42], [x + s * 0.13, y - s * 1.5]], 6), rm(u, 0.2, 0.3), { color: C0.red, w: 6, seed: seed + 1, t });
    g.save(); g.fillStyle = C0.black; [-0.11, 0.11].forEach(dx => { g.beginPath(); g.arc(x + dx * s, y - s * 1.6, s * 0.035, 0, TAU); g.fill(); }); g.restore();
    const dress = [[x, y - s * 1.2], [x + s * 0.38, y - s * 0.45], [x - s * 0.38, y - s * 0.45], [x, y - s * 1.2]];
    K.fill(g, gg => { gg.beginPath(); dress.forEach((p, i) => i ? gg.lineTo(p[0], p[1]) : gg.moveTo(p[0], p[1])); gg.closePath(); }, { x: x - s * 0.4, y: y - s * 1.2, w: s * 0.8, h: s * 0.8 }, rm(u, 0.4, 0.65), { color: o.dress || C0.purple, gap: 9, seed: seed + 2, t });
    K.line(g, K.path(dress, seed + 3), rm(u, 0.25, 0.45), { color: '#5E3D93', w: 7, seed: seed + 3, t });
    K.line(g, K.path([[x - s * 0.15, y - s * 0.45], [x - s * 0.2, y]], seed + 4), rm(u, 0.6, 0.7), { color: C0.black, w: 7, seed: seed + 4, t });
    K.line(g, K.path([[x + s * 0.15, y - s * 0.45], [x + s * 0.2, y]], seed + 5), rm(u, 0.65, 0.75), { color: C0.black, w: 7, seed: seed + 5, t });
    K.line(g, K.path([[x - s * 0.18, y - s * 0.95], [x - s * 0.55, y - s * 0.8]], seed + 6), rm(u, 0.75, 0.85), { color: C0.black, w: 7, seed: seed + 6, t });
    const hx = x + s * 0.18 + Math.cos(-0.9 + wave) * s * 0.45, hy = y - s * 0.95 + Math.sin(-0.9 + wave) * s * 0.45;
    K.line(g, K.path([[x + s * 0.18, y - s * 0.95], [hx, hy]], seed + 7), rm(u, 0.8, 0.9), { color: C0.black, w: 7, seed: seed + 7, t });
    return [hx, hy];
  };
  // an open book seen from above, outlined in crayon; returns the two page rects
  K.book = (g, cx, cy, pw, ph, u, t, o = {}) => {
    const C0 = K.COL, seed = o.seed ?? 100, l = cx - pw, r = cx + pw, top = cy - ph / 2, bot = cy + ph / 2, sag = 18;
    const left = K.path([[cx, top + sag], [l, top], [l, bot], [cx, bot + sag]], seed, { bow: 0.01 });
    const right = K.path([[cx, top + sag], [r, top], [r, bot], [cx, bot + sag]], seed + 1, { bow: 0.01 });
    g.save(); g.fillStyle = C0.white; g.globalAlpha = 0.9 * clamp(u * 3);
    g.beginPath(); g.moveTo(cx, top + sag); g.lineTo(l, top); g.lineTo(l, bot); g.lineTo(cx, bot + sag); g.lineTo(r, bot); g.lineTo(r, top); g.closePath(); g.fill(); g.restore();
    K.line(g, left, rm(u, 0, 0.5), { color: C0.brown, w: 8, seed, t });
    K.line(g, right, rm(u, 0.1, 0.6), { color: C0.brown, w: 8, seed: seed + 1, t });
    K.line(g, K.path([[cx, top + sag], [cx, bot + sag]], seed + 2), rm(u, 0.5, 0.7), { color: C0.brown, w: 6, seed: seed + 2, t });
    return { left: { x: l, y: top, w: pw, h: ph }, right: { x: cx, y: top, w: pw, h: ph } };
  };

  // the head of a line drawn to u (for the crayon stick to ride on): {x, y, a}
  K.head = (pts, u) => { const n = Math.max(2, Math.ceil(pts.length * clamp(u))), a = pts[n - 2], b = pts[n - 1]; return { x: b[0], y: b[1], a: Math.atan2(b[1] - a[1], b[0] - a[0]) }; };
  // a crayon stick (paper wrapper, worn tip) drawn on top of the page, its tip at (x, y), leaning at angle a
  K.stick = (ctx, x, y, col, o = {}) => {
    const len = o.len ?? 230, w = o.w ?? 34, a = o.a ?? -2.2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    ctx.shadowColor = 'rgba(80,50,20,0.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.9, -w * 0.42); ctx.lineTo(w * 0.9, w * 0.42); ctx.closePath(); ctx.fill();
    ctx.fillRect(w * 0.88, -w / 2, len - w, w); ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(w * 0.9, -w / 2 + 3, len - w, 6);
    ctx.fillStyle = '#F4ECD8'; ctx.fillRect(w * 1.5, -w / 2 - 1, len - w * 1.9, w + 2);
    ctx.fillStyle = col; ctx.fillRect(w * 1.5 + 10, -w / 2 - 1, 8, w + 2); ctx.fillRect(len - w * 0.6 - 18, -w / 2 - 1, 8, w + 2);
    ctx.font = `700 ${w * 0.5}px ${FAM.display}`; ctx.fillStyle = 'rgba(60,40,20,0.7)'; ctx.textBaseline = 'middle'; ctx.fillText(o.label || '크레파스', w * 2.1, 1);
    ctx.restore();
  };
  // the child's drawing, whole: s = {hills, house, tree, kid, kite, sun, clouds, flowers} progress 0..1
  K.FLOWERS = Array.from({ length: 26 }, (_, i) => [60 + ((i * 397) % 1820) + hash(i * 3.3) * 40, 900 + hash(i * 7.7) * 130, 22 + hash(i * 5.1) * 14, ['red', 'pink', 'purple', 'orange', 'sky', 'yellow'][i % 6]]);
  K.drawing = (g, t, s, o = {}) => {
    const C0 = K.COL;
    if (s.sun > 0) K.sun(g, 1700, 170, 70, s.sun, t, { spin: t * 0.25 });
    if (s.clouds > 0) { K.cloud(g, 1040, 170, 70, s.clouds, t, 5); K.cloud(g, 1330, 280, 55, rm(s.clouds, 0.3, 1), t, 15); }
    if (s.hills > 0) K.hills(g, 760, s.hills, t);
    if (s.house > 0) K.house(g, 300, 850, 280, 210, s.house, t);
    if (s.tree > 0) K.tree(g, 760, 840, 230, s.tree, t);
    let hand = null;
    if (s.kid > 0) hand = K.kid(g, 1180, 830, 180, s.kid, t);
    if (s.kite > 0) {
      const tail = K.kite(g, 1540, 380 + Math.sin(t * 1.3) * 18, 64, s.kite, t);
      if (hand && s.kite > 0.3) K.line(g, K.curve([hand, [lerp(hand[0], tail[0], 0.5), lerp(hand[1], tail[1], 0.5) + 60], tail], 16), rm(s.kite, 0.3, 0.6), { color: C0.black, w: 3, seed: 88, t, passes: 2 });
    }
    if (s.flowers > 0) K.FLOWERS.forEach(([x, y, sz, c], i) => K.flower(g, x, y, sz, rm(s.flowers, i / 30, i / 30 + 0.2), t, C0[c], 120 + i * 7));
  };
  window.CRAYON = K;
})();

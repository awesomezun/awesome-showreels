// spy: the 작전명 비단 reel's 1960s title-sequence kit (a project module). Flat cut paper: every shape is a polygon
// whose edges are subdivided and nudged so it looks scissor-cut, laid with a thin drop shadow like stacked paper on a
// flat colour field with grain; diagonal bars that sweep in, a walking agent in hat and trench coat, an almond eye, a
// low skyline of tiled roofs and boxy buildings, a red silk ribbon (the one accent), letters that drop in one by one,
// role credits set into the composition, and a red stamp. Display Black Han Sans, text Gothic A1.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { orange: '#E2702A', teal: '#1E6C74', cream: '#EEE4CF', ink: '#151311', red: '#C81E2C', mustard: '#E2B13A' };
  const C = K.COL;
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  let grainC = null;
  K.field = (ctx, col) => { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H);
    if (!grainC) { grainC = makeBuf(); const g = grainC.g; for (let i = 0; i < 12000; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; g.fillRect(hash(i * 1.3) * W, hash(i * 2.7) * H, 1 + hash(i) * 2, 1 + hash(i * 3) * 2); } }
    ctx.drawImage(grainC.c, 0, 0); };
  // scissor-cut edges: subdivide every edge and push points sideways a little (deterministic per shape seed)
  const ragged = (pts, seed = 1, amp = 2.2, step = 22) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)), nx = -(b[1] - a[1]) / (L || 1), ny = (b[0] - a[0]) / (L || 1);
    for (let k = 0; k < n; k++) { const u = k / n, j = (hash(seed * 13.1 + i * 7.3 + k * 1.7) - 0.5) * 2 * amp; out.push([a[0] + (b[0] - a[0]) * u + nx * j, a[1] + (b[1] - a[1]) * u + ny * j]); } } return out; };
  K.cut = (ctx, pts, col, o = {}) => { const r = ragged(pts, o.seed ?? 1, o.amp ?? 2.2);
    if (o.shadow !== false) { ctx.save(); ctx.translate(5, 7); ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); r.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = col; ctx.beginPath(); r.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); };
  K.circle = (ctx, x, y, r, col, o = {}) => K.cut(ctx, Array.from({ length: 48 }, (_, i) => [x + Math.cos(i / 48 * TAU) * r, y + Math.sin(i / 48 * TAU) * r]), col, { ...o, amp: o.amp ?? 1.6 });
  // a diagonal bar across the frame (angle a), offset d from the centre line, width w, swept in by p
  K.bar = (ctx, d, w, a, p, col, seed) => { if (p <= 0) return; const L = 2600 * Ease.outQuint(clamp(p)), c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c, ox = W / 2 + nx * d - c * 1300, oy = H / 2 + ny * d - s * 1300;
    K.cut(ctx, [[ox, oy], [ox + c * L, oy + s * L], [ox + c * L + nx * w, oy + s * L + ny * w], [ox + nx * w, oy + ny * w]], col, { seed }); };
  // the agent: hat, head, trench coat flaring, legs on a walk cycle (ph), facing dir
  K.agent = (ctx, x, y, s, ph, col = C.ink, dir = -1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    const sw = Math.sin(ph * TAU) * 0.45;
    for (const [k, sgn] of [[0, 1], [1, -1]]) { ctx.save(); ctx.translate(0, -230); ctx.rotate(sgn * sw); K.cut(ctx, [[-16, 0], [16, 0], [14, 230], [42, 238], [42, 250], [-14, 250]], col, { seed: 20 + k, shadow: false }); ctx.restore(); }
    K.cut(ctx, [[-70, -540], [60, -540], [92, -300], [110, -190], [-110, -190], [-92, -300]], col, { seed: 3 });
    ctx.save(); ctx.translate(70, -470); ctx.rotate(-0.6 + 0.3 * Math.sin(ph * TAU)); K.cut(ctx, [[-14, 0], [14, 0], [10, 200], [-12, 200]], col, { seed: 4, shadow: false }); ctx.restore();
    K.circle(ctx, 0, -600, 52, col, { seed: 5, shadow: false });
    K.cut(ctx, [[-110, -632], [110, -632], [100, -616], [-100, -616]], col, { seed: 6, shadow: false }); K.cut(ctx, [[-58, -632], [58, -632], [48, -712], [-48, -712]], col, { seed: 7, shadow: false });
    K.cut(ctx, [[-58, -646], [58, -646], [56, -628], [-56, -628]], C.red, { seed: 8, shadow: false });
    ctx.restore(); };
  K.eye = (ctx, x, y, r, open, lt) => { const h = r * 0.55 * open; const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([x - r + 2 * r * u, y - h * Math.sin(Math.PI * u)]); } for (let i = 23; i > 0; i--) { const u = i / 24; pts.push([x - r + 2 * r * u, y + h * Math.sin(Math.PI * u)]); }
    K.cut(ctx, pts, C.cream, { seed: 30 }); ctx.save(); ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.clip();
    const look = 0.3 * Math.sin(lt * 1.3); K.circle(ctx, x + look * r, y, r * 0.42, C.ink, { seed: 31, shadow: false }); K.circle(ctx, x + look * r, y, r * 0.16, C.red, { seed: 32, shadow: false }); ctx.restore(); };
  K.skyline = (ctx, base, col, off = 0) => { for (let i = -1; i < 14; i++) { const x = i * 150 - (off % 150), k = i + Math.floor(off / 150), tall = hash(k * 3.1) > 0.6;
    if (tall) K.cut(ctx, [[x, base], [x, base - 200 - 120 * hash(k)], [x + 120, base - 200 - 120 * hash(k)], [x + 120, base]], col, { seed: 40 + k });
    else K.cut(ctx, [[x - 20, base], [x - 10, base - 70], [x - 30, base - 70], [x + 20, base - 120], [x + 130, base - 120], [x + 180, base - 70], [x + 160, base - 70], [x + 170, base]], col, { seed: 60 + k }); } };
  // the silk ribbon: a red band unrolling along a curve (p 0..1)
  K.ribbon = (ctx, pts, w, p, seed = 1) => { if (p <= 0) return; const L = resample(pts, 120), n = Math.max(2, Math.floor(L.length * clamp(p))), left = [], right = [];
    for (let i = 0; i < n; i++) { const a = L[Math.max(0, i - 1)], b = L[Math.min(L.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, tw = w * (0.55 + 0.45 * Math.cos(i * 0.16)); left.push([L[i][0] - dy / d * tw / 2, L[i][1] + dx / d * tw / 2]); right.push([L[i][0] + dy / d * tw / 2, L[i][1] - dx / d * tw / 2]); }
    K.cut(ctx, [...left, ...right.reverse()], C.red, { seed, amp: 1.2 }); };
  // a title dropped in letter by letter from above with a little spin (p per letter from lt)
  K.title = (ctx, s, x, y, size, lt, o = {}) => { ctx.save(); ctx.font = K.F(size); ctx.textAlign = 'left'; const chars = [...s], ws = chars.map(ch => ctx.measureText(ch).width), tot = ws.reduce((a, b) => a + b, 0); let xx = o.align === 'center' ? x - tot / 2 : x;
    chars.forEach((ch, i) => { const u = (lt - i * (o.stagger ?? 0.07)) / 0.3; if (u > 0 && ch !== ' ') { const e = Ease.outBack(clamp(u), 1.6), yy = y - 260 * (1 - e), r = (hash(i * 3.7) - 0.5) * 0.12 * (1 - clamp(u)) + (hash(i * 5.1) - 0.5) * 0.04;
      ctx.save(); ctx.translate(xx + ws[i] / 2, yy); ctx.rotate(r); ctx.fillStyle = o.shadow || 'rgba(0,0,0,0.22)'; ctx.fillText(ch, -ws[i] / 2 + 7, 9); ctx.fillStyle = o.color || C.ink; ctx.fillText(ch, -ws[i] / 2, 0); ctx.restore(); }
      xx += ws[i]; }); ctx.restore(); };
  K.credit = (ctx, role, name, x, y, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.textAlign = o.align || 'left'; const dx = (1 - Ease.outC(clamp(a))) * 40;
    ctx.fillStyle = o.c1 || C.cream; ctx.font = K.F(34, 'sans', 700); ctx.fillText(role, x - dx, y - 70); ctx.fillStyle = o.c2 || C.cream; ctx.font = K.F(o.size ?? 86); ctx.fillText(name, x - dx, y); ctx.restore(); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'sans', o.w ?? 700); ctx.fillStyle = o.color || C.cream; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 10 * (1 - clamp(a))); ctx.restore(); };
  K.stamp = (ctx, s, x, y, size, p) => { if (p <= 0) return; const sc = 1 + 0.5 * (1 - Ease.outQuint(clamp(p))); ctx.save(); ctx.translate(x, y); ctx.rotate(-0.16); ctx.scale(sc, sc); ctx.globalAlpha = clamp(p * 3);
    ctx.font = K.F(size); ctx.textAlign = 'center'; const w = ctx.measureText(s).width + size * 0.8; ctx.strokeStyle = C.red; ctx.lineWidth = size * 0.08; ctx.strokeRect(-w / 2, -size * 0.8, w, size * 1.3); ctx.fillStyle = C.red; ctx.fillText(s, 0, size * 0.35); ctx.restore(); };
  window.SPY = K;
})();

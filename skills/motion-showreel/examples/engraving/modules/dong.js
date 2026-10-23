// dong: the 한반도 곤충 도감 reel's copperplate kit (a project module). Intaglio engraving in code: plate paper with
// an embossed plate mark; every line is a burin cut that swells and thins along its length (width ∝ the tone it has
// to carry), engraved over time with a glint at the tip; forms are shaded by hatching that follows them (meridians and
// parallels of a dome, wider where the light turns away, cross-hatched in deep shade), so highlights are simply where
// the lines thin out; magnification roundels; and hand colouring last, watercolour washes that bloom from a point
// with darker edges, multiplied over the ink. Type is Nanum Myeongjo, the labels Diphylleia.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { paper: '#F3EEE2', plate: '#ECE5D5', ink: '#1C1A17', brown: '#7A4524', amber: '#B8742F', yellow: '#E2B53A', blue: '#3D6FA8', red: '#B5372B', green: '#5E7B3A' };
  const C = K.COL;
  K.L = (() => { const v = [-0.52, -0.62, 0.59], l = Math.hypot(...v); return v.map(x => x / l); })();
  K.F = (size, fam = 'display', w = 800) => `${w} ${size}px ${FAM[fam]}`;

  // ───────── paper and plate mark ─────────
  let paperC = null;
  K.PM = { x: 96, y: 72, w: W - 192, h: H - 144 };
  K.paper = (ctx) => {
    if (!paperC) {
      paperC = makeBuf(); const g = paperC.g; g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 3000; i++) { const x = hash(i * 1.3) * W, y = hash(i * 2.7) * H; g.fillStyle = i % 2 ? 'rgba(120,100,70,0.06)' : 'rgba(255,255,255,0.35)'; g.fillRect(x, y, 1 + hash(i) * 2, 1); }
      const { x, y, w, h } = K.PM;
      g.fillStyle = C.plate; g.fillRect(x, y, w, h);                                   // the plate tone left by wiping
      for (let i = 0; i < 900; i++) { g.fillStyle = 'rgba(80,60,30,0.035)'; g.fillRect(x + hash(i * 3.3) * w, y + hash(i * 5.1) * h, 30 + 80 * hash(i), 1); }
      g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.75)'; g.strokeRect(x - 2, y - 2, w + 4, h + 4);   // emboss: light outside
      g.lineWidth = 2; g.strokeStyle = 'rgba(90,70,40,0.35)'; g.strokeRect(x + 1, y + 1, w - 2, h - 2);       // and a shadow inside
    }
    ctx.drawImage(paperC.c, 0, 0);
  };

  // ───────── a burin line: swelling width, cut to fraction u ─────────
  const CUM = new WeakMap();
  const cum = p => { let c = CUM.get(p); if (!c) { c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); CUM.set(p, c); } return c; };
  K.line = (ctx, pts, u, w, o = {}) => {
    if (u <= 0 || pts.length < 2) return null;
    const c = cum(pts), Lt = c[c.length - 1], upto = Lt * Math.min(1, u), sw = o.swell ?? 0.7, left = [], right = []; let tip = null;
    for (let i = 0; i < pts.length; i++) {
      let [x, y, k] = pts[i]; k = k ?? 1;
      if (c[i] > upto) { const [px, py] = pts[i - 1], f = (upto - c[i - 1]) / Math.max(1e-6, c[i] - c[i - 1]); x = px + (x - px) * f; y = py + (y - py) * f; }
      const s = Math.min(c[i], upto) / Lt, a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
      const hw = Math.max(0.18, w * k * ((1 - sw) + sw * Math.pow(Math.sin(Math.PI * s), 0.7)) / 2);
      left.push([x + nx * hw, y + ny * hw]); right.push([x - nx * hw, y - ny * hw]);
      if (c[i] >= upto) { tip = [x, y]; break; }
    }
    if (left.length < 2) return null;
    ctx.beginPath(); left.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]); ctx.closePath(); ctx.fill();
    return u < 1 ? tip : null;
  };
  // a list of timed lines {pts, w, t0, d, swell}; returns the tips being cut (for the glint)
  K.lines = (ctx, list, lt, o = {}) => {
    ctx.save(); ctx.fillStyle = o.color || C.ink; const tips = [];
    for (const l of list) { const u = (lt - l.t0) / l.d; if (u <= 0) continue;
      if (l.disc) { const [x, y, r] = l.disc; ctx.beginPath(); ctx.arc(x, y, r * Ease.outBack(Math.min(1, u)), 0, Math.PI * 2); ctx.fill(); continue; }
      const tip = K.line(ctx, l.pts, u, l.w, l); if (tip) tips.push(tip); }
    ctx.restore(); return tips;
  };
  K.glint = (ctx, tips, lt) => { ctx.save(); tips.slice(-3).forEach(([x, y], i) => { ctx.globalAlpha = 0.85; sparkle(ctx, x, y, 7 + 3 * Math.sin(lt * 40 + i), 1, lt * 3, '#FFF8E8'); }); ctx.restore(); };

  // ───────── shapes as engraving ─────────
  K.ell = (cx, cy, rx, ry, rot = 0, n = 64, a0 = 0, a1 = TAU) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
  // shade of a dome (ellipsoid) at local (x, y): 0 lit .. 1 dark
  const shadeAt = (x, y, rx, ry, rot) => {
    const c = Math.cos(-rot), s = Math.sin(-rot), lx = x * c - y * s, ly = x * s + y * c;
    const nx = lx / rx, ny = ly / ry, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const wx = nx * Math.cos(rot) - ny * Math.sin(rot), wy = nx * Math.sin(rot) + ny * Math.cos(rot);
    return clamp(1 - Math.max(0, wx * K.L[0] + wy * K.L[1] + nz * K.L[2]) * 1.15);
  };
  // hatching over a dome: 'long' = meridians along ry, 'across' = parallels; per-point width from the shade; a
  // second, crossing family where it is darkest. o: n, wmax, t0, span (time spread), dur, cross (threshold), bow
  K.dome = (cx, cy, rx, ry, rot = 0, o = {}) => {
    const n = o.n ?? 22, wmax = o.wmax ?? 3.2, t0 = o.t0 ?? 0, span = o.span ?? 1.2, out = [];
    const make = (family, k, m) => {
      const v = -0.94 + 1.88 * k / (m - 1), pts = [];
      for (let j = 0; j <= 26; j++) {
        const s = -1 + 2 * j / 26; let lx, ly;
        if (family === 'long') { ly = s * ry * Math.sqrt(1 - v * v) * 0.98; lx = v * rx * Math.sqrt(Math.max(0, 1 - (ly / ry) ** 2)); }
        else { lx = s * rx * Math.sqrt(1 - v * v) * 0.98; ly = v * ry * Math.sqrt(Math.max(0, 1 - (lx / rx) ** 2)) + (o.bow ?? 0.08) * ry * (1 - s * s); }
        const x = lx * Math.cos(rot) - ly * Math.sin(rot), y = lx * Math.sin(rot) + ly * Math.cos(rot), sh = shadeAt(x, y, rx, ry, rot);
        pts.push([cx + x, cy + y, 0.12 + 1.0 * Math.pow(sh, 1.4), sh]);
      }
      return pts;
    };
    const fam = o.dir || 'long';
    for (let k = 0; k < n; k++) out.push({ pts: make(fam, k, n), w: wmax, t0: t0 + span * k / n, d: o.dur ?? 0.45, swell: 0.35 });
    if (o.cross !== false) {
      const other = fam === 'long' ? 'across' : 'long', m = Math.round(n * 0.8), th = o.cross ?? 0.62;
      for (let k = 0; k < m; k++) {
        const pts = make(other, k, m); let seg = [];
        const push = () => { if (seg.length > 2) out.push({ pts: seg.map(p => [p[0], p[1], (p[3] - th) / (1 - th) * 0.9 + 0.1]), w: wmax * 0.8, t0: t0 + span + 0.2 + span * 0.6 * k / m, d: 0.35, swell: 0.5 }); seg = []; };
        for (const p of pts) { if (p[3] > th) seg.push(p); else push(); } push();
      }
    }
    return out;
  };
  K.outline = (pts, w, t0, d = 0.6) => ({ pts: pts.map(p => [p[0], p[1], 1]), w, t0, d, swell: 0.45 });
  // a hatched band between two curves (a mandible, a vein band): m lines blending from curve A to curve B
  K.band = (A, B, m, w, t0, d = 0.4, kfn = () => 1) => Array.from({ length: m }, (_, i) => { const f = (i + 0.5) / m; return { pts: A.map((a, j) => [lerp(a[0], B[j][0], f), lerp(a[1], B[j][1], f), kfn(f, j)]), w, t0: t0 + i * 0.04, d, swell: 0.6 }; });

  // ───────── magnification roundel ─────────
  K.roundel = (ctx, cx, cy, r, p, focus, zoom, drawFn, o = {}) => {
    if (p <= 0) return; const e = Ease.outBack(clamp(p), 1.2), rr2 = r * e;
    if (o.leader) { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.setLineDash([6, 5]); ctx.globalAlpha = clamp(p * 2);
      ctx.beginPath(); ctx.moveTo(focus[0], focus[1]); ctx.lineTo(cx - (cx - focus[0]) * rr2 / Math.hypot(cx - focus[0], cy - focus[1]), cy - (cy - focus[1]) * rr2 / Math.hypot(cx - focus[0], cy - focus[1])); ctx.stroke();
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(focus[0], focus[1], r / zoom, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, rr2, 0, TAU); ctx.fillStyle = C.paper; ctx.fill(); ctx.clip();
    ctx.translate(cx, cy); ctx.scale(zoom * e, zoom * e); ctx.translate(-focus[0], -focus[1]); drawFn(ctx); ctx.restore();
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, rr2, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rr2 + 9, 0, TAU); ctx.stroke(); ctx.restore();
  };

  // ───────── hand colouring ─────────
  let washB = null;
  // shapeFn(g) fills the area to colour; it blooms from `at` with a ragged edge (p 0..1) and keeps a darker rim
  K.wash = (ctx, shapeFn, color, p, at, o = {}) => {
    if (p <= 0) return; if (!washB) washB = makeBuf(); const g = washB.g;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
    g.save(); g.filter = 'blur(2px)'; g.fillStyle = color; shapeFn(g); g.restore();
    g.save(); g.globalAlpha = 0.5; g.filter = 'blur(3px)'; g.strokeStyle = color; g.lineWidth = 5; shapeFn(g, true); g.restore();
    const R = (o.r ?? 700) * Ease.outC(clamp(p)); g.globalCompositeOperation = 'destination-in'; g.beginPath();
    for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, rr2 = R * (1 + 0.12 * Math.sin(a * 5 + 1) + 0.07 * Math.sin(a * 11 + 3)); i ? g.lineTo(at[0] + Math.cos(a) * rr2, at[1] + Math.sin(a) * rr2) : g.moveTo(at[0] + Math.cos(a) * rr2, at[1] + Math.sin(a) * rr2); }
    g.closePath(); g.fill(); g.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha *= o.alpha ?? 0.62; ctx.drawImage(washB.c, 0, 0); ctx.restore();
  };

  // ───────── type ─────────
  K.title = (ctx, s, x, y, size, p, o = {}) => {       // engraved title: revealed left to right behind a burin glint
    if (p <= 0) return; ctx.save(); ctx.font = K.F(size, o.fam || 'display', o.weight ?? 800); ctx.textAlign = o.align || 'left';
    const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, xe = x0 + (w + 10) * clamp(p);
    ctx.beginPath(); ctx.rect(x0 - 10, y - size * 1.2, xe - x0 + 10, size * 1.6); ctx.clip(); ctx.fillStyle = o.color || C.ink; ctx.fillText(s, x, y); ctx.restore();
    if (p < 1) { ctx.save(); sparkle(ctx, xe, y - size * 0.35, 12, 0.9, p * 6, '#FFF6DA'); ctx.restore(); }
  };
  K.label = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'sans', o.weight ?? 400); ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || C.ink; ctx.fillText(s, x, y + 8 * (1 - clamp(a))); ctx.restore(); };
  // a scale bar: 1 cm in plate units
  K.scale = (ctx, x, y, len, label, p) => { if (p <= 0) return; ctx.save(); ctx.fillStyle = C.ink; const l = len * Ease.outC(clamp(p)); ctx.fillRect(x, y, l, 4); ctx.fillRect(x, y - 8, 2, 20); if (p > 0.6) ctx.fillRect(x + len - 2, y - 8, 2, 20);
    ctx.font = K.F(26, 'sans', 400); ctx.globalAlpha = clamp((p - 0.6) * 3); ctx.fillText(label, x + len + 14, y + 10); ctx.restore(); };
  K.push = (ctx, lt, dur, amt = 0.02, fx = W / 2, fy = H / 2) => { const z = 1 + amt * clamp(lt / Math.max(1, dur)); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); };
  window.DONG = K;
})();

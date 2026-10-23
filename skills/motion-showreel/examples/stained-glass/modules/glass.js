// glass: the 빛뜰 미술관 reel's stained-glass kit (a project module). A window built like a real one: a Voronoi
// tessellation clipped to an arched frame, its seeds placed in pairs on each figure's outline (the sun, three flowers,
// leaves, a bird) so the lead lines follow the drawing; every piece takes its colour from the figure its seed sits in.
// Pieces glow when lit (a gradient from a bright centre, a per-piece shade, the time of day as a tint, a soft bloom
// added in 'lighter'), the lead is dark came with a highlight, and the same window falls on the stone floor as
// coloured light through a skew. Display type is Grandiflora One, text Gowun Batang.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { cobalt: '#2856A8', sky: '#4A8CD0', sky2: '#6FA9DE', ruby: '#B8243A', rose: '#D8546A', amber: '#E8A33C', gold: '#F4CD55', emerald: '#2E8B57', leaf: '#6DB04B', violet: '#7A4DA8', clear: '#D6E6EA', lead: '#26262B', stone: '#1B1A20' };
  const C = K.COL;
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  K.WW = 760; K.WH = 940;
  // the arched outline (window units): a rectangle under a semicircle
  const ARCH = (() => { const p = []; for (let i = 0; i <= 48; i++) { const a = Math.PI + Math.PI * i / 48; p.push([380 + Math.cos(a) * 380, 380 + Math.sin(a) * 380]); } p.push([760, 940], [0, 940]); return p; })();
  K.ARCH = ARCH;
  // half-plane clip of a convex polygon by the bisector of a and b (keep a's side)
  const clipHalf = (poly, a, b) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1], side = p => (p[0] - mx) * nx + (p[1] - my) * ny, out = [];
    for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length], sp = side(p), sq = side(q);
      if (sp <= 0) out.push(p); if ((sp < 0) !== (sq < 0) && sp !== sq) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } }
    return out;
  };
  // the figures: which colour a point takes (window units)
  const FLOWERS = [[190, 640, 92, 'ruby'], [570, 610, 84, 'violet'], [380, 770, 76, 'rose']];
  const LEAVES = [[250, 760, 70, 26, 0.6], [140, 760, 64, 24, -0.7], [500, 720, 66, 24, -0.6], [630, 730, 60, 22, 0.7], [440, 860, 60, 22, 0.4], [320, 860, 60, 22, -0.4]];
  const SUN = [380, 300, 110];
  const kindAt = (x, y) => {
    const dEdge = Math.min(y < 380 ? 380 - Math.hypot(x - 380, y - 380) : Infinity, x, 760 - x, 940 - y);
    if (dEdge < 34) return ((Math.round((x + y) / 60)) % 2) ? 'ruby' : 'amber';
    const ds = Math.hypot(x - SUN[0], y - SUN[1]);
    if (ds < SUN[2]) return ds < SUN[2] * 0.55 ? 'gold' : 'amber';
    if (ds < SUN[2] * 1.65) { const a = Math.atan2(y - SUN[1], x - SUN[0]); return (Math.floor((a + TAU) / (TAU / 16)) % 2) ? 'gold' : 'sky2'; }
    for (const [fx, fy, r, col] of FLOWERS) { const d = Math.hypot(x - fx, y - fy); if (d < r * 0.28) return 'amber'; if (d < r) return col; }
    for (const [lx, ly, a, b, rot] of LEAVES) { const c = Math.cos(-rot), s = Math.sin(-rot), u = (x - lx) * c - (y - ly) * s, v = (x - lx) * s + (y - ly) * c; if ((u / a) ** 2 + (v / b) ** 2 < 1) return 'leaf'; }
    if (y > 880) return 'emerald';
    if (Math.abs(x - 380) < 12 && y > 700 && y < 880) return 'emerald';
    const bx = 600, by = 200; if (Math.hypot((x - bx) * 0.7, y - by) < 38 && y < by + 20) return 'clear';      // a bird
    return y < 520 ? (hash(Math.floor(x / 70) * 7 + Math.floor(y / 70)) > 0.5 ? 'sky' : 'cobalt') : (hash(Math.floor(x / 70) * 3 + Math.floor(y / 70) * 11) > 0.45 ? 'cobalt' : 'sky');
  };
  K.design = (() => { let D = null; return () => {
    if (D) return D;
    const seeds = [];
    for (let y = 40; y < 940; y += 82) for (let x = 40 + (y / 82 % 2) * 41; x < 760; x += 82) { const sx = x + (hash(x * 3.1 + y) - 0.5) * 44, sy = y + (hash(y * 5.7 + x) - 0.5) * 44; seeds.push([sx, sy]); }
    const ring = (cx, cy, r, n, d = 9) => { for (let i = 0; i < n; i++) { const a = i / n * TAU + 0.2; seeds.push([cx + Math.cos(a) * (r - d), cy + Math.sin(a) * (r - d)], [cx + Math.cos(a) * (r + d), cy + Math.sin(a) * (r + d)]); } };
    ring(SUN[0], SUN[1], SUN[2], 14); ring(SUN[0], SUN[1], SUN[2] * 0.55, 7); ring(SUN[0], SUN[1], SUN[2] * 1.65, 16);
    for (const [fx, fy, r] of FLOWERS) { ring(fx, fy, r, 10); ring(fx, fy, r * 0.28, 5, 6); }
    for (let i = 0; i <= 36; i++) { const a = Math.PI + Math.PI * i / 36; for (const r of [363, 326]) seeds.push([380 + Math.cos(a) * r, 380 + Math.sin(a) * r]); }   // the border band
    for (let y = 410; y < 930; y += 52) for (const x of [17, 54, 706, 743]) seeds.push([x, y]);
    for (let x = 60; x < 720; x += 52) { seeds.push([x, 923], [x + 26, 886]); }
    // drop seeds that sit too close to each other (they make slivers)
    const S = []; for (const p of seeds) if (p[0] > 2 && p[0] < 758 && p[1] < 938 && (p[1] > 380 || Math.hypot(p[0] - 380, p[1] - 380) < 378) && !S.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 13)) S.push(p);
    const cells = S.map((s, i) => {
      let poly = ARCH.slice();
      for (let j = 0; j < S.length; j++) if (j !== i && Math.abs(S[j][0] - s[0]) < 170 && Math.abs(S[j][1] - s[1]) < 170) { poly = clipHalf(poly, s, S[j]); if (poly.length < 3) break; }
      const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length, cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
      return { poly, c: [cx, cy], kind: kindAt(s[0], s[1]), shade: 0.85 + 0.3 * hash(i * 1.37), order: Math.hypot(cx - SUN[0], cy - SUN[1]) + 40 * hash(i * 2.9) };
    }).filter(c => c.poly.length >= 3);
    const mx = Math.max(...cells.map(c => c.order)); cells.forEach(c => c.order /= mx);
    D = { cells }; return D;
  }; })();

  // ───────── drawing ─────────
  K.wall = (ctx, o = {}) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#16151B'); g.addColorStop(1, '#0E0D12'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 2;
    for (let y = 40; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = (y / 90 % 2) * 90; x < W; x += 180) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 90); ctx.stroke(); } }
    ctx.restore();
  };
  const rgb = hex => parseColor(hex);
  // the window at (x, y) scale s. o.light 0..1, o.tint (CSS colour multiplied in), o.lit(cell) -> 0..1 per piece,
  // o.lead 0..1 (how much of the came is drawn), o.band (x of a brighter band of sun moving across, window units)
  K.window = (ctx, x, y, s, o = {}) => {
    const D = K.design(), L = o.light ?? 1, tint = rgb(o.tint || '#FFFFFF'), lead = o.lead ?? 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#0A0A0D'; ctx.beginPath(); ARCH.forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fill();
    for (const c of D.cells) {
      const lit = clamp(o.lit ? o.lit(c) : 1) * L; if (lit <= 0.01) continue;
      const band = o.band != null ? 1 + 0.35 * Math.exp(-((((c.c[0] + c.c[1] * 0.4) - o.band) / 160) ** 2)) : 1;
      const [r, g, b] = rgb(C[c.kind]), k = lit * c.shade * band;
      const col = (f) => `rgb(${Math.min(255, r * tint[0] / 255 * k * f) | 0},${Math.min(255, g * tint[1] / 255 * k * f) | 0},${Math.min(255, b * tint[2] / 255 * k * f) | 0})`;
      const gr = ctx.createRadialGradient(c.c[0] - 8, c.c[1] - 10, 2, c.c[0], c.c[1], 60); gr.addColorStop(0, col(1.35)); gr.addColorStop(1, col(0.85));
      ctx.fillStyle = gr; ctx.beginPath(); c.poly.forEach(([a, b2], i) => i ? ctx.lineTo(a, b2) : ctx.moveTo(a, b2)); ctx.closePath(); ctx.fill();
    }
    if (o.glow !== false && L > 0.05) {      // light spilling past the lead: a blurred copy added on top
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.28 * L; ctx.filter = 'blur(14px)';
      for (const c of D.cells) { const lit = clamp(o.lit ? o.lit(c) : 1); if (lit < 0.3) continue; ctx.fillStyle = C[c.kind]; ctx.beginPath(); c.poly.forEach(([a, b2], i) => i ? ctx.lineTo(a, b2) : ctx.moveTo(a, b2)); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    // the came: dark lead with a thin highlight, drawn in order out from the sun (lead 0..1)
    ctx.lineJoin = 'round';
    for (const c of D.cells) {
      if (c.order > lead * 1.02) continue;
      ctx.beginPath(); c.poly.forEach(([a, b2], i) => i ? ctx.lineTo(a, b2) : ctx.moveTo(a, b2)); ctx.closePath();
      ctx.strokeStyle = C.lead; ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = 'rgba(190,190,200,0.22)'; ctx.lineWidth = 1.6; ctx.stroke();
    }
    ctx.strokeStyle = '#2E2C32'; ctx.lineWidth = 22; ctx.beginPath(); ARCH.forEach(([a, b2], i) => i ? ctx.lineTo(a, b2) : ctx.moveTo(a, b2)); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  };
  // the window's light on the floor: the pieces through a skew, added as soft coloured light
  K.floorLight = (ctx, fx, fy, sx, sy, shear, a, o = {}) => {
    const D = K.design(), tint = rgb(o.tint || '#FFFFFF');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.filter = `blur(${o.blur ?? 10}px)`;
    ctx.setTransform(sx, 0, shear, sy, fx, fy);
    for (const c of D.cells) { const [r, g, b] = rgb(C[c.kind]); ctx.fillStyle = `rgb(${r * tint[0] / 255 | 0},${g * tint[1] / 255 | 0},${b * tint[2] / 255 | 0})`; ctx.beginPath(); c.poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  };
  K.floor = (ctx, y0) => {           // stone floor in perspective from y0 to the bottom
    const g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, '#141318'); g.addColorStop(1, '#232129'); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2;
    for (let k = -14; k <= 14; k++) { ctx.beginPath(); ctx.moveTo(W / 2 + k * 40, y0); ctx.lineTo(W / 2 + k * 260, H); ctx.stroke(); }
    for (let k = 1; k < 9; k++) { const y = y0 + (H - y0) * (k / 9) ** 1.6; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  };
  // light shafts from the window to the floor, with dust drifting in them
  K.shafts = (ctx, top, bottom, a, lt) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, top[0][1], 0, bottom[0][1]); g.addColorStop(0, `rgba(255,236,200,${0.10 * a})`); g.addColorStop(1, `rgba(255,236,200,${0.02 * a})`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(...top[0]); ctx.lineTo(...top[1]); ctx.lineTo(...bottom[1]); ctx.lineTo(...bottom[0]); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 70; i++) { const u = hash(i * 1.7), v = (hash(i * 3.9) + lt * (0.02 + 0.03 * hash(i))) % 1, x = lerp(lerp(top[0][0], top[1][0], u), lerp(bottom[0][0], bottom[1][0], u), v), y = lerp(top[0][1], bottom[0][1], v) + 8 * Math.sin(lt + i);
      ctx.fillStyle = `rgba(255,240,215,${(0.25 + 0.4 * hash(i * 7)) * a})`; ctx.beginPath(); ctx.arc(x, y, 1.2 + 1.6 * hash(i * 5), 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display', o.w ?? 400); ctx.fillStyle = o.color || '#F3E9D8'; ctx.textAlign = o.align || 'left'; if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 24; } ctx.fillText(s, x, y + 10 * (1 - clamp(a))); ctx.restore(); };
  K.TINT = { dawn: '#C9DBFF', noon: '#FFFFFF', dusk: '#FFC48A' };
  window.GLASS = K;
})();

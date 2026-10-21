// info: the 한빛시 자전거 리포트 reel's infographic kit (a project module). A paper ground; an isometric city map
// (river, parks, a road grid, bike lanes drawn on with riders running along them, hubs that pulse); isometric bars
// that grow out of the ground; numbers that count up; a donut; a timeline. Every chart carries the label 가상 데이터.
(() => {
  const K = {};
  const R = n => hash(n);
  K.COL = { paper: '#F4EFE6', ink: '#23262B', ink2: '#4A4F57', navy: '#234E70', teal: '#2A9D8F', yellow: '#E9C46A', orange: '#F4A261', red: '#E76F51', water: '#BFD9E6', park: '#CFE3B4', road: '#E2D6C1', lane: '#E76F51' };
  K.paper = (ctx, o = {}) => {
    ctx.fillStyle = o.color || K.COL.paper; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.strokeStyle = 'rgba(35,38,43,0.05)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
    ctx.restore();
    const v = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H / 2, W * 0.75); v.addColorStop(0, 'rgba(255,255,255,0.45)'); v.addColorStop(1, 'rgba(120,100,70,0.12)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  };
  K.f = (size, w = 800) => `${w} ${size}px ${FAM.display}`;
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size, o.w ?? 800); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic'; ctx.globalAlpha *= o.alpha ?? 1; if (o.ls) ctx.letterSpacing = o.ls + 'px'; ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w; };
  // a line that rises out of a mask (o.at: start time, o.dur)
  K.rise = (ctx, s, x, y, size, lt, o = {}) => {
    const p = Ease.outExpo(clamp((lt - (o.at ?? 0)) / (o.dur ?? 0.6))); if (p <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 1.1, W, size * 1.45); ctx.clip();
    K.text(ctx, s, x, y + size * 0.9 * (1 - p), size, { ...o, alpha: (o.alpha ?? 1) * clamp(p * 2) }); ctx.restore();
  };
  // the data label every chart carries
  K.tag = (ctx, x, y, o = {}) => {
    ctx.save(); ctx.font = K.f(22, 700); const s = o.s || '가상 데이터', w = ctx.measureText(s).width + 28;
    ctx.globalAlpha *= o.alpha ?? 1; ctx.fillStyle = 'rgba(35,38,43,0.08)'; ctx.beginPath(); ctx.roundRect(x - (o.align === 'right' ? w : 0), y - 30, w, 40, 20); ctx.fill();
    ctx.fillStyle = K.COL.ink2; ctx.textBaseline = 'middle'; ctx.fillText(s, x - (o.align === 'right' ? w : 0) + 14, y - 10); ctx.restore();
  };
  // isometric prism standing on (x, y) (front-bottom corner of the front face), w wide, d deep, h tall
  K.bar = (ctx, x, y, w, d, h, col, o = {}) => {
    if (h <= 0.5) return;
    const dx = d * 0.866, dy = d * 0.5;
    const shade = (c, k) => mix(c, '#000000', k), lite = (c, k) => mix(c, '#FFFFFF', k);
    ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = 'rgba(40,30,20,0.12)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w + dx + 26, y - dy + 6); ctx.lineTo(x + dx + 26, y - dy + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x, y - h, w, h);                                               // front
    ctx.fillStyle = shade(col, 0.22); ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + dx, y - dy); ctx.lineTo(x + w + dx, y - dy - h); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lite(col, 0.25); ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + w, y - h); ctx.lineTo(x + w + dx, y - dy - h); ctx.lineTo(x + dx, y - dy - h); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  // ───────── the isometric map ─────────
  // ground coordinates gx, gy in 0..1000; s = px per unit; (ox, oy) = screen position of ground (0, 0)
  K.iso = (m, gx, gy) => [m.ox + (gx - gy) * 0.866 * m.s, m.oy + (gx + gy) * 0.5 * m.s];
  K.RIVER = [[0, 620], [150, 600], [300, 640], [450, 560], [620, 520], [780, 560], [1000, 500]];
  K.PARKS = [[[120, 180], [300, 160], [320, 330], [140, 350]], [[640, 700], [820, 690], [860, 880], [660, 900]], [[480, 300], [600, 290], [610, 420], [470, 430]]];
  K.LANES = [[[0, 560], [150, 545], [300, 585], [450, 505], [620, 465], [780, 505], [1000, 445]], [[400, 0], [400, 200], [520, 260], [520, 1000]], [[0, 300], [380, 300], [700, 250], [1000, 260]], [[150, 1000], [250, 760], [420, 700], [700, 640], [900, 800], [1000, 820]]];
  K.HUBS = [[400, 200, '시청'], [520, 480, '강변'], [700, 250, '북문'], [250, 760, '남부'], [900, 800, '신도시'], [150, 545, '서강']];
  const path = (ctx, m, pts) => { ctx.beginPath(); pts.forEach(([gx, gy], i) => { const [x, y] = K.iso(m, gx, gy); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); };
  K.map = (ctx, m, p, t) => {
    const C = K.COL;
    // ground plate
    ctx.save(); ctx.globalAlpha *= clamp(p.ground * 1.5);
    const corners = [[0, 0], [1000, 0], [1000, 1000], [0, 1000]];
    ctx.save(); path(ctx, { ...m, oy: m.oy + 22 }, corners); ctx.closePath(); ctx.fillStyle = 'rgba(120,95,60,0.25)'; ctx.fill(); ctx.restore();
    path(ctx, m, corners); ctx.closePath(); ctx.fillStyle = '#FBF7EF'; ctx.fill();
    ctx.restore();
    // roads
    ctx.save(); ctx.strokeStyle = C.road; ctx.lineWidth = 7 * m.s; ctx.lineCap = 'round';
    for (let i = 1; i < 10; i++) { const q = rm(p.roads, i / 12, i / 12 + 0.3); if (q <= 0) continue; path(ctx, m, [[i * 100, 0], [i * 100, 1000 * q]]); ctx.stroke(); path(ctx, m, [[0, i * 100], [1000 * q, i * 100]]); ctx.stroke(); }
    ctx.restore();
    // river and parks
    if (p.water > 0) { ctx.save(); ctx.globalAlpha *= clamp(p.water * 1.4); const top = K.RIVER, bot = K.RIVER.map(([x, y]) => [x, y + 70]).reverse();
      path(ctx, m, [...top, ...bot]); ctx.closePath(); ctx.fillStyle = C.water; ctx.fill(); ctx.restore(); }
    K.PARKS.forEach((pk, i) => { const q = Ease.outBack(clamp((p.parks - i * 0.15) / 0.4)); if (q <= 1e-3) return; const cx = pk.reduce((a, b) => a + b[0], 0) / 4, cy = pk.reduce((a, b) => a + b[1], 0) / 4;
      ctx.save(); path(ctx, m, pk.map(([x, y]) => [cx + (x - cx) * q, cy + (y - cy) * q])); ctx.closePath(); ctx.fillStyle = C.park; ctx.fill();
      for (let k = 0; k < 6; k++) { const [tx, ty] = K.iso(m, cx + (R(i * 9 + k) - 0.5) * 120 * q, cy + (R(i * 5 + k * 3) - 0.5) * 120 * q); ctx.fillStyle = '#7FB069'; ctx.beginPath(); ctx.arc(tx, ty - 10 * m.s, 11 * m.s, 0, TAU); ctx.fill(); }
      ctx.restore(); });
    // little blocks: the city
    if (p.blocks > 0) for (let gx = 50; gx < 1000; gx += 100) for (let gy = 50; gy < 1000; gy += 100) {
      const id = gx * 7 + gy * 13, inPark = K.PARKS.some(pk => gx > pk[0][0] - 20 && gx < pk[1][0] + 20 && gy > pk[0][1] - 20 && gy < pk[2][1] + 20), nearRiver = Math.abs(gy - 600) < 110;
      if (inPark || nearRiver || R(id) < 0.35) continue;
      const q = clamp((p.blocks - R(id * 1.3) * 0.6) / 0.4), hgt = (18 + R(id * 2.1) * 60) * q;
      const [bx, by] = K.iso(m, gx - 25, gy + 25); K.bar(ctx, bx, by, 50 * 0.866 * m.s, 50 * m.s, hgt * m.s, ['#E8DFD0', '#DDD3C2', '#EDE5D8'][Math.floor(R(id * 4) * 3)]);
    }
    // bike lanes drawn on, riders running along them
    K.LANES.forEach((ln, i) => {
      const q = clamp((p.lanes - i * 0.12) / 0.5); if (q <= 0) return;
      const pts = ln.map(pt => K.iso(m, pt[0], pt[1])); const tot = pts.reduce((a, b, k) => a + (k ? Math.hypot(b[0] - pts[k - 1][0], b[1] - pts[k - 1][1]) : 0), 0);
      ctx.save(); ctx.strokeStyle = C.lane; ctx.lineWidth = 9 * m.s; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([tot * q, tot]);
      ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
      if (q >= 1) for (let r = 0; r < 3; r++) { const u = ((t * 0.12 + r / 3 + i * 0.17) % 1); let acc = 0, target = u * tot, pos = pts[0];
        for (let k = 1; k < pts.length; k++) { const L = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (acc + L >= target) { const f = (target - acc) / L; pos = [lerp(pts[k - 1][0], pts[k][0], f), lerp(pts[k - 1][1], pts[k][1], f)]; break; } acc += L; }
        ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(pos[0], pos[1], 8 * m.s, 0, TAU); ctx.fill(); ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(pos[0], pos[1], 5 * m.s, 0, TAU); ctx.fill(); }
    });
    // hubs
    K.HUBS.forEach(([gx, gy, name], i) => {
      const q = Ease.outBack(clamp((p.hubs - i * 0.1) / 0.3)); if (q <= 1e-3) return;
      const [x, y] = K.iso(m, gx, gy), pulse = (t * 0.8 + i * 0.3) % 1;
      ctx.save(); ctx.strokeStyle = K.COL.navy; ctx.globalAlpha = 0.45 * (1 - pulse); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, 60 * pulse * m.s + 10, 35 * pulse * m.s + 6, 0, 0, TAU); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
      ctx.fillStyle = K.COL.navy; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -30); ctx.arc(0, -36, 18, Math.PI * 0.85, Math.PI * 2.15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, -36, 7, 0, TAU); ctx.fill();
      ctx.font = K.f(26, 800); ctx.textAlign = 'center'; ctx.fillStyle = K.COL.ink; ctx.fillText(name, 0, -66); ctx.restore();
    });
  };
  // a bicycle icon (wheels turning), centre of the frame at (x, y), s = wheel radius
  K.bike = (ctx, x, y, s, col, t, o = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.alpha ?? 1;
    const wl = [-s * 1.25, s * 0.55], wr = [s * 1.25, s * 0.55];
    [wl, wr].forEach(([wx, wy]) => { ctx.beginPath(); ctx.arc(wx, wy, s, 0, TAU); ctx.stroke(); for (let k = 0; k < 3; k++) { const a = t * 6 + k * Math.PI / 3; ctx.save(); ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(wx - Math.cos(a) * s, wy - Math.sin(a) * s); ctx.lineTo(wx + Math.cos(a) * s, wy + Math.sin(a) * s); ctx.stroke(); ctx.restore(); } });
    ctx.beginPath(); ctx.moveTo(wl[0], wl[1]); ctx.lineTo(-s * 0.2, wl[1]); ctx.lineTo(s * 0.55, -s * 0.55); ctx.lineTo(-s * 0.55, -s * 0.55); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.2, wl[1]); ctx.lineTo(-s * 0.7, -s * 0.85); ctx.moveTo(-s * 0.95, -s * 0.85); ctx.lineTo(-s * 0.45, -s * 0.85); ctx.moveTo(s * 0.55, -s * 0.55); ctx.lineTo(wr[0], wr[1]); ctx.moveTo(s * 0.55, -s * 0.55); ctx.lineTo(s * 0.4, -s * 1.0); ctx.lineTo(s * 0.75, -s * 1.05); ctx.stroke();
    ctx.restore();
  };
  // a donut: segs = [{v, col, label}], p 0..1 sweep
  K.donut = (ctx, cx, cy, r, segs, p, o = {}) => {
    const tot = segs.reduce((a, b) => a + b.v, 0); let a0 = -Math.PI / 2;
    segs.forEach((sg, i) => {
      const a1 = a0 + sg.v / tot * TAU, end = Math.min(a1, -Math.PI / 2 + TAU * p);
      if (end > a0) { ctx.save(); ctx.strokeStyle = sg.col; ctx.lineWidth = o.w ?? r * 0.38; ctx.beginPath(); ctx.arc(cx, cy, r, a0, end); ctx.stroke(); ctx.restore(); }
      if (p >= (a1 + Math.PI / 2) / TAU - 0.02 && o.labels !== false) { const am = (a0 + a1) / 2, lx = cx + Math.cos(am) * r * 1.55, ly = cy + Math.sin(am) * r * 1.55, q = clamp((p - (a1 + Math.PI / 2) / TAU + 0.02) / 0.15);
        ctx.save(); ctx.globalAlpha *= q; ctx.textAlign = 'center'; ctx.font = K.f(30, 700); ctx.fillStyle = K.COL.ink2; ctx.fillText(sg.label, lx, ly - 8); ctx.font = K.f(44, 900); ctx.fillStyle = sg.col === K.COL.yellow ? '#B8860B' : sg.col; ctx.fillText(sg.v + '%', lx, ly + 40); ctx.restore(); }
      a0 = a1;
    });
  };
  window.INFO = K;
})();

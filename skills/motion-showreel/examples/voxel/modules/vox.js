// vox: the 블록 마을 reel's kit (a project module). An isometric voxel world on Canvas2D: unit cubes drawn as three
// shaded faces with a dark outline, sorted back to front, hidden faces culled against landed neighbours; blocks drop
// in with a bounce and a puff; a night mode dims the world and lights windows and lamps. The village is a list of
// blocks in groups (ground, deco, house, more), so each scene shows what earlier scenes built. Plus the code panel.
(() => {
  const K = {}, COL = { sky0: '#7FCBFF', sky1: '#DDF3FF', night0: '#0E1640', night1: '#2A3A78', ink: '#1E2246', panel: '#1F2347', panelLine: '#2E3466', white: '#FFFFFF', yellow: '#FFD84A' };
  K.COL = COL;
  const T = {
    grass: { top: '#7CCB4F', side: '#A06C3E', band: '#5DAE3A' }, sand: { top: '#F2D27A', side: '#D9B25C' }, water: { top: '#52BDF2', side: '#3A9AD6', alpha: 0.85, low: 0.18 },
    brick: { top: '#F08A5D', side: '#E2704E' }, window: { top: '#F08A5D', side: '#E2704E', win: true }, roof: { top: '#EF4B3C', side: '#C9382C' }, roof2: { top: '#4C7BF0', side: '#3A62CC' },
    wood: { top: '#A8763F', side: '#8A5A33' }, leaf: { top: '#5BCB5E', side: '#3FA24A' }, leaf2: { top: '#8EDB5A', side: '#6CBB3E' }, stone: { top: '#D3D8E0', side: '#AEB4BF' },
    lamp: { top: '#FFE27A', side: '#FFC93C', glow: true }, flower: { top: '#FF7FB0', side: '#E85C92', small: 0.4 }, flower2: { top: '#FFE04A', side: '#E8C02E', small: 0.4 },
  };
  K.T = T;
  // the view: s = half the width of a tile in px; (ox, oy) = where the world's (0, 0, 0) corner lands
  K.view = (s, ox, oy) => ({ s, ox, oy });
  K.iso = (v, x, y, z) => [v.ox + (x - y) * v.s, v.oy + (x + y) * v.s * 0.5 - z * v.s * 1.1];
  const shade = (hex, k) => { const c = parseColor(hex); return `rgb(${Math.min(255, c[0] * k) | 0},${Math.min(255, c[1] * k) | 0},${Math.min(255, c[2] * k) | 0})`; };
  const nightCol = (hex, n) => n <= 0 ? hex : mix(hex, '#1A2456', n * 0.62);
  // ───────── the village ─────────
  K.village = () => {
    const B = [], add = (g, x, y, z, t, o = {}) => B.push({ g, x, y, z, t, ...o });
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
      const pond = x >= 1 && x <= 2 && y >= 7 && y <= 8, path = y === 6 && !pond;
      add('ground', x, y, 0, pond ? 'water' : path ? 'sand' : 'grass', { d: Math.hypot(x - 4.5, y - 4.5) });
    }
    const tree = (g, x, y, k = 0) => { add(g, x, y, 1, 'wood', { k: k }); add(g, x, y, 2, 'wood', { k: k + 1 });
      [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy], i) => add(g, x + dx, y + dy, 3, i % 2 ? 'leaf2' : 'leaf', { k: k + 2 })); add(g, x, y, 4, 'leaf', { k: k + 3 }); };
    tree('deco', 7, 2, 0); tree('deco', 1, 2, 1);
    add('deco', 8, 8, 1, 'flower', { k: 2 }); add('deco', 5, 8, 1, 'flower2', { k: 2 }); add('deco', 0, 5, 1, 'flower', { k: 3 });
    // the house: two bricks, then six in a loop, then the roof, then windows (k = the order in which the code places them)
    [[3, 3, 1], [4, 3, 1], [3, 4, 1], [4, 4, 1], [3, 3, 2], [4, 3, 2], [3, 4, 2], [4, 4, 2]].forEach(([x, y, z], i) => add('house', x, y, z, (x === 4 && z === 1) || (y === 4 && z === 2 && x === 3) ? 'window' : 'brick', { k: i }));
    [[3, 3], [4, 3], [3, 4], [4, 4]].forEach(([x, y], i) => add('house', x, y, 3, 'roof', { k: 8 + i }));
    // what the 30-s cut adds: a loop of five trees, two lamps, a second house
    [[8, 4], [6, 9], [0, 9], [9, 0], [2, 0]].forEach(([x, y], i) => tree('more', x, y, i * 4));
    add('more', 3, 5, 1, 'stone', { k: 20 }); add('more', 3, 5, 2, 'lamp', { k: 21 }); add('more', 6, 5, 1, 'stone', { k: 22 }); add('more', 6, 5, 2, 'lamp', { k: 23 });
    return B;
  };
  // ───────── drawing ─────────
  // blocks: [{x, y, z, t, at (drop start, s; null = already there), alpha, sc}], o: {night, lt}
  K.draw = (ctx, v, blocks, o = {}) => {
    const lt = o.lt ?? 0, night = o.night ?? 0, live = [], solid = new Set();
    for (const b of blocks) {
      let zz = b.z, a = 1, sc = 1;
      if (b.at != null) { const p = (lt - b.at) / (o.fall ?? 0.42); if (p < 0) continue;
        if (p < 1) { zz = b.z + 7 * (1 - p * p); a = clamp(p * 4); } else { const q = lt - b.at - (o.fall ?? 0.42); zz = b.z + 0.22 * Math.exp(-q * 7) * Math.abs(Math.sin(q * 16)); sc = 1 + 0.12 * Math.exp(-q * 10) * Math.cos(q * 30); } }
      if (b.pop != null) { const p = (lt - b.pop) / 0.45; if (p < 0) continue; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) continue; zz = b.z - 1.5 * (1 - e); a = clamp(p * 3); }
      if (b.grow != null) { const p = (lt - b.grow) / 0.35; if (p < 0) continue; sc = p >= 1 ? 1 : Math.max(0.01, Ease.outBack(clamp(p))); }
      const L = { ...b, zz, a, sc };
      if (Math.abs(zz - b.z) < 0.02 && sc > 0.98 && !T[b.t].alpha && !T[b.t].small) solid.add(`${b.x},${b.y},${b.z}`);
      live.push(L);
    }
    live.sort((p, q) => (p.x + p.y) - (q.x + q.y) || p.zz - q.zz);
    // shadows of falling blocks on what lies under them
    for (const b of live) if (b.zz - b.z > 0.05) { const c = K.iso(v, b.x + 0.5, b.y + 0.5, b.z); const k = clamp(1 - (b.zz - b.z) / 7);
      ctx.fillStyle = `rgba(20,30,60,${0.28 * k})`; ctx.beginPath(); ctx.ellipse(c[0], c[1], v.s * (0.5 + 0.4 * k), v.s * (0.25 + 0.2 * k), 0, 0, TAU); ctx.fill(); }
    const lw = Math.max(1, v.s / 26);
    for (const b of live) {
      const ty = T[b.t], has = (dx, dy, dz) => solid.has(`${b.x + dx},${b.y + dy},${b.z + dz}`);
      const sm = ty.small || 1, sz = sm * b.sc, off = (1 - sz) / 2, h = (ty.low ? 1 - ty.low : 1) * sz;
      const P = (i, j, k) => K.iso(v, b.x + off + i * sz, b.y + off + j * sz, b.zz + k * h);
      const poly = (pts, fill) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.stroke(); };
      ctx.save(); ctx.globalAlpha *= b.a * (ty.alpha ?? 1); ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.strokeStyle = shade(nightCol(ty.side, night), 0.55);
      const lit = ty.glow && night > 0, top = lit ? ty.top : nightCol(ty.top, night), side = lit ? ty.side : nightCol(ty.side, night);
      const xFace = [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], yFace = [P(0, 1, 0), P(1, 1, 0), P(1, 1, 1), P(0, 1, 1)];
      if (!has(1, 0, 0) || sz < 1) poly(xFace, shade(side, 0.92));
      if (!has(0, 1, 0) || sz < 1) poly(yFace, shade(side, 0.74));
      if (ty.band && b.zz === b.z) { ctx.save(); ctx.lineWidth = 0; ctx.strokeStyle = 'transparent'; const bd = 0.22;
        if (!has(1, 0, 0)) poly([P(1, 0, 1 - bd), P(1, 1, 1 - bd), P(1, 1, 1), P(1, 0, 1)], shade(nightCol(ty.band, night), 0.92));
        if (!has(0, 1, 0)) poly([P(0, 1, 1 - bd), P(1, 1, 1 - bd), P(1, 1, 1), P(0, 1, 1)], shade(nightCol(ty.band, night), 0.74)); ctx.restore(); }
      if (ty.win) { const wc = night > 0 ? mix('#5BC0FF', '#FFD84A', night) : '#5BC0FF', W2 = (i0, j0, i1, j1, sh) => poly([P(i0, j0, 0.3), P(i1, j1, 0.3), P(i1, j1, 0.75), P(i0, j0, 0.75)], shade(wc, sh));
        if (!has(1, 0, 0)) W2(1, 0.3, 1, 0.7, 0.95); if (!has(0, 1, 0)) W2(0.3, 1, 0.7, 1, 0.8); }
      if (!has(0, 0, 1) || sz < 1) poly([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], top);
      ctx.restore();
    }
    // the night's lights: windows and lamps glow
    if (night > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const b of live) { const ty = T[b.t]; if (!(ty.glow || ty.win)) continue; const c = K.iso(v, b.x + 0.5, b.y + 0.5, b.zz + 0.5), r = v.s * (ty.glow ? 2.6 : 1.5);
        const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, `rgba(255,214,90,${0.55 * night})`); g.addColorStop(1, 'rgba(255,214,90,0)'); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); }
      ctx.restore(); }
    return live;
  };
  // the puff when a block lands: little white squares thrown out sideways
  K.puffs = (ctx, v, blocks, lt, fall = 0.42) => {
    for (const b of blocks) { if (b.at == null) continue; const q = lt - b.at - fall; if (q < 0 || q > 0.45) continue;
      const c = K.iso(v, b.x + 0.5, b.y + 0.5, b.z), k = q / 0.45;
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + b.x, r = v.s * (0.5 + 0.9 * Ease.outC(k)); ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - k)})`;
        const s = v.s * 0.16 * (1 - k * 0.6); ctx.fillRect(c[0] + Math.cos(a) * r - s / 2, c[1] + Math.sin(a) * r * 0.5 - s / 2 - k * v.s * 0.3, s, s); } }
  };
  // ───────── the sky, clouds and stars ─────────
  K.sky = (ctx, lt, night = 0) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix(COL.sky0, COL.night0, night)); g.addColorStop(1, mix(COL.sky1, COL.night1, night));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (night > 0) for (let i = 0; i < 90; i++) { const x = hash(i * 3.1) * W, y = hash(i * 7.7) * H * 0.6, tw = 0.6 + 0.4 * Math.sin(lt * 3 + i); ctx.fillStyle = `rgba(255,255,230,${night * tw * 0.8})`; const s = 2 + (i % 3); ctx.fillRect(x, y, s, s); }
    ctx.save(); ctx.globalAlpha = 1 - night * 0.7;
    for (let i = 0; i < 5; i++) { const x = ((hash(i * 5.3) * 2400 + lt * (14 + i * 4)) % 2600) - 340, y = 90 + hash(i * 2.9) * 300, s = 26 + hash(i) * 14;
      ctx.fillStyle = '#FFFFFF'; for (const [dx, dy, w, h] of [[0, 1, 5, 1], [1, 0, 3, 1], [0.5, 2, 4, 0.6]]) ctx.fillRect(x + dx * s, y + dy * s * 0.6, w * s, h * s * 0.6);
      ctx.fillStyle = 'rgba(160,200,235,0.6)'; ctx.fillRect(x + 0.5 * s, y + 2.6 * s * 0.6, 4 * s, 0.2 * s); }
    ctx.restore();
  };
  // ───────── type ─────────
  K.f = (size) => `400 ${size}px ${FAM.display}`;
  // chunky lettering with a block-coloured extrusion
  K.title = (ctx, s, x, y, size, o = {}) => { const a = o.alpha ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = K.f(size); ctx.textAlign = o.align || 'left'; ctx.letterSpacing = (o.track ?? 0) + 'px';
    const d = Math.round(size * 0.06); for (let i = d; i > 0; i--) { ctx.fillStyle = o.side || '#2A3A78'; ctx.fillText(s, x + i * 0.6, y + i); }
    ctx.fillStyle = o.color || COL.white; ctx.fillText(s, x, y); ctx.restore(); };
  // letters that drop in one by one like blocks
  K.dropText = (ctx, s, x, y, size, lt, o = {}) => { ctx.save(); ctx.font = K.f(size); ctx.letterSpacing = (o.track ?? 0) + 'px'; let cx = x; const chars = [...s];
    chars.forEach((ch, i) => { const w = ctx.measureText(ch).width + (o.track ?? 0), p = (lt - (o.at ?? 0) - i * (o.step ?? 0.09)) / 0.4;
      if (p > 0) { const e = p >= 1 ? 1 : Ease.outBack(p); if (e > 1e-3) K.title(ctx, ch, cx, y - (1 - e) * size * 1.2, size, { ...o, alpha: clamp(p * 3), track: 0 }); } cx += w; });
    ctx.restore(); };
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size); ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  K.pop = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.35; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(e, e); K.text(ctx, s, 0, 0, size, { ...o, alpha: clamp(p * 3) }); ctx.restore(); };
  // a chip label (rounded, coloured)
  K.chip = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.35; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return;
    ctx.save(); ctx.font = K.f(size); const w = ctx.measureText(s).width + size * 0.9, h = size * 1.45; ctx.translate(x, y); ctx.scale(e, e);
    ctx.fillStyle = o.shadow || 'rgba(30,34,70,0.35)'; ctx.beginPath(); ctx.roundRect(0, 6, w, h, h / 2); ctx.fill();
    ctx.fillStyle = o.bg || COL.yellow; ctx.beginPath(); ctx.roundRect(0, 0, w, h, h / 2); ctx.fill(); ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, size * 0.45, h * 0.72); ctx.restore(); };
  // ───────── the code panel ─────────
  // lines: [{s, at, ind}]; typed at ~22 chars/s; a caret on the line being typed; the line flashes when it runs (o.runs[i])
  const tok = s => { const out = []; const re = /(\d+)|(반복|번|\{|\})|([가-힣]+)(?=\()|(\([^)]*\))|([^\d{}()]+)/g; let m;
    while ((m = re.exec(s))) out.push([m[0], m[1] ? '#C792EA' : m[2] ? '#FF7FB0' : m[3] ? '#FFB86B' : m[4] ? '#8EDB5A' : '#E8ECFF']); return out; };
  K.code = (ctx, x, y, w, lines, lt, o = {}) => {
    const lh = o.lh ?? 72, size = o.size ?? 46, h = (o.rows ?? 7) * lh + 110, slide = Ease.outC(clamp((lt - (o.at ?? 0)) / 0.45)), out = o.out != null ? Ease.inC(clamp((lt - o.out) / 0.4)) : 0;
    if (slide <= 0 || out >= 1) return; const X = x - (1 - slide) * (w + x + 40) - out * (w + x + 40);
    ctx.save(); ctx.fillStyle = 'rgba(20,24,60,0.3)'; ctx.beginPath(); ctx.roundRect(X + 10, y + 14, w, h, 28); ctx.fill();
    ctx.fillStyle = COL.panel; ctx.beginPath(); ctx.roundRect(X, y, w, h, 28); ctx.fill();
    ['#FF6B6B', '#FFD84A', '#5BD27A'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X + 44 + i * 36, y + 40, 11, 0, TAU); ctx.fill(); });
    K.text(ctx, o.file || '마을.블록', X + w - 40, y + 52, 32, { align: 'right', color: '#8C93C8' });
    lines.forEach((L, i) => { const ly = y + 120 + i * lh; const n = Math.floor(clamp((lt - L.at) * 22, 0, L.s.length)); if (lt < L.at) return;
      K.text(ctx, String(i + 1), X + 50, ly, size * 0.8, { color: '#5D6499' });
      const run = o.runs && o.runs[i] != null ? clamp(1 - (lt - o.runs[i]) / 0.5) : 0; if (run > 0 && lt >= o.runs[i]) { ctx.fillStyle = `rgba(255,216,74,${0.25 * run})`; ctx.fillRect(X + 16, ly - lh * 0.68, w - 32, lh * 0.9); }
      let cx = X + 110 + (L.ind || 0) * 44, left = n; ctx.font = K.f(size);
      for (const [s, c] of tok(L.s)) { if (left <= 0) break; const part = s.slice(0, left); left -= s.length; ctx.fillStyle = c; ctx.fillText(part, cx, ly); cx += ctx.measureText(part).width; }
      if (n < L.s.length || (i === lines.length - 1 && Math.floor(lt * 2.4) % 2 === 0)) { ctx.fillStyle = '#FFD84A'; ctx.fillRect(cx + 4, ly - size * 0.8, 5, size * 0.95); } });
    ctx.restore();
  };
  window.VOX = K;
})();

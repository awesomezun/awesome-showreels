// collage: the 종이비행 페스티벌 reel's cut-paper kit (a project module). A newsprint board; pieces of paper with
// torn edges, a white cut border and a drop shadow; ransom letters, each on its own chip in its own face and colour;
// halftone and printed-text fills; tape. Pieces slap down on the beat, and every move is held on twos (12 fps), as
// if each frame were a photograph of paper moved by hand.
(() => {
  const K = {};
  const R = n => hash(n);
  K.COL = { paper: '#EFE9DC', ink: '#1E1B1A', red: '#E8402E', cobalt: '#2F55D4', yellow: '#F7C531', pink: '#F49AC1', green: '#37A169', black: '#232220', kraft: '#C9A57B', white: '#FBF8F1', sky: '#8EC8E8', orange: '#F28A2E' };
  K.FACES = ['"Black Han Sans"', '"Do Hyeon"', '"Song Myung"', '"Jua"'];
  K.q = t => Math.floor(t * 12) / 12;                         // motion on twos
  let tiles = {};
  function tile(kind) {
    if (tiles[kind]) return tiles[kind];
    const n = 96, b = makeBuf(n, n), g = b.g;
    if (kind === 'dots') { g.fillStyle = 'rgba(0,0,0,0.85)'; for (let y = 0; y < n; y += 12) for (let x = (y / 12) % 2 ? 6 : 0; x < n; x += 12) { g.beginPath(); g.arc(x + 3, y + 3, 3.2, 0, TAU); g.fill(); } }
    if (kind === 'stripes') { g.fillStyle = 'rgba(0,0,0,0.8)'; for (let i = -n; i < n * 2; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 8, 0); g.lineTo(i + 8 - n, n); g.lineTo(i - n, n); g.closePath(); g.fill(); } }
    if (kind === 'print') { for (let y = 6; y < n; y += 9) { let x = 4; while (x < n - 6) { const w = 6 + R(x * 3 + y) * 18; g.fillStyle = `rgba(40,36,32,${0.35 + 0.25 * R(x + y * 7)})`; g.fillRect(x, y, Math.min(w, n - 4 - x), 3); x += w + 4; } } }
    return (tiles[kind] = b.c);
  }
  // the board: newsprint with faint columns of print and a few old tape marks
  K.board = (ctx, P, o = {}) => {
    ctx.fillStyle = o.color || K.COL.paper; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = ctx.createPattern(tile('print'), 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(40,36,32,0.18)'; ctx.lineWidth = 2;
    for (let x = 120; x < W; x += 340) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    ctx.restore();
    const v = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, W * 0.8); v.addColorStop(0, 'rgba(255,250,235,0)'); v.addColorStop(1, 'rgba(120,90,50,0.22)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  };
  // background scraps: large torn pieces of newsprint, dots and coloured paper, low in contrast, trembling on twos
  K.scraps = (ctx, seed, t, o = {}) => {
    const n = o.n ?? 11, cols = ['#E4D9C2', '#D9CDB4', '#F1C9C0', '#C9DCEB', '#F4E2A8', '#D2E3CF', '#E9E1CF'], tq = Math.floor(t * 12);
    for (let i = 0; i < n; i++) {
      const x = R(seed * 7 + i * 3.7) * W, y = R(seed * 11 + i * 5.3) * H, w = 260 + R(seed + i * 9.1) * 420, h = 160 + R(seed * 3 + i * 2.2) * 300;
      const jx = (R(tq * 0.37 + i) - 0.5) * 2, jy = (R(tq * 0.71 + i * 2) - 0.5) * 2;
      K.piece(ctx, x + jx, y + jy, K.torn(w, h, seed * 31 + i, 7, 22), { base: cols[(i + seed) % cols.length], fill: ['print', 'dots', 'stripes', undefined][i % 4], tileA: 0.12,
        rot: (R(seed * 13 + i) - 0.5) * 0.5, border: false, sh: 3, alpha: o.alpha ?? 0.75 });
    }
  };
  // a torn outline around a rectangle (w x h centred on 0,0): jagged along every edge
  K.torn = (w, h, seed, rough = 5, step = 14) => {
    const pts = [], edge = (x0, y0, x1, y1, k) => { const L0 = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(L0 / step)), nx = -(y1 - y0) / L0, ny = (x1 - x0) / L0;
      for (let i = 0; i < n; i++) { const q = i / n, j = (R(seed * 13 + k * 101 + i * 7.1) - 0.5) * 2 * rough; pts.push([lerp(x0, x1, q) + nx * j, lerp(y0, y1, q) + ny * j]); } };
    edge(-w / 2, -h / 2, w / 2, -h / 2, 0); edge(w / 2, -h / 2, w / 2, h / 2, 1); edge(w / 2, h / 2, -w / 2, h / 2, 2); edge(-w / 2, h / 2, -w / 2, -h / 2, 3);
    return pts;
  };
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
  // a slap: 0 before `at`, then a quick drop with a settle (scale 1.35 -> 1, rotation +-0.25 -> rot, the shadow lands)
  K.slap = (t, at, dur = 0.22) => { const q = clamp((K.q(t) - at) / dur); if (q <= 0) return null; const e = q < 1 ? Ease.outBack(q, 2.2) : 1; return { e, s: lerp(1.35, 1, e), dr: (1 - e) * 0.25, sh: lerp(26, 8, e), a: clamp(q * 3) }; };
  // a paper piece: pts in local px around (0, 0); o: {fill: colour | 'dots' | 'stripes' | 'print', base, border, shadow, rot, scale, inner(ctx)}
  K.piece = (ctx, x, y, pts, o = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.scale ?? 1, o.scale ?? 1); ctx.globalAlpha *= o.alpha ?? 1;
    if (o.shadow !== false) { ctx.save(); ctx.translate(o.sh ?? 8, (o.sh ?? 8) * 1.2); poly(ctx, pts); ctx.fillStyle = 'rgba(30,20,10,0.28)'; ctx.filter = 'blur(4px)'; ctx.fill(); ctx.restore(); }
    if (o.border !== false) { ctx.save(); poly(ctx, pts); ctx.lineWidth = o.borderW ?? 10; ctx.strokeStyle = K.COL.white; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
    poly(ctx, pts); ctx.fillStyle = o.base || o.fill || K.COL.white; ctx.fill();
    if (o.fill && tile(o.fill) && ['dots', 'stripes', 'print'].includes(o.fill)) { ctx.save(); poly(ctx, pts); ctx.clip(); ctx.globalAlpha *= o.tileA ?? 0.5; ctx.fillStyle = ctx.createPattern(tile(o.fill), 'repeat'); ctx.fillRect(-2000, -2000, 4000, 4000); ctx.restore(); }
    if (o.inner) { ctx.save(); poly(ctx, pts); ctx.clip(); o.inner(ctx); ctx.restore(); }
    ctx.restore();
  };
  // a ransom letter on its own chip; i picks face, colours and tilt; t, at drive the slap
  K.letter = (ctx, ch, x, y, size, i, t, at, o = {}) => {
    const s = K.slap(t, at); if (!s) return 0;
    const face = o.face || K.FACES[(i * 3 + (o.faceShift || 0)) % K.FACES.length], combos = [[K.COL.red, K.COL.white], [K.COL.yellow, K.COL.ink], [K.COL.ink, K.COL.white], [K.COL.cobalt, K.COL.white], [K.COL.white, K.COL.ink], [K.COL.pink, K.COL.ink], [K.COL.green, K.COL.white], [K.COL.kraft, K.COL.ink]];
    const [bg, fg] = o.combo || combos[(i * 5 + (o.comboShift || 0)) % combos.length], rot = (R(i * 7.7 + (o.seed || 0)) - 0.5) * 0.22 + s.dr, sz = size * (0.86 + 0.28 * R(i * 3.1 + (o.seed || 0)));
    ctx.save(); ctx.font = `${sz}px ${face}`; const w = ctx.measureText(ch).width; ctx.restore();
    const cw = w + sz * 0.28, ch2 = sz * 1.08;
    K.piece(ctx, x, y, K.torn(cw, ch2, i * 3 + 1 + (o.seed || 0), 3.5, 12), { base: bg, fill: o.tex, rot, scale: s.s, sh: s.sh, alpha: s.a, borderW: 6,
      inner: c => { c.font = `${sz}px ${face}`; c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ch, 0, sz * 0.06); } });
    return cw;
  };
  // a word in ransom letters, laid left to right from x (centre of the first chip), one letter every `step` seconds
  K.word = (ctx, s, x, y, size, t, at, o = {}) => {
    let cx = x; const chars = [...s];
    chars.forEach((c, i) => {
      if (c === ' ') { cx += size * 0.45; return; }
      ctx.save(); ctx.font = `${size}px ${K.FACES[(i * 3 + (o.faceShift || 0)) % 4]}`; const w = ctx.measureText(c).width + size * 0.32; ctx.restore();
      K.letter(ctx, c, cx + w / 2, y + (R(i * 5.3 + (o.seed || 0)) - 0.5) * size * 0.16, size, i + (o.seed || 0), t, at + i * (o.step ?? 0.12), o);
      cx += w * 0.98;
    });
    return cx - x;
  };
  // a strip of torn paper with a line of text on it
  K.strip = (ctx, s, x, y, size, t, at, o = {}) => {
    const sl = K.slap(t, at); if (!sl) return;
    ctx.save(); ctx.font = `${size}px ${o.face || K.FACES[1]}`; const w = ctx.measureText(s).width; ctx.restore();
    K.piece(ctx, x + (o.align === 'center' ? 0 : w / 2 + size * 0.6), y, K.torn(w + size * 1.2, size * 1.5, o.seed || 9, 6, 16), { base: o.bg || K.COL.white, fill: o.tex, tileA: 0.12, rot: (o.rot || 0) + sl.dr, scale: sl.s, sh: sl.sh, alpha: sl.a,
      inner: c => { c.font = `${size}px ${o.face || K.FACES[1]}`; c.fillStyle = o.fg || K.COL.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, 0, size * 0.06); } });
  };
  K.tape = (ctx, x, y, w, rot, o = {}) => {
    const h = o.h ?? 46, pts = [];
    for (let i = 0; i <= 6; i++) pts.push([-w / 2 + (R(i + (o.seed || 1)) - 0.5) * 8, -h / 2 + i / 6 * h]);
    for (let i = 0; i <= 6; i++) pts.push([w / 2 + (R(i * 3 + (o.seed || 1)) - 0.5) * 8, h / 2 - i / 6 * h]);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= (o.alpha ?? 1) * 0.72; poly(ctx, pts.map(([a, b2]) => [a, b2])); ctx.fillStyle = o.color || '#F3E3A8'; ctx.fill(); ctx.restore();
  };
  // shapes as point lists (unit size, centred)
  K.star = (r, n = 5, k = 0.45) => Array.from({ length: n * 2 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * k : r; return [Math.cos(a) * rr, Math.sin(a) * rr]; });
  K.blob = (r, seed, n = 9) => Array.from({ length: 48 }, (_, i) => { const a = i / 48 * TAU, w = 1 + 0.12 * Math.sin(a * 3 + seed) + 0.06 * Math.sin(a * 5 + seed * 2); return [Math.cos(a) * r * w, Math.sin(a) * r * w]; });
  K.flower = r => { const pts = []; for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, rr = r * (0.62 + 0.38 * Math.abs(Math.cos(a * 3))); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return pts; };
  K.eye = (w, h) => { const pts = []; for (let i = 0; i <= 24; i++) { const q = i / 24; pts.push([lerp(-w / 2, w / 2, q), -Math.sin(Math.PI * q) * h / 2]); } for (let i = 0; i <= 24; i++) { const q = i / 24; pts.push([lerp(w / 2, -w / 2, q), Math.sin(Math.PI * q) * h / 2]); } return pts; };
  K.plane = s => [[-s, -s * 0.1], [s, 0], [-s * 0.55, s * 0.42], [-s * 0.4, s * 0.06]];
  window.COLLAGE = K;
})();

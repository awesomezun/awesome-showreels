// tty: the 글자판 reel's kit (a project module). A terminal grid: 40 px Nanum Gothic Coding (body text never under 40 px), Latin half a cell wide,
// Hangul a full two cells, so everything sits on one 20 x 44 grid. Box lines and bar blocks are drawn as cell-aligned
// strokes and fills (the font has no half-width box or block glyphs). Pictures become characters by luminance on a
// ramp; the famous spinning donut is computed into the grid; characters can fly in from anywhere and land on their
// cells.
(() => {
  const K = {}, CW = 20, CH = 44, FS = 40, COLS = Math.floor((W - 40) / CW), ROWS = Math.floor((H - 30) / CH), X0 = Math.round((W - COLS * CW) / 2), Y0 = Math.round((H - ROWS * CH) / 2);
  const COL = { bg: '#14151F', fg: '#C0CAF5', dim: '#565F89', cyan: '#7DCFFF', green: '#9ECE6A', yel: '#E0AF68', mag: '#BB9AF7', red: '#F7768E', blue: '#7AA2F7' };
  Object.assign(K, { CW, CH, FS, COLS, ROWS, X0, Y0, COL });
  K.cx = (c) => X0 + c * CW; K.cy = (r) => Y0 + r * CH;
  const wide = (ch) => /[ᄀ-ᇿ㄰-㆏가-힣　-〿＀-￯]/.test(ch);
  K.wide = wide;
  // a frame buffer of cells
  K.buf = () => ({ ch: new Array(COLS * ROWS).fill(' '), col: new Array(COLS * ROWS).fill(COL.fg), fx: [] });
  K.put = (B, c, r, s, col = COL.fg) => { let x = c; for (const ch of s) { if (r < 0 || r >= ROWS) return x; if (x >= 0 && x < COLS) { B.ch[r * COLS + x] = ch; B.col[r * COLS + x] = col; if (wide(ch) && x + 1 < COLS) B.ch[r * COLS + x + 1] = ''; } x += wide(ch) ? 2 : 1; } return x; };
  K.len = (s) => [...s].reduce((n, ch) => n + (wide(ch) ? 2 : 1), 0);
  // vector extras laid on the grid: box outlines and block bars
  K.box = (B, c, r, w, h, title, col = COL.dim, tcol = COL.cyan) => { B.fx.push({ k: 'box', c, r, w, h, col }); if (title) K.put(B, c + 2, r, ` ${title} `, tcol); };
  K.bar = (B, c, r, w, v, col = COL.green) => B.fx.push({ k: 'bar', c, r, w, v, col });
  K.spark = (B, c, r, vals, col = COL.cyan) => B.fx.push({ k: 'spark', c, r, vals, col });
  K.render = (ctx, B, o = {}) => {
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.font = `700 ${FS}px ${FAM.mono}`; ctx.textBaseline = 'alphabetic';
    for (const f of B.fx) { ctx.strokeStyle = f.col; ctx.fillStyle = f.col; ctx.lineWidth = 2;
      if (f.k === 'box') { ctx.strokeRect(K.cx(f.c) + CW / 2, K.cy(f.r) + CH / 2, (f.w - 1) * CW, (f.h - 1) * CH); }
      else if (f.k === 'bar') { const n = Math.round(f.w * clamp(f.v)); for (let i = 0; i < f.w; i++) { ctx.globalAlpha = i < n ? 1 : 0.18; ctx.fillRect(K.cx(f.c + i) + 1, K.cy(f.r) + 6, CW - 2, CH - 12); } ctx.globalAlpha = 1; }
      else if (f.k === 'spark') { f.vals.forEach((v, i) => { const h = Math.max(2, (CH - 8) * clamp(v)); ctx.fillRect(K.cx(f.c + i) + 1, K.cy(f.r) + CH - 4 - h, CW - 2, h); }); } }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const ch = B.ch[r * COLS + c]; if (!ch || ch === ' ') continue; ctx.fillStyle = B.col[r * COLS + c]; ctx.fillText(ch, K.cx(c), K.cy(r) + CH * 0.78); }
    ctx.restore();
    if (o.scan !== false) { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1); ctx.restore(); }
  };
  K.cursor = (ctx, c, r, t, col = COL.fg) => { if (Math.floor(t * 2.2) % 2) return; ctx.fillStyle = col; ctx.fillRect(K.cx(c), K.cy(r) + 4, CW, CH - 8); };
  // type a string at ~cps characters a second from at
  K.typed = (s, lt, at, cps = 24) => [...s].slice(0, Math.max(0, Math.floor((lt - at) * cps))).join('');
  // luminance ramp
  const RAMP = ' .,:-=+*#%@';
  K.RAMP = RAMP;
  // rasterise a line of text into cells: returns [{c, r, v}] with v = coverage (0..1)
  const rcache = {};
  K.rasterText = (s, c0, r0, cols, rows, o = {}) => { const key = [s, c0, r0, cols, rows].join('|'); if (rcache[key]) return rcache[key];
    const cv = document.createElement('canvas'); cv.width = cols * 4; cv.height = rows * 8; const g = cv.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff'; g.font = `${o.w ?? 900} ${rows * 8 * 0.86}px ${o.fam || FAM.display}`; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(s, cols * 2, rows * 4 + 2);
    const d = g.getImageData(0, 0, cv.width, cv.height).data, out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { let sum = 0; for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) sum += d[((r * 8 + y) * cv.width + c * 4 + x) * 4 + 3]; const v = sum / (32 * 255); if (v > 0.06) out.push({ c: c0 + c, r: r0 + r, v }); }
    return (rcache[key] = out); };
  // the donut (after donut.c): torus R1 = 1, R2 = 2, rotated by A, B; projected into the grid around (cc, rc)
  K.donut = (A, B, cc, rc, sc = 1) => { const out = new Map(), cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
    for (let th = 0; th < TAU; th += 0.05) { const ct = Math.cos(th), st = Math.sin(th);
      for (let ph = 0; ph < TAU; ph += 0.018) { const cp = Math.cos(ph), sp = Math.sin(ph), h = ct + 2, D = 1 / (sp * h * sA + st * cA + 5), tt = sp * h * cA - st * sA;
        const x = Math.round(cc + 13.2 * sc * D * (cp * h * cB - tt * sB)), y = Math.round(rc + 6 * sc * D * (cp * h * sB + tt * cB)), L = (st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue; const k = y * COLS + x, prev = out.get(k); if (!prev || D > prev.D) out.set(k, { c: x, r: y, D, L }); } }
    return [...out.values()]; };
  // a cell's character for luminance L in -1.4..1.4
  K.lumChar = (L) => '.,-~:;=!*#$@'[Math.max(0, Math.min(11, Math.floor(L * 8)))];
  // characters that fly to their cells: list [{c, r, ch, col}], k = 0..1 progress, seed for start points
  K.fly = (ctx, list, k, o = {}) => { ctx.save(); ctx.font = `700 ${FS}px ${FAM.mono}`;
    list.forEach((it, i) => { const d = clamp((k - (o.stagger ?? 0.35) * hash(i * 1.7 + (o.seed ?? 0))) / (1 - (o.stagger ?? 0.35))), e = Ease.ioC(d);
      const sx = hash(i * 3.1 + 7) * W, sy = o.fromTop ? -40 - hash(i * 5.3) * 400 : hash(i * 5.3 + 3) * H, x = lerp(sx, K.cx(it.c), e), y = lerp(sy, K.cy(it.r) + CH * 0.78, e);
      if (d <= 0 && !o.showStart) return; ctx.fillStyle = it.col; ctx.globalAlpha = d <= 0 ? 0.35 : 1; ctx.fillText(d >= 1 ? it.ch : (o.scramble ? '.,:-=+*#%@'[Math.floor(hash(i + Math.floor(k * 30)) * 10)] : it.ch), x, y); });
    ctx.restore(); };
  window.TTY = K;
})();

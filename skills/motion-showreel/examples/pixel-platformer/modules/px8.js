// px8: the 8비트 장터 reel's kit (a project module). Every frame is drawn into a 480 x 270 buffer and scaled up 4x with
// no smoothing, so one buffer pixel is a 4 x 4 block on screen; Galmuri11 is drawn at 12 px (its design grid) or a
// whole multiple of it, so its pixels land on the same grid. Sprites are strings; the sky is dithered bands; the
// street, the stalls, coins, the ? block, fireworks and the HUD are drawn here; the scenes only say where and when.
(() => {
  const K = {}, BW = 480, BH = 270, GROUND = 222;
  K.BW = BW; K.BH = BH; K.GROUND = GROUND;
  let buf = null, b = null, tbuf = null, tb = null;
  K.begin = () => { if (!buf) { buf = document.createElement('canvas'); buf.width = BW; buf.height = BH; b = buf.getContext('2d'); tbuf = document.createElement('canvas'); tbuf.width = BW; tbuf.height = 64; tb = tbuf.getContext('2d', { willReadFrequently: true }); }
    b.setTransform(1, 0, 0, 1, 0, 0); b.globalAlpha = 1; b.imageSmoothingEnabled = false; return b; };
  K.present = (ctx) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore(); };
  const P = { K: '#1A1423', R: '#E8475F', r: '#A8304A', S: '#FFD0A1', Y: '#FFD84A', y: '#D9A520', B: '#3B7DD8', b: '#2A5AA8', D: '#6B3E2E', W: '#FFFFFF', O: '#FF8A3D', G: '#5BD27A', g: '#2F9E55', P: '#B57BFF' };
  K.P = P;
  const R = (x, y, w, h, c) => { b.fillStyle = c; b.fillRect(Math.round(x), Math.round(y), w, h); };
  K.rect = R;
  // a sprite from strings; flip mirrors it
  K.sprite = (rows, x, y, o = {}) => { x = Math.round(x); y = Math.round(y); const w = rows[0].length;
    rows.forEach((row, j) => { for (let i = 0; i < w; i++) { const ch = row[o.flip ? w - 1 - i : i]; if (ch === '.') continue; b.fillStyle = (o.map && o.map[ch]) || P[ch] || ch; b.fillRect(x + i, y + j, 1, 1); } }); };
  // ───────── the hero: 16 x 22, facing right; two run frames and a jump ─────────
  const HEAD = ['....KKKKKKK.....', '...KRRRRRRRK....', '..KRRRWWRRRRK...', '..KRRRWWRRRRRK..', '..KrrrrrrrrrrrK.', '..KKSSSSSSKKKK..', '..KSSSSSSKSSK...', '..KSSSSSSKSSK...', '..KSSSSSSSSSSK..', '...KSSSSSSSK....'];
  K.HERO = {
    run1: [...HEAD, '....KYYYYYYK....', '...KBBBBBYYYK...', '..KBBBBBBBYYK...', '.KSKBBBBBBBK....', '.KKKBBBBBbbK....', '...KBBBBBbbK....', '...KbbbbbbbK....', '..KDDDK.KDDDK...', '.KDDDK...KDDDK..', '.KDDK.....KDDK..', '.KKK.......KKK..', '................'],
    run2: [...HEAD, '....KYYYYYYK....', '...KBBBBBYYYK...', '..KBBBBBBBYYK...', '..KBBBBBBSKK....', '..KBBBBBbbbK....', '...KBBBBBbbK....', '...KbbbbbbbK....', '....KDDDDK......', '....KDDDDK......', '....KDDKDDK.....', '....KKK.KKK.....', '................'],
    jump: [...HEAD, '....KYYYYYYK.KK.', '...KBBBBBYYYKSK.', '..KBBBBBBBYYKK..', '..KBBBBBBBBK....', '..KBBBBBbbbK....', '...KBBBBBbbK....', '...KbbbbbbbK....', '..KDDDK.KDDDK...', '.KDDDK....KDDK..', '.KKKK......KK...', '................', '................'],
  };
  K.HH = 21;   // the hero stands with its feet on GROUND - 1
  K.hero = (x, y, mode, t) => K.sprite(mode === 'jump' ? K.HERO.jump : (Math.floor(t * 9) % 2 ? K.HERO.run1 : K.HERO.run2), x, y);
  // ───────── coins, the ? block, a heart ─────────
  K.coin = (x, y, t) => { const f = Math.floor(t * 10) % 4, w = [8, 6, 2, 6][f], x0 = Math.round(x + (8 - w) / 2); y = Math.round(y);
    R(x0, y + 1, w, 6, P.y); if (w > 2) { R(x0 + 1, y, w - 2, 8, P.y); R(x0 + 1, y + 1, w - 2, 6, P.Y); if (w >= 6) { R(x0 + w / 2 - 1, y + 2, 1, 4, P.y); R(x0 + 1, y + 1, 1, 2, P.W); } } };
  const QM = ['.KKKK.', 'K....K', '....K.', '...K..', '...K..', '......', '...K..'];
  K.qblock = (x, y, used = false, bump = 0) => { y = Math.round(y - bump); x = Math.round(x);
    R(x, y, 16, 16, '#5A3A1E'); R(x + 1, y + 1, 14, 14, used ? '#9A7A5A' : '#F2B33D'); R(x + 1, y + 1, 14, 1, used ? '#B89878' : '#FFD86A');
    if (!used) { [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([i, j]) => R(x + i, y + j, 1, 1, '#5A3A1E')); K.sprite(QM, x + 5, y + 4, { map: { K: '#5A3A1E' } }); } };
  const HEART = ['.KK.KK.', 'KRRKRRK', 'KRWRRRK', 'KRRRRRK', '.KRRRK.', '..KRK..', '...K...'];
  K.heart = (x, y) => K.sprite(HEART, x, y);
  // ───────── the world: dithered dusk, skyline, the street, stalls, lanterns ─────────
  const BANDS = [[0, '#2B1B4A'], [56, '#4A2163'], [100, '#8A2F6B'], [136, '#D4506A'], [168, '#F2784B'], [196, '#FFB37A']];
  K.sky = (night = 0) => { for (let i = 0; i < BANDS.length; i++) { const [y0, c] = BANDS[i], y1 = i + 1 < BANDS.length ? BANDS[i + 1][0] : BH; R(0, y0, BW, y1 - y0, c);
      if (i > 0) { const pc = BANDS[i - 1][1]; for (let y = y0; y < y0 + 4; y++) for (let x = (y % 2); x < BW; x += 2) if ((y - y0) < 2 || (x + y) % 4 === 0) R(x, y, 1, 1, pc); } }
    if (night > 0) { b.globalAlpha = night; R(0, 0, BW, BH, '#120C24'); b.globalAlpha = 1; } };
  K.stars = (t, a = 1) => { for (let i = 0; i < 40; i++) { if ((Math.floor(t * 3 + i) % 7) === 0) continue; const x = Math.floor(hash(i * 3.3) * BW), y = Math.floor(hash(i * 7.1) * 100); b.globalAlpha = a; R(x, y, 1, 1, i % 5 ? '#FFF3D6' : '#FFD84A'); } b.globalAlpha = 1; };
  K.sun = (x, y, r = 26) => { for (let j = -r; j <= r; j++) { const w = Math.floor(Math.sqrt(r * r - j * j)); if (j > 4 && (j % 4 === 0 || (j > 12 && j % 4 === 1))) continue; R(x - w, y + j, 2 * w, 1, j < -8 ? '#FFE9A0' : '#FFD06A'); } };
  K.skyline = (cam, k = 0.25, base = GROUND - 6) => { const off = -Math.floor(cam * k) % 240;
    for (let rep = -1; rep < 3; rep++) for (let i = 0; i < 12; i++) { const x = off + rep * 240 + i * 20, h = 26 + Math.floor(hash(i * 1.7) * 40), w = 16 + (i % 3) * 2;
      R(x, base - h, w, h, '#3A2552'); for (let wy = base - h + 4; wy < base - 4; wy += 6) for (let wx = x + 3; wx < x + w - 3; wx += 5) if (hash(wx * 0.37 + wy * 1.3) > 0.55) R(wx, wy, 2, 2, '#FFC85A'); } };
  K.hills = (cam, k = 0.45) => { const off = -Math.floor(cam * k); for (let x = 0; x < BW; x++) { const X = x - off, h = 18 + Math.floor(10 * Math.sin(X * 0.03) + 6 * Math.sin(X * 0.071)); R(x, GROUND - h, 1, h, '#4A2F5E'); } };
  // the cobbled street: rows of 16 x 16 stones
  K.street = (cam) => { const off = -Math.floor(cam) % 16; R(0, GROUND, BW, BH - GROUND, '#7A5A50');
    for (let row = 0; row < 3; row++) for (let x = off - 16 + (row % 2) * 8; x < BW + 16; x += 16) { const y = GROUND + row * 16; R(x, y, 15, 1, '#A88878'); R(x, y + 15, 16, 1, '#4E3530'); R(x + 15, y, 1, 16, '#4E3530'); }
    R(0, GROUND, BW, 2, '#C8A890'); };
  // a market stall at world x: awning stripes, a scalloped edge, a counter of goods, a sign
  K.stall = (wx, cam, sign, col = '#E8475F', seed = 1) => { const x = Math.round(wx - cam), y = GROUND - 66; if (x < -90 || x > BW + 10) return;
    R(x + 2, y + 10, 3, 56, '#4E3530'); R(x + 69, y + 10, 3, 56, '#4E3530');
    for (let i = 0; i < 9; i++) R(x + i * 8, y + 10, 8, 14, i % 2 ? '#FFF3E0' : col);
    for (let i = 0; i < 9; i++) { R(x + i * 8 + 1, y + 24, 6, 2, i % 2 ? '#FFF3E0' : col); R(x + i * 8 + 2, y + 26, 4, 1, i % 2 ? '#FFF3E0' : col); }
    R(x, y + 8, 74, 2, '#4E3530'); R(x + 4, y + 44, 66, 22, '#A0663E'); R(x + 4, y + 44, 66, 2, '#C8885A');
    for (let i = 0; i < 7; i++) { const c = ['#3B7DD8', '#5BD27A', '#FFD84A', '#B57BFF', '#E8475F'][Math.floor(hash(seed * 9 + i) * 5)]; R(x + 7 + i * 9, y + 36, 7, 8, c); R(x + 8 + i * 9, y + 37, 5, 2, '#FFFFFF'); }
    if (sign) { const w = K.measure(sign, 12) + 10; R(x + 37 - w / 2, y - 10, w, 18, '#2B1B4A'); R(x + 37 - w / 2 + 1, y - 9, w - 2, 16, '#FFF3D6'); K.text(sign, x + 37, y + 4, 12, '#2B1B4A', { align: 'center' }); } };
  K.lanterns = (cam, t) => { const off = -Math.floor(cam * 0.9) % 96; for (let x = off - 96; x < BW + 96; x += 96) { for (let i = 0; i < 96; i += 2) { const sag = Math.round(10 * Math.sin(Math.PI * i / 96)); R(x + i, 120 + sag, 2, 1, '#2B1B4A'); }
      for (let k = 1; k < 4; k++) { const lx = x + k * 24, ly = 120 + Math.round(10 * Math.sin(Math.PI * k / 4)) + 1, on = (Math.floor(t * 2.4) + k) % 4 !== 0;
        R(lx - 3, ly, 6, 7, on ? P.O : '#B85A2A'); R(lx - 2, ly - 1, 4, 1, '#2B1B4A'); R(lx - 2, ly + 7, 4, 1, '#2B1B4A'); if (on) { b.globalAlpha = 0.25; R(lx - 6, ly - 3, 12, 13, '#FFD06A'); b.globalAlpha = 1; } } } };
  // a gate with a banner, at world x
  K.gate = (wx, cam, label) => { const x = Math.round(wx - cam), y = GROUND - 92; R(x, y, 6, 92, '#8A2F2F'); R(x + 90, y, 6, 92, '#8A2F2F'); R(x - 8, y - 6, 112, 8, '#5A1E1E'); R(x - 4, y + 6, 104, 6, '#8A2F2F');
    const w = K.measure(label, 12) + 14; R(x + 48 - w / 2, y + 16, w, 18, '#FFD84A'); R(x + 48 - w / 2, y + 16, w, 1, '#FFF3B0'); K.text(label, x + 48, y + 30, 12, '#5A1E1E', { align: 'center' }); };
  // pixel fireworks: a burst of n sparks at (x, y), age a (s)
  K.burst = (x, y, a, col, n = 16) => { if (a < 0 || a > 1.4) return; for (let i = 0; i < n; i++) { const an = i / n * TAU, r = 48 * Ease.outC(clamp(a / 0.8)), px = x + Math.cos(an) * r, py = y + Math.sin(an) * r + 20 * a * a;
      if (a > 1.0 && (i + Math.floor(a * 20)) % 2) continue; R(px, py, 3, 3, (i % 3 === 0 && a < 0.6) ? '#FFFFFF' : col); } };
  // ───────── text: Galmuri11 at 12 px (or 24, 36: whole multiples), drawn crisp through an alpha threshold ─────────
  K.measure = (s, size = 12) => { tb.font = `400 ${size}px ${FAM.display}`; return Math.round(tb.measureText(s).width); };
  K.text = (s, x, y, size = 12, col = '#FFFFFF', o = {}) => {
    if (!s) return 0; tb.setTransform(1, 0, 0, 1, 0, 0); tb.clearRect(0, 0, BW, 64); tb.font = `${o.bold ? 700 : 400} ${size}px ${FAM.display}`; tb.textBaseline = 'alphabetic'; tb.fillStyle = '#FFFFFF';
    const w = Math.min(BW - 6, Math.round(tb.measureText(s).width)), hg = size + 10, x0 = Math.round(o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x), y0 = Math.round(y) - size - 4;
    tb.fillText(s, 2, size + 4); const d = tb.getImageData(0, 0, w + 6, hg).data;
    const paint = (cc, dx, dy) => { const c = parseColor(cc), out = tb.createImageData(w + 6, hg), od = out.data;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] >= 128) { od[i] = c[0]; od[i + 1] = c[1]; od[i + 2] = c[2]; od[i + 3] = 255; }
      tb.putImageData(out, 0, 0); b.drawImage(tbuf, 0, 0, w + 6, hg, x0 - 2 + dx, y0 + dy, w + 6, hg); };
    if (o.shadow) paint(o.shadow, o.sx ?? 1, o.sy ?? 1);
    paint(col, 0, 0);
    return w;
  };
  // a framed box (dialogue / card)
  K.box = (x, y, w, h, o = {}) => { x = Math.round(x); y = Math.round(y); R(x, y, w, h, o.edge || '#FFFFFF'); R(x + 2, y + 2, w - 4, h - 4, o.bg || '#1A1423'); if (o.inner !== false) { R(x + 3, y + 3, w - 6, 1, o.hi || '#4A3A6A'); } };
  K.hud = (score, coins, world, time) => { K.text('점수', 12, 16, 12, '#FFFFFF', { shadow: '#1A1423' }); K.text(String(score).padStart(6, '0'), 12, 30, 12, '#FFFFFF', { shadow: '#1A1423' });
    K.coin(140, 7, 0); K.text('×' + String(coins).padStart(2, '0'), 152, 16, 12, '#FFFFFF', { shadow: '#1A1423' });
    K.text('장터', 300, 16, 12, '#FFFFFF', { shadow: '#1A1423' }); K.text(world, 300, 30, 12, '#FFFFFF', { shadow: '#1A1423' });
    K.text('시간', 420, 16, 12, '#FFFFFF', { shadow: '#1A1423' }); K.text(String(time).padStart(3, '0'), 420, 30, 12, '#FFFFFF', { shadow: '#1A1423' }); };
  window.PX8 = K;
})();

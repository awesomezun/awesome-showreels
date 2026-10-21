// cyber: the 네온 레인 2087 reel's kit (a project module). A rainy neon city in 2D: a violet sky with a city glow,
// towers in three depths with window grids, vertical Korean neon signs that flicker, a hologram billboard, rain
// streaks, a wet street that mirrors everything above it in rippling strips, a hooded walker, flying cars with light
// trails, and glitches (RGB-split lettering, displaced slices of the frame). Display type Do Hyeon, UI type Orbit.
(() => {
  const K = {}, COL = { sky0: '#07041A', sky1: '#2A0E3E', mag: '#FF2E88', cyan: '#2EE6FF', yel: '#FFD23A', grn: '#3AFF9E', org: '#FF7A2E', ink: '#F5F0FF', ink2: '#B9A9D9' };
  K.COL = COL;
  const rgba = (hex, a) => { const c = parseColor(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  K.rgba = rgba;
  K.fd = (size) => `400 ${size}px ${FAM.display}`; K.fu = (size) => `400 ${size}px ${FAM.mono}`;
  K.sky = (ctx, o = {}) => { const g = ctx.createLinearGradient(0, 0, 0, o.horizon ?? H); g.addColorStop(0, COL.sky0); g.addColorStop(0.7, COL.sky1); g.addColorStop(1, '#5A1A4A'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  const SIGNS = ['라면', '전당포', '여관', '노래방', '24시', '약국', '수리', '해장국', '만화방', '사진관', '부품', '오락실'];
  const SCOL = [COL.mag, COL.cyan, COL.yel, COL.grn, COL.org];
  // a vertical neon sign: a dark board, a coloured frame, stacked letters; a = on (flicker handled by caller)
  K.sign = (ctx, x, y, s, col, size, a = 1) => { const chars = [...s], h = chars.length * size * 1.05 + size * 0.5, w = size * 1.4;
    ctx.save(); ctx.fillStyle = 'rgba(10,6,20,0.92)'; ctx.fillRect(x - w / 2, y, w, h);
    ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col; ctx.shadowBlur = size * 0.6 * a; ctx.strokeStyle = rgba(col, 0.9 * a); ctx.lineWidth = Math.max(2, size * 0.06); ctx.strokeRect(x - w / 2 + 4, y + 4, w - 8, h - 8);
    ctx.font = K.fd(size); ctx.textAlign = 'center'; ctx.fillStyle = rgba(col, a); chars.forEach((c, i) => ctx.fillText(c, x, y + size * (1.05 * i + 1.05)));
    ctx.shadowBlur = 0; ctx.fillStyle = rgba('#FFFFFF', 0.7 * a); chars.forEach((c, i) => ctx.fillText(c, x, y + size * (1.05 * i + 1.05))); ctx.restore(); return h; };
  K.on = (t, seed) => { const k = Math.floor(t * 12 + seed * 7); return hash(k * 1.7 + seed) > 0.06 ? 1 : 0.15; };
  // towers: deterministic per layer; o = {horizon, pan, depth (0 far .. 2 near), scale, signs}
  K.towers = (ctx, t, o) => { const L = o.depth, hz = o.horizon, n = [16, 11, 7][L], col = ['#140C2E', '#1C1036', '#120A22'][L], sc = o.scale ?? 1;
    for (let i = 0; i < n; i++) { const r = hash(i * 9.1 + L * 31), w = ([90, 150, 240][L] + r * [80, 120, 160][L]) * sc, h = ([240, 320, 520][L] + Math.pow(hash(i * 3.7 + L), 1.6) * [420, 460, 420][L]) * sc * (o.tall ?? 1);
      const span = W + 600, v = (i / n) * span + hash(i * 1.3 + L) * 60 - (o.pan ?? 0) * [0.2, 0.5, 1][L], x = ((v % span) + span) % span - 300;
      const y = hz - h; ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
      // windows
      const ww = [5, 7, 10][L] * sc, gap = [12, 16, 22][L] * sc;
      for (let yy = y + gap; yy < hz - gap; yy += gap) for (let xx = x + gap * 0.6; xx < x + w - ww; xx += gap) { const hv = hash(xx * 0.13 + yy * 0.71 + L); if (hv < [0.8, 0.74, 0.7][L]) continue;
        ctx.fillStyle = hv > 0.96 ? rgba(COL.cyan, 0.6) : hv > 0.92 ? rgba(COL.mag, 0.5) : rgba('#FFC870', 0.2 + 0.12 * L); ctx.fillRect(xx, yy, ww, ww * 0.8); }
      // a neon strip down one edge of some towers
      if (L > 0 && i % 3 === 1) { const c = SCOL[(i * 2 + L) % SCOL.length]; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = c; ctx.shadowBlur = 16; ctx.fillStyle = rgba(c, 0.8 * K.on(t, i + 50)); ctx.fillRect(x + w - 5, y + 10, 4, h - 20); ctx.restore(); }
      if (L === 0 && i % 3 === 0) { const on = Math.floor(t * 1.5 + i) % 2; ctx.fillStyle = on ? '#FF3A3A' : '#5A1010'; ctx.fillRect(x + w / 2 - 3, y - 14, 6, 6); }
      if (o.signs && L > 0 && i % (L === 1 ? 2 : 1) === 0) { const s = SIGNS[(i * 5 + L * 3) % SIGNS.length], c = SCOL[(i + L) % SCOL.length], size = (L === 1 ? 40 : 66) * sc;
        K.sign(ctx, x + (i % 2 ? w - size * 0.2 : size * 0.2), y + h * (0.18 + 0.35 * hash(i * 2.2 + L)), s, c, size, K.on(t, i + L * 10)); } } };
  // a hologram billboard: translucent, scanlined, a slowly turning koi and a caption
  K.holo = (ctx, x, y, w, h, t, text, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= a * (0.85 + 0.15 * Math.sin(t * 17));
    const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, rgba(COL.cyan, 0.16)); g.addColorStop(1, rgba(COL.mag, 0.08)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = rgba(COL.cyan, 0.5); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    const cx = x + w / 2, cy = y + h * 0.45, s = h * 0.32; ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.cos(t * 0.8), 1); ctx.beginPath(); ctx.ellipse(0, 0, s, s * 0.42, 0, 0, TAU); ctx.moveTo(s, 0); ctx.lineTo(s * 1.45, -s * 0.35); ctx.lineTo(s * 1.45, s * 0.35); ctx.closePath();
    ctx.fillStyle = rgba(COL.org, 0.35); ctx.fill(); ctx.strokeStyle = rgba(COL.yel, 0.7); ctx.stroke(); ctx.restore();
    ctx.font = K.fd(h * 0.16); ctx.textAlign = 'center'; ctx.fillStyle = rgba(COL.cyan, 0.85); ctx.fillText(text, cx, y + h * 0.9);
    for (let yy = y; yy < y + h; yy += 4) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, yy, w, 1.5); } ctx.restore(); };
  // rain: streaks falling at an angle; deterministic in t
  K.rain = (ctx, t, o = {}) => { const n = o.n ?? 420, len = o.len ?? 46, vy = o.vy ?? 1900, vx = o.vx ?? -260, top = o.top ?? 0, bot = o.bot ?? H;
    ctx.save(); ctx.strokeStyle = o.col || 'rgba(190,200,255,0.35)'; ctx.lineWidth = o.w ?? 1.6; ctx.beginPath();
    for (let i = 0; i < n; i++) { const ph = hash(i * 1.31), sp = 0.7 + 0.6 * hash(i * 2.7), span = bot - top + len, y = top + ((ph * span + t * vy * sp) % span) - len, x = ((hash(i * 5.9) * (W + 300) + t * vx * sp) % (W + 300) + W + 300) % (W + 300) - 150;
      ctx.moveTo(x, y); ctx.lineTo(x + vx * sp * len / (vy * sp), y + len * sp); }
    ctx.stroke(); ctx.restore(); };
  // the wet street: mirror the band above the horizon into it in rippling strips, then darken
  let tmp = null;
  K.reflect = (ctx, hz, t, o = {}) => { const cw = ctx.canvas.width, ch = ctx.canvas.height, k = cw / W, band = Math.min(hz, H - hz);
    if (!tmp) tmp = document.createElement('canvas'); tmp.width = cw; tmp.height = Math.ceil(band * k); const g = tmp.getContext('2d'); g.clearRect(0, 0, tmp.width, tmp.height);
    g.drawImage(ctx.canvas, 0, (hz - band) * k, cw, band * k, 0, 0, cw, band * k);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0A0614'; ctx.fillRect(0, hz * k, cw, ch - hz * k);
    const strip = 6 * k; for (let y = 0; y < band * k; y += strip) { const sy = band * k - y - strip, wob = Math.sin(y * 0.09 / k + t * 5) * (3 + y / k * 0.03) * k;
      ctx.globalAlpha = (o.a ?? 0.5) * (1 - y / (band * k)) ; ctx.drawImage(tmp, 0, Math.max(0, sy), cw, strip, wob, hz * k + y, cw, strip); }
    ctx.restore();
    ctx.save(); const gg = ctx.createLinearGradient(0, hz, 0, H); gg.addColorStop(0, 'rgba(10,6,20,0.15)'); gg.addColorStop(1, 'rgba(10,6,20,0.7)'); ctx.fillStyle = gg; ctx.fillRect(0, hz, W, H - hz); ctx.restore();
    // splashes
    ctx.save(); ctx.strokeStyle = 'rgba(200,210,255,0.35)'; ctx.lineWidth = 1.5; for (let i = 0; i < 40; i++) { const ph = (t * 2.2 + hash(i * 3.3)) % 1, x = hash(i * 7.7 + Math.floor(t * 2.2 + hash(i * 3.3))) * W, y = hz + 20 + hash(i * 1.9 + Math.floor(t * 2.2 + hash(i * 3.3))) * (H - hz - 30);
      ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(x, y, 4 + 22 * ph, 1.5 + 5 * ph, 0, 0, TAU); ctx.stroke(); } ctx.restore(); };
  // the walker: hooded long coat, a cyan visor; walk phase from x travelled
  K.walker = (ctx, x, y, s, ph, rim = COL.mag) => { const sw = Math.sin(ph) * 22 * s, P = (u, v) => [x + u * s, y + v * s];
    const draw = (col, dx) => { ctx.save(); ctx.translate(dx, 0); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
      ctx.lineWidth = 22 * s; ctx.beginPath(); ctx.moveTo(...P(-6, -120)); ctx.lineTo(x - 6 * s + sw, y); ctx.moveTo(...P(6, -120)); ctx.lineTo(x + 6 * s - sw, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(...P(-42, -290)); ctx.lineTo(...P(42, -290)); ctx.lineTo(...P(56 + sw * 0.3 / s, -60)); ctx.lineTo(...P(-50 - sw * 0.3 / s, -60)); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(...P(0, -316), 34 * s, Math.PI * 0.9, Math.PI * 2.1); ctx.lineTo(...P(30, -280)); ctx.lineTo(...P(-30, -280)); ctx.closePath(); ctx.fill(); ctx.restore(); };
    ctx.save(); ctx.shadowColor = rim; ctx.shadowBlur = 30; draw(rim, -4); draw(COL.cyan, 4); ctx.restore(); draw('#05030B', 0); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = COL.cyan; ctx.shadowBlur = 18; ctx.fillStyle = COL.cyan; ctx.fillRect(x - 4 * s, y - 318 * s, 28 * s, 5 * s); ctx.restore(); };
  // a flying car with head and tail lights and a trail; dir = +1 right
  K.car = (ctx, x, y, s, dir = 1, trail = 260) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x, 0, x - dir * trail * s, 0); g.addColorStop(0, 'rgba(255,60,90,0.7)'); g.addColorStop(1, 'rgba(255,60,90,0)'); ctx.fillStyle = g;
    ctx.fillRect(Math.min(x, x - dir * trail * s), y - 3 * s, trail * s, 6 * s); ctx.restore();
    ctx.fillStyle = '#0C0818'; ctx.beginPath(); ctx.roundRect(x - 40 * s, y - 14 * s, 80 * s, 22 * s, 9 * s); ctx.fill(); ctx.fillStyle = rgba(COL.cyan, 0.8); ctx.fillRect(x - 18 * s, y - 12 * s, 36 * s, 5 * s);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,250,220,0.9)'; ctx.shadowColor = '#FFF4C0'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x + dir * 40 * s, y, 5 * s, 0, TAU); ctx.fill(); ctx.restore(); };
  // glitch lettering: RGB split that jumps, with a slice offset on glitch frames
  K.gtext = (ctx, s, x, y, size, t, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; const gl = o.glitch ?? (hash(Math.floor(t * 14) * 3.7) > 0.82 ? 1 : 0), off = (o.split ?? 6) * (0.4 + gl);
    ctx.save(); ctx.font = o.font || K.fd(size); ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,40,120,0.85)'; ctx.fillText(s, x - off, y); ctx.fillStyle = 'rgba(40,230,255,0.85)'; ctx.fillText(s, x + off, y + (gl ? 3 : 0));
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  // displace horizontal slices of the frame (a burst of digital breakage); k = 0..1
  K.slices = (ctx, t, k) => { if (k <= 0.02) return; const cw = ctx.canvas.width, s = cw / W; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < 9; i++) { const r = hash(Math.floor(t * 20) * 3.1 + i), y = r * H * s, h = (8 + hash(i * 7 + Math.floor(t * 20)) * 50) * s, dx = (hash(i * 11 + Math.floor(t * 20)) - 0.5) * 120 * s * k; ctx.drawImage(ctx.canvas, 0, y, cw, h, dx, y, cw, h); }
    ctx.restore(); };
  // a dark veil from the left so the lines read over the signs
  K.scrim = (ctx, a = 0.8, x1 = 1250) => { const g = ctx.createLinearGradient(0, 0, x1, 0); g.addColorStop(0, `rgba(7,4,26,${a})`); g.addColorStop(0.6, `rgba(7,4,26,${a * 0.7})`); g.addColorStop(1, 'rgba(7,4,26,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, x1, H); };
  window.CYBER = K;
})();

// haru: the 벚꽃 정류장 reel's kit (a project module). An anime background painting in 2D: a deep-to-pale sky, cumulus
// clouds built from shaded puffs (lit from the sun's side, blue-grey underneath), a sun with rays and a flare, power
// lines on a pole, a cherry tree of pink clusters, falling petals that flip as they turn, a bus stop (sign, shelter,
// bench, arrival board), a street, two students seen from behind, and a city bus. Type in Gowun Dodum.
(() => {
  const K = {}, COL = { sky0: '#1F5FC8', sky1: '#7FC4F2', sky2: '#FFE8C8', cloud: '#FFFFFF', cshade: '#B9C7E6', pink: '#FFC3D7', pink2: '#F49BBB', pink3: '#FFE4EE', ink: '#1E2A44', sign: '#2E6FD8', trunk: '#4A3530' };
  K.COL = COL;
  K.sky = (ctx, y0 = 0, h = H) => { const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, COL.sky0); g.addColorStop(0.6, COL.sky1); g.addColorStop(1, COL.sky2); ctx.fillStyle = g; ctx.fillRect(0, y0, W, h); };
  // a cumulus: puffs around (x, y), seeded; sun direction sx (-1 left .. 1 right)
  K.cloud = (ctx, x, y, s, seed = 1, o = {}) => { const P = []; for (let i = 0; i < 18; i++) { const a = hash(i * 3.1 + seed) * Math.PI, d = Math.sqrt(hash(i * 7.3 + seed)) ; P.push([x + Math.cos(a) * d * 260 * s, y - Math.sin(a) * d * 150 * s + 40 * s, (60 + hash(i * 1.9 + seed) * 70) * s]); }
    for (let i = 0; i < 9; i++) P.push([x - 280 * s + i * 70 * s, y + 70 * s + hash(i + seed) * 10 * s, (55 + hash(i * 5 + seed) * 25) * s]);
    // one merged mass: the union in the shade tone, then the union again nudged up and left in white (so the shade is
    // left only along the underside), then a soft warm glow on the sunny top
    const union = (dx, dy, k = 1) => { ctx.beginPath(); for (const [px, py, r] of P) { ctx.moveTo(px + dx + r * k, py + dy); ctx.arc(px + dx, py + dy, r * k, 0, TAU); } };
    ctx.save(); ctx.globalAlpha *= o.a ?? 1; union(0, 0); ctx.fillStyle = COL.cshade; ctx.fill(); ctx.clip();
    union(-12 * s, -26 * s); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    const g = ctx.createLinearGradient(0, y - 220 * s, 0, y + 120 * s); g.addColorStop(0, 'rgba(255,246,225,0.55)'); g.addColorStop(1, 'rgba(255,246,225,0)'); ctx.fillStyle = g; ctx.fillRect(x - 500 * s, y - 300 * s, 1000 * s, 420 * s);
    ctx.restore(); };
  K.sun = (ctx, x, y, t, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, 520); g.addColorStop(0, `rgba(255,252,235,${0.95 * a})`); g.addColorStop(0.12, `rgba(255,240,200,${0.5 * a})`); g.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = g; ctx.fillRect(x - 520, y - 520, 1040, 1040);
    for (let i = 0; i < 9; i++) { const an = i / 9 * Math.PI + 0.3 + t * 0.02, l = 900; const gg = ctx.createLinearGradient(x, y, x + Math.cos(an) * l, y + Math.sin(an) * l); gg.addColorStop(0, `rgba(255,248,220,${0.16 * a})`); gg.addColorStop(1, 'rgba(255,248,220,0)'); ctx.fillStyle = gg;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an - 0.035) * l, y + Math.sin(an - 0.035) * l); ctx.lineTo(x + Math.cos(an + 0.035) * l, y + Math.sin(an + 0.035) * l); ctx.closePath(); ctx.fill(); }
    for (const [k, r, c] of [[0.35, 40, '255,200,230'], [0.7, 18, '180,230,255'], [1.2, 70, '255,230,180'], [1.6, 26, '200,255,220']]) { const gx = x + (W / 2 - x) * k * 2, gy = y + (H / 2 - y) * k * 2, gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, r); gg.addColorStop(0, `rgba(${c},${0.18 * a})`); gg.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(gx, gy, r, 0, TAU); ctx.fill(); }
    ctx.restore(); };
  // a utility pole with three sagging lines across the frame
  K.wires = (ctx, px, py, o = {}) => { ctx.save(); ctx.fillStyle = '#2A3048'; ctx.fillRect(px - 12, py, 24, 2000); ctx.fillRect(px - 110, py + 40, 220, 14); ctx.fillRect(px - 80, py + 110, 160, 12);
    ctx.strokeStyle = 'rgba(30,36,60,0.85)'; ctx.lineWidth = 3; for (const [y0, sag, x1, y1] of [[py + 47, 140, -200, py + 300], [py + 47, 170, W + 200, py + 220], [py + 116, 120, -200, py + 420], [py + 116, 150, W + 200, py + 330]]) { const x0 = px + (x1 < px ? -100 : 100); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + sag, x1, y1); ctx.stroke(); } ctx.restore(); };
  // a cherry tree: trunk and branches, then canopy clusters
  K.tree = (ctx, x, y, s, t, seed = 2) => { ctx.save(); ctx.fillStyle = COL.trunk; ctx.beginPath(); ctx.moveTo(x - 30 * s, y); ctx.quadraticCurveTo(x - 10 * s, y - 250 * s, x - 60 * s, y - 420 * s); ctx.lineTo(x - 30 * s, y - 430 * s); ctx.quadraticCurveTo(x + 20 * s, y - 260 * s, x + 30 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = COL.trunk; ctx.lineCap = 'round'; for (const [bx, by, ex, ey, w] of [[-40, -380, -300, -520, 16], [-35, -400, 160, -600, 14], [-50, -420, -120, -700, 12], [-20, -300, 260, -420, 12]]) { ctx.lineWidth = w * s; ctx.beginPath(); ctx.moveTo(x + bx * s, y + by * s); ctx.quadraticCurveTo(x + (bx + ex) / 2 * s, y + (by + ey) / 2 * s - 40 * s, x + ex * s, y + ey * s); ctx.stroke(); } ctx.restore();
    // the canopy: each cluster a merged flat mass (darker pink), the same nudged up-left in the light pink, then a
    // sprinkle of small blossoms; no per-puff shading, so it reads as one soft mass, not balls
    const C = [[-300, -560, 170], [160, -640, 190], [-120, -740, 200], [260, -460, 150], [-20, -560, 220], [-420, -440, 120], [380, -580, 130]], puffs = [];
    for (const [cx, cy, r] of C) for (let k = 0; k < 14; k++) { const a = hash(k * 2.3 + cx) * TAU, d = Math.sqrt(hash(k * 4.1 + cy)) * r * s; puffs.push([x + cx * s + Math.cos(a) * d, y + cy * s + Math.sin(a) * d * 0.7 + Math.sin(t * 1.2 + k + cx) * 2, (46 + hash(k * 9 + cx) * 40) * s]); }
    const union = (dx, dy) => { ctx.beginPath(); for (const [px, py, r] of puffs) { ctx.moveTo(px + dx + r, py + dy); ctx.arc(px + dx, py + dy, r, 0, TAU); } };
    ctx.save(); union(0, 0); ctx.fillStyle = COL.pink2; ctx.fill(); ctx.clip(); union(-14 * s, -22 * s); ctx.fillStyle = COL.pink; ctx.fill(); union(-34 * s, -50 * s); ctx.fillStyle = 'rgba(255,228,238,0.7)'; ctx.fill();
    for (let i = 0; i < 260; i++) { const [px, py, r] = puffs[i % puffs.length], a = hash(i * 1.7) * TAU, d = hash(i * 3.9) * r; ctx.fillStyle = i % 3 ? 'rgba(255,255,255,0.75)' : 'rgba(232,120,160,0.6)'; ctx.beginPath(); ctx.arc(px + Math.cos(a) * d, py + Math.sin(a) * d, 3.5 * s, 0, TAU); ctx.fill(); }
    ctx.restore(); };
  // petals: n falling, drifting with the wind, flipping
  K.petals = (ctx, t, o = {}) => { const n = o.n ?? 70, wind = o.wind ?? 120; ctx.save();
    for (let i = 0; i < n; i++) { const sp = 80 + hash(i * 3.7) * 90, ph = hash(i * 1.3), x = ((hash(i * 7.1) * (W + 400) + t * wind * (0.6 + hash(i))) % (W + 400)) - 200 + Math.sin(t * 1.5 + i) * 40, y = ((ph * (H + 200) + t * sp) % (H + 200)) - 100, sz = (o.size ?? 1) * (9 + hash(i * 5.5) * 9), rot = t * 2 + i, flip = Math.cos(t * 3 + i * 1.7);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip, 1); ctx.fillStyle = i % 3 ? COL.pink : COL.pink3; ctx.beginPath(); ctx.moveTo(0, -sz); ctx.quadraticCurveTo(sz * 0.9, -sz * 0.2, 0, sz); ctx.quadraticCurveTo(-sz * 0.9, -sz * 0.2, 0, -sz); ctx.fill(); ctx.restore(); }
    ctx.restore(); };
  K.street = (ctx, hz) => { const g = ctx.createLinearGradient(0, hz, 0, H); g.addColorStop(0, '#9AA3B8'); g.addColorStop(1, '#6E7890'); ctx.fillStyle = g; ctx.fillRect(0, hz, W, H - hz);
    ctx.fillStyle = '#C8C2B8'; ctx.fillRect(0, hz + 120, W, 28); ctx.fillStyle = '#DDD6CA'; ctx.fillRect(0, hz + 148, W, H); ctx.strokeStyle = 'rgba(120,110,100,0.3)'; ctx.lineWidth = 2; for (let x = -40; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, hz + 148); ctx.lineTo(x - 60, H); ctx.stroke(); } };
  // the bus stop: a pole with a round sign, a shelter, a bench, an arrival board
  K.stop = (ctx, x, y, t, o = {}) => { ctx.save(); ctx.fillStyle = '#5E6A82'; ctx.fillRect(x + 380, y - 420, 16, 420); ctx.fillRect(x - 20, y - 420, 16, 420); const rg = ctx.createLinearGradient(0, y - 470, 0, y - 420); rg.addColorStop(0, '#E8EEF8'); rg.addColorStop(1, '#AEB9CC'); ctx.fillStyle = rg; ctx.fillRect(x - 60, y - 470, 500, 50);
    ctx.fillStyle = 'rgba(200,225,245,0.35)'; ctx.fillRect(x - 4, y - 420, 384, 300); ctx.fillStyle = '#7A5A40'; ctx.fillRect(x + 20, y - 150, 340, 22); ctx.fillStyle = '#5A4030'; ctx.fillRect(x + 40, y - 128, 14, 128); ctx.fillRect(x + 326, y - 128, 14, 128);
    ctx.fillStyle = '#4A4F5E'; ctx.fillRect(x - 200, y - 450, 14, 450); ctx.fillStyle = COL.sign; ctx.beginPath(); ctx.arc(x - 193, y - 480, 70, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = '#FFF'; ctx.font = `400 44px ${FAM.display}`; ctx.textAlign = 'center'; ctx.fillText('정류장', x - 193, y - 466);
    if (o.board !== false) { ctx.fillStyle = '#1A1E2A'; ctx.fillRect(x + 40, y - 400, 300, 110); ctx.fillStyle = (Math.floor(t * 2) % 2) ? '#FFB03A' : '#FF9A1A'; ctx.font = `400 48px ${FAM.display}`; ctx.textAlign = 'center'; ctx.fillText(o.text || '3분 후 도착', x + 190, y - 330); }
    ctx.restore(); };
  // two students on the bench, seen from behind, rim-lit: a girl (long hair) and a boy
  K.pair = (ctx, x, y, s, t, o = {}) => { const draw = (px, hair, lean) => { ctx.save(); ctx.translate(px, y); ctx.rotate(lean);
      ctx.fillStyle = '#2B3A66'; ctx.beginPath(); ctx.moveTo(-70 * s, 0); ctx.quadraticCurveTo(-80 * s, -150 * s, -45 * s, -190 * s); ctx.lineTo(45 * s, -190 * s); ctx.quadraticCurveTo(80 * s, -150 * s, 70 * s, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#F3F1EC'; ctx.beginPath(); ctx.moveTo(-30 * s, -190 * s); ctx.lineTo(0, -160 * s); ctx.lineTo(30 * s, -190 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2A2230'; ctx.beginPath(); ctx.arc(0, -240 * s, 52 * s, 0, TAU); ctx.fill(); if (hair) { ctx.beginPath(); ctx.moveTo(-50 * s, -250 * s); ctx.quadraticCurveTo(-64 * s, -150 * s, -40 * s + Math.sin(t * 2) * 6, -110 * s); ctx.lineTo(40 * s + Math.sin(t * 2 + 1) * 6, -110 * s); ctx.quadraticCurveTo(64 * s, -150 * s, 50 * s, -250 * s); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = 'rgba(255,230,190,0.85)'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(0, -240 * s, 52 * s, -1.4, -0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(45 * s, -188 * s); ctx.quadraticCurveTo(80 * s, -150 * s, 70 * s, -10 * s); ctx.stroke(); ctx.restore(); };
    draw(x - 85 * s, true, -0.03 + (o.lean ?? 0)); draw(x + 85 * s, false, 0.03 - (o.lean ?? 0)); };
  // a city bus side-on, x = its front
  K.bus = (ctx, x, y, s) => { ctx.save(); ctx.fillStyle = '#3BB273'; ctx.beginPath(); ctx.roundRect(x - 1100 * s, y - 420 * s, 1100 * s, 380 * s, 40 * s); ctx.fill(); ctx.fillStyle = '#2A8F58'; ctx.fillRect(x - 1100 * s, y - 120 * s, 1100 * s, 40 * s);
    ctx.fillStyle = 'rgba(190,225,245,0.9)'; for (let i = 0; i < 6; i++) ctx.fillRect(x - 1060 * s + i * 170 * s, y - 380 * s, 150 * s, 150 * s); ctx.fillStyle = '#FFE08A'; ctx.fillRect(x - 40 * s, y - 180 * s, 30 * s, 40 * s);
    ctx.fillStyle = '#1E2230'; for (const wx of [x - 900 * s, x - 260 * s]) { ctx.beginPath(); ctx.arc(wx, y - 40 * s, 70 * s, 0, TAU); ctx.fill(); ctx.fillStyle = '#9AA0AE'; ctx.beginPath(); ctx.arc(wx, y - 40 * s, 30 * s, 0, TAU); ctx.fill(); ctx.fillStyle = '#1E2230'; }
    ctx.fillStyle = '#FFFFFF'; ctx.font = `400 ${64 * s}px ${FAM.display}`; ctx.fillText('7번', x - 1040 * s, y - 160 * s); ctx.restore(); };
  // type: Gowun Dodum, white with a soft blue shadow, fading up line by line
  K.line = (ctx, s, x, y, size, lt, o = {}) => { const p = clamp((lt - (o.at ?? 0)) / (o.dur ?? 0.8)); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= Ease.outC(p) * (o.a ?? 1); ctx.font = `400 ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left';
    ctx.shadowColor = o.shadow || 'rgba(20,40,90,0.55)'; ctx.shadowBlur = size * 0.25; ctx.shadowOffsetY = size * 0.04; ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, x, y + (1 - Ease.outC(p)) * 16); ctx.restore(); };
  window.HARU = K;
})();

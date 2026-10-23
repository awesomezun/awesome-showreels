// silk: the 바람섬 다섯 길 reel's silkscreen kit (a project module). A travel poster printed one ink at a time: each
// layer is a set of flat shapes in one opaque ink (five inks on cream paper), pulled across by a squeegee whose blade
// and ink bead cross the sheet, the new colour arriving behind it with a ragged edge, landing a few pixels out of
// register and snapping in on the hit. The poster sits on the studio wall; beside it the run sheet lists each ink as
// it is printed. Display type is Gasoek One, small type Gothic A1.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.INK = { paper: '#F3EAD7', yellow: '#F2B84B', orange: '#E8743B', sea: '#2F7F93', green: '#7FA36B', deep: '#1E3E48' };
  const I = K.INK;
  K.WALL = '#2B3A3F';
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  K.PW = 600; K.PH = 840;
  let grainC = null, wallC = null;
  K.wall = (ctx) => {
    if (!wallC) { wallC = makeBuf(); const g = wallC.g; g.fillStyle = K.WALL; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(255,255,255,${0.012 + 0.02 * hash(i)})`; g.fillRect(hash(i * 3.1) * W, hash(i * 7.3) * H, 2 + 6 * hash(i * 1.7), 1); }
      const v = g.createRadialGradient(W * 0.4, H * 0.45, 200, W * 0.5, H * 0.5, W * 0.75); v.addColorStop(0, 'rgba(255,240,210,0.08)'); v.addColorStop(1, 'rgba(0,0,0,0.35)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }
    ctx.drawImage(wallC.c, 0, 0);
  };
  const grain = () => {
    if (!grainC) { grainC = makeBuf(K.PW, K.PH); const g = grainC.g; g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, K.PW, K.PH);
      for (let i = 0; i < 9000; i++) { const v = 200 + 55 * hash(i * 2.3); g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.fillRect(hash(i * 1.9) * K.PW, hash(i * 4.7) * K.PH, 1 + 2 * hash(i), 1 + hash(i * 5)); } }
    return grainC.c;
  };
  const poly = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); };
  const disc = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
  const hills = (g, base, amp, k, f = 0.012) => { g.beginPath(); g.moveTo(0, K.PH); for (let x = 0; x <= K.PW; x += 10) g.lineTo(x, base - amp * (0.5 + 0.5 * Math.sin(x * f + k))); g.lineTo(K.PW, K.PH); g.closePath(); g.fill(); };
  const band = (g, label, stats) => {        // the info band at the foot of the poster, in the darkest ink
    g.fillRect(0, K.PH - 150, K.PW, 150); g.save(); g.fillStyle = I.paper; g.font = K.F(64); g.fillText(label, 36, K.PH - 70);
    g.font = K.F(30, 'sans', 700); g.fillText(stats, 38, K.PH - 28); g.restore();
  };
  // the posters: each a list of [ink, draw(g)] layers in print order (light to dark), in a 600 x 840 sheet
  K.POSTERS = {
    title: [[I.yellow, g => { g.fillRect(0, 160, K.PW, 120); g.fillRect(0, 300, K.PW, 80); }],
            [I.orange, g => { disc(g, 420, 300, 110); g.fillRect(0, 380, K.PW, 30); }],
            [I.sea, g => { g.fillRect(0, 420, K.PW, 420); }],
            [I.green, g => { g.beginPath(); g.moveTo(40, 560); g.quadraticCurveTo(160, 440, 250, 420); g.lineTo(330, 340); g.lineTo(390, 420); g.quadraticCurveTo(480, 450, 580, 560); g.closePath(); g.fill(); }],
            [I.deep, g => { g.font = K.F(150); g.fillText('바람섬', 32, 150);
              g.save(); g.setLineDash([10, 9]); g.lineWidth = 5; g.strokeStyle = I.deep; g.beginPath(); g.moveTo(70, 548); g.quadraticCurveTo(200, 470, 330, 352); g.stroke(); g.restore();
              for (let k = 0; k < 4; k++) { g.lineWidth = 5; g.strokeStyle = I.deep; g.beginPath(); const x = 120 + k * 60, y = 230 + (k % 2) * 30; g.moveTo(x - 16, y - 8); g.quadraticCurveTo(x - 8, y - 14, x, y); g.quadraticCurveTo(x + 8, y - 14, x + 16, y - 8); g.stroke(); }
              band(g, '다섯 길', '섬 한 바퀴 · 48.4 km'); }]],
    coast: [[I.yellow, g => { g.fillRect(0, 0, K.PW, 200); g.fillRect(0, 230, K.PW, 60); }],
            [I.sea, g => { g.fillRect(0, 330, K.PW, 510); }],
            [I.green, g => { poly(g, [[0, 260], [180, 250], [260, 320], [300, 470], [250, 600], [0, 690]]); }],
            [I.orange, g => { for (let k = 0; k < 3; k++) g.fillRect(150, 140 + k * 40, 48, 20); disc(g, 470, 120, 50); }],
            [I.deep, g => { g.fillRect(150, 120, 48, 4); g.fillRect(146, 260, 56, 10); poly(g, [[150, 120], [174, 86], [198, 120]]);
              g.lineWidth = 4; g.strokeStyle = I.deep; g.strokeRect(150, 120, 48, 140);
              for (let k = 0; k < 6; k++) { g.beginPath(); const y = 400 + k * 52; for (let x = 300 + k * 10; x <= K.PW; x += 20) g.lineTo(x, y + 6 * Math.sin(x * 0.2)); g.stroke(); }
              g.font = K.F(110); g.fillText('해안길', 290, 300); band(g, '1길', '12.4 km · 4시간'); }]],
    oreum: [[I.yellow, g => { disc(g, 300, 260, 200); }],
            [I.green, g => { hills(g, 600, 260, 0.4, 0.008); }],
            [I.orange, g => { g.fillRect(0, 140, K.PW, 14); g.fillRect(0, 175, K.PW, 8); }],
            [I.deep, g => { g.beginPath(); g.moveTo(80, 690); g.quadraticCurveTo(200, 430, 330, 380); g.quadraticCurveTo(440, 430, 560, 690); g.closePath(); g.fill();
              g.save(); g.setLineDash([10, 9]); g.lineWidth = 5; g.strokeStyle = I.paper; g.beginPath(); g.moveTo(140, 680); g.lineTo(300, 600); g.lineTo(200, 520); g.lineTo(320, 430); g.lineTo(330, 384); g.stroke(); g.restore();
              g.font = K.F(110); g.fillText('오름길', 40, 120); band(g, '2길', '8.6 km · 3시간'); }]],
    wall: [[I.yellow, g => { g.fillRect(0, 0, K.PW, 300); }],
           [I.green, g => { g.fillRect(0, 300, K.PW, 540); for (let k = 0; k < 5; k++) disc(g, 80 + k * 115, 300 - (k % 2) * 20, 54); }],
           [I.orange, g => { for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) disc(g, 60 + k * 115 + 30 * Math.cos(j * 1.7 + k), 290 - (k % 2) * 20 + 22 * Math.sin(j * 2.1 + k), 9); }],
           [I.deep, g => { for (let r = 0; r < 3; r++) { const y = 420 + r * 95; for (let x = 0; x < K.PW; x += 38) { g.beginPath(); g.ellipse(x + 19 + (r % 2) * 18, y + 6 * Math.sin(x), 18, 14 + 4 * hash(x + r), 0.3 * hash(x * r + 1), 0, TAU); g.fill(); } }
             g.font = K.F(110); g.fillText('돌담길', 40, 140); band(g, '3길', '10.2 km · 3시간 30분'); }]],
    forest: [[I.yellow, g => { for (let k = 0; k < 3; k++) poly(g, [[200 + k * 140, 0], [250 + k * 140, 0], [120 + k * 160, 690], [40 + k * 160, 690]]); }],
             [I.green, g => { g.fillRect(0, 560, K.PW, 280); }],
             [I.sea, g => { for (let k = 0; k < 5; k++) { const x = 60 + k * 125, h = 420 + 60 * hash(k * 3); for (let j = 0; j < 5; j++) poly(g, [[x - 60 + j * 8, 580 - j * h / 6], [x, 580 - (j + 1.4) * h / 6], [x + 60 - j * 8, 580 - j * h / 6]]); } }],
             [I.deep, g => { for (let k = 0; k < 5; k++) g.fillRect(52 + k * 125, 560, 16, 120); g.font = K.F(120); g.fillText('숲길', 40, 140); band(g, '4길', '7.8 km · 2시간 30분'); }]],
    sunset: [[I.yellow, g => { g.fillRect(0, 0, K.PW, 520); }],
             [I.orange, g => { disc(g, 300, 470, 190); for (let k = 0; k < 4; k++) g.fillRect(0, 120 + k * 50, K.PW, 14 - k * 3); }],
             [I.sea, g => { g.fillRect(0, 470, K.PW, 370); }],
             [I.deep, g => { g.save(); g.fillStyle = I.orange; for (let k = 0; k < 6; k++) g.fillRect(300 - 150 + k * 22, 500 + k * 28, 300 - k * 44, 8); g.restore();
               poly(g, [[0, 470], [140, 440], [210, 470], [0, 520]]); g.fillRect(150, 400, 9, 40); disc(g, 154, 393, 7);
               g.font = K.F(110); g.fillText('노을길', 40, 120); band(g, '5길', '9.4 km · 3시간'); }]],
  };
  // print a poster at (x, y, s) with each layer i pulled at times[i] (pull d seconds); returns the active pull (or null)
  K.poster = (ctx, key, x, y, s, lt, times, o = {}) => {
    const L = K.POSTERS[key], d = o.d ?? 0.42; let active = null;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = I.paper; ctx.fillRect(0, 0, K.PW, K.PH); ctx.restore(); }
    ctx.fillStyle = I.paper; ctx.fillRect(0, 0, K.PW, K.PH);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, K.PW, K.PH); ctx.clip();
    L.forEach(([ink, fn], i) => {
      const p = (lt - times[i]) / d; if (p <= 0) return;
      const xe = -40 + (K.PW + 80) * Ease.ioQ(clamp(p)), snap = spring(clamp((lt - times[i] - d) / 0.4), 3, 0.45);
      const dx = p < 1 ? 9 : lerp(9, 1.2 * (i % 2 ? 1 : -1), snap), dy = p < 1 ? -6 : lerp(-6, 0.8 * (i % 3 - 1), snap);
      ctx.save(); ctx.beginPath(); ctx.moveTo(-50, -50);
      for (let yy = -50; yy <= K.PH + 50; yy += 30) ctx.lineTo(xe + 10 * Math.sin(yy * 0.07 + i) + 8 * hash(yy + i * 9), yy);
      ctx.lineTo(-50, K.PH + 50); ctx.closePath(); ctx.clip(); ctx.translate(dx, dy); ctx.fillStyle = ink; fn(ctx); ctx.restore();
      if (p < 1) active = { xe, ink, i };
    });
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.5; ctx.drawImage(grain(), 0, 0);
    ctx.restore();
    if (active && o.blade !== false) {        // the squeegee: a rubber blade with its ink bead, crossing the sheet
      const { xe, ink } = active; ctx.fillStyle = ink; ctx.globalAlpha = 0.9; rr(ctx, xe + 4, -20, 16, K.PH + 40, 8); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = '#26272A'; rr(ctx, xe + 18, -40, 26, K.PH + 80, 6); ctx.fill();
      ctx.fillStyle = '#B9BEC2'; rr(ctx, xe + 40, -60, 34, K.PH + 120, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(xe + 46, -50, 6, K.PH + 100);
    }
    ctx.restore();
    return active;
  };
  // the run sheet beside the poster: one swatch per ink, ticked as it is printed
  K.runSheet = (ctx, x, y, key, lt, times, names) => {
    K.POSTERS[key].forEach(([ink], i) => {
      const a = clamp((lt - times[i]) / 0.3); if (a <= 0) return; const yy = y + i * 64;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = ink; rr(ctx, x, yy, 44, 44, 6); ctx.fill();
      ctx.fillStyle = 'rgba(243,234,215,0.85)'; ctx.font = K.F(34, 'sans', 700); ctx.fillText(`${i + 1}도 · ${names[i]}`, x + 64, yy + 34); ctx.restore();
    });
  };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display', o.w ?? 400); ctx.fillStyle = o.color || I.paper; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x + (o.dx || 0) * (1 - clamp(a)), y + 14 * (1 - clamp(a))); ctx.restore(); };
  K.sway = (lt, k = 0) => 0.004 * Math.sin(lt * 1.3 + k);
  window.SILK = K;
})();
// a trail scene: the course's poster printed on one side (layers pulled every 3/4 beat from 1/4 beat), the course
// number, name, numbers and a line about it on the other
(() => {
  const K = SILK;
  K.trail = (ctx, env, key, side, num, name, stats, line) => {
    const lt = env.lt, B = env.beatSec, n = K.POSTERS[key].length, times = Array.from({ length: n }, (_, k) => (0.25 + 0.75 * k) * B);
    K.wall(ctx);
    const px = side === 'left' ? 200 : W - 200 - K.PW, tx = side === 'left' ? 930 : 160;
    ctx.save(); ctx.translate(px + K.PW / 2, 120); ctx.rotate(K.sway(lt, num)); ctx.translate(-(px + K.PW / 2), -120);
    K.poster(ctx, key, px, 120, 1, lt, times, { d: 0.34 }); ctx.restore();
    K.text(ctx, num, tx, 380, 230, (lt - 0.2) / 0.35, { color: K.INK.yellow });
    K.text(ctx, name, tx, 540, 120, (lt - 0.5) / 0.35);
    K.text(ctx, stats, tx + 4, 640, 52, (lt - 0.8) / 0.35, { fam: 'sans', w: 800 });
    K.text(ctx, line, tx + 4, 720, 40, (lt - 1.1) / 0.35, { fam: 'sans', w: 500, color: 'rgba(243,234,215,0.8)' });
  };
})();

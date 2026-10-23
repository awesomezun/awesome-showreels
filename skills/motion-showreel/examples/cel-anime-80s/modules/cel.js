// cel: the 한강 시티 라이트 1988 reel's 1980s cel-anime kit (a project module). Flat two-tone cel paint with dark ink
// lines, airbrushed skies and glows, characters animated on twos (12 drawings a second: C.q(t)) while the camera moves
// smoothly, a night skyline cached once and mirrored into the river, and a VHS pass over the finished frame (a shifted
// red channel, scanlines, a tracking band, specks). Black Han Sans for the logo, Nanum Myeongjo for the lines.
(() => {
  const C = {}, TAU = Math.PI * 2;
  C.COL = { ink: '#1A0F2A', night: '#140A33', dusk: '#3A1E6B', rose: '#E8566C', glow: '#FFB07A', bldg: '#1B1442', win: '#FFD27A', cyan: '#7FE8FF',
    pink: '#FF4F9A', skin: '#F6CDB5', skinS: '#D9958A', hair: '#3B1F4A', hairS: '#24112E', hairH: '#8A4E9C', blouse: '#F4F0FF', blouseS: '#AFA6E0', car: '#E8364F', carS: '#A3203A' };
  C.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  C.q = (t) => Math.floor(t * 12) / 12;                 // on twos
  const lerpP = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1])); ctx.closePath(); };
  const ink = (ctx, w = 4) => { ctx.strokeStyle = C.COL.ink; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };

  // ---- sky, stars, moon -----------------------------------------------------------------------------------------
  C.sky = (ctx, hy = 640, o = {}) => { const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, o.top || C.COL.night); g.addColorStop(0.45, C.COL.dusk); g.addColorStop(0.82, C.COL.rose); g.addColorStop(1, C.COL.glow);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 2); const h = ctx.createRadialGradient(W * 0.5, hy, 10, W * 0.5, hy, 900); h.addColorStop(0, 'rgba(255,200,140,0.45)'); h.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = h; ctx.fillRect(0, 0, W, hy); };
  C.stars = (ctx, t, n = 70, maxY = 360) => { for (let i = 0; i < n; i++) { const x = hash(i * 3.3) * W, y = hash(i * 7.1) * maxY, tw = 0.5 + 0.5 * Math.sin(t * (2 + hash(i) * 3) + i), s = 1.5 + hash(i * 2) * 2.5;
    ctx.fillStyle = `rgba(255,245,230,${0.35 + 0.6 * tw})`; ctx.fillRect(x - s / 2, y - s / 2, s, s); if (hash(i * 9) > 0.9) { ctx.fillRect(x - s * 2.5, y - 0.5, s * 5, 1); ctx.fillRect(x - 0.5, y - s * 2.5, 1, s * 5); } } };
  C.moon = (ctx, x, y, r) => { const g = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3); g.addColorStop(0, 'rgba(255,240,220,0.35)'); g.addColorStop(1, 'rgba(255,240,220,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#FFF4E0'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#F2DCC0'; ctx.beginPath(); ctx.arc(x + r * 0.3, y + r * 0.1, r * 0.82, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF4E0'; ctx.beginPath(); ctx.arc(x + r * 0.05, y - r * 0.05, r * 0.8, 0, TAU); ctx.fill(); };

  // ---- the skyline: buildings with lit windows, cached once (2400 × 520, base at the bottom) ---------------------------
  let sky = null;
  const BL = (() => { const out = []; let x = 0, i = 0; while (x < 2400) { const tall = hash(i * 1.7) > 0.86, w = tall ? 70 + hash(i) * 40 : 60 + hash(i * 3) * 90, h = tall ? 330 + hash(i * 5) * 170 : 90 + hash(i * 7) * 220; out.push([x, w, h, i]); x += w + 4 + hash(i * 11) * 14; i++; } return out; })();
  const skyline = () => { if (sky) return sky; const b = makeBuf(2400, 520), g = b.g;
    g.fillStyle = '#241752'; g.beginPath(); g.moveTo(0, 520); for (let x = 0; x <= 2400; x += 40) g.lineTo(x, 400 - 60 * Math.sin(x / 380) - 30 * Math.sin(x / 130)); g.lineTo(2400, 520); g.fill();
    for (const [x, w, h, i] of BL) { g.fillStyle = mix(C.COL.bldg, '#2C2266', hash(i * 13) * 0.6); g.fillRect(x, 520 - h, w, h); g.fillStyle = 'rgba(120,90,200,0.25)'; g.fillRect(x, 520 - h, 6, h);
      if (h > 300) { g.fillStyle = C.COL.bldg; g.fillRect(x + w / 2 - 3, 520 - h - 40, 6, 40); }
      for (let wy = 520 - h + 14; wy < 512; wy += 16) for (let wx = x + 8; wx < x + w - 8; wx += 12) { const hv = hash(wx * 0.37 + wy * 1.13); if (hv < 0.52) continue; g.fillStyle = hv > 0.93 ? C.COL.cyan : hv > 0.86 ? '#FFFFFF' : C.COL.win; g.globalAlpha = 0.55 + 0.45 * hash(wx + wy); g.fillRect(wx, wy, 6, 8); }
      g.globalAlpha = 1; }
    sky = b.c; return sky; };
  // the skyline drawn with its base at y, scrolled by off px, and its red aircraft lights blinking
  C.skyline = (ctx, y, off, t, s = 1) => { const c = skyline(), ox = ((off % 2400) + 2400) % 2400; ctx.save(); ctx.translate(0, y); ctx.scale(s, s);
    ctx.drawImage(c, -ox, -520); ctx.drawImage(c, 2400 - ox, -520); const on = Math.floor(t * 1.2) % 2 === 0;
    for (const [x, w, h, i] of BL) if (h > 300) for (const k of [0, 1]) { const xx = x + w / 2 - ox + k * 2400; if (xx < -20 || xx > W / s + 20) continue; ctx.fillStyle = on ? '#FF3B3B' : 'rgba(255,59,59,0.3)'; ctx.beginPath(); ctx.arc(xx, -h - 42, 5, 0, TAU); ctx.fill();
      if (on) { const g = ctx.createRadialGradient(xx, -h - 42, 0, xx, -h - 42, 26); g.addColorStop(0, 'rgba(255,60,60,0.6)'); g.addColorStop(1, 'rgba(255,60,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(xx, -h - 42, 26, 0, TAU); ctx.fill(); } }
    ctx.restore(); };
  // the river below y: dark water, the skyline mirrored in rippling strips, glints
  C.river = (ctx, y, off, t, s = 1) => { const g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, '#2A1650'); g.addColorStop(1, '#0C0620'); ctx.fillStyle = g; ctx.fillRect(0, y, W, H - y);
    const c = skyline(), ox = ((off % 2400) + 2400) % 2400; ctx.save(); ctx.globalAlpha = 0.45;
    for (let sy = 0; sy < Math.min(H - y, 520 * s * 0.8); sy += 6) { const src = 520 - sy / (s * 0.8), dx = Math.sin(t * 3 + sy * 0.09) * (3 + sy * 0.03); if (src < 0) break;
      for (const k of [0, 1]) ctx.drawImage(c, 0, src, 2400, 6 / (s * 0.8), (k * 2400 - ox) * s + dx, y + sy, 2400 * s, 6); }
    ctx.restore(); ctx.strokeStyle = 'rgba(255,210,170,0.25)'; ctx.lineWidth = 2; for (let i = 0; i < 26; i++) { const yy = y + 10 + hash(i * 3) * (H - y - 20), x = ((hash(i * 7) * W - t * 30 * (1 + hash(i))) % W + W) % W, l = 40 + hash(i * 5) * 120; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + l, yy); ctx.stroke(); } };
  // a long bridge across the frame at deck height y: piers, lamps and car lights
  C.bridge = (ctx, y, t) => { ctx.fillStyle = '#120A2A'; ctx.fillRect(0, y, W, 22); for (let x = 60; x < W; x += 240) { ctx.fillRect(x, y, 26, 120); ctx.beginPath(); ctx.moveTo(x + 26, y + 22); ctx.quadraticCurveTo(x + 133, y + 80, x + 240, y + 22); ctx.lineTo(x + 240, y + 22); ctx.strokeStyle = '#120A2A'; ctx.lineWidth = 8; ctx.stroke(); }
    for (let x = 20; x < W; x += 80) { ctx.fillStyle = '#FFE3A0'; ctx.beginPath(); ctx.arc(x, y - 6, 4, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 18; i++) { const dir = i % 2 ? -1 : 1, x = ((hash(i) * W + dir * t * (180 + 60 * hash(i * 3))) % W + W) % W; ctx.fillStyle = dir > 0 ? '#FF4A5A' : '#FFF6D8'; ctx.fillRect(x, y + 6 + (dir > 0 ? 0 : 7), 10, 3); } };
  // big soft city lights out of focus
  C.bokeh = (ctx, t, n = 26) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = hash(i * 3.7) * W + Math.sin(t * 0.3 + i) * 20, y = 120 + hash(i * 5.3) * 700, r = 40 + hash(i * 2.1) * 90, c = [C.COL.pink, C.COL.cyan, C.COL.win, '#B98CFF'][i % 4];
    const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r); g.addColorStop(0, rgba(c, 0.22)); g.addColorStop(0.92, rgba(c, 0.28)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore(); };

  // ---- the heroine from behind, three-quarter, looking left at the city; her hair streams in the wind ------------------
  const strand = (ctx, x0, y0, L, w0, ph, tq, wind, col) => { const n = 14, left = [], right = [];
    for (let k = 0; k <= n; k++) { const u = k / n, wav = Math.sin(u * Math.PI * 2.2 + ph - tq * 7) * 26 * u, x = x0 - L * u * 0.62 * wind + wav * 0.3, y = y0 + L * u * 0.78 - wav * 0.5 * wind, w = w0 * Math.pow(1 - u, 0.8) + 2;
      const ang = Math.atan2(L * 0.78, -L * 0.62 * wind) + Math.PI / 2; left.push([x + Math.cos(ang) * w, y + Math.sin(ang) * w]); right.push([x - Math.cos(ang) * w, y - Math.sin(ang) * w]); }
    poly(ctx, left.concat(right.reverse())); ctx.fillStyle = col; ctx.fill(); ink(ctx, 3); };
  C.girl = (ctx, x, y, s, t, o = {}) => { const tq = C.q(t), wind = o.wind ?? 1, wv = (k, amp) => Math.sin(tq * 7 + k * 0.9) * amp; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    // loose strands flying behind, then the blouse with its sailor collar, the neck and the sliver of face
    for (let i = 0; i < 6; i++) strand(ctx, -120 + i * 40, 230 + i * 18, 300 + 50 * hash(i), 16, i * 1.1, tq, wind * 1.4, i % 2 ? C.COL.hair : C.COL.hairS);
    const blouse = () => { ctx.beginPath(); ctx.moveTo(-50, 160); ctx.quadraticCurveTo(-190, 175, -250, 260); ctx.quadraticCurveTo(-300, 330, -300, 720); ctx.lineTo(320, 720); ctx.quadraticCurveTo(320, 330, 270, 260); ctx.quadraticCurveTo(210, 175, 55, 160); ctx.closePath(); };
    blouse(); ctx.fillStyle = C.COL.blouse; ctx.fill(); ctx.save(); blouse(); ctx.clip(); ctx.fillStyle = C.COL.blouseS; ctx.beginPath(); ctx.moveTo(140, 160); ctx.quadraticCurveTo(200, 400, 120, 720); ctx.lineTo(400, 720); ctx.lineTo(400, 160); ctx.fill();
    ctx.fillStyle = '#2B2F7A'; ctx.beginPath(); ctx.moveTo(-60, 165); ctx.quadraticCurveTo(-200, 190, -250, 270); ctx.lineTo(-230, 430); ctx.lineTo(250, 430); ctx.lineTo(270, 270); ctx.quadraticCurveTo(210, 190, 65, 165); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#F4F0FF'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-222, 300); ctx.lineTo(-208, 400); ctx.lineTo(228, 400); ctx.lineTo(240, 300); ctx.stroke(); ctx.restore(); blouse(); ink(ctx, 5);
    poly(ctx, [[-50, 90], [-48, 175], [30, 185], [40, 100]]); ctx.fillStyle = C.COL.skin; ctx.fill(); ink(ctx, 4); poly(ctx, [[-10, 100], [-8, 180], [30, 185], [40, 100]]); ctx.fillStyle = C.COL.skinS; ctx.fill();
    poly(ctx, [[-100, -70], [-128, -20], [-134, 22], [-150, 44], [-130, 54], [-122, 70], [-108, 104], [-82, 136], [-52, 128], [-70, 60], [-80, 0], [-76, -60]]); ctx.fillStyle = C.COL.skin; ctx.fill(); ink(ctx, 4);
    ctx.fillStyle = 'rgba(255,120,140,0.35)'; ctx.beginPath(); ctx.ellipse(-104, 78, 16, 10, -0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.COL.ink; ctx.lineWidth = 4; for (const [a, b] of [[[-126, -14], [-150, -26]], [[-128, -6], [-154, -10]], [[-126, 2], [-148, 6]]]) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    // the hair: one mass over the back of the head, falling down her back and streaming left below the jaw
    const tail = [[110, 400], [10, 380 + wv(1, 10)], [-110, 340 + wv(2, 16)], [-240, 290 + wv(3, 22)], [-380 - wv(4, 20), 210 + wv(4, 26)], [-300, 200 + wv(5, 18)], [-180, 205 + wv(6, 10)], [-60, 170]];
    const hair = () => { ctx.beginPath(); ctx.moveTo(-84, -150); ctx.bezierCurveTo(10, -205, 150, -150, 160, -30); ctx.bezierCurveTo(175, 60, 165, 200, 140, 300); ctx.quadraticCurveTo(130, 360, 110, 400);
      for (let k = 1; k < tail.length; k++) { const p0 = tail[k - 1], p1 = tail[k]; ctx.quadraticCurveTo(p0[0] + (p1[0] - p0[0]) * 0.5 + wv(k + 9, 10), p0[1] + (p1[1] - p0[1]) * 0.5 + 18, p1[0], p1[1]); }
      ctx.quadraticCurveTo(-30, 140, -38, 60); ctx.quadraticCurveTo(-50, -40, -72, -70); ctx.quadraticCurveTo(-110, -120, -84, -150); ctx.closePath(); };
    hair(); ctx.fillStyle = C.COL.hair; ctx.fill(); ctx.save(); hair(); ctx.clip();
    ctx.fillStyle = C.COL.hairS; ctx.beginPath(); ctx.moveTo(60, 60); ctx.quadraticCurveTo(140, 200, 120, 420); ctx.lineTo(300, 420); ctx.lineTo(300, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-400, 300); ctx.quadraticCurveTo(-150, 330, 60, 420); ctx.lineTo(-400, 420); ctx.fill();
    poly(ctx, [[-60, -126], [-10, -158], [70, -146], [126, -100], [96, -92], [70, -112], [44, -86], [14, -108], [-14, -84], [-34, -104]]); ctx.fillStyle = C.COL.hairH; ctx.fill();
    ctx.strokeStyle = 'rgba(138,78,156,0.8)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(60 + i * 14, -60 + i * 6); ctx.quadraticCurveTo(80 + i * 6, 150, -40 - i * 50 + wv(i, 12), 260 + i * 12); ctx.stroke(); }
    ctx.restore(); hair(); ink(ctx, 5);
    for (let i = 0; i < 5; i++) strand(ctx, -200 - i * 30, 230 + i * 10 + wv(i + 3, 8), 160 + 40 * hash(i + 4), 12, i * 1.3 + 2, tq, wind * 1.6, i % 2 ? C.COL.hairS : C.COL.hair);
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(127,232,255,0.8)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-84, -148); ctx.quadraticCurveTo(-110, -120, -72, -70); ctx.quadraticCurveTo(-50, -40, -38, 60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-60, 172); for (let k = tail.length - 1; k >= 3; k--) ctx.lineTo(tail[k][0], tail[k][1] - 4); ctx.stroke(); ctx.strokeStyle = 'rgba(127,232,255,0.6)'; ctx.beginPath(); ctx.moveTo(-250, 262); ctx.lineTo(-300, 330); ctx.lineTo(-300, 700); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,79,154,0.65)'; ctx.beginPath(); ctx.moveTo(150, -40); ctx.bezierCurveTo(140, -150, 10, -200, -84, -152); ctx.stroke(); ctx.restore(); };
  // ---- the red convertible, side view facing right, wheels turning with the distance covered -----------------------------
  C.car = (ctx, x, y, s, t, dist) => { const tq = C.q(t), bob = Math.sin(tq * 23) * 3; ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const beam = ctx.createLinearGradient(430, -110, 1100, -60); beam.addColorStop(0, 'rgba(255,240,180,0.55)'); beam.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = beam; poly(ctx, [[430, -120], [1200, -230], [1200, 40], [430, -90]]); ctx.fill();
    const tail = ctx.createLinearGradient(-460, 0, -900, 0); tail.addColorStop(0, 'rgba(255,40,60,0.7)'); tail.addColorStop(1, 'rgba(255,40,60,0)'); ctx.fillStyle = tail; ctx.fillRect(-900, -128, 450, 18); ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 6, 480, 22, 0, 0, TAU); ctx.fill();
    // the driver: the heroine in profile, hair streaming back
    for (let i = 0; i < 5; i++) strand(ctx, -60, -250 + i * 8, 220 + 30 * i, 14, i * 1.4, tq, 2.2, i % 2 ? C.COL.hairS : C.COL.hair);
    ctx.fillStyle = C.COL.skin; ctx.beginPath(); ctx.ellipse(-20, -250, 44, 52, 0, 0, TAU); ctx.fill(); ink(ctx, 4); ctx.fillStyle = C.COL.hair; ctx.beginPath(); ctx.ellipse(-36, -268, 46, 44, -0.4, Math.PI * 0.75, Math.PI * 2.1); ctx.fill(); ink(ctx, 4);
    ctx.fillStyle = '#FF2E88'; ctx.fillRect(10, -262, 30, 10); ctx.strokeStyle = C.COL.ink; ctx.lineWidth = 3; ctx.strokeRect(10, -262, 30, 10);
    ctx.strokeStyle = C.COL.skin; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-30, -190); ctx.lineTo(60, -180); ctx.stroke();
    const body = [[-450, -40], [-445, -140], [-260, -160], [-120, -165], [40, -170], [300, -158], [452, -118], [455, -50], [440, -30]];
    poly(ctx, body); ctx.fillStyle = C.COL.car; ctx.fill(); ink(ctx, 5); poly(ctx, [[-450, -40], [-448, -95], [452, -80], [440, -30]]); ctx.fillStyle = C.COL.carS; ctx.fill();
    ctx.strokeStyle = '#FF9AAE'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-430, -136); ctx.lineTo(-120, -158); ctx.lineTo(300, -150); ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-440, -104, 880, 8); ctx.strokeStyle = '#C9D3E8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(40, -170); ctx.lineTo(-30, -300); ctx.stroke(); ctx.strokeStyle = 'rgba(160,220,255,0.5)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(30, -175); ctx.lineTo(-24, -285); ctx.stroke();
    ctx.fillStyle = '#FFF6C8'; ctx.fillRect(420, -124, 30, 14); ctx.fillStyle = '#FF3050'; ctx.fillRect(-452, -132, 16, 22);
    for (const wx of [-270, 290]) { ctx.fillStyle = C.COL.ink; ctx.beginPath(); ctx.arc(wx, -40, 98, Math.PI, TAU); ctx.fill(); ctx.fillStyle = '#18141F'; ctx.beginPath(); ctx.arc(wx, -40, 84, 0, TAU); ctx.fill();
      ctx.fillStyle = '#B9C2D6'; ctx.beginPath(); ctx.arc(wx, -40, 50, 0, TAU); ctx.fill(); ctx.strokeStyle = '#6A7390'; ctx.lineWidth = 7; const a0 = dist / 84; for (let k = 0; k < 5; k++) { const a = a0 + k * TAU / 5; ctx.beginPath(); ctx.moveTo(wx, -40); ctx.lineTo(wx + Math.cos(a) * 46, -40 + Math.sin(a) * 46); ctx.stroke(); }
      ctx.strokeStyle = C.COL.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(wx, -40, 84, 0, TAU); ctx.stroke(); }
    ctx.restore(); };
  // ---- one big eye, front on: lids, an iris with the city in it, highlights; blink 0..1 closes the upper lid -------------
  C.eye = (ctx, cx, cy, s, t, blink = 0, o = {}) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const b = clamp(blink);
    const up = (u) => { const p = [[-450, 20], [-150, -210], [200, -220], [450, -40]], q = [[-450, 20], [-200, 175], [250, 170], [450, -40]]; return [lerpP(p[1], q[1], u * 0.98), lerpP(p[2], q[2], u * 0.98)]; };
    const [c1, c2] = up(b);
    ctx.beginPath(); ctx.moveTo(-450, 20); ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], 450, -40); ctx.bezierCurveTo(250, 170, -200, 175, -450, 20); ctx.closePath(); ctx.save(); ctx.clip();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-460, -260, 920, 460);
    const ig = ctx.createLinearGradient(0, -240, 0, 260); ig.addColorStop(0, '#1E1048'); ig.addColorStop(0.45, '#5B4FD8'); ig.addColorStop(1, '#A8E2FF'); ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(0, 10, 215, 255, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(30,16,72,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 95, 10 + Math.sin(a) * 120); ctx.lineTo(Math.cos(a) * 200, 10 + Math.sin(a) * 238); ctx.stroke(); }
    ctx.fillStyle = '#100828'; ctx.beginPath(); ctx.ellipse(0, 10, 82, 112, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#140A33'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(0, 10, 215, 255, 0, 0, TAU); ctx.stroke();
    for (let i = 0; i < 11; i++) { const a = Math.PI * (0.18 + 0.64 * i / 10), r = 168 + 10 * Math.sin(i * 2), x = Math.cos(a) * r * 0.9, y = 10 + Math.sin(a) * r, c = [C.COL.pink, C.COL.win, C.COL.cyan][i % 3], tw = 0.6 + 0.4 * Math.sin(t * 5 + i);
      ctx.fillStyle = rgba(c, 0.8 * tw); ctx.fillRect(x - 5, y - 5, 10, 10); }
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.ellipse(-80, -95, 62, 46, -0.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(92, 100, 26, 20, 0, 0, TAU); ctx.fill();
    const sp = o.star || 0; if (sp > 0) { ctx.save(); ctx.translate(-80, -95); ctx.globalAlpha = sp; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, r = k % 2 ? 26 : 150 * sp; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = 'rgba(120,100,200,0.28)'; ctx.beginPath(); ctx.moveTo(-450, 20); ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], 450, -40); ctx.lineTo(450, 60); ctx.bezierCurveTo(c2[0], c2[1] + 90, c1[0], c1[1] + 90, -450, 80); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = C.COL.ink; ctx.lineCap = 'round'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(-450, 20); ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], 450, -40); ctx.stroke();
    const tip = [450, -40]; ctx.lineWidth = 14; for (const [dx, dy] of [[60, -50], [70, -10], [50, 26]]) { ctx.beginPath(); ctx.moveTo(tip[0] - 30, tip[1] + dy * 0.2); ctx.quadraticCurveTo(tip[0] + dx * 0.5, tip[1] + dy * 0.6, tip[0] + dx, tip[1] + dy); ctx.stroke(); }
    ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-300, 120); ctx.bezierCurveTo(-180, 175, 150, 175, 330, 110); ctx.stroke();
    ctx.strokeStyle = C.COL.hair; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(-420, -330); ctx.quadraticCurveTo(0, -440, 400, -360); ctx.stroke(); ctx.restore(); };

  // ---- fireworks: a rocket climbs, then a ring of streaks opens and falls; flash and glow ------------------------------
  C.firework = (ctx, x, y, u, col, n = 40, R = 300) => { if (u < -0.45 || u > 2.2) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (u < 0) { const k = 1 + u / 0.45, yy = lerp(H, y, k); ctx.strokeStyle = 'rgba(255,230,200,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 60); ctx.stroke(); ctx.restore(); return; }
    if (u < 0.5) { const g = ctx.createRadialGradient(x, y, 0, x, y, R * 1.6); g.addColorStop(0, rgba(col, 0.6 * (1 - u / 0.5))); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - R * 1.6, y - R * 1.6, R * 3.2, R * 3.2); }
    const a = Math.max(0, 1 - u / 2.2); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) { const ang = i / n * TAU + hash(i + x) * 0.1, r1 = R * (1 - Math.exp(-u * 4)), r0 = R * (1 - Math.exp(-Math.max(0, u - 0.12) * 4)), dy = 70 * u * u;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0 + dy * 0.8); ctx.lineTo(x + Math.cos(ang) * r1, y + Math.sin(ang) * r1 + dy); ctx.stroke(); if (i % 2) { const r2 = r1 * 0.62; ctx.beginPath(); ctx.moveTo(x + Math.cos(ang + 0.07) * r2 * 0.8, y + Math.sin(ang + 0.07) * r2 * 0.8 + dy * 0.7); ctx.lineTo(x + Math.cos(ang + 0.07) * r2, y + Math.sin(ang + 0.07) * r2 + dy * 0.85); ctx.stroke(); }
      if (u > 0.6 && (i + Math.floor(u * 12)) % 3 === 0) { ctx.fillStyle = rgba('#FFFFFF', a); ctx.fillRect(x + Math.cos(ang) * r1 - 2, y + Math.sin(ang) * r1 + dy - 2, 4, 4); } }
    ctx.restore(); };

  // ---- the logo: chrome type with a dark outline and a pink drop, 1988 in italic neon; a flare sweeps across --------------
  C.logo = (ctx, cx, cy, a, sweep, t) => { if (a <= 0) return; ctx.save(); const e = Ease.outQ ? Ease.outQ(clamp(a)) : clamp(a), sc = lerp(1.35, 1, e); ctx.globalAlpha = clamp(a * 2); ctx.translate(cx, cy); ctx.scale(sc, sc);
    ctx.font = C.F(176); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; const s = '한강 시티 라이트';
    ctx.fillStyle = '#FF2E88'; ctx.fillText(s, 12, 12); ctx.strokeStyle = '#120A2A'; ctx.lineWidth = 22; ctx.strokeText(s, 0, 0);
    const g = ctx.createLinearGradient(0, -150, 0, 20); g.addColorStop(0, '#F2FBFF'); g.addColorStop(0.45, '#7FD0FF'); g.addColorStop(0.5, '#FFFFFF'); g.addColorStop(0.56, '#FF8AC0'); g.addColorStop(1, '#5B2A8A'); ctx.fillStyle = g; ctx.fillText(s, 0, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2.5; ctx.strokeText(s, 0, 0);
    ctx.save(); ctx.translate(250, 150); ctx.transform(1, 0, -0.28, 1, 0, 0); ctx.font = C.F(150); ctx.shadowColor = '#FF2E88'; ctx.shadowBlur = 30; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.strokeText('1988', 0, 0); ctx.shadowBlur = 0;
    const g2 = ctx.createLinearGradient(0, -110, 0, 0); g2.addColorStop(0, '#FFE0F0'); g2.addColorStop(1, '#FF2E88'); ctx.fillStyle = g2; ctx.fillText('1988', 0, 0); ctx.restore();
    if (sweep > 0 && sweep < 1) { const fx = lerp(-640, 640, sweep), fy = -150 + 40 * Math.sin(sweep * Math.PI); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.sin(sweep * Math.PI);
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 120); fg.addColorStop(0, 'rgba(255,255,255,1)'); fg.addColorStop(0.2, 'rgba(160,230,255,0.6)'); fg.addColorStop(1, 'rgba(160,230,255,0)'); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, fy, 120, 0, TAU); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(fx - 420, fy - 2, 840, 4); ctx.fillRect(fx - 2, fy - 160, 4, 320); ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.PI / 4); ctx.fillRect(-90, -1.5, 180, 3); ctx.fillRect(-1.5, -90, 3, 180); ctx.restore(); }
    ctx.restore(); };
  // a line in the serif with a dark outline, centred or left
  C.line = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = C.F(size, o.fam || 'serif'); ctx.textAlign = o.align || 'center'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(18,10,42,0.9)'; ctx.lineWidth = size * 0.16; ctx.strokeText(s, x, y); ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, x, y); ctx.restore(); };

  // ---- VHS: run last, over the finished frame ----------------------------------------------------------------------
  let A = null, R = null;
  C.vhs = (ctx, t, o = {}) => { const cv = ctx.canvas; if (!A) { A = makeBuf(W, H); R = makeBuf(W, H); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const sx = cv.width / W;
    A.g.setTransform(1, 0, 0, 1, 0, 0); A.g.clearRect(0, 0, W, H); A.g.drawImage(cv, 0, 0, W, H);
    R.g.globalCompositeOperation = 'copy'; R.g.drawImage(A.c, 0, 0); R.g.globalCompositeOperation = 'multiply'; R.g.fillStyle = '#FF0000'; R.g.fillRect(0, 0, W, H); R.g.globalCompositeOperation = 'destination-in'; R.g.drawImage(A.c, 0, 0); R.g.globalCompositeOperation = 'source-over';
    ctx.scale(sx, sx); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#00FFFF'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(R.c, 4, 0); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.13)'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.5);
    const fr = Math.floor(t * 30), by = H - 70 + Math.sin(t * 1.3) * 12, bh = 22 + 10 * hash(fr); ctx.drawImage(A.c, 0, by, W, bh, 14 + 18 * hash(fr * 3), by, W, bh); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, by, W, bh);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 70; i++) { const x = hash(fr * 13 + i) * W, y = hash(fr * 7 + i * 3) * H; ctx.fillRect(x, y, 2 + 10 * hash(i + fr), 1.5); }
    if (o.osd) { ctx.globalAlpha = clamp(o.osd); ctx.font = C.F(46, 'display'); ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 3; ctx.beginPath(); ctx.moveTo(90, 72); ctx.lineTo(126, 92); ctx.lineTo(90, 112); ctx.closePath(); ctx.fill(); ctx.fillText('PLAY', 146, 110); ctx.font = C.F(38, 'display'); ctx.fillText('JUL. 23 1988', 90, H - 110); }
    ctx.restore(); };
  window.CEL = C;
})();

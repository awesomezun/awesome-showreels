// era: the 소리상회 100년 reel's kit (a project module). One shopfront drawn five times, once per era, with that era's
// sign type, colours, window display and picture surface: 1925 sepia film (grain, scratches, flicker, an iris),
// 1955 a hand-tinted print (colour fills slipping off their lines, halftone), 1975 warm colour with marquee bulbs and a
// light leak, 1995 a neon sign at night, 2025 clean daylight. A tree beside the shop grows from era to era, and the
// year rolls like an odometer when an era begins. Five faces, one per era, through the five font roles:
// serif = Song Myung (1925), cjk = Yeon Sung (1955), mono = Do Hyeon (1975), display = Black Han Sans (1995),
// sans = Pretendard (2025 and the small print).
(() => {
  const E = {}, TAU = Math.PI * 2;
  E.F = (size, fam = 'sans', w = '') => `${w ? w + ' ' : ''}${size}px ${FAM[fam]}`;
  const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const circ = (ctx, x, y, r, c) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c; ctx.fill(); };
  E.ERAS = {
    1925: { fam: 'serif', name: '축음기와 첫 음반', sky: '#D9C9A3', wall: '#B89A6E', trim: '#5A4630', sign: '#3E2E1E', signInk: '#E8D9B5', awn: ['#8A6E4A', '#C9B48A'], ink: '#3E2E1E', ground: '#A08A66', tree: 0.32 },
    1955: { fam: 'cjk', name: '라디오와 트럼펫', sky: '#BFE0E8', wall: '#F2D9B8', trim: '#3A6E8A', sign: '#E8574C', signInk: '#FFF6E0', awn: ['#3A8A9A', '#FFF6E0'], ink: '#2A3E4A', ground: '#C9C2B0', tree: 0.5 },
    1975: { fam: 'mono', name: '통기타와 LP', sky: '#F2C48A', wall: '#C9763A', trim: '#5A3A1E', sign: '#3E2A16', signInk: '#FFC94D', awn: ['#E8A23A', '#8A4A1E'], ink: '#3E2A16', ground: '#9A8066', tree: 0.68 },
    1995: { fam: 'display', name: '신시사이저와 CD', sky: '#14122E', wall: '#2A2850', trim: '#5A56A0', sign: '#0E0C22', signInk: '#FF4FC3', awn: ['#3A2E8A', '#1E1A4A'], ink: '#F0E8FF', ground: '#1A1830', tree: 0.85 },
    2025: { fam: 'sans', name: '헤드폰과 앱, 그리고 여전히 기타', sky: '#E6F1F8', wall: '#F7F7F5', trim: '#1E2A36', sign: '#1E2A36', signInk: '#FFFFFF', awn: ['#2E7D6A', '#F7F7F5'], ink: '#1E2A36', ground: '#D8D8D2', tree: 1.0 },
  };
  // ---- the street and the shop ---------------------------------------------------------------------------------------
  const tree = (ctx, x, y, s, col, leaf, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-14, -420); ctx.lineTo(14, -420); ctx.lineTo(22, 0); ctx.fill();
    for (const [dx, dy, r] of [[0, -560, 190], [-150, -470, 140], [150, -470, 150], [-80, -680, 130], [100, -660, 140]]) { circ(ctx, dx + Math.sin(t * 1.2 + dx) * 4, dy, r, leaf); } ctx.restore(); };
  E.street = (ctx, era, t) => { const e = E.ERAS[era]; ctx.fillStyle = e.sky; ctx.fillRect(0, 0, W, H); ctx.fillStyle = mix(e.wall, e.sky, 0.45); ctx.fillRect(0, 120, 380, 780); ctx.fillRect(1540, 160, 400, 740);
    ctx.fillStyle = e.ground; ctx.fillRect(0, 900, W, 180); ctx.fillStyle = mix(e.ground, '#000000', 0.15); for (let x = 0; x < W; x += 160) ctx.fillRect(x, 900, 4, 180); ctx.fillRect(0, 900, W, 6);
    tree(ctx, 1700, 905, e.tree, mix(e.trim, '#5A3A1E', 0.5), era === 1995 ? '#1E3A3A' : era === 1925 ? '#8A7A5A' : era === 1975 ? '#8A9A3A' : '#4E9A5A', t); };
  E.shop = (ctx, era, t, lt) => { const e = E.ERAS[era]; ctx.fillStyle = e.wall; ctx.fillRect(380, 140, 1160, 760); ctx.fillStyle = e.trim; ctx.fillRect(380, 140, 1160, 20); ctx.fillRect(380, 880, 1160, 20); ctx.fillRect(380, 140, 20, 760); ctx.fillRect(1520, 140, 20, 760);
    if (era === 1925 || era === 1975) { ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 3; for (let y = 180; y < 880; y += 36) { ctx.beginPath(); ctx.moveTo(400, y); ctx.lineTo(1520, y); ctx.stroke(); } }
    // the sign
    ctx.fillStyle = e.sign; rr(ctx, 520, 190, 880, 140, era === 2025 ? 6 : era === 1975 ? 40 : 14); ctx.fill(); ctx.strokeStyle = e.trim; ctx.lineWidth = 8; ctx.stroke();
    if (era === 1975) for (let k = 0; k < 26; k++) { const x = 540 + k * 33.6, on = (Math.floor(lt * 8) + k) % 3 === 0; for (const y of [204, 316]) circ(ctx, x, y, 8, on ? '#FFF3B0' : '#8A6A3A'); }
    ctx.save(); ctx.textAlign = 'center'; ctx.font = E.F(era === 2025 ? 92 : 104, e.fam, era === 2025 ? 700 : ''); ctx.fillStyle = e.signInk;
    if (era === 1995) { const fl = lt < 0.35 ? (Math.sin(lt * 90) > 0 ? 1 : 0.2) : 1; ctx.globalAlpha = fl; ctx.shadowColor = '#FF4FC3'; ctx.shadowBlur = 40; ctx.fillText('소리상회', 960, 296); ctx.shadowBlur = 14; ctx.fillStyle = '#FFE0F6'; ctx.fillText('소리상회', 960, 296); }
    else ctx.fillText(era === 2025 ? '소리상회' : '소리상회', 960, 296); ctx.restore();
    if (era === 2025) { ctx.fillStyle = '#9FB0BE'; ctx.font = E.F(30, 'sans', 500); ctx.textAlign = 'center'; ctx.fillText('SORI MUSIC · SINCE 1925', 960, 372); ctx.textAlign = 'left'; }
    // the awning
    if (era !== 2025) { const [a, b] = e.awn; for (let k = 0; k < 12; k++) { ctx.fillStyle = k % 2 ? b : a; ctx.beginPath(); ctx.moveTo(480 + k * 80, 360); ctx.lineTo(560 + k * 80, 360); ctx.lineTo(560 + k * 80, 420); ctx.quadraticCurveTo(520 + k * 80, 450, 480 + k * 80, 420); ctx.closePath(); ctx.fill(); } }
    // the window
    const g = ctx.createLinearGradient(0, 450, 0, 860); g.addColorStop(0, era === 1995 ? '#2A1E4A' : mix(e.sky, '#FFFFFF', 0.3)); g.addColorStop(1, era === 1995 ? '#3A2A6A' : mix(e.wall, '#FFFFFF', 0.55)); ctx.fillStyle = g; ctx.fillRect(500, 450, 920, 410);
    E.display(ctx, era, t, lt); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.moveTo(520, 450); ctx.lineTo(700, 450); ctx.lineTo(560, 860); ctx.lineTo(500, 860); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = e.trim; ctx.lineWidth = 16; ctx.strokeRect(500, 450, 920, 410); ctx.beginPath(); ctx.moveTo(960, 450); ctx.lineTo(960, 860); ctx.lineWidth = 10; ctx.stroke(); };
  // the window display per era
  E.display = (ctx, era, t, lt) => { const e = E.ERAS[era]; ctx.save(); ctx.beginPath(); ctx.rect(500, 450, 920, 410); ctx.clip(); ctx.fillStyle = mix(e.trim, e.wall, 0.4); ctx.fillRect(500, 800, 920, 60);
    if (era === 1925) { ctx.fillStyle = '#6A4A2A'; ctx.fillRect(600, 690, 280, 110); ctx.fillStyle = '#2A1E12'; ctx.beginPath(); ctx.ellipse(740, 690, 120, 26, 0, 0, TAU); ctx.fill(); ctx.save(); ctx.translate(740, 690); ctx.scale(1, 0.22); ctx.rotate(lt * 4); ctx.strokeStyle = '#8A6E4A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(100, 0); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = '#8A6E4A'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(840, 690); ctx.lineTo(880, 600); ctx.stroke(); ctx.fillStyle = '#C9A24A'; ctx.beginPath(); ctx.moveTo(870, 610); ctx.lineTo(1040, 470); ctx.lineTo(1120, 600); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.ellipse(1080, 535, 50, 90, -0.6, 0, TAU); ctx.fillStyle = '#E0C070'; ctx.fill();
      for (let k = 0; k < 3; k++) { circ(ctx, 1200 + k * 50, 740 - k * 10, 60, '#1E160E'); circ(ctx, 1200 + k * 50, 740 - k * 10, 18, '#C9A24A'); } }
    if (era === 1955) { ctx.fillStyle = '#8A5A3A'; rr(ctx, 560, 600, 340, 200, 40); ctx.fill(); ctx.fillStyle = '#F2D9B8'; rr(ctx, 590, 630, 170, 140, 20); ctx.fill(); ctx.strokeStyle = '#8A5A3A'; ctx.lineWidth = 4; for (let y = 645; y < 765; y += 14) { ctx.beginPath(); ctx.moveTo(600, y); ctx.lineTo(750, y); ctx.stroke(); }
      circ(ctx, 830, 660, 40, '#FFF6E0'); ctx.strokeStyle = '#E8574C'; ctx.lineWidth = 5; const a = -2.4 + Math.sin(lt * 2) * 1.2; ctx.beginPath(); ctx.moveTo(830, 660); ctx.lineTo(830 + Math.cos(a) * 34, 660 + Math.sin(a) * 34); ctx.stroke();
      ctx.strokeStyle = 'rgba(232,87,76,0.6)'; ctx.lineWidth = 6; for (let k = 0; k < 3; k++) { const r = 40 + ((lt * 60 + k * 40) % 120); ctx.globalAlpha = 1 - r / 160; ctx.beginPath(); ctx.arc(730, 600, r, -2.4, -0.8); ctx.stroke(); } ctx.globalAlpha = 1;
      ctx.save(); ctx.translate(1180, 680); ctx.rotate(-0.25); ctx.fillStyle = '#E8B84A'; ctx.fillRect(-160, -14, 260, 28); ctx.beginPath(); ctx.moveTo(100, -14); ctx.lineTo(200, -70); ctx.lineTo(200, 70); ctx.lineTo(100, 14); ctx.closePath(); ctx.fill();
      for (let k = 0; k < 3; k++) { ctx.fillStyle = '#C9962A'; ctx.fillRect(-60 + k * 34, -46, 14, 34); } ctx.restore(); }
    if (era === 1975) { const guitar = (x, y, s, col) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#5A3A1E'; ctx.fillRect(-14, -330, 28, 260); ctx.fillStyle = col; circ(ctx, 0, -40, 90, col); circ(ctx, 0, -130, 70, col); circ(ctx, 0, -70, 26, '#2A1A0E'); ctx.restore(); };
      guitar(640, 820, 1.1, '#D99A4A'); guitar(820, 820, 1.0, '#B0502A');
      for (let k = 0; k < 3; k++) { const x = 1090 + k * 110, y = 700; ctx.save(); ctx.translate(x, y); ctx.rotate(lt * 2 + k); circ(ctx, 0, 0, 100, '#1A1410'); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; for (let r = 40; r < 96; r += 10) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); }
        circ(ctx, 0, 0, 32, ['#FFC94D', '#E8574C', '#7AB04A'][k]); circ(ctx, 0, 0, 5, '#1A1410'); ctx.restore(); } }
    if (era === 1995) { ctx.fillStyle = '#1A1830'; rr(ctx, 560, 640, 520, 110, 12); ctx.fill(); for (let k = 0; k < 24; k++) { ctx.fillStyle = '#F0F0FF'; ctx.fillRect(578 + k * 20.5, 690, 18, 52); } for (let k = 0; k < 24; k++) if ([1, 2, 4, 5, 6].includes(k % 7)) { ctx.fillStyle = '#1A1830'; ctx.fillRect(590 + k * 20.5, 690, 10, 32); }
      for (let k = 0; k < 6; k++) { circ(ctx, 600 + k * 40, 665, 7, ['#FF4FC3', '#4FE3FF', '#FFE14D'][k % 3]); }
      ctx.save(); ctx.translate(1240, 640); const cg = ctx.createConicGradient ? ctx.createConicGradient(lt * 3, 0, 0) : null; if (cg) { ['#FF4FC3', '#FFE14D', '#4FE3FF', '#B98CFF', '#FF4FC3'].forEach((c, i) => cg.addColorStop(i / 4, c)); ctx.fillStyle = cg; } else ctx.fillStyle = '#C9C9E8';
      ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fill(); circ(ctx, 0, 0, 22, '#2A2850'); ctx.restore();
      for (let k = 0; k < 2; k++) { ctx.fillStyle = '#2E2E3A'; rr(ctx, 1130 + k * 130, 760, 120, 76, 8); ctx.fill(); ctx.fillStyle = '#E8E0FF'; ctx.fillRect(1145 + k * 130, 772, 90, 26); circ(ctx, 1165 + k * 130, 815, 11, '#E8E0FF'); circ(ctx, 1215 + k * 130, 815, 11, '#E8E0FF'); } }
    if (era === 2025) { const bob = Math.abs(Math.sin(lt * Math.PI / 0.536)) * 10; ctx.save(); ctx.translate(700, 660 - bob); ctx.strokeStyle = '#1E2A36'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(0, 0, 120, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.fillStyle = '#2E7D6A'; rr(ctx, -150, -20, 64, 110, 26); ctx.fill(); rr(ctx, 86, -20, 64, 110, 26); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#1E2A36'; rr(ctx, 900, 560, 300, 220, 22); ctx.fill(); ctx.fillStyle = '#F7F7F5'; rr(ctx, 916, 576, 268, 188, 12); ctx.fill(); ctx.fillStyle = '#2E7D6A'; for (let k = 0; k < 20; k++) { const h = 20 + 60 * Math.abs(Math.sin(lt * 5 + k * 0.7)); ctx.fillRect(934 + k * 12.5, 670 - h / 2, 8, h); }
      ctx.save(); ctx.translate(1300, 820); ctx.rotate(0.12); ctx.fillStyle = '#5A3A1E'; ctx.fillRect(-12, -340, 24, 250); circ(ctx, 0, -40, 80, '#D99A4A'); circ(ctx, 0, -120, 62, '#D99A4A'); circ(ctx, 0, -70, 22, '#2A1A0E'); ctx.restore(); }
    ctx.restore(); };
  // ---- surfaces ----------------------------------------------------------------------------------------------------
  E.surface = (ctx, era, t) => { const fr = Math.floor(t * 24);
    if (era === 1925) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(150,120,80,${0.12 + 0.04 * hash(fr)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
      ctx.fillStyle = 'rgba(40,30,20,0.35)'; for (let i = 0; i < 260; i++) ctx.fillRect(hash(fr * 7 + i) * W, hash(fr * 3 + i * 5) * H, 2, 2); ctx.strokeStyle = 'rgba(40,30,20,0.35)'; ctx.lineWidth = 2;
      for (let i = 0; i < 2; i++) { if (hash(fr + i * 9) < 0.5) continue; const x = hash(fr * 11 + i) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 8, H); ctx.stroke(); }
      const g = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1100); g.addColorStop(0, 'rgba(30,20,10,0)'); g.addColorStop(1, 'rgba(30,20,10,0.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    if (era === 1955) { ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = '#2A3E4A'; for (let y = 0; y < H; y += 12) for (let x = (y / 12) % 2 * 6; x < W; x += 12) ctx.fillRect(x, y, 3, 3); ctx.restore(); }
    if (era === 1975) { const g = ctx.createRadialGradient(W, 0, 0, W, 0, 900); g.addColorStop(0, 'rgba(255,140,40,0.45)'); g.addColorStop(1, 'rgba(255,140,40,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(240,200,150,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (era === 1995) { ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1.5); const g = ctx.createLinearGradient(0, 900, 0, H); g.addColorStop(0, 'rgba(255,79,195,0.25)'); g.addColorStop(1, 'rgba(79,227,255,0.1)'); ctx.fillStyle = g; ctx.fillRect(0, 900, W, 180); } };
  // the year, rolling from the previous era's like an odometer, and the era's caption
  E.year = (ctx, era, prev, lt, B) => { const e = E.ERAS[era], u = sm(lt / (0.8 * B)), digits = String(era).split(''), pd = String(prev || era).split(''); ctx.save(); ctx.font = E.F(150, e.fam, era === 2025 ? 800 : '');
    const dw = ctx.measureText('0').width * 1.02, x0 = 80, y0 = 1040, light = era === 1995; ctx.beginPath(); ctx.rect(x0 - 10, y0 - 140, dw * 4 + 20, 170); ctx.clip();
    digits.forEach((d, i) => { const a = +pd[i], b = +d, steps = ((b - a) + 10) % 10, off = steps * u; for (let k = -1; k <= steps + 1; k++) { const n = (a + k + 10) % 10, y = y0 + (k - off) * 160; if (y < y0 - 300 || y > y0 + 300) continue;
      ctx.fillStyle = light ? '#F0E8FF' : e.ink; ctx.fillText(String(n), x0 + i * dw, y); } }); ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp((lt - 0.5 * B) / (0.4 * B)); ctx.font = E.F(54, e.fam, era === 2025 ? 600 : ''); ctx.fillStyle = light ? '#F0E8FF' : e.ink; ctx.fillText(e.name, 80 + dw * 4 + 40, 1020); ctx.restore(); };
  E.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = E.F(size, o.fam || 'sans', o.w || ''); ctx.textAlign = o.align || 'center'; ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, x, y + 12 * (1 - sm(a))); ctx.restore(); };
  // one era's whole frame
  E.era = (ctx, era, prev, t, env) => { const lt = env.lt, s = 1 + 0.035 * lt / env.dur; E.street(ctx, era, t); ctx.save(); ctx.translate(W / 2, 520); ctx.scale(s, s); ctx.translate(-W / 2, -520); E.shop(ctx, era, t, lt); ctx.restore();
    E.surface(ctx, era, t); E.year(ctx, era, prev, lt, env.beatSec); };
  window.ERA = E;
})();

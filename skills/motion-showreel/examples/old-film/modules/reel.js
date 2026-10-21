// reel: the 동명극장 reel's kit (a project module). Old film: scenes are drawn in sepia tones, then K.film() runs the
// projector over them: the frame weaves a little every film frame (18 a second), the exposure flickers, grain
// crawls, a scratch or two runs down the frame, dust and a hair flash by, and an iris vignette closes the corners.
// Also: the countdown leader, intertitle cards with ornamental borders, a theatre front whose marquee bulbs chase,
// a projector with turning reels and a dusty beam. Type in Nanum Myeongjo.
(() => {
  const K = {}, COL = { dark: '#1E1812', mid: '#6E5E4A', light: '#E9DCC2', cream: '#F4EAD2', bulb: '#FFE6A0', warm: '#F2C46A' };
  K.COL = COL;
  K.FPS = 18; K.frame = (t) => Math.floor(t * K.FPS);
  K.weave = (ctx, t) => { const f = K.frame(t); ctx.translate((hash(f * 1.3) - 0.5) * 6, (hash(f * 2.7) - 0.5) * 8); };
  let grain = null;
  const makeGrain = () => { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d'), img = g.createImageData(512, 512), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = hash(i * 0.0137) * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 34; } g.putImageData(img, 0, 0); return c; };
  // the projector pass over a finished frame
  K.film = (ctx, t, o = {}) => { const f = K.frame(t);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = o.tint || '#E8D2A8'; ctx.fillRect(0, 0, W, H); ctx.restore();
    const fl = (hash(f * 4.1) - 0.5) * 0.12; ctx.fillStyle = fl > 0 ? `rgba(255,245,220,${fl})` : `rgba(0,0,0,${-fl})`; ctx.fillRect(0, 0, W, H);
    if (!grain) grain = makeGrain(); ctx.save(); ctx.globalCompositeOperation = 'overlay'; const ox = -hash(f * 7.7) * 512, oy = -hash(f * 9.1) * 512; for (let x = ox; x < W; x += 512) for (let y = oy; y < H; y += 512) ctx.drawImage(grain, x, y); ctx.restore();
    ctx.save(); for (let i = 0; i < 2; i++) { const life = Math.floor(f / (6 + i * 5)), x = hash(life * 3.3 + i) * W; if (hash(life * 5.1 + i) < 0.35) continue; ctx.strokeStyle = i ? 'rgba(255,250,235,0.35)' : 'rgba(20,14,8,0.45)'; ctx.lineWidth = 1.5 + hash(life) * 1.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (hash(life * 2) - 0.5) * 30, H); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { if (hash(f * 1.9 + i * 7) > 0.5) continue; const x = hash(f * 3.1 + i) * W, y = hash(f * 5.7 + i) * H, r = 2 + hash(f + i) * 6; ctx.fillStyle = i % 2 ? 'rgba(10,6,2,0.7)' : 'rgba(255,250,240,0.6)'; ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.4 + hash(i + f)), hash(i) * 3, 0, TAU); ctx.fill(); }
    if (hash(Math.floor(f / 9) * 2.2) > 0.6) { const x = hash(Math.floor(f / 9)) * W, y = hash(Math.floor(f / 9) * 3) * H; ctx.strokeStyle = 'rgba(10,6,2,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 40, y + 30, x - 20, y + 60, x + 30, y + 110); ctx.stroke(); }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(12,8,4,0.75)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  // the countdown leader: number n, sweep p (0..1 of the second)
  K.leader = (ctx, n, p) => { ctx.fillStyle = '#8A7E6A'; ctx.fillRect(0, 0, W, H); const cx = W / 2, cy = H / 2, R = 420;
    ctx.fillStyle = '#5E5444'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.6, -Math.PI / 2, -Math.PI / 2 + p * TAU); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#F4EAD2'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R * 0.82, 0, TAU); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.fillStyle = '#F4EAD2'; ctx.font = `800 520px ${FAM.display}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), cx, cy + 20); ctx.textBaseline = 'alphabetic'; };
  // an intertitle: black card, an ornamental double border with corner flourishes; lines = [[text, size, colour]]
  K.card = (ctx, lines, o = {}) => { ctx.fillStyle = '#100C08'; ctx.fillRect(0, 0, W, H); const m = 90, w = W - 2 * m, h = H - 2 * m;
    ctx.strokeStyle = COL.cream; ctx.lineWidth = 4; ctx.strokeRect(m, m, w, h); ctx.lineWidth = 1.5; ctx.strokeRect(m + 18, m + 18, w - 36, h - 36);
    for (const [x, y, sx, sy] of [[m, m, 1, 1], [m + w, m, -1, 1], [m, m + h, 1, -1], [m + w, m + h, -1, -1]]) { ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, 30); ctx.bezierCurveTo(90, 30, 90, 90, 140, 70); ctx.moveTo(30, 30); ctx.bezierCurveTo(30, 90, 90, 90, 70, 140); ctx.stroke();
      ctx.beginPath(); ctx.arc(30, 30, 9, 0, TAU); ctx.fillStyle = COL.cream; ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 220, H - m - 70); ctx.lineTo(W / 2 + 220, H - m - 70); ctx.stroke(); ctx.beginPath(); ctx.arc(W / 2, H - m - 70, 8, 0, TAU); ctx.fillStyle = COL.cream; ctx.fill(); ctx.restore();
    // lines stacked by their own sizes: each takes its height plus a gap of 45% of it
    const total = lines.reduce((s, [, sz]) => s + sz * 1.45, 0) - (lines.length ? lines[lines.length - 1][1] * 0.45 : 0); let y = H / 2 - total / 2 + (o.dy ?? 0);
    ctx.textAlign = 'center'; for (const [s, sz, col, a] of lines) { y += sz * 0.88; ctx.save(); ctx.globalAlpha *= a ?? 1; ctx.font = `800 ${sz}px ${FAM.display}`; ctx.fillStyle = col || COL.cream; ctx.fillText(s, W / 2, y); ctx.restore(); y += sz * 0.57; } };
  // the theatre front at night: brick wall, a marquee with chasing bulbs, the name in bulbs that light in order (k = 0..1)
  K.front = (ctx, t, k, o = {}) => { ctx.fillStyle = '#2A221A'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2; for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = (y / 36) % 2 ? 0 : 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 36); ctx.stroke(); } }
    // the sign board with the name
    const bx = 360, by = 110, bw = 1200, bh = 300; ctx.fillStyle = '#16110C'; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = '#8A6A3A'; ctx.lineWidth = 8; ctx.strokeRect(bx, by, bw, bh);
    const name = o.name || '동명극장', nchar = [...name].length; ctx.font = `800 220px ${FAM.display}`; ctx.textAlign = 'center';
    [...name].forEach((ch, i) => { const on = k * (nchar + 1) > i + 0.5, x = bx + bw * (i + 0.5) / nchar, y = by + 230; if (on) { ctx.save(); ctx.shadowColor = COL.warm; ctx.shadowBlur = 50; ctx.fillStyle = COL.bulb; ctx.fillText(ch, x, y); ctx.restore(); } else { ctx.fillStyle = '#3A3026'; ctx.fillText(ch, x, y); } });
    // bulbs round the board
    const per = 2 * (bw + bh), n = 46; for (let i = 0; i < n; i++) { let d = i / n * per, x, y; if (d < bw) { x = bx + d; y = by; } else if ((d -= bw) < bh) { x = bx + bw; y = by + d; } else if ((d -= bh) < bw) { x = bx + bw - d; y = by + bh; } else { d -= bw; x = bx; y = by + bh - d; }
      const lit = k >= 1 ? ((i + Math.floor(t * 8)) % 3 !== 0) : k * n > i; ctx.fillStyle = lit ? COL.bulb : '#4A3E30'; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); if (lit) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,220,140,0.25)'; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill(); ctx.restore(); } }
    // the marquee canopy and the entrance
    ctx.fillStyle = '#3A2E22'; ctx.fillRect(160, 470, 1600, 90); ctx.fillStyle = COL.light; ctx.fillRect(200, 485, 1520, 60); ctx.fillStyle = COL.dark; ctx.font = `800 46px ${FAM.display}`; ctx.fillText(o.marquee || '개관 기념 상영 · 필름 영사', W / 2, 532);
    ctx.fillStyle = '#16110C'; for (const x of [420, 860, 1300]) { ctx.fillRect(x, 640, 200, 440); ctx.strokeStyle = '#8A6A3A'; ctx.lineWidth = 6; ctx.strokeRect(x, 640, 200, 440); }
    ctx.fillStyle = 'rgba(255,220,150,0.18)'; ctx.fillRect(860, 640, 200, 440); };
  // the projector, side on: two reels turning, the body, the lens and a dusty beam to the right
  K.projector = (ctx, t, o = {}) => { ctx.fillStyle = '#1A140E'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(760, 0, W, 0); g.addColorStop(0, 'rgba(255,240,200,0.55)'); g.addColorStop(1, 'rgba(255,240,200,0.08)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(760, 600); ctx.lineTo(W, 260); ctx.lineTo(W, 980); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 60; i++) { const x = 800 + ((hash(i * 3.3) * 1100 + t * (20 + hash(i) * 30)) % 1120), y = 600 + (hash(i * 5.1) - 0.5) * (x - 760) * 0.95 + Math.sin(t + i) * 10; ctx.fillStyle = `rgba(255,250,230,${0.3 + 0.4 * hash(i * 2)})`; ctx.beginPath(); ctx.arc(x, y, 1.5 + hash(i) * 2, 0, TAU); ctx.fill(); } ctx.restore();
    const reel = (x, y, r, a) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = '#B8A888'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.fillStyle = '#3A3026'; ctx.beginPath(); ctx.arc(0, 0, r - 8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1A140E'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * 0.75, k * TAU / 3 + 0.3, k * TAU / 3 + 1.4); ctx.closePath(); ctx.fill(); } ctx.fillStyle = '#B8A888'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill(); ctx.restore(); };
    reel(430, 300, 190, t * 2.4); reel(700, 330, 150, -t * 3.0);
    ctx.fillStyle = '#4A3E30'; ctx.fillRect(300, 470, 460, 260); ctx.fillStyle = '#5E5040'; ctx.fillRect(320, 490, 420, 40); ctx.fillStyle = '#2A221A'; ctx.fillRect(740, 560, 70, 80); ctx.fillStyle = '#8A7A60'; ctx.beginPath(); ctx.arc(812, 600, 30, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3A3026'; ctx.fillRect(360, 730, 60, 300); ctx.fillRect(640, 730, 60, 300); ctx.strokeStyle = '#2A221A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(430, 300); ctx.lineTo(560, 500); ctx.lineTo(700, 330); ctx.stroke(); };
  K.text = (ctx, s, x, y, size, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || COL.cream; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12; ctx.fillText(s, x, y); ctx.restore(); };
  window.REEL8 = K;
})();

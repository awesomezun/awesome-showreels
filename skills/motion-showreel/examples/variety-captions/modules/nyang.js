// nyang: the 냥이네 하숙집 reel's variety-show kit (a project module, vertical 1080 x 1920). The "footage" is a warm
// room drawn in code with a cartoon cheese cat in several poses and faces, seen through a camera that pushes in, punches
// and shakes; over it the variety captions: each character pops on its own spring (0 to 1.15 to 1) with a thick dark
// outer stroke, a white inner stroke, a two-tone gradient fill and a shine; plus the genre's marks (concentration lines,
// a sweat drop, sparkles, floating zzz, a red circle on the culprit, confetti) and a corner bug with the show's name.
// Display Bagel Fat One, labels Jua, sound words Black Han Sans.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { wall: '#FCE3C8', wall2: '#F7D2AE', floor: '#D79E62', floor2: '#C4884C', cat: '#F2A04E', catD: '#D9822E', cream: '#FFF3E0', pink: '#FF8FB1', ink: '#3B1E54', red: '#FF3B3B', sky: '#6CC8FF', yellow: '#FFE14D' };
  const C = K.COL;
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  K.STY = { yellow: ['#FFF7A8', '#FFC400', C.ink], pink: ['#FFD3E2', '#FF5C93', C.ink], sky: ['#E3F6FF', '#3FB6FF', '#0E2E5A'], white: ['#FFFFFF', '#E9E9E9', '#111111'], red: ['#FFE0D6', '#FF3B3B', '#3A0A0A'] };
  // ───────── the footage ─────────
  K.cam = (ctx, z = 1, fx = W / 2, fy = H / 2, shake = 0, lt = 0) => { const [sx, sy] = shake ? [Math.sin(lt * 37) * shake, Math.cos(lt * 29) * shake] : [0, 0]; ctx.translate(W / 2 + sx, H / 2 + sy); ctx.scale(z, z); ctx.translate(-fx, -fy); };
  K.room = (ctx, lt, o = {}) => {
    ctx.fillStyle = C.wall; ctx.fillRect(-400, -400, W + 800, 1500);
    ctx.fillStyle = C.wall2; for (let x = -400; x < W + 400; x += 90) ctx.fillRect(x, -400, 30, 1500);
    const g = ctx.createLinearGradient(700, 200, 1000, 900); g.addColorStop(0, 'rgba(255,255,240,0.65)'); g.addColorStop(1, 'rgba(255,255,240,0)'); ctx.fillStyle = g;    // window light
    ctx.beginPath(); ctx.moveTo(640, 150); ctx.lineTo(960, 150); ctx.lineTo(1200, 1100); ctx.lineTo(500, 1100); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; rr(ctx, 660, 150, 280, 360, 18); ctx.fill(); ctx.fillStyle = '#BFE8FF'; rr(ctx, 680, 170, 240, 320, 12); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(796, 170, 8, 320); ctx.fillRect(680, 326, 240, 8);
    ctx.fillStyle = C.floor; ctx.fillRect(-400, 1100, W + 800, 1300); ctx.fillStyle = C.floor2; for (let y = 1160; y < 2400; y += 90) ctx.fillRect(-400, y, W + 800, 6);
    // plant, low table with a cup (o.cup: 0 standing .. 1 fallen and broken)
    ctx.fillStyle = '#E07A4A'; rr(ctx, 80, 980, 150, 140, 20); ctx.fill(); ctx.fillStyle = '#5BAE5A'; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(155 + Math.cos(k) * 40, 900 - k * 22, 26, 70, -0.6 + k * 0.25 + 0.05 * Math.sin(lt * 2 + k), 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#A8673A'; rr(ctx, 600, 1180, 420, 34, 10); ctx.fill(); ctx.fillRect(630, 1214, 26, 120); ctx.fillRect(964, 1214, 26, 120);
    const cup = o.cup ?? 0;
    if (cup < 1) { const a = cup * 1.8, cx = 900 + cup * 90, cy = 1180 + cup * cup * 160; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillStyle = '#FFFFFF'; rr(ctx, -40, -100, 80, 100, 14); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(46, -52, 22, -1.2, 1.2); ctx.stroke(); ctx.fillStyle = '#FF8FB1'; ctx.fillRect(-40, -70, 80, 16); ctx.restore(); }
    else { ctx.fillStyle = '#FFFFFF'; for (let k = 0; k < 6; k++) { ctx.save(); ctx.translate(950 + (k - 2.5) * 46, 1440 + 10 * hash(k)); ctx.rotate(hash(k * 3) * 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30, 6); ctx.lineTo(10, 26); ctx.closePath(); ctx.fill(); ctx.restore(); } }
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.ellipse(380, 1330, 250, 70, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFB3CB'; ctx.beginPath(); ctx.ellipse(380, 1310, 230, 52, 0, 0, TAU); ctx.fill();   // cushion
  };
  // the cat: feet/centre at (x, y); pose 'loaf' | 'sit'; face 'sleep' | 'open' | 'shock' | 'side' | 'star'; paw 0..1 raises a front paw
  K.cat = (ctx, x, y, s, lt, o = {}) => {
    const pose = o.pose || 'sit', face = o.face || 'open', breathe = 1 + 0.025 * Math.sin(lt * (face === 'sleep' ? 2.2 : 4));
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
    ctx.fillStyle = 'rgba(80,40,10,0.2)'; ctx.beginPath(); ctx.ellipse(0, 6, 190, 30, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.catD; ctx.lineWidth = 30; ctx.lineCap = 'round'; const tw = Math.sin(lt * 2.4) * 0.4;     // tail
    ctx.beginPath(); ctx.moveTo(-120, -40); ctx.quadraticCurveTo(-250, -60 + 60 * tw, -200, -200 + 40 * tw); ctx.stroke();
    ctx.fillStyle = C.cat;
    if (pose === 'loaf') { ctx.save(); ctx.scale(1, breathe); ctx.beginPath(); ctx.ellipse(0, -90, 190, 100, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    else { ctx.save(); ctx.translate(0, -150); ctx.scale(1, breathe); ctx.beginPath(); ctx.ellipse(0, 0, 135, 160, 0, 0, TAU); ctx.fill(); ctx.restore(); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(0, -130, 70, 110, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = C.catD; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(-80 + k * 20, pose === 'loaf' ? -150 : -230 + k * 40, 14, 40, 0.5, 0, TAU); ctx.fill(); }
    const hy = pose === 'loaf' ? -160 : -330, hx = pose === 'loaf' ? 110 : 0;                                              // head
    if (o.paw) { ctx.fillStyle = C.cat; ctx.save(); ctx.translate(hx + 60, hy + 160); ctx.rotate(-1.2 * o.paw); ctx.beginPath(); ctx.ellipse(40, 0, 60, 28, 0, 0, TAU); ctx.fill(); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(92, 0, 20, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = C.cat; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + sg * 40, hy - 70); ctx.lineTo(hx + sg * 112, hy - 150); ctx.lineTo(hx + sg * 118, hy - 30); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFB7A1'; ctx.beginPath(); ctx.moveTo(hx + sg * 60, hy - 70); ctx.lineTo(hx + sg * 104, hy - 122); ctx.lineTo(hx + sg * 106, hy - 50); ctx.closePath(); ctx.fill(); ctx.fillStyle = C.cat; }
    ctx.beginPath(); ctx.ellipse(hx, hy, 130, 110, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C.catD; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(hx - 30 + k * 30, hy - 92, 8, 22, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.ellipse(hx, hy + 40, 70, 46, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round';
    const ex = 52, ey = hy - 10;
    for (const sg of [-1, 1]) { const x0 = hx + sg * ex;
      if (face === 'sleep') { ctx.beginPath(); ctx.arc(x0, ey - 6, 20, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); }
      else if (face === 'star') { ctx.fillStyle = C.yellow; ctx.save(); ctx.translate(x0, ey); ctx.rotate(lt * 2); ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 12 : 30, a = k / 10 * TAU - Math.PI / 2; k ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
      else { const big = face === 'shock' ? 32 : 26, pr = face === 'shock' ? 7 : 15, off = face === 'side' ? 10 * (o.flip ? -1 : 1) : 0; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x0, ey, big, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x0 + off, ey + 2, pr, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x0 + off - 5, ey - 6, 5, 0, TAU); ctx.fill(); } }
    ctx.fillStyle = '#FF7A8A'; ctx.beginPath(); ctx.moveTo(hx - 12, hy + 20); ctx.lineTo(hx + 12, hy + 20); ctx.lineTo(hx, hy + 34); ctx.closePath(); ctx.fill();
    ctx.beginPath(); if (face === 'shock') { ctx.ellipse(hx, hy + 60, 16, 20, 0, 0, TAU); ctx.fillStyle = '#7A2A3A'; ctx.fill(); } else { ctx.arc(hx - 14, hy + 38, 14, 0, Math.PI); ctx.moveTo(hx + 28, hy + 38); ctx.arc(hx + 14, hy + 38, 14, 0, Math.PI); ctx.stroke(); }
    ctx.lineWidth = 4; for (const sg of [-1, 1]) for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(hx + sg * 70, hy + 30 + k * 12); ctx.lineTo(hx + sg * 170, hy + 20 + k * 26); ctx.stroke(); }
    ctx.restore();
  };
  // ───────── captions ─────────
  K.cap = (ctx, s, x, y, size, lt, o = {}) => {
    const [c0, c1, outer] = K.STY[o.style || 'yellow'], chars = [...s]; ctx.save(); ctx.font = K.F(size, o.fam || 'display'); ctx.textAlign = 'left'; ctx.lineJoin = 'round';
    const ws = chars.map(ch => ctx.measureText(ch).width + (o.track ?? 2)), tot = ws.reduce((a, b) => a + b, 0); let xx = (o.align ?? 'center') === 'center' ? x - tot / 2 : x;
    ctx.translate(0, 0); if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); ctx.translate(-x, -y); }
    chars.forEach((ch, i) => { const u = lt - i * (o.stagger ?? 0.045); if (u > 0 && ch !== ' ') { const sc = u < 0.08 ? 1.15 * u / 0.08 : u < 0.16 ? 1.15 - 0.15 * (u - 0.08) / 0.08 : 1, bob = (o.bob ? Math.sin((lt * 6) + i) * 6 : 0);
      ctx.save(); ctx.translate(xx + ws[i] / 2, y + bob); ctx.scale(sc, sc);
      ctx.lineWidth = size * 0.26; ctx.strokeStyle = outer; ctx.strokeText(ch, -ws[i] / 2, 0);
      ctx.lineWidth = size * 0.12; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(ch, -ws[i] / 2, 0);
      const g = ctx.createLinearGradient(0, -size * 0.8, 0, size * 0.05); g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillText(ch, -ws[i] / 2, 0);
      ctx.restore(); } xx += ws[i]; });
    ctx.restore(); return tot; };
  K.tag = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, 'sans'); const w = ctx.measureText(s).width + size * 1.1, sc = Ease.outBack(clamp(a), 2);
    ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = o.bg || C.ink; rr(ctx, -w / 2, -size * 0.95, w, size * 1.35, size * 0.6); ctx.fill(); ctx.fillStyle = o.fg || '#FFFFFF'; ctx.textAlign = 'center'; ctx.fillText(s, 0, size * 0.1); ctx.restore(); };
  // ───────── marks ─────────
  K.lines = (ctx, cx, cy, a, lt) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#FFFFFF'; for (let k = 0; k < 60; k++) { const an = k / 60 * TAU + hash(k + Math.floor(lt * 12)) * 0.05, r0 = 380 + 140 * hash(k * 3 + Math.floor(lt * 12)), w = 0.012 + 0.012 * hash(k);
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(an - w) * 2000, cy + Math.sin(an - w) * 2000); ctx.lineTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an + w) * 2000, cy + Math.sin(an + w) * 2000); ctx.closePath(); ctx.fill(); } ctx.restore(); };
  K.sweat = (ctx, x, y, s, lt) => { ctx.save(); ctx.translate(x, y + 10 * Math.sin(lt * 5)); ctx.scale(s, s); ctx.fillStyle = '#7FD4FF'; ctx.strokeStyle = '#1B5A8A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(36, 10, 0, 30); ctx.quadraticCurveTo(-36, 10, 0, -60); ctx.fill(); ctx.stroke(); ctx.restore(); };
  K.sparkles = (ctx, cx, cy, r, lt, n = 8) => { for (let k = 0; k < n; k++) { const a = k / n * TAU + lt * 0.6, rr2 = r * (0.8 + 0.3 * Math.sin(lt * 4 + k)); sparkle(ctx, cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2, 18 + 10 * Math.sin(lt * 6 + k), 0.9, lt * 2 + k, k % 2 ? '#FFFFFF' : '#FFE14D'); } };
  K.zzz = (ctx, x, y, lt) => { ctx.save(); ctx.font = K.F(70, 'mono'); for (let k = 0; k < 3; k++) { const ph = (lt * 0.5 + k / 3) % 1; ctx.globalAlpha = Math.sin(Math.PI * ph); ctx.fillStyle = C.sky; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 10; ctx.save(); ctx.translate(x + ph * 120, y - ph * 260); ctx.rotate(-0.2); ctx.strokeText('Z', 0, 0); ctx.fillText('Z', 0, 0); ctx.restore(); } ctx.restore(); };
  K.ring = (ctx, x, y, r, p) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.8, -0.2, -Math.PI / 2, -Math.PI / 2 + TAU * 1.08 * clamp(p)); ctx.stroke(); ctx.restore(); };
  K.confetti = (ctx, lt, n = 60) => { for (let i = 0; i < n; i++) { const x = hash(i * 3.1) * W, y = ((hash(i * 7.3) * H + lt * (300 + 200 * hash(i))) % (H + 100)) - 50, r = lt * 3 + i; ctx.save(); ctx.translate(x + 20 * Math.sin(lt * 2 + i), y); ctx.rotate(r); ctx.fillStyle = [C.yellow, C.pink, C.sky, '#9DE07A'][i % 4]; ctx.fillRect(-10, -5, 20, 10); ctx.restore(); } };
  K.bug = (ctx, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(59,30,84,0.85)'; rr(ctx, 40, 56, 330, 76, 38); ctx.fill(); ctx.font = K.F(40); ctx.fillStyle = C.yellow; ctx.fillText('냥이네 하숙집', 70, 108); ctx.restore(); };
  window.NYANG = K;
})();
(() => {
  const K = NYANG;
  // a rotating sunburst of two colours behind title cards
  K.burst = (ctx, lt, c1 = '#FFD84D', c2 = '#FFB52E', cy = H * 0.42) => { ctx.fillStyle = c1; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(W / 2, cy); ctx.rotate(lt * 0.25); ctx.fillStyle = c2;
    for (let k = 0; k < 18; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2400, k / 18 * Math.PI * 2, (k + 0.5) / 18 * Math.PI * 2); ctx.closePath(); ctx.fill(); } ctx.restore(); };
})();

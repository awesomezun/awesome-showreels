// mini: the 5초 미션 reel's microgame kit (a project module). Eight tiny games, each drawn from one progress value u
// (0 at the instruction, 1 at the success), on a bold colour with moving diagonal stripes; thick black outlines; a dark
// status bar on top (level, score, lives) in Galmuri11 at whole multiples of its 12-pixel grid; a bomb fuse at the
// bottom that burns down over the game. A game lasts 4, 2 or 1 beats by level: the tempo never changes, the games
// just get shorter. Bagel Fat One for the instructions and the logo.
(() => {
  const M = {}, TAU = Math.PI * 2, OL = '#141018';
  M.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  M.BG = ['#FF5A5F', '#3DA5FF', '#FFC531', '#7B61FF', '#2ECC71', '#FF8A3D', '#FF5FA2', '#19C3B3'];
  const out = (ctx, w = 8) => { ctx.strokeStyle = OL; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
  const circ = (ctx, x, y, r, col, w = 8) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); if (w) out(ctx, w); };
  const heart = (ctx, x, y, r, col) => { ctx.beginPath(); ctx.moveTo(x, y + r * 0.9); ctx.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.4, x, y - r * 0.5); ctx.bezierCurveTo(x + r * 0.7, y - r * 1.4, x + r * 1.6, y - r * 0.2, x, y + r * 0.9); ctx.fillStyle = col; ctx.fill(); out(ctx, 5); };
  M.stripes = (ctx, col, t, speed = 120) => { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.14)'; const off = (t * speed) % 160;
    for (let x = -H - 160 + off; x < W + 160; x += 160) { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + 80, H); ctx.lineTo(x + 80 + H, 0); ctx.lineTo(x + H, 0); ctx.closePath(); ctx.fill(); } ctx.restore(); };
  // the hero: a round blob with big eyes (look: -1..1), squash sq
  M.blob = (ctx, x, y, r, col, o = {}) => { const sq = o.sq || 0; ctx.save(); ctx.translate(x, y); ctx.scale(1 + sq * 0.6, 1 - sq); circ(ctx, 0, -r, r, col, 9);
    for (const s of [-1, 1]) { circ(ctx, s * r * 0.36 + (o.look || 0) * 6, -r * 1.15, r * 0.24, '#FFFFFF', 6); circ(ctx, s * r * 0.36 + (o.look || 0) * 14, -r * 1.12, r * 0.1, OL, 0); }
    if (o.happy) { ctx.beginPath(); ctx.arc(0, -r * 0.7, r * 0.28, 0.15 * Math.PI, 0.85 * Math.PI); out(ctx, 7); } else { ctx.beginPath(); ctx.ellipse(0, -r * 0.62, r * 0.12, r * 0.14, 0, 0, TAU); ctx.fillStyle = OL; ctx.fill(); }
    ctx.restore(); };
  const star = (ctx, x, y, r, col, rot = 0) => { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = rot - Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); out(ctx, 6); };
  M.burst = (ctx, x, y, u, n = 10, R = 260) => { if (u <= 0 || u >= 1) return; for (let k = 0; k < n; k++) { const a = k * TAU / n, r = R * Math.sqrt(u); star(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r, 30 * (1 - u) + 6, ['#FFE14D', '#FFFFFF', '#FF7AB6'][k % 3], u * 4 + k); } };
  // ---- the eight games; each takes (ctx, u, t) and draws in the area between the status bar and the fuse -----------------
  const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  M.GAMES = [
    ['잡아!', (ctx, u, t) => { const ay = lerp(200, 700, Math.min(1, u / 0.7) ** 2), bx = lerp(500, 1100, ease(u / 0.6)), ax = 1100; circ(ctx, ax, ay, 56, '#FF3B3B'); ctx.fillStyle = '#3A8A3A'; ctx.beginPath(); ctx.ellipse(ax + 20, ay - 66, 26, 12, -0.5, 0, TAU); ctx.fill(); out(ctx, 6);
      ctx.beginPath(); ctx.moveTo(bx - 150, 720); ctx.lineTo(bx + 150, 720); ctx.lineTo(bx + 110, 880); ctx.lineTo(bx - 110, 880); ctx.closePath(); ctx.fillStyle = '#C98A4A'; ctx.fill(); out(ctx); for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(bx + k * 50, 724); ctx.lineTo(bx + k * 38, 876); out(ctx, 5); }
      M.burst(ctx, 1100, 720, (u - 0.7) / 0.3); }],
    ['피해!', (ctx, u, t) => { const bx = lerp(1900, -200, u), j = u > 0.3 && u < 0.75 ? Math.sin(Math.PI * (u - 0.3) / 0.45) : 0; ctx.fillStyle = '#5B4636'; ctx.fillRect(0, 880, W, 80);
      circ(ctx, bx, 800, 80, '#FFFFFF'); ctx.save(); ctx.translate(bx, 800); ctx.rotate(-u * 20); ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(80, 0); ctx.moveTo(0, -80); ctx.lineTo(0, 80); out(ctx, 6); ctx.restore();
      M.blob(ctx, 860, 880 - j * 330, 110, '#FFD23F', { sq: u > 0.75 && u < 0.85 ? 0.15 : j > 0 ? -0.1 : 0, happy: u > 0.8, look: 1 }); }],
    ['눌러!', (ctx, u, t) => { const press = u > 0.55 ? Math.max(0, 1 - (u - 0.55) / 0.3) : u / 0.55, d = u > 0.45 && u < 0.75 ? 34 : 0; ctx.fillStyle = '#9AA3B5'; ctx.beginPath(); ctx.ellipse(960, 780, 300, 90, 0, 0, TAU); ctx.fill(); out(ctx);
      ctx.fillStyle = '#E8333C'; ctx.beginPath(); ctx.ellipse(960, 700 + d, 210, 70, 0, 0, TAU); ctx.fill(); ctx.fillRect(750, 700 + d, 420, 80 - d); ctx.beginPath(); ctx.ellipse(960, 780, 210, 70, 0, 0, Math.PI); ctx.fill(); out(ctx);
      ctx.beginPath(); ctx.ellipse(960, 700 + d, 210, 70, 0, 0, TAU); out(ctx); const fy = lerp(150, 560 + d, ease(press)); ctx.fillStyle = '#FFD2B0'; ctx.beginPath(); ctx.roundRect(900, fy - 420, 120, 440, 60); ctx.fill(); out(ctx);
      if (u > 0.5) { ctx.save(); ctx.globalAlpha = clamp((0.9 - u) / 0.3); ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(150); ctx.textAlign = 'center'; ctx.fillText('딸깍!', 1460, 560); ctx.restore(); } }],
    ['터뜨려!', (ctx, u, t) => { const r = lerp(120, 260, Math.min(1, u / 0.7)), popped = u > 0.72; if (!popped) { ctx.beginPath(); ctx.moveTo(960, 620 + r * 0.2); ctx.quadraticCurveTo(940, 760, 980, 900); out(ctx, 5); ctx.beginPath(); ctx.ellipse(960, 560 - r * 0.2, r * 0.85, r, 0, 0, TAU); ctx.fillStyle = '#FF4F9A'; ctx.fill(); out(ctx);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(900, 480 - r * 0.3, r * 0.15, r * 0.25, -0.4, 0, TAU); ctx.fill(); }
      const px = lerp(1700, 960 + r * 0.8, ease(u / 0.72)); ctx.save(); ctx.translate(px, 560); ctx.fillStyle = '#C9D3E0'; ctx.fillRect(0, -6, 200, 12); circ(ctx, 210, 0, 26, '#FF3B3B', 6); ctx.restore();
      if (popped) { M.burst(ctx, 960, 560, (u - 0.72) / 0.28, 14, 420); ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(170); ctx.textAlign = 'center'; ctx.fillText('펑!', 960, 620); } }],
    ['먹여!', (ctx, u, t) => { const open = u < 0.65; ctx.save(); ctx.translate(1240, 720); circ(ctx, 0, 0, 200, '#F0A040'); for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 70, -170); ctx.lineTo(s * 170, -280); ctx.lineTo(s * 180, -120); ctx.closePath(); ctx.fillStyle = '#F0A040'; ctx.fill(); out(ctx); }
      for (const s of [-1, 1]) { if (u > 0.7) { ctx.beginPath(); ctx.arc(s * 70, -40, 30, Math.PI * 1.1, Math.PI * 1.9); out(ctx, 8); } else circ(ctx, s * 70, -40, 26, OL, 0); }
      ctx.beginPath(); if (open) { ctx.ellipse(0, 70, 70, 50 + 20 * Math.sin(t * 20), 0, 0, TAU); ctx.fillStyle = '#7A1E2E'; ctx.fill(); out(ctx, 6); } else { ctx.arc(0, 40, 50, 0.2, Math.PI - 0.2); out(ctx, 8); } ctx.restore();
      if (u < 0.65) { const k = ease(u / 0.65), fx = lerp(300, 1180, k), fy = lerp(400, 790, k) - Math.sin(Math.PI * k) * 260; ctx.save(); ctx.translate(fx, fy); ctx.rotate(k * 6); ctx.beginPath(); ctx.ellipse(0, 0, 90, 40, 0, 0, TAU); ctx.fillStyle = '#7FC8FF'; ctx.fill(); out(ctx, 6);
        ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(-140, -40); ctx.lineTo(-140, 40); ctx.closePath(); ctx.fillStyle = '#7FC8FF'; ctx.fill(); out(ctx, 6); ctx.restore(); }
      if (u > 0.7) for (let k = 0; k < 3; k++) { ctx.save(); ctx.globalAlpha = clamp((1 - u) / 0.2); heart(ctx, 1470 + k * 80, 450 - (u - 0.7) * 400 - k * 30, 34, '#FF4F7A'); ctx.restore(); } }],
    ['닦아!', (ctx, u, t) => { ctx.fillStyle = '#BFE7FF'; ctx.fillRect(560, 230, 800, 620); ctx.strokeStyle = OL; ctx.lineWidth = 14; ctx.strokeRect(560, 230, 800, 620); ctx.beginPath(); ctx.moveTo(960, 230); ctx.lineTo(960, 850); ctx.moveTo(560, 540); ctx.lineTo(1360, 540); out(ctx, 10);
      const k = clamp(u / 0.85), sx = 620 + ((k * 4) % 1) * 680 * ((Math.floor(k * 4) % 2) ? -1 : 1) + ((Math.floor(k * 4) % 2) ? 680 : 0), sy = 300 + k * 480;
      ctx.save(); ctx.beginPath(); ctx.rect(560, 230, 800, 620); ctx.clip(); for (let i = 0; i < 14; i++) { const x = 600 + hash(i * 3) * 720, y = 270 + hash(i * 7) * 540; if (y < sy - 40 || (Math.abs(y - sy) < 60 && ((Math.floor(k * 4) % 2) ? x > sx : x < sx))) continue;
        ctx.fillStyle = 'rgba(120,85,50,0.75)'; ctx.beginPath(); ctx.ellipse(x, y, 70 + 40 * hash(i), 50, hash(i * 5) * 3, 0, TAU); ctx.fill(); } ctx.restore();
      if (u < 0.9) { ctx.fillStyle = '#FFE14D'; ctx.beginPath(); ctx.roundRect(sx - 90, sy - 60, 180, 120, 30); ctx.fill(); out(ctx); } else M.burst(ctx, 960, 540, (u - 0.85) / 0.15, 8, 380); }],
    ['깨워!', (ctx, u, t) => { const awake = u > 0.55, ring = u > 0.3 && u < 0.6, sh = ring ? Math.sin(t * 80) * 14 : 0; ctx.save(); ctx.translate(1300 + sh, 520); circ(ctx, 0, 0, 110, '#E8E8F0'); for (const s of [-1, 1]) circ(ctx, s * 80, -100, 36, '#FFD23F', 7);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -70); ctx.moveTo(0, 0); ctx.lineTo(50, 20); out(ctx, 8); ctx.restore(); if (ring) for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(1300, 520, 170 + 20 * Math.sin(t * 40), s > 0 ? -0.6 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 0.6); out(ctx, 8); }
      const j = awake ? Math.sin(Math.PI * clamp((u - 0.55) / 0.3)) : 0; ctx.save(); ctx.translate(700, 860 - j * 280); ctx.fillStyle = '#9A9AB0'; ctx.beginPath(); ctx.ellipse(0, -90, 190, 100, 0, 0, TAU); ctx.fill(); out(ctx);
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 60, -170); ctx.lineTo(s * 120, -250); ctx.lineTo(s * 140, -140); ctx.closePath(); ctx.fillStyle = '#9A9AB0'; ctx.fill(); out(ctx); }
      for (const s of [-1, 1]) { if (awake) circ(ctx, s * 60, -110, 30, '#FFFFFF', 6); else { ctx.beginPath(); ctx.arc(s * 60, -110, 26, 0.1, Math.PI - 0.1); out(ctx, 7); } } ctx.restore();
      if (!awake) { ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(80); for (let k = 0; k < 3; k++) ctx.fillText('Z', 880 + k * 60 + Math.sin(t * 3 + k) * 10, 640 - k * 70 - ((t * 60) % 40)); } else { ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(150); ctx.fillText('!!', 900, 520 - j * 200); } }],
    ['골인!', (ctx, u, t) => { ctx.fillStyle = '#3FBF5F'; ctx.fillRect(0, 760, W, 200); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 18; ctx.strokeRect(1360, 330, 420, 440); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      for (let x = 1380; x < 1780; x += 40) { ctx.beginPath(); ctx.moveTo(x, 340); ctx.lineTo(x, 770); ctx.stroke(); } for (let y = 360; y < 770; y += 40) { ctx.beginPath(); ctx.moveTo(1370, y); ctx.lineTo(1770, y); ctx.stroke(); }
      const k = clamp((u - 0.25) / 0.45), bx = lerp(560, 1580, ease(k)), by = lerp(800, 560, k) - Math.sin(Math.PI * k) * 200; M.blob(ctx, 380, 900, 100, '#FF8A3D', { sq: u > 0.2 && u < 0.3 ? 0.18 : 0, happy: u > 0.75, look: 1 });
      circ(ctx, bx, by, 60, '#FFFFFF'); ctx.save(); ctx.translate(bx, by); ctx.rotate(k * 12); for (let q = 0; q < 5; q++) { const a = q * TAU / 5; circ(ctx, Math.cos(a) * 32, Math.sin(a) * 32, 14, OL, 0); } ctx.restore(); M.burst(ctx, 1570, 560, (u - 0.72) / 0.28, 12, 360); }],
  ];
  // one game at u, its background stripes in its colour, the instruction popping in, a success stamp at the end
  M.game = (ctx, i, u, t, o = {}) => { const [word, fn] = M.GAMES[i % M.GAMES.length]; M.stripes(ctx, M.BG[i % M.BG.length], t, 200 * (o.speed || 1)); ctx.save(); ctx.translate(960, 620); ctx.scale(1.2, 1.2); ctx.translate(-960, -620); fn(ctx, u, t); ctx.restore();
    const a = clamp(u / 0.08), pop = 1 + 0.4 * Math.exp(-u * 30 / (o.speed || 1)) * Math.cos(u * 60); ctx.save(); ctx.translate(W / 2, 300); ctx.scale(pop, pop); ctx.globalAlpha = a * clamp((0.75 - u) / 0.15 + 0.3);
    ctx.font = M.F(180); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.strokeStyle = OL; ctx.lineWidth = 26; ctx.strokeText(word, 0, 60); ctx.fillStyle = '#FFFFFF'; ctx.fillText(word, 0, 60); ctx.restore();
    if (u > 0.75) { ctx.save(); ctx.translate(1560, 360); ctx.rotate(-0.25); const s = 1 + 0.6 * Math.exp(-(u - 0.75) * 40); ctx.scale(s, s); ctx.strokeStyle = '#FF2E4D'; ctx.lineWidth = 14; ctx.strokeRect(-190, -80, 380, 160); ctx.fillStyle = '#FF2E4D'; ctx.font = M.F(110); ctx.textAlign = 'center'; ctx.fillText('성공!', 0, 40); ctx.restore(); } };
  // the status bar (Galmuri11 at 48 px, four times its grid) and the bomb fuse
  M.hud = (ctx, level, score, u, t) => { ctx.fillStyle = '#1B1B2F'; ctx.fillRect(0, 0, W, 108); ctx.font = M.F(48, 'mono'); ctx.fillStyle = '#FFE14D'; ctx.fillText(`LEVEL ${level}`, 72, 72); ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right'; ctx.fillText(`SCORE ${String(Math.round(score)).padStart(4, '0')}`, W - 72, 72); ctx.textAlign = 'left'; for (let k = 0; k < 3; k++) heart(ctx, 820 + k * 72, 52, 18, '#FF4F7A');
    ctx.fillStyle = '#1B1B2F'; ctx.fillRect(0, 972, W, 108); const x1 = lerp(1700, 160, clamp(u)); ctx.strokeStyle = '#C9B48A'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(160, 1026); ctx.lineTo(x1, 1026); ctx.stroke();
    circ(ctx, 1780, 1026, 52, '#2A2A3A', 6); ctx.fillStyle = '#5A5A70'; ctx.fillRect(1742, 962, 30, 22); if (u < 1) { star(ctx, x1, 1026, 26 + 8 * Math.sin(t * 40), '#FFB020', t * 10); } };
  M.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); const sc = o.pop ? 1 + 0.35 * Math.exp(-o.pop * 8) * Math.cos(o.pop * 20) : 1; ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(o.rot || 0);
    ctx.font = M.F(size, o.fam || 'display'); ctx.textAlign = o.align || 'center'; ctx.lineJoin = 'round'; ctx.strokeStyle = OL; ctx.lineWidth = size * 0.15; ctx.strokeText(s, 0, 0); ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, 0, 0); ctx.restore(); };
  M.circ = circ; M.star = star; M.out = out; M.heart = heart;
  // a run of games of g beats each, starting at game index i0: draws the current one and the HUD
  M.run = (ctx, t, env, g, i0, level, score0) => { const gs = g * env.beatSec, i = Math.floor(env.lt / gs), u = (env.lt - i * gs) / gs; M.game(ctx, i0 + i, u, t, { speed: 4 / g });
    M.hud(ctx, level, score0 + 100 * i + (u > 0.75 ? 100 : 0), u, t); };
  window.MINI = M;
})();

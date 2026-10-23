// bus: the 여름잠 「파란 버스」 lyric-video kit (a project module). Flat summer illustration (a sky with a turning sun,
// drifting clouds, a sparkling sea, a coastal road with passing pines) and a blue city bus that bounces on the beat; a
// window view from inside the bus; a route map. The lyrics come from the sung cues: every `sing:<syllable>` cue in
// env.cues is one syllable, so the scene lays the line's letters out and pops each one, filled yellow, exactly when it
// is sung. Jua for the lyrics, Gowun Dodum for the small print.
(() => {
  const B = {}, TAU = Math.PI * 2;
  B.COL = { sky: '#6EC3F0', sky2: '#D3F0FF', sea: '#2F8FD8', sea2: '#1F6FB8', sand: '#F6E3B4', bus: '#2E6BE6', busD: '#1E4FB8', sun: '#FFD84D', pine: '#2F7D4A',
    pineD: '#1F5E36', road: '#565B68', ink: '#173A7A', fill: '#FFE15C', white: '#FFFFFF' };
  B.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  // ---- the coast ----------------------------------------------------------------------------------------------------
  B.sky = (ctx, t, hy = 600) => { const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, B.COL.sky); g.addColorStop(1, B.COL.sky2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, hy + 2); };
  B.sun = (ctx, x, y, r, t) => { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.25); ctx.fillStyle = 'rgba(255,240,170,0.45)'; for (let k = 0; k < 12; k++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(r * 1.15, -10); ctx.lineTo(r * 1.9, 0); ctx.lineTo(r * 1.15, 10); ctx.fill(); } ctx.restore();
    ctx.fillStyle = B.COL.sun; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.35, 0, TAU); ctx.fill(); };
  const cloud = (ctx, x, y, s) => { ctx.fillStyle = '#FFFFFF'; for (const [dx, dy, r] of [[-60, 10, 40], [-15, -15, 55], [40, 0, 45], [80, 15, 32], [0, 20, 40]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } };
  B.clouds = (ctx, t, v = 30) => { for (let i = 0; i < 6; i++) { const x = ((hash(i * 3) * 2600 - t * v * (0.6 + 0.4 * hash(i))) % 2600 + 2600) % 2600 - 300; cloud(ctx, x, 90 + hash(i * 5) * 260, 0.8 + 0.6 * hash(i * 7)); } };
  B.sea = (ctx, t, y0 = 600, y1 = 790, off = 0) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, B.COL.sea); g.addColorStop(1, B.COL.sea2); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0);
    ctx.fillStyle = '#4FA9E8'; for (let i = 0; i < 4; i++) { const ix = ((900 + i * 700 - off * 0.08) % 2800 + 2800) % 2800 - 400; ctx.beginPath(); ctx.ellipse(ix, y0, 160 + 60 * i % 3, 34, 0, Math.PI, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 40; i++) { const x = ((hash(i * 3) * W - off * 0.3) % W + W) % W, y = y0 + 12 + hash(i * 7) * (y1 - y0 - 24), tw = Math.sin(t * 4 + i * 2); if (tw > 0.3) ctx.fillRect(x, y, 18 + 20 * hash(i), 3); } };
  B.road = (ctx, off, y0 = 790) => { ctx.fillStyle = B.COL.sand; ctx.fillRect(0, y0, W, 40); ctx.fillStyle = B.COL.road; ctx.fillRect(0, y0 + 40, W, H - y0 - 40); ctx.fillStyle = '#F2F2F2';
    for (let x = -(off % 260); x < W; x += 260) ctx.fillRect(x, y0 + 150, 130, 10); };
  B.pines = (ctx, off, y0 = 830, s = 1, k = 1) => { for (let x = -(off * k % 520) - 100; x < W + 200; x += 520) { ctx.fillStyle = '#7A5A3A'; ctx.fillRect(x - 10 * s, y0 - 140 * s, 20 * s, 140 * s); ctx.fillStyle = B.COL.pine;
    for (const [dy, w] of [[-300, 90], [-240, 120], [-180, 140]]) { ctx.beginPath(); ctx.moveTo(x, y0 + dy * s - 60 * s); ctx.lineTo(x - w * s, y0 + dy * s + 40 * s); ctx.lineTo(x + w * s, y0 + dy * s + 40 * s); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = B.COL.pineD; ctx.beginPath(); ctx.moveTo(x, y0 - 360 * s); ctx.lineTo(x + 140 * s, y0 - 140 * s); ctx.lineTo(x, y0 - 160 * s); ctx.closePath(); ctx.fill(); } };
  // ---- the bus: side view facing right; bounce on the beat; four band members bob in the windows ---------------------
  B.bus = (ctx, x, y, s, t, beat, dist) => { const ph = (t / beat) % 1, bob = -Math.abs(Math.sin(Math.PI * ph)) * 8; ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 12 - bob / s, 470, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = B.COL.bus; rr(ctx, -460, -330, 920, 300, 46); ctx.fill(); ctx.fillStyle = B.COL.busD; rr(ctx, -460, -110, 920, 80, 30); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-460, -128, 920, 18);
    for (let k = 0; k < 5; k++) { const wx = -420 + k * 150; ctx.fillStyle = '#CDEBFF'; rr(ctx, wx, -300, 128, 140, 14); ctx.fill();
      if (k > 0) { const hb = Math.sin((t / beat) * Math.PI * 2 + k) * 5; ctx.fillStyle = ['#173A7A', '#5B3A8A', '#8A3A4A', '#2A5A3A'][k - 1]; ctx.beginPath(); ctx.arc(wx + 64, -210 + hb, 30, 0, TAU); ctx.fill(); rr(ctx, wx + 26, -180 + hb, 76, 30, 12); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.moveTo(wx + 10, -290); ctx.lineTo(wx + 50, -290); ctx.lineTo(wx + 10, -230); ctx.fill(); }
    ctx.fillStyle = '#CDEBFF'; rr(ctx, 330, -300, 110, 190, 14); ctx.fill();
    ctx.fillStyle = '#FFD84D'; ctx.fillRect(440, -120, 22, 30); ctx.fillStyle = '#FF5A5A'; ctx.fillRect(-462, -120, 14, 30);
    for (const wx of [-280, 290]) { ctx.fillStyle = '#20232B'; ctx.beginPath(); ctx.arc(wx, -30, 72, 0, TAU); ctx.fill(); ctx.fillStyle = '#C9CFDA'; ctx.beginPath(); ctx.arc(wx, -30, 34, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#7A808E'; ctx.lineWidth = 6; const a0 = dist / 72; for (let k = 0; k < 4; k++) { const a = a0 + k * TAU / 4; ctx.beginPath(); ctx.moveTo(wx, -30); ctx.lineTo(wx + Math.cos(a) * 30, -30 + Math.sin(a) * 30); ctx.stroke(); } }
    ctx.restore(); };
  // the destination sign on the bus roof: 여름행
  B.sign = (ctx, x, y, s, t, beat) => { const ph = (t / beat) % 1, bob = -Math.abs(Math.sin(Math.PI * ph)) * 8; ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s); ctx.fillStyle = '#10204A'; rr(ctx, -80, -380, 300, 54, 10); ctx.fill();
    ctx.fillStyle = '#FFB020'; ctx.font = B.F(40); ctx.fillText('여름행 7번', -60, -340); ctx.restore(); };
  // ---- inside the bus: the window frame, the coast streaming past, the curtain in the wind ----------------------------
  B.window = (ctx, t, off, open) => { ctx.save(); ctx.beginPath(); ctx.rect(260, 140, 1400, 700); ctx.clip(); B.sky(ctx, t, 560); B.clouds(ctx, t, 60); B.sun(ctx, 1450, 230, 70, t); B.sea(ctx, t, 560, 840, off * 3); B.pines(ctx, off * 4, 900, 0.9, 1); ctx.restore();
    ctx.fillStyle = '#F2EFE6'; ctx.fillRect(0, 0, W, 140); ctx.fillRect(0, 840, W, H - 840); ctx.fillRect(0, 0, 260, H); ctx.fillRect(1660, 0, W - 1660, H);
    ctx.strokeStyle = '#B9C0CC'; ctx.lineWidth = 26; ctx.strokeRect(260, 140, 1400, 700); const sx = lerp(960, 1640, open); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(sx, 140); ctx.lineTo(sx, 840); ctx.stroke();
    ctx.fillStyle = 'rgba(205,235,255,0.25)'; ctx.fillRect(sx, 140, 1660 - sx, 700);
    ctx.fillStyle = '#F4A64A'; ctx.beginPath(); ctx.moveTo(240, 120); for (let y = 120; y <= 860; y += 20) { const u = (y - 120) / 740, w = 120 + open * 140 * u + Math.sin(t * 9 + y * 0.02) * 26 * open * u; ctx.lineTo(240 + w, y); } ctx.lineTo(240, 860); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,90,30,0.4)'; ctx.lineWidth = 4; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(240 + k * 30, 120); ctx.quadraticCurveTo(250 + k * 34 + open * 60 * k / 3, 500, 240 + k * 40 + open * 100 * k / 3 + Math.sin(t * 9 + k) * 18 * open, 860); ctx.stroke(); }
    ctx.fillStyle = '#C94B4B'; rr(ctx, 120, 880, 1680, 200, 30); ctx.fill(); ctx.fillStyle = '#A83A3A'; rr(ctx, 120, 880, 1680, 30, 14); ctx.fill(); };
  // ---- the route map: a top-down coast, a dotted route, stops, the bus icon moving along it ---------------------------
  const ROUTE = [[180, 820], [420, 760], [620, 640], [820, 600], [1040, 520], [1260, 470], [1480, 380], [1720, 300]];
  B.route = (ctx, u, t) => { ctx.fillStyle = '#BFE6FF'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#F6E9C6'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, 900); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 900 - x * 0.36 + 30 * Math.sin(x / 140)); ctx.lineTo(W, H); ctx.fill();
    ctx.fillStyle = '#A8D98A'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, 960); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 960 - x * 0.36 + 30 * Math.sin(x / 140 + 0.5)); ctx.lineTo(W, H); ctx.fill();
    ctx.strokeStyle = '#2E6BE6'; ctx.lineWidth = 12; ctx.setLineDash([2, 26]); ctx.lineCap = 'round'; ctx.beginPath(); ROUTE.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1])); ctx.stroke(); ctx.setLineDash([]);
    ROUTE.forEach((p, i) => { if (i % 2 && i < ROUTE.length - 1) return; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(p[0], p[1], 20, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2E6BE6'; ctx.lineWidth = 8; ctx.stroke(); });
    const end = ROUTE[ROUTE.length - 1]; ctx.fillStyle = '#FF7A3D'; ctx.beginPath(); ctx.arc(end[0], end[1], 34 + 4 * Math.sin(t * 6), 0, TAU); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.font = B.F(34); ctx.textAlign = 'center'; ctx.fillText('여름', end[0], end[1] - 50); ctx.textAlign = 'left';
    const seg = clamp(u) * (ROUTE.length - 1), i = Math.min(ROUTE.length - 2, Math.floor(seg)), f = seg - i, p = [lerp(ROUTE[i][0], ROUTE[i + 1][0], f), lerp(ROUTE[i][1], ROUTE[i + 1][1], f)];
    ctx.save(); ctx.translate(p[0], p[1] - 30); ctx.fillStyle = B.COL.bus; rr(ctx, -50, -30, 100, 50, 12); ctx.fill(); ctx.fillStyle = '#CDEBFF'; for (let k = 0; k < 3; k++) { rr(ctx, -40 + k * 28, -22, 22, 18, 4); ctx.fill(); } ctx.fillStyle = '#20232B'; ctx.beginPath(); ctx.arc(-26, 22, 10, 0, TAU); ctx.arc(26, 22, 10, 0, TAU); ctx.fill(); ctx.restore(); };
  // ---- lyrics: the scene's lines, one syllable per sing cue ------------------------------------------------------
  B.sung = (env) => env.cues.filter(c => /^(sing|vox|voice|lyric):/.test(c.sfx)).map(c => ({ t: c.lt, s: c.sfx.split(/[: ]/)[1] })).sort((a, b) => a.t - b.t);
  // lines: ['파란 버스를 타고', ...]; draws the current line big at y, the next one small below; letters pop when sung
  B.lyrics = (ctx, env, lines, y = 300, o = {}) => { const sy = B.sung(env), lt = env.lt, out = []; let k = 0;
    for (const ln of lines) { const chars = [...ln].map(ch => ({ ch, t: ch.trim() && ch !== ',' ? (sy[k++] || { t: 1e9 }).t : null })); out.push(chars); }
    const starts = out.map(cs => Math.min(...cs.filter(c => c.t !== null).map(c => c.t))); let cur = 0; for (let i = 0; i < out.length; i++) if (lt >= starts[i] - 0.35) cur = i;
    const size = o.size || 120, draw = (cs, x0, yy, sz, base) => { ctx.font = B.F(sz); const ws = cs.map(c => ctx.measureText(c.ch).width), tw = ws.reduce((a, b) => a + b, 0); let x = x0 - tw / 2;
      cs.forEach((c, i) => { const ref = c.t !== null ? c.t : (cs.slice(0, i).reverse().find(d => d.t !== null) || { t: 1e9 }).t, d = lt - ref, on = d >= 0, pop = on ? 1 + 0.35 * Math.exp(-d * 9) * Math.cos(d * 18) : 1, lift = on ? -18 * Math.exp(-d * 10) : 0;
        ctx.save(); ctx.translate(x + ws[i] / 2, yy + lift); ctx.scale(pop, pop); ctx.globalAlpha = base; ctx.lineJoin = 'round'; ctx.strokeStyle = B.COL.ink; ctx.lineWidth = sz * 0.14; ctx.textAlign = 'center';
        ctx.strokeText(c.ch, 0, 0); ctx.fillStyle = on ? B.COL.fill : '#FFFFFF'; ctx.fillText(c.ch, 0, 0); ctx.restore(); x += ws[i]; }); };
    const a = clamp((lt - starts[cur] + 0.35) / 0.25); if (cur > 0 && lt < starts[cur] + 0.25) draw(out[cur - 1], W / 2, y - 40 * a, size, 1 - a);
    draw(out[cur], W / 2, y + 10 * (1 - a), size, a); if (cur + 1 < out.length) draw(out[cur + 1], W / 2, y + size * 0.95, size * 0.55, 0.85 * a); };
  B.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = B.F(size, o.fam || 'display'); ctx.textAlign = o.align || 'center'; ctx.lineJoin = 'round';
    ctx.strokeStyle = o.stroke || B.COL.ink; ctx.lineWidth = size * ((o.fam || 'display') === 'display' ? 0.14 : 0.1); ctx.strokeText(s, x, y + 12 * (1 - sm(a))); ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, x, y + 12 * (1 - sm(a))); ctx.restore(); };
  window.BUS = B;
})();

// tong: the 통통 악기 놀이 reel's marble-music kit (a project module). Rainbow mallet bars lie on a slope; balls fall
// and bounce from bar to bar. The notes come first: every hit is a cue in reel.config (`note:<instrument> deg=k bar=i
// ball=j`), so the music plays it and this module reads the same cues from env.cues, then solves each flight backwards
// as a parabola under fixed gravity that leaves one bar at one hit time and lands on the next at the next, exactly. A
// hit lights the bar, dips it and sends a ring and a note mark out. Jua for words.
(() => {
  const K = {}, TAU = Math.PI * 2, G = 3200, R = 24;
  K.COL = { bg: '#E6F4EE', bg2: '#D2EBE1', ink: '#264653', wood: '#C99A6B', frame: '#E9C9A0' };
  K.RAIN = ['#FF6B6B', '#FF9F43', '#FECA57', '#1DD1A1', '#48DBFB', '#54A0FF', '#5F27CD', '#FF6B9F'];
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  // bars: x, y (top centre), length, angle; a zigzag slope from upper left to lower right
  K.BARS = [[340, 420, 230, 0.18], [620, 520, 220, -0.16], [900, 610, 210, 0.16], [1170, 690, 200, -0.14], [1430, 770, 190, 0.14], [700, 860, 220, -0.12], [1000, 930, 210, 0.12], [1300, 980, 200, -0.1]];
  K.top = (i) => { const [x, y] = K.BARS[i]; return [x, y - R - 16]; };
  // the hits of one scene: [{ball, bar, t (local), deg}] parsed from env.cues
  K.hits = (env) => env.cues.filter(c => /^note:/.test(c.sfx) && /bar=/.test(c.sfx)).map(c => ({ t: c.lt, bar: +c.sfx.match(/bar=(\d+)/)[1], ball: +(c.sfx.match(/ball=(\d+)/) || [0, 0])[1], deg: +(c.sfx.match(/deg=(-?\d+)/) || [0, 0])[1] })).sort((a, b) => a.t - b.t);
  // a ball's position at lt from its hits: a fall onto the first, parabolas between hits, a last hop off the bottom
  K.ball = (hs, lt) => {
    if (!hs.length) return null; const p0 = K.top(hs[0].bar);
    if (lt < hs[0].t) { const tf = Math.sqrt(2 * (p0[1] + 80) / G), u = hs[0].t - lt; if (u > tf) return null; return [p0[0], p0[1] - 0.5 * G * u * u + 0 * u]; }
    for (let i = 0; i < hs.length - 1; i++) { const a = hs[i], b = hs[i + 1]; if (lt >= a.t && lt < b.t) { const [x0, y0] = K.top(a.bar), [x1, y1] = K.top(b.bar), T = b.t - a.t, u = lt - a.t;
      const vx = (x1 - x0) / T, vy = (y1 - y0 - 0.5 * G * T * T) / T; return [x0 + vx * u, y0 + vy * u + 0.5 * G * u * u]; } }
    const last = hs[hs.length - 1], [x0, y0] = K.top(last.bar), u = lt - last.t; return [x0 + 260 * u, y0 - 700 * u + 0.5 * G * u * u];
  };
  K.ground = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, K.COL.bg); g.addColorStop(1, K.COL.bg2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.fillStyle = 'rgba(38,70,83,0.05)'; for (let y = 30; y < H; y += 60) for (let x = 30 + ((y / 60) % 2) * 30; x < W; x += 60) { ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); } ctx.restore(); };
  // the bars, each lit and dipped by its recent hits
  K.bars = (ctx, hits, lt, o = {}) => { K.BARS.forEach(([x, y, L, a], i) => {
    const recent = hits.filter(h => h.bar === i && lt >= h.t).map(h => lt - h.t), d = recent.length ? Math.min(...recent) : 9, glow = Math.exp(-d * 6), dip = 8 * Math.exp(-d * 10) * Math.sin(d * 40);
    ctx.save(); ctx.translate(x, y + dip); ctx.rotate(a);
    ctx.fillStyle = 'rgba(38,70,83,0.18)'; rr(ctx, -L / 2 + 6, 10, L, 36, 18); ctx.fill();
    if (o.metal) { const g = ctx.createLinearGradient(0, -16, 0, 20); g.addColorStop(0, mix('#F4F7FA', '#FFFFFF', glow)); g.addColorStop(0.5, mix('#B8C3CE', '#FFFFFF', 0.5 * glow)); g.addColorStop(1, '#8794A2');
      ctx.fillStyle = g; rr(ctx, -L / 2, -16, L, 36, 18); ctx.fill(); ctx.fillStyle = K.RAIN[i]; rr(ctx, -L / 2 + 4, -12, 22, 28, 11); ctx.fill(); }
    else { ctx.fillStyle = mix(K.RAIN[i], '#FFFFFF', 0.45 * glow); rr(ctx, -L / 2, -16, L, 36, 18); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; rr(ctx, -L / 2 + 14, -12, L - 28, 8, 4); ctx.fill();
    ctx.fillStyle = 'rgba(38,70,83,0.35)'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * (L / 2 - 26), 2, 6, 0, TAU); ctx.fill(); }
    ctx.restore();
    if (d < 0.6) { ctx.save(); ctx.strokeStyle = K.RAIN[i]; ctx.lineWidth = 4; ctx.globalAlpha = 1 - d / 0.6; ctx.beginPath(); ctx.ellipse(x, y, 60 + d * 260, 20 + d * 80, a, 0, TAU); ctx.stroke();
      ctx.fillStyle = K.RAIN[i]; const nx = x + 30, ny = y - 70 - d * 160; ctx.beginPath(); ctx.ellipse(nx, ny, 16, 12, -0.4, 0, TAU); ctx.fill(); ctx.fillRect(nx + 12, ny - 52, 5, 52); ctx.restore(); } }); };
  K.marble = (ctx, p, col) => { if (!p) return; const [x, y] = p; const g = ctx.createRadialGradient(x - 8, y - 8, 2, x, y, R); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.35, col); g.addColorStop(1, mix(col, '#000000', 0.35));
    ctx.fillStyle = 'rgba(38,70,83,0.18)'; ctx.beginPath(); ctx.ellipse(x + 6, y + R + 6, R * 0.8, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill(); };
  // every ball of the scene: hits grouped by ball
  K.balls = (ctx, hits, lt, cols = ['#FF6B9F', '#54A0FF', '#FECA57']) => { const by = {}; hits.forEach(h => (by[h.ball] = by[h.ball] || []).push(h)); Object.entries(by).forEach(([b, hs]) => K.marble(ctx, K.ball(hs, lt), cols[b % cols.length])); };
  // the score: a staff card in the upper right where the scene's notes scroll in from the right and are played as they
  // cross the playhead, each note head in its bar's colour; the notes are there before the balls get to them
  K.staff = (ctx, hits, lt, o = {}) => { const x0 = o.x || 1080, y0 = o.y || 150, w = o.w || 720, sp = 24, bot = y0 + 70 + 4 * sp, px = x0 + 140, v = o.v || 300, a = o.a === undefined ? 1 : o.a;
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.fillStyle = 'rgba(255,255,255,0.72)'; rr(ctx, x0, y0, w, 250, 28); ctx.fill();
    ctx.strokeStyle = 'rgba(38,70,83,0.35)'; ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(x0 + 40, bot - k * sp); ctx.lineTo(x0 + w - 40, bot - k * sp); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,107,159,0.75)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px, y0 + 36); ctx.lineTo(px, y0 + 214); ctx.stroke();
    ctx.beginPath(); ctx.rect(x0 + 40, y0, w - 80, 250); ctx.clip();
    for (const h of hits) { const x = px + (h.t - lt) * v; if (x < x0 - 30 || x > x0 + w + 30) continue; const pos = h.deg - 2, y = bot - pos * sp / 2, d = lt - h.t, on = d >= 0, pop = on ? 1 + 0.5 * Math.exp(-d * 8) : 1;
      if (pos <= -2) { ctx.strokeStyle = 'rgba(38,70,83,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 24, bot + sp); ctx.lineTo(x + 24, bot + sp); ctx.stroke(); }
      ctx.fillStyle = on ? K.RAIN[h.bar] : K.COL.ink; ctx.globalAlpha = clamp(a) * (on ? Math.max(0.35, Math.exp(-d * 1.5)) : 0.85);
      ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop); ctx.beginPath(); ctx.ellipse(0, 0, 15, 11, -0.4, 0, TAU); ctx.fill(); ctx.fillRect(pos >= 4 ? -15 : 11, pos >= 4 ? 0 : -60, 4, 60); ctx.restore(); }
    ctx.restore(); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display'); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 10 * (1 - clamp(a))); ctx.restore(); };
  window.TONG = K;
})();

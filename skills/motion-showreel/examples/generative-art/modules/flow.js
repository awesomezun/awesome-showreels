// flow: the 흐름의 지도 reel's kit (a project module). Thousands of particles ride a time-varying flow field and draw
// their trails additively. Nothing is simulated frame to frame: each particle is born on its own clock, at a seeded
// place, and is integrated from its birth to now, so any frame can be drawn on its own (stills, seeking, export).
// Particles can be pulled onto the points of a line of text (gather), pushed round a visitor, or given a field per
// room (wind, water, light). Text is Hahmlet.
(() => {
  const K = {}, COL = { bg: '#06070C', ink: '#F2F4F8', ink2: '#AEB6C6' };
  K.COL = COL;
  K.PAL = { drift: ['#7FA8FF', '#B9A7FF', '#8FE3E8', '#F2F4F8'], wind: ['#6FA8FF', '#A8C8FF', '#E0ECFF'], water: ['#2EC4B6', '#8FE3E8', '#3A86A8', '#D8F8F2'], light: ['#FFD27A', '#FFB347', '#FFF1C9', '#FF8A5C'] };
  // the fields: a direction (radians) at (x, y) and time t
  const F = {
    drift: (x, y, t) => Math.sin(x * 0.0021 + t * 0.21) * 1.6 + Math.cos(y * 0.0027 - t * 0.17) * 1.6 + Math.sin((x + y) * 0.0011 + t * 0.09),
    wind: (x, y, t) => 0.35 * Math.sin(y * 0.006 + t * 0.6 + Math.sin(x * 0.002 + t * 0.3) * 2),
    water: (x, y, t) => { const cx = W / 2 + Math.sin(t * 0.3) * 160, cy = H / 2, a = Math.atan2(y - cy, x - cx); return a + Math.PI / 2 + 0.35 + 0.5 * Math.sin(Math.hypot(x - cx, y - cy) * 0.012 - t * 0.8); },
    light: (x, y, t) => { const a = Math.atan2(y - H / 2, x - W / 2); return a + 0.25 * Math.sin(a * 6 + t * 0.7) + 0.15 * Math.sin(Math.hypot(x - W / 2, y - H / 2) * 0.02 - t); },
  };
  K.F = F;
  // text -> points (cached): sampled from the glyphs on a grid
  const cache = {};
  K.textPoints = (s, x, y, size, step = 7, o = {}) => { const key = [s, x, y, size, step, o.align].join('|'); if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true });
    g.font = `${o.w ?? 300} ${size}px ${FAM.display}`; g.textAlign = o.align || 'left'; g.fillStyle = '#fff'; g.fillText(s, x, y);
    const d = g.getImageData(0, 0, W, H).data, pts = [];
    for (let j = 0; j < H; j += step) for (let i = 0; i < W; i += step) if (d[(j * W + i) * 4 + 3] > 128) pts.push([i, j]);
    for (let i = pts.length - 1; i > 0; i--) { const k = Math.floor(hash(i * 1.37) * (i + 1)); [pts[i], pts[k]] = [pts[k], pts[i]]; }
    return (cache[key] = pts); };
  // draw the particles: o = {n, life, kind (or fn), pal, speed, width, seed, alpha, spawn: (i) => [x, y], target, gather, avoid: {x, y, r}, trail}
  K.flow = (ctx, t, o = {}) => {
    const n = o.n ?? 2200, life = o.life ?? 2.6, fld = typeof o.kind === 'function' ? o.kind : F[o.kind || 'drift'], pal = o.pal || K.PAL.drift, sp = o.speed ?? 90, dt = 1 / 30, trail = o.trail ?? 10, seed = o.seed ?? 1;
    const T = o.target, gather = o.gather ?? 0, av = o.avoid;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineWidth = o.width ?? 1.6;
    for (let i = 0; i < n; i++) {
      const L = life * (0.7 + 0.6 * hash(i * 3.17 + seed)), age = (t + hash(i * 7.31 + seed) * L) % L, born = t - age, cyc = Math.floor((t + hash(i * 7.31 + seed) * L) / L);
      let x, y; if (o.spawn) [x, y] = o.spawn(i, cyc); else { x = hash(i * 1.9 + cyc * 13.7 + seed) * (W + 200) - 100; y = hash(i * 5.3 + cyc * 3.1 + seed) * (H + 200) - 100; }
      const steps = Math.floor(age / dt), pts = [];
      for (let k = 0; k <= steps; k++) {
        if (k > 0) { const tk = born + k * dt; let a = fld(x, y, tk); let vx = Math.cos(a) * sp * dt, vy = Math.sin(a) * sp * dt;
          if (av) { const dx = x - av.x, dy = y - av.y, d = Math.hypot(dx, dy) + 1e-3; if (d < av.r * 1.6) { const push = (1 - d / (av.r * 1.6)) * sp * dt * 2.2; vx += dx / d * push; vy += dy / d * push; } }
          x += vx; y += vy; }
        if (k >= steps - trail) pts.push([x, y]); }
      let tx = 0, ty = 0; if (T && gather > 0 && T.length) { const p = T[i % T.length]; tx = p[0] + Math.sin(t * 1.3 + i) * 1.5; ty = p[1] + Math.cos(t * 1.1 + i) * 1.5; }
      const inT = T && i < T.length, env = Math.sin(Math.PI * clamp(age / L)), al = (o.alpha ?? 0.5) * (inT ? lerp(env, 1.4, gather) : env * (1 - 0.6 * gather));
      if (al <= 0.01 || pts.length < 2) continue;
      ctx.strokeStyle = pal[i % pal.length]; ctx.globalAlpha = al; ctx.beginPath();
      // gathered: the trail keeps its shape (the flow's direction) but shrinks onto the particle's letter point
      const g = T && gather > 0 && i < T.length ? gather : 0, [lx, ly] = pts[pts.length - 1], sh = 1 - 0.88 * g;
      pts.forEach(([px, py], k) => { const X = lerp(px, tx + (px - lx) * sh, g), Y = lerp(py, ty + (py - ly) * sh, g); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.stroke();
    }
    ctx.restore();
  };
  K.bg = (ctx, o = {}) => { const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 1700); g.addColorStop(0, o.c0 || '#0D1020'); g.addColorStop(1, COL.bg); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  K.f = (size, w = 400) => `${w} ${size}px ${FAM.display}`;
  // a line that fades up with its letter-spacing closing in
  K.line = (ctx, s, x, y, size, lt, o = {}) => { const p = Ease.outC(clamp((lt - (o.at ?? 0)) / (o.dur ?? 1.2))), q = o.out != null ? 1 - clamp((lt - o.out) / 0.6) : 1; if (p <= 0 || q <= 0) return;
    ctx.save(); ctx.font = K.f(size, o.w ?? 400); ctx.textAlign = o.align || 'left'; ctx.letterSpacing = `${lerp(size * 0.25, o.track ?? size * 0.02, p)}px`; ctx.globalAlpha *= p * q * (o.alpha ?? 1);
    ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  window.FLOW = K;
})();

// hook (1 bar, 2 in the 30-second cut): a warm spotlight on dark wood: 소리상회, 1925 — 2025; 백 년 동안,
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const E = ERA, lt = env.lt, B = env.beatSec; ctx.fillStyle = '#1E160E'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(255,255,255,0.03)'; for (let x = 0; x < W; x += 120) ctx.fillRect(x, 0, 3, H);
      const g = ctx.createRadialGradient(W / 2, 420, 40, W / 2, 420, 760 + 40 * Math.sin(t * 2)); g.addColorStop(0, 'rgba(255,214,150,0.45)'); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      E.text(ctx, '소리상회', W / 2, 520, 230, (lt - 0.1) / 0.35, { fam: 'serif', color: '#F2DCB0' }); E.text(ctx, '1925 — 2025', W / 2, 640, 64, (lt - 0.5 * B) / (0.4 * B), { color: '#C9A87A', w: 600 });
      E.text(ctx, '백 년 동안,', W / 2, 800, 76, (lt - 2 * B) / (0.5 * B), { fam: 'serif', color: '#F2DCB0' }); E.surface(ctx, 1925, t);
    },
  };
})();

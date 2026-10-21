// hook (2 bars): a pastel oven on a clay table; a loaf hops out of its mouth, lands with a squash, blinks and steams;
// 동네 빵 배달, then 말랑베이커리 squishes in letter by letter. Time steps at 12 frames a second, like stop motion.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = CLAY, lt = env.lt, st = K.step(lt), C = K.COL; K.boil(lt);
      K.bg(ctx);
      K.rrect(ctx, 1080, 250, 600, 560, 70, C.sky, { seed: 11 });
      K.rrect(ctx, 1160, 360, 440, 230, 50, '#3A2A3A', { seed: 12, shadow: false });
      ctx.save(); const g = ctx.createRadialGradient(1380, 500, 0, 1380, 500, 220); g.addColorStop(0, 'rgba(255,170,80,0.75)'); g.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = g; ctx.fillRect(1160, 360, 440, 230); ctx.restore();
      for (const x of [1200, 1290]) K.ell(ctx, x, 690, 26, 26, '#F6D365', { seed: x });
      const k = clamp((st - 0.6) / 0.9), lx = lerp(1380, 820, k), ly = k < 1 ? lerp(560, 820, k) - 260 * Math.sin(Math.PI * k) : 820, land = st - 1.5, sq = k < 1 ? -0.25 * Math.sin(Math.PI * k) : 0.5 * Math.exp(-land * 5) * Math.cos(land * 14);
      if (st > 0.55) K.loaf(ctx, lx, ly, 1.1, st, 'milk', { sq, open: k > 0 && k < 1 });
      if (land > 0) K.steam(ctx, 820, 600, lt, clamp(land / 0.4));
      K.small(ctx, '동네 빵 배달', 140, 250, 120, { a: clamp((lt - 0.2) / 0.3), color: C.coral });
      K.title(ctx, '말랑베이커리', 130, 420, 150, st, { at: 1.6, step: 0.07 });
    },
  };
})();

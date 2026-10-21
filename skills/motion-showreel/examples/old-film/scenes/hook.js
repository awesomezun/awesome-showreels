// hook (2 bars): the leader counts 3, 2, 1 on the beats with its sweeping wedge, a white flash, then the first
// intertitle: 동명극장 / 재개관 / 1962 – 2026. The film weaves, flickers and crawls with grain throughout.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = REEL8, lt = env.lt, B = env.beatSec, C = K.COL;
      ctx.save(); K.weave(ctx, lt);
      if (lt < 3 * B) { const n = 3 - Math.floor(lt / B), p = (lt % B) / B; K.leader(ctx, n, p); }
      else K.card(ctx, [['동명극장', 200, C.cream], ['재개관', 96, C.warm], ['1962 – 2026', 56, '#BFAF90']]);
      ctx.restore();
      if (lt >= 3 * B && lt < 3 * B + 0.12) { ctx.fillStyle = 'rgba(255,250,235,0.85)'; ctx.fillRect(0, 0, W, H); }
      K.film(ctx, lt);
    },
  };
})();

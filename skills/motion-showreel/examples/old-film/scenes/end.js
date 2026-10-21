// end (2-3 bars): the last intertitle: 동명극장, the reopening date, the fiction label; the film runs on.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = REEL8, lt = env.lt, C = K.COL;
      ctx.save(); K.weave(ctx, lt); K.card(ctx, [['동명극장', 190, C.cream], ['2026년 11월 1일 재개관', 72, C.warm], ['가상의 극장 · 예제', 46, '#9A8C72', clamp((lt - 0.4) / 0.4)]]); ctx.restore();
      K.film(ctx, lt);
    },
  };
})();

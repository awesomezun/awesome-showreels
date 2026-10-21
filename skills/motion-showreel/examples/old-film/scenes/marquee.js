// marquee (4-5 bars): the core message. The theatre front at night: the name lights up letter by letter in bulbs,
// the bulbs round the board follow and then chase; under it, as a subtitle band, 1962년의 불이 다시 켜집니다.
(() => {
  SCENES['marquee'] = {
    draw(ctx, t, env) {
      const K = REEL8, lt = env.lt, C = K.COL;
      ctx.save(); K.weave(ctx, lt); const z = 1 + 0.02 * lt / env.dur; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      K.front(ctx, lt, clamp((lt - 0.3) / 1.6));
      ctx.restore();
      const a = clamp((lt - 1.9) / 0.4); ctx.fillStyle = `rgba(10,7,4,${0.8 * a})`; ctx.fillRect(0, 880, W, 170);
      K.text(ctx, '1962년의 불이', W / 2 - 40, 990, 84, { a, align: 'right', color: C.warm });
      K.text(ctx, '다시 켜집니다.', W / 2 + 0, 990, 84, { a: clamp((lt - 2.5) / 0.4), align: 'left' });
      K.film(ctx, lt);
    },
  };
})();

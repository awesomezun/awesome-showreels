// stand (30-second cut, 2 bars): ④ 세워서 완성: books, a plant and a cup appear on the shelves; the person steps back
// with a heart over its head.
(() => {
  SCENES['stand'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec;
      K.ground(ctx);
      K.shelf(ctx, K.O, {}); K.things(ctx, (lt - 0.4) / 0.4, lt);
      K.step(ctx, 4, 220, 300, lt / 0.25); K.text(ctx, '세워서 완성', 300, 320, 52, (lt - 0.2) / 0.25, { w: 800 });
      K.person(ctx, lerp(1690, 1740, Ease.outC(clamp(lt / 0.8))), 960, 1.0, lt, { arm: 0, heart: Ease.outBack(clamp((lt - 2 * B) / 0.3), 2) });
    },
  };
})();

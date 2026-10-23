// hook (2 bars): close on deep navy paper, a fountain pen draws one gold line: a nib with its slit and breather hole,
// a small curl, then out through the top into cursive loops; the camera rides just behind the pen. 이음 만년필.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = ONE, lt = env.lt, c = K.MARK.loops * Ease.ioQ(rm(lt, 0.3, 4.9));
      K.ground(ctx);
      const cam = K.cam(c, 1.3, { lag: 420 });
      const tip = K.draw(ctx, c, cam);
      K.pen(ctx, tip, 1, lt);
      K.text(ctx, '만년필 · 금빛 강철 펜촉', 140, 880, 40, (lt - 3.2) / 0.5, { fam: 'sans', w: 400 });
      K.text(ctx, '이음 만년필', 136, 990, 104, (lt - 3.6) / 0.5);
    },
  };
})();

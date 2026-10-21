// end (2 bars, 30-s cut): the night side under the limb, cities lit, stars; the date card, then the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = ORBIT, T3 = K.T3, lt = env.lt, C = K.COL;
      const cam = T3.camera([0, 0.5, 6], [1.5 - 0.3 * lt, -3.2, -24], 0.6);
      const sun = K.sunDir(0.05, -0.33);
      K.earth(ctx, cam, { sun, time: lt, spin: 1.7 + lt * 0.01, stars: 1.2 });
      K.bars(ctx);
      K.card(ctx, '2027년 봄', W / 2, 430, 72, lt, { at: 0.2, w: 700 });
      K.card(ctx, '극장에서 만납니다', W / 2, 530, 52, lt, { at: 0.7, color: C.ink2 });
      K.card(ctx, '가상의 작품 · 예제', W / 2, H - 52, 40, lt, { at: 1.0, color: C.ink2, track: 4 });
    },
  };
})();

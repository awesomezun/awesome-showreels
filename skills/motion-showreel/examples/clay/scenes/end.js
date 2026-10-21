// end (2-3 bars): the three loaves in a row, swaying and blinking; 말랑베이커리, 앱에서 주문하세요, the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = CLAY, lt = env.lt, st = K.step(lt), C = K.COL; K.boil(lt);
      K.bg(ctx, { ty: 800 });
      ['salt', 'milk', 'red'].forEach((k, i) => K.loaf(ctx, 1000 + i * 340, 860, 1.25, st + i, k, { sq: 0.12 * Math.sin(st * 5 + i * 1.3), rot: 0.05 * Math.sin(st * 3 + i) }));
      K.title(ctx, '말랑베이커리', 120, 360, 150, st, { at: 0.1, step: 0.06 });
      K.small(ctx, '앱에서 주문하세요', 130, 500, 130, { a: clamp((lt - 0.6) / 0.3), color: C.coral });
      K.small(ctx, '가상의 가게 · 예제', 130, 600, 96, { a: clamp((lt - 0.9) / 0.3), color: '#9A7A62' });
    },
  };
})();

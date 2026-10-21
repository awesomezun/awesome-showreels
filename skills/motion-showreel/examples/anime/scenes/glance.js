// glance (3 bars, 30-s cut): looking up: clouds drift past the sun, a gust carries a stream of petals across the sky
// and the wires; 그 3분이 / 우리의 전부였다.
(() => {
  SCENES['glance'] = {
    draw(ctx, t, env) {
      const K = HARU, lt = env.lt;
      K.sky(ctx, -300, H + 300);
      K.cloud(ctx, 400 + lt * 30, 700, 1.8, 31); K.cloud(ctx, 1500 + lt * 22, 820, 1.4, 33); K.cloud(ctx, 1000 + lt * 40, 560, 0.8, 35, { a: 0.85 });
      K.sun(ctx, 1720, 200, lt, 1);
      K.wires(ctx, 120, -200);
      K.petals(ctx, lt, { n: 120, wind: 520, size: 1.6 });
      K.line(ctx, '그 3분이', W / 2, 250, 120, lt, { at: 0.4, align: 'center' });
      K.line(ctx, '우리의 전부였다', W / 2, 400, 120, lt, { at: 1.3, align: 'center', color: '#FFE4EE' });
    },
  };
})();

// bus (2 bars, 30-s cut): the bus finally pulls in from the right and stops in front of the shelter; the gust of its
// arrival lifts the petals; 매주 토요일 연재.
(() => {
  SCENES['bus'] = {
    draw(ctx, t, env) {
      const K = HARU, lt = env.lt, bx = lerp(W + 1300, 1500, Ease.outC(clamp(lt / 1.6)));
      K.sky(ctx, 0, 900); K.cloud(ctx, 1100 + lt * 8, 240, 1.0, 41); K.sun(ctx, 1700, 120, lt, 0.8); K.wires(ctx, 1840, 40); K.street(ctx, 820);
      K.tree(ctx, 1600, 900, 1.0, lt); K.stop(ctx, 860, 960, lt, { text: '도착' }); K.pair(ctx, 1030, 830, 1.0, lt);
      K.bus(ctx, bx, 1000, 1.0);
      K.petals(ctx, lt, { n: 90, wind: lt < 1.6 ? -500 : 140, size: 1.2 });
      K.line(ctx, '매주 토요일 연재', 110, 250, 110, lt, { at: 1.0 });
    },
  };
})();

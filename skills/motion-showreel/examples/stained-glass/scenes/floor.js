// floor (1 bar; 2 in the 30-second cut): the room from further back: the window high on the wall, shafts of light with
// dust drifting in them, and the window lying on the stone floor as coloured light that slides as the sun moves;
// 오전 10시, 바닥 위의 정원.
(() => {
  SCENES['floor'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, drift = lt * 26;
      K.wall(ctx); K.floor(ctx, 640);
      K.window(ctx, 170, 50, 0.5, { band: 300 + lt * 120, tint: '#FFF4E0' });
      K.floorLight(ctx, 760 + drift, 660, 1.05, 0.4, 0.75, 0.55, { blur: 9, tint: '#FFF4E0' });
      K.shafts(ctx, [[175, 520], [545, 520]], [[760 + drift + 0.75 * 0 * 0.4, 680], [760 + drift + 1.05 * 760 + 0.75 * 940 * 0.4, 1040]], 1, lt);
      K.text(ctx, '오전 10시,', 1140, 240, 64, (lt - 0.3) / 0.5, { fam: 'sans', w: 700 });
      K.text(ctx, '바닥 위의 정원', 1140, 330, 64, (lt - 0.6) / 0.5, { fam: 'sans', w: 700, color: '#F6D58A' });
    },
  };
})();

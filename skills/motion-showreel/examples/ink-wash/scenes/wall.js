// wall (2-3 bars): the core message. The scroll unrolls to the left: ranges pass at their own depths, mist drifts,
// the wall keeps painting itself ahead along the near ridge with three tiny walkers on it, pines go by;
// 먹빛 성곽을 따라, / 하루.
(() => {
  SCENES['wall'] = {
    draw(ctx, t, env) {
      const K = MEOK, lt = env.lt, cam = 300 + lt * 160;
      K.paper(ctx);
      K.range(ctx, 3, 600, 260, cam, 0.25, 0.2, { blur: 9 });
      K.range(ctx, 4, 760, 300, cam, 0.55, 0.4, { blur: 6 });
      K.mist(ctx, 680, lt + 20, 0.75);
      K.range(ctx, 5, 1040, 380, cam, 1, 0.72, { blur: 3 });
      const pts = K.wall(ctx, 5, 1040, 380, cam, 1, -40, 1960, 1);
      K.walkers(ctx, pts, 0.3 + 0.08 * lt / env.dur, lt);
      for (const px of [400, 1300, 2100]) { const sx = ((px - cam) % 2400 + 2400) % 2400 - 200; K.pine(ctx, sx, K.ridge(sx + cam, 5, 1040, 380) + 60, 1.0, 1); }
      K.brush(ctx, '먹빛 성곽을 따라,', 120, 300, 130, lt, { at: 0.3, dur: 1.2 });
      K.brush(ctx, '하루.', 130, 540, 220, lt, { at: 1.6, dur: 0.8 });
    },
  };
})();

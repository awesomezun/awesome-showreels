// village (30-second cut, 2 bars): the print of the village at dusk is cut: the red sun low behind the ranges, the
// sky, pines, the brewery's tiled roof and its chimney smoke drifting; 백 년째, 같은 자리 in the paper margin above.
(() => {
  SCENES['village'] = {
    draw(ctx, t, env) {
      const K = PAN, lt = env.lt;
      ctx.save(); K.push(ctx, lt, env.dur, 0.03);
      K.paper(ctx);
      const r = K.redBegin(), g = K.begin();
      K.village(g, r, lt, { x0: 140, y0: 240, w: W - 280, h: 760, t0: 0.1 });
      K.redEnd(ctx, 1);
      K.printText(g, '백 년째, 같은 자리', 140, 190, 92, (lt - 0.3) / 0.4);
      K.end(ctx);
      K.border(ctx, 136, 236, W - 272, 768);
      ctx.restore();
    },
  };
})();

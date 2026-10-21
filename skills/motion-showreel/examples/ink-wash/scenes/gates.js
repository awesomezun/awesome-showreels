// gates (3 bars, 30-s cut): along the way, the great gates: each pavilion washes in on the ridge as the scroll moves,
// its name written beside it (숭례문, 흥인지문, 숙정문, 창의문); 성문 네 곳을 지나요.
(() => {
  const G = [['숭례문', 600], ['흥인지문', 1250], ['숙정문', 1900], ['창의문', 2550]];
  SCENES['gates'] = {
    draw(ctx, t, env) {
      const K = MEOK, lt = env.lt, cam = lt * 300;
      K.paper(ctx);
      K.range(ctx, 6, 620, 240, cam, 0.3, 0.2, { blur: 9 }); K.mist(ctx, 640, lt + 40, 0.7);
      K.range(ctx, 7, 1000, 300, cam, 1, 0.62, { blur: 3 });
      K.wall(ctx, 7, 1000, 300, cam, 1, -40, 1960, 1, { w: 18 });
      G.forEach(([name, wx], i) => { const sx = wx - cam + 700; if (sx < -300 || sx > W + 300) return; const gy = K.ridge(sx + cam, 7, 1000, 300) + 30, a = clamp((lt - i * 1.45) / 0.6);
        K.gate(ctx, sx, gy, 0.9, a); K.label(ctx, name, sx + 150, gy - 300, 54, { a, color: 'rgba(22,19,15,0.9)' }); });
      K.brush(ctx, '성문 네 곳을 지나요', 120, 240, 110, lt, { at: 0.2, dur: 1.2 });
    },
  };
})();

// solid (1-2 bars): the chrome cap comes down onto the neck and lands with weight (a short settle); the camera is low
// and close; 단단한 잔향. in chrome, its sheen passing as the cap lands.
(() => {
  SCENES['solid'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, C = K.COL;
      const cam = K.orbit(0.42 - 0.05 * lt, 0.02 + 0.02 * lt, 2.35 + 0.08 * lt, [0, 0.62, 0], 0.5, { cx: W * 0.68 });
      K.studio(ctx, cam, { glow: 'rgba(190,200,225,0.22)' });
      K.lines(ctx, cam, 0.8);
      const k = clamp(lt / 0.75), capY = k < 1 ? 0.55 * (1 - Ease.inC(k)) : 0.012 * Math.exp(-(lt - 0.75) * 9) * Math.sin((lt - 0.75) * 40);
      K.bottle(ctx, cam, { rot: 0.35 + 0.1 * lt, capY, light: lerp(-0.9, 0.7, clamp(lt / 2)), time: lt, level: 0.56, slosh: lt > 0.75 ? 0.06 * Math.exp(-(lt - 0.75) * 2) : 0 });
      const p = Ease.outC(clamp((lt - 0.55) / 0.6));
      K.chrome(ctx, '단단한', 140, 500 + 24 * (1 - p), 150, { alpha: p, sheen: rm(lt, 0.75, 2.0) });
      K.chrome(ctx, '잔향.', 140, 680 + 24 * (1 - p), 150, { alpha: p, sheen: rm(lt, 0.85, 2.1) });
    },
  };
})();

// hook (2 bars): bare rice paper; the far ranges bleed in as washes, the near ridge darkens, and the fortress wall
// paints itself along it with its parapet ticks; 한양도성 걷기 투어, then 도성 한 바퀴 brushed in; the red seal lands.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = MEOK, lt = env.lt, cam = lt * 30;
      K.paper(ctx);
      K.range(ctx, 0, 640, 300, cam, 0.3, 0.22, { a: clamp((lt - 0.1) / 0.8), blur: lerp(24, 8, clamp(lt / 1.2)) });
      K.range(ctx, 1, 780, 330, cam, 0.6, 0.42, { a: clamp((lt - 0.5) / 0.8), blur: lerp(20, 5, clamp((lt - 0.4) / 1.2)) });
      K.mist(ctx, 700, lt, 0.7);
      K.range(ctx, 2, 1020, 360, cam, 1, 0.75, { a: clamp((lt - 0.9) / 0.6), blur: lerp(16, 3, clamp((lt - 0.8) / 1.0)) });
      K.wall(ctx, 2, 1020, 360, cam, 1, 560, 1980, Ease.ioC(clamp((lt - 1.3) / 2.2)));
      K.pine(ctx, 1620, 860, 1.1, clamp((lt - 2.2) / 0.8));
      K.label(ctx, '한양도성 걷기 투어', 140, 190, 50, { a: clamp((lt - 0.3) / 0.5) });
      K.brush(ctx, '도성 한 바퀴', 120, 400, 200, lt, { at: 0.8, dur: 1.4 });
      K.seal(ctx, 120 + K.brushWidth(ctx, '도성 한 바퀴', 200) + 80, 340, 110, '도성', (lt - 3.2) / 0.25);
    },
  };
})();

// hook (2 bars): the dark studio; a long strip of light sweeps across and finds the bottle turning slowly; on the left,
// 오 드 퍼퓸, then 글래스 노트 in chrome and No.3.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, C = K.COL;
      const cam = K.orbit(0.12 - 0.1 * lt / 5, 0.12, 3.3 - 0.15 * lt / 5, [0, 0.5, 0], 0.5, { cx: W * 0.68 });
      K.studio(ctx, cam);
      K.lines(ctx, cam, clamp(lt / 1.2));
      K.bottle(ctx, cam, { rot: -0.55 + 0.16 * lt, light: lerp(-1.7, 1.1, Ease.ioSine(clamp(lt / 4))), time: lt, show: clamp(lt / 0.6), level: 0.55, slosh: 0.02 });
      K.fade(ctx, '오 드 퍼퓸', 150, 400, 44, lt, { at: 0.3, color: C.ink2, w: 700, track: 10 });
      const p = Ease.outC(clamp((lt - 0.6) / 1.0));
      K.chrome(ctx, '글래스 노트', 140, 580 + 30 * (1 - p), 156, { alpha: p, sheen: rm(lt, 1.2, 3.2) });
      K.chrome(ctx, 'No.3', 146, 720 + 30 * (1 - Ease.outC(clamp((lt - 1.1) / 1.0))), 96, { alpha: Ease.outC(clamp((lt - 1.1) / 1.0)), sheen: rm(lt, 1.8, 3.8) });
    },
  };
})();

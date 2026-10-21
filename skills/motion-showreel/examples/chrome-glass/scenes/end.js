// end (1-2 bars): the bottle whole, capped, turning under the sweeping strip; 글래스 노트 No.3 in chrome, 오 드 퍼퓸 50ml
// and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, C = K.COL;
      const cam = K.orbit(-0.1 + 0.05 * lt, 0.1, 3.1 + 0.08 * lt, [0, 0.52, 0], 0.5, { cx: W * 0.68 });
      K.studio(ctx, cam);
      K.lines(ctx, cam, 1);
      K.bottle(ctx, cam, { rot: -0.2 + 0.18 * lt, light: lerp(-1.2, 1.2, clamp(lt / env.dur)), time: lt, level: 0.56, slosh: 0.01 });
      const p = Ease.outC(clamp(lt / 0.7));
      K.chrome(ctx, '글래스 노트', 140, 540 + 20 * (1 - p), 140, { alpha: p, sheen: rm(lt, 0.2, 1.6) });
      K.chrome(ctx, 'No.3', 146, 668 + 20 * (1 - p), 86, { alpha: p, sheen: rm(lt, 0.4, 1.8) });
      K.fade(ctx, '오 드 퍼퓸 · 50ml', 150, 780, 44, lt, { at: 0.3, color: C.ink2, w: 700, track: 6 });
      K.fade(ctx, '가상의 제품 · 예제', 150, 850, 40, lt, { at: 0.5, color: 'rgba(195,202,214,0.75)', w: 700 });
    },
  };
})();

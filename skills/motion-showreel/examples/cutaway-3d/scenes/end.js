// end (2 bars): the casing slides shut again and the camera pulls back to the whole machine on its stage; 브루큐브,
// 집에서 볶는 12분 and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = BREW, T3 = K.T3, lt = env.lt, C = K.COL;
      const yaw = 0.75 - 0.25 * Ease.ioC(clamp(lt / 2)) - 0.04 * lt, d = 3.5 - 0.06 * lt;
      const cam = T3.camera([Math.sin(yaw) * d, 1.5, Math.cos(yaw) * d], [0, 0.55, 0], 0.62, { cx: W * 0.66 });
      K.stage(ctx, cam);
      const s = { open: 1 - Ease.ioC(rm(lt, 0.1, 0.9)), drum: lt * 2, fan: lt * 6, arm: lt, heat: 0.3 };
      T3.render(ctx, cam, K.faces(s), { light: [-0.5, 0.9, 0.7], amb: 0.36, spec: 0.3 });
      K.display(ctx, cam, s, '220°C', clamp((lt - 0.9) * 3));
      K.rise(ctx, '브루큐브', 140, 500, 190, lt, { at: 0.1 });
      K.rise(ctx, '집에서 볶는 12분', 150, 610, 64, lt, { at: 0.4, color: C.trim, w: 800 });
      K.rise(ctx, '가상의 제품 · 예제', 150, 700, 40, lt, { at: 0.7, color: C.ink2, w: 600 });
    },
  };
})();

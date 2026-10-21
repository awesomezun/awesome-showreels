// hook (2 bars): the machine under one spotlight on a dark stage, turning slowly; its display counts up to 220°C;
// on the left, 가정용 원두 로스터, 브루큐브 and 집에서 볶는 커피.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = BREW, T3 = K.T3, lt = env.lt, C = K.COL;
      const yaw = 0.35 + 0.35 * Ease.ioSine(clamp(lt / 4.3)), d = 3.6 - 0.3 * clamp(lt / 4.3);
      const cam = T3.camera([Math.sin(yaw) * d, 1.55, Math.cos(yaw) * d], [0, 0.55, 0], 0.62, { cx: W * 0.64 });
      K.stage(ctx, cam);
      const s = { open: 0, drum: lt * 2, fan: lt * 6, arm: lt, heat: 0.3 };
      ctx.save(); ctx.globalAlpha *= clamp(lt / 0.5); T3.render(ctx, cam, K.faces(s), { light: [-0.5, 0.9, 0.7], amb: 0.36, spec: 0.3 }); ctx.restore();
      K.display(ctx, cam, s, Math.round(lerp(20, 220, Ease.outC(rm(lt, 0.4, 2.4)))) + '°C', clamp((lt - 0.3) * 3));
      K.rise(ctx, '가정용 원두 로스터', 150, 360, 54, lt, { at: 0.15, color: C.trim, w: 800 });
      K.rise(ctx, '브루큐브', 140, 540, 190, lt, { at: 0.35 });
      K.rise(ctx, '집에서 볶는 커피', 150, 650, 60, lt, { at: 0.9, color: C.ink2, w: 700 });
    },
  };
})();

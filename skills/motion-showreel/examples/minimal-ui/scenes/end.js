// end (1-2 bars): the icon again with its bars full, the name, and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = UI, lt = env.lt, C = K.COL;
      K.desk(ctx);
      const e = K.sp(lt, 0.02);
      const y = 400 + 8 * Math.sin(lt * 2.2); K.halo(ctx, 960, y, 260, env, clamp(e));
      ctx.save(); ctx.globalAlpha *= clamp(e * 2); K.icon(ctx, 960, y, 200 * (0.85 + 0.15 * e)); ctx.restore();
      K.text(ctx, '하루 세 칸', 960, 660, 110, { align: 'center', w: 800, alpha: clamp(K.sp(lt, 0.15) * 1.6) });
      K.text(ctx, '가상의 앱 · 예제', 960, 740, 36, { align: 'center', w: 500, color: C.muted, alpha: clamp(K.sp(lt, 0.35) * 1.6) });
    },
  };
})();

// hook (1 bar; 2 in the 30-second cut): a single ink dot on warm paper, breathing on the beat; 한 점 플래너 and 하루
// 일정 앱 come in under it. The reel's first frame is the dot alone, and so is its last, so it loops.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt, s = 1 + 0.045 * Math.sin(lt * 3.1);
      K.ground(ctx);
      ctx.save(); ctx.translate(K.CX, K.CY); ctx.scale(s, s); ctx.translate(-K.CX, -K.CY); K.fill(ctx, K.shape('dot'), K.COL.ink); ctx.restore();
      K.ripples(ctx, env, K.shape('dot'), 1, K.COL.ink);
      K.text(ctx, '한 점 플래너', K.CX, 780, 130, (lt - 0.3) / 0.35);
      K.text(ctx, '하루 일정 앱', K.CX, 860, 44, (lt - 0.55) / 0.35, { w: 600, color: K.COL.mute });
    },
  };
})();

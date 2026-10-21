// hook (2 bars): 멍멍 shoots in from the left on a smear of speed lines, skids to a stop with a squash and a puff,
// wags; a burst balloon pops (멍!); 반려견 산책 앱 above, 산책왕 멍멍 slammed in below.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = TOON, lt = env.lt, C = K.COL;
      K.park(ctx, lt * 120);
      const k = clamp(lt / 0.7), x = lerp(-500, 1240, Ease.outC(k)), skid = lt > 0.55 && lt < 1.1, sq = lt < 0.7 ? -0.35 * (1 - k) : 0.35 * Math.exp(-(lt - 0.7) * 6) * Math.cos((lt - 0.7) * 18);
      if (k < 1) K.speed(ctx, x - 160, 520, 600, 300, lt, 1 - k);
      if (skid) for (let i = 0; i < 4; i++) K.circle(ctx, x - 140 - i * 50, 880 - i * 8, 26 - i * 4, '#FFFFFF', { lw: 5 });
      K.dog(ctx, x, 900, 1.05, k < 1 ? lt * 26 : null, { sq, wag: lt * 22, look: 1 });
      K.burst(ctx, x + 330, 330, 120, '멍!', 110, (lt - 0.9) / 0.3);
      K.pop(ctx, '반려견 산책 앱', 120, 210, 70, lt, { at: 0.15, fam: FAM.sans, fill: C.yel });
      K.pop(ctx, '산책왕 멍멍', 110, 420, 180, lt, { at: 0.45, rot: -0.03 });
    },
  };
})();

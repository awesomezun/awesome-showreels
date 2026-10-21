// end (2 bars): the title over the rain-blurred city glow: 네온 레인 2087, the line, the platforms and the fiction label;
// a glitch now and then.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = CYBER, lt = env.lt, hz = 960;
      K.sky(ctx, { horizon: hz }); K.towers(ctx, lt, { depth: 0, horizon: hz, pan: lt * 15 }); K.towers(ctx, lt, { depth: 1, horizon: hz, pan: 1500 + lt * 22, signs: true, scale: 0.8 });
      ctx.fillStyle = 'rgba(7,4,26,0.6)'; ctx.fillRect(0, 0, W, H); K.rain(ctx, lt, { n: 360 });
      K.gtext(ctx, '네온 레인', W / 2, 470, 220, lt, { align: 'center', a: clamp(lt / 0.15) });
      K.gtext(ctx, '2087', W / 2, 610, 130, lt, { align: 'center', font: K.fu(130), color: K.COL.cyan, a: clamp((lt - 0.2) / 0.15) });
      K.gtext(ctx, '2087년, 비는 그치지 않는다.', W / 2, 740, 60, lt, { align: 'center', a: clamp((lt - 0.5) / 0.2), split: 3, color: K.COL.yel });
      K.gtext(ctx, '출시 예정 · PC / 콘솔 · 가상의 게임 · 예제', W / 2, 840, 40, lt, { align: 'center', a: clamp((lt - 0.8) / 0.2), split: 2, font: K.fu(40), color: K.COL.ink2 });
      K.slices(ctx, lt, lt < 0.2 ? 1 : 0);
    },
  };
})();

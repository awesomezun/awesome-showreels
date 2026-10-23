// end (2 bars): the sunburst again with confetti; the cat sits in the middle waving a paw; 냥이네 / 하숙집 above it,
// 매주 금요일 밤 9시 on a tag and 가상의 예능입니다 at the foot.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec;
      K.burst(ctx, lt, '#FFC8DA', '#FFB0C9'); K.confetti(ctx, lt, 40);
      K.cap(ctx, '냥이네', W / 2, 470, 200, lt - 0.1, { style: 'pink', stagger: 0.06 });
      K.cap(ctx, '하숙집', W / 2, 700, 200, lt - 0.4, { style: 'sky', stagger: 0.06 });
      K.cat(ctx, W / 2, 1420, 0.95, lt, { pose: 'sit', face: 'open', paw: 0.6 + 0.4 * Math.sin(lt * 7) });
      K.tag(ctx, '매주 금요일 밤 9시', W / 2, 1620, 64, (lt - 2 * B) / 0.25);
      ctx.save(); ctx.globalAlpha = clamp((lt - 3 * B) / 0.3); ctx.font = K.F(36, 'sans'); ctx.fillStyle = K.COL.ink; ctx.textAlign = 'center'; ctx.fillText('가상의 예능입니다', W / 2, 1800); ctx.restore();
    },
  };
})();

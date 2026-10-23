// plate (30-second cut, 2 bars): the specimen sheet. Four insects are engraved one per two beats (무당벌레, 매미,
// 잠자리, 메뚜기), each with its name and plate number, under 도판 128점, 모두 새로 새겼습니다.
(() => {
  const XS = [330, 790, 1240, 1650], Y = 500, S = 0.74, NAMES = ['무당벌레', '매미', '잠자리', '메뚜기'], NUM = ['도판 31', '도판 44', '도판 58', '도판 72'];
  SCENES['plate'] = {
    draw(ctx, t, env) {
      const K = DONG, lt = env.lt, B = env.beatSec;
      ctx.save(); K.push(ctx, lt, env.dur, 0.02);
      K.paper(ctx);
      K.label(ctx, '도판 128점, 모두 새로 새겼습니다', 150, 200, 64, lt / 0.4, { fam: 'display', weight: 700 });
      const makers = [K.ladybird, K.cicada, K.dragonfly, K.grasshopper], tips = [];
      makers.forEach((mk, i) => {
        const t0 = 0.15 + i * 2 * B; tips.push(...K.drawBug(ctx, mk(t0, 0.45), lt, XS[i], Y + (i === 2 ? -30 : 0), i === 3 ? S * 0.95 : S));
        K.label(ctx, NAMES[i], XS[i], 900, 50, (lt - t0 - 0.3) / 0.3, { fam: 'display', weight: 800, align: 'center' });
        K.label(ctx, NUM[i], XS[i], 950, 28, (lt - t0 - 0.4) / 0.3, { align: 'center' });
      });
      K.glint(ctx, tips, lt);
      ctx.restore();
    },
  };
})();

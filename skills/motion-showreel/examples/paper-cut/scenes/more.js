// more (30-second cut, 3 bars): three more sheets in indigo, pink and green, unfolded one per beat into a snowflake,
// a plum blossom and a pinwheel, under 무늬는 오리는 대로; their names below.
(() => {
  const SET = [['snow', 'indigo', '눈꽃'], ['plum', 'pink', '매화'], ['wheel', 'green', '바람개비']], XS = [420, 960, 1500];
  SCENES['more'] = {
    draw(ctx, t, env) {
      const K = ORIM, lt = env.lt, B = env.beatSec;
      K.table(ctx);
      K.text(ctx, '무늬는 오리는 대로', W / 2, 170, 84, (lt - 0.1) / 0.4, { align: 'center', color: K.COL.ink });
      SET.forEach(([d, c, name], i) => {
        const t0 = 0.4 + i * 2 * B, u = 3 * Ease.ioQ(clamp((lt - t0) / (1.6 * B)));
        K.sheet(ctx, XS[i], 540, 0.4, Math.max(0.0001, u), K.sheetBuf(d, K.COL[c]), { rot: 0.05 * Math.sin(lt * 0.9 + i) });
        K.text(ctx, name, XS[i], 900, 60, (lt - t0 - 0.6) / 0.35, { fam: 'sans', align: 'center', color: K.COL[c] });
      });
    },
  };
})();

// end (2 bars; 3 in the 30-second cut): the sun on the horizon, the grid running on; the chrome 네온 하이웨이 with a
// sheen and the neon 1986; 밤은 길고, 도로는 끝이 없다 and 1986 아케이드 레이싱 · 가상의 게임입니다; on the last beat the
// tape stops and the CRT folds to a line.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = OUTRUN, lt = env.lt, B = env.beatSec;
      K.sky(ctx); K.sun(ctx, W / 2, 500, 240, lt); K.mountains(ctx, lt * 20); K.grid(ctx, lt, 0.9 * (1 - clamp((lt - (env.dur - B)) / B)));
      K.chrome(ctx, '네온 하이웨이', W / 2, 380, 190, clamp(lt / 0.05), { slam: lt / 0.25, sheen: lt * 0.4 });
      K.neon(ctx, '1986', W / 2 + 330, 490, 96, (lt - 0.3) / 0.1, { col: '#3CF0FF', flicker: lt * 1.3 });
      K.neon(ctx, '밤은 길고, 도로는 끝이 없다', W / 2, 760, 60, (lt - 0.8) / 0.2, { col: '#FF3CC8', flicker: lt + 1 });
      ctx.save(); ctx.globalAlpha = clamp((lt - 1.3) / 0.3); ctx.font = K.F(32, 'sans'); ctx.fillStyle = '#F4E8FF'; ctx.textAlign = 'center'; ctx.fillText('1986 아케이드 레이싱 · 가상의 게임입니다', W / 2, 850); ctx.restore();
      K.vhs(ctx, lt, { clock: 26, solid: true });
      const off = clamp((lt - (env.dur - 0.55)) / 0.5); if (off > 0) K.power(ctx, 1 - off);
    },
  };
})();

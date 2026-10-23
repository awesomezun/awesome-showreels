// hook (2 bars): the tape starts: a CRT line opens into the picture and PLAY blinks. A striped sun rises over
// wireframe mountains, the magenta grid rushes in; 1986 아케이드 레이싱, then 네온 하이웨이 slams down in chrome on the
// fifth beat with a sheen, and a cyan neon 1986 flickers on.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = OUTRUN, lt = env.lt, B = env.beatSec;
      K.sky(ctx); K.sun(ctx, W / 2, lerp(820, 470, Ease.outC(rm(lt, 0.3, 2.6))), 230, lt); K.mountains(ctx, lt * 20); K.grid(ctx, lt, 0.9);
      K.neon(ctx, '1986 아케이드 레이싱', W / 2, 230, 44, (lt - 2.0) / 0.3, { col: '#FFFFFF', flicker: lt });
      K.chrome(ctx, '네온 하이웨이', W / 2, 430, 190, clamp((lt - 5 * B) / 0.05), { slam: (lt - 5 * B) / 0.25, sheen: (lt - 5 * B) * 0.6 });
      K.neon(ctx, '1986', W / 2 + 330, 540, 96, (lt - 6 * B) / 0.1, { col: '#3CF0FF', flicker: lt * 1.3 });
      if (lt > 5 * B && lt < 5 * B + 0.4) env.fx.shake = Math.max(env.fx.shake || 0, 14 * (1 - (lt - 5 * B) / 0.4));
      K.vhs(ctx, lt);
      K.power(ctx, lt / 0.5);
    },
  };
})();

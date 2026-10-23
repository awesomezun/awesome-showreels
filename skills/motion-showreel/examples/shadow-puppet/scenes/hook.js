// hook (2 bars): the house is dark; the lamp catches behind the screen and the cloth warms up, flickering; a board
// with 그림자 토끼전 cut through it drops in on two strings and sways; the rabbit pops up from below on its rods,
// blurred while it is off the screen, then hops twice on the beat. Under the stage: 달빛 극단 어린이 그림자극.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt, B = env.beatSec;
      const L = K.lamp(lt, 0.08 + 0.92 * Ease.outC(rm(lt, 0.35, 1.1)));
      K.stage(ctx, L);
      K.board(ctx, '그림자 토끼전', W / 2, 330, 140, rm(lt, 1.0, 1.7), { lt });
      const up = Ease.outBack(rm(lt, 2.0, 2.45), 1.3), h = (lt - 2.45) / B;
      K.rabbit(ctx, 1240, 790 + 380 * (1 - up), 1.25, { hop: h > 0 && h < 3 ? (h % 1.5) / 1.5 * (h < 3 ? 1 : 0) : 0, ear: lt * 0.8, lift: 1 - clamp((lt - 2.2) / 0.35) });
      K.frame(ctx);
      K.caption(ctx, '달빛 극단 어린이 그림자극', (lt - 0.8) / 0.4);
    },
  };
})();

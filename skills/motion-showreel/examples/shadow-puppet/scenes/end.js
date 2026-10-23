// end (2 bars): under the moon the rabbit sits on its hill; the board 그림자 토끼전 swings in, then a second board,
// 불을 끄면, 이야기가 켜져요; the lamp flickers; under the stage: 달빛 극단 · 토요일 오후 3시 · 가상의 공연입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt, B = env.beatSec;
      K.stage(ctx, K.lamp(lt));
      K.moon(ctx, 1520, 230, 70);
      K.land(ctx, 1150, K.SX + K.SW + 40, 700);
      K.rabbit(ctx, 1440, 735, 0.9, { ear: lt * 0.9, hop: ((lt * 0.6) % 1 < 0.25 ? ((lt * 0.6) % 1) / 0.25 : 0), height: 24 });
      K.board(ctx, '그림자 토끼전', 760, 300, 120, rm(lt, 0.1, 0.8), { lt });
      K.board(ctx, '불을 끄면, 이야기가 켜져요', 760, 560, 64, rm(lt, 0.9, 1.6), { lt: lt + 1, dye: '#F7D27A' });
      K.frame(ctx);
      K.caption(ctx, '달빛 극단 · 토요일 오후 3시 · 가상의 공연입니다', (lt - 1.8) / 0.4);
    },
  };
})();

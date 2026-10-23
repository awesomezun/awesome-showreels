// palace (30-second cut, 2 bars): the dragon king's palace with its windows glowing through gold dye; the king
// waves his sleeve; the rabbit, ears twitching, answers. “간은 뭍에 두고 왔는걸요!”
(() => {
  SCENES['palace'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt, B = env.beatSec;
      K.stage(ctx, K.lamp(lt), { lx: 960 });
      K.palace(ctx, 960, 760, 1.25, lt);
      K.waves(ctx, 800, lt, { speed: 30 });
      K.king(ctx, 520, 800, 1.1, lt);
      const hb = (lt - 1.2) / B;
      K.rabbit(ctx, 1420, 800, 1.0, { dir: -1, hop: hb > 0 && hb < 2 ? hb % 1 : 0, height: 40, ear: lt * 2.4 });
      K.frame(ctx);
      K.caption(ctx, '“간은 뭍에 두고 왔는걸요!”', (lt - 0.5) / 0.4);
    },
  };
})();

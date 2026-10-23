// step3 (30-second cut, 2 bars): ③ 나사 조이기: the screwdriver moves from screw to screw and each turns in, two per
// beat; C ×12.
(() => {
  SCENES['step3'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec, per = B / 2, s0 = 0.4;
      K.ground(ctx);
      K.shelf(ctx, K.O, {});
      K.SCREWS.forEach(([x, y], i) => K.screw(ctx, x, y, 11, (lt - s0 - i * per) * 10, clamp((lt - s0 - i * per) / 0.1)));
      const cur = Math.min(5, Math.max(0, Math.floor((lt - s0) / per))), [x, y] = K.SCREWS[cur]; K.driver(ctx, x, y, 0.9, lt * 6);
      K.step(ctx, 3, 220, 300, lt / 0.25); K.text(ctx, '나사 조이기', 300, 320, 52, (lt - 0.2) / 0.25, { w: 800 });
      K.tagPart(ctx, 'C', 12, 1600, 300, (lt - 0.3) / 0.3);
      K.person(ctx, 1770, 960, 1.0, lt, { arm: 0.4 + 0.3 * Math.sin(lt * 10) });
    },
  };
})();

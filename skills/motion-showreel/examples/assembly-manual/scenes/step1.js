// step1 (30-second cut, 2 bars): ① 옆판 세우기: the two side panels slide in along dotted arrows and stand upright; a
// small OK panel shows the right way up.
(() => {
  SCENES['step1'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec, s = Ease.ioC(clamp((lt - 0.4) / 0.6));
      K.ground(ctx);
      K.shelf(ctx, K.O, { sideL: [-200 * (1 - s), 0, 0, 1], sideR: [200 * (1 - s), 0, 0, 1], shelves: [] });
      K.arrow(ctx, K.iso(K.O, -260, 230, 75), K.iso(K.O, -40, 230, 75), (lt - 0.2) / 0.4); K.arrow(ctx, K.iso(K.O, 580, 230, 75), K.iso(K.O, 360, 230, 75), (lt - 0.2) / 0.4);
      K.step(ctx, 1, 220, 300, lt / 0.25); K.text(ctx, '옆판 세우기', 300, 320, 52, (lt - 0.2) / 0.25, { w: 800 });
      K.panel(ctx, 160, 560, 360, 320, true, (lt - 2 * B) / 0.3, g => K.box(g, { x: 330, y: 820, s: 0.45 }, 0, 0, 0, 18, 460, 150));
      K.tagPart(ctx, 'A', 2, 1600, 300, (lt - 0.3) / 0.3);
      K.person(ctx, 1770, 960, 1.0, lt, { arm: 0.2 });
    },
  };
})();

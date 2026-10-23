// step2 (30-second cut, 2 bars): ② 선반 끼우기: three shelves slide in from the front one per beat along dotted arrows;
// a small wrong-way panel shows a shelf upside down, crossed out.
(() => {
  SCENES['step2'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec;
      K.ground(ctx);
      const sh = [0, 1, 2].map(i => { const u = Ease.ioC(clamp((lt - (0.5 + i) * B) / 0.4)); return u <= 0 ? [0, 0, 0, 0] : [0, 0, 300 * (1 - u), 1]; });
      K.shelf(ctx, K.O, { shelves: sh });
      [0, 1, 2].forEach(i => K.arrow(ctx, K.iso(K.O, 160, [10, 210, 420][i] + 9, 470), K.iso(K.O, 160, [10, 210, 420][i] + 9, 170), (lt - (0.4 + i) * B) / 0.3));
      K.step(ctx, 2, 220, 300, lt / 0.25); K.text(ctx, '선반 끼우기', 300, 320, 52, (lt - 0.2) / 0.25, { w: 800 });
      K.panel(ctx, 160, 560, 360, 320, false, (lt - 3.5 * B) / 0.3, g => { g.save(); g.translate(340, 720); g.rotate(0.5); K.box(g, { x: -120, y: 30, s: 0.5 }, 0, 0, 0, 300, 18, 150); g.restore(); });
      K.tagPart(ctx, 'B', 3, 1600, 300, (lt - 0.3) / 0.3);
      K.person(ctx, 1770, 960, 1.0, lt, { arm: 0.6 });
    },
  };
})();

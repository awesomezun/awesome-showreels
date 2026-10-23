// build (15-second cut, 2 bars): steps one to three at speed: ① the side panels slide in and stand, ② three shelves
// slide in from the front along dotted arrows, ③ the screws turn in one after another under the screwdriver.
(() => {
  SCENES['build'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec;
      K.ground(ctx);
      const sides = Ease.ioC(clamp(lt / 0.45)), st = { sideL: [-120 * (1 - sides), 0, 0, 1], sideR: [120 * (1 - sides), 0, 0, 1] };
      st.shelves = [0, 1, 2].map(i => { const u = Ease.ioC(clamp((lt - (1.5 + i * 0.75) * B) / 0.4)); return u <= 0 ? [0, 0, 0, 0] : [0, 0, 260 * (1 - u), 1]; });
      K.shelf(ctx, K.O, st);
      [0, 1, 2].forEach(i => K.arrow(ctx, K.iso(K.O, 160, [10, 210, 420][i] + 9, 430), K.iso(K.O, 160, [10, 210, 420][i] + 9, 170), (lt - (1.4 + i * 0.75) * B) / 0.3));
      const s0 = 4.2 * B, per = 0.2; K.SCREWS.forEach(([x, y], i) => K.screw(ctx, x, y, 11, (lt - s0 - i * per) * 12, clamp((lt - s0 - i * per) / 0.1)));
      const cur = Math.min(5, Math.max(0, Math.floor((lt - s0) / per))); if (lt > s0 && lt < s0 + 6 * per + 0.3) { const [x, y] = K.SCREWS[cur]; K.driver(ctx, x, y, 0.9, lt * 6); }
      K.step(ctx, 1, 220, 260, lt / 0.25); K.step(ctx, 2, 220, 420, (lt - 1.5 * B) / 0.25); K.step(ctx, 3, 220, 580, (lt - s0) / 0.25);
      K.text(ctx, '옆판 세우기', 300, 280, 40, lt / 0.25, { w: 700 }); K.text(ctx, '선반 끼우기', 300, 440, 40, (lt - 1.5 * B) / 0.25, { w: 700 }); K.text(ctx, '나사 조이기', 300, 600, 40, (lt - s0) / 0.25, { w: 700 });
      K.person(ctx, 1770, 960, 1.0, lt, { arm: 0.3 + 0.3 * Math.sin(lt * 8) });
    },
  };
})();

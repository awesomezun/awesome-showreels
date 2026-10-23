// verse1 (2 bars): the bus runs along the coast road, the sea and pines streaming past; the first two lines, each
// syllable popping yellow as it is sung: 파란 버스를 타고 / 여름으로 가요.
(() => {
  SCENES['verse1'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec, dist = 2000 + lt * 900;
      U.sky(ctx, t); U.sun(ctx, 1600, 170, 90, t); U.clouds(ctx, t); U.sea(ctx, t, 600, 790, dist * 0.2); U.road(ctx, dist * 0.6); U.pines(ctx, dist * 0.6, 830, 0.8, 0.5);
      U.bus(ctx, 900, 960, 0.95, t, b, dist); U.sign(ctx, 900, 960, 0.95, t, b);
      U.lyrics(ctx, env, ['파란 버스를 타고', '여름으로 가요'], 250);
    },
  };
})();

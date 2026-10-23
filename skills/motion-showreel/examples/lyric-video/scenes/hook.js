// hook (2 bars): a summer coast; the blue bus to 여름 drives in from the left and settles in the middle, bouncing on the
// beat with the band in its windows; the title: 여름잠, 「파란 버스」.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec, dist = lt * 900, x = lerp(-700, 900, Ease.outC(clamp(lt / (4 * b))));
      U.sky(ctx, t); U.sun(ctx, 1600, 170, 90, t); U.clouds(ctx, t); U.sea(ctx, t, 600, 790, dist * 0.2); U.road(ctx, dist * 0.6); U.pines(ctx, dist * 0.6, 830, 0.8, 0.5);
      U.bus(ctx, x, 960, 0.95, t, b, dist); U.sign(ctx, x, 960, 0.95, t, b);
      U.text(ctx, '여름잠', W / 2, 190, 64, (lt - 4.2 * b) / (0.5 * b), { fam: 'sans' }); U.text(ctx, '파란 버스', W / 2, 330, 150, (lt - 4.6 * b) / (0.5 * b), { color: '#FFE15C' });
    },
  };
})();

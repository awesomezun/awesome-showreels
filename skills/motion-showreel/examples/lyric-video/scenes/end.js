// end (2 bars, 3 in the 15-second cut): the last line, held: 파란 버스, 여름으로; then the bus drives off to the right
// and the card: 여름잠 「파란 버스」 · 가상의 밴드와 노래입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec, dist = 9000 + lt * 900, x = 900 + 1500 * Ease.inC(clamp((lt - 4.5 * b) / (2.5 * b)));
      U.sky(ctx, t); U.sun(ctx, 1600, 170, 90, t); U.clouds(ctx, t); U.sea(ctx, t, 600, 790, dist * 0.2); U.road(ctx, dist * 0.6 - (x - 900)); U.pines(ctx, dist * 0.6, 830, 0.8, 0.5);
      U.bus(ctx, x, 960, 0.95, t, b, dist); U.sign(ctx, x, 960, 0.95, t, b);
      if (lt < 5 * b) U.lyrics(ctx, env, ['파란 버스, 여름으로'], 250, { size: 130 });
      const a = (lt - 5 * b) / (0.5 * b); U.text(ctx, '여름잠', W / 2, 220, 64, a, { fam: 'sans' }); U.text(ctx, '파란 버스', W / 2, 370, 160, a - 0.2, { color: '#FFE15C' });
      U.text(ctx, '가상의 밴드와 노래입니다 · 가사와 목소리도 이 예제에서 만들었습니다', W / 2, 470, 42, a - 0.6, { fam: 'sans' });
    },
  };
})();

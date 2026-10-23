// hours (30-second cut, 2 bars): the same window three times, lit one per beat: cool at 아침 9시, white at 정오, amber
// at 저녁 6시, each with its light on the floor below; 같은 창, 세 가지 빛 above them.
(() => {
  const XS = [210, 790, 1370], LBL = ['아침 9시', '정오', '저녁 6시'], TINT = ['dawn', 'noon', 'dusk'];
  SCENES['hours'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, B = env.beatSec;
      K.wall(ctx); K.floor(ctx, 770);
      K.text(ctx, '같은 창, 세 가지 빛', W / 2, 140, 80, (lt - 0.1) / 0.5, { align: 'center', color: '#F6D58A' });
      XS.forEach((x, i) => {
        const a = clamp((lt - 0.4 - i * B) / 0.6), tint = K.TINT[TINT[i]];
        K.window(ctx, x, 200, 0.4, { light: 0.15 + 0.85 * a, tint, band: 200 + (lt * 140 + i * 300) % 1200, glow: a > 0.5 });
        K.floorLight(ctx, x + 40 + lt * 10, 790, 0.42, 0.2, 0.5, 0.5 * a, { blur: 6, tint });
        K.text(ctx, LBL[i], x + 152, 1000, 52, a, { fam: 'sans', w: 700, align: 'center' });
      });
    },
  };
})();

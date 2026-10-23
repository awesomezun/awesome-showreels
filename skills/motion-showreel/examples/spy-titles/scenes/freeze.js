// freeze (30-second cut, 2 bars): two hands reach for a briefcase from either side; on the third beat everything stops
// dead with the music (stop-time), and after the silence 기밀 is stamped across it; 멈춘 그 순간.
(() => {
  SCENES['freeze'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL, f = Math.min(lt, 2 * B);
      K.field(ctx, C.mustard);
      K.bar(ctx, 0, 220, -0.42, 1, C.orange, 5);
      const reach = Ease.outC(clamp(f / (2 * B)));
      K.cut(ctx, [[820, 620], [1100, 620], [1100, 820], [820, 820]], C.ink, { seed: 14 }); K.cut(ctx, [[910, 600], [1010, 600], [1010, 622], [910, 622]], C.ink, { seed: 15 });
      for (const sgn of [-1, 1]) { const x0 = sgn < 0 ? -40 : W + 40, x1 = 960 + sgn * lerp(560, 150, reach);
        K.cut(ctx, [[x0, 560], [x1, 590], [x1 + sgn * 0, 650], [x0, 660]], sgn < 0 ? C.ink : C.teal, { seed: 16 + sgn });
        K.circle(ctx, x1, 615, 52, sgn < 0 ? C.ink : C.teal, { seed: 18 + sgn, shadow: false }); }
      K.stamp(ctx, '기밀', 960, 330, 150, (lt - 3.5 * B) / 0.15);
      K.text(ctx, '멈춘 그 순간', 160, 960, 56, (lt - 3.7 * B) / 0.3, { color: C.ink });
    },
  };
})();

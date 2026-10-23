// schedule (30-second cut, 2 bars): ten blocks fill in for the ten class days, two per beat; 7월 20일 – 7월 31일,
// 월–금 · 10:00–17:00, 정원 24명.
(() => {
  SCENES['schedule'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      for (let d = 0; d < 10; d++) { const a = clamp((lt - Math.floor(d / 2) * B * 0.5) / 0.2), x = (2 + d + (d >= 5 ? 1 : 0)) * M; K.rect(ctx, x + 6, 2 * M + (1 - a) * M, M - 12, 2 * M * a, [C.red, C.blue, C.yellow, C.ink, C.blue][d % 5], a); }
      K.word(ctx, '7월 20일 – 7월 31일', 2 * M, 5.6 * M, 110, lt - 2.5 * B);
      K.text(ctx, '월–금 · 10:00–17:00', 2 * M + 4, 6.6 * M, 60, (lt - 3.5 * B) / 0.3, { fam: 'sans' });
      K.text(ctx, '정원 24명', 2 * M + 4, 7.4 * M, 60, (lt - 4 * B) / 0.3, { fam: 'sans', color: C.red });
    },
  };
})();

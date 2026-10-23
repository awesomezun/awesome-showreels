// end (2 bars; 3 in the 30-second cut): the poster freezes together: a large red circle with a turning quarter, a blue
// square overprinted on it, a yellow triangle, black bars; 원, 사각, 삼각. / 그리고 당신. and 조형 연구소 여름 학교 ·
// 가상의 워크숍입니다 set in the corner.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL, a = (k) => clamp((lt - k * B * 0.5) / 0.2);
      K.paper(ctx, { grid: 0.5 });
      K.circle(ctx, 11.5 * M, 3.5 * M, 3 * M, C.red, a(0));
      const q = K.turn(lt, B, 2 * B, 99); K.arc(ctx, 11.5 * M, 3.5 * M, 3 * M, q, q + Math.PI / 2, C.ink, a(1) * 0.85);
      K.rect(ctx, 8 * M, 3 * M, 3 * M, 3 * M, C.blue, a(1));
      K.tri(ctx, [[12 * M, 8 * M], [15.5 * M, 8 * M], [13.75 * M, 5 * M]], C.yellow, a(2));
      K.rect(ctx, 1 * M, 1.4 * M, 6 * M, 0.3 * M, C.ink, a(2)); K.rect(ctx, 1 * M, 8.2 * M, 14.5 * M, 0.15 * M, C.ink, a(3));
      K.word(ctx, '원, 사각, 삼각.', 1 * M, 3.4 * M, 104, lt - 1.5 * B);
      K.word(ctx, '그리고 당신.', 1 * M, 4.6 * M, 104, lt - 2.5 * B, { color: C.red });
      K.text(ctx, '조형 연구소 여름 학교', 1 * M + 4, 6.6 * M, 54, (lt - 3.5 * B) / 0.3, { fam: 'display', w: 900 });
      K.text(ctx, '2027. 7. 20 – 7. 31 · 가상의 워크숍입니다', 1 * M + 4, 7.4 * M, 34, (lt - 4 * B) / 0.3, { fam: 'sans' });
    },
  };
})();

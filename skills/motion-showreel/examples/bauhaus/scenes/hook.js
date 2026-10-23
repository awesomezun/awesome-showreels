// hook (2 bars): the module grid comes up on cream paper; one move per beat: a red circle rolls in two modules at a
// time, a blue square drops onto its row, a yellow triangle slides in, a black bar runs under them; 조형 연구소 slides up
// letter by letter on the right, then 여름 학교 2027.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx, { grid: lt / 0.3 });
      const [cx] = K.steps([[-2, 0], [0, 0], [2, 0], [3, 0]], lt, 0, B); K.circle(ctx, (cx + 0.5) * M + 120, 4.5 * M, 1.5 * M, C.red);
      const [, sy] = K.steps([[0, -4], [0, -4], [0, 1], [0, 2.5]], lt, 0, B); K.rect(ctx, 5 * M, sy * M, 2 * M, 2 * M, C.blue);
      const [tx] = K.steps([[18, 0], [18, 0], [18, 0], [10, 0], [6, 0]], lt, 0, B); K.tri(ctx, [[tx * M - 3 * M, 7 * M], [tx * M, 7 * M], [tx * M - 1.5 * M, 4 * M]], C.yellow);
      const bx = lerp(W, 0, Ease.outQuint(rm(lt, 4 * B, 4.6 * B))); K.rect(ctx, bx + 0.5 * M, 7.25 * M, 8 * M, 0.5 * M, C.ink);
      K.word(ctx, '조형 연구소', 9 * M + 20, 3.4 * M, 150, lt - 3 * B);
      K.word(ctx, '여름 학교 2027', 9 * M + 26, 4.6 * M, 72, lt - 5 * B, { fam: 'sans', w: 400 });
    },
  };
})();

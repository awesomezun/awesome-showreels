// you (2 bars; 3 in the 30-second cut): the shapes assemble a person, one part per beat: a red circle head drops in, a
// blue body slides under it, black arms turn up from the shoulders, a yellow triangle stands it on the floor; 그리고
// 당신 comes up beside it.
(() => {
  SCENES['you'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL, x = 5 * M;
      K.paper(ctx);
      const hy = K.steps([[0, -3], [0, 2]], lt, 0, B)[1]; K.circle(ctx, x, hy * M, 0.8 * M, C.red);
      const bx = K.steps([[-8, 0], [-8, 0], [0, 0]], lt, 0, B)[0]; K.rect(ctx, x - M + bx * M, 3 * M, 2 * M, 3 * M, C.blue);
      const arm = K.turn(lt, 2 * B, B, 1); K.rect(ctx, x + M, 3.1 * M, 2.4 * M, 0.35 * M, C.ink, 1, -arm * 0.6, x + M, 3.1 * M + 20); K.rect(ctx, x - 3.4 * M, 3.1 * M, 2.4 * M, 0.35 * M, C.ink, 1, arm * 0.6, x - M, 3.1 * M + 20);
      const ty = K.steps([[0, 12], [0, 12], [0, 12], [0, 6]], lt, 0, B)[1]; K.tri(ctx, [[x - 1.5 * M, (ty + 3) * M], [x + 1.5 * M, (ty + 3) * M], [x, ty * M]], C.yellow);
      K.rect(ctx, 0, 8.5 * M, W, 0.12 * M, C.ink, clamp((lt - 3 * B) / 0.3));
      K.word(ctx, '그리고', 9 * M, 3.6 * M, 160, lt - 4 * B);
      K.word(ctx, '당신', 9 * M, 5.2 * M, 190, lt - 4.5 * B, { color: C.red });
    },
  };
})();

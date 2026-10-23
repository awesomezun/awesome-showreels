// level1: games of 4 beat(s) each from game 0 on; the instruction pops, the fuse burns, 성공! and the score goes up.
(() => {
  SCENES['level1'] = { draw(ctx, t, env) { MINI.run(ctx, t, env, 4, 0, 1, 0); } };
})();

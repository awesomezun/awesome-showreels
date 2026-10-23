// level2: games of 2 beat(s) each from game 2 on; the instruction pops, the fuse burns, 성공! and the score goes up.
(() => {
  SCENES['level2'] = { draw(ctx, t, env) { MINI.run(ctx, t, env, 2, 2, 2, 300); } };
})();

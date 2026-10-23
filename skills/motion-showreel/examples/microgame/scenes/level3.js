// level3: games of 1 beat(s) each from game 6 on; the instruction pops, the fuse burns, 성공! and the score goes up.
(() => {
  SCENES['level3'] = { draw(ctx, t, env) { MINI.run(ctx, t, env, 1, 6, 3, 1000); } };
})();

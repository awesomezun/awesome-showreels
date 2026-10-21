// message (2-3 bars): the core line, louder than everything: 올여름, / 오려 붙인 / 사흘 in ransom letters, a letter
// per eighth; around it an eye, a mouth-red sun, a star and a flower slap down on the beats; the plane comes back.
(() => {
  SCENES['message'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P);
      K.scraps(ctx, 4, lt);
      const deco = [[1590, 250, () => K.eye(240, 120), C.white, 0.1, c => { c.fillStyle = C.cobalt; c.beginPath(); c.arc(0, 0, 44, 0, TAU); c.fill(); c.fillStyle = C.ink; c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.fill(); }],
        [1620, 760, () => K.blob(130, 3), C.red, 1.2, c => { c.globalAlpha = 0.35; c.fillStyle = '#F7C531'; c.beginPath(); c.arc(-30, -30, 60, 0, TAU); c.fill(); }],
        [250, 880, () => K.star(110), C.yellow, 2.2, null], [1180, 930, () => K.flower(90), C.green, 3.2, c => { c.fillStyle = C.pink; c.beginPath(); c.arc(0, 0, 28, 0, TAU); c.fill(); }]];
      deco.forEach(([x, y, shape, col, at, inner], i) => { const s = K.slap(lt, at * B); if (s) K.piece(ctx, x, y, shape(), { base: col, fill: i === 2 ? 'dots' : undefined, tileA: 0.2, rot: (i - 1.5) * 0.15 + s.dr + Math.sin(T * 1.5 + i) * 0.03, scale: s.s, sh: s.sh, alpha: s.a, inner }); });
      K.word(ctx, '올여름,', 170, 270, 200, lt, 0.1, { step: B / 2, seed: 11, comboShift: 2 });
      K.word(ctx, '오려 붙인', 170, 540, 200, lt, 2 * B, { step: B / 2, seed: 21, comboShift: 5 });
      K.word(ctx, '사흘', 190, 860, 300, lt, 4 * B, { step: B / 2, seed: 31, comboShift: 1 });
      const pp = rm(T, 2.0, 4.0); if (pp > 0 && pp < 1) K.piece(ctx, lerp(W + 150, -150, pp), 120 + Math.sin(pp * 7) * 40, K.plane(-100), { base: C.white, fill: 'print', tileA: 0.3, rot: Math.cos(pp * 7) * 0.1, borderW: 3 });
    },
  };
})();

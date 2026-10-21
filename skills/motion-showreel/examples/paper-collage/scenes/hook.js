// hook (2 bars): the name in ransom letters. A kicker strip (독립 음악 축제) is taped up, 종이비행 slaps down a
// letter per half beat, each on its own chip in its own face and colour, then a torn strip says 페스티벌 2026; a
// paper plane crosses on twos, a star and a flower land on the beat.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P);
      K.scraps(ctx, 1, lt);
      const st = K.slap(lt, 2 * B); if (st) K.piece(ctx, 1560, 250, K.star(120), { base: C.yellow, fill: 'dots', tileA: 0.25, rot: 0.2 + st.dr + T * 0.08, scale: st.s, sh: st.sh, alpha: st.a });
      const fl = K.slap(lt, 3 * B); if (fl) K.piece(ctx, 330, 860, K.flower(110), { base: C.pink, rot: -0.3 + fl.dr - T * 0.06, scale: fl.s, sh: fl.sh, alpha: fl.a, inner: c => { c.fillStyle = C.yellow; c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.fill(); } });
      K.strip(ctx, '독립 음악 축제', 300, 250, 72, lt, 0.05, { bg: C.ink, fg: C.white, rot: -0.05, seed: 3 });
      K.tape(ctx, 330, 205, 160, 0.4, { seed: 2 });
      K.word(ctx, '종이비행', 250, 530, 270, lt, 0.3, { step: B / 2, seed: 1 });
      K.strip(ctx, '페스티벌 2026', 520, 800, 110, lt, 4.2 * B, { bg: C.cobalt, fg: C.white, rot: 0.04, seed: 7 });
      // the paper plane crosses the board on twos
      const pp = rm(T, 0.4, 3.6); if (pp > 0 && pp < 1) { const x = lerp(-150, W + 150, pp), y = 380 - Math.sin(pp * Math.PI) * 180 + Math.sin(pp * 9) * 20;
        K.piece(ctx, x, y, K.plane(110), { base: C.white, fill: 'print', tileA: 0.3, rot: -0.15 + Math.cos(pp * 9) * 0.1, borderW: 3 }); }
    },
  };
})();

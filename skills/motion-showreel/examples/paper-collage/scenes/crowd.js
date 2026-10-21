// crowd (2-3 bars, 30-s cut): the stage. Two speaker stacks and a stage edge cut from black paper; a crowd of
// halftone heads and raised hands slaps up row by row; strips count it: 사흘 · 24팀 · 한 무대.
(() => {
  SCENES['crowd'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P, { color: '#F3D7C8' });
      K.scraps(ctx, 3, lt, { alpha: 0.45 });
      // light beams of torn yellow paper
      [[700, -0.25], [1220, 0.25]].forEach(([x, a], i) => { const s = K.slap(lt, 0.1 + i * 0.2); if (s) K.piece(ctx, x, 330, [[-40, -380], [40, -380], [260, 420], [-260, 420]], { base: C.yellow, fill: 'dots', tileA: 0.18, rot: a + Math.sin(T * 2 + i) * 0.05, alpha: s.a * 0.85, border: false, sh: 4 }); });
      [[260, 'L'], [1660, 'R']].forEach(([x], i) => { const s = K.slap(lt, 0.2 + i * 0.25); if (s) K.piece(ctx, x, 520, K.torn(230, 420, 70 + i, 4), { base: C.black, scale: s.s, sh: s.sh, alpha: s.a,
        inner: c => { [-110, 60].forEach(y => { const pulse = 1 + 0.06 * beatPulse(env, 9); c.strokeStyle = '#555'; c.lineWidth = 6; c.beginPath(); c.arc(0, y, 62 * pulse, 0, TAU); c.stroke(); c.fillStyle = '#444'; c.beginPath(); c.arc(0, y, 22, 0, TAU); c.fill(); }); } }); });
      const se = K.slap(lt, 0.4); if (se) K.piece(ctx, 960, 760, K.torn(1500, 70, 79, 5), { base: C.red, fill: 'stripes', tileA: 0.2, sh: se.sh, alpha: se.a });
      // the crowd: three rows of heads, hands up on the beat
      for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) {
        const s = K.slap(lt, 0.6 + r * B + i * 0.04); if (!s) continue;
        const x = 70 + i * 165 + (r % 2) * 80, y = 880 + r * 80, up = (i + r) % 3 === 0 ? beatPulse(env, 6) : 0;
        K.piece(ctx, x, y + (1 - s.e) * 120, K.blob(48, i + r * 12), { base: ['#232220', '#3B3634', '#2F55D4'][r], fill: 'dots', tileA: 0.25, sh: 5, alpha: s.a, border: false });
        if ((i + r) % 3 === 0) K.piece(ctx, x + 40, y - 70 - up * 30, [[-10, 40], [10, 40], [16, -30], [-16, -30]], { base: '#232220', border: false, sh: 3, rot: 0.2, alpha: s.a });
      }
      K.strip(ctx, '사흘', 360, 170, 96, lt, 2 * B, { bg: C.white, fg: C.red, rot: -0.05, seed: 81, face: '"Black Han Sans"' });
      K.strip(ctx, '24팀', 820, 190, 96, lt, 3 * B, { bg: C.cobalt, fg: C.white, rot: 0.04, seed: 82, face: '"Black Han Sans"' });
      K.strip(ctx, '한 무대', 1310, 170, 96, lt, 4 * B, { bg: C.yellow, fg: C.ink, rot: -0.03, seed: 83, face: '"Black Han Sans"' });
    },
  };
})();

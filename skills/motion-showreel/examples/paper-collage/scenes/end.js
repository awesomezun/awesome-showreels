// end (2-3 bars): the poster. 종이비행 in ransom letters at the top, the dates big on a red strip, the place, the
// ticket line; the plane lands, taped; the fiction label on a scrap.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P);
      K.scraps(ctx, 6, lt);
      K.word(ctx, '종이비행', 600, 230, 150, lt, 0.05, { step: 0.1, seed: 41 });
      K.strip(ctx, '페스티벌 2026', 960, 380, 66, lt, 0.6, { bg: C.ink, fg: C.white, align: 'center', seed: 44 });
      K.strip(ctx, '8.14 — 8.16', 960, 560, 140, lt, 1.2 * B + 0.4, { bg: C.red, fg: C.white, align: 'center', rot: -0.03, seed: 45, face: '"Black Han Sans"' });
      K.strip(ctx, '물빛공원 야외무대 · 티켓 7월 1일부터', 960, 750, 58, lt, 2.4 * B + 0.4, { bg: C.white, fg: C.ink, align: 'center', rot: 0.02, seed: 46 });
      K.strip(ctx, '가상의 축제 · 예제', 1600, 960, 40, lt, 3 * B + 0.4, { bg: C.kraft, fg: C.ink, align: 'center', rot: -0.06, seed: 47 });
      const pl = rm(T, 0.2, 1.4);
      if (pl > 0) { K.piece(ctx, lerp(-200, 290, pl), lerp(280, 880, Ease.ioC(pl)), K.plane(130), { base: C.white, fill: 'print', tileA: 0.3, rot: lerp(0.5, -0.2, pl), borderW: 3 }); if (pl >= 1) K.tape(ctx, 300, 870, 120, 0.6, { seed: 49 }); }
      const st = K.slap(lt, 1.6 * B + 0.4); if (st) K.piece(ctx, 1640, 360, K.star(100), { base: C.yellow, fill: 'dots', tileA: 0.2, rot: 0.3 + st.dr + T * 0.1, scale: st.s, sh: st.sh, alpha: st.a });
    },
  };
})();

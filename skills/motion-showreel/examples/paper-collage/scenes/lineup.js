// lineup (2-3 bars): who plays. A skyline of paper strips (newsprint, dots, stripes, kraft) slaps up from the
// bottom a building per beat; the band names land on torn strips one per beat, then 외 20팀.
(() => {
  const BLD = [[90, 230, 'print', '#E9E1CF'], [250, 340, 'dots', '#F49AC1'], [420, 260, 'stripes', '#F7C531'], [590, 400, 'print', '#C9A57B'], [780, 300, 'dots', '#8EC8E8'], [960, 360, 'stripes', '#E8402E'], [1150, 280, 'print', '#E9E1CF'], [1320, 420, 'dots', '#37A169'], [1500, 310, 'stripes', '#2F55D4'], [1690, 380, 'print', '#C9A57B'], [1860, 270, 'dots', '#F28A2E']];
  const BANDS = [['오렌지 스쿠터', '#F28A2E'], ['밤의 수영장', '#2F55D4'], ['도서관 고양이', '#37A169'], ['백색소음단', '#232220']];
  SCENES['lineup'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P);
      K.scraps(ctx, 2, lt);
      BLD.forEach(([x, h, tex, col], i) => {
        const s = K.slap(lt, 0.1 + i * 0.5 * B, 0.26); if (!s) return;
        const rise = (1 - s.e) * 160;
        K.piece(ctx, x, H - h / 2 + 30 + rise, K.torn(150, h, 40 + i, 4, 18), { base: col, fill: tex, tileA: 0.35, rot: (hash(i) - 0.5) * 0.06, sh: s.sh, alpha: s.a,
          inner: c => { c.fillStyle = 'rgba(30,27,26,0.75)'; for (let y = -h / 2 + 30; y < h / 2 - 40; y += 46) for (let x2 = -45; x2 <= 25; x2 += 40) c.fillRect(x2, y, 20, 24); } });
      });
      K.strip(ctx, '출연', 180, 150, 80, lt, 0.05, { bg: C.yellow, fg: C.ink, rot: -0.06, seed: 21 });
      BANDS.forEach(([name, col], i) => K.strip(ctx, name, 200 + (i % 2) * 640, 290 + i * 120, 92, lt, (1 + i) * B, { bg: i % 2 ? C.white : col, fg: i % 2 ? col : C.white, rot: (i % 2 ? 0.04 : -0.04), seed: 30 + i }));
      K.strip(ctx, '외 20팀', 1380, 700, 92, lt, 5 * B, { bg: C.pink, fg: C.ink, rot: 0.08, seed: 39 });
      K.tape(ctx, 1290, 676, 120, -0.5, { seed: 8 });
      onBeats(env, 2, (n, dt) => { const q = dt / 0.5; if (q < 1) K.tape(ctx, 300 + ((n * 431) % 1300), 260 + ((n * 197) % 400), 110, (n % 2 ? 0.5 : -0.4), { seed: n + 50, alpha: 1 - q * 0.3 }); });
    },
  };
})();

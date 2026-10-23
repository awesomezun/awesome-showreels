// wave (2 bars): every beat a gust sweeps the wall from the left and every tile turns
// once; the petals move on, the tree sways and the tulips lean; 바람이 불면, 조각이 뒤집혀요.
(() => {
  SCENES['wave'] = {
    draw(ctx, t, env) {
      const M = TILE, lt = env.lt, B = env.beatSec, n = Math.round(env.dur / B), w = { o: [0, 0], mode: 1, dir: [0.96, 0.28], spd: 700, dur: 0.16, jit: 0.05 };
      const flips = []; for (let k = 1; k < n; k++) flips.push({ at: k * B, to: 'g' + (k % 4), wave: w });
      M.draw(ctx, M.state(lt, 'g0', flips, { time: t, tw: 0.02 }));
      const a = Math.min((lt - 0.2) / 0.4, (env.dur - 0.3 - lt) / 0.3); M.plaque(ctx, 90, 830, 900, 150, a);
      M.text(ctx, '바람이 불면, 조각이 뒤집혀요', 150, 925, 60, a, { halo: false });
    },
  };
})();

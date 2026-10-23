// grow (30-second cut, 3 bars): the wall turns to soil and sky and a seed grows into a flower, two beats a stage; only
// the tiles that change flip, rippling out from the plant like a flip-disc sign; 싹이 트고, 꽃이 피고.
(() => {
  SCENES['grow'] = {
    draw(ctx, t, env) {
      const M = TILE, lt = env.lt, B = env.beatSec, w = { o: [80, 60], spd: 150, dur: 0.3, jit: 0.12, diff: true };
      const flips = [0, 1, 2, 3, 4, 5].map(k => ({ at: 2 * k * B, to: 's' + k, wave: k ? w : { o: [80, 74], spd: 200, dur: 0.3, jit: 0.15 } }));
      M.draw(ctx, M.state(lt, 'g0', flips, { time: t, tw: 0.015 }));
      const a = Math.min((lt - 0.4) / 0.4, (env.dur - 0.3 - lt) / 0.3); M.plaque(ctx, 90, 830, 640, 150, a);
      M.text(ctx, '싹이 트고, 꽃이 피고', 150, 925, 60, a, { halo: false });
    },
  };
})();

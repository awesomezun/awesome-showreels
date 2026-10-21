// grow (3 bars, 30-s cut): a loop. A new file: 5번 반복 { 나무 심기() } and five trees sprout round the village one
// after another, then 가로등 세우기(2) puts up two lamps; 반복하면 한 번에!
(() => {
  const LINES = [{ s: '5번 반복 {', at: 0.25 }, { s: '나무 심기()', at: 0.6, ind: 1 }, { s: '}', at: 1.0 }, { s: '가로등 세우기(2)', at: 3.0 }];
  const RUNS = [1.0, 1.0, 1.0, 3.75];
  SCENES['grow'] = {
    draw(ctx, t, env) {
      const K = VOX, lt = env.lt;
      K.sky(ctx, lt + 12);
      const v = K.view(lerp(54, 47, Ease.ioC(clamp(lt / 3))) + 0.3 * lt, 1320 - 4 * lt, lerp(316, 360, Ease.ioC(clamp(lt / 3))) - 3 * lt);
      const B = K.village().map(b => b.g !== 'more' ? b : b.k < 20 ? { ...b, at: (3 + Math.floor(b.k / 4)) * env.beatSec - 0.42 + (b.k % 4) * 0.06 } : { ...b, at: 9 * env.beatSec - 0.42 + (b.k - 20) * 0.06 });
      K.draw(ctx, v, B, { lt }); K.puffs(ctx, v, B, lt);
      K.code(ctx, 90, 300, 640, LINES, lt, { at: 0, runs: RUNS, file: '나무.블록', rows: 5 });
      K.title(ctx, '반복하면 한 번에!', 96, 210, 84, { alpha: Ease.outC(clamp((lt - 0.1) / 0.4)) });
      const n = Math.min(5, Math.floor(clamp(lt / env.beatSec - 2, 0, 5)));
      if (n > 0) { const c = K.iso(v, 5, 5, 6.5); K.chip(ctx, `나무 ${n}그루`, c[0] - 110, c[1] - 80, 48, lt, { at: 3 * env.beatSec, bg: '#8EDB5A' }); }
    },
  };
})();

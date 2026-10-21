// code (4-5 bars): the core message, shown. The code panel slides in; each line types itself and runs (a yellow flash),
// and its brick drops onto the plot: one line, one block; then a loop drops six at once, a line puts the roof on, a
// line puts in the windows. A chip counts the blocks; 코드 한 줄에 블록 하나 above the panel.
(() => {
  const LINES = [{ s: '놓기(벽돌)', at: 0.5 }, { s: '놓기(벽돌)', at: 1.3 }, { s: '6번 반복 {', at: 2.2 }, { s: '놓기(벽돌)', at: 2.55, ind: 1 }, { s: '}', at: 2.95 }, { s: '지붕 얹기(빨강)', at: 4.5 }, { s: '창문 달기()', at: 5.9 }];
  const RUNS = [0.99, 1.92, 3.3, 3.3, 3.3, 5.2, 6.56];   // each run a beat or more before its block lands on the beat
  SCENES['code'] = {
    draw(ctx, t, env) {
      const K = VOX, lt = env.lt;
      K.sky(ctx, lt + 4);
      const v = K.view(52 + 0.3 * lt, 1300, 340 - 2 * lt);
      const B = K.village().filter(b => b.g !== 'more').map(b => {
        if (b.g !== 'house') return b;
        const B8 = env.beatSec, at = (b.k === 0 ? 3 * B8 : b.k === 1 ? 5 * B8 : b.k < 8 ? (8 + (b.k - 2) * 0.5) * B8 : 12 * B8 + (b.k - 8) * 0.05) - 0.42;
        return { ...b, at, t: b.t === 'window' && lt < 6.5625 ? 'brick' : b.t };
      });
      K.draw(ctx, v, B, { lt }); K.puffs(ctx, v, B, lt);
      // the windows' flash when they go in
      if (lt > 6.5625 && lt < 7.1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const c = K.iso(v, 4, 4, 1.6), r = v.s * 3 * (1 - (lt - 6.5625) / 0.55); const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], Math.max(1, r)); g.addColorStop(0, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore(); }
      K.code(ctx, 90, 300, 640, LINES, lt, { at: 0, runs: RUNS });
      K.title(ctx, '코드 한 줄에 블록 하나', 96, 210, 84, { alpha: Ease.outC(clamp((lt - 0.1) / 0.4)) });
      const n = B.filter(b => b.g === 'house' && b.k < 8 && lt >= b.at + 0.42).length;
      if (n > 0) { const c = K.iso(v, 4, 4, 5.2); K.chip(ctx, `블록 ${n}개`, c[0] - 100, c[1] - 60, 48, lt, { at: 3 * env.beatSec, bg: '#FFFFFF' }); }
    },
  };
})();

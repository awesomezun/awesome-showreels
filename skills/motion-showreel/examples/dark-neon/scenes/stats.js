// stats (3 bars, 30-s cut): three neon numbers switch on and count, one a bar: 탐지까지 0.2초, 오탐률 0.01%, 감시 24시간;
// the network turns small behind them; a note that the figures are invented.
(() => {
  const S = [['탐지까지', 0.2, 1, '초'], ['오탐률', 0.01, 2, '%'], ['감시', 24, 0, '시간']];
  SCENES['stats'] = {
    draw(ctx, t, env) {
      const K = NEON, lt = env.lt, bar = env.barSec;
      ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); K.view(1, 0, 0); K.grid(ctx, 0.6);
      ctx.save(); ctx.globalAlpha = 0.35; K.net(ctx, lt); ctx.restore();
      S.forEach(([label, v, dp, unit], i) => { const l2 = lt - i * bar * 0.9 - 0.2, x = 150 + i * 580; if (l2 < 0) return;
        K.plain(ctx, label, x, 420, 52, { alpha: clamp(l2 / 0.3), track: 4 });
        const val = (v * Ease.outC(clamp(l2 / 0.8))).toFixed(dp);
        K.ntext(ctx, val, x, 600, 170, i === 1 ? K.COL.mag : K.COL.cyan, K.flicker(l2, 10 + i));
        K.ntext(ctx, unit, x + 20 + (val.length * 98), 600, 80, K.COL.white, K.flicker(l2 - 0.2, 20 + i)); });
      K.plain(ctx, '가상의 수치입니다', 150, 780, 40, { alpha: clamp((lt - 2) / 0.4), color: '#5E7480' });
    },
  };
})();

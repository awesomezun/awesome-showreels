// rank (30-second cut, 2 bars): a podium on a sky-blue burst; the cat sleeps on top with a gold crown that drops on;
// 이번 주 낮잠 순위 and 1위.
(() => {
  SCENES['rank'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec;
      K.burst(ctx, lt, '#9FDCFF', '#7CCBFF', 1100);
      ctx.fillStyle = '#FFFFFF'; rr(ctx, 290, 1300, 500, 420, 20); ctx.fill(); ctx.fillStyle = '#E3F3FF'; rr(ctx, 30, 1460, 260, 260, 20); ctx.fill(); rr(ctx, 790, 1520, 260, 200, 20); ctx.fill();
      K.cap(ctx, '1', 540, 1600, 220, lt - 0.2, { style: 'yellow' });
      K.cat(ctx, 540, 1300, 0.85, lt, { pose: 'loaf', face: 'sleep' });
      const cy = lerp(-200, 1010, Ease.outBack(clamp((lt - 2 * B) / 0.35), 1.6)); ctx.fillStyle = '#FFC400'; ctx.beginPath(); ctx.moveTo(560, cy); ctx.lineTo(580, cy - 70); ctx.lineTo(620, cy - 20); ctx.lineTo(660, cy - 80); ctx.lineTo(700, cy - 20); ctx.lineTo(740, cy - 70); ctx.lineTo(760, cy); ctx.closePath(); ctx.fill();
      K.cap(ctx, '이번 주 낮잠 순위', W / 2, 330, 100, lt - 0.3, { style: 'white' });
      K.cap(ctx, '1위!', W / 2, 560, 200, lt - 2.5 * B, { style: 'yellow', bob: true });
      K.zzz(ctx, 700, 1080, lt);
    },
  };
})();

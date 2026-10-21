// timeline (2 bars, 30-s cut): how it got here. A line runs across the years 2023-2026 and a milestone lands on each
// beat: 공공자전거 시작, 강변 자전거길 개통, 출근 지원금, 도로 112km.
(() => {
  const MS = [['2023', '공공자전거 시작'], ['2024', '강변 자전거길 개통'], ['2025', '출근 지원금'], ['2026', '자전거 도로 112km']];
  SCENES['timeline'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      K.rise(ctx, '지난 3년', 140, 200, 76, lt, { at: 0.05 });
      const y = 560, x0 = 260, x1 = 1660, lp = Ease.ioC(rm(lt, 0.2, 0.2 + 4 * B));
      ctx.fillStyle = 'rgba(35,38,43,0.2)'; ctx.fillRect(x0, y - 3, x1 - x0, 6); ctx.fillStyle = C.red; ctx.fillRect(x0, y - 3, (x1 - x0) * lp, 6);
      MS.forEach(([yr, s], i) => {
        const x = lerp(x0, x1, i / 3), at = 0.2 + i * B * 1.3, q = Ease.outBack(clamp((lt - at) / 0.4), 2);
        if (q <= 0) return;
        ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.fillStyle = i === 3 ? C.red : C.navy; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill(); ctx.restore();
        K.text(ctx, yr, x, y - 70, 58, { align: 'center', color: i === 3 ? C.red : C.navy, alpha: clamp(q), w: 900 });
        const up = i % 2 ? 1 : 0;
        K.text(ctx, s, x, y + 110 + up * 70, 44, { align: 'center', alpha: clamp((lt - at - 0.15) / 0.3), w: 700 });
      });
      const dot = (lt * 0.25) % 1; ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(lerp(x0, x1, lp * dot), y, 9, 0, TAU); ctx.fill();
      K.tag(ctx, 1780, 1010, { align: 'right' });
    },
  };
})();

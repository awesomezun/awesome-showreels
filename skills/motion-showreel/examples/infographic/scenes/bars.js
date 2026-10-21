// bars (2-3 bars): the count. Four isometric bars grow out of the ground a beat apart (2023: 4.1만 to 2026: 8.3만),
// their numbers counting up on top; a dashed trend line joins the tops and a red ×2 badge lands on the last one.
(() => {
  const DATA = [[2023, 4.1, '#9DB4C0'], [2024, 5.6, '#5C8DA8'], [2025, 7.0, '#2A9D8F'], [2026, 8.3, '#E76F51']];
  SCENES['bars'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      K.rise(ctx, '자전거로 출근하는 사람', 140, 200, 76, lt, { at: 0.05 });
      K.rise(ctx, '단위: 명', 140, 262, 30, lt, { at: 0.3, color: C.ink2, w: 600 });
      const base = 900, x0 = 480, gap = 300, bw = 170, maxH = 560, tops = [];
      ctx.fillStyle = 'rgba(35,38,43,0.25)'; ctx.fillRect(x0 - 80, base, gap * 4 + 60, 4);
      DATA.forEach(([yr, v, col], i) => {
        const at = 0.3 + i * B, g = Ease.outBack(clamp((lt - at) / 0.55), 1.2), h = maxH * v / 8.3 * g, x = x0 + i * gap;
        K.bar(ctx, x, base, bw, 90, h, col);
        tops.push([x + bw / 2 + 39, base - h - 22]);
        if (g > 0.05) {
          const val = (v * clamp((lt - at) / 0.55)).toFixed(1);
          K.text(ctx, val + '만', x + bw / 2 + 30, base - h - 60, 58, { align: 'center', color: i === 3 ? C.red : C.ink, alpha: clamp(g * 2) });
          K.text(ctx, String(yr), x + bw / 2, base + 60, 40, { align: 'center', color: C.ink2, w: 700, alpha: clamp(g * 2) });
        }
      });
      // the trend line and the ×2 badge
      const tp = rm(lt, 0.3 + 4 * B, 0.3 + 4 * B + 0.6);
      if (tp > 0 && tops.length === 4) {
        ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath();
        const n = 1 + tp * 3; for (let k = 0; k < 4; k++) { if (k > n) break; const f = Math.min(1, n - k + 1); k ? ctx.lineTo(lerp(tops[k - 1][0], tops[k][0], Math.min(1, n - k + 1)), lerp(tops[k - 1][1] - 70, tops[k][1] - 70, Math.min(1, n - k + 1))) : ctx.moveTo(tops[0][0], tops[0][1] - 70); }
        ctx.stroke(); ctx.restore();
        const bp = Ease.outBack(clamp((lt - (0.3 + 4 * B + 0.5)) / 0.4), 2);
        if (bp > 0) { const [bx, by] = tops[3]; ctx.save(); ctx.translate(bx + 170, by - 120); ctx.scale(bp, bp); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 92, 0, TAU); ctx.fill();
          ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.font = K.f(78, 900); ctx.fillText('×2', 0, 26); ctx.restore(); }
      }
      onBars(env, 1, (n, dt) => { const q = dt / 0.6; if (q < 1) { const [bx, by] = tops[3] || [0, 0]; ctx.save(); ctx.strokeStyle = C.red; ctx.globalAlpha = 1 - q; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx + 170, by - 120, 92 + 50 * q, 0, TAU); ctx.stroke(); ctx.restore(); } });
      K.tag(ctx, 1780, 1010, { align: 'right' });
    },
  };
})();

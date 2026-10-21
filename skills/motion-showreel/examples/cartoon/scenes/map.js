// map (3 bars, 30-s cut): a cartoon map of the neighbourhood; a dotted route draws itself between houses and a park
// and paw prints follow it on the beat to a flag; 처음 가 보는 / 산책길 추천.
(() => {
  SCENES['map'] = {
    draw(ctx, t, env) {
      const K = TOON, lt = env.lt, C = K.COL, B = env.beatSec;
      ctx.fillStyle = '#BEE9A7'; ctx.fillRect(0, 0, W, H);
      K.ink(ctx, c => { c.moveTo(-20, 620); c.bezierCurveTo(500, 520, 900, 900, 1940, 760); c.lineTo(1940, 860); c.bezierCurveTo(900, 1000, 500, 620, -20, 720); c.closePath(); }, '#7CC4FF', { lw: 6 });
      for (const [x, y, col] of [[1080, 260, '#FF8F8F'], [1500, 200, '#FFD23F'], [1720, 420, '#B49CFF'], [880, 420, '#FFB86B']]) { K.ink(ctx, c => c.rect(x, y, 140, 110), C.white, { lw: 6 }); K.ink(ctx, c => { c.moveTo(x - 14, y); c.lineTo(x + 70, y - 70); c.lineTo(x + 154, y); c.closePath(); }, col, { lw: 6 }); }
      for (const [x, y] of [[1300, 560], [1400, 600], [1240, 640]]) K.circle(ctx, x, y + Math.sin(lt * 4 + x) * 4, 50, '#4CAF50', { shade: [8, 8] });
      const path = u => [lerp(700, 1750, u), 860 - Math.sin(u * Math.PI) * 420 + Math.sin(u * 9) * 30], k = clamp((lt - 0.3) / 3.2);
      ctx.save(); ctx.setLineDash([4, 24]); ctx.lineDashOffset = -lt * 60; ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = C.red; ctx.beginPath(); for (let i = 0; i <= 80 * k; i++) { const [x, y] = path(i / 80); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      const n = Math.floor(clamp((lt - 0.3) / B, 0, 12)); for (let i = 0; i < n; i++) { const [x, y] = path(Math.min(1, (i + 0.5) / 12 * (k > 0 ? 1 : 0))); ctx.save(); ctx.translate(x, y - 30); ctx.rotate(i % 2 ? 0.3 : -0.3); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(0, 0, 14, 12, 0, 0, TAU); ctx.fill(); for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(-12 + j * 12, -16, 5, 0, TAU); ctx.fill(); } ctx.restore(); }
      if (k >= 1) { const [fx, fy] = path(1); K.ink(ctx, c => c.rect(fx, fy - 180, 10, 180), C.ink, { lw: 4 }); const wv = Math.sin(lt * 9) * 14; K.ink(ctx, c => { c.moveTo(fx + 10, fy - 180); c.quadraticCurveTo(fx + 60, fy - 165 + wv, fx + 110, fy - 150 + wv * 0.5); c.lineTo(fx + 10, fy - 120); c.closePath(); }, C.red, { lw: 6 }); }
      K.pop(ctx, '처음 가 보는', 110, 220, 90, lt, { at: 0.2, fam: FAM.sans });
      K.pop(ctx, '산책길 추천', 110, 370, 140, lt, { at: 0.6, fill: C.yel });
    },
  };
})();

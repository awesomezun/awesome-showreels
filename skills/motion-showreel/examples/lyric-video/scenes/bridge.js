// bridge (30-second cut, 2 bars): the route map, the bus icon running along the dotted coast line towards the last
// stop; the bell, and the destination board: 다음 정류장은 여름입니다.
(() => {
  SCENES['bridge'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec;
      U.route(ctx, lerp(0.15, 0.9, lt / env.dur), t);
      const a = clamp((lt - 1 * b) / (0.4 * b)); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#14161C'; rr(ctx, 360, 120, 1200, 150, 20); ctx.fill(); ctx.strokeStyle = '#3A3F4C'; ctx.lineWidth = 8; ctx.stroke();
      ctx.fillStyle = '#FF9A2E'; ctx.font = U.F(84); ctx.textAlign = 'center'; const s = '다음 정류장은 여름입니다', n = Math.round(clamp((lt - 1.2 * b) / (2 * b)) * s.length); ctx.fillText(s.slice(0, Math.max(0, n)), W / 2, 225);
      ctx.fillStyle = 'rgba(255,154,46,0.12)'; for (let y = 130; y < 270; y += 6) ctx.fillRect(370, y, 1180, 2); ctx.restore();
    },
  };
})();

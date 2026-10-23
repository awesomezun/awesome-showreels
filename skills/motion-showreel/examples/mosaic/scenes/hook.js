// hook (2 bars): a plain white tile wall in a subway corridor with the line's blue band and a station sign; on beat
// 1.5 a wave of tiles flips out from the left and the wall becomes a spring garden; the label plate: 유리 타일 정원.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const M = TILE, lt = env.lt, B = env.beatSec;
      const st = M.state(lt, 'wall', [{ at: 1.5 * B, to: 'g0', wave: { o: [24, 40], spd: 95, dur: 0.35, jit: 0.2 } }], { time: t, tw: 0.02 });
      M.draw(ctx, st, { s: 1 + 0.03 * lt / env.dur });
      const sa = 1 - M.flipAt(st, 132, 20) * 2;
      if (sa > 0) { ctx.save(); ctx.globalAlpha = clamp(sa); ctx.fillStyle = M.COL.ink; rr(ctx, 1290, 160, 540, 150, 14); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(78, 'sans'); ctx.fillText('가람', 1330, 258);
        ctx.font = M.F(34, 'sans'); ctx.fillText('Garam · 2번 출구', 1500, 258); ctx.restore(); }
      const a = (lt - 4.6 * B) / (0.6 * B); M.plaque(ctx, 90, 790, 800, 210, a);
      M.text(ctx, '유리 타일 정원', 150, 890, 92, a, { halo: false }); M.text(ctx, '가람역 2번 출구 · 공공미술', 154, 950, 38, a - 0.3, { fam: 'sans', halo: false, color: '#33507F' });
    },
  };
})();

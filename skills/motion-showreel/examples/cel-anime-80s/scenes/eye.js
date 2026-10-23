// eye (30-second cut, 2 bars): her eye, close: the city's lights in the iris, a car's light sweeps across the face,
// she blinks once (on twos) and a star flashes in the highlight; 너를 처음 만난, 그 여름.
(() => {
  SCENES['eye'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec, tq = C.q(lt);
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F3C2AE'); g.addColorStop(1, '#E2A08F'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,110,140,0.25)'; ctx.beginPath(); ctx.ellipse(1500, 980, 300, 120, -0.2, 0, Math.PI * 2); ctx.fill();
      const bl = tq < 4 * B ? 0 : Math.max(0, 1 - Math.abs(tq - 4.5 * B) / (0.5 * B)), star = Math.max(0, 1 - Math.abs(lt - 6 * B) / (0.6 * B));
      C.eye(ctx, 960, 540, 1.25 + 0.08 * lt / env.dur, t, bl, { star });
      const hs = ctx.createLinearGradient(0, 0, 0, 260); hs.addColorStop(0, 'rgba(60,30,80,0.45)'); hs.addColorStop(1, 'rgba(60,30,80,0)'); ctx.fillStyle = hs; ctx.fillRect(0, 0, W, 260);
      const sx = lerp(-900, W + 900, clamp((lt - 1.5 * B) / (3 * B))); ctx.save(); ctx.globalCompositeOperation = 'screen'; const lg = ctx.createLinearGradient(sx - 400, 0, sx + 400, 0); lg.addColorStop(0, 'rgba(127,232,255,0)'); lg.addColorStop(0.5, 'rgba(127,232,255,0.45)'); lg.addColorStop(1, 'rgba(255,79,154,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore();
      C.line(ctx, '너를 처음 만난, 그 여름', W / 2, 1000, 60, Math.min((lt - 0.6 * B) / (0.6 * B), (env.dur - 0.3 - lt) / 0.3));
      C.vhs(ctx, t);
    },
  };
})();

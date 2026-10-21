// night (2 bars, 30-s cut): the paper takes a grey-blue wash, a pale moon rises with a halo, the wall is a dark line
// with small warm lantern lights moving along it; 달빛 성곽 야간 코스.
(() => {
  SCENES['night'] = {
    draw(ctx, t, env) {
      const K = MEOK, lt = env.lt, cam = 900 + lt * 60;
      K.paper(ctx, { col: '#B9BCC0' }); ctx.fillStyle = 'rgba(40,50,70,0.28)'; ctx.fillRect(0, 0, W, H);
      const my = lerp(520, 260, Ease.outC(clamp(lt / 3))), g = ctx.createRadialGradient(1400, my, 60, 1400, my, 380); g.addColorStop(0, 'rgba(250,246,230,0.7)'); g.addColorStop(0.25, 'rgba(250,246,230,0.32)'); g.addColorStop(0.6, 'rgba(250,246,230,0.08)'); g.addColorStop(1, 'rgba(250,246,230,0)'); ctx.fillStyle = g; ctx.fillRect(1000, my - 380, 800, 760);
      ctx.fillStyle = '#F6F1E2'; ctx.beginPath(); ctx.arc(1400, my, 90, 0, TAU); ctx.fill();
      K.range(ctx, 8, 760, 280, cam, 0.5, 0.45, { blur: 8 }); K.mist(ctx, 760, lt + 60, 0.35);
      K.range(ctx, 9, 1040, 360, cam, 1, 0.85, { blur: 3 });
      const pts = K.wall(ctx, 9, 1040, 360, cam, 1, -40, 1960, 1);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const idx = Math.floor(((0.15 + i * 0.13 + lt * 0.015) % 1) * (pts.length - 1)), [x, y] = pts[idx], r = 22 + 6 * Math.sin(lt * 5 + i); const lg = ctx.createRadialGradient(x, y - 40, 0, x, y - 40, r); lg.addColorStop(0, 'rgba(255,200,120,0.9)'); lg.addColorStop(1, 'rgba(255,170,90,0)'); ctx.fillStyle = lg; ctx.fillRect(x - r, y - 40 - r, 2 * r, 2 * r); } ctx.restore();
      K.brush(ctx, '달빛 성곽', 120, 300, 160, lt, { at: 0.3, dur: 1.0, color: 'rgba(250,246,230,0.95)' });
      K.label(ctx, '야간 코스', 130, 420, 64, { a: clamp((lt - 1.2) / 0.5), color: 'rgba(250,246,230,0.9)' });
    },
  };
})();

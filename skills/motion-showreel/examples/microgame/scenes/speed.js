// speed (1 bar): 속도 UP! on rushing speed lines, then LEVEL 2.
(() => {
  SCENES['speed'] = {
    draw(ctx, t, env) {
      const M = MINI, lt = env.lt, B = env.beatSec; ctx.fillStyle = '#FF2E4D'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, H / 2); for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2 + hash(i) * 0.1, r0 = ((hash(i * 3) * 900 + lt * 2400) % 900) + 150; ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.8)' : 'rgba(255,225,77,0.8)'; ctx.lineWidth = 10 + 10 * hash(i);
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * (r0 + 260), Math.sin(a) * (r0 + 260)); ctx.stroke(); } ctx.restore();
      M.text(ctx, '속도 UP!', W / 2, 560, 250, (lt - 0.05) / (0.15 * B), { pop: lt, rot: -0.06, color: '#FFE14D' }); M.text(ctx, 'LEVEL 2', W / 2, 760, 96, (lt - 2 * B) / (0.2 * B), { fam: 'mono', pop: lt - 2 * B });
    },
  };
})();

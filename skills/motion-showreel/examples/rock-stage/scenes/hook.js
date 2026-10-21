// hook (2 bars, the intro): the amp's volume knob in the dark. The guitar rings one chord a bar and the knob turns
// from 0 to 11, the numbers lighting as it passes; the muted sixteenths of the build shake it; 볼륨 업 slams in on the
// last beat. The band and the show are named from the first beat.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = ROCK, lt = env.lt, L = K.levels(env.cut, t), B = env.beatSec;
      ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(960, 600, 0, 960, 600, 900); g.addColorStop(0, `rgba(120,16,16,${0.35 + 0.4 * L.guitar})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const v = 11 * Ease.inC(clamp((lt - 0.3) / (6 * B - 0.3))), shake = (L.guitar > 0.2 && lt > 4 * B) ? 6 * L.guitar : 0;
      ctx.save(); ctx.translate(Math.sin(t * 90) * shake, Math.cos(t * 77) * shake); K.knob(ctx, 960, 620, 230, v, L.guitar); ctx.restore();
      K.text(ctx, '번개다방 단독 공연', 960, 150, 64, { align: 'center', alpha: clamp(lt / 0.3) });
      if (lt > 6 * B) { const a = clamp(1 - (lt - 6 * B) / 0.25); ctx.fillStyle = `rgba(255,255,255,${0.8 * a})`; ctx.fillRect(0, 0, W, H); }
      K.slam(ctx, '볼륨 업', 960, 700, 300, lt, { at: 6 * B, align: 'center', rot: -0.04 });
    },
  };
})();

// toggle (30-second cut, 2 bars): the ring closes into an ink switch with a white knob; on the third beat the knob
// slides across and the switch turns coral; 알림 켜기.
(() => {
  SCENES['toggle'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt, B = env.beatSec, on = spring(Math.max(0, lt - 2 * B), 3, 0.5);
      K.ground(ctx);
      K.scene(ctx, env, 'toggle', { color: mix(mix(K.SCOL[K.prev(env, 'check')], K.COL.ink, clamp(lt / 0.35)), K.COL.coral, clamp(on)) });
      const kx = lerp(K.CX - 95, K.CX + 95, on), a = clamp((lt - 0.3) / 0.2);
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(kx, K.CY, 72 * Ease.outBack(a), 0, Math.PI * 2); ctx.fill(); ctx.restore();
      K.text(ctx, '알림 켜기', K.CX, 820, 72, (lt - 0.4) / 0.35);
    },
  };
})();

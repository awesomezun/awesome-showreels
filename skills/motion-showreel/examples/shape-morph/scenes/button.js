// button (2 bars): the dot springs out into a coral pill button, overshooting and settling; 오늘 할 일 + appears in it;
// on the next bar it is pressed (a squash and a ring); under it 할 일은 버튼 하나로.
(() => {
  SCENES['button'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt, B = env.beatSec, press = lt > 4 * B ? Math.exp(-(lt - 4 * B) * 9) * Math.sin(Math.PI * clamp((lt - 4 * B) / 0.12)) : 0;
      K.ground(ctx);
      ctx.save(); ctx.translate(K.CX, K.CY); ctx.scale(1 + 0.04 * press, 1 - 0.1 * press); ctx.translate(-K.CX, -K.CY); K.scene(ctx, env, 'pill'); ctx.restore();
      K.text(ctx, '오늘 할 일  +', K.CX, K.CY + 24, 68, (lt - 0.3) / 0.25, { color: '#FFFFFF' });
      if (lt > 4 * B) { const r = (lt - 4 * B); ctx.save(); ctx.strokeStyle = K.COL.coral; ctx.lineWidth = 4; ctx.globalAlpha = clamp(1 - r / 0.6); rr(ctx, K.CX - 300 - r * 120, K.CY - 85 - r * 60, 600 + r * 240, 170 + r * 120, 85 + r * 60); ctx.stroke(); ctx.restore(); }
      K.text(ctx, '할 일은 버튼 하나로', K.CX, 820, 72, (lt - 0.6) / 0.35);
    },
  };
})();

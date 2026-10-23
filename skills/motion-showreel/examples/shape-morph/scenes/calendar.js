// calendar (1 bar; 2 in the 30-second cut): the shape opens into a large ink card; a week grid of dates fades in row by
// row and today pops as a coral dot; 한 주가 한눈에.
(() => {
  SCENES['calendar'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt;
      K.ground(ctx);
      K.scene(ctx, env, 'calendar');
      ctx.save(); ctx.font = K.F(34, 700); ctx.textAlign = 'center';
      ['월', '화', '수', '목', '금', '토', '일'].forEach((d, i) => { ctx.globalAlpha = clamp((lt - 0.3) / 0.2); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(d, K.CX - 240 + i * 80, K.CY - 190); });
      for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const n = r * 7 + c + 1; if (n > 31) continue; const x = K.CX - 240 + c * 80, y = K.CY - 110 + r * 74, a = clamp((lt - 0.35 - r * 0.06) / 0.2);
        if (n === 17) { const s = Ease.outBack(clamp((lt - 0.7) / 0.25), 2); ctx.globalAlpha = 1; ctx.fillStyle = K.COL.coral; ctx.beginPath(); ctx.arc(x, y - 10, 28 * s, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = a; ctx.fillStyle = '#FFFFFF'; ctx.fillText(String(n), x, y); }
      ctx.restore();
      K.text(ctx, '한 주가 한눈에', K.CX, 880, 66, (lt - 0.5) / 0.3);
    },
  };
})();

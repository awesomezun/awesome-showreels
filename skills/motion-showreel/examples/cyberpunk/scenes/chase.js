// chase (3 bars, 30-s cut): between the towers at speed: flying cars streak past at three depths, the signs smear
// into light trails, the rain flies sideways; 빗속의 서울을 / 달려라.
(() => {
  SCENES['chase'] = {
    draw(ctx, t, env) {
      const K = CYBER, lt = env.lt, hz = 980, pan = lt * 900;
      K.sky(ctx, { horizon: hz });
      K.towers(ctx, lt, { depth: 0, horizon: hz, pan: pan * 0.4 });
      K.towers(ctx, lt, { depth: 1, horizon: hz, pan: pan, signs: true, scale: 0.85 });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 30; i++) { const y = 120 + hash(i * 3.1) * 800, x = ((hash(i * 7.3) * (W + 800) - lt * (1400 + 900 * hash(i))) % (W + 800) + W + 800) % (W + 800) - 400, c = [K.COL.mag, K.COL.cyan, K.COL.yel][i % 3];
        const g = ctx.createLinearGradient(x, 0, x + 380, 0); g.addColorStop(0, K.rgba(c, 0)); g.addColorStop(1, K.rgba(c, 0.5)); ctx.fillStyle = g; ctx.fillRect(x, y, 380, 3 + (i % 3)); } ctx.restore();
      for (let i = 0; i < 4; i++) { const s = [0.6, 0.9, 1.4, 2.0][i], y = [340, 520, 700, 880][i], x = ((hash(i * 5) * 2600 + lt * [600, 900, 1300, 1900][i]) % 2600) - 400; K.car(ctx, x, y, s, 1, 420); }
      K.rain(ctx, lt, { n: 420, vx: -1600, vy: 1400, len: 60 });
      K.scrim(ctx);
      K.gtext(ctx, '빗속의 서울을', 110, 360, 120, lt, { a: clamp((lt - 0.3) / 0.12) });
      K.gtext(ctx, '달려라.', 110, 540, 170, lt, { a: clamp((lt - 1.0) / 0.12), color: K.COL.mag });
      K.slices(ctx, lt, lt < 0.2 ? 1 : 0);
    },
  };
})();

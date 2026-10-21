// end (2-3 bars): the mark and the name burn steady, with a slow hum in the tubes; AI 보안 플랫폼 and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = NEON, lt = env.lt;
      ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); K.view(1, 0, 0); K.grid(ctx, 0.8);
      const hum = 0.9 + 0.1 * Math.sin(lt * 23) * Math.sin(lt * 3.1);
      K.mark(ctx, 560, 500, 190, hum);
      K.ntext(ctx, '센티넬', 820, 540, 170, K.COL.cyan, hum);
      K.ntext(ctx, 'X', 1400, 540, 170, K.COL.mag, hum * K.flicker(lt - 0.1, 41));
      K.plain(ctx, 'AI 보안 플랫폼', 826, 660, 56, { track: 8 });
      K.plain(ctx, '가상의 제품 · 예제', 826, 750, 40, { alpha: clamp((lt - 0.4) / 0.4), color: '#5E7480' });
      const sweep = ((lt * 0.5) % 1.4) - 0.2; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(sweep * W - 200, 0, sweep * W + 200, 0); g.addColorStop(0, 'rgba(46,242,255,0)'); g.addColorStop(0.5, 'rgba(46,242,255,0.06)'); g.addColorStop(1, 'rgba(46,242,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    },
  };
})();

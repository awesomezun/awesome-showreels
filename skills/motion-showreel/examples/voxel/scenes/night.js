// night (3 bars, 30-s cut): 밤 되기() runs and the sky turns to night; the world dims, the windows and the two lamps
// light up, stars and fireflies come out; 내 마을에 불이 켜져요.
(() => {
  SCENES['night'] = {
    draw(ctx, t, env) {
      const K = VOX, lt = env.lt, n = Ease.ioC(rm(lt, 0.7, 1.9));
      K.sky(ctx, lt + 20, n);
      const v = K.view(47 + 0.5 * lt, 1330, 370 - 3 * lt);
      K.draw(ctx, v, K.village(), { lt, night: n });
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 14; i++) { const c = K.iso(v, 1 + hash(i * 2.3) * 8 + Math.sin(lt * 0.8 + i) * 0.6, 1 + hash(i * 5.1) * 8 + Math.cos(lt * 0.7 + i) * 0.6, 1.4 + Math.sin(lt * 1.3 + i * 2) * 0.5);
        const a = n * (0.5 + 0.5 * Math.sin(lt * 4 + i * 1.7)); const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 14); g.addColorStop(0, `rgba(230,255,140,${a})`); g.addColorStop(1, 'rgba(230,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(c[0] - 14, c[1] - 14, 28, 28); }
      ctx.restore();
      K.code(ctx, 90, 440, 640, [{ s: '밤 되기()', at: 0.15 }], lt, { at: 0, runs: [0.7], file: '밤.블록', rows: 1, out: 2.2 });
      K.title(ctx, '내 마을에', 96, lt < 2.2 ? 210 : lerp(210, 420, Ease.ioC(clamp((lt - 2.2) / 0.5))), 96, { alpha: Ease.outC(clamp((lt - 0.9) / 0.4)), color: '#FFE27A', side: '#0E1640' });
      K.title(ctx, '불이 켜져요', 96, lt < 2.2 ? 320 : lerp(320, 540, Ease.ioC(clamp((lt - 2.2) / 0.5))), 96, { alpha: Ease.outC(clamp((lt - 1.2) / 0.4)), color: '#FFFFFF', side: '#0E1640' });
    },
  };
})();

// city (30-second cut, 2 bars): the road runs through a neon city: building silhouettes slide past with lit window
// grids and glowing signs, the sun sinking behind them; 네온 시티를 지나, 8개 코스.
(() => {
  SCENES['city'] = {
    draw(ctx, t, env) {
      const K = OUTRUN, lt = env.lt;
      K.sky(ctx); K.sun(ctx, W / 2, 520, 200, lt);
      ctx.save(); for (let layer = 0; layer < 2; layer++) { const sp = layer ? 160 : 80, base = K.HY + (layer ? 10 : 0);
        for (let i = -1; i < 14; i++) { const w = 110 + 70 * hash(i * 3 + layer), x = ((i * 150 - lt * sp) % 2100 + 2100) % 2100 - 150, h = (layer ? 300 : 200) + 260 * hash(i * 7 + layer);
          ctx.fillStyle = layer ? '#13031F' : '#22073A'; ctx.fillRect(x, base - h, w, h);
          for (let r = 0; r < h / 26 - 1; r++) for (let c = 0; c < w / 22 - 1; c++) if (hash(i * 31 + r * 7 + c * 3 + layer) > 0.55) { ctx.fillStyle = hash(r + c + i) > 0.5 ? 'rgba(255,200,120,0.75)' : 'rgba(60,240,255,0.6)'; ctx.fillRect(x + 10 + c * 22, base - h + 14 + r * 26, 10, 12); }
          if (layer && hash(i * 5) > 0.6) { ctx.save(); ctx.shadowColor = '#FF3CC8'; ctx.shadowBlur = 20; ctx.strokeStyle = '#FF3CC8'; ctx.lineWidth = 5; ctx.strokeRect(x + 14, base - h + 20, w - 28, 36); ctx.restore(); } } }
      ctx.restore();
      K.grid(ctx, lt, 2.4, { road: true });
      K.car(ctx, W / 2, 1000, 0.82, lt, { bank: 0.03 * Math.sin(lt * 2) });
      K.neon(ctx, '네온 시티를 지나', W / 2, 200, 84, (lt - 0.3) / 0.2, { col: '#FF3CC8', flicker: lt });
      K.neon(ctx, '8개 코스', W / 2, 310, 84, (lt - 0.7) / 0.2, { col: '#3CF0FF', flicker: lt + 3 });
      K.vhs(ctx, lt, { clock: 13 });
    },
  };
})();

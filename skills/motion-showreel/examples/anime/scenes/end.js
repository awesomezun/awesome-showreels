// end (2-3 bars): golden hour at the stop; petals; 벚꽃 정류장, where and when, the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = HARU, lt = env.lt;
      const g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#3D6CC9'); g.addColorStop(0.55, '#F2A6A0'); g.addColorStop(1, '#FFD7A0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 900);
      K.cloud(ctx, 1300 + lt * 10, 330, 1.0, 51, { a: 0.9 }); K.sun(ctx, 1500, 560, lt, 1); K.wires(ctx, 220, 20); K.street(ctx, 820);
      K.tree(ctx, 1550, 900, 1.05, lt); K.stop(ctx, 860, 960, lt, { board: false }); K.pair(ctx, 1030, 830, 1.0, lt);
      ctx.fillStyle = 'rgba(255,170,120,0.18)'; ctx.fillRect(0, 0, W, H);
      K.petals(ctx, lt, { n: 60 });
      K.line(ctx, '벚꽃 정류장', 110, 300, 160, lt, { at: 0.1 });
      K.line(ctx, '매주 토요일 · 한빛툰', 116, 420, 64, lt, { at: 0.5 });
      K.line(ctx, '가상의 웹툰 · 예제', 116, 500, 44, lt, { at: 0.8, color: '#FFE4EE' });
    },
  };
})();

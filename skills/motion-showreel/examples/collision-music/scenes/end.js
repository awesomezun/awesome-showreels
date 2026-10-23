// end (3 bars): three marbles fall together and land on three bars at once, a chord; then another; the bars keep
// glowing and notes drift up; 떨어지는 모든 것이 / 노래가 돼요, 통통 악기 놀이 · 가상의 앱입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = TONG, lt = env.lt, hits = K.hits(env);
      K.ground(ctx); K.staff(ctx, hits, lt, { a: lt / 0.3, v: 220 });
      for (let i = 0; i < 14; i++) { const ph = (lt * 0.25 + hash(i * 3)) % 1, x = 120 + hash(i * 7) * 1680, y = 1080 - ph * 1000; ctx.save(); ctx.globalAlpha = 0.35 * Math.sin(Math.PI * ph); ctx.fillStyle = K.RAIN[i % 8]; ctx.beginPath(); ctx.ellipse(x, y, 14, 10, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + 10, y - 44, 4, 44); ctx.restore(); }
      K.bars(ctx, hits, lt); K.balls(ctx, hits, lt, ['#FF6B9F', '#54A0FF', '#FECA57']);
      K.text(ctx, '떨어지는 모든 것이', 140, 200, 84, (lt - 1.2) / 0.4);
      K.text(ctx, '노래가 돼요', 140, 300, 84, (lt - 1.5) / 0.4, { color: '#FF6B9F' });
      K.text(ctx, '통통 악기 놀이 · 가상의 앱입니다', 146, 370, 36, (lt - 2.0) / 0.4, { fam: 'sans' });
    },
  };
})();

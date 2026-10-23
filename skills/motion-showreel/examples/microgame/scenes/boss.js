// boss (30-second cut, 3 bars): 모두 터뜨려! a wall of balloons, one popping on every beat, then the last big one.
(() => {
  SCENES['boss'] = {
    draw(ctx, t, env) {
      const M = MINI, lt = env.lt, B = env.beatSec, b = lt / B; M.stripes(ctx, '#7B61FF', t, 400);
      const cols = ['#FF4F9A', '#FFE14D', '#3DA5FF', '#2ECC71', '#FF8A3D'];
      for (let i = 0; i < 9; i++) { const x = 300 + (i % 5) * 330 + (i >= 5 ? 165 : 0), y = i < 5 ? 520 : 800, pb = 2 + i; if (b < pb) { ctx.beginPath(); ctx.moveTo(x, y + 110); ctx.lineTo(x + 10, y + 220); M.out(ctx, 4);
          ctx.beginPath(); ctx.ellipse(x, y + Math.sin(t * 3 + i) * 8, 95, 115, 0, 0, Math.PI * 2); ctx.fillStyle = cols[i % 5]; ctx.fill(); M.out(ctx); } else M.burst(ctx, x, y, (b - pb) / 0.8, 8, 200); }
      M.text(ctx, '모두 터뜨려!', W / 2, 300, 170, (lt - 0.1) / 0.2, { pop: lt });
      M.hud(ctx, 'BOSS', 2200 + 100 * clamp(Math.floor(b - 1), 0, 9), clamp(b / 11), t);
    },
  };
})();

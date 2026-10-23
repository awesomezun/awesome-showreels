// chorus (30-second cut, 4 bars): the bus jumps on every second beat with confetti, the sun turning behind; the chorus:
// 파란 버스, 파란 하늘 / 우리 노래 싣고 가요 / 파란 버스, 파란 하늘 / 여름잠에서 깨어나.
(() => {
  SCENES['chorus'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec, dist = 6000 + lt * 1100, ph = (lt / (2 * b)) % 1, jump = -Math.sin(Math.PI * ph) * 70;
      U.sky(ctx, t); U.sun(ctx, 960, 560, 150, t); U.clouds(ctx, t, 60); U.sea(ctx, t, 600, 790, dist * 0.2); U.road(ctx, dist * 0.6); U.pines(ctx, dist * 0.6, 830, 0.8, 0.5);
      U.bus(ctx, 960, 960 + jump, 0.95, t, b, dist); U.sign(ctx, 960, 960 + jump, 0.95, t, b);
      const cols = ['#FFE15C', '#FF7A9A', '#7CE0FF', '#FFFFFF', '#8BE38B']; for (let i = 0; i < 60; i++) { const sp = 200 + 160 * hash(i), y = ((hash(i * 3) * 1300 + lt * sp) % 1300) - 100, x = hash(i * 7) * W + Math.sin(lt * 3 + i) * 30;
        ctx.save(); ctx.translate(x, y); ctx.rotate(lt * 4 + i); ctx.fillStyle = cols[i % 5]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
      U.lyrics(ctx, env, ['파란 버스, 파란 하늘', '우리 노래 싣고 가요', '파란 버스, 파란 하늘', '여름잠에서 깨어나'], 250, { size: 128 });
    },
  };
})();

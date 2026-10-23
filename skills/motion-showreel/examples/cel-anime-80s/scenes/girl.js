// girl (2 bars): on the bridge at night she looks out at the city, her hair streaming in the river wind (drawn on
// twos), rim-lit cyan and pink by the lights; out-of-focus city lights behind; 그해 여름, 도시는 반짝였다.
(() => {
  SCENES['girl'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec, s = 1 + 0.05 * lt / env.dur;
      C.sky(ctx, 760, { top: '#1A0C40' }); C.skyline(ctx, 760, 900 + lt * 8, t, 0.9); C.bokeh(ctx, t, 22);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
      C.girl(ctx, 1280, 430, 1.05, t, { wind: 1 });
      ctx.fillStyle = '#120A2A'; ctx.fillRect(-40, 960, W + 80, 30); for (const x of [80, 420, 760]) ctx.fillRect(x, 960, 18, 160);
      ctx.fillStyle = 'rgba(127,232,255,0.55)'; ctx.fillRect(-40, 960, W + 80, 4); ctx.restore();
      C.line(ctx, '그해 여름,', 150, 300, 84, (lt - 1.0 * B) / (0.6 * B), { align: 'left' });
      C.line(ctx, '도시는 반짝였다', 150, 410, 84, (lt - 2.2 * B) / (0.6 * B), { align: 'left' });
      C.vhs(ctx, t);
    },
  };
})();

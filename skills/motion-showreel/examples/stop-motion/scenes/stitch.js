// stitch (2-3 bars): the core message, close up. A needle trailing red yarn goes round the bear's head and a stitch
// appears on every beat (한 땀씩,); then felt sheets in five colours land on a stack one at a time (한 장씩.).
(() => {
  SCENES['stitch'] = {
    draw(ctx, t, env) {
      const K = FELT, lt = env.lt, st = K.step(lt), B = env.beatSec;
      K.begin(ctx, lt); K.mat(ctx);
      const hx = 1360, hy = 560, R = 300;
      K.circleFelt(ctx, hx - 230, hy - 210, 95, K.COL.bear); K.circleFelt(ctx, hx + 230, hy - 210, 95, K.COL.bear);
      K.circleFelt(ctx, hx, hy, R, K.COL.bear);
      K.ellFelt(ctx, hx, hy + 80, 120, 85, K.COL.cream, { lift: 4 }); K.button(ctx, hx - 115, hy - 60, 40, '#3A2A20'); K.button(ctx, hx + 115, hy - 60, 40, '#3A2A20');
      // stitches round the head: one more every beat
      const n = Math.min(26, Math.floor(st / B) + 1), a0 = Math.PI * 0.75, step = TAU / 28;
      ctx.save(); ctx.strokeStyle = K.COL.thread; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowOffsetY = 2;
      for (let i = 0; i < n; i++) { const a = a0 + i * step; ctx.beginPath(); ctx.arc(hx, hy, R - 30, a, a + step * 0.55); ctx.stroke(); } ctx.restore();
      const an = a0 + n * step, nx = hx + Math.cos(an) * (R - 30), ny = hy + Math.sin(an) * (R - 30);
      K.needle(ctx, nx + 30, ny - 20, an + Math.PI / 2 + (K.frame(lt) % 2 ? 0.1 : -0.05), 1820, 1000);
      // the stack of felt sheets
      const sheets = ['#F2A6B3', '#F6E7CF', '#9FC7E8', '#E8A15A', '#A8754F'], m = Math.max(0, Math.min(5, Math.floor((st - env.dur * 0.45) / B) + 1));
      for (let i = 0; i < m; i++) K.felt(ctx, c => c.rect(130 + (i % 2) * 10, 900 - i * 26, 520, 120), sheets[i], [130, 900 - i * 26, 530, 120], { lift: 6 });
      K.label(ctx, 110, 150, 640, 470);
      K.hand(ctx, '한 땀씩,', 170, 330, 140, { a: st > 0.2 ? 1 : 0 });
      K.hand(ctx, '한 장씩.', 170, 520, 140, { a: st > env.dur * 0.45 ? 1 : 0, color: '#C9776A' });
      K.end(ctx, lt);
    },
  };
})();

// lesson (2 bars, 30-s cut): a weekend class: a big paper note pinned to the mat (주말 원데이 클래스 / 토·일 오후 2시 /
// 인형 하나, 하루면 완성) while a ball of yarn rolls across in steps.
(() => {
  SCENES['lesson'] = {
    draw(ctx, t, env) {
      const K = FELT, lt = env.lt, st = K.step(lt);
      K.begin(ctx, lt); K.mat(ctx);
      const yx = lerp(1900, 1250, Ease.outC(clamp(st / 2))), yr = st * 3;
      K.circleFelt(ctx, yx, 830, 130, '#E8574F'); ctx.save(); ctx.translate(yx, 830); ctx.rotate(yr); ctx.strokeStyle = 'rgba(255,200,190,0.7)'; ctx.lineWidth = 5; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 120, Math.abs(i) * 30 + 10, 0.6, 0, TAU); ctx.stroke(); } ctx.restore();
      K.label(ctx, 140, 160, 1000, 640);
      K.hand(ctx, '주말 원데이 클래스', 220, 320, 110);
      K.hand(ctx, '토·일 오후 2시', 220, 480, 96, { color: '#C9776A', a: st > 0.4 ? 1 : 0 });
      K.hand(ctx, '인형 하나, 하루면 완성', 220, 640, 80, { a: st > 0.9 ? 1 : 0 });
      K.end(ctx, lt);
    },
  };
})();

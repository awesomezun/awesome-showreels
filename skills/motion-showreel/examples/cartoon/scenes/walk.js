// walk (4-5 bars): the core message. 멍멍 runs flat out through the park as it scrolls by; an app card counts the
// steps up; on the downbeat of the third bar a 동네 1등 burst pops and a crown drops onto the dog's head;
// 오늘도 / 산책 1등!
(() => {
  SCENES['walk'] = {
    draw(ctx, t, env) {
      const K = TOON, lt = env.lt, C = K.COL, bar = env.barSec, crownAt = 2 * bar;
      K.park(ctx, lt * 900);
      K.speed(ctx, 760, 560, 400, 300, lt, 0.7);
      const cr = lt > crownAt ? Ease.outBounce ? Ease.outBounce(clamp((lt - crownAt) / 0.5)) : Ease.outC(clamp((lt - crownAt) / 0.5)) : 0;
      K.dog(ctx, 1080, 900 + Math.sin(lt * 8) * 6, 0.95, lt * 24, { wag: lt * 24, crown: lt > crownAt ? 1 : 0 });
      if (lt > crownAt && lt < crownAt + 0.5) { for (let i = 0; i < 5; i++) K.star(ctx, 1240 + Math.cos(i * 1.3) * 170 * cr, 420 + Math.sin(i * 1.3) * 120 * cr, 26, lt * 3); }
      K.card(ctx, 1460, 120, 380, 250, (lt - 0.3) / 0.3);
      if (lt > 0.4) { const steps = Math.floor(8452 * Ease.outC(clamp((lt - 0.4) / 2.6))); K.text(ctx, '오늘 걸음', 1500, 190, 46, { color: '#555' }); K.word(ctx, steps.toLocaleString('en-US'), 1500, 320, 110, { fill: C.blue }); }
      K.burst(ctx, 1500, 540, 115, '동네 1등', 64, (lt - crownAt) / 0.3, C.red === '' ? C.yel : C.yel);
      K.pop(ctx, '오늘도', 110, 260, 120, lt, { at: 0.3 });
      K.pop(ctx, '산책 1등!', 110, 440, 170, lt, { at: 0.9, fill: C.yel, rot: -0.03 });
    },
  };
})();

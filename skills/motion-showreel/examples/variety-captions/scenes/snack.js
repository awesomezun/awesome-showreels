// snack (30-second cut, 3 bars): a hand comes in from the right with a treat; the cat's eyes turn to stars and it is
// there in no time; 간식 앞에선 / 1초 출석, and a stopwatch caption 0.8초.
(() => {
  SCENES['snack'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec, arrive = Ease.outQuint(clamp((lt - 2 * B) / 0.3));
      ctx.save(); K.cam(ctx, 1.05, 620, 1150, lt > 2 * B && lt < 2 * B + 0.3 ? 10 : 0, lt); K.room(ctx, lt, { cup: 1 });
      K.cat(ctx, lerp(260, 640, arrive), 1330, 0.9, lt, { pose: arrive > 0.5 ? 'sit' : 'loaf', face: lt > 1.2 * B ? 'star' : 'sleep' });
      const hx = lerp(W + 300, 900, Ease.outC(clamp((lt - 0.3) / 0.6))); ctx.fillStyle = '#FFD9B8'; rr(ctx, hx, 1000, 360, 110, 55); ctx.fill(); ctx.fillStyle = '#C96F3A'; rr(ctx, hx - 150, 1030, 170, 36, 14); ctx.fill();
      ctx.restore();
      K.cap(ctx, '간식 앞에선', W / 2, 330, 120, lt - 0.4, { style: 'yellow' });
      K.cap(ctx, '1초 출석', W / 2, 500, 150, lt - 1.2 * B, { style: 'pink' });
      K.tag(ctx, `⏱ ${(Math.min(0.8, Math.max(0, (lt - 2 * B) * 2.67))).toFixed(1)}초`, W / 2, 1700, 72, (lt - 2 * B) / 0.2, { bg: K.COL.red });
      K.bug(ctx);
    },
  };
})();

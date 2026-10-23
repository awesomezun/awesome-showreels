// reaction (30-second cut, 2 bars): a close-up on the cat's face looking away as if nothing happened, a sweat drop
// sliding; (모르는 척) bobbing in sky blue, question marks popping.
(() => {
  SCENES['reaction'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec;
      ctx.save(); K.cam(ctx, 2.0 + 0.1 * Math.sin(lt * 0.8), 640, 1000, 0, lt); K.room(ctx, lt, { cup: 1 }); K.cat(ctx, 640, 1330, 0.9, lt, { pose: 'sit', face: 'side', flip: true }); K.sweat(ctx, 770, 860, 1.2, lt); ctx.restore();
      K.cap(ctx, '(모르는 척)', W / 2, 1560, 140, lt - 0.4, { style: 'sky', bob: true });
      ['?', '?'].forEach((q, i) => K.cap(ctx, q, 260 + i * 560, 420 + i * 60, 160, lt - (1 + i) * B, { style: 'yellow', rot: (i ? 0.2 : -0.2) }));
      K.bug(ctx);
    },
  };
})();

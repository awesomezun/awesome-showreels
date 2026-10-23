// incident (2 bars): the cat, awake now, sits by the low table and lifts a paw; on the second beat it swipes and the cup
// tips off and smashes on the third; the frame punches in, shakes and freezes inside white concentration lines: 와장창!!
// in red, tilted; 범인은 바로… at the top, and a red circle drawn round the culprit.
(() => {
  SCENES['incident'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec, hit = 3 * B, frz = lt > hit ? hit + 0.08 * (lt - hit) : lt;
      const punch = lt > hit ? 1 + 0.25 * Ease.outQuint(clamp((lt - hit) / 0.18)) : 1, shake = lt > hit ? 18 * Math.exp(-(lt - hit) * 6) : 0;
      ctx.save(); K.cam(ctx, 1.05 * punch, 760, 1150, shake, lt);
      K.room(ctx, frz, { cup: clamp((frz - 2 * B) / (hit - 2 * B)) });
      K.cat(ctx, 640, 1330, 0.9, frz, { pose: 'sit', face: lt > hit ? 'shock' : 'open', paw: Ease.outBack(clamp((frz - 1.2 * B) / (0.8 * B))) * (frz > 2 * B ? 0.6 : 1) });
      ctx.restore();
      if (lt > hit) { K.lines(ctx, W / 2, 1050, clamp((lt - hit) / 0.1), lt); }
      K.cap(ctx, '와장창!!', W / 2, 1600, 190, lt - hit, { style: 'red', rot: -0.12, stagger: 0.05 });
      K.cap(ctx, '범인은 바로…', W / 2, 330, 104, lt - 4 * B, { style: 'white' });
      K.ring(ctx, 640, 1060, 300, (lt - 5 * B) / 0.35);
      K.bug(ctx);
    },
  };
})();

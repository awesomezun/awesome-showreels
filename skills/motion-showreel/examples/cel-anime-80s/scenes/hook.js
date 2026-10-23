// hook (2 bars): a VHS tape starts (PLAY): an airbrushed dusk over the river, the moon, and the camera tilts down as
// the skyline rises with its windows lit and its mirror in the water; a bridge of lamps; 제1화 · 여름의 시작.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec, cam = 260 * (1 - Ease.ioC(clamp(lt / (5 * B))));
      C.sky(ctx, 640 + cam); C.stars(ctx, t, 80, 420); C.moon(ctx, 1460, 190 + cam * 0.3, 62);
      C.skyline(ctx, 640 + cam, 300 + lt * 12, t); C.river(ctx, 640 + cam, 300 + lt * 12, t); C.bridge(ctx, 760 + cam * 1.2, t);
      C.line(ctx, '제1화 · 여름의 시작', 120, 960, 52, (lt - 4 * B) / (0.5 * B), { align: 'left' });
      C.vhs(ctx, t, { osd: Math.min(1, (3.6 * B - lt) / 0.3) });
    },
  };
})();

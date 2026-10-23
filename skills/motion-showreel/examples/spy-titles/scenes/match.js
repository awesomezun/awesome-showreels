// match (2 bars; 3 in the 30-second cut): match cuts on one centre. A cream spotlight on black becomes an eye that
// looks about, which becomes the moon over a night skyline of tiled roofs and boxy buildings on teal; 1966년 서울,
// 밤 11시.
(() => {
  SCENES['match'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL, cx = 960, cy = 430;
      const stage = lt < 2 * B ? 0 : lt < 4 * B ? 1 : 2;
      K.field(ctx, stage < 2 ? C.ink : C.teal);
      if (stage === 0) K.circle(ctx, cx, cy, 230 * Ease.outBack(clamp(lt / 0.4)), C.cream, { seed: 2 });
      else if (stage === 1) K.eye(ctx, cx, cy, 300, Ease.outBack(clamp((lt - 2 * B) / 0.25)), lt);
      else { K.circle(ctx, cx, cy, 230, C.mustard, { seed: 2 }); K.skyline(ctx, 900, C.ink, lt * 40); K.cut(ctx, [[0, 890], [W, 890], [W, H], [0, H]], C.ink, { seed: 9, shadow: false }); }
      K.text(ctx, '1966년 서울,', 160, 960, 56, (lt - 4 * B - 0.2) / 0.3);
      K.text(ctx, '밤 11시', 1500, 960, 56, (lt - 4 * B - 0.5) / 0.3, { color: C.mustard });
    },
  };
})();

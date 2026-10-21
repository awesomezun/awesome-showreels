// draw (2-3 bars): the side view. The sheet turns flat; the whole bike finishes drawing itself (frame, battery, crank,
// seat, the front half, the hinge in yellow); dimensions come on one after another (1,520 overall, 1,050 wheelbase),
// callouts name 20″ 바퀴 and 16.4 kg; the title block fills in.
(() => {
  SCENES['draw'] = {
    draw(ctx, t, env) {
      const K = BP, lt = env.lt, B = env.beatSec, C = K.COL, BK = K.BIKE;
      K.sheet(ctx);
      const k = 0.9 * (1 - Ease.ioC(rm(lt, 0, 0.9)));
      ctx.save(); K.tilt(ctx, k); K.grid(ctx);
      K.bike(ctx, 0.3 + 0.7 * Ease.ioC(rm(lt, 0.1, 2.2)));
      K.dim(ctx, [BK.RW[0] - BK.R, BK.RW[1] + BK.R], [BK.FW[0] + BK.R, BK.FW[1] + BK.R], 110, '1,520', rm(lt, 2.0, 2.8));
      K.dim(ctx, BK.RW, BK.FW, 230, '1,050', rm(lt, 2.4, 3.2));
      K.callout(ctx, [BK.FW[0] + BK.R * 0.7, BK.FW[1] - BK.R * 0.7], [1420, 300], ['20″ 바퀴', 'Ø 508 mm'], rm(lt, 2.8, 3.6));
      K.callout(ctx, [BK.SC[0], BK.SC[1]], [250, 250], ['16.4 kg', '배터리 포함'], rm(lt, 3.1, 3.9));
      ctx.restore();
      K.titleBlock(ctx, rm(lt, 1.0, 1.6));
    },
  };
})();

// fold (2-3 bars): the core message, shown. 3초면 접혀요. sits top left; a counter runs 0.0 to 3.0초 while the front
// half swings round the hinge, the stem folds down and the seat drops; the overall dimension gives way to the folded
// size, 접은 크기 78 × 66 × 38 cm.
(() => {
  SCENES['fold'] = {
    draw(ctx, t, env) {
      const K = BP, lt = env.lt, B = env.beatSec, C = K.COL, BK = K.BIKE;
      K.sheet(ctx);
      ctx.save(); K.grid(ctx);
      const f = { fold: Ease.ioC(rm(lt, 0.3, 1.8)), stem: Ease.ioC(rm(lt, 1.8, 2.5)), seat: Ease.ioC(rm(lt, 2.5, 3.3)) };
      K.bike(ctx, 1, f);
      K.dim(ctx, [BK.RW[0] - BK.R, BK.RW[1] + BK.R], [BK.FW[0] + BK.R, BK.FW[1] + BK.R], 70, '1,520', 1 - clamp((lt - 0.2) / 0.3));
      K.dim(ctx, [BK.RW[0] - BK.R, BK.RW[1] + BK.R], [BK.HINGE[0] - (BK.FW[0] - BK.HINGE[0]) + BK.R + 160, BK.RW[1] + BK.R], 70, '780', rm(lt, 3.3, 4.0));
      ctx.restore();
      const a = Ease.outExpo(clamp((lt - 0.05) / 0.6));
      ctx.save(); ctx.globalAlpha *= a; ctx.font = K.f(120, 700); ctx.fillStyle = C.line; ctx.fillText('3초면 접혀요.', 150, 250 + 24 * (1 - a)); ctx.restore();
      const sec = (3 * clamp((lt - 0.3) / 3.0)).toFixed(1);
      ctx.save(); ctx.font = K.f(150, 700, true); ctx.fillStyle = lt > 3.3 ? C.yellow : C.cyan; ctx.textAlign = 'right'; ctx.fillText(sec, 1640, 330); ctx.font = K.f(60, 700); ctx.fillText('초', 1740, 330); ctx.restore();
      const sp = Ease.outExpo(clamp((lt - 3.4) / 0.5));
      ctx.save(); ctx.globalAlpha *= sp; ctx.font = K.f(44, 600); ctx.fillStyle = C.cyan; ctx.fillText('접은 크기 78 × 66 × 38 cm', 900, 700); ctx.restore();
    },
  };
})();

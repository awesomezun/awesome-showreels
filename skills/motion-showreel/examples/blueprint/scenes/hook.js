// hook (2 bars): the name on a sheet seen at an angle. The grid and the drawing frame come up, the wheels start to
// draw themselves in white; top left, 접이식 전기자전거 · 설계도 and 폴드원 E1 with a ruled underline.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = BP, lt = env.lt, B = env.beatSec, C = K.COL;
      K.sheet(ctx);
      ctx.save(); K.tilt(ctx, 1 - 0.1 * Ease.ioSine(clamp(lt / 4.3)));
      ctx.globalAlpha *= clamp(lt / 0.5); K.grid(ctx); ctx.globalAlpha = 1;
      K.bike(ctx, Ease.ioC(rm(lt, 0.4, 4.3)) * 0.3);
      ctx.restore();
      const a = Ease.outExpo(clamp((lt - 0.2) / 0.6)), b = Ease.outExpo(clamp((lt - 0.45) / 0.7));
      ctx.save(); ctx.globalAlpha *= a; ctx.font = K.f(42, 600); ctx.fillStyle = C.cyan; ctx.fillText('접이식 전기자전거 · 설계도', 150, 250 + 20 * (1 - a)); ctx.restore();
      ctx.save(); ctx.globalAlpha *= b; ctx.font = K.f(170, 700); ctx.fillStyle = C.line; ctx.fillText('폴드원 E1', 140, 420 + 30 * (1 - b)); ctx.restore();
      K.stroke(ctx, [[150, 470], [800, 470]], Ease.ioC(rm(lt, 0.9, 1.6)), { w: 4, color: C.yellow });
    },
  };
})();

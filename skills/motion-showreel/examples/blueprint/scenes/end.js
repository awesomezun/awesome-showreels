// end (1-3 bars): the name again, the line under it, the launch line and the fiction label, over the folded bike in
// faint line work; the title block stays.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = BP, lt = env.lt, C = K.COL;
      K.sheet(ctx);
      ctx.save(); K.grid(ctx); ctx.globalAlpha = 0.25; ctx.translate(700, 180); K.bike(ctx, 1, { fold: 1, stem: 1, seat: 1 }); ctx.restore();
      const a = Ease.outExpo(clamp((lt - 0.05) / 0.6)), b = Ease.outExpo(clamp((lt - 0.3) / 0.6));
      ctx.save(); ctx.textAlign = 'center'; ctx.globalAlpha *= a; ctx.font = K.f(190, 700); ctx.fillStyle = C.line; ctx.fillText('폴드원 E1', 960, 470 + 30 * (1 - a));
      ctx.globalAlpha = b; ctx.font = K.f(76, 700); ctx.fillStyle = C.yellow; ctx.fillText('3초면 접혀요.', 960, 600);
      ctx.font = K.f(40, 500); ctx.fillStyle = C.cyan; ctx.fillText('2026 가을 출시 · 가상의 제품', 960, 690); ctx.restore();
      K.stroke(ctx, [[720, 640], [1200, 640]], Ease.ioC(rm(lt, 0.4, 0.9)), { w: 2, color: C.cyan });
      K.titleBlock(ctx, 1);
    },
  };
})();

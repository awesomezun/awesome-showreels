// check (2 bars): the pill folds into an ink checkbox; a white check mark draws itself inside it, the box gives a
// little bounce; 체크하면 끝.
(() => {
  SCENES['check'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt;
      K.ground(ctx);
      const b = 1 + 0.07 * Math.exp(-Math.max(0, lt - 0.85) * 7) * Math.sin(Math.max(0, lt - 0.85) * 20);
      ctx.save(); ctx.translate(K.CX, K.CY); ctx.scale(b, b); ctx.translate(-K.CX, -K.CY); K.scene(ctx, env, 'check');
      const p = Ease.outC(rm(lt, 0.5, 0.85)); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      polyStroke(ctx, [[K.CX - 60, K.CY + 4], [K.CX - 14, K.CY + 52], [K.CX + 66, K.CY - 48]], p); if (p > 0) ctx.stroke(); ctx.restore();
      K.text(ctx, '체크하면 끝', K.CX, 820, 72, (lt - 0.5) / 0.35);
    },
  };
})();

// end (2 bars; 4 in the 30-second cut): the beetle's plate is coloured by hand: a brown wash blooms out from the
// body over the wing cases, the head and the mandibles; 가장 작은 것을, / 가장 정확하게 is engraved beside it, then
// 한반도 곤충 도감 · 개정판 and 가상의 도감입니다.
(() => {
  const BX = 600, BY = 560, BS = 0.95;
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = DONG, lt = env.lt;
      ctx.save(); K.push(ctx, lt, env.dur, 0.025, 800, 540);
      K.paper(ctx);
      K.drawBug(ctx, K.beetle(0, 1), 99, BX, BY, BS);
      const shape = (g, st) => { g.save(); g.translate(BX, BY); g.scale(BS, BS); K.beetleWash(g, st); g.restore(); };
      K.wash(ctx, shape, K.COL.brown, rm(lt, 0.05, 1.3), [BX, BY + 60], { r: 620, alpha: 0.55 });
      K.title(ctx, '가장 작은 것을,', 1120, 430, 96, rm(lt, 0.4, 1.4));
      K.title(ctx, '가장 정확하게', 1120, 560, 96, rm(lt, 1.1, 2.0));
      K.label(ctx, '한반도 곤충 도감 · 개정판', 1124, 690, 48, (lt - 1.9) / 0.4, { fam: 'display', weight: 700 });
      K.label(ctx, '가상의 도감입니다', 1124, 930, 30, (lt - 2.3) / 0.4);
      ctx.restore();
    },
  };
})();

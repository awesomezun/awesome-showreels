// butterfly (30-second cut, 3 bars): plate 23, a swallowtail with its wings spread. Outlines and veins are engraved,
// the dark bands are filled with crossing hatch, the body is shaded; then the colouring: a yellow wash blooms out from
// the body over both wings, blue lunules and the red eyespot; a roundel on the eyespot. 도판 23 · 호랑나비.
(() => {
  const X = 960, Y = 500, S = 1.05;
  SCENES['butterfly'] = {
    draw(ctx, t, env) {
      const K = DONG, lt = env.lt, wing = K.butterfly(0.1, 1), body = K.bflyBody(0.2, 1);
      ctx.save(); K.push(ctx, lt, env.dur, 0.02);
      K.paper(ctx);
      const draw = (g, l) => { const tips = [];
        for (const s of [1, -1]) { g.save(); g.translate(X, Y); g.scale(S * s, S); K.lines(g, wing, l).forEach(p => tips.push(p)); K.bands(g, l, 0, 1); g.restore(); }
        tips.push(...K.drawBug(g, body, l, X, Y, S)); return tips; };
      const tips = draw(ctx, lt);
      K.wash(ctx, (g, st) => { g.save(); g.translate(X, Y); g.scale(S, S); K.bflyWash(g, st); g.restore(); }, K.COL.yellow, rm(lt, 2.6, 3.7), [X, Y + 40], { r: 520, alpha: 0.7 });
      ctx.save(); ctx.translate(X, Y); ctx.scale(S, S); K.bflySpots(ctx, rm(lt, 3.4, 3.9)); ctx.restore();
      const focus = [X + 104 * S, Y + 200 * S];
      K.roundel(ctx, 1640, 330, 170, rm(lt, 3.9, 4.3), focus, 2.4, (g) => { draw(g, 99); g.save(); g.translate(X, Y); g.scale(S, S); K.bflySpots(g, 1); g.restore(); }, { leader: true });
      K.label(ctx, '도판 23', 150, 820, 40, (lt - 2.2) / 0.4);
      K.label(ctx, '호랑나비', 150, 910, 84, (lt - 2.4) / 0.4, { fam: 'display', weight: 800 });
      K.glint(ctx, tips, lt);
      ctx.restore();
    },
  };
})();

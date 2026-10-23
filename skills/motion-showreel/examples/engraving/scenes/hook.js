// hook (2 bars): plate paper with its plate mark. 한반도 곤충 도감 is engraved left to right behind a burin glint,
// a swelling rule under it, 개정판 · 도판 128점; on the right a ladybird is engraved, dome hatching and spots, and a
// red wash blooms over it: the colouring that will come last.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = DONG, lt = env.lt;
      ctx.save(); K.push(ctx, lt, env.dur, 0.025);
      K.paper(ctx);
      K.label(ctx, '가상 출판 · 2027년 봄 출간', 176, 300, 36, lt / 0.4);
      K.title(ctx, '한반도 곤충 도감', 170, 480, 150, rm(lt, 0.3, 1.9));
      ctx.fillStyle = K.COL.ink; K.line(ctx, [[176, 545, 1], [1100, 545, 1]], rm(lt, 1.6, 2.3), 6, { swell: 0.9 });
      K.label(ctx, '개정판 · 도판 128점', 176, 660, 72, (lt - 2.0) / 0.4, { fam: 'display', weight: 700 });
      const lady = K.ladybird(0.5, 0.9);
      K.wash(ctx, (g, st) => { g.save(); g.translate(1490, 560); g.scale(1.45, 1.45); g.beginPath(); K.ell(0, 20, 92, 104).forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); st ? g.stroke() : g.fill(); g.restore(); },
        K.COL.red, rm(lt, 2.3, 3.3), [1450, 560], { r: 260, alpha: 0.7 });
      const tips = K.drawBug(ctx, lady, lt, 1490, 560, 1.45);
      K.glint(ctx, tips, lt);
      ctx.restore();
    },
  };
})();

// duet (30-second cut, 4 bars): call and answer: the pink marble plays four notes, the yellow one answers with four,
// twice; 둘이 하면 이중주.
(() => {
  SCENES['duet'] = {
    draw(ctx, t, env) {
      const K = TONG, lt = env.lt, hits = K.hits(env);
      K.ground(ctx); K.staff(ctx, hits, lt, { a: lt / 0.3 }); K.bars(ctx, hits, lt); K.balls(ctx, hits, lt, ['#FF6B9F', '#FECA57']);
      K.text(ctx, '둘이 하면 이중주', 140, 200, 96, (lt - 0.2) / 0.4);
    },
  };
})();

// cascade (3 bars): two marbles, pink and blue, bounce in turn half a beat apart, so the bars play an arpeggio in
// eighth notes, up and down the slope; 음표가 먼저, 공은 그 박자에 맞춰.
(() => {
  SCENES['cascade'] = {
    draw(ctx, t, env) {
      const K = TONG, lt = env.lt, hits = K.hits(env);
      K.ground(ctx); K.staff(ctx, hits, lt, { a: lt / 0.3, v: 380 }); K.bars(ctx, hits, lt); K.balls(ctx, hits, lt);
      K.text(ctx, '음표가 먼저,', 140, 200, 80, (lt - 0.3) / 0.4);
      K.text(ctx, '공은 그 박자에 맞춰', 140, 290, 60, (lt - 1.0) / 0.4, { fam: 'sans' });
    },
  };
})();

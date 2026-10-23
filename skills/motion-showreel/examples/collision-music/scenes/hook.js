// hook (2 bars): a pink marble drops onto the top bar and bounces down the rainbow slope one bar per beat, each bar
// lighting, dipping and ringing as it is hit, a scale climbing from C to C; 통통 악기 놀이 at the top.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = TONG, lt = env.lt, hits = K.hits(env);
      K.ground(ctx); K.staff(ctx, hits, lt, { a: (lt - 0.4) / 0.4 }); K.bars(ctx, hits, lt); K.balls(ctx, hits, lt);
      K.text(ctx, '통통 악기 놀이', 140, 200, 110, (lt - 0.2) / 0.4);
      K.text(ctx, '공을 떨어뜨리면 노래가 돼요', 146, 270, 44, (lt - 1.2) / 0.4, { fam: 'sans' });
    },
  };
})();

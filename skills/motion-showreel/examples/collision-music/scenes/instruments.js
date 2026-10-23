// instruments (30-second cut, 4 bars): the bars turn to metal and the same slope plays as a vibraphone, then brighter
// as a glockenspiel, one marble a beat; 마림바, 비브라폰, 글로켄슈필.
(() => {
  SCENES['instruments'] = {
    draw(ctx, t, env) {
      const K = TONG, lt = env.lt, B = env.beatSec, hits = K.hits(env);
      K.ground(ctx); K.staff(ctx, hits, lt, { a: lt / 0.3 }); K.bars(ctx, hits, lt, { metal: true }); K.balls(ctx, hits, lt, ['#C9D3DC', '#FECA57']);
      K.text(ctx, lt < 8 * B ? '비브라폰' : '글로켄슈필', 140, 200, 96, lt < 8 * B ? (lt - 0.2) / 0.3 : (lt - 8 * B) / 0.3);
      K.text(ctx, '악기를 바꾸면, 같은 길이 다른 노래', 146, 280, 44, (lt - 1.0) / 0.4, { fam: 'sans' });
    },
  };
})();

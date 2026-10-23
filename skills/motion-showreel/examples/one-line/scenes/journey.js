// journey (30-second cut, 3 bars): the line never lifts: it falls as steam into a cup and draws the cup, its handle
// and saucer, runs along the table into an open notebook and writes a few lines, then climbs a potted plant leaf by
// leaf; the label follows it: 아침의 찻잔, 오후의 노트, 창가의 화분.
(() => {
  SCENES['journey'] = {
    draw(ctx, t, env) {
      const K = ONE, lt = env.lt, M = K.MARK, c = lerp(M.loops, M.plant, Ease.ioQ(rm(lt, 0.1, env.dur - 0.5)));
      K.ground(ctx);
      const tip = K.draw(ctx, c, K.cam(c, 1.0, { lag: 700 }));
      K.pen(ctx, tip, 1, lt);
      const lbl = c < M.cup ? '아침의 찻잔' : c < M.book ? '오후의 노트' : '창가의 화분', k = c < M.cup ? (c - M.loops) / (M.cup - M.loops) : c < M.book ? (c - M.cup) / (M.book - M.cup) : (c - M.book) / (M.plant - M.book);
      K.text(ctx, lbl, 140, 990, 72, Math.min(k * 6, (1 - k) * 8, 1), { fam: 'sans', w: 700 });
    },
  };
})();

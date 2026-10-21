// book (2-3 bars): the core message. The whole drawing shrinks onto the right-hand page of an open book drawn in
// crayon; the story is written on the left page a line at a time (옛날 옛적에…); above the book, 그림이 동화책이 돼요.
(() => {
  SCENES['book'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = lt + (env.cut === '30' ? 8.6 : 4.3);
      const flowers = env.cut === '30' ? 1 : 0;
      K.paper(ctx, P);
      const g = K.begin();
      const k = Ease.ioC(rm(lt, 0.15, 1.2)), pw = 680, ph = 740, cx = 960, cy = 610;
      const bk = K.book(g, cx, cy, pw, ph, rm(lt, 0.5, 1.4), T);
      // the drawing: full frame -> fitted into the right page
      const s = Math.min(pw / W, ph / H) * 0.94, tx = bk.right.x + (pw - W * s) / 2, ty = bk.right.y + (ph - H * s) / 2 + 30;
      g.save(); g.translate(lerp(0, tx, k), lerp(0, ty, k)); g.scale(lerp(1, s, k), lerp(1, s, k));
      if (k > 0.98) { g.beginPath(); g.rect(0, 0, W, H); g.clip(); }
      K.drawing(g, T, { hills: 1, house: 1, tree: 1, kid: 1, kite: 1, sun: 1, clouds: 1, flowers });
      g.restore();
      // the story on the left page
      const lines = ['옛날 옛적,', '바람 부는 언덕에', '연을 날리는', '아이가 살았어요.'];
      lines.forEach((s1, i) => K.text(g, s1, bk.left.x + 70, bk.left.y + 190 + i * 112, lt - (1.6 + i * 0.45) * B, { size: 70, color: C.brown, step: 0.045 }));
      K.text(g, '그림이 동화책이 돼요', cx, 165, lt - 0.9 * B, { size: 104, color: C.black, align: 'center', step: 0.06 });
      K.end(ctx);
    },
  };
})();

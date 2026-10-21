// hook (2 bars): the name, in crayon. A sun scribbles itself in the corner; 꼬마 화가 pops on a letter at a time in
// the crayon box's colours; a crayon stick rides the underline it scribbles; the kicker says what it is (그림책
// 만드는 앱) and the subline says what it does.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx, P);
      const g = K.begin();
      K.sun(g, 1600, 300, 92, rm(lt, 0, 1.4), lt, { spin: lt * 0.3 });
      K.text(g, '그림책 만드는 앱', 260, 400, lt - 0.3, { size: 60, color: C.blue, step: 0.04 });
      K.text(g, '꼬마 화가', 250, 640, lt - 0.55, { size: 230, step: 0.12, dur: 0.4, colors: [C.red, C.orange, C.green, C.blue, C.purple] });
      const ul = K.path([[262, 690], [520, 702], [800, 684], [1010, 696]], 7, { bow: 0.05 }), uu = rm(lt, 1.6, 2.4);
      K.line(g, ul, uu, { color: C.yellow, w: 18, seed: 7, t: lt });
      K.text(g, '아이 그림을 동화책으로', 262, 850, lt - 2.5, { size: 72, color: C.black, step: 0.05 });
      K.end(ctx);
      if (uu > 0 && uu < 1) { const h = K.head(ul, uu); K.stick(ctx, h.x, h.y, C.yellow, { a: -2.4 }); }
    },
  };
})();

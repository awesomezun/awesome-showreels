// draw (2-3 bars): a child's drawing draws itself at hand speed: the hills, the house, the tree, the child, the kite
// and its string, the sun and the clouds; a crayon stick rides the hills' edge, then the roof. The line 아이가
// 그리면, sits top left. In the hold the lines keep boiling and the kite keeps flying.
(() => {
  SCENES['draw'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx, P);
      const g = K.begin();
      const s = { hills: rm(lt, 0.1, 1.3), house: rm(lt, 0.7, 2.0), tree: rm(lt, 1.3, 2.4), kid: rm(lt, 1.9, 2.9), kite: rm(lt, 2.4, 3.5), sun: rm(lt, 2.9, 3.8), clouds: rm(lt, 3.2, 4.0), flowers: 0 };
      K.drawing(g, lt, s);
      K.text(g, '아이가 그리면,', 120, 210, lt - 0.25, { size: 116, color: C.black, step: 0.07 });
      K.end(ctx);
      // the stick rides whatever is being drawn: the hills' edge, then the house walls
      if (s.hills > 0 && s.hills < 0.4) {
        const top = K.curve([[-40, 800], [300, 730], [700, 780], [1100, 710], [1500, 770], [1960, 740]], 18), h = K.head(top, s.hills / 0.4);
        K.stick(ctx, h.x, h.y, C.green, { a: -2.3 });
      } else if (s.house > 0 && s.house < 0.75) {
        const q = s.house / 0.75, x = lerp(300, 580, q), y = 850 - 210 * Math.sin(Math.PI * q) - 80 * q;
        K.stick(ctx, x, y, C.red, { a: -2.2 });
      }
    },
  };
})();

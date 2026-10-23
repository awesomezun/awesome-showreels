// hook (2 bars): an orange field. Three black bars sweep in on the diagonal one per beat, a cream disc slides into
// place, a red silk ribbon unrolls across it, and 작전명 비단 drops in letter by letter; 6부작 첩보 드라마 above.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL, a = -0.42;
      K.field(ctx, C.orange);
      [[-330, 70], [-120, 34], [260, 120]].forEach(([d, w], i) => K.bar(ctx, d, w, a, (lt - i * B) / (0.8 * B), C.ink, 10 + i));
      const cx = lerp(W + 400, 1320, Ease.outQuint(rm(lt, 3 * B, 3.7 * B)));
      K.circle(ctx, cx, 470, 300, C.cream, { seed: 2 });
      K.ribbon(ctx, [[-100, 900], [500, 760], [1000, 820], [1500, 560], [2050, 380]], 70, rm(lt, 4 * B, 5.3 * B), 3);
      K.title(ctx, '작전명 비단', 170, 560, 180, lt - 5 * B, { color: C.cream, shadow: C.ink });
      K.text(ctx, '6부작 첩보 드라마', 176, 330, 40, (lt - 4.6 * B) / 0.3, { color: C.ink });
    },
  };
})();

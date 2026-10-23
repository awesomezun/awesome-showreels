// agent (2 bars; 3 in the 30-second cut): a teal field cut by one diagonal. The agent in hat and trench coat walks in
// along it, a long shadow behind; the cast comes up in the empty panels one per beat: 주연 · 요원 K, 비단 장수, 그림자.
(() => {
  SCENES['agent'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL;
      K.field(ctx, C.teal);
      K.cut(ctx, [[0, 700], [W, 520], [W, H], [0, H]], C.ink, { seed: 12 });
      const x = lerp(1800, 1180, Ease.outC(rm(lt, 0, env.dur * 0.9))), y = 580 + (1800 - x) * 0.094;
      ctx.save(); ctx.globalAlpha = 0.35; ctx.transform(1, 0, -1.6, 0.25, 0, 0); K.agent(ctx, x + y * 1.6 * 4, y * 4, 0.8, lt * 1.1, '#000000'); ctx.restore();
      K.agent(ctx, x, y, 0.8, lt * 1.1);
      [['주연', '요원 K'], ['비단 장수', '차마루'], ['그림자', '???']].forEach(([r, n], i) => K.credit(ctx, r, n, 160 + i * 300, 260 + i * 150, (lt - (0.5 + i) * B) / 0.25, { size: 76 }));
    },
  };
})();

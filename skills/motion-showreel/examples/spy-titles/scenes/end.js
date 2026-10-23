// end (2 bars; 3 in the 30-second cut): back on orange: the bars, the cream disc with the agent's silhouette in it,
// the ribbon, 작전명 비단 dropping in again; 그 밤, 서울에는 비밀이 하나 더 있었다 and 6부작 · 가상의 드라마입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL;
      K.field(ctx, C.orange);
      [[-330, 70], [260, 120]].forEach(([d, w], i) => K.bar(ctx, d, w, -0.42, 1, C.ink, 10 + i));
      K.circle(ctx, 1380, 450, 300, C.cream, { seed: 2 });
      ctx.save(); ctx.beginPath(); ctx.arc(1380, 450, 296, 0, Math.PI * 2); ctx.clip(); K.agent(ctx, 1380, 800 + 6 * Math.sin(lt * 2), 0.62, 0.0); ctx.restore();
      K.ribbon(ctx, [[-100, 900], [500, 760], [1000, 820], [1500, 560], [2050, 380]], 70, 1, 3);
      K.cut(ctx, [[110, 250], [960, 230], [980, 760], [120, 780]], C.cream, { seed: 77 });
      K.title(ctx, '작전명 비단', 160, 470, 170, lt - 0.1);
      K.text(ctx, '그 밤, 서울에는', 166, 590, 52, (lt - 0.9) / 0.3, { color: C.ink });
      K.text(ctx, '비밀이 하나 더 있었다', 166, 660, 52, (lt - 1.2) / 0.3, { color: C.ink });
      K.text(ctx, '6부작 · 가상의 드라마입니다', 166, 730, 30, (lt - 1.6) / 0.3, { color: C.ink, w: 500 });
    },
  };
})();

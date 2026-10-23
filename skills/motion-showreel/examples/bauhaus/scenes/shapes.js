// shapes (2 bars; 3 in the 30-second cut): the composition works on the beat: a blue bar turns a quarter about its
// corner each beat, the red circle's quarter arcs swap colours, the triangle flips over; 원, / 사각, / 삼각. land one per
// two beats on the right, each with its colour.
(() => {
  SCENES['shapes'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      const r = K.turn(lt, 0, B, 99); K.rect(ctx, 4 * M, 4 * M, 4 * M, 0.75 * M, C.blue, 1, r, 4 * M, 4 * M);
      const q = Math.floor(lt / B) % 4; for (let k = 0; k < 4; k++) K.arc(ctx, 3 * M, 4 * M, 1.6 * M, k * Math.PI / 2, (k + 1) * Math.PI / 2, (k + q) % 2 ? C.red : C.ink);
      const fl = K.turn(lt, B, B * 2, 99) * 2; ctx.save(); ctx.translate(6 * M, 7 * M); ctx.scale(Math.cos(fl), 1); K.tri(ctx, [[-1.5 * M, 1.5 * M], [1.5 * M, 1.5 * M], [0, -1.2 * M]], C.yellow); ctx.restore();
      [['원,', C.red], ['사각,', C.blue], ['삼각.', C.yellow]].forEach(([s, c], i) => { const a = clamp((lt - 2 * i * B) / 0.25); if (a <= 0) return; K.circle(ctx, 9.4 * M, (2.5 + 2.2 * i) * M - 40, 26, c);
        K.word(ctx, s, 10 * M, (2.5 + 2.2 * i) * M, 150, lt - 2 * i * B); });
    },
  };
})();

// cascade (30-second cut, 3 bars): a field of cards flips over in a diagonal wave, one diagonal per half beat, each
// back a shape in one of the three colours; 기본 도형부터, 포스터 한 장까지.
(() => {
  SCENES['cascade'] = {
    draw(ctx, t, env) {
      const K = BAU, M = K.M, lt = env.lt, B = env.beatSec, C = K.COL, cols = [C.red, C.blue, C.yellow];
      K.paper(ctx);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
        const x = (2 + c) * M, y = (1 + r) * M + 40, u = clamp((lt - (r + c) * B / 2) / (B * 0.8)), sx = Math.cos(Math.PI * u), k = (r * 5 + c * 3) % 3;
        ctx.save(); ctx.translate(x + M / 2, y + M / 2); ctx.scale(Math.abs(sx) < 0.02 ? 0.02 : Math.abs(sx), 1);
        if (sx > 0) K.rect(ctx, -M / 2 + 6, -M / 2 + 6, M - 12, M - 12, C.ink, 0.85);
        else { K.rect(ctx, -M / 2 + 6, -M / 2 + 6, M - 12, M - 12, '#FFFFFF', 0.6); if (k === 0) K.circle(ctx, 0, 0, M * 0.36, cols[(r + c) % 3]); else if (k === 1) K.rect(ctx, -M * 0.3, -M * 0.3, M * 0.6, M * 0.6, cols[(r + c) % 3]); else K.tri(ctx, [[-M * 0.34, M * 0.3], [M * 0.34, M * 0.3], [0, -M * 0.34]], cols[(r + c) % 3]); }
        ctx.restore(); }
      K.word(ctx, '기본 도형부터,', 2 * M, 7 * M, 96, lt - 1.5 * B, { fam: 'sans', w: 400 });
      K.word(ctx, '포스터 한 장까지', 2 * M, 8 * M, 96, lt - 3 * B, { fam: 'sans', w: 400, color: C.red });
    },
  };
})();

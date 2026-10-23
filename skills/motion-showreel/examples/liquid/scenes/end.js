// end (3 bars; 4 in the 30-second cut): the three colours swirl up and gather into the glossy name 톡톡 with a few
// drops still orbiting it; 한 방울이 모이면, 톡! and 톡톡 스파클링 · 가상의 탄산수입니다 below.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = TOK, lt = env.lt, C = K.COL, gather = Ease.ioC(rm(lt, 0.1, 1.2)), balls = [];
      K.ground(ctx);
      ['pink', 'lime', 'grape'].forEach((c, i) => { for (let k = 0; k < 4; k++) { const a = lt * (1.1 + 0.15 * k) + i * 2.09 + k * 1.57, d = lerp(560, 470 + 30 * Math.sin(lt * 2 + k), gather);
        balls.push({ x: 960 + Math.cos(a) * d, y: 470 + Math.sin(a) * d * 0.5, r: lerp(70, 20 + 5 * k, gather), col: C[c] }); } });
      K.liquid(ctx, balls, { text: { lines: [{ s: '톡톡', x: 960, y: 590, size: 330 }], k: gather, col: C.candy } });
      K.text(ctx, '한 방울이 모이면, 톡!', 960, 830, 84, (lt - 0.9) / 0.3, { pop: true });
      K.text(ctx, '톡톡 스파클링 · 가상의 탄산수입니다', 960, 910, 36, (lt - 1.3) / 0.3, { fam: 'sans' });
    },
  };
})();

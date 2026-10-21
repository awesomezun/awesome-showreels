// street (3-4 bars): the core message. Street level in the rain: towers with signs close above, a wet street that
// mirrors them in ripples, splashes; the hooded walker crosses under the signs, visor lit; a car's lights sweep past.
// 2087년, / 비는 그치지 않는다.
(() => {
  SCENES['street'] = {
    draw(ctx, t, env) {
      const K = CYBER, lt = env.lt, hz = 800, pan = lt * 60;
      K.sky(ctx, { horizon: hz });
      K.towers(ctx, lt, { depth: 0, horizon: hz, pan: pan + 200 });
      K.towers(ctx, lt, { depth: 1, horizon: hz, pan: pan + 400, signs: true });
      K.towers(ctx, lt, { depth: 2, horizon: hz, pan: pan + 900, signs: true, tall: 1.2 });
      K.car(ctx, lerp(W + 300, -300, clamp((lt - 1.6) / 2.2)), 640, 1.2, -1, 340);
      const wx = lerp(1120, 1480, lt / env.dur);
      K.walker(ctx, wx, hz + 12, 1.0, lt * 6.5);
      K.reflect(ctx, hz, lt, { a: 0.55 });
      K.rain(ctx, lt, { n: 520, len: 56 });
      K.scrim(ctx);
      K.gtext(ctx, '2087년,', 110, 330, 150, lt, { a: clamp((lt - 0.3) / 0.12), glitch: lt < 0.6 ? 1 : undefined, color: K.COL.yel });
      K.gtext(ctx, '비는 그치지 않는다.', 110, 500, 130, lt, { a: clamp((lt - 1.2) / 0.12), glitch: lt < 1.5 ? 1 : undefined });
      K.slices(ctx, lt, lt < 0.25 ? 1 : 0);
    },
  };
})();

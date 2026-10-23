// rain (30-second cut, 2 bars): the rain comes down; 밤톨이 looks left and right, crouches (the anticipation) and pulls
// up the big leaf growing beside him, holding it over his head as an umbrella; 비가 와도,
(() => {
  SCENES['rain'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'rain'); K.puddle(ctx, 1380, 930, 170, t, 3);
      const p = K.act([{ b: 0, x: 760, y: 900, s: 1, sq: 0, tilt: -0.1, lookX: 0, lookY: -1, armF: 1.2 }, { b: 1, tilt: 0, lookX: -1, lookY: 0 }, { b: 2, lookX: 1 }, { b: 3, sq: 0.2, armF: 0.2, lookX: 1 }, { b: 3.8, sq: -0.08, armF: -1.6, e: 'back' }, { b: 4.6, sq: 0, armF: -1.5, lookX: 0, lookY: -1 }, { b: 8, armF: -1.45 }], b);
      p.walk = 0; const u = clamp((b - 3.3) / 0.9), hand = K.hogHand(p), base = [1060, 920];
      if (u < 1 && b < 3.3) K.leaf(ctx, base, t, { len: 250, lean: -0.2 });
      K.hog(ctx, p, t);
      if (b >= 3.3) K.leaf(ctx, [lerp(base[0], hand[0], Ease.ioC(u)), lerp(base[1], hand[1], Ease.ioC(u))], t, { len: lerp(250, 240, u), lean: lerp(-0.2, -0.3, u) });
      K.rain(ctx, t, 0.8); K.text(ctx, '비가 와도,', 140, 250, 120, (b - 0.5) / 0.8); K.finish(ctx);
    },
  };
})();

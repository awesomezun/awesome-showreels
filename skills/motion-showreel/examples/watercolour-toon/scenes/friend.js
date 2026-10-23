// friend (30-second cut, 2 bars): a little bunny sits in the rain, ears drooping, shivering, dripping; 밤톨이 comes
// along under his leaf, stops, and notices her (a jolt, a painted !); 저기, 비를 맞는 친구가 있어요.
(() => {
  SCENES['friend'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'rain'); K.puddle(ctx, 1500, 950, 200, t, 5);
      const q = K.act([{ b: 0, x: 1340, y: 910, s: 0.95, dir: -1, ears: 1, shiver: 1, wet: 1, lookY: 0.6, smile: -0.5 }, { b: 5, lookX: 1, lookY: 0 }, { b: 8 }], b); K.bun(ctx, q, t);
      const p = K.act([{ b: 0, x: 200, y: 900, s: 1, sq: 0, tilt: 0, lookX: 0, armF: -1.5 }, { b: 4, x: 780 }, { b: 4.3, sq: -0.12, tilt: 0.1, lookX: 1, e: 'back' }, { b: 5, sq: 0, tilt: 0 }, { b: 8 }], b);
      p.walk = (p.x - 200) / 70; K.hog(ctx, p, t); K.leaf(ctx, K.hogHand(p), t, { len: 240, lean: -0.3 });
      const ea = clamp((b - 4.3) / 0.3) * clamp((7.5 - b) / 0.5); if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; ctx.font = K.F(150); ctx.fillStyle = rgba('#D0543F', 0.85); ctx.fillText('!', p.x + 200, p.y - 420); ctx.restore(); }
      K.rain(ctx, t, 0.8); K.text(ctx, '저기, 비를 맞는 친구가 있어요', 140, 250, 96, (b - 0.6) / 0.8); K.finish(ctx);
    },
  };
})();

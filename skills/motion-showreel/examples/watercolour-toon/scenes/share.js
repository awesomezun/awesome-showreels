// share (2 bars): 밤톨이 steps over and holds the leaf over both of them; the bunny looks up, her ears spring up and
// she smiles; raindrops land on the leaf on the beats (pizzicato); little hearts; 비가 와도, 같이 쓰면 돼요.
(() => {
  SCENES['share'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'rain'); K.puddle(ctx, 1560, 960, 190, t, 5);
      const q = K.act([{ b: 0, x: 1300, y: 910, s: 0.95, dir: -1, ears: 1, shiver: 1, wet: 1, lookY: 0.6, lookX: 1, smile: -0.5, sq: 0 }, { b: 2.4, lookY: -1, shiver: 0 }, { b: 2.9, sq: 0.1 }, { b: 3.4, ears: 0, sq: -0.06, wet: 0, smile: 1, e: 'back' }, { b: 4, sq: 0 }, { b: 8 }], b); K.bun(ctx, q, t);
      const p = K.act([{ b: 0, x: 760, y: 900, s: 1, sq: 0, tilt: 0, armF: -1.5, smile: 0 }, { b: 1.8, x: 960, armF: -1.2 }, { b: 3.6, smile: 1 }, { b: 8 }], b);
      p.walk = (p.x - 760) / 70; K.hog(ctx, p, t); const top = K.leaf(ctx, K.hogHand(p), t, { len: 250, lean: lerp(-0.3, 0.55, clamp(b / 1.8)), s: 1.1 });
      for (let k = 1; k < 8; k++) { if (k === 4) continue; const u = b - k; if (u < -0.35 || u > 0.6) continue; const x = top[0] + (hash(k) - 0.5) * 300, y = top[1] - 90 + Math.abs(x - top[0]) * 0.25;
        if (u < 0) { ctx.fillStyle = rgba(K.COL.water, 0.85); ctx.beginPath(); ctx.ellipse(x, lerp(-30, y, (u + 0.35) / 0.35), 6, 10, 0, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.strokeStyle = rgba(K.COL.water, 1 - u / 0.6); ctx.lineWidth = 3; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 26 * u / 0.6, y - 40 * u / 0.6, x + s * 44 * u / 0.6, y - 4); ctx.stroke(); } } }
      for (let i = 0; i < 3; i++) K.heart(ctx, 1130 + i * 60, 470 - (b - 4 - i * 0.4) * 50, 1.4, Math.min((b - 4 - i * 0.4) / 0.4, (7.6 - b) / 0.5));
      K.rain(ctx, t, 0.7); K.text(ctx, '비가 와도,', 140, 230, 110, (b - 0.5) / 0.8); K.text(ctx, '같이 쓰면 돼요', 140, 360, 130, (b - 3.4) / 0.8, { color: '#B0485E' }); K.finish(ctx);
    },
  };
})();

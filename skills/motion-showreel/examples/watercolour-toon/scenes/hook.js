// hook (2 bars): the title blooms onto the page like wet paint; 밤톨이 waddles in from the left, stops, and the first
// raindrop lands on his nose: he squashes, blinks and looks up; then the rain begins.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'rain'); K.puddle(ctx, 1380, 930, 170, t, 3, false);
      K.bloom(ctx, (g) => { K.text(g, '비 오는 날의 밤톨이', 140, 250, 140, 1, { color: '#4E6496' }); }, 330, 210, lerp(160, 1500, clamp(b / 3)), 260);
      const p = K.act([{ b: 0, x: -120, y: 900, s: 1, sq: 0, tilt: 0, lookX: 0, lookY: 0, blink: 0, armF: 1.2 }, { b: 5, x: 760 }, { b: 5.9, sq: 0 }, { b: 6.05, sq: 0.16, blink: 1 }, { b: 6.6, sq: 0, blink: 0, tilt: -0.14, lookY: -1, e: 'back' }, { b: 8, tilt: -0.12 }], b);
      p.walk = (p.x + 120) / 70; K.hog(ctx, p, t);
      const nose = [p.x + 150 * Math.cos(p.tilt) + 116 * Math.sin(p.tilt), p.y - 116], fd = clamp((b - 5.3) / 0.75);
      if (b > 5.3 && b < 6.05) { ctx.fillStyle = rgba(K.COL.water, 0.85); ctx.beginPath(); ctx.ellipse(nose[0], lerp(-40, nose[1] - 18, fd * fd), 7, 11, 0, 0, Math.PI * 2); ctx.fill(); }
      if (b >= 6.05 && b < 7) { const u = (b - 6.05) / 0.95; ctx.strokeStyle = rgba(K.COL.water, 1 - u); ctx.lineWidth = 3; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(nose[0], nose[1] - 14); ctx.quadraticCurveTo(nose[0] + s * 30 * u, nose[1] - 50 * u, nose[0] + s * 50 * u, nose[1] - 10 + 40 * u * u); ctx.stroke(); } }
      K.rain(ctx, t, clamp((b - 6.5) / 1.5) * 0.35); K.finish(ctx);
    },
  };
})();

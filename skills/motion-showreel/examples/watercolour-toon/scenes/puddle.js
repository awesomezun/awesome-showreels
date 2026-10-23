// puddle (30-second cut, 2 bars): the rain eases; the two of them hop into the puddle together on beats 2, 4 and 6,
// squashing as they land, splashing; 물웅덩이도 같이 첨벙.
(() => {
  SCENES['puddle'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'rain'); K.puddle(ctx, 980, 945, 480, t, 9);
      const hop = (o) => { let y = 0, sq = 0; for (const k of [2, 4, 6]) { const u = (b - (k - 1)) / 1; if (u >= 0 && u < 1) y = -Math.sin(Math.PI * u) * 150; const l = b - k; if (l >= -0.15 && l < 0.5) sq = l < 0 ? -0.08 : 0.22 * Math.exp(-l * 6) * Math.cos(l * 14); } return { y, sq }; };
      const h = hop(); const q = { x: 1240, y: 910 + h.y, s: 0.95, dir: -1, ears: 0.1 - h.y / 900, smile: 1, sq: h.sq, lookX: -1 }; K.bun(ctx, q, t);
      const p = { x: 720, y: 900 + h.y, s: 1, sq: h.sq, smile: 1, armF: 1.0, armB: 2.4, lookX: 1, walk: 0 }; K.hog(ctx, p, t);
      for (const k of [2, 4, 6]) { const u = b - k; if (u < 0 || u > 0.8) continue; for (let i = 0; i < 14; i++) { const a = Math.PI * (1.1 + 0.8 * i / 13), r = 60 + u * 340, x = 960 + Math.cos(a) * r * 1.3, y = 930 + Math.sin(a) * r * 0.9 + 500 * u * u;
        ctx.fillStyle = rgba(K.COL.water, 0.8 * (1 - u / 0.8)); ctx.beginPath(); ctx.ellipse(x, y, 7, 10, a, 0, Math.PI * 2); ctx.fill(); } }
      K.rain(ctx, t, 0.35); K.text(ctx, '물웅덩이도 같이 첨벙', 140, 250, 110, (b - 0.4) / 0.8); K.finish(ctx);
    },
  };
})();

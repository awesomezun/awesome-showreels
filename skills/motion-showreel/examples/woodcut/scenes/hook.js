// hook (2 bars): a black block fills the frame. A V-gouge cuts the sun out in rings (the vermilion plate under it
// shows through the cuts), the sky in lines that are widest near the sun, two ranges of mountains and pines; then
// 1926년부터, 소나무 산 아래 and 솔뫼 양조장 are carved out of the dark near range.
(() => {
  const SX = 1380, SY = 330, SR = 120;
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = PAN, lt = env.lt, TAU = Math.PI * 2;
      ctx.save(); K.push(ctx, lt, env.dur, 0.03);
      K.paper(ctx);
      const r = K.redBegin(); r.beginPath(); r.arc(SX, SY, SR * 1.2, 0, TAU); r.fill(); K.redEnd(ctx, 1);
      const g = K.begin(); g.fillRect(-60, -60, W + 120, H + 120);
      const tips = [];
      g.save(); g.beginPath(); g.moveTo(-60, -60); for (let x = -60; x <= W + 60; x += 16) g.lineTo(x, K.ridge(x, 0, 700, 300)); g.lineTo(W + 60, -60); g.closePath(); g.clip();
      tips.push(...K.cuts(g, K.sky(SX, SY, SR, 30, 690, { t0: 0.25, span: 1.7 }), lt)); g.restore();
      const far = K.mountain(0, 700, 300, { t0: 1.85, n: 10, gap: 15, wk: 11 }); tips.push(...K.cuts(g, far.cuts, lt));
      const near = K.mountain(1, 880, 170, { t0: 2.35, n: 2, gap: 20 });
      g.save(); g.beginPath(); K.fillPoly(g, near.poly); g.restore();
      tips.push(...K.cuts(g, near.cuts, lt));
      K.drawPines(g, K.pines(1, 880, 170, [980, 1080, 1170, 1600, 1700, 1810], 1), lt, 2.6);
      K.carveText(g, '1926년부터, 소나무 산 아래', 140, 868, 46, rm(lt, 2.85, 3.45), { fam: 'sans' });
      K.carveText(g, '솔뫼 양조장', 128, 1018, 168, rm(lt, 3.25, 4.15));
      K.end(ctx);
      K.chips(ctx, tips.slice(-6), lt, { tool: lt < 4.2 });
      ctx.restore();
    },
  };
})();

// end (2 bars; 3 in the 30-second cut): the pull. The sheet peels off the inked block left to right with a curl and
// the finished print appears: the village at dusk, 깎아 새긴 손맛, 백 년 above it, 솔뫼 양조장 · 1926–2026 in red; then
// the red seal 백년 is stamped; 가상의 양조장입니다 small at the foot.
(() => {
  const drawPrint = (g2) => {
    const K = PAN; g2.drawImage(K.paperTex(), 0, 0);
    const r = K.redBegin(), g = K.begin();
    K.village(g, r, 20, { x0: 140, y0: 300, w: W - 280, h: 640, t0: 0 });
    r.font = K.F(56, 'display'); r.fillText('솔뫼 양조장 · 1926–2026', 144, 1010);
    g.save(); g.font = K.F(22, 'sans'); g.textAlign = 'center'; g.fillText('솔뫼 양조장', W * 0.42 + 0.0 * W, 300 + 640 * 0.86 - 119); g.restore();
    K.redEnd(g2, 1);
    K.printText(g, '깎아 새긴 손맛, 백 년', 140, 230, 128, 1);
    K.printText(g, '가상의 양조장입니다', W - 140, 1010, 34, 1, { fam: 'sans', align: 'right' });
    K.end(g2);
    K.border(g2, 136, 296, W - 272, 648);
  };
  let seal = null;
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = PAN, lt = env.lt, TAU = Math.PI * 2;
      ctx.save(); K.push(ctx, Math.max(0, lt - 2.2), env.dur, 0.02);
      K.pull(ctx, drawPrint, Ease.ioQ(rm(lt, 0.15, 2.0)), 'end');
      // the seal: a red square stamped on the beat after the pull, its characters cut out
      const sp = rm(lt, 2.5, 2.62);
      if (sp > 0) {
        if (!seal) { seal = makeBuf(160, 160); const q = seal.g; q.fillStyle = K.COL.red; rr(q, 10, 10, 140, 140, 8); q.fill();
          q.globalCompositeOperation = 'destination-out'; q.font = K.F(58, 'sans'); q.textAlign = 'center'; q.fillText('백', 80, 74); q.fillText('년', 80, 132);
          q.globalAlpha = 0.6; q.drawImage(K.speckTex(), -300, -200); }
        const s = 1 + 0.25 * (1 - Ease.outBack(sp)), x = 1640, y = 120;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.04); ctx.globalAlpha = clamp(sp * 3) * 0.92; ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(seal.c, -80, -80); ctx.restore();
        if (sp < 1) env.fx.shake = Math.max(env.fx.shake || 0, 6 * (1 - sp));
      }
      ctx.restore();
    },
  };
})();

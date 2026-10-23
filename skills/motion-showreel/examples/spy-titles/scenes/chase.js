// chase (30-second cut, 3 bars): the frame splits into diagonal strips in the four colours; silhouettes run through
// them at different speeds, a car's headlights sweep one strip; the crew credit 제작 · 가상 스튜디오 1966 rides a strip.
(() => {
  SCENES['chase'] = {
    draw(ctx, t, env) {
      const K = SPY, lt = env.lt, B = env.beatSec, C = K.COL, cols = [C.orange, C.ink, C.teal, C.cream, C.ink];
      K.field(ctx, C.ink);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.42); ctx.translate(-W / 2, -H / 2);
      cols.forEach((c, i) => { const y = -300 + i * 340, open = Ease.outQuint(clamp((lt - i * 0.5 * B) / (0.8 * B))); K.cut(ctx, [[-600, y], [-600 + 3200 * open, y], [-600 + 3200 * open, y + 320], [-600, y + 320]], c, { seed: 70 + i });
        if (open > 0.5 && i !== 1 && i !== 4) { const sp = [500, 380, 620][i % 3], x = ((lt * sp + i * 400) % 2600) - 400; ctx.save(); ctx.beginPath(); ctx.rect(-600, y, 3200, 320); ctx.clip(); K.agent(ctx, x, y + 310, 0.42, lt * 2.2 + i, i === 3 ? C.ink : C.cream, 1); ctx.restore(); } });
      const hx = ((lt * 900) % 3000) - 500; ctx.save(); ctx.beginPath(); ctx.rect(-600, 380, 3200, 320); ctx.clip(); ctx.fillStyle = 'rgba(238,228,207,0.85)'; ctx.beginPath(); ctx.moveTo(hx, 540); ctx.lineTo(hx + 520, 400); ctx.lineTo(hx + 520, 680); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.restore();
      K.credit(ctx, '제작', '가상 스튜디오 1966', 160, 980, (lt - 2 * B) / 0.3, { size: 64, c2: C.mustard });
    },
  };
})();

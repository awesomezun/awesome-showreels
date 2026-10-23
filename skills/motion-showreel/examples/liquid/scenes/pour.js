// pour (30-second cut, 3 bars): a stream pours from the top into a tall glass; the liquid rises in it with bubbles
// streaming up; 설탕 0g and 톡 쏘는 탄산 beside it.
(() => {
  SCENES['pour'] = {
    draw(ctx, t, env) {
      const K = TOK, lt = env.lt, C = K.COL, gx = 760, top = 260, bot = 940, wTop = 200, wBot = 160;
      K.ground(ctx);
      const level = lerp(bot, top + 110, Ease.outQ(rm(lt, 0.3, env.dur - 0.8))), balls = [];
      for (let k = 0; k < 7; k++) balls.push({ x: gx - 150 + k * 50, y: level + 150 + 10 * Math.sin(lt * 4 + k * 1.3), r: 170, col: C.lime });
      const pour = clamp(1 - (lt - (env.dur - 0.9)) / 0.4);
      for (let k = 0; k < 12; k++) { const y = -40 + k * ((level + 20) / 12); balls.push({ x: gx + 8 * Math.sin(lt * 9 + k * 0.7), y, r: 26 * pour * (0.85 + 0.15 * Math.sin(lt * 12 + k)), col: C.lime }); }
      ctx.save(); ctx.beginPath(); ctx.moveTo(gx - wTop, top); ctx.lineTo(gx - wBot, bot); ctx.lineTo(gx + wBot, bot); ctx.lineTo(gx + wTop, top); ctx.closePath(); ctx.rect(gx - 60, -100, 120, top + 120); ctx.clip('nonzero');
      K.liquid(ctx, balls); K.bubbles(ctx, balls.slice(0, 7), lt, 60, 5); ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(59,36,64,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(gx - wTop - 6, top - 10); ctx.lineTo(gx - wBot - 6, bot + 6); ctx.lineTo(gx + wBot + 6, bot + 6); ctx.lineTo(gx + wTop + 6, top - 10); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(gx - wTop + 26, top + 30); ctx.lineTo(gx - wBot + 22, bot - 60); ctx.stroke(); ctx.restore();
      K.text(ctx, '설탕 0g', 1360, 480, 130, (lt - 0.6) / 0.3, { pop: true, color: C.lime });
      K.text(ctx, '톡 쏘는 탄산', 1360, 590, 64, (lt - 1.0) / 0.3, { fam: 'sans' });
    },
  };
})();

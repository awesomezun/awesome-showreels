// title (2 bars): the boom. The sun stands just over the limb behind the title, its flare full; 궤도 일곱 comes up out
// of a blur with a light sweep across it; 인류의 일곱 번째 궤도 below; the fiction label in the bottom bar.
(() => {
  SCENES['title'] = {
    draw(ctx, t, env) {
      const K = ORBIT, T3 = K.T3, lt = env.lt, C = K.COL;
      const cam = T3.camera([0, 0.5, 6], [0, -1.8 - 0.2 * lt, -24], 0.6 - 0.008 * lt);
      const sun = K.sunDir(0.0, -0.262);
      K.earth(ctx, cam, { sun, time: lt, spin: 0.6, stars: 0.6, exp: 1 + 0.6 * Math.exp(-lt * 3) });
      K.flare(ctx, cam, sun, K.sunVis(cam, sun) * (1 + 0.5 * Math.exp(-lt * 2.5)));
      K.bars(ctx);
      // the title: a blur-in, then a sweep of light across the letters
      const p = Ease.outC(clamp(lt / 0.9));
      ctx.save(); ctx.font = `400 230px ${FAM.display}`; ctx.textAlign = 'center'; ctx.letterSpacing = `${lerp(90, 36, p)}px`; ctx.filter = p < 1 ? `blur(${(1 - p) * 18}px)` : 'none';
      ctx.globalAlpha = p; const g = ctx.createLinearGradient(0, 330, 0, 560); g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.55, '#DCE4F0'); g.addColorStop(1, '#8E9BB0');
      ctx.fillStyle = g; ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.fillText('궤도 일곱', W / 2 + 18, 520);
      const sx = lerp(-300, W + 300, rm(lt, 0.6, 2.4)), sg = ctx.createLinearGradient(sx - 160, 0, sx + 160, 0); sg.addColorStop(0, 'rgba(255,240,215,0)'); sg.addColorStop(0.5, 'rgba(255,240,215,0.9)'); sg.addColorStop(1, 'rgba(255,240,215,0)');
      ctx.shadowBlur = 0; ctx.fillStyle = sg; ctx.fillText('궤도 일곱', W / 2 + 18, 520); ctx.restore();
      K.card(ctx, '인류의 일곱 번째 궤도', W / 2, 630, 56, lt, { at: 0.8, w: 600 });
      K.card(ctx, '가상의 작품 · 예제', W / 2, H - 52, 40, lt, { at: 1.2, color: C.ink2, track: 4 });
    },
  };
})();

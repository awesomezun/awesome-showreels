// clear (2-3 bars): 투명한 향, set large on the backdrop and drifting left behind the bottle, so the thick glass bends
// it as it passes (each colour a little differently at the edges); the liquid sways; below, 첫 향은 맑게.
(() => {
  SCENES['clear'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, C = K.COL, ph = clamp(lt / env.dur);
      const cam = K.orbit(0.06 * Math.sin(lt * 0.35), 0.05, 2.95, [0, 0.53, 0], 0.5, { cx: W * 0.58 });
      K.studio(ctx, cam, { glow: 'rgba(170,185,215,0.24)' });
      const p = Ease.outC(clamp(lt / 1.1)), x = W * 0.58 + lerp(330, -330, Ease.ioSine(ph));
      ctx.save(); ctx.filter = p < 1 ? `blur(${(1 - p) * 14}px)` : 'none'; K.text(ctx, '투명한 향,', x, 600, 236, { align: 'center', w: 800, alpha: p }); ctx.restore();
      K.bottle(ctx, cam, { rot: 0.5 - 0.22 * lt, light: lerp(-0.4, 0.9, ph), time: lt, level: 0.56, slosh: 0.05 * Math.sin(lt * 1.3) });
      K.fade(ctx, '첫 향은 맑게', 150, 960, 52, lt, { at: 0.9, color: C.ink2, w: 700, track: 6 });
    },
  };
})();

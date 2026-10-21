// open (2 bars): black, then the Earth's limb in the scope frame; the dawn line brightens along it and the sun breaks
// over the edge into a flare. The film's name sits small in the top bar from the start; 지상 400킬로미터.
(() => {
  SCENES['open'] = {
    draw(ctx, t, env) {
      const K = ORBIT, lt = env.lt, C = K.COL, ph = clamp(lt / env.dur);
      const cam = K.T3.camera([0.3 * ph, 0.5, 6], [-2 + 2 * ph, -0.2 * 30 + 0.5, -24], 0.6);
      const sun = K.sunDir(-0.02, lerp(-0.31, -0.262, Ease.ioSine(ph)));
      K.earth(ctx, cam, { sun, time: lt, spin: 0.6, exp: Ease.ioSine(clamp(lt / 1.2)), stars: 1 });
      K.flare(ctx, cam, sun, K.sunVis(cam, sun) * clamp(lt / 1.2));
      K.bars(ctx);
      K.card(ctx, '지상 400킬로미터.', W / 2, 470, 64, lt, { at: 1.2, w: 600 });
      K.card(ctx, '다큐멘터리 〈궤도 일곱〉', 150, 92, 40, lt, { at: 0.2, fin: 0.5, align: 'left', color: C.ink2, track: 6 });
    },
  };
})();

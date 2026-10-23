// reveal (1 bar; 2 in the 30-second cut): the line sweeps over the top and ends in a heart while the camera pulls far
// back: everything it drew (the nib, the loops, the cup, the notebook, the plant) is one picture. 한 번도 떼지 않은 선.
(() => {
  SCENES['reveal'] = {
    draw(ctx, t, env) {
      const K = ONE, lt = env.lt, M = K.MARK, c = lerp(M.plant, K.TOTAL, Ease.ioQ(rm(lt, 0, 1.9)));
      K.ground(ctx);
      const cam = K.mixCam(K.cam(c, 1.0, { lag: 700 }), K.FULL, Ease.ioC(rm(lt, 0.4, 2.2)));
      const tip = K.draw(ctx, c, cam);
      K.pen(ctx, tip, 1 - clamp((lt - 1.9) / 0.3), lt);
      K.text(ctx, '한 번도 떼지 않은 선', W / 2, 930, 84, (lt - 1.6) / 0.5, { align: 'center' });
    },
  };
})();

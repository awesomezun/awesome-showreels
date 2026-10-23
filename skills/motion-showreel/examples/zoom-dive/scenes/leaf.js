// leaf (30-second cut, 2 bars): the dive from layer 2 to layer 4, ten times closer every four beats; 열 배씩, 더 가까이.
(() => {
  SCENES['leaf'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 2 + 2 * lt / env.dur, a = Math.min((lt - 0.2) / 0.4, (env.dur - 0.5 - lt) / 0.4);
      D.view(ctx, z, t); D.hud(ctx, z); D.scrim(ctx, 70, 350, a);
      D.text(ctx, '열 배씩, 더 가까이', 120, 200, 84, a); D.text(ctx, '잎맥을 지나 세포로', 124, 270, 40, a - 0.3, { fam: 'sans', w: 500 });
    },
  };
})();

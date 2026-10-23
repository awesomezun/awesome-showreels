// atom (30-second cut, 2 bars): the dive from layer 8 to layer 10, ten times closer every four beats; 그리고, 원자 하나.
(() => {
  SCENES['atom'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 8 + 2 * lt / env.dur, a = Math.min((lt - 0.2) / 0.4, (env.dur - 0.5 - lt) / 0.4);
      D.view(ctx, z, t); D.hud(ctx, z); D.scrim(ctx, 70, 350, a);
      D.text(ctx, '그리고, 원자 하나', 120, 200, 84, a); D.text(ctx, '엽록소를 지나 마그네슘으로', 124, 270, 40, a - 0.3, { fam: 'sans', w: 500 });
    },
  };
})();

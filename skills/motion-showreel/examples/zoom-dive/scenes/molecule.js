// molecule (30-second cut, 2 bars): the dive from layer 6 to layer 8, ten times closer every four beats; 햇빛을 붙잡는 분자들.
(() => {
  SCENES['molecule'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 6 + 2 * lt / env.dur, a = Math.min((lt - 0.2) / 0.4, (env.dur - 0.5 - lt) / 0.4);
      D.view(ctx, z, t); D.hud(ctx, z); D.scrim(ctx, 70, 350, a);
      D.text(ctx, '햇빛을 붙잡는 분자들', 120, 200, 84, a); D.text(ctx, '막을 지나 단백질로', 124, 270, 40, a - 0.3, { fam: 'sans', w: 500 });
    },
  };
})();

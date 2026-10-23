// hook (2 bars): the exhibit table from a metre up, a ginkgo leaf in the middle; the camera starts its dive at once,
// ten times closer every four beats; 끝없는 확대, 과학관 특별전.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 2 * lt / env.dur;
      D.view(ctx, z, t); D.hud(ctx, z, (lt - 0.2) / 0.4);
      const a = Math.min((lt - 0.3) / 0.5, (env.dur - 0.9 - lt) / 0.5);
      D.scrim(ctx, 290, 640, a); D.text(ctx, '끝없는 확대', 120, 470, 150, a); D.text(ctx, '과학관 특별전', 126, 550, 48, a - 0.3, { fam: 'sans', w: 500 });
    },
  };
})();

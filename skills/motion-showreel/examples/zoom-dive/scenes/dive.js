// dive (15-second cut, 2 bars): from the veins to the molecule in eight beats, ten times closer on every beat, one
// glockenspiel note per step.
(() => {
  SCENES['dive'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 2 + 8 * lt / env.dur;
      D.view(ctx, z, t); D.hud(ctx, z); D.scrim(ctx, 70, 300, Math.min((lt - 0.1) / 0.4, (env.dur - 0.4 - lt) / 0.4));
      D.text(ctx, '열 배씩, 더 가까이', 120, 200, 84, Math.min((lt - 0.1) / 0.4, (env.dur - 0.4 - lt) / 0.4));
    },
  };
})();

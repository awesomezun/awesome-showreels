// loader (30-second cut, 2 bars): the box opens into a coral ring with a gap and spins as a loader, slowing on each
// beat; 자동 동기화.
(() => {
  SCENES['loader'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt, B = env.beatSec;
      K.ground(ctx);
      const spin = 2.2 * lt + 0.5 * Math.sin(lt / B * Math.PI * 2);
      K.scene(ctx, env, 'loader', { spin });
      K.text(ctx, '자동 동기화', K.CX, 820, 72, (lt - 0.4) / 0.35);
    },
  };
})();

// verse2 (30-second cut, 2 bars): inside the bus by the window; the window slides open, the curtain catches the wind
// and the coast streams past: 창문을 열면 / 바다 냄새가 나.
(() => {
  SCENES['verse2'] = {
    draw(ctx, t, env) {
      const U = BUS, lt = env.lt, b = env.beatSec;
      U.window(ctx, t, lt * 400, Ease.ioC(clamp((lt - 0.6 * b) / (1.4 * b))));
      U.lyrics(ctx, env, ['창문을 열면', '바다 냄새가 나'], 300);
    },
  };
})();

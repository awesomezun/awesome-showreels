// end (2 bars): everything springs back into the ink dot; 하나의 모양, 모든 순간, then 한 점 플래너 · 가상의 앱입니다;
// the words leave on the last beat so the final frame is the first: the dot alone.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt, B = env.beatSec, out = 1 - clamp((lt - (env.dur - 1.2 * B)) / (0.9 * B));
      K.ground(ctx);
      K.scene(ctx, env, 'dot', { f: 2.0, z: 0.5, breathe: out });
      K.text(ctx, '하나의 모양, 모든 순간', K.CX, 780, 100, Math.min((lt - 0.3) / 0.35, out));
      K.text(ctx, '한 점 플래너 · 가상의 앱입니다', K.CX, 860, 40, Math.min((lt - 0.7) / 0.35, out), { w: 600, color: K.COL.mute });
    },
  };
})();

// moment (2-3 bars): the core message. The field keeps flowing and never repeats; a clock under the lines counts this
// very moment to the millisecond; 같은 순간은 / 두 번 오지 않아요.
(() => {
  SCENES['moment'] = {
    draw(ctx, t, env) {
      const K = FLOW, lt = env.lt;
      K.bg(ctx, { c0: '#101428' });
      K.flow(ctx, t, { n: 3000, life: 3.0, kind: 'drift', alpha: 0.62, seed: 4, speed: 120, width: 1.9 });
      K.line(ctx, '같은 순간은', 150, 470, 120, lt, { at: 0.3 });
      K.line(ctx, '두 번 오지 않아요', 150, 620, 120, lt, { at: 1.1, color: '#B9D2FF' });
      const ms = Math.floor((41527.218 + t) * 1000), s = Math.floor(ms / 1000), clock = `${String(Math.floor(s / 3600) % 24).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
      K.line(ctx, '지금 ' + clock, 154, 760, 48, lt, { at: 1.8, color: K.COL.ink2, track: 2 });
    },
  };
})();

// rooms (3 bars, 30-s cut): the three rooms, one a bar: 1관 바람 (long horizontal streams in blue), 2관 물 (a slow
// whirlpool in teal), 3관 빛 (rays from the centre in gold); each room fades into the next on the bar line.
(() => {
  const R = [['1관', '바람', 'wind'], ['2관', '물', 'water'], ['3관', '빛', 'light']];
  SCENES['rooms'] = {
    draw(ctx, t, env) {
      const K = FLOW, lt = env.lt, bar = env.barSec, i = Math.max(0, Math.min(2, Math.floor(lt / bar))), l2 = lt - i * bar;
      K.bg(ctx, { c0: ['#0C1428', '#08201E', '#22180A'][i] });
      const draw = (j, a) => { if (a <= 0) return; const kind = R[j][2];
        K.flow(ctx, t, { n: 2400, life: kind === 'wind' ? 3.2 : 2.6, kind, pal: K.PAL[kind], alpha: 0.55 * a, seed: 10 + j, speed: kind === 'wind' ? 220 : kind === 'light' ? 140 : 120,
          spawn: kind === 'wind' ? (k, c) => [-300 + hash(k * 1.3 + c) * (W + 300), hash(k * 5.1 + c * 2) * H] : kind === 'light' ? (k, c) => { const a2 = hash(k * 2.7 + c) * TAU, d = 20 + Math.pow(hash(k * 3.3 + c), 0.7) * 700; return [W / 2 + Math.cos(a2) * d, H / 2 + Math.sin(a2) * d]; } : null }); };
      const fade = clamp(l2 / 0.5);
      if (i > 0 && fade < 1) draw(i - 1, 1 - fade);
      draw(i, i === 0 ? clamp(lt / 0.4) : fade);
      K.line(ctx, R[i][0], 150, 430, 56, l2, { at: 0.15, color: K.COL.ink2, track: 10 });
      K.line(ctx, R[i][1], 150, 600, 170, l2, { at: 0.3, w: 600 });
    },
  };
})();

// message (2 bars): the core line, alone on the desk: 할 일은 / 딱 세 칸. (the second line blue), and under it 많이
// 말고, 꾸준히.; the bloom glows behind the words on the beat.
(() => {
  SCENES['message'] = {
    draw(ctx, t, env) {
      const K = UI, lt = env.lt, B = env.beatSec, C = K.COL;
      K.desk(ctx);
      K.bloom(ctx, 960, 520, 560, 0.35 + 0.25 * beatPulse(env, 4), lt);
      const a = K.sp(lt, 0.05), b = K.sp(lt, 0.3), c = K.sp(lt, 0.9);
      K.text(ctx, '할 일은', 960, 450 + 40 * (1 - a), 140, { align: 'center', w: 800, alpha: clamp(a * 1.6) });
      K.text(ctx, '딱 세 칸.', 960, 630 + 40 * (1 - b), 170, { align: 'center', w: 800, color: C.blue, alpha: clamp(b * 1.6) });
      K.text(ctx, '많이 말고, 꾸준히.', 960, 780 + 24 * (1 - c), 52, { align: 'center', w: 500, color: C.ink2, alpha: clamp(c * 1.6) });
    },
  };
})();

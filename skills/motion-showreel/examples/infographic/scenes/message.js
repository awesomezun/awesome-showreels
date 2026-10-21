// message (2-3 bars): the core line, centred: 자전거 출근, / 3년 새 두 배. (the second line in red), a bicycle rides
// across under it, and the report's name and the fictional-data label close it.
(() => {
  SCENES['message'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      K.rise(ctx, '자전거 출근,', 960, 420, 150, lt, { at: 0.05, align: 'center' });
      K.rise(ctx, '3년 새 두 배.', 960, 620, 190, lt, { at: 0.35, align: 'center', color: C.red, w: 900 });
      const bx = lerp(-200, W + 200, ((lt - 0.2) * 0.22) % 1);
      ctx.fillStyle = 'rgba(35,38,43,0.15)'; ctx.fillRect(0, 812, W, 4);
      K.bike(ctx, bx, 762, 44, C.navy, lt, { alpha: clamp((lt - 0.2) * 3) });
      K.rise(ctx, '한빛시 자전거 리포트 2026 · 가상 데이터 예제', 960, 960, 40, lt, { at: 1.0, align: 'center', color: C.ink2, w: 700 });
    },
  };
})();

// end (2-3 bars): the name again in characters, the install line, the fiction label; a small donut keeps turning in
// the corner.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = TTY, lt = env.lt, C = K.COL, B = K.buf();
      K.rasterText('글자판', 6, 2, 56, 10, { w: 700 }).forEach(p => K.put(B, p.c, p.r, K.RAMP[Math.min(10, 1 + Math.floor(p.v * 10))], p.v > 0.7 ? C.mag : p.v > 0.4 ? C.blue : C.cyan));
      K.donut(1 + lt * 1.1, 0.6 + lt * 0.55, 78, 8, 1.2).forEach(p => K.put(B, p.c, p.r, K.lumChar(p.L), p.L > 0.6 ? C.yel : C.red));
      K.put(B, 8, 14, '터미널 대시보드 · termpan', C.fg);
      K.put(B, 8, 16, '~ $ brew install termpan', C.green);
      K.put(B, 8, 18, K.typed('# 가상의 도구 · 예제', lt, 0.3, 30), C.dim);
      K.render(ctx, B);
    },
  };
})();

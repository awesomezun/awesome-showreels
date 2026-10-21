// image (4-5 bars): the core message, shown. termpan draw: a thousand characters fly in from everywhere and land as
// the shaded donut (each cell's character set by the light on the torus), which then spins; on the right,
// 글자가 모이면 / 그림이 돼요 and a count of the characters.
(() => {
  SCENES['image'] = {
    draw(ctx, t, env) {
      const K = TTY, lt = env.lt, C = K.COL, B = K.buf();
      const c1 = K.put(B, 2, 1, '~ $ ', C.green), cmd = K.typed('termpan draw donut', lt, 0.1, 30); K.put(B, c1, 1, cmd, C.fg);
      const spin = Math.max(0, lt - 2.2), A = 1.0 + spin * 1.1, Bt = 0.6 + spin * 0.55, pts = K.donut(A, Bt, 24, 12, 1.9);
      const cells = pts.map(p => ({ c: p.c, r: p.r, ch: K.lumChar(p.L), col: p.L > 0.8 ? C.yel : p.L > 0.3 ? C.red : C.mag }));
      const k = clamp((lt - 0.6) / 1.6);
      if (k >= 1) cells.forEach(p => K.put(B, p.c, p.r, p.ch, p.col));
      K.put(B, 52, 8, K.typed('글자가 모이면', lt, 1.0, 12), C.fg);
      K.put(B, 52, 10, K.typed('그림이 돼요', lt, 1.8, 12), C.yel);
      if (lt > 2.6) K.put(B, 52, 13, `# 글자 ${cells.length.toLocaleString('en-US')}개로 그린 도넛`, C.dim);
      K.render(ctx, B);
      if (k < 1 && k > 0) K.fly(ctx, cells, k, { seed: 2, stagger: 0.5 });
    },
  };
})();

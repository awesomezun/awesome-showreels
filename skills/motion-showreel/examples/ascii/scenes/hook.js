// hook (2 bars): a prompt, a blinking cursor; termpan is typed and run; the name 글자판 assembles out of flying
// characters, each landing on its cell with a character chosen by how much of the letter covers it; the tagline types.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = TTY, lt = env.lt, C = K.COL, B = K.buf();
      const c1 = K.put(B, 2, 1, '~ $ ', C.green), cmd = K.typed('termpan', lt, 0.15, 16); K.put(B, c1, 1, cmd, C.fg);
      const cells = K.rasterText('글자판', 14, 4, 66, 12, { w: 700 }).map(p => ({ c: p.c, r: p.r, ch: K.RAMP[Math.min(10, 1 + Math.floor(p.v * 10))], col: p.v > 0.7 ? C.mag : p.v > 0.4 ? C.blue : C.cyan }));
      const k = clamp((lt - 0.75) / 1.3);
      if (k >= 1) cells.forEach(p => K.put(B, p.c, p.r, p.ch, p.col));
      const tag = K.typed('터미널 대시보드 · termpan', lt, 2.0, 18); K.put(B, 24, 18, tag, C.yel);
      K.render(ctx, B);
      if (k > 0 && k < 1) K.fly(ctx, cells, k, { seed: 1, scramble: true });
      if (lt < 0.75) K.cursor(ctx, c1 + K.len(cmd), 1, lt); else if (lt > 2.0) K.cursor(ctx, 24 + K.len(tag), 18, lt, K.COL.yel);
    },
  };
})();

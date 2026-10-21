// install (2 bars, 30-s cut): brew install termpan is typed; a progress bar of blocks fills; [완료]; 설치는 한 줄.
(() => {
  SCENES['install'] = {
    draw(ctx, t, env) {
      const K = TTY, lt = env.lt, C = K.COL, B = K.buf();
      const c1 = K.put(B, 2, 3, '~ $ ', C.green), cmd = K.typed('brew install termpan', lt, 0.1, 26); K.put(B, c1, 3, cmd, C.fg);
      const p = clamp((lt - 1.0) / 1.6);
      if (lt > 0.95) { K.put(B, 2, 5, '==> termpan 0.9 받는 중', C.cyan); K.bar(B, 2, 7, 60, p, C.green); K.put(B, 64, 7, `${Math.round(p * 100)}%`, C.fg); }
      if (p >= 1) { K.put(B, 2, 9, '[완료] termpan 설치됨', C.green); }
      K.put(B, 2, 14, K.typed('설치는 한 줄', lt, 0.6, 10), C.yel);
      K.render(ctx, B);
      if (lt < 1.0) K.cursor(ctx, c1 + K.len(cmd), 3, lt);
    },
  };
})();

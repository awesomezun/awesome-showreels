// end (2 bars): the lines gather into the title once more and hold, breathing; the dates and the museum, the fiction
// label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = FLOW, lt = env.lt;
      K.bg(ctx);
      const T = K.textPoints('흐름의 지도', W / 2, 520, 230, 6, { align: 'center', w: 600 });
      K.flow(ctx, t, { n: 3400, life: 2.4, kind: 'drift', alpha: 0.5, seed: 31, target: T, gather: Ease.ioC(clamp(lt / 1.4)) });
      K.line(ctx, '흐름의 지도', W / 2, 520, 230, lt, { at: 1.2, align: 'center', w: 600, alpha: 0.95 });
      K.line(ctx, '11.1 – 12.31 · 한빛 미술관', W / 2, 700, 56, lt, { at: 1.5, align: 'center', color: K.COL.ink2 });
      K.line(ctx, '가상의 전시 · 예제', W / 2, 790, 40, lt, { at: 1.8, align: 'center', color: '#7E8798' });
    },
  };
})();

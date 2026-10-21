// hook (2 bars): darkness, then one point that blooms into a field of flowing lines; the lines gather into the
// letters of 흐름의 지도 and the title settles crisp over them; the exhibition is named small from the start.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = FLOW, lt = env.lt;
      K.bg(ctx);
      const T = K.textPoints('흐름의 지도', W / 2, 610, 250, 6, { align: 'center', w: 600 }), r = 40 + 900 * Ease.outC(clamp(lt / 2.2));
      K.flow(ctx, lt, { n: 3400, life: 2.2, kind: 'drift', alpha: 0.55 * clamp(lt / 0.4), target: T, gather: Ease.ioC(rm(lt, 1.3, 3.2)),
        spawn: (i, c) => { const a = hash(i * 2.1 + c * 7) * TAU, d = Math.sqrt(hash(i * 4.7 + c * 3)) * r; return [W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d * 0.6]; } });
      K.line(ctx, '미디어아트 전시', W / 2, 250, 46, lt, { at: 0.2, align: 'center', color: K.COL.ink2, track: 14 });
      K.line(ctx, '흐름의 지도', W / 2, 610, 250, lt, { at: 3.7, dur: 1.0, align: 'center', w: 600, alpha: 0.95 });
    },
  };
})();

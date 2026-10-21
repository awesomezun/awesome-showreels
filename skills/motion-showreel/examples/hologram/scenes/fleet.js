// fleet (3-4 bars): the core message, shown. Satellites switch on across the three shells as a counter runs to 300,
// low orbits fast, the geostationary ring slow; the globe turns; 궤도 위 300기를 / 한 화면에; a panel breaks the
// count down by shell.
(() => {
  SCENES['fleet'] = {
    draw(ctx, t, env) {
      const K = HOLO, lt = env.lt, f = K.flick(lt, 1), n = Math.floor(300 * Ease.outC(clamp((lt - 0.3) / 2.4)));
      K.room(ctx);
      const v = K.view(1300, 500, 175, 0.6 + lt * 0.18, 0.42);
      K.projector(ctx, 1300, 920, 900, 80, 1);
      K.rings(ctx, v, f); K.globe(ctx, v, f * 0.85); K.sats(ctx, v, lt, n, f);
      K.text(ctx, '궤도 위 300기를', 110, 330, 96, { a: clamp((lt - 0.2) / 0.3) });
      K.text(ctx, '한 화면에', 110, 470, 130, { a: clamp((lt - 0.9) / 0.3), color: K.COL.holo2 });
      K.panel(ctx, 110, 600, 760, 250, clamp((lt - 1.2) / 0.3));
      K.text(ctx, `위성 ${String(n).padStart(3, '0')} / 300`, 140, 680, 60, { mono: true, a: clamp((lt - 1.2) / 0.3) });
      [['저궤도', 200], ['중궤도', 60], ['정지궤도', 40]].forEach(([s, k], i) => K.text(ctx, `${s} ${k}`, 140 + i * 240, 790, 40, { mono: true, a: clamp((lt - 1.5 - i * 0.2) / 0.3), color: K.COL.ink2, glow: false }));
      K.scan(ctx, lt);
    },
  };
})();

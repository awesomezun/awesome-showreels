// hook (2 bars): a dark control room; the projector on the table switches on, its cone of light flickers up, and the
// globe draws itself from the bottom up in wireframe and land dots; the orbit rings follow; 오르빗 컨트롤, 위성 관제
// 플랫폼.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = HOLO, lt = env.lt, on = lt < 0.2 ? 0 : lt < 0.5 ? (hash(Math.floor(lt * 30)) > 0.4 ? 1 : 0.2) : 1, f = K.flick(lt) * on;
      K.room(ctx);
      const v = K.view(1260, 470, 230, 0.4 + lt * 0.25);
      K.projector(ctx, 1260, 900, 760, 160, on);
      K.globe(ctx, v, f, { reveal: 2 * Ease.ioC(clamp((lt - 0.5) / 1.6)) });
      K.rings(ctx, v, f * clamp((lt - 1.8) / 0.6));
      K.text(ctx, '오르빗 컨트롤', 120, 470, 120, { a: clamp((lt - 0.9) / 0.3) * K.flick(lt, 3) });
      K.text(ctx, '위성 관제 플랫폼', 126, 560, 52, { a: clamp((lt - 1.3) / 0.3), color: K.COL.ink2, track: 6, glow: false });
      K.scan(ctx, lt);
    },
  };
})();

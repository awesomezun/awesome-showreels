// end (2 bars): the globe and the fleet turning over the projector; 오르빗 컨트롤, 위성 관제 플랫폼, the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = HOLO, lt = env.lt, f = K.flick(lt, 5);
      K.room(ctx);
      const v = K.view(1300, 480, 170, 3 + lt * 0.2, 0.42);
      K.projector(ctx, 1300, 900, 860, 80, 1);
      K.rings(ctx, v, f * 0.8); K.globe(ctx, v, f * 0.85); K.sats(ctx, v, lt + 10, 300, f);
      K.text(ctx, '오르빗 컨트롤', 110, 470, 120, { a: clamp(lt / 0.3) * f });
      K.text(ctx, '위성 관제 플랫폼', 116, 560, 52, { a: clamp((lt - 0.3) / 0.3), color: K.COL.ink2, track: 6, glow: false });
      K.text(ctx, '가상의 서비스 · 예제', 116, 650, 40, { a: clamp((lt - 0.6) / 0.3), color: '#5A7A8C', glow: false });
      K.scan(ctx, lt);
    },
  };
})();

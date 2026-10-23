// rival (30-second cut, 2 bars): a blue rival pulls up from behind on the left and passes, close; the tape tears for a
// moment as it goes by; 라이벌 12대.
(() => {
  SCENES['rival'] = {
    draw(ctx, t, env) {
      const K = OUTRUN, lt = env.lt, B = env.beatSec, pass = Ease.ioC(rm(lt, 0.4, 2.6));
      K.sky(ctx); K.sun(ctx, W / 2, 470, 230, lt); K.mountains(ctx, 900 + lt * 60); K.grid(ctx, lt, 2.6, { road: true });
      K.palms(ctx, lt, 2.4, 0);
      const rs = lerp(1.4, 0.38, pass), rx = lerp(260, 720, pass), ry = lerp(1250, 720, pass);
      K.car(ctx, W / 2 + 120, 1000, 0.82, lt, { bank: -0.02 });
      K.car(ctx, rx, ry, rs, lt + 1, { col: '#2E6BFF', plate: 'R-12' });
      K.neon(ctx, '라이벌 12대', W - 160, 240, 96, (lt - 1.2) / 0.2, { align: 'right', col: '#3CF0FF', flicker: lt });
      const tear = Math.exp(-(((lt - 1.5) / 0.15) ** 2));
      K.vhs(ctx, lt, { clock: 18, tear });
    },
  };
})();

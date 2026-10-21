// station (2-3 bars): the station glides in above the Earth, its ring turning, the sun behind it flaring at its edge;
// 여섯 번 지었고, / 여섯 번 내려왔다. then 이번엔, 남는다.
(() => {
  SCENES['station'] = {
    draw(ctx, t, env) {
      const K = ORBIT, T3 = K.T3, lt = env.lt, C = K.COL, ph = clamp(lt / env.dur), sw = env.dur * 0.56;
      const eye = [lerp(3.4, 1.9, Ease.ioSine(ph)), lerp(0.7, 1.0, ph), lerp(4.6, 3.6, Ease.ioSine(ph))];
      const cam = T3.camera(eye, [0.1, -0.15, 0], 0.62, { cx: W * 0.66 });
      const sun = K.sunDir(-0.52, 0.11);
      K.earth(ctx, cam, { sun, time: lt, spin: 0.9 + lt * 0.004, stars: 1, exp: 0.55 });
      K.drawStation(ctx, cam, K.station(lt * 0.22, [0, 0, 0], 0.25, -0.45), sun, 1);
      K.flare(ctx, cam, sun, 0.8 * K.sunVis(cam, sun));
      K.bars(ctx);
      K.card(ctx, '여섯 번 지었고,', 150, 470, 60, lt, { at: 0.3, out: sw - 0.6, align: 'left' });
      K.card(ctx, '여섯 번 내려왔다.', 150, 560, 60, lt, { at: 1.1, out: sw - 0.6, align: 'left' });
      K.card(ctx, '이번엔, 남는다.', 150, 520, 84, lt, { at: sw, w: 700, align: 'left' });
    },
  };
})();

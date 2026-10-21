// hook (2 bars): the camera tilts down out of a deep blue sky full of cumulus and power lines to a bus stop under a
// cherry tree in bloom, petals drifting through the sunlight; 청춘 웹툰, then 벚꽃 정류장.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = HARU, lt = env.lt, oy = lerp(-760, 0, Ease.ioC(clamp(lt / 3.0)));
      ctx.save(); ctx.translate(0, -oy);
      K.sky(ctx, -1200, 2100);
      K.cloud(ctx, 520, -560, 1.5, 3); K.cloud(ctx, 1500, -300, 1.2, 7); K.cloud(ctx, 900, 200, 0.9, 11, { a: 0.95 });
      K.sun(ctx, 1640, -420, lt, 0.9);
      K.wires(ctx, 260, -60);
      K.street(ctx, 820);
      K.stop(ctx, 860, 960, lt, { board: true });
      K.tree(ctx, 1530, 900, 1.15, lt);
      ctx.restore();
      K.petals(ctx, lt, { n: 60 });
      K.line(ctx, '청춘 웹툰', 116, 200, 56, lt, { at: 2.0 });
      K.line(ctx, '벚꽃 정류장', 100, 380, 170, lt, { at: 2.3, dur: 1.0 });
    },
  };
})();

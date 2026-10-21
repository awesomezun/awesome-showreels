// wait (3-4 bars): the core message. At the stop, two students sit side by side on the bench, seen from behind, the
// sun rimming their hair; the board blinks 3분 후 도착; petals fall; 그 봄, 버스는 / 늘 3분 늦었다.
(() => {
  SCENES['wait'] = {
    draw(ctx, t, env) {
      const K = HARU, lt = env.lt, z = 1 + 0.03 * lt / env.dur;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      K.sky(ctx, 0, 900);
      K.cloud(ctx, 1280 + lt * 6, 240, 1.1, 21); K.cloud(ctx, 1500 + lt * 4, 560, 0.7, 23, { a: 0.9 });
      K.sun(ctx, 1700, 120, lt, 0.9);
      K.wires(ctx, 1840, 40);
      K.street(ctx, 820);
      K.tree(ctx, 1560, 900, 1.0, lt);
      K.stop(ctx, 860, 960, lt, { text: '3분 후 도착' });
      K.pair(ctx, 1030, 830, 1.0, lt, { lean: 0.02 * Math.sin(lt * 0.8) });
      ctx.restore();
      K.petals(ctx, lt, { n: 70 });
      K.line(ctx, '그 봄, 버스는', 110, 215, 110, lt, { at: 0.3 });
      K.line(ctx, '늘 3분 늦었다.', 110, 355, 130, lt, { at: 1.2, color: '#FFE4EE' });
    },
  };
})();

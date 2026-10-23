// escape (30-second cut, 2 bars): a moon is lowered on its rod; the rabbit leaps from the turtle's back to the shore in
// big arcs, one per beat, past the moon. 꾀 많은 토끼는 뭍으로 깡충.
(() => {
  SCENES['escape'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt, B = env.beatSec;
      K.stage(ctx, K.lamp(lt), { lx: 1100 });
      K.moon(ctx, 1300, lerp(-80, 260, Ease.outBack(rm(lt, 0.1, 0.8), 1.2)), 80);
      K.land(ctx, 1150, K.SX + K.SW + 40, 660);
      K.waves(ctx, 780, lt, { speed: 50 });
      K.turtle(ctx, 420, 760, 0.9, { swim: lt * 1.2, neck: 0.3 });
      const hb = (lt - 0.6) / B, k = Math.min(4, Math.max(0, Math.floor(hb))), f = hb > 0 && hb < 4 ? hb - k : 0;
      const xs = [420, 720, 1000, 1280, 1500], x = lerp(xs[k], xs[Math.min(4, k + 1)], Ease.ioQ(f)), base = lerp(700, 680, x / 1900);
      K.rabbit(ctx, x, base, 0.95, { hop: f, height: 200, ear: lt * 2 });
      K.frame(ctx);
      K.caption(ctx, '꾀 많은 토끼는 뭍으로 깡충', (lt - 0.4) / 0.4);
    },
  };
})();

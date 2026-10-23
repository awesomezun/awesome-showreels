// meet (2 bars): the shore. A hill with a pine on the left, the sea on the right; the turtle swims in, climbs out and
// stretches its neck in a bow; the rabbit hops in from the hill and flicks its ears. 바닷속 자라가 뭍에 올라 토끼를 만났어요.
(() => {
  SCENES['meet'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt, B = env.beatSec;
      K.stage(ctx, K.lamp(lt), { lx: 900 });
      K.land(ctx, K.SX - 40, 1000, 640);
      K.waves(ctx, 760, lt, { speed: 40 });
      const tx = lerp(1700, 1080, Ease.ioC(rm(lt, 0.1, 2.0))), ty = lerp(800, 700, Ease.ioC(rm(lt, 1.4, 2.2)));
      K.turtle(ctx, tx, ty, 1.0, { dir: -1, swim: lt * 1.6, neck: Ease.outBack(rm(lt, 2.4, 2.9)) * (0.8 + 0.2 * Math.sin(lt * 3)), tilt: 0.04 * Math.sin(lt * 2) });
      const hb = (lt - 0.6) / B, hops = Math.min(3, Math.max(0, hb)), rx = lerp(300, 720, Ease.outC(clamp(hops / 3)));
      K.rabbit(ctx, rx, 660 - (rx - 300) * 0.06, 1.0, { hop: hb > 0 && hb < 3 ? hb % 1 : 0, height: 70, ear: lt * 1.3 });
      K.frame(ctx);
      K.caption(ctx, '바닷속 자라가 뭍에 올라 토끼를 만났어요', (lt - 0.4) / 0.4);
    },
  };
})();

// sea (30-second cut, 2 bars): under the sea. Back and front strips of waves roll the other way; fish cross; the turtle
// swims across with the rabbit riding on its shell, bubbles rising. 토끼를 등에 태우고 용궁으로.
(() => {
  SCENES['sea'] = {
    draw(ctx, t, env) {
      const K = GRIM, lt = env.lt;
      K.stage(ctx, K.lamp(lt) * 0.92, { lx: 1000 });
      K.waves(ctx, 330, -lt, { speed: 50, lift: 0.3, alpha: 0.35 });
      for (let k = 0; k < 4; k++) K.fish(ctx, ((lt * (90 + 30 * k) + k * 420) % 1900) + 60, 380 + k * 90, 0.8 + 0.2 * (k % 2), lt * 8 + k, [K.COL.blue, K.COL.red, K.COL.gold, K.COL.green][k]);
      const x = lerp(260, 1500, Ease.ioQ(clamp(lt / env.dur))), y = 560 + 18 * Math.sin(lt * 2.2);
      K.turtle(ctx, x, y, 1.0, { swim: lt * 1.4, neck: 0.4 + 0.1 * Math.sin(lt * 2.4), tilt: 0.05 * Math.sin(lt * 2.2) });
      K.rabbit(ctx, x - 20, y - 70, 0.75, { ear: lt * 1.1, rods: false });
      K.waves(ctx, 790, lt, { speed: 70 });
      K.frame(ctx);
      K.caption(ctx, '토끼를 등에 태우고 용궁으로', (lt - 0.3) / 0.4);
    },
  };
})();

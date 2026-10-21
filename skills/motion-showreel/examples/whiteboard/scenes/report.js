// report (2 bars, 30-s cut): what to do: 의심되면 누르지 말고, an envelope, a green arrow to a shield with a tick,
// 보안팀으로 전달 and the (fictional) security address.
(() => {
  SCENES['report'] = {
    draw(ctx, t, env) {
      const K = WB, lt = env.lt, B = env.beatSec, id = K.SCENE_PANEL['report'], pan = K.PANEL[id];
      const prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : pan;
      const cam = K.camFor ? K.camFor(env, id, lt) : { x: pan.cx, y: pan.cy, z: 1 };
      K.board(ctx, cam);
      ctx.save(); K.cam(ctx, cam); const hand = K.world(ctx, env, id, lt); ctx.restore();
      if (hand) { const [hx, hy] = K.toScreen(cam, hand[0], hand[1]); K.hand(ctx, hx, hy, { s: cam.z * 0.8 }); }
    },
  };
})();

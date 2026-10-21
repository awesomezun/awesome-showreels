// example (3 bars, 30-s cut): a phishing mail drawn as a window: the sender line, the urgent subject, a blue button;
// red loops ring the 0 in hangye0l and the 24-hour deadline, an arrow points from the button to its real address.
(() => {
  SCENES['example'] = {
    draw(ctx, t, env) {
      const K = WB, lt = env.lt, B = env.beatSec, id = K.SCENE_PANEL['example'], pan = K.PANEL[id];
      const prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : pan;
      const cam = K.camFor ? K.camFor(env, id, lt) : { x: pan.cx, y: pan.cy, z: 1 };
      K.board(ctx, cam);
      ctx.save(); K.cam(ctx, cam); const hand = K.world(ctx, env, id, lt); ctx.restore();
      if (hand) { const [hx, hy] = K.toScreen(cam, hand[0], hand[1]); K.hand(ctx, hx, hy, { s: cam.z * 0.8 }); }
    },
  };
})();

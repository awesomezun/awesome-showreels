// hook (2 bars): the name, by hand. The hand draws an envelope and a fishing hook through its flap, then writes 사내
// 보안 교육, 피싱 메일 and 3초 판별법 (red) and underlines it; the camera eases in a little.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = WB, lt = env.lt, B = env.beatSec, id = K.SCENE_PANEL['hook'], pan = K.PANEL[id];
      const prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : pan;
      const cam = K.camFor ? K.camFor(env, id, lt) : { x: pan.cx, y: pan.cy, z: 1 };
      K.board(ctx, cam);
      ctx.save(); K.cam(ctx, cam); const hand = K.world(ctx, env, id, lt); ctx.restore();
      if (hand) { const [hx, hy] = K.toScreen(cam, hand[0], hand[1]); K.hand(ctx, hx, hy, { s: cam.z * 0.8 }); }
    },
  };
})();

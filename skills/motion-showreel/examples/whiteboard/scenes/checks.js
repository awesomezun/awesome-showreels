// checks (3-4 bars): the three checks, one column at a time: a circled number, a marker icon (an envelope with a red @,
// a chain link under a magnifier, a clock with an exclamation mark), the label and the hint; the camera travels in from
// the title, follows each column and pulls back to show all three.
(() => {
  SCENES['checks'] = {
    draw(ctx, t, env) {
      const K = WB, lt = env.lt, B = env.beatSec, id = K.SCENE_PANEL['checks'], pan = K.PANEL[id];
      const prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : pan;
      const cam = K.camFor ? K.camFor(env, id, lt) : { x: pan.cx, y: pan.cy, z: 1 };
      K.board(ctx, cam);
      ctx.save(); K.cam(ctx, cam); const hand = K.world(ctx, env, id, lt); ctx.restore();
      if (hand) { const [hx, hy] = K.toScreen(cam, hand[0], hand[1]); K.hand(ctx, hx, hy, { s: cam.z * 0.8 }); }
    },
  };
})();

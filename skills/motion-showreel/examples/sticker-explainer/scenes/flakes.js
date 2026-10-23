// flakes (1 bar; 2 in the 30-second cut): the camera glides across the board from the previous station to this one, its sticker slaps down with
// an overshoot and a tilt, the step label follows and the dotted path reaches it; 씻고 잘게 부수면 플레이크.
(() => {
  SCENES['flakes'] = { draw(ctx, t, env) { STK.scene(ctx, env, 'flakes', '씻고 잘게 부수면 플레이크'); } };
})();

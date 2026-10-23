// truck (30-second cut, 1 bar): the camera glides across the board from the previous station to this one, its sticker slaps down with
// an overshoot and a tilt, the step label follows and the dotted path reaches it; 수거차가 한 번에 모아 가요.
(() => {
  SCENES['truck'] = { draw(ctx, t, env) { STK.scene(ctx, env, 'truck', '수거차가 한 번에 모아 가요'); } };
})();

// thread (30-second cut, 2 bars): the camera glides across the board from the previous station to this one, its sticker slaps down with
// an overshoot and a tilt, the step label follows and the dotted path reaches it; 녹여서 길게 뽑으면 실.
(() => {
  SCENES['thread'] = { draw(ctx, t, env) { STK.scene(ctx, env, 'thread', '녹여서 길게 뽑으면 실'); } };
})();

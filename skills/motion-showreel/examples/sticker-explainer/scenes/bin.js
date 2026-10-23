// bin (30-second cut, 2 bars): the camera glides across the board from the previous station to this one, its sticker slaps down with
// an overshoot and a tilt, the step label follows and the dotted path reaches it; 다 마신 병은 분리배출함으로.
(() => {
  SCENES['bin'] = { draw(ctx, t, env) { STK.scene(ctx, env, 'bin', '다 마신 병은 분리배출함으로'); } };
})();

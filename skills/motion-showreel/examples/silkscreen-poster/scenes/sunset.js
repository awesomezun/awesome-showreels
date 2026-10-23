// sunset (30-second cut, 2 bars): 5길 노을길: a huge orange sun half down in the sea, its reflection in stripes, a walker on the headland. The poster is pulled ink by ink on the left; the course number, name,
// distance and time and a short line (해 지는 곶에서 끝) come in beside it.
(() => {
  SCENES['sunset'] = {
    draw(ctx, t, env) { SILK.trail(ctx, env, 'sunset', 'left', '5길', '노을길', '9.4 km · 3시간', '해 지는 곶에서 끝'); },
  };
})();

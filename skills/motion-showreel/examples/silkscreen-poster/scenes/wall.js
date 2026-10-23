// wall (30-second cut, 2 bars): 3길 돌담길: tangerine trees in rows behind black stone walls. The poster is pulled ink by ink on the left; the course number, name,
// distance and time and a short line (귤밭 사이 검은 돌담) come in beside it.
(() => {
  SCENES['wall'] = {
    draw(ctx, t, env) { SILK.trail(ctx, env, 'wall', 'left', '3길', '돌담길', '10.2 km · 3시간 30분', '귤밭 사이 검은 돌담'); },
  };
})();

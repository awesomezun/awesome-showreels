// forest (30-second cut, 2 bars): 4길 숲길: stacked cedar trees, shafts of light, a green floor. The poster is pulled ink by ink on the right; the course number, name,
// distance and time and a short line (삼나무 그늘 아래로) come in beside it.
(() => {
  SCENES['forest'] = {
    draw(ctx, t, env) { SILK.trail(ctx, env, 'forest', 'right', '4길', '숲길', '7.8 km · 2시간 30분', '삼나무 그늘 아래로'); },
  };
})();

// coast (2 bars): 1길 해안길: the coastal course: the sea, a green headland, a lighthouse with orange bands, waves. The poster is pulled ink by ink on the left; the course number, name,
// distance and time and a short line (바다를 끼고 등대까지) come in beside it.
(() => {
  SCENES['coast'] = {
    draw(ctx, t, env) { SILK.trail(ctx, env, 'coast', 'left', '1길', '해안길', '12.4 km · 4시간', '바다를 끼고 등대까지'); },
  };
})();

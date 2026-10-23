// end (2 bars): inside the magnesium atom the cloud shimmers: 한 번 더 들여다보면, 또 하나의 세계; then the camera
// rushes back out through all ten steps in a beat and a half and lands on the table: 끝없는 확대, 과학관 특별전 · 가상의 전시입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, B = env.beatSec, u = (lt - 4 * B) / (1.5 * B);
      const z = lt < 4 * B ? 10 : lt < 5.5 * B ? 10 - 9.75 * D.sm(u) : 0.25 * (1 - D.sm((lt - 5.5 * B) / (2.5 * B)));
      D.view(ctx, z, t); D.hud(ctx, z);
      const a = Math.min((lt - 0.3) / 0.5, (4 * B - 0.1 - lt) / 0.3);
      D.scrim(ctx, 260, 640, a); D.scrim(ctx, 290, 640, (lt - 5.6 * B) / 0.4);
      D.text(ctx, '한 번 더 들여다보면,', 120, 420, 100, a); D.text(ctx, '또 하나의 세계', 120, 545, 100, Math.min((lt - 0.8) / 0.5, (4 * B - 0.1 - lt) / 0.3), { color: '#BFE3FF' });
      const b = (lt - 5.6 * B) / 0.4;
      D.text(ctx, '끝없는 확대', 120, 470, 150, b); D.text(ctx, '과학관 특별전 · 가상의 전시입니다', 126, 550, 44, b - 0.4, { fam: 'sans', w: 500 });
    },
  };
})();

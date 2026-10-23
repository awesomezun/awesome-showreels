// hook (2 bars): the cover of the manual. The shelf assembles itself in line art, one part dropping in per beat (the
// left side, three shelves, the right side) while the little faceless person waves beside it; 조립 설명서 and
// 반듯 선반, then 3단 선반 · 혼자서 10분.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec, f = (b) => K.fall(lt, b * B), st = {};
      K.ground(ctx);
      const L = f(0.5), s1 = f(1.5), s2 = f(2), s3 = f(2.5), R = f(3.5);
      st.sideL = L == null ? [0, 0, 0, 0] : [0, L, 0, 1]; st.sideR = R == null ? [0, 0, 0, 0] : [0, R, 0, 1];
      st.shelves = [s1, s2, s3].map(v => v == null ? [0, 0, 0, 0] : [0, v, 0, 1]);
      K.shelf(ctx, K.O, st);
      K.person(ctx, 1680, 960, 1.0, lt, { arm: 0.5 + 0.5 * Math.sin(lt * 6) });
      K.text(ctx, '조립 설명서', 160, 330, 44, lt / 0.3, { w: 700 });
      K.text(ctx, '반듯 선반', 150, 500, 150, (lt - 0.4) / 0.35, { w: 900 });
      K.text(ctx, '3단 선반 · 혼자서 10분', 160, 590, 48, (lt - 4.5 * B) / 0.3, { w: 700 });
    },
  };
})();

// end (3-4 bars): the gate. The hero runs in under 장터 입구 and jumps on the beat while pixel fireworks go up; the
// card: 8비트 장터 2026, the dates and the place, and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = PX8, lt = env.lt, B = env.beatSec, beat = lt / B, G = K.GROUND;
      const hx = Math.min(232, 20 + 32 * beat);
      let hy = 0, mode = hx < 232 ? 'run' : 'jump';
      if (hx >= 232) { const u = (beat % 2) / 2; hy = -4 * 22 * u * (1 - u); }
      K.begin(); K.sky(0.5); K.stars(lt); K.skyline(900); K.hills(900); K.lanterns(40, lt); K.stall(-40, 0, '', '#E8475F', 7); K.stall(400, 0, '', '#3B7DD8', 8);
      K.gate(192, 0, '장터 입구'); K.street(0);
      const cols = ['#FFD84A', '#E8475F', '#5BD27A', '#B57BFF', '#FF8A3D'];
      for (let i = 0; i < 8; i++) { const at = (5 + i * 2) * B; K.burst(50 + Math.floor(hash(i * 3.7) * 380), 60 + Math.floor(hash(i * 5.3) * 70), lt - at, cols[i % 5], 20); }
      K.hero(hx, G - K.HH + hy, mode, lt);
      if (beat > 2) { K.box(96, 18, 288, 96, { edge: '#FFD84A' });
        K.text('8비트 장터 2026', 240, 52, 24, '#FFD84A', { align: 'center' });
        if (beat > 3) K.text('8월 15~16일 · 한빛 전시장', 240, 78, 12, '#FFFFFF', { align: 'center' });
        if (beat > 4) K.text('가상의 행사 · 예제', 240, 100, 12, '#B9A7E8', { align: 'center' }); }
      K.present(ctx);
    },
  };
})();

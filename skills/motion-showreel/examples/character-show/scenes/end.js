// end (2-3 bars): 콩이 with its crown waving under the spotlight, confetti; 콩이 첫 팬미팅, the date and the hall, the
// fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = KONG, lt = env.lt, C = K.COL;
      K.stage(ctx, lt, { sx: 1380 }); K.confetti(ctx, lt, 0.8);
      K.kong(ctx, 1380, 920, 1.15, lt, { face: 'happy', prop: 'crown', arms: [0.3, 1.9 + 0.5 * Math.sin(lt * 10)], sq: 0.04 * Math.sin(lt * 6) });
      K.title(ctx, '콩이 첫 팬미팅', 120, 400, 150, lt, { at: 0.1 });
      K.tag(ctx, '11월 9일 토 · 한빛홀', 520, 560, 70, lt, { at: 0.4, bg: C.gold, color: '#5A2A8A' });
      K.tag(ctx, '가상의 행사 · 예제', 400, 700, 48, lt, { at: 0.7 });
    },
  };
})();

// end (2 bars): the window at full light, its colour warming from white toward evening amber as a band of sun crosses
// it; 햇빛이 / 시간을 칠합니다 glowing beside it, then 빛뜰 미술관 · 2027년 봄 개관 and 가상의 미술관입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, k = clamp(lt / env.dur);
      K.wall(ctx);
      K.window(ctx, 150, 70, 0.98, { tint: mix('#FFF4E0', '#FFC48A', k), band: lerp(-200, 1400, k) });
      K.text(ctx, '햇빛이', 1010, 420, 110, (lt - 0.3) / 0.5, { color: '#F6D58A', glow: 'rgba(244,205,85,0.45)' });
      K.text(ctx, '시간을 칠합니다', 1010, 560, 110, (lt - 0.8) / 0.5, { color: '#F6D58A', glow: 'rgba(244,205,85,0.45)' });
      K.text(ctx, '빛뜰 미술관 · 2027년 봄 개관', 1016, 690, 44, (lt - 1.6) / 0.5, { fam: 'sans', w: 700 });
      K.text(ctx, '가상의 미술관입니다', 1016, 930, 30, (lt - 2.0) / 0.5, { fam: 'sans', w: 400, color: 'rgba(243,233,216,0.6)' });
    },
  };
})();

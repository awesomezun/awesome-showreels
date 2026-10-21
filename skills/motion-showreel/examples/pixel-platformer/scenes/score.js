// score (3 bars, 30-s cut): the high-score table. 최고 점수 in yellow; the rows type in one per beat; the last row is
// yours, its name blinking; 대회 상품: 황금 동전.
(() => {
  const ROWS = [['1', '콩알', '999990', '#FFD84A'], ['2', '도토리', '873200', '#FFFFFF'], ['3', '마루', '650100', '#FFFFFF'], ['4', '너', '??????', '#5BD27A']];
  SCENES['score'] = {
    draw(ctx, t, env) {
      const K = PX8, lt = env.lt, B = env.beatSec, beat = lt / B, R = K.rect;
      K.begin(); R(0, 0, K.BW, K.BH, '#1A1423'); K.stars(lt, 0.8);
      for (let x = 0; x < K.BW; x += 8) { const c = Math.floor(x / 8 + lt * 12) % 6; R(x, 8, 8, 4, ['#E8475F', '#FF8A3D', '#FFD84A', '#5BD27A', '#3B7DD8', '#B57BFF'][c]); R(x, K.BH - 12, 8, 4, ['#E8475F', '#FF8A3D', '#FFD84A', '#5BD27A', '#3B7DD8', '#B57BFF'][(c + 3) % 6]); }
      if (beat > 0.3) K.text('최고 점수', 240, 56, 24, '#FFD84A', { align: 'center', shadow: '#8A2F2F', sx: 2, sy: 2 });
      ROWS.forEach(([n, name, sc, col], i) => { if (beat < 2 + i) return; const y = 96 + i * 30, blink = i === 3 && Math.floor(lt / (B / 2)) % 2;
        K.text(n, 120, y, 12, col); K.text(blink ? '' : name, 160, y, 12, col); K.text(sc, 360, y, 12, col, { align: 'right' });
        if (i === 0) K.coin(372, y - 10, lt); });
      if (beat > 6.5) K.text('대회 상품: 황금 동전', 240, 236, 12, '#FF8A3D', { align: 'center' });
      K.present(ctx);
    },
  };
})();

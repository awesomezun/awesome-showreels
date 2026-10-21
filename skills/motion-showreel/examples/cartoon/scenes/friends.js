// friends (4 bars, 30-s cut): the neighbourhood ranking: a podium; two friends land on the lower steps (a white
// puppy, a black one), then 멍멍 on the top with its crown; names and step counts pop on the beat; 동네 친구들과
// 랭킹 대결.
(() => {
  SCENES['friends'] = {
    draw(ctx, t, env) {
      const K = TOON, lt = env.lt, C = K.COL, B = env.beatSec;
      ctx.fillStyle = C.sky; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 16; i++) { ctx.save(); ctx.translate(W / 2, 980); ctx.rotate(i / 16 * TAU + lt * 0.2); ctx.fillStyle = i % 2 ? '#8AD4FF' : '#5EBBFA'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-300, -2000); ctx.lineTo(300, -2000); ctx.fill(); ctx.restore(); }
      const P = [[960, 700, 340, '1', C.yel], [600, 780, 260, '2', '#D9D9D9'], [1320, 820, 220, '3', '#E8A36B']];
      P.forEach(([x, y, h, n, col]) => { K.ink(ctx, c => c.rect(x - 170, y, 340, 1100 - y), col, { shade: [12, 0] }); K.word(ctx, n, x, y + 120, 110, { align: 'center' }); });
      const land = (at) => clamp((lt - at) / 0.35), D = [[600, 780, 2 * B, '콩이', '6,210', { tongue: false, col: '#F4F1EA', col2: '#D8D2C4' }], [1320, 820, 4 * B, '보리', '5,880', { col: '#4A4A52', col2: '#2E2E34' }], [960, 700, 7 * B, '멍멍', '8,452', { crown: 1 }]];
      D.forEach(([x, y, at, name, steps, o], i) => { const k = land(at); if (k <= 0) return; const yy = lerp(y - 600, y, Ease.outC(k)), sq = k >= 1 ? 0.3 * Math.exp(-(lt - at - 0.35) * 7) : -0.2;
        K.dog(ctx, x - 40, yy, i === 2 ? 0.7 : 0.6, null, { ...o, sq, wag: lt * 20 + i });
        if (k >= 1) { K.pop(ctx, name, x, yy - (i === 2 ? 380 : 330), 70, lt, { at: at + 0.3, align: 'center', fam: FAM.sans, fill: C.white }); K.pop(ctx, steps + '걸음', x, y + 175, 46, lt, { at: at + 0.4, align: 'center', fam: FAM.sans, fill: C.white }); } });
      K.pop(ctx, '동네 친구들과', 110, 200, 90, lt, { at: 0.2, fam: FAM.sans });
      K.pop(ctx, '랭킹 대결', 110, 340, 130, lt, { at: 0.6, fill: C.yel });
    },
  };
})();

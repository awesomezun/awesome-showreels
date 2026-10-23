// end (2 bars; 3 in the 30-second cut): the red pattern on the table among its cut-out bits, turning a little;
// 접고, 오리고, / 펼치면 복이 피어요, then 오림 공방 · 설맞이 한지 오리기 클래스 and 가상의 공방입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = ORIM, lt = env.lt;
      K.table(ctx);
      for (let k = 0; k < 14; k++) { ctx.save(); ctx.translate(200 + hash(k * 3.1) * 900, 120 + hash(k * 7.7) * 860); ctx.rotate(hash(k) * 6); ctx.fillStyle = k % 4 ? K.COL.red : K.COL.indigo; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16 + 20 * hash(k * 2), 6); ctx.lineTo(6, 14 + 14 * hash(k * 5)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      K.sheet(ctx, 600, 540, 0.95, 3, K.sheetBuf('rosette', K.COL.red), { rot: 0.05 * Math.sin(lt * 0.7) + 0.02 * lt });
      K.text(ctx, '접고, 오리고,', 1130, 430, 96, (lt - 0.2) / 0.4);
      K.text(ctx, '펼치면 복이 피어요', 1130, 560, 96, (lt - 0.6) / 0.4, { color: K.COL.red });
      K.text(ctx, '오림 공방 · 설맞이 한지 오리기 클래스', 1134, 680, 40, (lt - 1.2) / 0.4, { fam: 'sans' });
      K.text(ctx, '가상의 공방입니다', 1134, 920, 30, (lt - 1.6) / 0.4, { fam: 'sans', color: 'rgba(58,42,34,0.65)' });
    },
  };
})();

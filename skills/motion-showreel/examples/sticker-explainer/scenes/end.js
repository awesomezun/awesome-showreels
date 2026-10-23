// end (2 bars): the camera pulls back from the shirt until the whole board is in view, the journey from bottle to
// shirt along its dotted path; 버린 줄 알았던 병, / 옷이 돼요 on a white sticker, and 궁금상자 · 가상의 과학 채널 ·
// 수치는 가상 데이터입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = STK, C = K.COL, lt = env.lt, k = Ease.ioC(clamp(lt / 1.4)), [sx, sy] = K.ST.shirt, [ax, ay] = K.ST.all, z = Math.exp(lerp(Math.log(1.0), Math.log(0.33), k)) * (1 + 0.02 * clamp(lt / env.dur));
      ctx.save(); K.camAt(ctx, lerp(sx, ax, k), lerp(sy, 1620, k), z); K.board(ctx, 7);
      K.slap(ctx, K.obj('badge', 150, 140), 420, 190, 1, -0.12); K.slap(ctx, K.label('qbox', '궁금상자', 52, C.yellow, C.ink), 630, 200, 1, -0.05);
      K.ORDER.forEach(k2 => K.station(ctx, k2, 9, lt));
      ctx.restore();
      ctx.save(); ctx.globalAlpha = clamp((lt - 1.2) / 0.3); ctx.fillStyle = '#FFFFFF'; rr(ctx, W / 2 - 560, 925, 1120, 140, 40); ctx.fill(); ctx.textAlign = 'center'; ctx.font = K.F(66);
      ctx.textAlign = 'left'; const a1 = '버린 줄 알았던 병, ', a2 = '옷이 돼요', w1 = ctx.measureText(a1).width, w2 = ctx.measureText(a2).width, x0 = W / 2 - (w1 + w2) / 2;
      ctx.fillStyle = C.ink; ctx.fillText(a1, x0, 995); ctx.fillStyle = C.blue; ctx.fillText(a2, x0 + w1, 995); ctx.textAlign = 'center';
      ctx.globalAlpha = clamp((lt - 1.7) / 0.3); ctx.font = K.F(26); ctx.fillStyle = C.ink; ctx.fillText('궁금상자 · 가상의 과학 채널 · 수치는 가상 데이터입니다', W / 2, 1045); ctx.restore();
    },
  };
})();

// end (2 bars): the finished shelf with its things, the person beside it with a heart; 공구 하나, 4단계, 10분 and a
// small clock ticking to 10:00; 반듯 선반 · 가상의 가구입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, C = K.COL;
      K.ground(ctx);
      K.shelf(ctx, K.O, {}); K.things(ctx, 1, lt);
      K.person(ctx, 1740, 960, 1.0, lt, { heart: 1 });
      K.text(ctx, '공구 하나,', 150, 360, 96, (lt - 0.1) / 0.3, { w: 900 });
      K.text(ctx, '4단계, 10분', 150, 480, 96, (lt - 0.45) / 0.3, { w: 900 });
      const m = Math.min(10, Math.floor(lt * 6)); ctx.save(); ctx.globalAlpha = clamp((lt - 0.8) / 0.3); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(200, 640, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(200, 640); ctx.lineTo(200 + Math.cos(-Math.PI / 2 + m / 10 * Math.PI * 2) * 34, 640 + Math.sin(-Math.PI / 2 + m / 10 * Math.PI * 2) * 34); ctx.stroke(); ctx.restore();
      K.text(ctx, `${String(m).padStart(2, '0')}:00`, 270, 660, 56, (lt - 0.8) / 0.3, { w: 700 });
      K.text(ctx, '반듯 선반 · 가상의 가구입니다', 150, 820, 36, (lt - 1.2) / 0.3, { w: 500, color: '#555555' });
    },
  };
})();

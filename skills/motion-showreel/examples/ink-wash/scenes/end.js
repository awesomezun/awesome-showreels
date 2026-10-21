// end (2 bars): a small landscape on the right of the sheet, the title brushed on the left, the seal, the departure
// and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = MEOK, lt = env.lt, cam = 2000 + lt * 20;
      K.paper(ctx);
      ctx.save(); ctx.beginPath(); ctx.rect(980, 120, 840, 840); ctx.clip();
      K.range(ctx, 10, 640, 260, cam, 0.3, 0.22, { blur: 8 }); K.mist(ctx, 660, lt + 80, 0.7); K.range(ctx, 11, 900, 320, cam, 1, 0.7, { blur: 3 }); K.wall(ctx, 11, 900, 320, cam, 1, 980, 1820, 1, { w: 16 }); K.pine(ctx, 1640, 880, 0.9, 1);
      ctx.restore();
      K.brush(ctx, '도성 한 바퀴', 120, 420, 190, lt, { at: 0.05, dur: 0.9 });
      K.seal(ctx, 120 + K.brushWidth(ctx, '도성 한 바퀴', 190) + 75, 360, 100, '도성', (lt - 0.9) / 0.25);
      K.label(ctx, '매주 토요일 아침 출발', 130, 560, 56, { a: clamp((lt - 0.6) / 0.4) });
      K.label(ctx, '가상의 투어 · 예제', 130, 650, 44, { a: clamp((lt - 0.9) / 0.4), color: 'rgba(22,19,15,0.6)' });
    },
  };
})();

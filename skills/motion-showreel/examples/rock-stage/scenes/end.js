// end (2-3 bars, the outro): the poster. The last chord rings and the band's bolt glows with it as it fades; the
// beams still sweep behind; 번개다방 단독 공연, 볼륨 업, the date and the hall, the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = ROCK, lt = env.lt, L = K.levels(env.cut, t);
      ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, W, H);
      K.beams(ctx, t * 0.6, { kick: 0.3 }, { on: 0.7 }); K.truss(ctx, { kick: 0.3 });
      K.bolt(ctx, 420, 600, 300, 0.3 + 0.7 * L.guitar, { lw: 10 });
      K.text(ctx, '번개다방 단독 공연', 760, 360, 64, { alpha: clamp(lt / 0.3) });
      K.slam(ctx, '볼륨 업', 740, 620, 260, lt, { at: 0.1 });
      K.text(ctx, '11.22 토 오후 7시 · 한빛 라이브홀', 760, 760, 54, { alpha: clamp((lt - 0.5) / 0.3), color: '#FFE14D' });
      K.text(ctx, '가상의 공연 · 예제', 760, 850, 40, { alpha: clamp((lt - 0.8) / 0.3), color: '#9A9488' });
    },
  };
})();

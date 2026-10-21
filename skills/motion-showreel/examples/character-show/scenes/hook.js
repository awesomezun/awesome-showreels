// hook (2 bars): velvet curtains part, the spotlight lands, and 콩이 pops up from below with a bounce and waves;
// 편의점 마스코트, then 콩이 in big letters and 첫 팬미팅.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = KONG, lt = env.lt, C = K.COL;
      K.stage(ctx, lt, { sx: 1300, spot: clamp((lt - 0.5) / 0.3) });
      const p = (lt - 0.8) / 0.45, e = p <= 0 ? 0 : p >= 1 ? 1 : Ease.outBack(p), y = lerp(1500, 920, e), land = lt - 1.25, sq = land > 0 ? 0.35 * Math.exp(-land * 6) * Math.cos(land * 16) : -0.2;
      if (p > 0) K.kong(ctx, 1300, y, 1.2, lt, { face: lt > 1.6 ? 'happy' : 'smile', sq, arms: [0.3, lt > 1.4 ? 1.9 + 0.5 * Math.sin(lt * 12) : 0.3] });
      K.curtains(ctx, Ease.ioC(clamp((lt - 0.05) / 0.9)));
      K.tag(ctx, '편의점 마스코트', 400, 300, 60, lt, { at: 0.3 });
      K.title(ctx, '콩이', 220, 600, 240, lt, { at: 1.1 });
      K.tag(ctx, '첫 팬미팅', 380, 760, 66, lt, { at: 1.6, bg: C.gold, color: '#5A2A8A' });
    },
  };
})();

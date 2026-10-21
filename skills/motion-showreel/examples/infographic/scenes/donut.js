// donut (3 bars, 30-s cut): how people get to work in 2026. The donut sweeps round (subway, bus, car, bike) with its
// labels; the bike's share pulls out of the ring and a big 12% and a bicycle sit beside it.
(() => {
  const SEGS = [{ v: 34, col: '#234E70', label: '지하철' }, { v: 38, col: '#5C8DA8', label: '버스' }, { v: 16, col: '#9DB4C0', label: '자동차' }, { v: 12, col: '#E76F51', label: '자전거' }];
  SCENES['donut'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      K.rise(ctx, '출근 수단 비율 · 2026', 140, 180, 70, lt, { at: 0.05 });
      const p = Ease.ioC(rm(lt, 0.3, 2.2)), cx = 640, cy = 600, r = 230;
      K.donut(ctx, cx, cy, r, SEGS, p);
      // the bike slice pulls out
      const po = Ease.outBack(clamp((lt - 2.4) / 0.5));
      if (po > 0) { const a0 = -Math.PI / 2 + 88 / 100 * TAU, a1 = -Math.PI / 2 + TAU, am = (a0 + a1) / 2;
        ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = r * 0.46; ctx.beginPath(); ctx.arc(cx + Math.cos(am) * 30 * po, cy + Math.sin(am) * 30 * po, r, a0, a1); ctx.stroke(); ctx.restore(); }
      K.rise(ctx, '자전거', 1240, 450, 64, lt, { at: 2.5, color: C.ink2 });
      K.rise(ctx, '12%', 1220, 680, 230, lt, { at: 2.6, color: C.red, w: 900 });
      K.bike(ctx, 1450 + Math.sin(lt * 1.3) * 20, 860, 50, C.navy, lt, { alpha: clamp(lt - 2.6) });
      K.tag(ctx, 1780, 1010, { align: 'right' });
    },
  };
})();

// menu (3 bars, 30-s cut): three loaves pop up, one a bar: 우유식빵, 소금빵, 단팥빵, each with its price; once up they
// bounce on the beat.
(() => {
  const M = [['milk', '우유식빵', '4,500원'], ['salt', '소금빵', '3,000원'], ['red', '단팥빵', '2,800원']];
  SCENES['menu'] = {
    draw(ctx, t, env) {
      const K = CLAY, lt = env.lt, st = K.step(lt), C = K.COL, B = env.beatSec; K.boil(lt);
      K.bg(ctx, { ty: 700 });
      M.forEach(([kind, name, price], i) => { const at = i * env.barSec * 0.9 + 0.2, p = (st - at) / 0.35; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return;
        const x = 420 + i * 540, bb = (st / B) % 1, sq = p >= 1 ? 0.25 * Math.exp(-bb * 5) * Math.cos(bb * 12) : 0;
        ctx.save(); ctx.translate(x, 760); ctx.scale(e, e); ctx.translate(-x, -760); K.loaf(ctx, x, 760, 1.05, st, kind, { sq }); ctx.restore();
        K.title(ctx, name, x, 900, 78, st, { at, align: 'center', step: 0.04 }); K.small(ctx, price, x, 1010, 110, { align: 'center', a: clamp((st - at - 0.3) / 0.2), color: C.coral }); });
      K.title(ctx, '오늘 구운 빵', 120, 200, 100, st, { at: 0.1, step: 0.05 });
    },
  };
})();

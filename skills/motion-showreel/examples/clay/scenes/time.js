// time (2 bars, 30-s cut): a clay clock; its minute hand sweeps half an hour in stepped jumps while a round bun hops
// beside it; 주문하면 30분.
(() => {
  SCENES['time'] = {
    draw(ctx, t, env) {
      const K = CLAY, lt = env.lt, st = K.step(lt, 8), C = K.COL; K.boil(lt);
      K.bg(ctx, { ty: 840 });
      const cx = 1250, cy = 470; K.ell(ctx, cx, cy, 300, 300, C.coral, { seed: 101 }); K.ell(ctx, cx, cy, 240, 240, C.cream, { seed: 102, shadow: false });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; K.ell(ctx, cx + Math.cos(a) * 200, cy + Math.sin(a) * 200, i % 3 ? 9 : 15, i % 3 ? 9 : 15, C.choco, { seed: 110 + i, shadow: false, speckle: false }); }
      const m = 30 * clamp(st / 2.4), a = -Math.PI / 2 + m / 60 * TAU;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = C.choco; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 170, cy + Math.sin(a) * 170); ctx.stroke();
      ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(-Math.PI / 2 + 0.3) * 110, cy + Math.sin(-Math.PI / 2 + 0.3) * 110); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.fillStyle = 'rgba(242,139,130,0.35)'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 230, -Math.PI / 2, a); ctx.closePath(); ctx.fill(); ctx.restore();
      K.ell(ctx, cx, cy, 26, 26, C.choco, { seed: 120 });
      const hop = Math.abs(Math.sin(st * 6)) * 60; K.loaf(ctx, 560, 840 - hop, 1.0, st, 'red', { sq: hop < 8 ? 0.3 : -0.1 });
      K.title(ctx, '주문하면', 120, 220, 110, K.step(lt), { at: 0.2 });
      K.title(ctx, `${Math.round(m)}분`, 140, 400, 170, K.step(lt), { at: 0.5, color: C.coral });
    },
  };
})();

// goods (3 bars, 30-s cut): limited goods pop in one after another on pedestals: a keyring, a plush, a mug; 한정 굿즈.
(() => {
  SCENES['goods'] = {
    draw(ctx, t, env) {
      const K = KONG, lt = env.lt, C = K.COL, bar = env.barSec;
      K.stage(ctx, lt, { spot: 0 });
      const items = [['키링', 0.25], ['인형', 0.25 + bar * 0.8], ['컵', 0.25 + bar * 1.6]];
      items.forEach(([name, at], i) => { const x = 420 + i * 540, p = (lt - at) / 0.4; ctx.fillStyle = '#4A2A80'; ctx.beginPath(); ctx.roundRect(x - 170, 820, 340, 70, 20); ctx.fill(); ctx.fillStyle = '#6A44A8'; ctx.beginPath(); ctx.ellipse(x, 820, 170, 30, 0, 0, TAU); ctx.fill();
        if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return; const bob = Math.sin(lt * 3 + i) * 10;
        ctx.save(); ctx.translate(x, 820); ctx.scale(e, e); ctx.translate(-x, -820);
        if (i === 0) { ctx.strokeStyle = '#D8D8E0'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, 480 + bob, 50, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, 530 + bob); ctx.lineTo(x, 600 + bob); ctx.stroke(); K.kong(ctx, x, 800 + bob, 0.48, lt + i, { face: 'smile' }); }
        else if (i === 1) K.kong(ctx, x, 820, 0.8, lt + i, { face: 'happy', prop: 'bow', sq: 0.05 * Math.sin(lt * 5) });
        else { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x - 120, 520 + bob, 240, 290, 30); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(x + 130, 660 + bob, 60, -1.2, 1.2); ctx.stroke(); ctx.save(); ctx.translate(x, 790 + bob); ctx.scale(0.5, 0.5); K.kong(ctx, 0, 0, 1, lt, { face: 'love' }); ctx.restore(); }
        ctx.restore(); K.tag(ctx, name, x, 990, 64, lt, { at: at + 0.2 }); });
      K.title(ctx, '한정 굿즈', 120, 230, 140, lt, { at: 0.1, color: C.gold });
    },
  };
})();

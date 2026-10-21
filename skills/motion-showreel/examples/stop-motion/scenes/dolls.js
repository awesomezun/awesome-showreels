// dolls (3 bars, 30-s cut): the finished dolls land one a bar (곰, 토끼, 고양이), each with a paper tag on a string
// giving its name and price.
(() => {
  const D = [['bear', '곰', '28,000원'], ['rabbit', '토끼', '26,000원'], ['cat', '고양이', '26,000원']];
  SCENES['dolls'] = {
    draw(ctx, t, env) {
      const K = FELT, lt = env.lt, st = K.step(lt), bar = env.barSec;
      K.begin(ctx, lt); K.mat(ctx);
      D.forEach(([kind, name, price], i) => { const at = 0.2 + i * bar * 0.85; if (st < at) return; const hop = st - at < 0.25 ? 40 : 0, x = 430 + i * 530;
        K.doll(ctx, x, 880 - hop, 0.95, kind, { wave: (K.frame(lt) + i) % 4 < 2 ? 0.3 : 0 });
        ctx.save(); ctx.strokeStyle = '#E9D9BC'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 90, 770 - hop); ctx.lineTo(x + 170, 640); ctx.stroke(); ctx.restore();
        K.label(ctx, x + 120, 470, 250, 180, { rot: 0.05 * (i - 1) }); K.hand(ctx, name, x + 245, 555, 72, { align: 'center' }); K.hand(ctx, price, x + 245, 620, 52, { align: 'center', color: '#C9776A' }); });
      K.hand(ctx, '오늘 완성된 친구들', 120, 200, 96, { color: '#FFF4E0' });
      K.end(ctx, lt);
    },
  };
})();

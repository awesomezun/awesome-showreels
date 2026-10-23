// end (2 bars): the rain stops and a rainbow blooms across the sky band by band; the two stand together under the
// lowered leaf; the title, 비 오는 날의 밤톨이, and 가상의 그림책입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = WC, lt = env.lt, B = env.beatSec, b = lt / B;
      K.paper(ctx); K.land(ctx, 'clear');
      const cols = ['#E8737A', '#F2A65A', '#F2D16B', '#8CC084', '#7FB2D9', '#9B8CCF'];
      cols.forEach((c, i) => { const pr = clamp((b - 0.5 - i * 0.18) / 2.2); if (pr <= 0) return; ctx.save(); ctx.strokeStyle = rgba(c, 0.5); ctx.lineWidth = 38; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(1440, 770, 620 - i * 40, Math.PI, Math.PI + Math.PI * Ease.ioC(pr)); ctx.stroke(); ctx.restore(); });
      K.wash(ctx, K.wob(1720, 180, 80, 80, 2, 0.05), '#F6D36B', { a: clamp((b - 1) / 1.5) * 0.7 });
      const q = { x: 1280, y: 900, s: 0.95, dir: -1, ears: 0, smile: 1, lookX: -1, lookY: -0.5, sq: Math.sin(b * Math.PI) * 0.03 }; K.bun(ctx, q, t);
      const p = { x: 900, y: 890, s: 1, smile: 1, armF: 0.4, armB: 2.2, lookX: 1, lookY: -0.5, walk: 0, sq: Math.sin(b * Math.PI + 1) * 0.03 }; K.hog(ctx, p, t); K.leaf(ctx, K.hogHand(p), t, { len: 200, lean: -1.2, s: 0.9 });
      K.text(ctx, '비 오는 날의 밤톨이', 140, 250, 130, (b - 2.5) / 0.8, { color: '#4E6496' }); K.text(ctx, '비가 와도, 같이 쓰면 돼요', 146, 340, 64, (b - 3.4) / 0.8);
      K.text(ctx, '세 살부터 여섯 살까지 · 가상의 그림책입니다', 148, 410, 36, (b - 4.4) / 0.8, { fam: 'sans' }); K.finish(ctx);
    },
  };
})();

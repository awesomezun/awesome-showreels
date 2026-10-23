// parts (1 bar; 2 in the 30-second cut): the parts list, one tile per half beat: side panel A ×2, shelf B ×3, screw
// C ×12, screwdriver ×1, each in its own frame with its letter and count.
(() => {
  SCENES['parts'] = {
    draw(ctx, t, env) {
      const K = MAN, lt = env.lt, B = env.beatSec, C = K.COL;
      K.ground(ctx);
      K.text(ctx, '부품', 160, 200, 60, lt / 0.2, { w: 900 });
      const tiles = [[160, 'A', 2], [600, 'B', 3], [1040, 'C', 12], [1480, '', 1]];
      tiles.forEach(([x, l, n], i) => { const a = clamp((lt - i * B * 0.5) / 0.2); if (a <= 0) return; const s = Ease.outBack(a, 2);
        ctx.save(); ctx.translate(x + 180, 560); ctx.scale(s, s); ctx.translate(-(x + 180), -560); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; rr(ctx, x, 290, 360, 520, 18); ctx.stroke();
        if (i === 0) K.box(ctx, { x: x + 170, y: 700, s: 0.75 }, 0, 0, 0, 18, 460, 150);
        else if (i === 1) K.box(ctx, { x: x + 120, y: 620, s: 0.75 }, 0, 0, 0, 300, 18, 150);
        else if (i === 2) for (let k = 0; k < 12; k++) K.screw(ctx, x + 70 + (k % 4) * 72, 420 + Math.floor(k / 4) * 90, 22, k + lt * 2);
        else K.driver(ctx, x + 150, 720, 1.2, lt);
        ctx.restore(); if (l) K.tagPart(ctx, l, n, x + 50, 760, a); else K.text(ctx, '×1', x + 30, 774, 40, a, { w: 700 }); });
    },
  };
})();

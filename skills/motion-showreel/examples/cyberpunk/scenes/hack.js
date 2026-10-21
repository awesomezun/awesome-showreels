// hack (3 bars, 30-s cut): through the walker's visor: a HUD locks onto a sign across the street, code types, a bar
// fills to 100% and the sign flips from 라면 to 2087 in cyan; 도시의 불빛을 / 해킹하라.
(() => {
  const CODE = ['> 연결 sign_0412', '> 우회 방화벽 ... 성공', '> 덮어쓰기 "2087"', '> 완료'];
  SCENES['hack'] = {
    draw(ctx, t, env) {
      const K = CYBER, lt = env.lt, hz = 820;
      K.sky(ctx, { horizon: hz }); K.towers(ctx, lt, { depth: 0, horizon: hz, pan: 300 + lt * 10 }); K.towers(ctx, lt, { depth: 1, horizon: hz, pan: 700 + lt * 14, signs: true });
      const prog = clamp((lt - 1.0) / 2.6), flipped = prog >= 1, sx = 1340, sy = 210, size = 92;
      ctx.fillStyle = '#120A22'; ctx.fillRect(sx - 220, sy - 60, 440, hz - sy + 60);
      const h = K.sign(ctx, sx, sy, flipped ? '2087' : '라면', flipped ? K.COL.cyan : K.COL.mag, size, flipped ? 1 : (lt > 1 ? K.on(lt * 3, 7) : 1));
      K.reflect(ctx, hz, lt, { a: 0.5 }); K.rain(ctx, lt, { n: 420 });
      // the HUD
      ctx.save(); ctx.fillStyle = 'rgba(46,230,255,0.05)'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = K.rgba(K.COL.cyan, 0.8); ctx.lineWidth = 3;
      const lock = Ease.outC(clamp(lt / 0.6)), bx = sx - 70 - 60 * (1 - lock), by = sy - 30 - 60 * (1 - lock), bw = 140 + 120 * (1 - lock), bh = h + 60 + 120 * (1 - lock);
      for (const [x0, y0, dx, dy] of [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x0 + dx * 40, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + dy * 40); ctx.stroke(); }
      ctx.font = K.fu(40); ctx.fillStyle = K.rgba(K.COL.cyan, 0.9); ctx.fillText(flipped ? '해킹 완료' : '해킹 ' + Math.floor(prog * 100) + '%', bx, by - 20);
      ctx.fillStyle = 'rgba(5,3,12,0.75)'; ctx.fillRect(100, 600, 720, 300); ctx.strokeRect(100, 600, 720, 300);
      CODE.forEach((c, i) => { const n = Math.floor(clamp((lt - 0.8 - i * 0.7) * 26, 0, c.length)); ctx.fillStyle = i === 3 ? K.COL.grn : K.COL.cyan; ctx.font = K.fu(40); ctx.fillText(c.slice(0, n), 130, 660 + i * 58); });
      ctx.fillStyle = K.rgba(K.COL.cyan, 0.2); ctx.fillRect(130, 870, 660, 12); ctx.fillStyle = K.COL.cyan; ctx.fillRect(130, 870, 660 * prog, 12); ctx.restore();
      K.scrim(ctx, 0.7, 1000);
      K.gtext(ctx, '도시의 불빛을', 110, 260, 110, lt, { a: clamp((lt - 0.2) / 0.12) });
      K.gtext(ctx, '해킹하라.', 110, 420, 150, lt, { a: clamp((lt - 0.8) / 0.12), color: K.COL.cyan });
      K.slices(ctx, lt, flipped && lt - 3.6 < 0.25 ? 1 : 0);
    },
  };
})();

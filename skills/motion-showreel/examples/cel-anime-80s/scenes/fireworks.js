// fireworks (30-second cut, 2 bars): summer fireworks over the river, one burst every two beats, mirrored in the
// water; two friends in silhouette on the bank, rim-lit by each burst; 여름은 짧고, 불꽃은 높았다.
(() => {
  SCENES['fireworks'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec, bursts = [[1, 620, 300, C.COL.pink], [3, 1240, 240, C.COL.cyan], [5, 900, 200, C.COL.win], [7, 1500, 330, '#B98CFF']];
      C.sky(ctx, 680, { top: '#0B0524' }); C.stars(ctx, t, 50, 300); C.skyline(ctx, 680, 2100, t, 0.85); C.river(ctx, 680, 2100, t, 0.85);
      for (const [b, x, y, c] of bursts) { const u = lt - b * B; C.firework(ctx, x, y, u, c, 44, 280); ctx.save(); ctx.translate(0, 2 * 680); ctx.scale(1, -1); ctx.globalAlpha = 0.3; C.firework(ctx, x, y, u, c, 44, 280); ctx.restore(); }
      const lit = bursts.reduce((m, [b, , , c]) => { const u = lt - b * B; return u >= 0 && u < 1.2 ? { a: 1 - u / 1.2, c } : m; }, { a: 0, c: '#FFFFFF' });
      for (const [x, s] of [[1380, 1], [1600, 0.92]]) { ctx.save(); ctx.translate(x, H); ctx.scale(s, s); ctx.fillStyle = '#0A0618'; ctx.beginPath(); ctx.ellipse(0, -330, 70, 82, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-170, 0); ctx.quadraticCurveTo(-160, -230, 0, -250); ctx.quadraticCurveTo(160, -230, 170, 0); ctx.fill();
        if (lit.a > 0) { ctx.strokeStyle = rgba(lit.c, 0.8 * lit.a); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, -330, 70, 82, 0, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-160, -60); ctx.quadraticCurveTo(-150, -220, -10, -248); ctx.stroke(); } ctx.restore(); }
      C.line(ctx, '여름은 짧고, 불꽃은 높았다', 120, 980, 60, Math.min((lt - 0.3) / 0.4, (env.dur - 0.3 - lt) / 0.3), { align: 'left' });
      C.vhs(ctx, t);
    },
  };
})();

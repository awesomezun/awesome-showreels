// end (1 bar, 2 in the 30-second cut): the five signs in a row, each in its era's face and colours, popping in one by
// one; 백 년 동안, 음악을 팔았습니다; 소리상회 · 가상의 악기점입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const E = ERA, lt = env.lt, B = env.beatSec; ctx.fillStyle = '#1E160E'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, 460, 40, W / 2, 460, 900); g.addColorStop(0, 'rgba(255,214,150,0.3)'); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      [1925, 1955, 1975, 1995, 2025].forEach((y, i) => { const e = E.ERAS[y], a = clamp((lt - i * 0.25 * B) / (0.25 * B)), x = 260 + i * 350, s = a > 0 ? 1 + 0.25 * Math.exp(-(lt - i * 0.25 * B) * 12) : 0; if (a <= 0) return;
        ctx.save(); ctx.translate(x, 330); ctx.scale(s, s); ctx.globalAlpha = a; ctx.fillStyle = e.sign; rr(ctx, -150, -60, 300, 120, y === 1975 ? 40 : 12); ctx.fill(); ctx.strokeStyle = e.trim; ctx.lineWidth = 6; ctx.stroke();
        ctx.font = E.F(58, e.fam, y === 2025 ? 700 : ''); ctx.textAlign = 'center'; ctx.fillStyle = e.signInk; if (y === 1995) { ctx.shadowColor = '#FF4FC3'; ctx.shadowBlur = 24; } ctx.fillText('소리상회', 0, 20); ctx.shadowBlur = 0;
        ctx.font = E.F(40, e.fam, y === 2025 ? 700 : ''); ctx.fillStyle = '#C9A87A'; ctx.fillText(String(y), 0, 120); ctx.restore(); });
      E.text(ctx, '백 년 동안, 음악을 팔았습니다', W / 2, 700, 96, (lt - 1.4 * B) / (0.5 * B), { fam: 'serif', color: '#F2DCB0' });
      E.text(ctx, '소리상회 · 가상의 악기점입니다', W / 2, 800, 40, (lt - 2.2 * B) / (0.5 * B), { color: '#C9A87A', w: 500 });
    },
  };
})();

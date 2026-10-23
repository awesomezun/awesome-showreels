// end (2 bars): the five course posters hang in a row on the wall, dropping in one per beat on their pegs, swaying;
// 다섯 길, 한 장씩 찍어 갑니다 above them, 바람섬 다섯 길 · 섬 한 바퀴 48.4 km and 가상의 섬과 트레일입니다 below.
(() => {
  const KEYS = ['coast', 'oreum', 'wall', 'forest', 'sunset'], S = 0.34;
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = SILK, lt = env.lt, B = env.beatSec, pw = K.PW * S, gap = 40, x0 = (W - (5 * pw + 4 * gap)) / 2, y0 = 400;
      K.wall(ctx);
      ctx.save(); ctx.strokeStyle = 'rgba(243,234,215,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 60, y0 - 18); ctx.quadraticCurveTo(W / 2, y0 - 6, x0 + 5 * pw + 4 * gap + 60, y0 - 18); ctx.stroke(); ctx.restore();
      KEYS.forEach((k, i) => {
        const a = (lt - 0.1 - i * B * 0.5) / 0.45; if (a <= 0) return;
        const x = x0 + i * (pw + gap), y = y0 - 80 * (1 - Ease.outBack(clamp(a), 1.6));
        ctx.save(); ctx.translate(x + pw / 2, y0 - 14); ctx.rotate(0.02 * Math.sin(lt * 1.6 + i * 1.3) * (1 + 3 * (1 - clamp(a)))); ctx.translate(-(x + pw / 2), -(y0 - 14));
        ctx.globalAlpha = clamp(a * 2); K.poster(ctx, k, x, y, S, 99, [0, 0, 0, 0, 0], { blade: false });
        ctx.fillStyle = '#C9A273'; rr(ctx, x + pw / 2 - 9, y - 26, 18, 44, 4); ctx.fill(); ctx.restore();
      });
      K.text(ctx, '다섯 길, 한 장씩 찍어 갑니다', W / 2, 270, 92, (lt - 0.3) / 0.4, { align: 'center', color: K.INK.yellow });
      K.text(ctx, '바람섬 다섯 길 · 섬 한 바퀴 48.4 km', W / 2, 850, 44, (lt - 1.6) / 0.4, { align: 'center', fam: 'sans', w: 800 });
      K.text(ctx, '가상의 섬과 트레일입니다', W / 2, 920, 30, (lt - 1.9) / 0.4, { align: 'center', fam: 'sans', w: 500, color: 'rgba(243,234,215,0.7)' });
    },
  };
})();

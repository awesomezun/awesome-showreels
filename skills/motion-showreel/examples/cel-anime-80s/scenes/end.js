// end (3 bars): the title: sun rays turn behind chrome type that slams in with a flash, 1988 in pink neon, a lens
// flare sweeps across; 그해 여름, 도시는 반짝였다; 한강 시티 라이트 1988 · 가상의 애니메이션입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec;
      const g = ctx.createRadialGradient(W / 2, 470, 50, W / 2, 470, 1200); g.addColorStop(0, '#4A1E7A'); g.addColorStop(1, '#0B0524'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2, 470); ctx.rotate(lt * 0.12); ctx.fillStyle = 'rgba(255,120,190,0.10)'; for (let k = 0; k < 16; k++) { ctx.rotate(Math.PI / 8); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -110); ctx.lineTo(1400, 110); ctx.closePath(); if (k % 2) ctx.fill(); } ctx.restore();
      C.stars(ctx, t, 60, 1000); C.skyline(ctx, H + 60, 600 + lt * 10, t, 0.7);
      const a = (lt - 0.5 * B) / (0.6 * B); C.logo(ctx, W / 2, 470, a, (lt - 2 * B) / (1.4 * B), t);
      if (a > 0 && a < 0.6) { ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - a / 0.6)})`; ctx.fillRect(0, 0, W, H); }
      C.line(ctx, '그해 여름, 도시는 반짝였다', W / 2, 800, 62, (lt - 3.4 * B) / (0.6 * B));
      C.line(ctx, '한강 시티 라이트 1988 · 가상의 애니메이션입니다', W / 2, 880, 34, (lt - 4.4 * B) / (0.6 * B), { color: '#D8CCF0' });
      C.vhs(ctx, t);
    },
  };
})();

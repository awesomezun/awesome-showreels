// drive (30-second cut, 3 bars): the red convertible runs along the riverside road at night; streetlights sweep past
// on every beat, the lane marks stream, the skyline drifts across the water; 강변북로, 밤 열한 시.
(() => {
  SCENES['drive'] = {
    draw(ctx, t, env) {
      const C = CEL, lt = env.lt, B = env.beatSec, v = 640 / B, dist = lt * v;
      C.sky(ctx, 560, { top: '#120830' }); C.stars(ctx, t, 40, 300); C.skyline(ctx, 560, 1400 + dist * 0.04, t, 0.75); C.river(ctx, 560, 1400 + dist * 0.04, t, 0.75);
      ctx.fillStyle = '#1C1238'; ctx.fillRect(0, 740, W, 30); ctx.fillStyle = '#8D86B8'; ctx.fillRect(0, 744, W, 6);
      const rg = ctx.createLinearGradient(0, 770, 0, H); rg.addColorStop(0, '#2B2440'); rg.addColorStop(1, '#141020'); ctx.fillStyle = rg; ctx.fillRect(0, 770, W, H - 770);
      ctx.fillStyle = '#E8E0C8'; for (let x = -((dist * 1.0) % 320); x < W; x += 320) ctx.fillRect(x, 1010, 170, 10);
      // streetlights, one passing every beat (640 px apart at 640 px a beat)
      for (let x = 1500 - (dist % 640); x > -200; x -= 640) { ctx.fillStyle = '#0E0820'; ctx.fillRect(x, 260, 12, 520); ctx.fillRect(x - 120, 256, 132, 10);
        const g = ctx.createRadialGradient(x - 110, 270, 4, x - 110, 270, 120); g.addColorStop(0, 'rgba(255,190,110,0.95)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x - 110, 270, 120, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,170,90,0.12)'; ctx.beginPath(); ctx.moveTo(x - 130, 276); ctx.lineTo(x - 300, 900); ctx.lineTo(x + 80, 900); ctx.closePath(); ctx.fill(); ctx.restore(); }
      C.car(ctx, 900, 950, 0.95, t, dist);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const y = 800 + hash(i * 3) * 260, x = ((hash(i * 7) * 3000 - dist * 2.2) % 3000 + 3000) % 3000 - 500; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 260, y); ctx.stroke(); }
      C.line(ctx, '강변북로, 밤 열한 시', 120, 180, 64, Math.min((lt - 0.4) / 0.4, (env.dur - 0.3 - lt) / 0.3), { align: 'left' });
      C.vhs(ctx, t);
    },
  };
})();

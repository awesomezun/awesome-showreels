// end (2 bars, 3 in the 30-second cut): confetti and the logo: 5초면 충분해!, 5초 미션 · 가상의 파티 게임입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const M = MINI, lt = env.lt, B = env.beatSec; M.stripes(ctx, '#FFC531', t, 150);
      for (let i = 0; i < 70; i++) { const y = ((hash(i * 3) * 1300 + lt * (300 + 200 * hash(i))) % 1300) - 100, x = hash(i * 7) * W + Math.sin(lt * 3 + i) * 30; ctx.save(); ctx.translate(x, y); ctx.rotate(lt * 5 + i); ctx.fillStyle = M.BG[i % 8]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); }
      M.text(ctx, '5초면 충분해!', W / 2, 420, 190, (lt - 0.1) / (0.2 * B), { pop: lt - 0.1, color: '#FFFFFF' });
      M.text(ctx, '5초 미션', W / 2, 660, 150, (lt - 2 * B) / (0.2 * B), { pop: lt - 2 * B, color: '#FF2E4D' });
      M.text(ctx, '친구들과 돌아가며 · 가상의 파티 게임입니다', W / 2, 800, 48, (lt - 3 * B) / (0.3 * B), { fam: 'sans' });
    },
  };
})();

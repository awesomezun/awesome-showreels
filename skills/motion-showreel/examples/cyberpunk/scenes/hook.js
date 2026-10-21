// hook (2 bars): the skyline in the rain, pushing in slowly; signs stutter on across the towers, a hologram koi turns
// on a billboard, a flying car crosses; the title breaks in with a glitch: 네온 레인 / 2087, and SF 액션 게임 above.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = CYBER, lt = env.lt, hz = 900, z = 1 + 0.05 * Ease.ioSine(clamp(lt / env.dur));
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      K.sky(ctx, { horizon: hz });
      const g = ctx.createRadialGradient(W * 0.6, hz, 0, W * 0.6, hz, 900); g.addColorStop(0, 'rgba(255,46,136,0.35)'); g.addColorStop(1, 'rgba(255,46,136,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      K.towers(ctx, lt, { depth: 0, horizon: hz, pan: lt * 20 });
      K.holo(ctx, 1240, 300, 380, 230, lt, '2087', clamp((lt - 0.6) / 0.3));
      K.towers(ctx, lt, { depth: 1, horizon: hz, pan: lt * 30, signs: true, scale: 0.9 });
      K.car(ctx, lerp(-200, W + 200, clamp((lt - 0.8) / 2.6)), 420, 0.9, 1);
      K.reflect(ctx, hz, lt, { a: 0.45 });
      K.rain(ctx, lt, { n: 380 });
      ctx.restore();
      K.gtext(ctx, 'SF 액션 게임', 120, 250, 52, lt, { font: K.fu(52), color: K.COL.ink2, a: clamp((lt - 0.2) / 0.2) });
      K.gtext(ctx, '네온 레인', 110, 430, 190, lt, { a: clamp((lt - 0.5) / 0.15), glitch: lt < 0.9 ? 1 : undefined, split: 8 });
      K.gtext(ctx, '2087', 120, 560, 120, lt, { font: K.fu(120), color: K.COL.cyan, a: clamp((lt - 0.8) / 0.15), glitch: lt < 1.2 ? 1 : undefined });
      K.slices(ctx, lt, lt < 0.9 && lt > 0.5 ? 1 : 0);
    },
  };
})();

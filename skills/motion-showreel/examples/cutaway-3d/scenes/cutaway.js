// cutaway (3-4 bars): the core message, shown. The front and the right panels slide away and the inside lights up:
// the drum turning with its beans, the heater glowing beneath it, the exhaust fan at the back, the cooling tray in
// front; each part gets a pin on a beat (회전 드럼, 히터 220°C, 배기 팬, 냉각 트레이); 속까지 / 보여 드릴게요.
(() => {
  SCENES['cutaway'] = {
    draw(ctx, t, env) {
      const K = BREW, T3 = K.T3, lt = env.lt, B = env.beatSec, C = K.COL;
      const k = Ease.ioC(clamp(lt / 2.2)), yaw = 0.7 + 0.15 * k + 0.05 * Math.sin(lt * 0.4), d = lerp(3.3, 2.45, k), h = lerp(1.5, 1.25, k);
      const cam = T3.camera([Math.sin(yaw) * d, h, Math.cos(yaw) * d], [0.02, 0.58, 0], 0.62, { cx: W * 0.64 });
      K.stage(ctx, cam);
      const s = { open: Ease.ioC(rm(lt, 0.3, 1.6)), drum: lt * 2, fan: lt * 7, arm: lt * 1.2, heat: 0.6 + 0.4 * rm(lt, 0.8, 2.0) + 0.05 * Math.sin(lt * 9) };
      T3.render(ctx, cam, K.faces(s), { light: [-0.5, 0.9, 0.7], amb: 0.3, spec: 0.3 });
      if (s.open > 0.5) { ctx.save(); ctx.globalAlpha *= clamp((s.open - 0.5) * 2); K.beans(ctx, cam, { ...s, roast: 0.55 }, 'drum'); K.beans(ctx, cam, { ...s, roast: 1 }, 'tray'); ctx.restore(); }
      // the heater's glow
      if (s.heat > 0.6) { const q = T3.project(cam, [-0.06, 0.38, 0]), r = 0.5 * cam.k / q[2]; const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], r); g.addColorStop(0, `rgba(255,122,26,${0.35 * (s.heat - 0.5)})`); g.addColorStop(1, 'rgba(255,122,26,0)'); ctx.fillStyle = g; ctx.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r); }
      K.display(ctx, cam, s, '220°C', 1 - s.open);
      const pins = [[[0.2, 0.7, 0.12], [1560, 300], '회전 드럼'], [[0.0, 0.38, 0.22], [1640, 620], '히터 220°C'], [[0.28, 0.66, -0.33], [1500, 180], '배기 팬'], [[0.32, 0.2, 0.3], [1600, 900], '냉각 트레이']];
      pins.forEach(([pt, to, s1], i) => K.pin(ctx, cam, pt, to, s1, clamp((lt - (1.6 + i * 0.55)) / 0.5)));
      K.rise(ctx, '속까지', 150, 470, 150, lt, { at: 0.4 });
      K.rise(ctx, '보여 드릴게요.', 150, 640, 120, lt, { at: 0.7, color: C.trim });
    },
  };
})();

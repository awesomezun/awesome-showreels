// cool (3 bars, 30-s cut): the tray. The camera comes round to the cooling tray at the front; the arm sweeps the
// roasted beans, wisps of steam rise and thin out; 바로 식혀서 / 향을 붙잡아요.
(() => {
  SCENES['cool'] = {
    draw(ctx, t, env) {
      const K = BREW, T3 = K.T3, lt = env.lt, C = K.COL;
      const k = Ease.ioC(clamp(lt / 1.5)), eye = [lerp(1.0, 0.9, k), lerp(0.8, 0.95, k), lerp(0.4, 1.25, k)];
      const cam = T3.camera(eye, [0.1, 0.25, 0.12], 0.7, { cx: W * 0.68 });
      K.stage(ctx, cam);
      const s = { open: 1, drum: lt * 2, fan: lt * 7, arm: lt * 2.2, heat: 0.5, roast: 1 };
      T3.render(ctx, cam, K.faces(s), { light: [-0.5, 0.9, 0.7], amb: 0.34, spec: 0.3, near: 0.05 });
      K.beans(ctx, cam, s, 'tray');
      // steam
      for (let i = 0; i < 7; i++) { const ph = (lt * 0.35 + i / 7) % 1, base = T3.project(cam, [0.12 + Math.cos(i * 2) * 0.12, 0.25, 0.16 + Math.sin(i * 2) * 0.12]), up = ph * 320;
        ctx.save(); ctx.globalAlpha = 0.25 * Math.sin(Math.PI * ph); ctx.strokeStyle = '#E8E4DC'; ctx.lineWidth = 10 * (1 - ph) + 3; ctx.lineCap = 'round'; ctx.beginPath();
        for (let k2 = 0; k2 <= 10; k2++) { const y = base[1] - up * k2 / 10, x = base[0] + Math.sin(k2 * 0.9 + lt * 2 + i) * 18 * (k2 / 10); k2 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
      K.scrim(ctx);
      K.rise(ctx, '바로 식혀서', 150, 420, 120, lt, { at: 0.3 });
      K.rise(ctx, '향을 붙잡아요.', 150, 570, 120, lt, { at: 0.6, color: C.trim });
    },
  };
})();

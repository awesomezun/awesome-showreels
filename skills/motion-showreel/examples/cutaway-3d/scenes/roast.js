// roast (3 bars, 30-s cut): inside the drum. The camera flies up to its open end; the beans tumble and turn from
// green to brown while a gauge climbs 180 to 220°C; 12분, 고르게.
(() => {
  SCENES['roast'] = {
    draw(ctx, t, env) {
      const K = BREW, T3 = K.T3, lt = env.lt, C = K.COL;
      const k = Ease.ioC(clamp(lt / 1.6)), eye = [lerp(1.6, 0.95, k), lerp(1.2, 0.8, k), lerp(1.4, 0.32, k)];
      const cam = T3.camera(eye, [-0.05, 0.64, 0], 0.7, { cx: W * 0.62 });
      K.stage(ctx, cam);
      const roast = clamp(lt / 6.2), s = { open: 1, drum: lt * 2.4, fan: lt * 7, arm: lt, heat: 1, roast };
      T3.render(ctx, cam, K.faces(s), { light: [-0.5, 0.9, 0.7], amb: 0.34, spec: 0.3, near: 0.05 });
      K.beans(ctx, cam, s, 'drum');
      // the gauge
      const gx = 260, gy = 760, temp = Math.round(lerp(180, 220, roast));
      ctx.save(); ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.strokeStyle = '#2B3038'; ctx.beginPath(); ctx.arc(gx, gy, 120, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
      ctx.strokeStyle = C.heat; ctx.beginPath(); ctx.arc(gx, gy, 120, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * roast)); ctx.stroke(); ctx.restore();
      K.text(ctx, temp + '°C', gx, gy + 18, 54, { align: 'center', color: C.heat });
      K.scrim(ctx, 0.7, 900);
      K.rise(ctx, '12분,', 150, 380, 150, lt, { at: 0.3 });
      K.rise(ctx, '고르게 볶아요.', 150, 530, 100, lt, { at: 0.6, color: C.trim });
    },
  };
})();

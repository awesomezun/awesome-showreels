// shield (3 bars, 30-s cut): a hexagon dome of neon closes round the whole network; attacks fly in from every side and
// burst on it in magenta sparks; 24시간, / 먼저 막아요.
(() => {
  SCENES['shield'] = {
    draw(ctx, t, env) {
      const K = NEON, lt = env.lt, B = env.beatSec, cx = 1260, cy = 580, R = 470;
      ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); K.view(1, 0, 0); K.grid(ctx, 1);
      K.net(ctx, lt, { shift: [80, 40] });
      const close = Ease.outC(clamp(lt / 1.0));
      K.tube(ctx, c => { for (let i = 0; i <= 6; i++) { const a = i / 6 * TAU * close + Math.PI / 6; const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.95; i ? c.lineTo(x, y) : c.moveTo(x, y); } }, K.COL.cyan, 0.85, 5);
      for (let n = 0; n < 9; n++) { const t0 = 1.0 + n * B, a = hash(n * 3.3) * TAU, k = (lt - t0) / 0.5; if (k < 0) continue;
        const sx = cx + Math.cos(a) * 1300, sy = cy + Math.sin(a) * 900, ex = cx + Math.cos(a) * R, ey = cy + Math.sin(a) * R * 0.95;
        if (k < 1) { const p = [lerp(sx, ex, k), lerp(sy, ey, k)]; K.tube(ctx, c => { c.moveTo(lerp(sx, ex, Math.max(0, k - 0.25)), lerp(sy, ey, Math.max(0, k - 0.25))); c.lineTo(p[0], p[1]); }, K.COL.mag, 0.9, 3); }
        else if (k < 2.2) { const q = (k - 1) / 1.2; for (let j = 0; j < 8; j++) { const an = a + Math.PI + (j - 3.5) * 0.3, r = 10 + 120 * Ease.outC(q); K.tube(ctx, c => { c.moveTo(ex + Math.cos(an) * r * 0.5, ey + Math.sin(an) * r * 0.5); c.lineTo(ex + Math.cos(an) * r, ey + Math.sin(an) * r); }, K.COL.mag, 1 - q, 2.5); } } }
      K.ntext(ctx, '24시간,', 110, 360, 130, K.COL.cyan, K.flicker(lt - 0.3, 31));
      K.ntext(ctx, '먼저 막아요.', 110, 520, 130, K.COL.white, K.flicker(lt - 0.9, 32));
    },
  };
})();

// cut (3 bars): close on the folded eighth. Scissors open and close along each outline in turn, every finished
// piece falling away; then the paper is unfolded crease by crease as the camera pulls back, and the cuts open into one
// pattern with the square's symmetry, half shapes on the creases turning whole; ② 한 번 오려, ③ 펼치면 여덟 갈래.
(() => {
  SCENES['cut'] = {
    draw(ctx, t, env) {
      const K = ORIM, lt = env.lt, B = env.beatSec, holes = K.HOLES('rosette'), n = holes.length, step = 0.19, T0 = 0.2;
      K.table(ctx);
      const done = i => (lt - T0 - i * step) / step, unf = Ease.ioC(rm(lt, T0 + n * step + 0.35, T0 + n * step + 2.1));
      const s = lerp(1.55, 0.92, Ease.ioC(rm(lt, T0 + n * step + 0.2, T0 + n * step + 2.3))), cx = lerp(640, 960, unf), cy = lerp(200, 540, unf);
      const u = 3 * Ease.ioQ(rm(lt, T0 + n * step + 0.35, T0 + n * step + 2.3));
      const src = u > 0 ? K.sheetBuf('rosette', K.COL.red) : K.wedgeBuf('rosette', K.COL.red, done);
      K.sheet(ctx, cx, cy, s, u, src, { rot: u >= 3 ? 0.03 * Math.sin((lt - 4) * 0.9) : 0 });
      if (u <= 0) {
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(K.R, 0); ctx.lineTo(K.R, K.R); ctx.closePath(); ctx.clip();
        holes.forEach((h, i) => {
          const d = done(i);
          if (d > 0 && d < 1) { ctx.strokeStyle = '#5A1A14'; ctx.lineWidth = 2.5 / s; ctx.beginPath(); h.slice(0, Math.max(2, Math.ceil(h.length * d))).forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
          if (d >= 1 && d < 4) { const f = (d - 1) * step, cxh = h.reduce((a, p) => a + p[0], 0) / h.length, cyh = h.reduce((a, p) => a + p[1], 0) / h.length;
            ctx.save(); ctx.translate(cxh + 30 * f, cyh + 260 * f * f + 40 * f); ctx.rotate(2.4 * f); ctx.translate(-cxh, -cyh); ctx.globalAlpha = clamp(1 - f * 1.4); ctx.fillStyle = K.COL.red; ctx.beginPath(); K.pathOf(ctx, h); ctx.fill(); ctx.restore(); }
        });
        ctx.restore();
        const cur = Math.min(n - 1, Math.max(0, Math.floor((lt - T0) / step))), d = done(cur);
        if (lt < T0 + n * step + 0.2) { const h = holes[cur], k = Math.min(h.length - 1, Math.max(0, Math.floor(h.length * clamp(d)))), [hx, hy] = h[k], [qx, qy] = h[Math.min(h.length - 1, k + 1)];
          K.scissors(ctx, cx + hx * s, cy + hy * s, Math.atan2(qy - hy, qx - hx), 0.5 + 0.5 * Math.sin(lt * 34)); }
      }
      K.text(ctx, '② 한 번 오려', 1380, 300, 64, (lt - 0.3) / 0.35 * (1 - clamp((lt - (T0 + n * step + 0.3)) / 0.3)), { fam: 'sans', w: 400 });
      K.text(ctx, '③ 펼치면 여덟 갈래', 960, 1010, 60, (lt - (T0 + n * step + 2.2)) / 0.35, { fam: 'sans', align: 'center' });
    },
  };
})();

// count (30-second cut, 4 bars): the camera pulls back and the garden is one wall of a subway corridor, commuters
// walking past; a diagonal sweep turns every tile once while the counter runs to 14,400 장의 유리 조각.
(() => {
  SCENES['count'] = {
    draw(ctx, t, env) {
      const M = TILE, lt = env.lt, B = env.beatSec, e = Ease.ioC(clamp(lt / (2 * B))), s = lerp(1, 0.46, e), cy = lerp(0, -150, e);
      // the corridor around the work: white tile walls with the blue band, a ceiling with lights, a grey floor
      ctx.fillStyle = '#ECE9E2'; ctx.fillRect(0, 0, W, H); const ts = M.TS * s, y0 = H / 2 + cy - H * s / 2, x0 = W / 2 - W * s / 2;
      ctx.save(); ctx.strokeStyle = 'rgba(160,155,145,0.55)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0 % ts; x < W; x += ts) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = y0 % ts; y < H; y += ts) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); ctx.restore();
      ctx.fillStyle = M.COL.ink; ctx.fillRect(0, y0 + 58 * ts, W, ts); ctx.fillStyle = M.COL.line; ctx.fillRect(0, y0 + 59 * ts, W, 5 * ts); ctx.fillStyle = M.COL.ink; ctx.fillRect(0, y0 + 64 * ts, W, ts);
      const fy = y0 + 84 * ts; ctx.fillStyle = '#9A978F'; ctx.fillRect(0, fy, W, H - fy); ctx.fillStyle = '#B5B2AA'; for (let k = 0; k < 6; k++) ctx.fillRect(0, fy + 20 + k * 60, W, 3);
      ctx.fillStyle = '#D9D6CE'; ctx.fillRect(0, 0, W, Math.max(0, y0 - 30 * s)); ctx.fillStyle = '#FFFFFF'; for (let x = 140; x < W; x += 420) { ctx.fillRect(x, Math.max(0, y0 - 30 * s) - 26, 220, 14); }
      const sw = { o: [0, 0], mode: 1, dir: [0.87, 0.5], spd: 43, dur: 0.3, jit: 0.08 }, st = M.state(lt, 'g0', [{ at: 2 * B, to: 'g0', wave: sw }], { time: t, tw: 0.02 });
      M.draw(ctx, st, { s, y: cy }); ctx.strokeStyle = '#8A877F'; ctx.lineWidth = 6 * s + 2; ctx.strokeRect(x0, y0, W * s, H * s);
      // commuters
      for (let i = 0; i < 6; i++) { const dir = i % 2 ? -1 : 1, sp = 150 + 60 * hash(i), x = ((hash(i * 3) * 2400 + dir * lt * sp) % 2400 + 2400) % 2400 - 240, h = 230 + 40 * hash(i * 5);
        M.walker(ctx, x, H - 30 - 50 * hash(i * 7), h * Math.max(s, 0.6), lt * sp / 38 + i, dir, ['#2B2B33', '#3B4A6B', '#4A3B3B'][i % 3]); }
      // the counter: tiles turned so far
      const d = st.t > 0 ? clamp((st.t * sw.spd) / 184) : 0, n = Math.round(14400 * clamp(d * d * (3 - 2 * d))), a = (lt - 1.6 * B) / (0.5 * B);
      M.text(ctx, n.toLocaleString('en-US'), 70, 380, 120, a, { fam: 'sans' }); M.text(ctx, '장의 유리 조각', 76, 450, 46, a - 0.3, { fam: 'sans' });
      if (s < 0.7) { ctx.save(); ctx.globalAlpha = clamp((0.7 - s) / 0.15); ctx.fillStyle = M.COL.ink; rr(ctx, 1500, 180, 340, 110, 12); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.font = M.F(56, 'sans'); ctx.fillText('가람', 1530, 254); ctx.font = M.F(28, 'sans'); ctx.fillText('2번 출구', 1680, 254); ctx.restore(); }
    },
  };
})();

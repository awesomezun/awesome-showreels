// gallery (30-second cut, 2 bars): the permanent collection under the window's light: a cobalt vase, an amber bowl and
// a lampshade of small glass petals lit from inside, each on a plinth with its coloured light pooled on top, coming
// up one per beat; 상설 전시 · 유리 정원.
(() => {
  const XS = [480, 960, 1440], LBL = ['유리 화병', '호박빛 그릇', '꽃잎 등갓'];
  SCENES['gallery'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, B = env.beatSec, C = K.COL;
      K.wall(ctx);
      K.text(ctx, '상설 전시 · 유리 정원', W / 2, 150, 76, (lt - 0.1) / 0.5, { align: 'center', color: '#F6D58A' });
      XS.forEach((x, i) => {
        const a = clamp((lt - 0.3 - i * B) / 0.5), top = 700;
        ctx.save(); ctx.globalAlpha = a;
        ctx.fillStyle = '#25232B'; ctx.fillRect(x - 150, top, 300, 380); ctx.fillStyle = '#34313B'; ctx.fillRect(x - 150, top, 300, 14);
        const glowCol = [C.cobalt, C.amber, C.gold][i];
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const pool = ctx.createRadialGradient(x, top + 6, 10, x, top + 6, 170); pool.addColorStop(0, rgba(glowCol, 0.55)); pool.addColorStop(1, rgba(glowCol, 0)); ctx.fillStyle = pool; ctx.fillRect(x - 200, top - 60, 400, 120); ctx.restore();
        if (i === 0) {          // vase
          ctx.beginPath(); ctx.moveTo(x - 50, top); ctx.bezierCurveTo(x - 130, top - 120, x - 40, top - 230, x - 34, top - 330); ctx.lineTo(x + 34, top - 330); ctx.bezierCurveTo(x + 40, top - 230, x + 130, top - 120, x + 50, top); ctx.closePath();
          const g = ctx.createLinearGradient(x - 110, 0, x + 110, 0); g.addColorStop(0, rgba(C.cobalt, 0.95)); g.addColorStop(0.35, rgba('#7FB2F0', 0.85)); g.addColorStop(1, rgba('#1A3A78', 0.95)); ctx.fillStyle = g; ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 62, top - 60); ctx.quadraticCurveTo(x - 82, top - 140, x - 40, top - 230); ctx.stroke();
        } else if (i === 1) {   // bowl
          ctx.beginPath(); ctx.ellipse(x, top - 70, 130, 30, 0, Math.PI, 0); ctx.quadraticCurveTo(x + 110, top, x, top - 4); ctx.quadraticCurveTo(x - 110, top, x - 130, top - 70); ctx.closePath();
          const g = ctx.createLinearGradient(0, top - 100, 0, top); g.addColorStop(0, rgba('#FFD27A', 0.95)); g.addColorStop(1, rgba('#B5651D', 0.95)); ctx.fillStyle = g; ctx.fill();
          ctx.strokeStyle = 'rgba(255,240,200,0.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, top - 70, 130, 30, 0, 0, TAU2); ctx.stroke();
        } else {                // lampshade: the window's pieces in a dome, lit from inside
          ctx.fillStyle = '#4A4038'; ctx.fillRect(x - 6, top - 260, 12, 260); ctx.fillRect(x - 60, top - 16, 120, 16);
          ctx.save(); ctx.beginPath(); ctx.moveTo(x - 170, top - 230); ctx.quadraticCurveTo(x - 150, top - 420, x, top - 430); ctx.quadraticCurveTo(x + 150, top - 420, x + 170, top - 230); ctx.closePath(); ctx.clip();
          K.window(ctx, x - 190, top - 440, 0.5, { light: 0.6 + 0.4 * a + 0.05 * Math.sin(lt * 7), tint: '#FFE3B0', glow: false }); ctx.restore();
          ctx.strokeStyle = '#2E2C32'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x - 170, top - 230); ctx.quadraticCurveTo(x - 150, top - 420, x, top - 430); ctx.quadraticCurveTo(x + 150, top - 420, x + 170, top - 230); ctx.closePath(); ctx.stroke();
        }
        ctx.restore();
        K.text(ctx, LBL[i], x, 1010, 46, a, { fam: 'sans', w: 700, align: 'center' });
      });
      const sweep = (lt * 0.25) % 1; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createLinearGradient(sweep * W * 1.6 - 300, 0, sweep * W * 1.6, 0); sg.addColorStop(0, 'rgba(255,230,190,0)'); sg.addColorStop(0.5, 'rgba(255,230,190,0.05)'); sg.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();
    },
  };
  const TAU2 = Math.PI * 2;
})();

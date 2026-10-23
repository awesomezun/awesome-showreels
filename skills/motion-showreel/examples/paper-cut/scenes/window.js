// window (30-second cut, 3 bars): night. The red pattern is pasted on a lattice window lit warmly from behind: the
// paper glows a deep red and every hole lets the lamp through, the light breathing; 창에 붙이면, 빛이 들어와요.
(() => {
  let tmp = null;
  SCENES['window'] = {
    draw(ctx, t, env) {
      const K = ORIM, lt = env.lt, L = 0.85 + 0.1 * Math.sin(lt * 1.7) + 0.05 * Math.sin(lt * 4.3), cx = 1180, cy = 540;
      ctx.fillStyle = '#1B1720'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(cx, cy, 40, cx, cy, 620); g.addColorStop(0, `rgba(255,226,150,${L})`); g.addColorStop(0.6, `rgba(232,150,70,${0.75 * L})`); g.addColorStop(1, 'rgba(60,30,20,0.9)');
      ctx.fillStyle = g; ctx.fillRect(cx - 560, cy - 480, 1120, 960);
      if (!tmp) tmp = makeBuf(); const b = tmp.g; b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'source-over'; b.clearRect(0, 0, W, H);
      K.sheet(b, cx, cy, 0.95, 3, K.sheetBuf('rosette', K.COL.red), { rot: 0.0 });
      b.globalCompositeOperation = 'source-atop'; b.fillStyle = `rgba(120,10,10,${0.55 - 0.15 * (L - 0.85)})`; b.fillRect(0, 0, W, H);
      ctx.drawImage(tmp.c, 0, 0);
      ctx.strokeStyle = '#3B2A22'; ctx.lineWidth = 18; ctx.strokeRect(cx - 560, cy - 480, 1120, 960);
      ctx.lineWidth = 8; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(cx - 560 + k * 280, cy - 480); ctx.lineTo(cx - 560 + k * 280, cy - 400); ctx.moveTo(cx - 560 + k * 280, cy + 400); ctx.lineTo(cx - 560 + k * 280, cy + 480); ctx.stroke(); }
      K.text(ctx, '창에 붙이면,', 120, 460, 80, (lt - 0.4) / 0.4, { fam: 'sans', color: '#F7E2B8' });
      K.text(ctx, '빛이 들어와요', 120, 570, 80, (lt - 0.8) / 0.4, { fam: 'sans', color: '#F2B640' });
    },
  };
})();

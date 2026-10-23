// clue (30-second cut, 2 bars): evidence 1, the waybill. A label with a barcode and typed lines lies under the lamp;
// a magnifying glass slides across it, enlarging what it passes, and stops on 배송 예정: 오늘 18시.
(() => {
  const draw = (ctx, K) => {
    ctx.save(); ctx.translate(960, 560); ctx.rotate(-0.04);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; ctx.fillStyle = K.COL.cream; ctx.fillRect(-560, -300, 1120, 600); ctx.shadowColor = 'transparent';
    ctx.fillStyle = K.COL.ink; for (let k = 0; k < 60; k++) { const w = hash(k * 3.7) > 0.6 ? 7 : 3; ctx.fillRect(-500 + k * 15, -250, w, 150); }
    ctx.font = K.F(34, 'mono', 700); ctx.fillText('운송장 번호 4427-0912-1340', -500, -55);
    ctx.fillText('받는 분: 한빛시 은행나무로 12', -500, 10); ctx.fillText('보내는 분: 어디쯤 상점', -500, 70);
    ctx.font = K.F(56, 'display'); ctx.fillText('배송 예정: 오늘 18시', -500, 200);
    ctx.restore();
  };
  SCENES['clue'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt;
      K.desk(ctx); draw(ctx, K);
      K.stamp(ctx, '증거물 1', 380, 150, 64, rm(lt, 0.4, 0.52), -0.1);
      const mx = lerp(560, 800, Ease.ioC(rm(lt, 0.5, 2.2))) + 20 * Math.sin(lt * 1.3), my = lerp(380, 740, Ease.ioC(rm(lt, 0.5, 2.2))) + 10 * Math.cos(lt * 1.1), R = 170;
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.clip(); ctx.translate(mx, my); ctx.scale(1.6, 1.6); ctx.translate(-mx, -my); K.desk(ctx); draw(ctx, K); ctx.restore();
      ctx.save(); ctx.strokeStyle = '#2A2420'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(mx + R * 0.72, my + R * 0.72); ctx.lineTo(mx + R * 1.5, my + R * 1.5); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(mx, my, R - 30, -2.4, -1.6); ctx.stroke(); ctx.restore();
      K.wipes(ctx, env);
    },
  };
})();

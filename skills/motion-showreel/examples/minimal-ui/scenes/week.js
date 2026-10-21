// week (3 bars, 30-s cut): the week as 21 dots that fill day by day, a 연속 12일 streak badge, and the one setting the
// app has: the cursor flips 저녁 알림 on (알림은 저녁에 한 번만).
(() => {
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'], FILL = [3, 3, 2, 3, 3, 3, 3];
  SCENES['week'] = {
    draw(ctx, t, env) {
      const K = UI, lt = env.lt, B = env.beatSec, C = K.COL;
      K.desk(ctx);
      const e = K.sp(lt, 0);
      ctx.save(); ctx.globalAlpha *= clamp(e * 2); ctx.translate(0, 40 * (1 - e));
      K.card(ctx, 260, 200, 860, 560);
      K.text(ctx, '이번 주', 320, 310, 60, { w: 800 });
      DAYS.forEach((d, i) => {
        const x = 360 + i * 108;
        K.text(ctx, d, x, 400, 34, { align: 'center', w: 600, color: C.muted });
        for (let k = 0; k < 3; k++) {
          const at = 0.3 + (i * 3 + k) * B / 4, p = Ease.outBack(clamp((lt - at) / 0.3), 2), on = k < FILL[i];
          ctx.save(); ctx.fillStyle = C.line; ctx.beginPath(); ctx.arc(x, 470 + k * 76, 22, 0, TAU); ctx.fill();
          if (on && p > 0) { ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x, 470 + k * 76, 22 * p, 0, TAU); ctx.fill(); } ctx.restore();
        }
      });
      ctx.restore();
      const bp = K.sp(lt, 0.3 + 21 * B / 4 + 0.2);
      if (bp > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(bp * 2); ctx.translate(1350, 330); ctx.scale(0.8 + 0.2 * bp, 0.8 + 0.2 * bp); K.card(ctx, -160, -100, 420, 200, { fill: C.blueSoft });
        K.text(ctx, '연속', -100, -10, 40, { w: 600, color: C.blue }); K.text(ctx, '12일', -102, 70, 92, { w: 800, color: C.blue }); ctx.restore(); }
      // hold: a ring goes out from the streak badge on every beat, and a light runs along today's column
      if (bp > 0.3) { const n = Math.floor(lt / B), dt = lt - n * B; const q = dt / 0.6; if (q < 1) { ctx.save(); ctx.strokeStyle = C.blue; ctx.globalAlpha = 0.4 * (1 - q); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(1190 - 20 * q, 230 - 20 * q, 420 + 40 * q, 200 + 40 * q, 28 + 10 * q); ctx.stroke(); ctx.restore(); } }
      // the setting
      const sp = K.sp(lt, 3 * B);
      ctx.save(); ctx.globalAlpha *= clamp(sp * 2); ctx.translate(0, 30 * (1 - sp));
      K.card(ctx, 1190, 520, 480, 150);
      K.text(ctx, '저녁 알림', 1240, 610, 44, { w: 700 });
      const tg = Ease.outBack(clamp((lt - 5 * B - 0.05) / 0.3), 1.4);
      K.toggle(ctx, 1520, 567, tg);
      ctx.restore();
      K.text(ctx, '알림은 저녁에 한 번만.', 1190, 780, 40, { w: 600, color: C.ink2, alpha: clamp((lt - 5 * B - 0.2) / 0.4) });
      const cu = K.path([[0, 1700, 1100], [3.5 * B, 1650, 900], [5 * B, 1568, 595, true], [5 * B + 0.8, 1720, 760]], lt);
      K.cursor(ctx, cu.x, cu.y, { pressed: cu.pressed, ripple: cu.ripple });
    },
  };
})();

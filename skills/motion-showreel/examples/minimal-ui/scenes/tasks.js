// tasks (3-4 bars): the day, used for real. One card: 오늘, the date, a progress ring; three rows (물 2L 마시기, 20분
// 걷기, 책 10쪽 읽기). The cursor glides to each check and clicks on the beat; the row ticks, greys and strikes
// through, the ring steps 1/3, 2/3, 3/3; on the third an iridescent bloom opens behind the card, confetti bursts and
// a 오늘 완료 chip slides up. The hold breathes; the ring glints on each bar line.
(() => {
  const ROWS = ['물 2L 마시기', '20분 걷기', '책 10쪽 읽기'];
  SCENES['tasks'] = {
    draw(ctx, t, env) {
      const K = UI, lt = env.lt, B = env.beatSec, C = K.COL;
      K.desk(ctx);
      const cx = 600, cy = 170, cw = 720, ch = 740, e = K.sp(lt, 0);
      const clicks = [2 * B + 0.1, 4 * B + 0.1, 6 * B + 0.1], done = clicks.filter(c => lt >= c).length, all = clicks[2];
      const bloom = Ease.outC(clamp((lt - all) / 0.8));
      K.bloom(ctx, cx + cw / 2, cy + ch / 2, 620, bloom, lt);
      ctx.save(); ctx.globalAlpha *= clamp(e * 2); ctx.translate(0, 40 * (1 - e));
      K.card(ctx, cx, cy, cw, ch);
      K.text(ctx, '오늘', cx + 60, cy + 120, 72, { w: 800 });
      K.text(ctx, '10월 19일 일요일', cx + 62, cy + 178, 32, { w: 500, color: C.muted });
      const rp = clicks.reduce((a, c) => a + Ease.outBack(clamp((lt - c) / 0.4), 1.6) / 3, 0);
      K.ring(ctx, cx + cw - 110, cy + 125, 52, rp, { color: done === 3 ? C.green : C.blue });
      K.text(ctx, done + '/3', cx + cw - 110, cy + 138, 34, { align: 'center', w: 800, color: done === 3 ? C.green : C.ink });
      ROWS.forEach((s, i) => {
        const ry = cy + 280 + i * 140, p = clamp((lt - clicks[i]) / 0.35);
        ctx.save(); ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 60, ry - 70); ctx.lineTo(cx + cw - 60, ry - 70); ctx.stroke(); ctx.restore();
        K.check(ctx, cx + 100, ry, 30, p);
        const w = K.text(ctx, s, cx + 160, ry + 16, 46, { w: 600, color: mix(C.ink, C.muted, p) });
        if (p > 0) { ctx.save(); ctx.strokeStyle = C.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 160, ry + 2); ctx.lineTo(cx + 160 + w * Ease.ioC(p), ry + 2); ctx.stroke(); ctx.restore(); }
      });
      // the chip
      const cp = K.sp(lt, all + 0.25);
      if (cp > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(cp * 2); ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(cx + cw / 2 - 150, cy + ch - 120 + 30 * (1 - cp), 300, 72, 36); ctx.fill();
        K.text(ctx, '오늘 완료!', cx + cw / 2, cy + ch - 72 + 30 * (1 - cp), 36, { align: 'center', w: 800, color: '#FFFFFF' }); ctx.restore(); }
      ctx.restore();
      K.confetti(ctx, cx + cw - 110, cy + 125, lt - all);
      // the cursor: in from the bottom right, to each check, then away to rest
      const stops = [[0, 1500, 1100], [0.5, 1400, 900], ...clicks.map((c, i) => [c, cx + 100, cy + 280 + i * 140, true]), [all + 0.6, 1380, 820]];
      const cu = K.path(stops, lt);
      K.cursor(ctx, cu.x, cu.y, { pressed: cu.pressed, ripple: cu.ripple });
      // hold: the copy beside the card
      K.text(ctx, '오늘 할 일은', 1440, 420, 52, { w: 700, color: C.ink2, alpha: clamp((lt - 0.4) / 0.4) });
      K.text(ctx, '세 칸이면', 1440, 500, 52, { w: 700, color: C.ink2, alpha: clamp((lt - 0.6) / 0.4) });
      K.text(ctx, '충분해요.', 1440, 580, 52, { w: 800, color: C.blue, alpha: clamp((lt - 0.8) / 0.4) });
    },
  };
})();

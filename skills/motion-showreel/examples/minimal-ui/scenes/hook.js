// hook (2 bars): the icon and the name. The app icon springs up in the middle of a near-white desk and its three bars
// fill a beat apart; 하루 세 칸 and the line that says what it is (할 일은 세 개만 적는 습관 앱) rise under it.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = UI, lt = env.lt, B = env.beatSec, C = K.COL;
      K.desk(ctx);
      const e = K.sp(lt, 0.05), y = 380 + 10 * Math.sin(lt * 2.2);
      K.halo(ctx, 960, y, 300, env, clamp(e));
      ctx.save(); ctx.globalAlpha *= clamp(e * 2); ctx.translate(960, y); ctx.scale(0.7 + 0.3 * e, 0.7 + 0.3 * e); ctx.translate(-960, -y);
      K.icon(ctx, 960, y, 240, { fill: [0, 1, 2].map(i => Ease.outC(clamp((lt - (1 + i) * B) / 0.35))) });
      ctx.restore();
      const n = K.sp(lt, 0.5), s = K.sp(lt, 0.8);
      K.text(ctx, '하루 세 칸', 960, 700 + 30 * (1 - n), 132, { align: 'center', w: 800, alpha: clamp(n * 1.5) });
      K.text(ctx, '할 일은 세 개만 적는 습관 앱', 960, 790 + 24 * (1 - s), 46, { align: 'center', w: 500, color: C.ink2, alpha: clamp(s * 1.5) });
    },
  };
})();

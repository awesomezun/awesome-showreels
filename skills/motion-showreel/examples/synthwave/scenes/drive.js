// drive (2 bars; 3 in the 30-second cut): on the road. The car from behind, tail lights glowing, banking a little;
// the grid and the road dashes rush at it, palms flick past on both sides; the speed counts to 260 km/h; 밤은 길고, /
// 도로는 끝이 없다 in neon.
(() => {
  SCENES['drive'] = {
    draw(ctx, t, env) {
      const K = OUTRUN, lt = env.lt, bank = 0.04 * Math.sin(lt * 1.4), vx = -120 * Math.sin(lt * 1.4);
      K.sky(ctx); K.sun(ctx, W / 2 + vx * 0.2, 470, 230, lt); K.mountains(ctx, 300 + lt * 60 - vx * 0.3); K.grid(ctx, lt, 2.4, { road: true, vx });
      K.palms(ctx, lt, 2.2, vx);
      K.car(ctx, W / 2, 1000, 0.82, lt, { bank });
      K.neon(ctx, '밤은 길고,', 180, 300, 92, (lt - 0.4) / 0.2, { align: 'left', col: '#FF3CC8', flicker: lt + 2 });
      K.neon(ctx, '도로는 끝이 없다', 180, 420, 92, (lt - 1.0) / 0.2, { align: 'left', col: '#3CF0FF', flicker: lt + 5 });
      ctx.save(); ctx.font = K.F(70, 'sans'); ctx.textAlign = 'right'; ctx.fillStyle = '#FFF4FF'; ctx.shadowColor = '#FF3CC8'; ctx.shadowBlur = 18;
      ctx.fillText(`${Math.round(lerp(120, 260, Ease.outC(rm(lt, 0.2, 2.4))))} km/h`, W - 140, 300); ctx.restore();
      K.vhs(ctx, lt, { clock: 5 });
    },
  };
})();

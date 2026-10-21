// exploded (3 bars, 30-s cut): the parts. The battery slides out of the down tube, the hub, the hinge and the
// battery light up in cyan and are named: 허브 모터 250W, 배터리 36V 10Ah · 최대 60km, 알루미늄 경첩.
(() => {
  SCENES['exploded'] = {
    draw(ctx, t, env) {
      const K = BP, lt = env.lt, B = env.beatSec, C = K.COL, BK = K.BIKE;
      K.sheet(ctx);
      ctx.save(); K.grid(ctx);
      const bat = Ease.outBack(clamp((lt - 0.3) / 0.7), 1.3);
      K.bike(ctx, 1, { fold: 0, stem: 0, seat: 0, bat }, { hi: lt > 0.3 ? ['battery'] : [] });
      const hub = 0.5 + 0.5 * Math.sin(lt * 4);
      ctx.save(); ctx.strokeStyle = C.cyan; ctx.globalAlpha = 0.3 + 0.5 * hub; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(BK.FW[0], BK.FW[1], 34 + 6 * hub, 0, TAU); ctx.stroke(); ctx.restore();
      K.callout(ctx, [BK.FW[0], BK.FW[1]], [1400, 300], ['허브 모터 250W', 'FRONT HUB'], rm(lt, 0.8, 1.6));
      K.callout(ctx, [BK.BB[0] - 10, BK.BB[1] + 60], [250, 950], ['배터리 36V 10Ah', '최대 60km'], rm(lt, 1.3, 2.1));
      K.callout(ctx, BK.HINGE, [950, 180], ['알루미늄 경첩', 'ONE-PIECE HINGE'], rm(lt, 1.8, 2.6), { color: C.yellow });
      ctx.restore();
      K.titleBlock(ctx, 1, { title: '폴드원 E1  분해도', no: 'DWG FO-E1-002  ·  1:10' });
    },
  };
})();

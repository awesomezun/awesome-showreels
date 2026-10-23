// hook (2 bars): the board. The channel's badge 궁금상자 slaps down, then the title sticker 페트병 한 개의 여행, then a
// bottle sticker with a tilt; 버린 병은 어디로 갈까? in a pill at the foot.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = STK, C = K.COL, lt = env.lt, [x, y] = K.ST.hook, z = 1.05 * (1 + 0.04 * clamp(lt / env.dur));
      ctx.save(); K.camAt(ctx, 700, 480, z); K.board(ctx, 0);
      K.slap(ctx, K.obj('badge', 150, 140), 300, 150, (lt - 0.15) / 0.3, -0.12);
      K.slap(ctx, K.label('qbox', '궁금상자', 52, C.yellow, C.ink), 510, 160, (lt - 0.35) / 0.3, -0.05);
      K.slap(ctx, K.label('title', '페트병 한 개의 여행', 96, C.ink), 960, 300, (lt - 0.8) / 0.3, 0.02);
      K.station(ctx, 'hook', (lt - 1.4) / 0.3, lt);
      ctx.restore();
      ctx.save(); ctx.globalAlpha = clamp((lt - 2.0) / 0.3); ctx.font = K.F(62); const s = '버린 병은 어디로 갈까?', w = ctx.measureText(s).width + 80; ctx.fillStyle = 'rgba(255,255,255,0.92)'; rr(ctx, W / 2 - w / 2, 930, w, 100, 50); ctx.fill(); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(s, W / 2, 1000); ctx.restore();
    },
  };
})();

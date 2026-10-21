// detect (4-5 bars): the core message, shown. The network lights up edge by edge and carries cyan packets; the radar
// turns once a bar from the core. Attacks come in along the same edges but cannot be seen, until the sweep crosses
// them: they burn magenta, ringed, and are stopped at the next node with a shield pulse. 보이지 않는 공격까지, / 먼저.
(() => {
  const ATT = [{ from: [1980, 60], path: [9, 2], t0: 0.9, speed: 330 }, { from: [1990, 1060], path: [11, 4], t0: 2.4, speed: 300 }, { from: [620, 1100], path: [12, 6], t0: 3.6, speed: 320 },
               { from: [1020, -40], path: [13, 7], t0: 5.0, speed: 340 }, { from: [1960, 560], path: [10, 3], t0: 6.3, speed: 330 }, { from: [1250, -40], path: [8, 1], t0: 7.4, speed: 320 }];
  SCENES['detect'] = {
    draw(ctx, t, env) {
      const K = NEON, lt = env.lt, per = env.barSec;
      ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); K.view(0.78, 454, 119); K.grid(ctx, 1);
      K.radar(ctx, lt, per, clamp((lt - 0.4) / 0.4));
      K.net(ctx, lt, { reveal: lt * 2.2 });
      let blocked = 0; ATT.forEach(A => { const s = K.attack(ctx, lt, A, per); if (s && s.done) blocked++; });
      K.ntext(ctx, '보이지 않는 공격까지,', 110, 300, 84, K.COL.cyan, K.flicker(lt - 0.3, 5));
      K.ntext(ctx, '먼저.', 110, 470, 170, K.COL.mag, K.flicker(lt - 1.4, 6));
      K.plain(ctx, '차단', 116, 620, 48, { alpha: clamp((lt - 1.6) / 0.4), track: 4 });
      K.ntext(ctx, `${blocked}건`, 230, 624, 64, K.COL.white, clamp((lt - 1.6) / 0.4));
    },
  };
})();

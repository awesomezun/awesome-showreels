// hook (2 bars): the name and what it is. On the right the isometric city builds itself (the ground plate, the road
// grid, the river, the parks, the blocks); on the left 한빛시 자전거 리포트, a big 2026 that rolls up to its year,
// 숫자로 본 출근길, and a bicycle riding along the baseline.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      const m = { ox: 1300, oy: 200, s: 0.6 };
      K.map(ctx, m, { ground: rm(lt, 0, 0.5), roads: rm(lt, 0.2, 1.4), water: rm(lt, 0.8, 1.4), parks: rm(lt, 1.0, 2.0), blocks: rm(lt, 1.2, 2.6), lanes: 0, hubs: 0 }, lt);
      K.rise(ctx, '한빛시 자전거 리포트', 140, 330, 58, lt, { at: 0.1, color: C.navy });
      const yr = Math.round(lerp(2020, 2026, Ease.outExpo(rm(lt, 0.35, 1.3))));
      K.rise(ctx, String(yr), 130, 560, 230, lt, { at: 0.3, color: C.red, w: 900 });
      K.rise(ctx, '숫자로 본 출근길', 140, 690, 66, lt, { at: 1.1 });
      const bx = lerp(-150, 520, Ease.outC(rm(lt, 0.8, 2.4))) + Math.max(0, lt - 2.4) * 30;
      ctx.fillStyle = 'rgba(35,38,43,0.15)'; ctx.fillRect(140, 880, 700, 4);
      K.bike(ctx, bx, 830, 44, C.navy, lt);
      K.tag(ctx, 140, 960, { alpha: clamp(lt - 1.5) });
    },
  };
})();

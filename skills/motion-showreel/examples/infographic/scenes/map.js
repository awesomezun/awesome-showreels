// map (2-3 bars): where. The whole isometric city at once, then the bike lanes draw themselves in red and riders run
// along them; the six hubs pop up and pulse; on the right, 자전거 도로 112km counts up and 대여소 거점 6곳 follows.
(() => {
  SCENES['map'] = {
    draw(ctx, t, env) {
      const K = INFO, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx);
      const z = 1 + 0.03 * Math.sin(lt * 0.6), m = { ox: 760, oy: 150 - 10 * Math.sin(lt * 0.5), s: 0.78 * z };
      K.map(ctx, m, { ground: 1, roads: 1, water: 1, parks: 1, blocks: 1, lanes: rm(lt, 0.3, 2.4), hubs: rm(lt, 1.6, 2.8) }, lt);
      K.rise(ctx, '자전거 도로', 1330, 380, 60, lt, { at: 0.4, color: C.ink2 });
      const km = Math.round(112 * Ease.outExpo(rm(lt, 0.5, 2.4)));
      K.rise(ctx, km + 'km', 1320, 560, 150, lt, { at: 0.5, color: C.red, w: 900 });
      K.rise(ctx, '대여소 거점 6곳', 1330, 690, 56, lt, { at: 1.8, color: C.navy });
      K.tag(ctx, 1330, 790, { alpha: clamp(lt - 0.5) });
    },
  };
})();

// end (3 bars): one more wave from the flower's heart turns the wall into a single cherry blossom on the sky; 조각 만
// 개가 모여 / 하나의 봄; 유리 타일 정원 · 가람역 2번 출구 · 가상의 공공미술입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const M = TILE, lt = env.lt, B = env.beatSec;
      M.draw(ctx, M.state(lt, 'g0', [{ at: 0.5 * B, to: 'bloom', wave: { o: [114, 52], spd: 110, dur: 0.35, jit: 0.25 } }], { time: t, tw: 0.04 }), { s: 1 + 0.035 * lt / env.dur, x: -20 * lt / env.dur });
      M.text(ctx, '조각 만 개가 모여', 110, 430, 96, (lt - 4 * B) / (0.5 * B)); M.text(ctx, '하나의 봄', 110, 575, 132, (lt - 4.6 * B) / (0.5 * B), { color: M.COL.pink });
      M.text(ctx, '유리 타일 정원 · 가람역 2번 출구 · 가상의 공공미술입니다', 114, 660, 34, (lt - 5.4 * B) / (0.5 * B), { fam: 'sans' });
    },
  };
})();

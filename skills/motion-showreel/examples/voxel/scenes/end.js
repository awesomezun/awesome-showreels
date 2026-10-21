// end (2-3 bars): back to day; the whole village (with the 30-s cut's trees and lamps) turns slowly bigger; one last
// block, a golden one, drops onto the roof; 블록 마을, the camp line and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = VOX, lt = env.lt;
      K.sky(ctx, lt + 30);
      const v = K.view(46 + 0.6 * lt, 1370 - 4 * lt, 390 - 4 * lt);
      const B = K.village().filter(b => b.g !== 'more' || env.cut === '30');
      B.push({ g: 'gold', x: 3, y: 3, z: 4, t: 'lamp', at: 2 * env.beatSec - 0.42 });
      K.draw(ctx, v, B, { lt }); K.puffs(ctx, v, B, lt);
      K.dropText(ctx, '블록 마을', 140, 480, 180, lt, { at: 0.1, step: 0.08 });
      K.pop(ctx, '여름방학 코딩 캠프 · 8~12세', 150, 600, 56, lt, { at: 0.6 });
      K.pop(ctx, '가상의 캠프 · 예제', 150, 690, 42, lt, { at: 0.9, color: '#3A4A80' });
    },
  };
})();

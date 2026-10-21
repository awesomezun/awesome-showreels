// hook (2 bars): a sky with drifting block clouds; the ground pops up tile by tile from the middle out (grass, a sand
// path, a pond) and two trees drop in piece by piece; 어린이 코딩 캠프, then 블록 마을 letters dropping like blocks.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = VOX, lt = env.lt;
      K.sky(ctx, lt);
      const v = K.view(lerp(50, 56, Ease.outC(clamp(lt / 3))) + 0.3 * lt, 1300 - 4 * lt, 360);
      const B = K.village().filter(b => b.g === 'ground' || b.g === 'deco').map(b => b.g === 'ground' ? { ...b, pop: 0.1 + b.d * 0.09 } : { ...b, at: (4 + b.k) * env.beatSec - 0.42 + (b.z - 1) * 0.04 });
      K.draw(ctx, v, B, { lt }); K.puffs(ctx, v, B, lt);
      K.chip(ctx, '어린이 코딩 캠프', 140, 250, 46, lt, { at: 0.15 });
      K.dropText(ctx, '블록 마을', 140, 540, 190, lt, { at: 0.3, step: 0.1 });
      K.pop(ctx, '여름방학 5일', 150, 660, 58, lt, { at: 1.2 });
    },
  };
})();

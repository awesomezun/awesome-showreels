// chart (30-second cut, 2 bars): the card drops into five coral bars standing on one line; 87% counts up over them;
// 이번 주 달성률.
(() => {
  SCENES['chart'] = {
    draw(ctx, t, env) {
      const K = MORPH, lt = env.lt;
      K.ground(ctx);
      K.scene(ctx, env, 'chart', { f: 2.0, z: 0.5 });
      K.text(ctx, countUp(0, 87, Ease.outC(rm(lt, 0.4, 1.4))) + '%', K.CX, K.CY - 230, 140, (lt - 0.35) / 0.2);
      K.text(ctx, '이번 주 달성률', K.CX, 840, 72, (lt - 0.6) / 0.35);
    },
  };
})();

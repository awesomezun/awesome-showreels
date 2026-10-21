// hook (2 bars): a cutting mat, shot frame by frame; felt pieces land one after another and become a bear (ears, body,
// arms and feet, head, muzzle, button eyes, cheeks, a red button); a paper label slides in: 수제 인형 공방, 털뭉치 공방.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = FELT, lt = env.lt, st = K.step(lt);
      K.begin(ctx, lt); K.mat(ctx);
      const n = Math.floor(clamp((st - 0.25) / 0.4, 0, 9));
      K.doll(ctx, 1380, 900, 1.35, 'bear', { show: n });
      const lx = lerp(-760, 110, Ease.outC(clamp((st - 0.25) / 0.5)));
      K.label(ctx, lx, 170, 720, 400);
      K.hand(ctx, '수제 인형 공방', lx + 60, 290, 72, { color: '#C9776A' });
      K.hand(ctx, '털뭉치 공방', lx + 50, 470, 150);
      K.end(ctx, lt);
    },
  };
})();

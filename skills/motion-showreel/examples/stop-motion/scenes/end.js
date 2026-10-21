// end (2 bars): the bear waves, frame by frame; the label: 털뭉치 공방, the address, the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = FELT, lt = env.lt, f = K.frame(lt);
      K.begin(ctx, lt); K.mat(ctx);
      K.doll(ctx, 1400, 920, 1.35, 'bear', { wave: [0, 0.35, 0.6, 0.35][f % 4] });
      K.label(ctx, 110, 200, 760, 520);
      K.hand(ctx, '털뭉치 공방', 170, 380, 150);
      K.hand(ctx, '한빛동 골목 2층', 176, 520, 76, { color: '#C9776A' });
      K.hand(ctx, '가상의 공방 · 예제', 176, 620, 60, { color: '#8A7A6A' });
      K.end(ctx, lt);
    },
  };
})();

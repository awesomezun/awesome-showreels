// dance (3 bars, 30-s cut): 콩이 dances on every beat, arms up and down in turn; the fans' light sticks sway on the
// beat and confetti falls; 다 같이 콩콩!
(() => {
  SCENES['dance'] = {
    draw(ctx, t, env) {
      const K = KONG, lt = env.lt, C = K.COL, B = env.beatSec, ph = (lt / B) % 1, n = Math.floor(lt / B);
      K.stage(ctx, lt, { sx: W / 2 });
      K.confetti(ctx, lt, 1);
      const hop = Math.sin(Math.PI * ph) * 60, sq = ph < 0.1 ? 0.3 : -0.05, up = n % 2;
      K.kong(ctx, W / 2, 900, 1.15, lt, { face: n % 4 === 3 ? 'wink' : 'happy', prop: 'hat', hop, sq, arms: up ? [2.3, 0.3] : [0.3, 2.3], lean: up ? -0.08 : 0.08 });
      K.sticks(ctx, lt, B);
      K.title(ctx, '다 같이 콩콩!', W / 2, 260, 150, lt, { at: 0.2, align: 'center', color: C.gold });
    },
  };
})();

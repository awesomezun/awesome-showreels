// show (4-5 bars): the one-character show, and the core message. Every two beats 콩이 hops into a new face and prop
// (안녕! / 찡긋 / 깜짝! / 사랑해요 / 최고!) with a caption over its head; 콩이 하나면 / 충분해요 lands at the left.
(() => {
  const POSES = [['smile', null, '안녕!', [0.3, 2.0]], ['wink', 'hat', '찡긋', [0.3, 0.6]], ['surprised', 'glasses', '깜짝!', [2.2, 2.2]], ['love', 'bow', '사랑해요', [1.2, 1.2]], ['happy', 'crown', '최고!', [2.4, 2.4]]];
  SCENES['show'] = {
    draw(ctx, t, env) {
      const K = KONG, lt = env.lt, C = K.COL, B = env.beatSec, k = Math.floor(lt / (2 * B)), P = POSES[k % POSES.length], ph = (lt / (2 * B)) % 1;
      K.stage(ctx, lt, { sx: 1320 });
      const hop = Math.sin(Math.PI * clamp(ph / 0.35)) * 70 * (ph < 0.35 ? 1 : 0), sq = ph < 0.06 ? 0.3 : ph > 0.35 && ph < 0.45 ? 0.25 : 0;
      K.kong(ctx, 1320, 930, 1.25, lt, { face: P[0], prop: P[1], hop, sq, arms: P[3], lean: 0.06 * Math.sin(lt * 4) });
      K.tag(ctx, P[2], 1320, 300 - hop, 72, ph * 2 * B, { at: 0, bg: k % 2 ? C.gold : C.white });
      K.title(ctx, '콩이 하나면', 120, 430, 130, lt, { at: 2.6 });
      K.title(ctx, '충분해요', 120, 600, 170, lt, { at: 3.1, color: C.gold });
    },
  };
})();

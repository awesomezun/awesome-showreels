// intro (2 bars; 3 in the 30-second cut): the footage: a warm room, the cheese cat asleep as a loaf on a pink cushion,
// breathing, zzz floating up; the camera creeps in. 오늘의 하숙생: pops in yellow, then 낮잠 대장 big in pink; the tag
// 1호실 · 나비 (3살) at the foot; the show's bug in the corner.
(() => {
  SCENES['intro'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec;
      ctx.save(); K.cam(ctx, 1.0 + 0.18 * clamp(lt / env.dur), 520, 1150, 0, lt); K.room(ctx, lt); K.cat(ctx, 380, 1330, 0.95, lt, { pose: 'loaf', face: 'sleep' }); K.zzz(ctx, 560, 1080, lt); ctx.restore();
      K.cap(ctx, '오늘의 하숙생:', W / 2, 330, 104, lt - 0.3, { style: 'yellow' });
      K.cap(ctx, '낮잠 대장', W / 2, 520, 180, lt - 2 * B, { style: 'pink', stagger: 0.07, bob: true });
      K.tag(ctx, '1호실 · 나비 (3살)', W / 2, 1720, 56, (lt - 3 * B) / 0.25, { bg: '#FFFFFF', fg: K.COL.ink });
      K.bug(ctx);
    },
  };
})();

// program (3 bars, 30-s cut): three intertitles, one a bar, the opening programme: 〈봄날의 기차〉, 〈달빛 무도회〉,
// 〈동명 거리의 아이들〉, each with its year.
(() => {
  const P = [['〈봄날의 기차〉', '1963 · 흑백'], ['〈달빛 무도회〉', '1965 · 흑백'], ['〈동명 거리의 아이들〉', '1968 · 흑백']];
  SCENES['program'] = {
    draw(ctx, t, env) {
      const K = REEL8, lt = env.lt, C = K.COL, i = Math.max(0, Math.min(2, Math.floor(lt / env.barSec)));
      ctx.save(); K.weave(ctx, lt); K.card(ctx, [['개관 기념 상영', 70, '#BFAF90'], [P[i][0], i === 2 ? 120 : 150, C.cream], [P[i][1], 60, C.warm]]); ctx.restore();
      const l2 = lt - i * env.barSec; if (l2 < 0.08 && i > 0) { ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H); }
      K.film(ctx, lt);
    },
  };
})();

// rules (30-second cut, 2 bars): how to play: a word appears (눌러!), the fuse burns; 지시어를 보고, 도화선이 다 타기 전에!
(() => {
  SCENES['rules'] = {
    draw(ctx, t, env) {
      const M = MINI, lt = env.lt, B = env.beatSec;
      M.stripes(ctx, '#2B2D42', t, 80); M.text(ctx, '규칙은 하나', W / 2, 250, 110, (lt - 0.1) / 0.25, { color: '#FFE14D' });
      M.text(ctx, '지시어를 보고', 560, 520, 96, (lt - 1 * B) / (0.3 * B), { pop: lt - 1 * B }); M.text(ctx, '눌러!', 560, 720, 170, (lt - 2 * B) / (0.2 * B), { pop: lt - 2 * B, color: '#FF5A5F' });
      M.text(ctx, '도화선이', 1380, 520, 96, (lt - 4 * B) / (0.3 * B), { pop: lt - 4 * B }); M.text(ctx, '다 타기 전에!', 1380, 680, 110, (lt - 5 * B) / (0.3 * B), { pop: lt - 5 * B, color: '#FFB020' });
      M.hud(ctx, '연습', 0, clamp((lt - 4 * B) / (4 * B)), t);
    },
  };
})();

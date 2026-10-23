// hook (2 bars): the logo pops onto flashing stripes with a lit bomb; then the count: 3, 2, 1, 시작!
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const M = MINI, lt = env.lt, B = env.beatSec, k = Math.floor(lt / B);
      M.stripes(ctx, M.BG[k % M.BG.length], t, 300);
      const la = lt < 3.8 * B ? 1 : clamp((4 * B - lt) / (0.2 * B)); M.circ(ctx, 1420, 520, 120 * la, '#2A2A3A', 8 * la); if (la > 0) M.star(ctx, 1470 + 30 * Math.sin(t * 30), 380, 34, '#FFB020', t * 10);
      M.text(ctx, '5초 미션', W / 2 - 120, 600, 260, Math.min(1, (lt - 0.5 * B) / (0.15 * B)) * la, { pop: lt - 0.5 * B, color: '#FFE14D' });
      M.text(ctx, '파티 게임', W / 2 - 120, 330, 80, ((lt - 1.5 * B) / (0.2 * B)) * la);
      const n = ['3', '2', '1', '시작!'], j = k - 4; if (j >= 0 && j < 4) M.text(ctx, n[j], W / 2, 640, j < 3 ? 420 : 300, 1, { pop: lt - (4 + j) * B, color: j < 3 ? '#FFFFFF' : '#FFE14D' });
    },
  };
})();

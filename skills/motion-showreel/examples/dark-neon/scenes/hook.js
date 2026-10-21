// hook (2 bars): black. The mark switches on with a neon stutter (a shield with a magenta X through it), then the name
// tube by tube: 센티넬 X; AI 보안 underneath; a faint grid comes up behind.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = NEON, lt = env.lt, B = env.beatSec;
      ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H); K.view(1, 0, 0); K.grid(ctx, clamp((lt - 1) / 1));
      K.mark(ctx, 560, 520, 190, K.flicker(lt - 0.15, 1) * (0.92 + 0.08 * Math.sin(lt * 31)));
      K.ntext(ctx, '센티넬', 820, 560, 170, K.COL.cyan, K.flicker(lt - 0.75, 2));
      K.ntext(ctx, 'X', 1400, 560, 170, K.COL.mag, K.flicker(lt - 1.15, 3));
      K.plain(ctx, 'AI 보안 플랫폼', 826, 680, 56, { alpha: clamp((lt - 1.6) / 0.4), track: 8 });
    },
  };
})();

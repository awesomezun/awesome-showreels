// notes (3 bars, 30-s cut): the three notes, one per bar. Behind the turning bottle a field of colour (bergamot,
// white tea, musk) changes on the bar line and the note's name sits large on the backdrop, bent through the glass;
// a small label (처음 / 가운데 / 끝) and a thin line count the three.
(() => {
  const NOTES = [['처음', '베르가못', 'rgba(196,214,96,0.55)', '#E3D98A'], ['가운데', '화이트 티', 'rgba(200,226,214,0.5)', '#E6EBD5'], ['끝', '머스크', 'rgba(214,170,140,0.55)', '#E2B990']];
  SCENES['notes'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt, C = K.COL, bar = env.barSec, i = Math.max(0, Math.min(2, Math.floor(lt / bar))), l2 = lt - i * bar, n = NOTES[i];
      const cam = K.orbit(-0.25 + 0.06 * lt, 0.1, 2.9, [0, 0.47, 0], 0.5, { cx: W * 0.64 });
      K.studio(ctx, cam);
      // the field of colour: a soft disc behind the bottle that wipes in on each bar
      const c = K.project(cam, [0, 0.47, -0.9]), r = 560 * Ease.outC(clamp(l2 / 0.7)) + 60 * Math.sin(lt);
      if (i > 0 && l2 < 0.7) { const p0 = NOTES[i - 1], g0 = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 620); g0.addColorStop(0, p0[2]); g0.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H); }
      const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], Math.max(1, r)); g.addColorStop(0, n[2]); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const p = Ease.outC(clamp(l2 / 0.6));
      ctx.save(); ctx.filter = p < 1 ? `blur(${(1 - p) * 12}px)` : 'none'; K.text(ctx, n[1], c[0] + 30 * (1 - p), 575, 170, { align: 'center', w: 800, alpha: 0.9 * p }); ctx.restore();
      K.bottle(ctx, cam, { rot: -0.6 + 0.3 * lt, light: 0.2 + 0.6 * Math.sin(lt * 0.5), time: lt, level: 0.56, slosh: 0.03, tint: n[3] });
      // the label and the count on the left
      K.fade(ctx, n[0], 150, 470, 64, l2, { at: 0.1, color: C.ink2, w: 700, track: 8 });
      K.fade(ctx, n[1], 150, 600, 112, l2, { at: 0.2, w: 800 });
      for (let k = 0; k < 3; k++) { ctx.fillStyle = k === i ? C.ink : 'rgba(244,246,250,0.25)'; ctx.fillRect(150 + k * 84, 680, 64 * (k === i ? Ease.outC(clamp(l2 / 0.6)) : 1), 4); }
    },
  };
})();

// message (2-3 bars): the core line: a stopwatch is drawn and its hand ticks three seconds; 링크 누르기 전, and a
// big red 3초만.; the fiction label underneath.
(() => {
  SCENES['message'] = {
    draw(ctx, t, env) {
      const K = WB, lt = env.lt, B = env.beatSec, id = K.SCENE_PANEL['message'], pan = K.PANEL[id];
      const prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : pan;
      const cam = K.camFor ? K.camFor(env, id, lt) : { x: pan.cx, y: pan.cy, z: 1 };
      K.board(ctx, cam);
      ctx.save(); K.cam(ctx, cam); const hand = K.world(ctx, env, id, lt);
      // the stopwatch hand: three ticks, one a beat, from 12 o'clock
      const k = Math.max(0, (lt - 0.9) / B), ticks = Math.floor(k) + Ease.outBack(clamp((k % 1) / 0.35)), sweep = ticks <= 3 ? ticks : 3 + ((ticks - 3) % 3);
      if (lt > 0.8) { const a = -Math.PI / 2 + sweep / 3 * TAU; ctx.save(); ctx.strokeStyle = K.COL.red; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(8330, 560); ctx.lineTo(8330 + Math.cos(a) * 170, 560 + Math.sin(a) * 170); ctx.stroke(); ctx.fillStyle = K.COL.ink; ctx.beginPath(); ctx.arc(8330, 560, 16, 0, TAU); ctx.fill();
        ctx.strokeStyle = K.COL.red; ctx.globalAlpha = 0.25; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(8330, 560, 150, -Math.PI / 2, Math.min(a, -Math.PI / 2 + TAU * Math.min(1, ticks / 3))); ctx.stroke();
        const pulse = beatPulse(env, 5); ctx.globalAlpha = 0.35 * pulse; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(8330, 560, 250 + 30 * (1 - pulse), 0, TAU); ctx.stroke(); ctx.restore(); }
      ctx.restore();
      if (hand) { const [hx, hy] = K.toScreen(cam, hand[0], hand[1]); K.hand(ctx, hx, hy, { s: cam.z * 0.8 }); }
    },
  };
})();

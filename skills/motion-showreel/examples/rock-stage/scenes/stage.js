// stage (4 bars): the core message. The full stage plays and every part answers its own instrument: the kick lifts
// the floor light and the crowd, the snare strikes the band's bolt, the guitar pumps the left amps and lights the
// red guitar, the bass sends rings across the floor and pumps the right amps, the hats shake the cymbals. A meter
// panel shows the four channels; 볼륨 올리고 / 보세요 slam in on the first two snares.
(() => {
  SCENES['stage'] = {
    draw(ctx, t, env) {
      const K = ROCK, lt = env.lt, L = K.levels(env.cut, t), B = env.beatSec;
      ctx.save(); const z = 1 + 0.012 * L.kick; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      K.stage(ctx, t, L, env.cut); K.crowd(ctx, t, L); ctx.restore();
      if (L.snare > 0.6) { ctx.fillStyle = `rgba(255,255,255,${0.12 * L.snare})`; ctx.fillRect(0, 0, W, H); }
      K.slam(ctx, '볼륨 올리고', 110, 330, 150, lt, { at: B });
      K.slam(ctx, '보세요', 110, 500, 150, lt, { at: 3 * B, color: '#FFFFFF' });
      K.meters(ctx, 1400, 170, L, clamp((lt - 0.4) / 0.3));
    },
  };
})();

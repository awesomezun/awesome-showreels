// drop (4 bars, 30-s cut): everything at once. Every snare cracks real lightning from the band's bolt down to the
// stage and flashes the strobe; the beams cross; the crowd jumps higher; the date and the hall slam in.
(() => {
  SCENES['drop'] = {
    draw(ctx, t, env) {
      const K = ROCK, lt = env.lt, L = K.levels(env.cut, t), B = env.beatSec;
      ctx.save(); const z = 1 + 0.02 * L.kick; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      K.stage(ctx, t, L, env.cut, { cross: true, boost: 0.08 });
      const n = K.count(env.cut, 'snare', t); K.crack(ctx, 960 + (hash(n) - 0.5) * 200, 300, 300 + hash(n * 3.1) * 1320, 860, L.snare, n);
      K.crowd(ctx, t, L, { jump: 1.6 }); ctx.restore();
      if (L.snare > 0.3) { ctx.fillStyle = `rgba(255,255,255,${0.22 * L.snare})`; ctx.fillRect(0, 0, W, H); }
      K.slam(ctx, '11월 22일 토요일', 110, 330, 130, lt, { at: B });
      K.slam(ctx, '한빛 라이브홀', 110, 480, 130, lt, { at: 3 * B, color: '#FFFFFF' });
      K.meters(ctx, 1400, 170, L, 1);
    },
  };
})();

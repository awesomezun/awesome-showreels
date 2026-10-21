// solo (3 bars, the breakdown, 30-s cut): the lights go down to one white spot on the guitarist; the others stand in
// the dark; each ringing chord swells the spot; 기타 한 대, / 조명 하나. In the build bar the muted sixteenths flicker
// the strobe and the stage lights climb back.
(() => {
  SCENES['solo'] = {
    draw(ctx, t, env) {
      const K = ROCK, lt = env.lt, L = K.levels(env.cut, t), B = env.beatSec, build = clamp((lt - (env.dur - env.barSec)) / env.barSec);
      K.stage(ctx, t, L, env.cut, { on: 0.15 + 0.85 * build, hot: build, boltOn: build, dim: 0.75 * (1 - build), rim: '#3A3A40' });
      // the spot
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const a = 0.25 + 0.35 * L.guitar; const g = ctx.createLinearGradient(600, 0, 600, 880); g.addColorStop(0, `rgba(255,255,255,${a * 0.2})`); g.addColorStop(1, `rgba(255,255,240,${a})`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(560, 0); ctx.lineTo(640, 0); ctx.lineTo(820, 880); ctx.lineTo(380, 880); ctx.closePath(); ctx.fill();
      ctx.fillStyle = `rgba(255,255,230,${a * 0.6})`; ctx.beginPath(); ctx.ellipse(600, 870, 230, 40, 0, 0, TAU); ctx.fill(); ctx.restore();
      K.band(ctx, t, L, env.cut, { soloOnly: true, rimG: '#FFFFFF' });
      K.crowd(ctx, t, L, { jump: build });
      if (build > 0) { const s = K.since(env.cut, 'guitar', t); if (s < 0.05) { ctx.fillStyle = `rgba(255,255,255,${0.25 * build})`; ctx.fillRect(0, 0, W, H); } }
      K.text(ctx, '기타 한 대,', 1140, 380, 120, { alpha: clamp((lt - 0.3) / 0.4) });
      K.text(ctx, '조명 하나.', 1140, 530, 120, { alpha: clamp((lt - 1.1) / 0.4), color: '#FFE14D' });
    },
  };
})();

// colors (2 bars, 30-s cut): the four finishes step past in a cover flow, one per beat (ticks), the name under the
// one in front; a ding when the last lands.
(() => {
  const ORDER = ['graphite', 'sand', 'sage', 'vermilion'];
  SCENES['colors'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt, out = Ease.inC(env.phase.out);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('colors', s => {
        s.studio({ floor: 'shadow', shadowOpacity: 0.22, key: { dir: [2, 8, 6], soft: 7, size: 9 }, rim: { color: '#FFFFFF', intensity: 1.6 } });
        ORDER.forEach((f, i) => s.add(MONOBLOCK.product(f, { prefix: f }), { name: 'p' + i, scale: 0.82 }));
      });
      const beat = Math.max(0, lt / env.beatSec - 1);
      const focus = Math.min(3, Math.floor(beat) + Ease.outBack(clamp((beat % 1) / 0.45), 0.6) * (beat < 3 ? 1 : 0));
      ORDER.forEach((f, i) => {
        const a = G3.arrange.coverFlow(i, focus, { w: 2.2, side: 0.95, gap: 0.42, angle: 0.95, push: 1.4 });
        G3.pose(st.get('p' + i), { pos: [a.pos[0], 0.54 + 0.04 * Math.sin(t * 1.5 + i), a.pos[2]], rot: [0, a.rot[1] - 0.25, 0], scale: 0.82 }, { pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1] });
      });
      st.render(ctx, G3.rig.orbit({ target: [0, 0.55, -0.3], yaw: 0, pitch: 0.12, dist: 7.6, fov: 34 }));
      withAlpha(ctx, 1 - out, () => {
        revealLine(ctx, '네 가지 색', W / 2, 190, rm(lt, 0.2, 0.8), { size: ts(6), weight: 800, color: P.ink, align: 'center' });
        const idx = Math.round(clamp(focus, 0, 3)), name = MONOBLOCK.NAMES[ORDER[idx]];
        text(ctx, name, W / 2, 900, { size: ts(4), weight: 700, color: idx === 3 ? P.accentInk : P.ink2, align: 'center' });
        for (let i = 0; i < 4; i++) { circle(ctx, W / 2 - 54 + i * 36, 960, i === idx ? 9 : 6); ctx.fillStyle = MONOBLOCK.FINISH[ORDER[i]]; ctx.fill(); }
      });
    },
  };
})();

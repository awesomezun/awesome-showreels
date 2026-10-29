// beat (3 bars, 30-s cut, night stage): the lights go down; the speaker pumps on every beat, rings of light leave
// its grille, and an arc of equaliser bars behind it jumps with the music. 2D: 작아도, / 크게.
(() => {
  const N = 28;
  SCENES['beat'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt, out = Ease.inC(env.phase.out);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('beat', s => {
        s.studio({ floor: 'solid', floorColor: P.bg2, floorRough: 0.6, key: { dir: [3, 9, 5], intensity: 0.9, soft: 8 }, rim: { color: 'accent', intensity: 3.2, dir: [-4, 2.5, -5] }, envIntensity: 0.25, fill: 0.25, fog: { near: 9, far: 22 } });
        s.add(MONOBLOCK.product('vermilion'), { name: 'spk', pos: [0, 0.66, 0.6] });
        const bars = G3.instanced(G3.geo.box(0.22, 1, 0.22, 0.04), G3.mat('neon', { color: 'accent', base: '#2A1A16' }), N); bars.name = 'bars'; s.add(bars);
        for (let i = 0; i < 4; i++) s.add(G3.mesh(G3.geo.torus(1, 0.012, 160), G3.mat('neon', { color: 'accent2' }), { shadow: false }), { name: 'ring' + i });
      });
      const pulse = beatPulse(env, 7), beat = lt / env.beatSec;
      const spk = st.get('spk');
      spk.scale.set(...G3.motion.squash(-0.05 * pulse).map(v => v * (1 + 0.03 * pulse)));
      spk.userData.parts.led.material.emissiveIntensity = 2 + 4 * pulse;
      const bars = st.get('bars');
      for (let i = 0; i < N; i++) {
        const a = G3.arrange.ring(i, N * 2, { r: 3.4, phase: Math.PI / 2 + Math.PI / (N * 2) });
        const hgt = 0.25 + 1.9 * Math.pow(hsh2(i, Math.floor(beat)) * 0.6 + 0.4 * Math.abs(Math.sin(i * 0.45 + beat * 1.3)), 1.4) * (0.35 + 0.65 * pulse);
        bars.set(i, { pos: [a.pos[0], hgt / 2, a.pos[2] - 1.2], rot: [0, 0, 0], scale: [1, hgt, 1] });
      }
      for (let i = 0; i < 4; i++) {
        const age = (beat - i) % 4 < 0 ? -1 : ((beat - i) % 4) * env.beatSec;   // one ring per beat, recycled every 4
        const ring = st.get('ring' + i), k = clamp(age / 1.4);
        ring.position.set(0, 0.66, 1.18 + k * 2.2); ring.scale.setScalar(0.35 + k * 2.4);
        ring.visible = age >= 0 && age < 1.4; ring.material.emissiveIntensity = 3 * (1 - k);
      }
      let rig = G3.rig.orbit({ target: [0, 0.8, 0.4], yaw: -0.25 + lt * 0.08, pitch: 0.16, dist: 7.2, fov: 36 });
      rig = G3.rig.shake(rig, lt, env.cues.filter(c => c.sfx === 'impact' || c.sfx === 'thud').map(c => c.lt), { amp: 0.08, decay: 8 });
      st.render(ctx, rig);
      env.fx.bloom = Math.max(env.fx.bloom || 0, (0.35 + 0.4 * pulse) * rm(lt, -0.05, 0.4));   // only once the stage shows (the compositor also draws it ahead of its transition)
      withAlpha(ctx, 1 - out, () => {
        kinetic(ctx, '작아도,', 150, 300, lt - 0.2, { size: ts(8), fam: 'display', color: P.ink });
        kinetic(ctx, '크게.', 150, 470, lt - 0.2 - 2 * env.beatSec, { size: ts(8), fam: 'display', color: P.accent });
      });
    },
  };
})();

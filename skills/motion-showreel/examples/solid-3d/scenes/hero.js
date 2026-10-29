// hero (2-3 bars): the speaker turns on a mirror floor while the key light sweeps across its aluminium; the camera
// pushes in on an arc. 2D: two lines on the left; a light glint per bar line in the hold.
(() => {
  SCENES['hero'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt, out = Ease.inC(env.phase.out);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('hero', s => {
        s.studio({ floor: 'mirror', reflect: 0.22, floorTint: '#9C9A96', key: { dir: [4, 7, 4], soft: 6, intensity: 2.6 }, rim: { color: '#FFFFFF', intensity: 2.4, dir: [-4, 3, -6] }, envIntensity: 0.9 });
        s.add(MONOBLOCK.product('graphite'), { name: 'spk', pos: [0, 0.65, 0] });
      });
      const spk = st.get('spk');
      const e = styleSpring(lt - 0.1);
      spk.position.set(0, 0.65 + (1 - e) * 1.2 + 0.03 * Math.sin(t * 1.3), 0);
      spk.rotation.set(0, lerp(-0.95, 0.32, Ease.ioC(rm(lt, 0, 3.2))) + 0.1 * Math.sin(Math.max(0, lt - 3.2) * 0.9), 0);   // turns to the front, then sways (any hold length)
      const led = spk.userData.parts.led; led.material.emissiveIntensity = 1.6 + 2.2 * beatPulse(env, 5);
      // the hero light sweep: the key light travels round the front once per two bars
      const a = -1.2 + (lt / (env.barSec * 2)) * Math.PI * 1.2;
      st.lights.key.position.set(Math.sin(a) * 6, 6.5, Math.cos(a) * 6);
      const rig = G3.rig.arc({ target: [0, 0.62, 0], p: Ease.ioC(rm(lt, 0, env.dur)), yaw0: 0.35, yaw1: 0.05, dist0: 7.4, dist1: 5.6, pitch0: 0.2, pitch1: 0.1, fov: 32 });
      rig.shift = [0.42, 0];
      st.render(ctx, rig, { alpha: 1 });
      withAlpha(ctx, 1 - out, () => {
        text(ctx, '모노블록', 150, 330, { size: ts(2), weight: 700, color: P.accentInk, ls: track(ts(2)) });
        revealLine(ctx, '알루미늄 한 덩어리,', 150, 440, rm(lt, 0.5, 1.2), { size: ts(6), weight: 800, color: P.ink });
        revealLine(ctx, '손바닥 위에.', 150, 546, rm(lt, 0.8, 1.5), { size: ts(6), weight: 800, color: P.ink });
        const k = rm(lt, 1.6, 2.2);
        if (k > 0) withAlpha(ctx, Ease.outC(k), () => { let x = 150; for (const c of ['이음새 없는 바디', '4가지 색', '12시간']) x += chip(ctx, x, 640, c, { size: 24, bg: P.surface, fg: P.ink2 }) + 14; });
      });
      onBars(env, 1, (i, dt) => { const g = 1 - clamp(dt / 0.6); if (g > 0) sparkle(ctx, 1210 + i * 60, 360, 26 * g, g, dt * 3, '#FFFFFF'); });
    },
  };
})();

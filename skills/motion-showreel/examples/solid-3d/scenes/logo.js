// logo (2 bars): the brand word in solid 3D flies in letter by letter from depth while the camera arcs in and focus
// pulls onto it; a vermilion clearcoat with a sage rim light. 2D: kicker and the fiction tag.
(() => {
  SCENES['logo'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt, out = Ease.inC(env.phase.out);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('logo', s => {
        s.studio({ floor: 'shadow', shadowOpacity: 0.22, key: { dir: [2.5, 8, 6], soft: 7 }, rim: { color: 'accent2', intensity: 1.8, dir: [-5, 3, -5] } });
        const word = G3.geo.text('모노블록', { size: 1.25, depth: 0.34, bevel: 0.03, letters: true });
        const m = G3.mat('clearcoat', { color: 'accent', metalness: 0.15, roughness: 0.35 });
        word.letters.forEach((l, i) => s.add(G3.mesh(l.geometry, m), { name: 'L' + i, pos: [l.offset[0], l.offset[1] + 0.78, l.offset[2]] }));
      });
      for (let i = 0; i < 4; i++) {
        const L = st.get('L' + i); if (!L) continue;
        const k = clamp((lt - 0.35 - 0.117 * i) / 0.8), e = G3.Ease3.outBack(k, 1.25);
        const lift = 0.05 * beatPulse(env, 6) * (env.phase.hold > 0 ? 1 : 0);
        G3.pose(L, { pos: [0, (1 - e) * 2.4 + lift, (1 - e) * 5], rot: [(1 - e) * -1.5, (1 - e) * (i - 1.5) * 0.3, 0], scale: lerp(0.4, 1, Ease.outC(k)) });
      }
      const p = Ease.ioC(rm(lt, 0, 3.4));
      const rig = G3.rig.arc({ target: [0, 0.7, 0], p, yaw0: -0.75, yaw1: 0.12, dist0: 10, dist1: 6.6, pitch0: 0.3, pitch1: 0.1, fov: 34 });
      const focus = lerp(10.5, 6.6, Ease.ioC(rm(lt, 0.9, 2.2)));
      st.render(ctx, G3.rig.handheld(rig, t, { amp: 0.008 }), { dof: { focus, aperture: 1.2, maxBlur: 12 }, alpha: 1 - out });
      withAlpha(ctx, 1 - out, () => {
        revealLine(ctx, '손바닥만 한 블루투스 스피커', W / 2, 250, rm(lt, 1.6, 2.3), { size: ts(4), weight: 600, color: P.ink2, align: 'center' });
        if (lt > 2.0) chip(ctx, W / 2, 930, '가상 제품 · 예제 영상', { size: 24, bg: P.surface, fg: P.muted, align: 'center' });
      });
    },
  };
})();

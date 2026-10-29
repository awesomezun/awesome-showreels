// end (2-3 bars): the speaker turns slowly on a soft shadow; the brand word, the line and three facts land on the
// left; the fiction label stays for the whole card.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt;
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('end', s => {
        s.studio({ floor: 'shadow', shadowOpacity: 0.24, key: { dir: [3, 8, 5], soft: 8 }, rim: { color: 'accent2', intensity: 1.4 } });
        s.add(MONOBLOCK.product('graphite'), { name: 'spk', pos: [0, 0.65, 0] });
      });
      const spk = st.get('spk'), e = styleSpring(lt - 0.15);
      spk.position.set(0, 0.65 + 0.025 * Math.sin(t * 1.2), 0);
      spk.rotation.set(0, -0.55 + 0.25 * Math.sin(lt * 0.5) + (1 - e) * 0.8, 0);
      spk.userData.parts.led.material.emissiveIntensity = 1.6 + 1.4 * beatPulse(env, 5);
      // a slow key-light sweep across the aluminium keeps the hold alive at any length
      const a = -0.9 + (lt / env.barSec) * 0.55;
      st.lights.key.position.set(Math.sin(a) * 6, 7.5, Math.cos(a) * 6);
      const rig = G3.rig.orbit({ target: [0, 0.6, 0], yaw: 0.15 + 0.05 * Math.sin(lt * 0.45), pitch: 0.14, dist: lerp(7.6, 6.6, Ease.ioC(rm(lt, 0, 2.5))) - 0.08 * Math.max(0, lt - 2.5), fov: 32 });
      rig.shift = [0.38, 0.02];
      st.render(ctx, rig, { dof: { focus: [0, 0.6, 0], aperture: 0.8, maxBlur: 6 } });
      kinetic(ctx, '모노블록', 150, 420, lt - 0.1, { size: ts(9), fam: 'display', color: P.ink });
      revealLine(ctx, '작아도, 크게.', 156, 520, rm(lt, 0.6, 1.2), { size: ts(5), weight: 700, color: P.accentInk });
      const k = rm(lt, 1.0, 1.6);
      if (k > 0) withAlpha(ctx, Ease.outC(k), () => { let x = 156; for (const c of ['40 mm 드라이버', '12시간', '4가지 색']) x += chip(ctx, x, 600, c, { size: 24, bg: P.surface, fg: P.ink2 }) + 14; });
      text(ctx, '가상 제품입니다 · 이 영상은 motion-showreel 3D 예제입니다', 156, 960, { size: ts(1), weight: 500, color: P.muted });
    },
  };
})();

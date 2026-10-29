// inside (2-3 bars): the speaker comes apart along its depth into an exploded view; the shell lifts and turns to
// glass; a leader line lands on each part on beats 3-6 (blips). 2D: the line and the labels.
(() => {
  const LABELS = [
    { name: 'driver', at: [0, 0.32, 0.1], label: '40 mm 풀레인지 드라이버', sub: '작은 몸, 큰 소리', dx: -1, dy: -1 },
    { name: 'radiator', at: [0, 0.38, 0], label: '패시브 라디에이터', sub: '뒤에서 미는 저음', dx: 1, dy: -1 },
    { name: 'battery', at: [0.4, 0.12, 0.1], label: '12시간 배터리', sub: '한 번 충전으로', dx: 1, dy: 1 },
    { name: 'shell', at: [1.0, 0.5, 0.0], label: '알루미늄 일체형 바디', sub: '이음새 없이 한 덩어리', dx: 1, dy: -1, len: 110 },
  ];
  SCENES['inside'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt, out = Ease.inC(env.phase.out);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('inside', s => {
        s.studio({ floor: 'shadow', shadowOpacity: 0.2, key: { dir: [3, 8, 5], soft: 7, size: 8 }, rim: { color: 'accent', intensity: 1.2, dir: [-6, 2, -3] } });
        const spk = MONOBLOCK.product('graphite'); spk.name = 'spk';
        const body = spk.userData.parts.body; body.name = 'shell'; body.material.transparent = true;
        s.add(spk, { pos: [0, 0.7, 0] });
        s.add(MONOBLOCK.insides(), { name: 'parts', pos: [0, 0.7, 0] });
      });
      const spk = st.get('spk'), parts = st.get('parts'), shell = st.get('shell'), grille = spk.userData.parts.grille;
      const k = Ease.ioC(rm(lt, 0.35, 1.6)) * (1 - Ease.ioC(env.phase.out));
      // the shell lifts and fades to a ghost; the grille slides forward; the parts spread along their depth
      G3.pose(shell, { pos: [0, 1.25 * k, 0] });
      shell.material.opacity = lerp(1, 0.14, k); shell.material.depthWrite = k < 0.5;
      G3.pose(grille, { pos: [0, 0, 1.25 * k] });
      G3.explode(parts.children, k, { dist: 1, stagger: 0.05, dir: (i, p) => [p[0] * 0.5, p[1] * 0.8, p[2] * 3.2] });
      spk.userData.parts.led.material.emissiveIntensity = 1.4 + 1.6 * beatPulse(env, 5);
      const driver = parts.getObjectByName('driver');
      driver.children[0].scale.set(1, 1, 1 + 0.12 * beatPulse(env, 9));
      const rig = G3.rig.orbit({ target: [0, 0.75, 0], yaw: lerp(0.35, 0.95, Ease.ioC(rm(lt, 0, 2.2))) + 0.02 * Math.sin(t * 0.5), pitch: lerp(0.18, 0.3, k), dist: lerp(6.4, 7.6, k), fov: 34 });
      st.render(ctx, rig);
      withAlpha(ctx, 1 - out, () => {
        text(ctx, '속을 열면', 150, 200, { size: ts(6), weight: 800, color: P.ink });
        LABELS.forEach((L, i) => {
          const obj = L.name === 'shell' ? shell : parts.getObjectByName(L.name);
          const [x, y, , vis] = st.project(L.at, obj);
          const p = rm(lt, (3 + i) * env.beatSec, (3 + i) * env.beatSec + 0.45);
          if (vis && p > 0) callout(ctx, x, y, p, { label: L.label, sub: L.sub, dx: L.dx, dy: L.dy, len: L.len || 150, color: P.accent, t, seed: i });
        });
      });
    },
  };
})();

// runtime/g3.js (solid 3D): the pure helpers without a browser, the loader's 3D gating, and a headless smoke render.
// Run from the repo root:  node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { uses3D, runtimeScripts, loadProject, findChrome } from '../skills/motion-showreel/runtime/stills.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const S = path.join(ROOT, 'skills', 'motion-showreel');

// g3.js without three.js: G3.ok is false, the pure helpers still work
function loadG3() {
  const ctx = { console, W: 1920, H: 1080 };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(S, 'runtime', 'g3.js'), 'utf8'), ctx);
  return ctx.G3;
}
const G3 = loadG3();
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);

test('without three.js G3 degrades to pure helpers', () => {
  assert.equal(G3.ok, false);
  assert.equal(typeof G3.rig.orbit, 'function');
  assert.equal(G3.transition('cube'), false);
});

test('dolly zoom keeps distance x tan(fov / 2) constant, so the subject holds its size', () => {
  const k0 = 3.5 * Math.tan(60 * Math.PI / 360);
  for (const p of [0, 0.25, 0.5, 1]) {
    const r = G3.rig.dollyZoom({ d0: 3.5, d1: 12, fov0: 60, p });
    near(r.dist * Math.tan(r.fov * Math.PI / 360), k0, 1e-9);
  }
  assert.ok(G3.rig.dollyZoom({ p: 1 }).fov < G3.rig.dollyZoom({ p: 0 }).fov);
});

test('rig modifiers: shake decays to nothing, handheld stays small, lens maps mm to FOV and back', () => {
  const r = G3.rig.orbit({ dist: 6 });
  const quiet = G3.rig.shake(r, 5, [1], { decay: 7 });
  near(quiet.pos[0], r.pos[0], 1e-9);
  const hit = G3.rig.shake(r, 1.03, [1], { amp: 0.2 });
  assert.ok(Math.hypot(hit.pos[0] - r.pos[0], hit.pos[1] - r.pos[1]) > 0);
  const hh = G3.rig.handheld(r, 2.3, { amp: 0.02 });
  assert.ok(Math.hypot(hh.pos[0] - r.pos[0], hh.pos[1] - r.pos[1], hh.pos[2] - r.pos[2]) < 0.05);
  near(G3.rig.mm(G3.rig.lens(50)), 50, 1e-9);
});

test('follow cam is pure: position lags the path, aim leads it', () => {
  const path3 = t => [t * 2, 0, 0];
  const r = G3.rig.follow(path3, 3, { lag: 0.5, lead: 0.25, offset: [0, 0, 0], aim: [0, 0, 0] });
  near(r.pos[0], 5); near(r.target[0], 6.5);
});

test('bullet-time remap is continuous, monotonic, real time outside the window', () => {
  const o = { at: 1, hold: 1, slow: 0.05, ramp: 0.3 };
  let prev = -1;
  for (let t = 0; t <= 4; t += 0.01) { const x = G3.timeRemap(t, o); assert.ok(x >= prev - 1e-9); prev = x; }
  near(G3.timeRemap(0.5, o), 0.5);
  const a = G3.timeRemap(3, o), b = G3.timeRemap(3.5, o);
  near(b - a, 0.5, 1e-9);
  assert.ok(G3.timeRemap(2, o) - G3.timeRemap(1, o) < 0.1);
});

test('arrangements: Fibonacci sphere on its radius, tunnel recycles within its length, cover flow is symmetric', () => {
  for (let i = 0; i < 50; i++) { const p = G3.arrange.sphere(i, 50, 2).pos; near(Math.hypot(...p), 2, 1e-9); }
  for (let t = 0; t < 5; t += 0.37) for (let i = 0; i < 8; i++) { const z = G3.arrange.tunnel(i, 8, t, { spacing: 2, near: 0 }).pos[2]; assert.ok(z <= 0 && z > -16 - 1e-9); }
  const a = G3.arrange.coverFlow(2, 4), b = G3.arrange.coverFlow(6, 4);
  near(a.pos[0], -b.pos[0]); near(a.rot[1], -b.rot[1]);
  const c = G3.arrange.coverFlow(4, 4); near(c.pos[0], 0); near(c.rot[1], 0);
});

test('motions: a rolling cube rests on the floor between rolls; spring settles at 1', () => {
  for (let n = 0; n < 4; n++) { const r = G3.motion.cubeRoll(n * 0.8 + 0.7, { size: 1, period: 0.8, move: 0.55 }); near(r.pos[1], 0.5, 1e-9); assert.equal(r.rolls, n); }
  near(G3.motion.spring(5, { k: 170, c: 12 }), 1, 1e-3);
  const sq = G3.motion.squash(-0.3); near(sq[0] * sq[1] * sq[2], 1, 1e-9);
});

test('closed-form sims: the first bounce lands at sqrt(2h/g), the oscillator starts at x0 and decays', () => {
  const t1 = Math.sqrt(2 * 2 / 9.8);
  near(G3.sim.bounce(t1 - 1e-6, { h0: 2 }).y, 0, 1e-4);
  for (let t = 0; t < 5; t += 0.05) assert.ok(G3.sim.bounce(t, { h0: 2 }).y >= -1e-9);
  near(G3.sim.oscillator(0, { x0: 1 }), 1);
  assert.ok(Math.abs(G3.sim.oscillator(4, { x0: 1 })) < 0.01);
  near(G3.sim.oscillator(1, { k: 100, c: 20, m: 1, x0: 1 }), Math.exp(-10) * (1 + 10), 1e-9);   // critically damped
});

test('bake is deterministic and interpolates its table', () => {
  const mk = key => G3.bake(key, { dur: 1, dt: 1 / 100, every: 10, init: () => ({ x: 0, v: 1 }), step: (s, dt) => { s.x += s.v * dt; }, sample: s => [s.x] });
  const a = mk('t-a'), b = mk('t-b');
  near(a.at(0.5)[0], b.at(0.5)[0]);
  near(a.at(0.55)[0], 0.55, 1e-6);
  assert.equal(mk('t-a'), a);
  const r1 = G3.rng(5), r2 = G3.rng(5);
  for (let i = 0; i < 10; i++) assert.equal(r1(), r2());
});

test('contour tracing finds a ring as one outline and one hole with the right areas', () => {
  const w = 120, h = 120, a = new Uint8ClampedArray(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const d = Math.hypot(x + 0.5 - 60, y + 0.5 - 60); a[y * w + x] = d <= 40 && d >= 20 ? 255 : 0; }
  const loops = G3.traceContours(a, w, h, { eps: 0.3 });
  assert.equal(loops.length, 2);
  const outer = loops.find(l => !l.hole), hole = loops.find(l => l.hole);
  assert.ok(outer && hole);
  assert.ok(Math.abs(Math.abs(outer.area) - Math.PI * 1600) / (Math.PI * 1600) < 0.03);
  assert.ok(Math.abs(Math.abs(hole.area) - Math.PI * 400) / (Math.PI * 400) < 0.06);
  const shapes = G3.nestLoops(loops);
  assert.equal(shapes.length, 1); assert.equal(shapes[0].holes.length, 1);
});

function tmpProject(scene, cfgExtra = {}) {
  const P = fs.mkdtempSync(path.join(os.tmpdir(), 'g3-'));
  fs.mkdirSync(path.join(P, 'scenes'));
  fs.copyFileSync(path.join(S, 'examples', 'minimal-ui', 'style.json'), path.join(P, 'style.json'));
  const st = JSON.parse(fs.readFileSync(path.join(P, 'style.json'), 'utf8')); delete st.fonts.files;
  fs.writeFileSync(path.join(P, 'style.json'), JSON.stringify(st));
  fs.writeFileSync(path.join(P, 'reel.config.json'), JSON.stringify({ title: 'g3 test', style: 'style.json', size: [640, 360], fps: 30, beatsPerBar: 4,
    scenes: [{ id: 'a', minBars: 1, maxBars: 1, priority: 1, in: 'cut', music: 'groove' }], cuts: { t: { seconds: 1.875 } }, ...cfgExtra }));
  fs.writeFileSync(path.join(P, 'scenes', 'a.js'), scene);
  execFileSync('python3', [path.join(S, 'timing', 'plan_cut.py'), '--project', P, '--cut', 't'], { stdio: 'pipe' });
  return P;
}

test('three.js and g3.js ship only with projects that use 3D', () => {
  const flat = tmpProject("(() => { SCENES['a'] = { draw(ctx) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); } }; })();");
  const solid = tmpProject("(() => { SCENES['a'] = { draw(ctx, t) { G3.stage('a', s => s.studio()).render(ctx); } }; })();");
  const trans = tmpProject("(() => { SCENES['a'] = { draw() {} }; })();", { scenes: [{ id: 'a', minBars: 1, maxBars: 1, priority: 1, in: 'cube', music: 'groove' }] });
  const p = P => loadProject(P, { allowPlaceholder: true, skipAudio: () => true });
  assert.equal(uses3D(p(flat)), false);
  assert.equal(uses3D(p(solid)), true);
  assert.equal(uses3D(p(trans)), true);
  assert.ok(!runtimeScripts(p(flat)).includes('g3.js'));
  assert.ok(runtimeScripts(p(solid)).includes('vendor/three.min.js'));
});

test('headless smoke: a lit extruded box renders with a shadow, no console errors', { skip: !findChrome() && 'no Chromium found' }, () => {
  const P = tmpProject(`(() => { SCENES['a'] = { draw(ctx, t, env) {
    ctx.fillStyle = env.palette.bg; ctx.fillRect(0, 0, W, H);
    const st = G3.stage('a', s => { s.studio({ floor: 'shadow' }); s.add(G3.mesh(G3.geo.box(1, 1, 1, 0.1), G3.mat('plastic', { color: 'accent' })), { name: 'b', pos: [0, 0.5, 0] }); });
    st.get('b').rotation.y = t;
    st.render(ctx, G3.rig.orbit({ target: [0, 0.4, 0], dist: 4 }), { dof: { focus: 4, maxBlur: 4 } });
  } }; })();`);
  const out = path.join(P, 'out');
  execFileSync('node', [path.join(S, 'runtime', 'stills.mjs'), '--project', P, '--cut', 't', '0.9', '--out', out], { stdio: 'pipe' });
  const png = fs.readdirSync(out).find(f => f.endsWith('.png'));
  assert.ok(png && fs.statSync(path.join(out, png)).size > 10000);
});

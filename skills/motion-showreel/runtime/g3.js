'use strict';
// g3.js (optional module): solid 3D for scenes, on three.js (runtime/vendor/three.min.js, MIT).
// Lit meshes with physical materials, soft shadows, image-based light, fog and depth of field; camera rigs (orbit,
// dolly zoom, crane, arc, fly-through, follow, handheld, impact shake); arrangements, motions, deformers, extruded
// text and SVG, captures as 3D cards, instancing, soft points, deterministic baked simulations, and the 3D
// transitions the compositor uses (cube, flip, flipBoard, fold, depthPush, shatter).
// Loaded only when a project's scenes or modules mention G3 or THREE, or reel.config uses a 3D transition.
//
// Scenes stay pure in (t, env): a stage is built once per page, then every frame sets each animated property from t
// (never accumulate) and renders into the scene's 2D context:
//   const st = G3.stage('hero', s => { s.studio({ floor: 'shadow' }); s.add(G3.mesh(G3.geo.box(1, 1, 1, 0.08), G3.mat('plastic', { color: 'accent' })), { name: 'box' }); });
//   st.get('box').rotation.y = t * 0.6;
//   st.render(ctx, G3.rig.orbit({ yaw: 0.4, dist: 5 }));
// Without WebGL2 (or without three.js) G3.ok is false: render() draws nothing and warns once; the pure helpers
// (rigs, arrangements, motions, sims, contours) keep working.
const G3 = (() => {
  const T = (typeof window !== 'undefined' && window.THREE) || null;
  const TAU3 = Math.PI * 2;
  const _clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const _lerp = (a, b, k) => a + (b - a) * k;
  const _rm = (t, a, b) => _clamp((t - a) / (b - a));
  const _h = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const _sm = q => q * q * (3 - 2 * q);
  const V = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    scale: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    lerp: (a, b, k) => [_lerp(a[0], b[0], k), _lerp(a[1], b[1], k), _lerp(a[2], b[2], k)],
    len: a => Math.hypot(a[0], a[1], a[2]),
    norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  };
  // smooth value noise in [-1, 1], continuous in t (seeded); used by handheld and shake
  function noise1(t, seed = 1) {
    const f = Math.floor(t), k = t - f;
    return _lerp(_h(seed * 91.7 + f) * 2 - 1, _h(seed * 91.7 + f + 1) * 2 - 1, _sm(k));
  }
  const fovOfMM = mm => 2 * Math.atan(12 / mm) * 180 / Math.PI;    // full-frame 35 mm vertical FOV

  // ───────── camera rigs (pure: {pos, target, fov (deg), roll (rad), up?, ortho?, shift?}) ─────────
  const orbitPos = (target, yaw, pitch, dist) => [target[0] + dist * Math.sin(yaw) * Math.cos(pitch),
    target[1] + dist * Math.sin(pitch), target[2] + dist * Math.cos(yaw) * Math.cos(pitch)];
  const curveCache = new Map();
  function curveOf(points, closed = false, tension = 0.5) {
    const key = JSON.stringify([points, closed, tension]);
    let c = curveCache.get(key);
    if (!c && T) { c = new T.CatmullRomCurve3(points.map(p => new T.Vector3(p[0], p[1], p[2])), closed, 'catmullrom', tension); curveCache.set(key, c); }
    return c;
  }
  // Catmull-Rom without three.js (tests, fallback): uniform parameter over control points
  function crPoint(points, u, closed = false) {
    const n = points.length, segs = closed ? n : n - 1;
    const x = _clamp(u) * segs, i = Math.min(Math.floor(x), segs - 1), k = x - i;
    const P = j => points[closed ? ((j % n) + n) % n : Math.max(0, Math.min(n - 1, j))];
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    return [0, 1, 2].map(a => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * k + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * k * k + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * k * k * k));
  }
  function pathAt(points, u, o = {}) {
    const c = curveOf(points, !!o.closed, o.tension ?? 0.5);
    if (c) { const p = c.getPointAt(o.closed ? ((u % 1) + 1) % 1 : _clamp(u)); return [p.x, p.y, p.z]; }
    return crPoint(points, o.closed ? ((u % 1) + 1) % 1 : u, !!o.closed);
  }
  const rig = {
    // circle the target at a constant distance, always looking at it
    orbit(o = {}) {
      const target = o.target || [0, 0, 0];
      return { pos: orbitPos(target, o.yaw || 0, o.pitch ?? 0.22, o.dist ?? 6), target, fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // move the camera itself from -> to (the lens stays: foreground and background shift against each other)
    dolly(o = {}) {
      const k = o.p ?? 0, target = o.target || [0, 0, 0];
      return { pos: V.lerp(o.from || [0, 1, 8], o.to || [0, 1, 3], k), target, fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // vertigo: distance d0 -> d1 while the FOV keeps d * tan(fov / 2) constant, so the subject holds its size
    dollyZoom(o = {}) {
      const target = o.target || [0, 0, 0], dir = V.norm(o.dir || [0, 0.08, 1]), d0 = o.d0 ?? 3.5, d1 = o.d1 ?? 12;
      const fov0 = o.fov0 ?? 60, k = d0 * Math.tan(fov0 * Math.PI / 360), d = _lerp(d0, d1, o.p ?? 0);
      return { pos: V.add(target, V.scale(dir, d)), target, fov: 2 * Math.atan(k / d) * 180 / Math.PI, roll: o.roll || 0, dist: d };
    },
    // lateral slide, facing straight ahead (a lineup passes by; near layers race, far layers drift)
    truck(o = {}) {
      const x = _lerp(o.x0 ?? -3, o.x1 ?? 3, o.p ?? 0), y = o.height ?? 1.2, z = o.dist ?? 6, look = o.look ?? 0;
      return { pos: [x, y, z], target: [x + look, o.targetY ?? y * 0.85, 0], fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // camera stays, only rotates: pan = yaw, tilt = pitch
    panTilt(o = {}) {
      const pos = o.pos || [0, 1.5, 6], yaw = o.yaw || 0, pitch = o.pitch || 0;
      const dir = [-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
      return { pos, target: V.add(pos, dir), fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // boom up from low to high while tilting down onto the target
    crane(o = {}) {
      const target = o.target || [0, 0, 0], k = o.p ?? 0;
      const h = _lerp(o.h0 ?? 0.4, o.h1 ?? 7, k), d = _lerp(o.dist0 ?? o.dist ?? 7, o.dist1 ?? o.dist ?? 5, k);
      return { pos: [target[0] + Math.sin(o.yaw || 0) * d, target[1] + h, target[2] + Math.cos(o.yaw || 0) * d], target, fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // half circle around the subject while closing in and dropping lower (hero push-in)
    arc(o = {}) {
      const target = o.target || [0, 0, 0], k = o.p ?? 0;
      return { pos: orbitPos(target, _lerp(o.yaw0 ?? -1.6, o.yaw1 ?? 0.2, k), _lerp(o.pitch0 ?? 0.35, o.pitch1 ?? 0.05, k), _lerp(o.dist0 ?? 9, o.dist1 ?? 4.2, k)),
        target, fov: o.fov ?? 35, roll: o.roll || 0 };
    },
    // along a smooth spline through points, looking ahead (thread rings, pass through buildings)
    flythrough(points, u, o = {}) {
      const pos = pathAt(points, u, o), ahead = pathAt(points, o.closed ? u + (o.lookAhead ?? 0.03) : Math.min(1, u + (o.lookAhead ?? 0.03)), o);
      const target = V.len(V.sub(ahead, pos)) < 1e-6 ? V.add(pos, V.norm(V.sub(pos, pathAt(points, Math.max(0, u - 0.01), o)))) : ahead;
      return { pos, target, fov: o.fov ?? 50, roll: o.roll || 0 };
    },
    // trail a moving target: aim slightly ahead, position lags behind (pure: both read the path at shifted times)
    follow(pathFn, t, o = {}) {
      const lag = o.lag ?? 0.35, lead = o.lead ?? 0.15, off = o.offset || [0, 2.2, 6];
      return { pos: V.add(pathFn(t - lag), off), target: V.add(pathFn(t + lead), o.aim || [0, 0.4, 0]), fov: o.fov ?? 40, roll: o.roll || 0 };
    },
    // straight down, following a target like a drone over a map
    topDown(o = {}) {
      const target = o.target || [0, 0, 0], yaw = o.yaw || 0, h = o.height ?? 12;
      return { pos: [target[0] + 0.001, target[1] + h, target[2] + 0.001], target, up: [Math.sin(yaw), 0, -Math.cos(yaw)], fov: o.fov ?? 35, roll: 0 };
    },
    // low and looking up: the subject towers and reads as big and strong
    lowAngle(o = {}) {
      const target = o.target || [0, 1.2, 0], d = o.dist ?? 4.5, yaw = o.yaw ?? 0.25;
      return { pos: [target[0] + Math.sin(yaw) * d, o.height ?? 0.25, target[2] + Math.cos(yaw) * d], target, fov: o.fov ?? 42, roll: o.roll || 0 };
    },
    // first-person walk: forward at eye height, a vertical bob per step and a side-to-side weight shift
    povWalk(t, o = {}) {
      const start = o.start || [0, 0, 8], dir = V.norm(o.dir || [0, 0, -1]), speed = o.speed ?? 1.3, hz = o.stepHz ?? 1.8, eye = o.height ?? 1.6;
      const side = V.norm(V.cross(dir, [0, 1, 0])), ph = t * hz * Math.PI;
      const base = V.add(start, V.scale(dir, t * speed));
      // bob once per step (|sin|), weight shifts left-right once per two steps (sin)
      const pos = V.add(V.add(base, [0, eye + (o.bob ?? 0.035) * Math.abs(Math.sin(ph)), 0]), V.scale(side, (o.sway ?? 0.025) * Math.sin(ph)));
      return { pos, target: V.add(pos, V.add(dir, [0, -(o.lookDown ?? 0.04), 0])), fov: o.fov ?? 60, roll: (o.roll ?? 0.006) * Math.sin(ph) };
    },
    // snap from one subject to another in an instant (pair with motionBlur in reel.config)
    whip(p, o = {}) {
      const pos = o.pos || [0, 1.5, 6], k = Ease3.ioExpo(_clamp(p));
      return rig.panTilt({ pos, yaw: _lerp(o.yaw0 ?? 0, o.yaw1 ?? 1.4, k), pitch: _lerp(o.pitch0 ?? 0, o.pitch1 ?? 0, k), fov: o.fov ?? 35 });
    },
    // focal length (mm, full frame) to vertical FOV, and back
    lens: fovOfMM,
    mm: fov => 12 / Math.tan(fov * Math.PI / 360),
    // same subject size at any focal length: the distance that keeps an object of height h filling share of frame
    distForFov(h, fov, share = 0.6) { return h / share / 2 / Math.tan(fov * Math.PI / 360); },

    // ── modifiers (return a new rig) ──
    crashZoom(r, p, o = {}) { return { ...r, fov: _lerp(o.fov0 ?? r.fov, o.fov1 ?? r.fov / 3, Ease3.outExpo(_clamp(p))) }; },
    dutch(r, roll) { return { ...r, roll: (r.roll || 0) + roll }; },
    // widen the FOV with speed or a boost (0..1) and ease back
    dynamicFov(r, boost, add = 16) { return { ...r, fov: r.fov + add * _clamp(boost) }; },
    // subtle hand-held drift on position, aim and roll (tripod vs hand: small, slow, continuous)
    handheld(r, t, o = {}) {
      const a = o.amp ?? 0.025, f = o.freq ?? 0.7, s = o.seed ?? 3;
      const d = [noise1(t * f, s) * a, noise1(t * f, s + 1) * a * 0.7, noise1(t * f, s + 2) * a * 0.4];
      const g = [noise1(t * f * 1.3, s + 5) * a * 0.5, noise1(t * f * 1.3, s + 6) * a * 0.4, 0];
      return { ...r, pos: V.add(r.pos, d), target: V.add(r.target, g), roll: (r.roll || 0) + noise1(t * f * 0.8, s + 9) * (o.roll ?? 0.006) };
    },
    // impact shake: three dials, amplitude (how big), frequency (how fast), decay (how quickly it dies); hits = times
    shake(r, t, hits, o = {}) {
      const amp = o.amp ?? 0.18, freq = o.freq ?? 22, decay = o.decay ?? 7, rot = o.rot ?? 0.03;
      let e = 0, sx = 0, sy = 0, sr = 0;
      for (const h of [].concat(hits || [])) {
        const at = typeof h === 'number' ? h : h.t, k = typeof h === 'number' ? 1 : (h.k ?? 1), dt = t - at;
        if (dt < 0 || dt > 3) continue;
        const env = k * Math.exp(-decay * dt);
        e += env; sx += noise1(dt * freq, at * 7 + 1) * env; sy += noise1(dt * freq, at * 7 + 2) * env; sr += noise1(dt * freq, at * 7 + 3) * env;
      }
      if (!e) return r;
      const right = V.norm(V.cross(V.sub(r.target, r.pos), [0, 1, 0])), off = V.add(V.scale(right, sx * amp), [0, sy * amp, 0]);
      return { ...r, pos: V.add(r.pos, off), target: V.add(r.target, V.scale(off, 0.5)), roll: (r.roll || 0) + sr * rot };
    },
    // blend two rigs (a continuous camera hand-off between shots)
    blend(a, b, k) {
      return { ...b, pos: V.lerp(a.pos, b.pos, k), target: V.lerp(a.target, b.target, k), fov: _lerp(a.fov, b.fov, k), roll: _lerp(a.roll || 0, b.roll || 0, k) };
    },
  };
  // Ease copies that do not depend on engine.js (tests load this file alone)
  const Ease3 = {
    ioC: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outC: t => 1 - Math.pow(1 - t, 3),
    outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    ioExpo: t => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
    outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  };
  // bullet time: action time slows to `slow` x around `at` (ramping over `ramp` s on each side of a `hold` window);
  // the camera keeps real time. Monotonic and continuous.
  function timeRemap(t, o = {}) {
    const at = o.at ?? 1, hold = o.hold ?? 1.5, slow = o.slow ?? 0.04, ramp = o.ramp ?? 0.3;
    const a = at - ramp, b = at, c = at + hold, d = c + ramp;
    const rate = x => (x < a ? 1 : x < b ? _lerp(1, slow, _sm((x - a) / ramp)) : x < c ? slow : x < d ? _lerp(slow, 1, _sm((x - c) / ramp)) : 1);
    // integral of rate from 0 to t (piecewise; smoothstep integrates to the mean on each ramp)
    const seg = (x0, x1) => {
      const N = 24; let s = 0;
      for (let i = 0; i < N; i++) s += rate(x0 + (i + 0.5) * (x1 - x0) / N);
      return s * (x1 - x0) / N;
    };
    if (t <= a) return t;
    let s = a;
    s += seg(a, Math.min(t, b)); if (t <= b) return s;
    s += (Math.min(t, c) - b) * slow; if (t <= c) return s;
    s += seg(c, Math.min(t, d)); if (t <= d) return s;
    return s + (t - d);
  }

  // ───────── arrangements (pure: {pos, rot}) ─────────
  const GOLD = Math.PI * (3 - Math.sqrt(5));
  const arrange = {
    grid(i, cols, o = {}) {
      const rows = o.rows ?? cols, gap = o.gap ?? 1, x = i % cols, y = Math.floor(i / cols);
      const cx = (x - (cols - 1) / 2) * gap, cy = (y - (rows - 1) / 2) * (o.gapY ?? gap);
      return { pos: o.plane === 'xy' ? [cx, -cy, 0] : [cx, 0, cy], rot: [0, 0, 0], col: x, row: y };
    },
    // ripple height on a grid from the centre (or from `at`): amp * sin(k * dist - speed * t) with falloff
    gridWave(i, cols, t, o = {}) {
      const g = arrange.grid(i, cols, o), c = o.at || [0, 0], d = Math.hypot(g.pos[0] - c[0], g.pos[2] - c[1]);
      const y = (o.amp ?? 0.35) * Math.sin(d * (o.freq ?? 1.6) - t * (o.speed ?? 4)) * Math.exp(-d * (o.falloff ?? 0.08));
      return { ...g, pos: [g.pos[0], y, g.pos[2]], d };
    },
    ring(i, n, o = {}) {
      const a = (i / n) * TAU3 + (o.phase || 0), r = o.r ?? 3;
      const face = o.face || 'out';
      return { pos: [Math.sin(a) * r, o.y || 0, Math.cos(a) * r], rot: [0, face === 'out' ? a : face === 'in' ? a + Math.PI : 0, 0], a };
    },
    // carousel: n items on a ring stepping one slot per `step` seconds with an eased settle; front item index
    carousel(i, n, t, o = {}) {
      const step = o.step ?? 1.2, move = o.move ?? 0.55, k = Math.floor(t / step), f = _clamp((t - k * step) / move);
      const slot = k + Ease3.outBack(f, o.overshoot ?? 1.2);
      return { ...arrange.ring(i, n, { ...o, phase: -(slot / n) * TAU3 }), front: ((Math.round(slot) % n) + n) % n };
    },
    helix(i, n, o = {}) {
      const u = n > 1 ? i / (n - 1) : 0, a = u * (o.turns ?? 2) * TAU3 + (o.phase || 0), r = o.r ?? 2;
      return { pos: [Math.sin(a) * r, (u - 0.5) * (o.height ?? 6), Math.cos(a) * r], rot: [0, a, 0], u };
    },
    // Fibonacci sphere: golden-angle steps with even height slices, almost uniform
    sphere(i, n, r = 2) {
      const y = 1 - ((i + 0.5) / n) * 2, rr = Math.sqrt(1 - y * y), a = i * GOLD;
      return { pos: [Math.cos(a) * rr * r, y * r, Math.sin(a) * rr * r], rot: [0, -a, Math.asin(y)] };
    },
    // infinite tunnel: identical rings evenly spaced, the front one recycled to the back after one spacing
    tunnel(i, n, t, o = {}) {
      const sp = o.spacing ?? 2, L = n * sp, z = ((((i * sp + t * (o.speed ?? 4)) % L) + L) % L) - L + (o.near ?? 2);
      return { pos: [0, 0, z], rot: [0, 0, (o.twist || 0) * z], fade: _clamp(1 - (-z) / L) };
    },
    // Cover Flow: focus = fractional index in front; neighbours angled away and pushed back on both sides
    coverFlow(i, focus, o = {}) {
      // first neighbour sits `side` card widths out, the rest are packed `gap` apart behind it
      const d = i - focus, s = Math.sign(d), a = Math.min(1, Math.abs(d));
      const x = s * ((o.side ?? 0.8) * a + Math.max(0, Math.abs(d) - 1) * (o.gap ?? 0.32));
      return { pos: [x * (o.w ?? 1.6), 0, -(o.push ?? 0.9) * a], rot: [0, -s * a * (o.angle ?? 1.05), 0], d };
    },
    // breathing stack: each layer twists a little more; gaps open and close
    stack(i, n, o = {}) {
      const h = o.h ?? 0.18, gap = o.gap ?? 0;
      return { pos: [0, i * (h + gap), 0], rot: [0, i * (o.twist ?? 0.08), 0] };
    },
    // per-index start time for staggered arrivals: from 'start' | 'end' | 'center' | 'random'
    delay(i, n, o = {}) {
      const step = o.step ?? 0.06, from = o.from || 'start';
      const r = from === 'end' ? n - 1 - i : from === 'center' ? Math.abs(i - (n - 1) / 2) : from === 'random' ? _h(i * 13.1 + (o.seed || 0)) * (n - 1) : i;
      return r * step;
    },
    // radial burst: home slot on a ring at radius r, pushed out to r * (1 + out) and spun once
    burst(i, n, k, o = {}) {
      const a = (i / n) * TAU3, r = (o.r ?? 2) * (1 + (o.out ?? 1.2) * Math.sin(Math.PI * _clamp(k)));
      return { pos: [Math.sin(a) * r, (o.lift ?? 0.4) * Math.sin(Math.PI * _clamp(k)), Math.cos(a) * r], rot: [0, a + TAU3 * Ease3.ioC(_clamp(k)), 0] };
    },
    // kaleidoscope: mirror and rotate a point in a wedge into `sectors` copies -> list of [x, y]
    kaleido(x, y, sectors = 12) {
      const out = [], a0 = Math.atan2(y, x), r = Math.hypot(x, y);
      for (let s = 0; s < sectors; s++) { const a = (s % 2 ? -a0 : a0) + Math.floor(s / 2) * (TAU3 * 2 / sectors); out.push([Math.cos(a) * r, Math.sin(a) * r]); }
      return out;
    },
  };

  // ───────── motions (pure) ─────────
  const motion = {
    // floating idle: slow bob and sway, a tiny breathing rotation
    float(t, o = {}) {
      const s = o.seed ?? 0, a = o.amp ?? 0.12;
      return { pos: [0, a * Math.sin(t * 1.1 + s), 0], rot: [(o.rot ?? 0.06) * Math.sin(t * 0.8 + s * 2), (o.rot ?? 0.06) * Math.sin(t * 0.5 + s), (o.rot ?? 0.06) * 0.6 * Math.sin(t * 0.9 + s * 3)] };
    },
    turntable(t, speed = 0.45) { return { rot: [0, t * speed, 0] }; },
    // card flip around y with an arc lift toward the camera and a small overshoot at the end
    flip(p, o = {}) {
      const k = Ease3.outBack(_clamp(p), o.overshoot ?? 0.9);
      return { rot: o.axis === 'x' ? [k * Math.PI, 0, 0] : [0, k * Math.PI, 0], pos: [0, 0, (o.lift ?? 0.5) * Math.sin(Math.PI * _clamp(p))] };
    },
    // damped harmonic spring 0 -> 1 from stiffness k, damping c, mass m (closed form; under-, critically or over-damped)
    spring(t, o = {}) { return 1 - sim.oscillator(t, { k: o.k ?? 170, c: o.c ?? 12, m: o.m ?? 1, x0: 1, v0: 0 }); },
    // decaying wobble around a rest pose (jelly, impact settle): amp * sin(2 pi f t) * exp(-d t)
    wobble(t, o = {}) { return t <= 0 ? 0 : (o.amp ?? 0.25) * Math.sin(TAU3 * (o.f ?? 3) * t) * Math.exp(-(o.d ?? 5) * t); },
    // volume-preserving squash/stretch along y: s > 0 stretches, s < 0 squashes
    squash(s) { const y = 1 + s, xz = 1 / Math.sqrt(Math.max(0.05, y)); return [xz, y, xz]; },
    // rolling cube: tips over its leading bottom edge once per `period`, each roll eased; dir in the xz plane
    cubeRoll(t, o = {}) {
      const size = o.size ?? 1, per = o.period ?? 0.8, n = Math.floor(t / per), f = Ease3.ioC(_clamp((t - n * per) / (o.move ?? 0.55) ));
      const a = f * Math.PI / 2, h = size / 2, r = h * Math.SQRT2;
      // pivot on the leading bottom edge: centre traces a quarter circle of radius r starting at 135 degrees
      const x = (n + 0.5) * size + r * Math.cos(Math.PI * 3 / 4 - a) - size / 2, y = r * Math.sin(Math.PI * 3 / 4 - a);
      return { pos: [x + (o.x0 || 0), y, 0], rot: [0, 0, -(n * Math.PI / 2 + a)], rolls: n };
    },
    // follow-through: a secondary part lags the primary curve fn(t) and overshoots a little when it stops
    followThrough(fn, t, o = {}) { return _lerp(fn(t - (o.lag ?? 0.12)), fn(t - (o.lag ?? 0.12) * 2), o.drag ?? 0.35); },
    // parabolic throw from -> to with a height h at the middle (throw into depth, pop out)
    arc(from, to, p, h = 1) { const k = _clamp(p); const q = V.lerp(from, to, k); q[1] += 4 * h * k * (1 - k); return q; },
    // hinge: angle (rad) of a lid/door: anticipation dip, swing with overshoot, settle
    hinge(p, open = 1.9, o = {}) {
      const k = _clamp(p), ant = (o.anticipate ?? 0.08) * Math.sin(Math.PI * _clamp(k / 0.18));
      return k < 0.18 ? -ant : open * Ease3.outBack(_rm(k, 0.18, 1), o.overshoot ?? 1.1);
    },
  };

  // ───────── simulations (pure closed forms + a deterministic bake) ─────────
  const sim = {
    // damped harmonic oscillator x(t) for m x'' + c x' + k x = 0
    oscillator(t, o = {}) {
      const k = o.k ?? 170, c = o.c ?? 12, m = o.m ?? 1, x0 = o.x0 ?? 1, v0 = o.v0 ?? 0;
      if (t <= 0) return x0;
      const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
      if (z < 1) { const wd = w0 * Math.sqrt(1 - z * z); return Math.exp(-z * w0 * t) * (x0 * Math.cos(wd * t) + (v0 + z * w0 * x0) / wd * Math.sin(wd * t)); }
      if (z === 1) return Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
      const r1 = -w0 * (z - Math.sqrt(z * z - 1)), r2 = -w0 * (z + Math.sqrt(z * z - 1)), b = (v0 - r1 * x0) / (r2 - r1);
      return (x0 - b) * Math.exp(r1 * t) + b * Math.exp(r2 * t);
    },
    // ball dropped from h0 bouncing with restitution e (closed form, real gravity): {y, n (bounces), v}
    bounce(t, o = {}) {
      const g = o.g ?? 9.8, e = o.e ?? 0.62, h0 = o.h0 ?? 2;
      let T0 = Math.sqrt(2 * h0 / g);
      if (t < T0) return { y: h0 - 0.5 * g * t * t, n: 0, v: -g * t };
      let tt = t - T0, v = g * T0, n = 1;
      while (n < 40) {
        v *= e; const dur = 2 * v / g;
        if (dur < 1e-3) return { y: 0, n, v: 0 };
        if (tt < dur) return { y: v * tt - 0.5 * g * tt * tt, n, v: v - g * tt };
        tt -= dur; n++;
      }
      return { y: 0, n, v: 0 };
    },
    // damped pendulum angle (small-angle closed form)
    pendulum(t, o = {}) { const per = o.period ?? 1.6; return (o.amp ?? 0.5) * Math.cos(TAU3 * t / per + (o.phase || 0)) * Math.exp(-(o.damp ?? 0.15) * t); },
    // domino chain: tile i starts falling at i * delay, angle eases to `fall` with gravity-like acceleration
    domino(i, t, o = {}) { const lt = t - i * (o.delay ?? 0.11); return lt <= 0 ? 0 : (o.fall ?? 1.25) * Math.min(1, Math.pow(lt / (o.dur ?? 0.42), 2)); },
    ballistic(t, p0, v0, g = 9.8) { return [p0[0] + v0[0] * t, p0[1] + v0[1] * t - 0.5 * g * t * t, p0[2] + v0[2] * t]; },
  };
  // Deterministic baked simulation: run step(state, dt, i) from init() at a fixed dt up to dur, record sample(state)
  // (a Float32Array) every frame of the table, cache by key. at(t) interpolates. Pure: inputs decide the table.
  const bakes = new Map();
  function bake(key, o) {
    let b = bakes.get(key);
    if (b) return b;
    const dt = o.dt ?? 1 / 240, dur = o.dur ?? 4, every = o.every ?? 4;
    const state = o.init(), frames = [];
    const steps = Math.ceil(dur / dt);
    for (let i = 0; i <= steps; i++) {
      if (i % every === 0) frames.push(Float32Array.from(o.sample(state)));
      o.step(state, dt, i);
    }
    const fdt = dt * every;
    b = {
      frames, dt: fdt,
      at(t) {
        const x = _clamp(t / fdt, 0, frames.length - 1), i = Math.floor(x), k = x - i;
        const a = frames[i], c = frames[Math.min(i + 1, frames.length - 1)];
        if (!k) return a;
        const out = new Float32Array(a.length);
        for (let j = 0; j < a.length; j++) out[j] = a[j] + (c[j] - a[j]) * k;
        return out;
      },
    };
    bakes.set(key, b);
    return b;
  }
  // seeded PRNG for bakes and procedural layouts (never Math.random in scenes)
  function rng(seed = 1) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

  // ───────── contours: traced outlines of rasterized text or images (marching squares) ─────────
  // alpha: Uint8ClampedArray or array of 0..255 per pixel (w x h). Returns closed loops [[x, y], ...] in pixel space
  // with a flag `hole` (orientation-based), simplified to `eps` px.
  function traceContours(alpha, w, h, o = {}) {
    const thr = (o.threshold ?? 0.5) * 255, eps = o.eps ?? 0.4;
    const A = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : alpha[y * w + x]);
    const inside = (x, y) => A(x, y) >= thr;
    // edge ids: horizontal edge from (x, y) to (x + 1, y): 2 * (y * (w + 2) + x); vertical edge (x, y)-(x, y + 1): +1
    const W2 = w + 2, eid = (x, y, v) => 2 * ((y + 1) * W2 + (x + 1)) + v;
    const pt = (x, y, v) => {
      if (v === 0) { const a = A(x, y), b = A(x + 1, y); return [x + (a === b ? 0.5 : _clamp((thr - a) / (b - a))), y]; }
      const a = A(x, y), b = A(x, y + 1); return [x, y + (a === b ? 0.5 : _clamp((thr - a) / (b - a)))];
    };
    const next = new Map(), points = new Map();
    const edge = (x, y, side) => side === 'T' ? [x, y, 0] : side === 'B' ? [x, y + 1, 0] : side === 'L' ? [x, y, 1] : [x + 1, y, 1];
    function seg(x, y, s1, s2, cornerInside, cx, cy) {
      const e1 = edge(x, y, s1), e2 = edge(x, y, s2), p1 = pt(...e1), p2 = pt(...e2);
      // orient so the inside lies to the right of the direction (screen coordinates): cross(dir, c - p1) > 0
      const cr = (p2[0] - p1[0]) * (cy - p1[1]) - (p2[1] - p1[1]) * (cx - p1[0]);
      let a = e1, b = e2, pa = p1, pb = p2;
      if ((cr > 0) !== cornerInside) { a = e2; b = e1; pa = p2; pb = p1; }
      const ia = eid(...a), ib = eid(...b);
      next.set(ia, ib); points.set(ia, pa); points.set(ib, pb);
    }
    for (let y = -1; y < h; y++) for (let x = -1; x < w; x++) {
      const tl = inside(x, y), tr = inside(x + 1, y), br = inside(x + 1, y + 1), bl = inside(x, y + 1);
      const c = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const X = x, Y = y;
      switch (c) {
        case 1: case 14: seg(X, Y, 'L', 'B', bl, X, Y + 1); break;
        case 2: case 13: seg(X, Y, 'B', 'R', br, X + 1, Y + 1); break;
        case 4: case 11: seg(X, Y, 'T', 'R', tr, X + 1, Y); break;
        case 8: case 7: seg(X, Y, 'L', 'T', tl, X, Y); break;
        case 3: case 12: seg(X, Y, 'L', 'R', tl, X, Y); break;
        case 6: case 9: seg(X, Y, 'T', 'B', tl, X, Y); break;
        case 5: case 10: {
          const mid = (A(x, y) + A(x + 1, y) + A(x + 1, y + 1) + A(x, y + 1)) / 4 >= thr;
          if (mid === (c === 5)) { seg(X, Y, 'L', 'T', tl, X, Y); seg(X, Y, 'B', 'R', br, X + 1, Y + 1); }
          else { seg(X, Y, 'L', 'B', bl, X, Y + 1); seg(X, Y, 'T', 'R', tr, X + 1, Y); }
          break;
        }
      }
    }
    const loops = [], seen = new Set();
    for (const start of next.keys()) {
      if (seen.has(start)) continue;
      const loop = []; let e = start, guard = 0;
      while (e !== undefined && !seen.has(e) && guard++ < 1e6) { seen.add(e); loop.push(points.get(e)); e = next.get(e); }
      if (loop.length >= 3) loops.push(loop);
    }
    const out = [];
    for (const l of loops) {
      const s = simplify(l, eps);
      if (s.length < 3) continue;
      let area = 0;
      for (let i = 0; i < s.length; i++) { const a = s[i], b = s[(i + 1) % s.length]; area += a[0] * b[1] - b[0] * a[1]; }
      if (Math.abs(area) / 2 < (o.minArea ?? 2)) continue;
      s.area = area / 2; s.hole = area < 0;
      out.push(s);
    }
    return out;
  }
  // Ramer-Douglas-Peucker on a closed loop: split at the point farthest from the first, simplify both halves
  function simplify(pts, eps) {
    if (pts.length < 8 || eps <= 0) return pts.slice();
    const ext = pts.concat([pts[0]]);
    let far = 0, fd = -1;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]); if (d > fd) { fd = d; far = i; } }
    const keep = new Uint8Array(ext.length); keep[0] = keep[far] = keep[ext.length - 1] = 1;
    const stack = [[0, far], [far, ext.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop(), A = ext[a], B = ext[b], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
      let md = -1, mi = -1;
      for (let i = a + 1; i < b; i++) { const d = Math.abs((ext[i][0] - A[0]) * dy - (ext[i][1] - A[1]) * dx) / L; if (d > md) { md = d; mi = i; } }
      if (md > eps) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
    }
    const out = [];
    for (let i = 0; i < ext.length - 1; i++) if (keep[i]) out.push(ext[i]);
    return out;
  }
  // group loops into shapes: each hole goes to the smallest outer loop that contains it
  function nestLoops(loops) {
    const outers = loops.filter(l => !l.hole).map(l => ({ pts: l, holes: [], area: Math.abs(l.area) }));
    const inPoly = (p, poly) => {
      let c = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[i], b = poly[j];
        if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
      }
      return c;
    };
    for (const hl of loops.filter(l => l.hole)) {
      let best = null;
      for (const ou of outers) if (inPoly(hl[0], ou.pts) && (!best || ou.area < best.area)) best = ou;
      if (best) best.holes.push(hl);
    }
    return outers;
  }

  if (!T) {
    return { ok: false, THREE: null, rig, arrange, motion, sim, bake, rng, noise1, timeRemap, pathAt, traceContours, nestLoops, V, Ease3,
      stage() { return stub(); }, mesh() { return null; }, mat() { return null; }, geo: {}, transition() { return false; } };
  }
  function stub() { warnOnce('g3', '[g3] three.js is not loaded: 3D draws are skipped'); return { render() {}, get() { return null; }, add() {}, scene: null, project: () => [0, 0, 0, false] }; }
  const warned = new Set();
  function warnOnce(k, m) { if (!warned.has(k)) { warned.add(k); console.warn(m); } }

  // ───────── renderer (one offscreen WebGL2 canvas W x H, shared by every stage and the transitions) ─────────
  let R = null, okFlag = null, envTex = null, maxAniso = 1;
  function renderer() {
    if (okFlag === false) return null;
    if (R) return R;
    try {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
      R.setPixelRatio(1); R.setSize(W, H, false);
      R.outputColorSpace = T.SRGBColorSpace;
      R.shadowMap.enabled = true; R.shadowMap.type = T.PCFShadowMap;
      maxAniso = R.capabilities.getMaxAnisotropy();
      okFlag = true;
    } catch (e) {
      okFlag = false; R = null;
      console.warn('[g3] WebGL2 is unavailable: 3D draws are skipped (' + (e && e.message) + ')');
    }
    return R;
  }
  function environment() {
    if (envTex) return envTex;
    const r = renderer(); if (!r) return null;
    const pm = new T.PMREMGenerator(r);
    envTex = pm.fromScene(new T.addons.RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return envTex;
  }
  const TONE = { neutral: T.NeutralToneMapping, agx: T.AgXToneMapping, aces: T.ACESFilmicToneMapping, none: T.NoToneMapping, linear: T.LinearToneMapping };

  // ───────── colours, materials, textures ─────────
  let PAL = null;
  const palette = () => PAL || (typeof C !== 'undefined' ? C : {});
  function cssOf(c) { if (c == null) return null; const p = palette(); return typeof c === 'string' && p[c] ? p[c] : c; }
  function color(c) {
    if (c instanceof T.Color) return c;
    if (Array.isArray(c)) return new T.Color(c[0], c[1], c[2]);
    const css = cssOf(c);
    return new T.Color().setStyle(typeof toHex === 'function' ? toHex(css) : css);
  }
  const texCache = new WeakMap();
  function texture(src, o = {}) {
    if (!src) return null;
    if (src.isTexture) return src;
    let tx = texCache.get(src);
    if (!tx) {
      tx = src instanceof HTMLCanvasElement || (typeof OffscreenCanvas !== 'undefined' && src instanceof OffscreenCanvas) ? new T.CanvasTexture(src) : new T.Texture(src);
      tx.colorSpace = o.linear ? T.NoColorSpace : T.SRGBColorSpace;
      tx.anisotropy = maxAniso; tx.generateMipmaps = true; tx.minFilter = T.LinearMipmapLinearFilter;
      tx.needsUpdate = true;
      texCache.set(src, tx);
    }
    if (o.dynamic) tx.needsUpdate = true;
    return tx;
  }
  let toonRamp = null;
  const MATS = {
    matte: { roughness: 0.85, metalness: 0 },
    plastic: { physical: true, roughness: 0.32, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.3 },
    satin: { roughness: 0.5, metalness: 0.05 },
    metal: { roughness: 0.28, metalness: 1 },
    chrome: { roughness: 0.04, metalness: 1 },
    brushed: { physical: true, roughness: 0.35, metalness: 1, anisotropy: 0.85 },
    glass: { physical: true, roughness: 0.04, metalness: 0, transmission: 1, ior: 1.5, thickness: 0.6, specularIntensity: 1 },
    crystal: { physical: true, roughness: 0.02, metalness: 0, transmission: 1, ior: 2.1, thickness: 1.2, dispersion: 4 },
    iridescent: { physical: true, roughness: 0.18, metalness: 0.4, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 720] },
    clearcoat: { physical: true, roughness: 0.42, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.04 },
    velvet: { physical: true, roughness: 0.85, metalness: 0, sheen: 1, sheenRoughness: 0.45 },
    wax: { physical: true, roughness: 0.55, metalness: 0, transmission: 0.35, thickness: 1.5, ior: 1.4 },
    neon: { roughness: 0.5, metalness: 0, emissiveIntensity: 2.6 },
    toon: { toon: true },
    wire: { basic: true, wireframe: true },
    basic: { basic: true },
    xray: { xray: true },
  };
  // G3.mat(kind, {color, ...three material props}): palette roles ('accent', 'ink', 'bg2'...) or CSS colours
  function mat(kind = 'plastic', o = {}) {
    if (typeof kind === 'object') { o = kind; kind = o.kind || 'plastic'; }
    const base = MATS[kind] || MATS.plastic, col = color(o.color ?? 'accent');
    const props = { ...base, ...o }; delete props.kind; delete props.physical; delete props.toon; delete props.basic; delete props.xray;
    if (base.xray) return xrayMat(col, o);
    let m;
    if (base.toon) {
      if (!toonRamp) { toonRamp = new T.DataTexture(new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]), 3, 1); toonRamp.minFilter = toonRamp.magFilter = T.NearestFilter; toonRamp.needsUpdate = true; }
      m = new T.MeshToonMaterial({ gradientMap: toonRamp });
    } else if (base.basic) m = new T.MeshBasicMaterial();
    else if (base.physical || props.transmission || props.iridescence || props.clearcoat || props.sheen || props.anisotropy || props.dispersion) m = new T.MeshPhysicalMaterial();
    else m = new T.MeshStandardMaterial();
    for (const [k, v] of Object.entries(props)) {
      if (k === 'color' || v === undefined) continue;
      if (k === 'map' || k === 'emissiveMap' || k === 'alphaMap' || k === 'roughnessMap' || k === 'normalMap' || k === 'bumpMap') { m[k] = texture(v, { linear: k !== 'map' && k !== 'emissiveMap' }); continue; }
      if (k === 'emissive' || k === 'sheenColor' || k === 'attenuationColor' || k === 'specularColor') { m[k] = color(v); continue; }
      if (k === 'side') { m.side = v === 'double' ? T.DoubleSide : v === 'back' ? T.BackSide : v; continue; }
      if (k in m) m[k] = v;
    }
    m.color = col;
    if (kind === 'neon') { m.emissive = color(o.emissive ?? o.color ?? 'accent'); m.color = color(o.base ?? '#111111'); }
    if (o.opacity !== undefined && o.opacity < 1) m.transparent = true;
    if (kind === 'glass' || kind === 'crystal') { if (o.tint) { m.attenuationColor = color(o.tint); m.attenuationDistance = o.absorb ?? 1.2; } }
    return m;
  }
  function xrayMat(col, o = {}) {
    return new T.ShaderMaterial({
      uniforms: { uColor: { value: col }, uPower: { value: o.power ?? 2.2 }, uBase: { value: o.base ?? 0.06 }, uAlpha: { value: o.opacity ?? 1 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 uColor; uniform float uPower, uBase, uAlpha; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower); gl_FragColor = vec4(uColor * (uBase + f) * 1.6, clamp(uBase + f, 0.0, 1.0) * uAlpha);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
      transparent: true, depthWrite: false, side: T.DoubleSide, blending: o.additive === false ? T.NormalBlending : T.AdditiveBlending,
    });
  }

  // ───────── geometry ─────────
  function roundedRectShape(w, h, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // UVs 0..1 over the bounding box for front/back caps (ExtrudeGeometry / ShapeGeometry default to raw xy)
  function boxUV(geo) {
    geo.computeBoundingBox();
    const b = geo.boundingBox, p = geo.attributes.position, uv = geo.attributes.uv, sx = b.max.x - b.min.x || 1, sy = b.max.y - b.min.y || 1;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) - b.min.x) / sx, (p.getY(i) - b.min.y) / sy);
    uv.needsUpdate = true;
    return geo;
  }
  const geo = {
    box: (w = 1, h = 1, d = 1, r = 0, seg = 4) => (r > 0 ? new T.addons.RoundedBoxGeometry(w, h, d, seg, r) : new T.BoxGeometry(w, h, d)),
    sphere: (r = 1, seg = 64) => new T.SphereGeometry(r, seg, Math.round(seg * 0.6)),
    cylinder: (rt = 0.5, rb = 0.5, h = 1, seg = 64) => new T.CylinderGeometry(rt, rb, h, seg),
    cone: (r = 0.5, h = 1, seg = 64) => new T.ConeGeometry(r, h, seg),
    torus: (r = 1, tube = 0.3, seg = 128) => new T.TorusGeometry(r, tube, Math.round(seg / 4), seg),
    knot: (r = 0.8, tube = 0.25, seg = 220, p = 2, q = 3) => new T.TorusKnotGeometry(r, tube, seg, 24, p, q),
    capsule: (r = 0.4, len = 1, seg = 16) => new T.CapsuleGeometry(r, len, seg, seg * 2),
    plane: (w = 1, h = 1, sx = 1, sy = 1) => new T.PlaneGeometry(w, h, sx, sy),
    disc: (r = 1, seg = 96) => new T.CircleGeometry(r, seg),
    ring: (r0 = 0.6, r1 = 1, seg = 128) => new T.RingGeometry(r0, r1, seg),
    ico: (r = 1, detail = 0) => new T.IcosahedronGeometry(r, detail),
    lathe: (profile, seg = 96) => new T.LatheGeometry(profile.map(p => new T.Vector2(p[0], p[1])), seg),
    tube: (points, r = 0.05, seg = 200, closed = false) => new T.TubeGeometry(curveOf(points, closed) || new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), seg, r, 12, closed),
    // flat rounded rectangle with 0..1 UVs (a card face for an image)
    roundRect: (w = 1.6, h = 1, r = 0.06, seg = 8) => boxUV(new T.ShapeGeometry(roundedRectShape(w, h, r), seg)),
    // rounded slab with depth: groups 0 = front/back caps (UV 0..1), 1 = sides
    slab: (w = 1.6, h = 1, d = 0.06, r = 0.06, bevel = 0.012) => {
      const g = new T.ExtrudeGeometry(roundedRectShape(w, h, r), { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 8 });
      g.translate(0, 0, -d / 2); return boxUV(g);
    },
    // same vertex count and order on a sphere and a cube: morph with G3.deform.morph(mesh, k)
    morphPair(size = 1.4, seg = 24) {
      // shared vertices along the cube edges, so the sphere state has no seams
      const box = new T.BoxGeometry(size, size, size, seg, seg, seg);
      box.deleteAttribute('normal'); box.deleteAttribute('uv');
      const g = T.addons.BufferGeometryUtils.mergeVertices(box), p = g.attributes.position, n = p.count;
      const cube = Float32Array.from(p.array), ball = new Float32Array(n * 3), r = size * 0.62;
      for (let i = 0; i < n; i++) { const v = V.norm([cube[i * 3], cube[i * 3 + 1], cube[i * 3 + 2]]); ball[i * 3] = v[0] * r; ball[i * 3 + 1] = v[1] * r; ball[i * 3 + 2] = v[2] * r; }
      g.userData.morph = { a: ball, b: cube };
      p.array.set(ball); p.needsUpdate = true; g.computeVertexNormals();
      return g;
    },
    // extrude an SVG (string with <path>s, or a single path d) -> {geometry, shapes}; y up, centred, `size` world units tall
    svg(src, o = {}) {
      const svg = /<svg[\s>]/i.test(src) ? src : `<svg xmlns="http://www.w3.org/2000/svg"><path d="${src}"/></svg>`;
      const data = new T.addons.SVGLoader().parse(svg), shapes = [];
      for (const p of data.paths) for (const s of T.addons.SVGLoader.createShapes(p)) shapes.push(s);
      const g = o.depth === 0 ? new T.ShapeGeometry(shapes, o.curveSegments ?? 12) : new T.ExtrudeGeometry(shapes, extrudeOpts(o));
      return fitGeo(g, o.size ?? 1, true);
    },
    // extruded text from any font the page can draw (Hangul included): traced from a raster, then extruded
    text(str, o = {}) { return textGeometry(str, o); },
  };
  function extrudeOpts(o) {
    const b = o.bevel ?? 0.02;
    return { depth: o.depth ?? 0.25, bevelEnabled: b > 0, bevelThickness: b, bevelSize: b * 0.8, bevelSegments: o.bevelSegments ?? 3, curveSegments: o.curveSegments ?? 8 };
  }
  // centre a geometry and scale it to `size` world units tall (flipY for SVG / raster y-down coordinates)
  function fitGeo(g, size, flipY) {
    if (flipY) g.scale(1, -1, 1);
    g.computeBoundingBox();
    const b = g.boundingBox, hgt = b.max.y - b.min.y || 1, k = size / hgt;
    g.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, -(b.min.z + b.max.z) / 2);
    g.scale(k, k, k);
    g.computeVertexNormals();
    g.computeBoundingBox();
    if (flipY) { const idx = g.index; if (idx) { const a = idx.array; for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; } idx.needsUpdate = true; } }
    return g;
  }
  const textCache = new Map();
  function textFont(px, o) {
    const weight = o.weight ?? (typeof STYLE !== 'undefined' && STYLE.type && STYLE.type.displayWeight) ?? 800;
    return typeof font === 'function' ? font(px, weight, o.fam || 'display') : `${weight} ${px}px sans-serif`;
  }
  // shapes for a string: rasterize with the page's fonts at `px`, trace, simplify, nest -> [T.Shape] in px units (y down)
  function textShapes(str, o = {}) {
    const px = o.px ?? 220, f = textFont(px, o);
    const cv = document.createElement('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
    g.font = f;
    const mw = Math.ceil(g.measureText(str).width + px * 0.6), mh = Math.ceil(px * 1.6);
    cv.width = mw; cv.height = mh;
    g.font = f; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff';
    if (o.ls) g.letterSpacing = o.ls + 'px';
    g.fillText(str, px * 0.3, px * 1.18);
    const id = g.getImageData(0, 0, mw, mh).data, a = new Uint8ClampedArray(mw * mh);
    for (let i = 0; i < a.length; i++) a[i] = id[i * 4 + 3];
    const loops = traceContours(a, mw, mh, { eps: o.eps ?? 0.45 });
    const shapes = nestLoops(loops).map(sh => {
      const s = new T.Shape(sh.pts.map(p => new T.Vector2(p[0], p[1])));
      s.holes = sh.holes.map(hl => new T.Path(hl.map(p => new T.Vector2(p[0], p[1]))));
      return s;
    });
    return { shapes, width: g.measureText(str).width, px, baseline: px * 1.18, x0: px * 0.3 };
  }
  // -> {geometry, letters?}: o.size = world height of the em, depth, bevel; o.letters: also per-glyph geometries with offsets
  function textGeometry(str, o = {}) {
    const key = JSON.stringify([str, o.px, o.weight, o.fam, o.size, o.depth, o.bevel, o.ls, o.letters]);
    if (textCache.has(key)) return textCache.get(key);
    const ts = textShapes(str, o), k = (o.size ?? 1) / ts.px;
    const make = shapes => {
      const g = o.depth === 0 ? new T.ShapeGeometry(shapes, 1) : new T.ExtrudeGeometry(shapes, extrudeOpts({ ...o, depth: (o.depth ?? 0.25) / k, bevel: (o.bevel ?? 0.02) / k, curveSegments: 1 }));
      g.scale(k, -k, k);
      const idx = g.index; if (idx) { const a = idx.array; for (let i = 0; i < a.length; i += 3) { const t = a[i]; a[i] = a[i + 2]; a[i + 2] = t; } idx.needsUpdate = true; }
      return g;
    };
    const whole = make(ts.shapes);
    whole.computeBoundingBox();
    const bb = whole.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
    whole.translate(-cx, -cy, -cz); whole.computeVertexNormals();
    const out = { geometry: whole, width: bb.max.x - bb.min.x, height: bb.max.y - bb.min.y };
    if (o.letters) {
      // per-glyph meshes at their place in the word (advance from the prefix width keeps the word's spacing)
      const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? [...new Intl.Segmenter().segment(str)].map(s => s.segment) : [...str];
      const cv = document.createElement('canvas').getContext('2d'); cv.font = textFont(ts.px, o);
      if (o.ls) cv.letterSpacing = o.ls + 'px';
      out.letters = [];
      let prefix = '';
      for (const ch of seg) {
        const x0 = cv.measureText(prefix).width; prefix += ch;
        if (!ch.trim()) continue;
        const gs = textShapes(ch, o), g = make(gs.shapes);
        // the glyph is rasterized at the word's origin: shift it by its prefix advance, then by the word centre
        g.translate(x0 * k - cx, -cy, -cz);
        g.computeBoundingBox(); const lb = g.boundingBox, lc = [(lb.min.x + lb.max.x) / 2, (lb.min.y + lb.max.y) / 2, (lb.min.z + lb.max.z) / 2];
        g.translate(-lc[0], -lc[1], -lc[2]); g.computeVertexNormals();
        out.letters.push({ ch, geometry: g, offset: lc });
      }
    }
    textCache.set(key, out);
    return out;
  }

  // ───────── objects ─────────
  function mesh(g, m, o = {}) {
    const ms = new T.Mesh(g, m || mat('plastic'));
    ms.castShadow = o.castShadow ?? o.shadow ?? true; ms.receiveShadow = o.receiveShadow ?? o.shadow ?? true;
    place(ms, o);
    return ms;
  }
  function place(obj, o = {}) {
    if (o.pos) obj.position.set(o.pos[0], o.pos[1], o.pos[2]);
    if (o.rot) obj.rotation.set(o.rot[0], o.rot[1], o.rot[2]);
    if (o.scale !== undefined) { const s = o.scale; Array.isArray(s) ? obj.scale.set(s[0], s[1], s[2]) : obj.scale.setScalar(s); }
    if (o.name) obj.name = o.name;
    return obj;
  }
  // set a transform from a plain {pos, rot, scale} (arrangement and motion results), optionally added on a base
  function pose(obj, p, base) {
    const b = base || obj.userData.base || (obj.userData.base = { pos: obj.position.toArray(), rot: obj.rotation.toArray().slice(0, 3), scale: obj.scale.toArray() });
    const pp = p.pos ? V.add(b.pos, p.pos) : b.pos, rr = p.rot ? [b.rot[0] + p.rot[0], b.rot[1] + p.rot[1], b.rot[2] + p.rot[2]] : b.rot;
    obj.position.set(pp[0], pp[1], pp[2]); obj.rotation.set(rr[0], rr[1], rr[2]);
    if (p.scale !== undefined) { const s = Array.isArray(p.scale) ? p.scale : [p.scale, p.scale, p.scale]; obj.scale.set(b.scale[0] * s[0], b.scale[1] * s[1], b.scale[2] * s[2]); }
    else obj.scale.set(b.scale[0], b.scale[1], b.scale[2]);
    return obj;
  }
  // a hinge/pivot: wraps obj in a group placed at `at`, so rotating the group swings obj around that point
  function pivot(obj, at) {
    const g = new T.Group(); g.position.set(at[0], at[1], at[2]);
    obj.position.sub(new T.Vector3(at[0], at[1], at[2])); g.add(obj);
    return g;
  }
  // an image / capture / canvas as a card in space: o.w (world width), o.h (else from the aspect), o.radius, o.depth (slab),
  // o.mat (material kind, default 'satin'), o.dynamic (canvas redrawn every frame), o.back (colour or image for the back)
  function card(src, o = {}) {
    const iw = src.naturalWidth || src.videoWidth || src.width || 16, ih = src.naturalHeight || src.videoHeight || src.height || 9;
    const w = o.w ?? 1.6, h = o.h ?? w * ih / iw, r = o.radius ?? Math.min(w, h) * 0.04;
    const tx = texture(src, { dynamic: o.dynamic });
    const face = mat(o.mat || 'satin', { color: '#FFFFFF', map: tx, roughness: o.roughness ?? 0.45, ...(o.emissive ? { emissive: '#FFFFFF', emissiveMap: tx, emissiveIntensity: o.emissive } : {}) });
    let m;
    if (o.depth) {
      // a slab in the edge colour; the image sits on its front face only, the back is the edge colour or o.back
      const bev = o.bevel ?? 0, side = mat('satin', { color: o.edge ?? 'ink', roughness: 0.5 });
      m = new T.Mesh(geo.slab(w, h, o.depth, r, bev), side);
      const front = new T.Mesh(geo.roundRect(w - bev * 2, h - bev * 2, Math.max(0, r - bev)), face);
      front.position.z = o.depth / 2 + bev + 0.0015; m.add(front);
      if (o.back) {
        const isImg = typeof o.back === 'object';
        const b = new T.Mesh(geo.roundRect(w - bev * 2, h - bev * 2, Math.max(0, r - bev)), mat('satin', isImg ? { color: '#FFFFFF', map: texture(o.back) } : { color: o.back }));
        b.rotation.y = Math.PI; b.position.z = -(o.depth / 2 + bev + 0.0015); m.add(b);
      }
    } else {
      face.side = o.back ? T.FrontSide : T.DoubleSide;
      m = new T.Mesh(geo.roundRect(w, h, r), face);
      if (o.back) {
        const isImg = typeof o.back === 'object';
        const bm = mat('satin', isImg ? { color: '#FFFFFF', map: texture(o.back) } : { color: o.back });
        const b = new T.Mesh(geo.roundRect(w, h, r), bm); b.rotation.y = Math.PI; m.add(b);
      }
    }
    m.castShadow = o.shadow ?? true; m.receiveShadow = false;
    m.userData.dynamicTex = o.dynamic ? { tx, src } : null;
    return place(m, o);
  }
  // crisp text on a transparent plane (labels, billboards, callout tags in space); world height o.h
  function label(str, o = {}) {
    const size = o.px ?? 96, cv = document.createElement('canvas'), g = cv.getContext('2d');
    const f = typeof font === 'function' ? font(size, o.weight ?? 700, o.fam || 'display') : `${o.weight ?? 700} ${size}px sans-serif`;
    g.font = f; const w = Math.ceil(g.measureText(str).width + size * 0.5), hh = Math.ceil(size * 1.45);
    cv.width = w; cv.height = hh;
    if (o.bg) { g.fillStyle = cssOf(o.bg); if (typeof rr === 'function') { rr(g, 0, 0, w, hh, hh / 2); g.fill(); } else g.fillRect(0, 0, w, hh); }
    g.font = f; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = cssOf(o.color ?? 'ink');
    g.fillText(str, w / 2, hh * 0.53);
    const tx = texture(cv), H3 = o.h ?? 0.3;
    const m = new T.Mesh(new T.PlaneGeometry(H3 * w / hh, H3), new T.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false, side: T.DoubleSide }));
    m.userData.billboard = !!o.billboard; m.renderOrder = o.renderOrder ?? 10;
    return place(m, o);
  }
  // instanced copies: inst.set(i, {pos, rot, scale, color}); inst.count = visible n
  function instanced(g, m, n, o = {}) {
    const im = new T.InstancedMesh(g, m, n);
    im.castShadow = o.shadow ?? true; im.receiveShadow = o.shadow ?? true;
    im.instanceMatrix.setUsage(T.DynamicDrawUsage);
    const d = new T.Object3D(), col = new T.Color();
    im.set = (i, p) => {
      d.position.set(...(p.pos || [0, 0, 0])); d.rotation.set(...(p.rot || [0, 0, 0]));
      const s = p.scale ?? 1; Array.isArray(s) ? d.scale.set(s[0], s[1], s[2]) : d.scale.setScalar(s);
      d.updateMatrix(); im.setMatrixAt(i, d.matrix); im.instanceMatrix.needsUpdate = true;
      if (p.color !== undefined) { im.setColorAt(i, p.color instanceof T.Color ? p.color : col.copy(color(p.color))); im.instanceColor.needsUpdate = true; }
      return im;
    };
    return im;
  }
  // soft round points in space, depth-tested with the meshes: pts.set(i, [x, y, z], size (world), alpha, colour)
  function points(n, o = {}) {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('size', new T.BufferAttribute(new Float32Array(n).fill(o.size ?? 0.05), 1).setUsage(T.DynamicDrawUsage));
    g.setAttribute('alpha', new T.BufferAttribute(new Float32Array(n).fill(1), 1).setUsage(T.DynamicDrawUsage));
    const c0 = color(o.color ?? 'accent'), ca = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { ca[i * 3] = c0.r; ca[i * 3 + 1] = c0.g; ca[i * 3 + 2] = c0.b; }
    g.setAttribute('color', new T.BufferAttribute(ca, 3).setUsage(T.DynamicDrawUsage));
    const m = new T.ShaderMaterial({
      uniforms: { uScale: { value: H / 2 }, uSoft: { value: o.soft ?? 0.6 } },
      vertexShader: 'attribute float size; attribute float alpha; varying vec3 vC; varying float vA; uniform float uScale; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.0, size * uScale / max(0.001, -mv.z)); vC = color; vA = alpha; }',
      fragmentShader: 'uniform float uSoft; varying vec3 vC; varying float vA; void main(){ vec2 p = gl_PointCoord * 2.0 - 1.0; float d = dot(p, p); if (d > 1.0) discard; float a = mix(smoothstep(1.0, 0.82, d), exp(-d * 3.5), uSoft) * vA; gl_FragColor = vec4(vC, a);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
      vertexColors: true, transparent: true, depthWrite: false, blending: o.additive ? T.AdditiveBlending : T.NormalBlending,
    });
    const pts = new T.Points(g, m);
    pts.frustumCulled = false; pts.userData.points = true;
    const P = g.attributes.position, S = g.attributes.size, A = g.attributes.alpha, Cc = g.attributes.color, tmp = new T.Color();
    pts.set = (i, p, size, alpha, c) => {
      P.setXYZ(i, p[0], p[1], p[2]); P.needsUpdate = true;
      if (size !== undefined) { S.setX(i, size); S.needsUpdate = true; }
      if (alpha !== undefined) { A.setX(i, alpha); A.needsUpdate = true; }
      if (c !== undefined) { tmp.copy(color(c)); Cc.setXYZ(i, tmp.r, tmp.g, tmp.b); Cc.needsUpdate = true; }
      return pts;
    };
    pts.count = n; g.setDrawRange(0, n);
    pts.show = k => g.setDrawRange(0, Math.max(0, Math.min(n, k | 0)));
    return pts;
  }

  // ───────── deformers (CPU, from stored base positions; normals recomputed) ─────────
  function deformBase(m) {
    const p = m.geometry.attributes.position;
    if (!m.geometry.userData.base) { m.geometry.userData.base = Float32Array.from(p.array); p.setUsage(T.DynamicDrawUsage); }
    return m.geometry.userData.base;
  }
  // bounds of the undeformed geometry (deformers must never read the previous frame's shape)
  function baseBox(m) {
    const b = deformBase(m), mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < b.length; i += 3) for (let a = 0; a < 3; a++) { const v = b[i + a]; if (v < mn[a]) mn[a] = v; if (v > mx[a]) mx[a] = v; }
    return { min: { x: mn[0], y: mn[1], z: mn[2] }, max: { x: mx[0], y: mx[1], z: mx[2] } };
  }
  function deform(m, fn) {
    const base = deformBase(m), p = m.geometry.attributes.position, a = p.array, out = [0, 0, 0];
    for (let i = 0, n = p.count; i < n; i++) {
      out[0] = base[i * 3]; out[1] = base[i * 3 + 1]; out[2] = base[i * 3 + 2];
      fn(out, i, base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
      a[i * 3] = out[0]; a[i * 3 + 1] = out[1]; a[i * 3 + 2] = out[2];
    }
    p.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    return m;
  }
  const deformers = {
    // rotate around y by an angle proportional to height (base stays, top turns)
    twist(m, angle, o = {}) {
      const b = baseBox(m), y0 = o.y0 ?? b.min.y, hgt = (o.y1 ?? b.max.y) - y0 || 1;
      return deform(m, (q, i, x, y, z) => { const a = angle * _clamp((y - y0) / hgt, -1, 2), c = Math.cos(a), s = Math.sin(a); q[0] = x * c - z * s; q[2] = x * s + z * c; });
    },
    // wrap a straight bar (along x) into an arc of `angle` keeping its length
    bend(m, angle, o = {}) {
      if (Math.abs(angle) < 1e-3) return deform(m, () => {});
      const b = baseBox(m), L = (b.max.x - b.min.x) || 1, R = L / angle;
      return deform(m, (q, i, x, y) => { const a = (x / L) * angle; q[0] = Math.sin(a) * (R - y); q[1] = R - Math.cos(a) * (R - y); });
    },
    // height field: sum of sines travelling in t (a plane rotated flat: deforms its local z)
    wave(m, t, o = {}) {
      const amp = o.amp ?? 0.18, f = o.freq ?? 1.4, sp = o.speed ?? 1.6, axis = o.axis ?? 2;
      return deform(m, (q, i, x, y) => { q[axis] += amp * (Math.sin(x * f + t * sp) * 0.6 + Math.sin((x * 0.7 + y) * f * 1.3 - t * sp * 1.2) * 0.4); });
    },
    // breathing: radius swells and shrinks with a gentle surface wobble
    breathe(m, t, o = {}) {
      const amp = o.amp ?? 0.06, wob = o.wobble ?? 0.03, rate = o.rate ?? 0.9;
      return deform(m, (q, i, x, y, z) => { const k = 1 + amp * Math.sin(t * TAU3 * rate / 2) + wob * Math.sin(x * 3 + t * 2.1) * Math.sin(y * 3 - t * 1.7) * Math.sin(z * 3 + t * 1.3); q[0] = x * k; q[1] = y * k; q[2] = z * k; });
    },
    // blend between the two vertex sets of geo.morphPair(): k 0 = sphere, 1 = cube
    morph(m, k) {
      const mp = m.geometry.userData.morph, p = m.geometry.attributes.position, a = p.array, e = _clamp(k);
      for (let i = 0; i < a.length; i++) a[i] = mp.a[i] + (mp.b[i] - mp.a[i]) * e;
      p.needsUpdate = true; m.geometry.computeVertexNormals(); return m;
    },
    // flag on a pole at the left edge: travelling wave whose amplitude grows away from the pole
    flag(m, t, o = {}) {
      const b = baseBox(m), L = b.max.x - b.min.x || 1;
      return deform(m, (q, i, x, y) => { const u = (x - b.min.x) / L; q[2] = u * (o.amp ?? 0.22) * Math.sin(u * 7 - t * (o.speed ?? 5) + y * 0.8); q[1] = y - u * u * (o.droop ?? 0.06); });
    },
    // page curl: the right part of a plane rolls up around a cylinder as k goes 0 -> 1
    curl(m, k, o = {}) {
      const b = baseBox(m), W3 = b.max.x - b.min.x, r = o.radius ?? W3 * 0.12;
      const edge = b.max.x - _clamp(k) * (W3 + Math.PI * r);
      return deform(m, (q, i, x) => {
        if (x <= edge) return;
        const a = (x - edge) / r;
        if (a < Math.PI) { q[0] = edge + Math.sin(a) * r; q[2] = r - Math.cos(a) * r; }
        else { q[0] = edge - (x - edge - Math.PI * r); q[2] = 2 * r; }
      });
    },
  };
  // exploded view: each child moves out from `center` along its own direction by dist x eased (staggered) k
  function explode(objs, k, o = {}) {
    const c = o.center || [0, 0, 0], n = objs.length;
    objs.forEach((ob, i) => {
      const b = ob.userData.base || (ob.userData.base = { pos: ob.position.toArray(), rot: ob.rotation.toArray().slice(0, 3), scale: ob.scale.toArray() });
      const dir = o.dir ? o.dir(i, b.pos) : V.norm(V.len(V.sub(b.pos, c)) < 1e-6 ? [0, 1, 0] : V.sub(b.pos, c));
      const lk = Ease3.ioC(_clamp((k - arrange.delay(i, n, { step: o.stagger ?? 0.04, from: o.from || 'start' })) / (1 - (o.stagger ?? 0.04) * (n - 1) || 1)));
      const p = V.add(b.pos, V.scale(dir, (o.dist ?? 1.2) * lk));
      ob.position.set(p[0], p[1], p[2]);
      ob.rotation.set(b.rot[0] + (o.spin ?? 0) * lk * (_h(i) - 0.5), b.rot[1] + (o.spin ?? 0) * lk * (_h(i + 9) - 0.5), b.rot[2]);
    });
  }

  // ───────── stage ─────────
  const stages = new Map();
  function stage(key, build, opts = {}) {
    let st = stages.get(key);
    if (st) return st;
    st = makeStage(key, opts);
    stages.set(key, st);
    if (renderer() && build) {
      // the drawing scene's palette, picked like the compositor does (a "dark" scene on a light reel gets C2)
      const s = typeof REEL !== 'undefined' ? REEL.drawing : null;
      const night = s && s.dark === true && typeof THEME !== 'undefined' && THEME !== 'dark' && typeof C2 !== 'undefined' && C2 && ALT_THEME === 'dark';
      const prev = PAL; PAL = opts.palette || (night ? C2 : null);
      try { build(st); } finally { PAL = prev; }
    }
    return st;
  }
  function makeStage(key, opts) {
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(35, W / H, 0.05, 400), ortho = new T.OrthographicCamera(-1, 1, 1, -1, 0.05, 400);
    const named = new Map(), dynamic = [];
    let lastCam = camera;
    const st = {
      key, scene, camera, opts, lights: {}, bg: null,
      add(obj, o = {}) { if (!obj) return obj; place(obj, o); scene.add(obj); if (obj.name) named.set(obj.name, obj); obj.traverse(c => { if (c.userData && c.userData.dynamicTex) dynamic.push(c.userData.dynamicTex); if (c.name) named.set(c.name, c); }); return obj; },
      get(name) { return named.get(name) || scene.getObjectByName(name) || null; },
      // lights, floor, background, fog and image-based light in one call (palette-driven defaults)
      studio(o = {}) {
        const P = palette();
        st.bg = o.bg === null ? null : cssOf(o.bg ?? 'bg');
        scene.background = st.bg ? color(st.bg) : null;
        if (o.fog) { const f = o.fog === true ? {} : o.fog; scene.fog = f.density ? new T.FogExp2(color(f.color ?? st.bg ?? P.bg), f.density) : new T.Fog(color(f.color ?? st.bg ?? P.bg), f.near ?? 10, f.far ?? 40); }
        if (o.env !== false) { scene.environment = environment(); scene.environmentIntensity = o.envIntensity ?? 0.75; }
        const hemi = new T.HemisphereLight(color(o.sky ?? '#FFFFFF'), color(o.ground ?? P.bg2 ?? '#888888'), o.fill ?? 0.55);
        scene.add(hemi); st.lights.hemi = hemi;
        const k = o.key === false ? null : { dir: [4, 7, 5], intensity: 2.4, color: '#FFFFFF', soft: 5, size: 7, ...(o.key || {}) };
        if (k) {
          const L = new T.DirectionalLight(color(k.color), k.intensity);
          L.position.set(...k.dir); L.target.position.set(...(k.target || [0, 0, 0]));
          L.castShadow = k.shadow !== false;
          L.shadow.mapSize.set(k.mapSize ?? 2048, k.mapSize ?? 2048); L.shadow.radius = k.soft; L.shadow.bias = k.bias ?? -0.0004; L.shadow.normalBias = k.normalBias ?? 0.02;
          const c = L.shadow.camera; c.left = c.bottom = -k.size; c.right = c.top = k.size; c.near = 0.5; c.far = k.far ?? 60;
          scene.add(L); scene.add(L.target); st.lights.key = L;
        }
        if (o.rim) {
          const r = { dir: [-5, 3, -6], intensity: 2.2, color: 'accent', ...(o.rim === true ? {} : o.rim) };
          const L = new T.DirectionalLight(color(r.color), r.intensity); L.position.set(...r.dir); scene.add(L); st.lights.rim = L;
        }
        const fl = o.floor ?? 'shadow';
        if (fl) {
          const y = o.floorY ?? 0, size = o.floorSize ?? 200, pg = new T.PlaneGeometry(size, size);
          if (fl === 'mirror') {
            const rf = new T.addons.Reflector(pg, { textureWidth: Math.round(W / 2), textureHeight: Math.round(H / 2), color: color(o.floorTint ?? '#888888'), clipBias: 0.003 });
            rf.rotation.x = -Math.PI / 2; rf.position.y = y; scene.add(rf);
            const top = new T.Mesh(pg, new T.MeshStandardMaterial({ color: color(o.floorColor ?? st.bg ?? P.bg), transparent: true, opacity: 1 - (o.reflect ?? 0.35), roughness: 0.6 }));
            top.rotation.x = -Math.PI / 2; top.position.y = y + 0.002; top.receiveShadow = true; scene.add(top); st.floor = top;
          } else {
            const m = fl === 'shadow' ? new T.ShadowMaterial({ opacity: o.shadowOpacity ?? 0.26, color: color(o.shadowColor ?? P.shadow ?? '#000000') })
              : new T.MeshStandardMaterial({ color: color(o.floorColor ?? (fl === 'grid' ? st.bg : P.bg2) ?? '#CCCCCC'), roughness: o.floorRough ?? 0.92, metalness: 0 });
            const pl = new T.Mesh(pg, m); pl.rotation.x = -Math.PI / 2; pl.position.y = y; pl.receiveShadow = true; scene.add(pl); st.floor = pl;
            if (fl === 'grid') { const gh = new T.GridHelper(o.gridSize ?? 40, o.gridDiv ?? 40, color(o.gridColor ?? P.muted ?? '#999999'), color(o.gridColor ?? P.muted ?? '#999999')); gh.position.y = y + 0.003; gh.material.transparent = true; gh.material.opacity = o.gridAlpha ?? 0.35; scene.add(gh); st.grid = gh; }
          }
        }
        return st;
      },
      // project a world point with the last rendered camera -> [px, py, depth, visible] (for 2D callouts on 3D points)
      project(p, obj) {
        const v = new T.Vector3(p[0], p[1], p[2]);
        if (obj) { obj.updateWorldMatrix(true, false); v.applyMatrix4(obj.matrixWorld); }
        const d = v.clone().applyMatrix4(lastCam.matrixWorldInverse).z;
        v.project(lastCam);
        return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, -d, v.z > -1 && v.z < 1 && Math.abs(v.x) <= 1.2 && Math.abs(v.y) <= 1.2];
      },
      // set the camera from a rig, render, composite into ctx. o: {dof, tone, exposure, alpha, rect}
      render(ctx, r = rig.orbit(), o = {}) {
        const RR = renderer();
        if (!RR) return st;
        const cam = setCamera(st, r);
        lastCam = cam;
        scene.traverse(c => { if (c.userData.billboard) c.quaternion.copy(cam.quaternion); if (c.userData.points) c.material.uniforms.uScale.value = cam.isPerspectiveCamera ? H / (2 * Math.tan(cam.fov * Math.PI / 360)) : H / 2; });
        for (const d of dynamic) d.tx.needsUpdate = true;
        RR.toneMapping = TONE[o.tone || opts.tone || 'neutral'] ?? T.NeutralToneMapping;
        RR.toneMappingExposure = o.exposure ?? opts.exposure ?? 1;
        if (!scene.background) RR.setClearColor(0x000000, 0);
        if (o.dof) renderDOF(RR, scene, cam, o.dof);
        else { RR.setRenderTarget(null); RR.render(scene, cam); }
        if (ctx) {
          ctx.save();
          ctx.globalAlpha *= o.alpha ?? 1;
          const rc = o.rect; rc ? ctx.drawImage(RR.domElement, rc.x, rc.y, rc.w, rc.h) : ctx.drawImage(RR.domElement, 0, 0, W, H);
          ctx.restore();
        }
        return st;
      },
    };
    st.ortho = ortho;
    return st;
  }
  function setCamera(st, r) {
    const up = r.up || [0, 1, 0];
    let cam = st.camera;
    if (r.ortho) {
      cam = st.ortho; const hh = r.ortho, aw = hh * W / H;
      cam.left = -aw; cam.right = aw; cam.top = hh; cam.bottom = -hh; cam.near = r.near ?? 0.05; cam.far = r.far ?? 400;
    } else {
      cam.fov = r.fov ?? 35; cam.aspect = W / H; cam.near = r.near ?? 0.05; cam.far = r.far ?? 400;
    }
    cam.position.set(r.pos[0], r.pos[1], r.pos[2]);
    cam.up.set(up[0], up[1], up[2]);
    cam.lookAt(r.target[0], r.target[1], r.target[2]);
    if (r.roll) cam.rotateZ(r.roll);
    if (r.shift && cam.isPerspectiveCamera) cam.setViewOffset(W, H, -r.shift[0] * W / 2, r.shift[1] * H / 2, W, H); else if (cam.view) cam.clearViewOffset();
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
    return cam;
  }

  // ───────── depth of field (gather blur from depth; 'tilt' = tilt-shift band in screen y) ─────────
  // The scene renders normally first (tone mapping, exact background, glass sees the background), that frame is
  // copied, a cheap depth-only pass gives the depth, and one gather pass blurs the copy by circle of confusion.
  let dofRT = null, dofQuad = null, dofCopy = null, depthOnly = null;
  function renderDOF(RR, scene, cam, d) {
    if (!dofRT) {
      dofRT = new T.WebGLRenderTarget(W, H, { depthTexture: new T.DepthTexture(W, H) });
      dofRT.depthTexture.type = T.UnsignedIntType;
      dofCopy = new T.FramebufferTexture(W, H);
      depthOnly = new T.MeshBasicMaterial({ colorWrite: false });
      const m = new T.ShaderMaterial({
        uniforms: { tColor: { value: null }, tDepth: { value: null }, res: { value: new T.Vector2(W, H) }, focus: { value: 5 }, aperture: { value: 1 }, maxBlur: { value: 14 },
          near: { value: 0.05 }, far: { value: 400 }, mode: { value: 0 }, band: { value: new T.Vector3(0.55, 0.08, 0.25) }, ortho: { value: 0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: [
          'uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 res; uniform float focus, aperture, maxBlur, near, far, ortho; uniform int mode; uniform vec3 band; varying vec2 vUv;',
          'float lin(float d){ if (ortho > 0.5) return near + d * (far - near); float z = d * 2.0 - 1.0; return 2.0 * near * far / (far + near - z * (far - near)); }',
          'float coc(vec2 uv){ if (mode == 1) return maxBlur * smoothstep(band.y, band.y + band.z, abs(uv.y - band.x)); float d = texture2D(tDepth, uv).x; if (d >= 1.0) return maxBlur * clamp(aperture, 0.0, 1.0); float z = lin(d); return maxBlur * clamp(aperture * abs(z - focus) / max(z, 1e-3), 0.0, 1.0); }',
          'void main(){ float c0 = coc(vUv); vec4 sum = vec4(0.0); float ws = 0.0;',
          '  for (int i = 0; i < 64; i++) { float fi = float(i); float r = sqrt((fi + 0.5) / 64.0) * c0; float a = fi * 2.39996323; vec2 uv = vUv + vec2(cos(a), sin(a)) * r / res;',
          // a sharp neighbour in front must not smear over a blurred background: weight by the sample's own CoC
          '    float w = (coc(uv) + 0.5 >= r) ? 1.0 : 0.08; sum += texture2D(tColor, uv) * w; ws += w; }',
          '  gl_FragColor = sum / max(ws, 1e-4); }'].join('\n'),
        depthTest: false, depthWrite: false, toneMapped: false,
      });
      dofQuad = { scene: new T.Scene(), cam: new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), mat: m };
      dofQuad.scene.add(new T.Mesh(new T.PlaneGeometry(2, 2), m));
    }
    RR.setRenderTarget(null); RR.render(scene, cam);
    RR.copyFramebufferToTexture(dofCopy);
    const ov = scene.overrideMaterial, bgs = scene.background;
    scene.overrideMaterial = depthOnly; scene.background = null;
    RR.setRenderTarget(dofRT); RR.clear(); RR.render(scene, cam); RR.setRenderTarget(null);
    scene.overrideMaterial = ov; scene.background = bgs;
    const U = dofQuad.mat.uniforms;
    let focus = d.focus ?? 5;
    if (Array.isArray(focus)) { const v = new T.Vector3(...focus).applyMatrix4(cam.matrixWorldInverse); focus = -v.z; }
    U.tColor.value = dofCopy; U.tDepth.value = dofRT.depthTexture; U.focus.value = focus; U.aperture.value = d.aperture ?? 1; U.maxBlur.value = (d.maxBlur ?? 14) * (typeof UNIT !== 'undefined' ? UNIT : 1);
    U.near.value = cam.near; U.far.value = cam.far; U.ortho.value = cam.isOrthographicCamera ? 1 : 0;
    U.mode.value = d.mode === 'tilt' ? 1 : 0;
    U.band.value.set(1 - (d.center ?? 0.55), d.width ?? 0.07, d.feather ?? 0.22);
    RR.render(dofQuad.scene, dofQuad.cam);
  }

  // ───────── 3D transitions (compositor): both scene frames as textures on geometry ─────────
  let TR = null;
  function trInit() {
    if (TR) return TR;
    const scene = new T.Scene(), fov = 30, dist = (H / 2) / Math.tan(fov * Math.PI / 360);
    const cam = new T.PerspectiveCamera(fov, W / H, 10, dist * 8);
    const ca = document.createElement('canvas'), cb = document.createElement('canvas');
    ca.width = cb.width = W; ca.height = cb.height = H;
    const ta = new T.CanvasTexture(ca), tb = new T.CanvasTexture(cb);
    for (const t of [ta, tb]) { t.colorSpace = T.SRGBColorSpace; t.minFilter = T.LinearFilter; t.generateMipmaps = false; }
    const mA = new T.MeshBasicMaterial({ map: ta, toneMapped: false }), mB = new T.MeshBasicMaterial({ map: tb, toneMapped: false });
    TR = { scene, cam, dist, ca, cb, ga: ca.getContext('2d'), gb: cb.getContext('2d'), ta, tb, mA, mB, groups: {} };
    return TR;
  }
  function trGroup(type, build) {
    const tr = trInit();
    if (!tr.groups[type]) { const g = new T.Group(); build(g, tr); tr.groups[type] = g; tr.scene.add(g); }
    for (const [k, g] of Object.entries(tr.groups)) g.visible = k === type;
    return tr.groups[type];
  }
  function tileGrid(g, tr, cols, rows, thick) {
    const tw = W / cols, th = H / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const gg = new T.Group(); gg.position.set(-W / 2 + (c + 0.5) * tw, H / 2 - (r + 0.5) * th, 0);
      const mk = (m, back) => { const pg = new T.PlaneGeometry(tw, th); const uv = pg.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (c + uv.getX(i)) / cols, 1 - (r + 1 - uv.getY(i)) / rows);  // the back turns a full circle: same mapping
        const ms = new T.Mesh(pg, m); if (back) ms.rotation.y = Math.PI; ms.position.z = back ? -thick : thick; return ms; };
      gg.add(mk(tr.mA, false)); gg.add(mk(tr.mB, true));
      gg.userData.cell = [c, r];
      g.add(gg);
    }
  }
  // draws transition `type` at progress k (0..1) from canvas a (outgoing) to b (incoming) into g; false if unavailable
  function transition(type, g, a, b, k, p = {}) {
    const RR = renderer();
    if (!RR) return false;
    const tr = trInit();
    tr.ga.clearRect(0, 0, W, H); tr.ga.drawImage(a, 0, 0); tr.gb.clearRect(0, 0, W, H); tr.gb.drawImage(b, 0, 0);
    tr.ta.needsUpdate = true; tr.tb.needsUpdate = true;
    const e = Ease3.ioC(_clamp(k)), dist = tr.dist, dir = p.dir || 'left';
    // what shows behind the turning frames: the night colour on dark reels, a deeper stage tone on light ones
    const bgCss = p.bg || (typeof C === 'undefined' ? '#000000' : THEME === 'dark' ? (C.night || C.bg) : mix(C.bg2 || C.bg, C.ink, 0.16));
    let camZ = dist, camY = 0;
    if (type === 'cube') {
      const grp = trGroup('cube', gg => {
        const fa = new T.Mesh(new T.PlaneGeometry(W, H), tr.mA); const fb = new T.Mesh(new T.PlaneGeometry(W, H), tr.mB);
        fa.name = 'A'; fb.name = 'B'; gg.add(fa); gg.add(fb);
      });
      // A is the front face, B the face on the side the content travels from; the cube turns a quarter around its centre
      const vert = dir === 'up' || dir === 'down', half = (vert ? H : W) / 2, sgn = dir === 'right' || dir === 'down' ? -1 : 1;
      const A = grp.getObjectByName('A'), B = grp.getObjectByName('B');
      A.position.set(0, 0, half); A.rotation.set(0, 0, 0);
      if (vert) { B.position.set(0, -sgn * half, 0); B.rotation.set(sgn * Math.PI / 2, 0, 0); } else { B.position.set(sgn * half, 0, 0); B.rotation.set(0, sgn * Math.PI / 2, 0); }
      grp.position.set(0, 0, -half);
      grp.rotation.set(vert ? -sgn * e * Math.PI / 2 : 0, vert ? 0 : -sgn * e * Math.PI / 2, 0);
      camZ = dist + (p.pull ?? 0.35) * dist * Math.sin(Math.PI * e);
    } else if (type === 'flip') {
      const grp = trGroup('flip', gg => { const fa = new T.Mesh(new T.PlaneGeometry(W, H), tr.mA); const fb = new T.Mesh(new T.PlaneGeometry(W, H), tr.mB); fb.rotation.y = Math.PI; fa.position.z = 0.5; fb.position.z = -0.5; gg.add(fa); gg.add(fb); });
      const vert = dir === 'up' || dir === 'down', sgn = dir === 'right' || dir === 'down' ? -1 : 1;
      if (vert) { grp.children[1].rotation.set(Math.PI, 0, 0); grp.rotation.set(sgn * e * Math.PI, 0, 0); } else { grp.children[1].rotation.set(0, Math.PI, 0); grp.rotation.set(0, -sgn * e * Math.PI, 0); }
      camZ = dist * (1 + (p.pull ?? 0.45) * Math.sin(Math.PI * e));
    } else if (type === 'flipBoard') {
      const cols = p.cols ?? 12, rows = p.rows ?? Math.round(cols * H / W);
      const grp = trGroup('flipBoard:' + cols + 'x' + rows, gg => tileGrid(gg, tr, cols, rows, 0.5));
      const from = p.from || 'left';
      grp.children.forEach((gg, i) => {
        const [c, r] = gg.userData.cell;
        const d = from === 'center' ? Math.hypot(c - (cols - 1) / 2, (r - (rows - 1) / 2) * 1.2) / Math.hypot(cols / 2, rows / 2) : from === 'random' ? _h(i * 7.3) : from === 'top' ? r / rows : (c + r * 0.35) / (cols + rows * 0.35);
        const lk = _clamp((k - d * (p.spread ?? 0.55)) / (1 - (p.spread ?? 0.55)));
        gg.rotation.set(0, Math.PI * Ease3.outBack(lk, 1.1), 0);
        gg.position.z = Math.sin(Math.PI * lk) * (p.lift ?? 60);
      });
    } else if (type === 'fold') {
      const strips = p.strips ?? 6;
      const grp = trGroup('fold:' + strips, gg => {
        const sw = W / strips;    // the incoming frame is the scene background (always behind the folding strips)
        let parent = gg;
        for (let s = 0; s < strips; s++) {
          const pg = new T.PlaneGeometry(sw, H); pg.translate(sw / 2, 0, 0);
          const uv = pg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, (s + uv.getX(i)) / strips);
          const hinge = new T.Group(); hinge.position.x = s === 0 ? -W / 2 : sw; hinge.add(new T.Mesh(pg, tr.mA)); hinge.name = 'h' + s;
          parent.add(hinge); parent = hinge;
        }
      });
      // accordion: alternate hinges fold the strips together toward the left edge while the stack turns away
      const fe = Ease3.ioC(_clamp(k));
      for (let s = 0; s < strips; s++) { const h = grp.getObjectByName('h' + s); h.rotation.y = s === 0 ? -fe * 0.45 : (s % 2 ? 1 : -1) * fe * Math.PI * 0.8; }
      // the folded stack leaves the frame on the left before the window ends (no pop when the cut lands)
      const h0 = grp.getObjectByName('h0'); h0.position.x = -W / 2 - Math.pow(fe, 3) * W * 0.45;
      h0.visible = k < 0.999;
    } else if (type === 'depthPush') {
      const grp = trGroup('depthPush', gg => { const fa = new T.Mesh(new T.PlaneGeometry(W, H), tr.mA.clone()); fa.name = 'A'; fa.material.transparent = true; const fb = new T.Mesh(new T.PlaneGeometry(W, H), tr.mB.clone()); fb.name = 'B'; fb.material.transparent = true; gg.add(fa); gg.add(fb); });
      const A = grp.getObjectByName('A'), B = grp.getObjectByName('B');
      A.material.map = tr.ta; B.material.map = tr.tb;
      const ka = Ease3.ioC(_clamp(k / 0.8)), kb = Ease3.outC(_clamp((k - 0.2) / 0.8));
      A.position.set(0, -ka * H * 0.06, -ka * dist * (p.depth ?? 0.9)); A.rotation.set(-ka * (p.tilt ?? 0.32), 0, 0);
      A.material.color.setScalar(1 - ka * (p.dim ?? 0.45));
      B.position.set(0, 0, (1 - kb) * dist * 0.62); B.rotation.set((1 - kb) * 0.18, 0, 0); B.material.opacity = _rm(k, 0.2, 0.42);
      B.renderOrder = 2;
    } else if (type === 'shatter') {
      const cols = p.cols ?? 16, rows = p.rows ?? 9;
      const grp = trGroup('shatter:' + cols + 'x' + rows, gg => {
        const back = new T.Mesh(new T.PlaneGeometry(W, H), tr.mB); back.name = 'B'; back.position.z = -4; gg.add(back);
        const rnd = rng(7), tw = W / cols, th = H / rows, jx = [], idx = (c, r) => r * (cols + 1) + c;
        for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
          const edge = c === 0 || r === 0 || c === cols || r === rows;
          jx.push([-W / 2 + c * tw + (edge ? 0 : (rnd() - 0.5) * tw * 0.7), H / 2 - r * th + (edge ? 0 : (rnd() - 0.5) * th * 0.7)]);
        }
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const q = [jx[idx(c, r)], jx[idx(c + 1, r)], jx[idx(c + 1, r + 1)], jx[idx(c, r + 1)]];
          for (const tri of (rnd() < 0.5 ? [[0, 1, 2], [0, 2, 3]] : [[0, 1, 3], [1, 2, 3]])) {
            const pts = tri.map(i => q[i]), cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
            const bg = new T.BufferGeometry(), pos = [], uvs = [];
            for (const pp of pts) { pos.push(pp[0] - cx, pp[1] - cy, 0); uvs.push((pp[0] + W / 2) / W, (pp[1] + H / 2) / H); }
            bg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); bg.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
            const sh = new T.Mesh(bg, new T.MeshBasicMaterial({ map: tr.ta, toneMapped: false, side: T.DoubleSide, transparent: true }));
            sh.position.set(cx, cy, 0); sh.userData.c = [cx, cy]; sh.userData.r = [rnd(), rnd(), rnd(), rnd()];
            gg.add(sh);
          }
        }
      });
      const ox = (p.x ?? W / 2) - W / 2, oy = H / 2 - (p.y ?? H / 2), sec = Math.max(0, k) * ((p.dur ?? 1.1));
      grp.children.forEach(sh => {
        if (sh.name === 'B') return;
        const [cx, cy] = sh.userData.c, rr = sh.userData.r, dx = cx - ox, dy = cy - oy, d = Math.hypot(dx, dy) / Math.hypot(W, H);
        const lt = Math.max(0, sec - d * (p.spread ?? 0.35));
        const v = [dx / (Math.hypot(dx, dy) || 1) * (260 + 520 * rr[0]), dy / (Math.hypot(dx, dy) || 1) * (200 + 420 * rr[1]) + 380, 900 + 1500 * rr[2]];
        sh.position.set(cx + v[0] * lt, cy + v[1] * lt - 0.5 * 2600 * lt * lt, v[2] * lt);
        sh.rotation.set(lt * (rr[0] - 0.5) * 14, lt * (rr[1] - 0.5) * 14, lt * (rr[3] - 0.5) * 10);
        sh.material.opacity = 1 - _rm(lt, 0.5, 0.9);
      });
    } else return false;
    tr.cam.position.set(0, camY, camZ); tr.cam.lookAt(0, 0, 0); tr.cam.updateProjectionMatrix();
    RR.toneMapping = T.NoToneMapping;
    tr.scene.background = type === 'fold' ? tr.tb : color(bgCss);
    RR.setRenderTarget(null); RR.render(tr.scene, tr.cam);
    g.drawImage(RR.domElement, 0, 0, W, H);
    return true;
  }
  const TRANSITIONS = ['cube', 'flip', 'flipBoard', 'fold', 'depthPush', 'shatter'];

  return {
    get ok() { return !!renderer(); }, THREE: T, version: '1.0.0',
    stage, mesh, mat, geo, card, label, instanced, points, pivot, pose, place, explode, deform: Object.assign(deform, deformers),
    rig, arrange, motion, sim, bake, rng, noise1, timeRemap, pathAt, color, texture, traceContours, nestLoops, textShapes,
    transition, TRANSITIONS, V, Ease3, MATS: Object.keys(MATS), renderer,
  };
})();
if (typeof window !== 'undefined') window.G3 = G3;

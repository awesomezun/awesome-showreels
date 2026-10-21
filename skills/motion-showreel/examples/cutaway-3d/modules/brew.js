// brew: the 브루큐브 reel's kit (a project module): a small flat-shaded 3D renderer on Canvas2D (tiny3d: a perspective
// camera, outward-facing quads, a painter's sort, lambert light with a soft specular) and the roaster built from its
// primitives, so the casing can slide open and show what turns inside; beans and labels are drawn in 2D on top.
(() => {
  // ───────── tiny3d: a small flat-shaded 3D renderer on Canvas2D (perspective camera, painter's sort, lambert light) ─────────
  // Shared by the 3D examples of the 24-style series; each example carries its own copy inside its module.
  const T3 = {};
  T3.v = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
  const V = T3.v;
  // rotations of a point about the origin
  T3.rx = (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
  T3.ry = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
  T3.rz = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
  // camera: eye, target, fov (vertical, radians), up = +y; screen centre (cx, cy)
  T3.camera = (eye, target, fov = 0.8, o = {}) => {
    const f = V.norm(V.sub(target, eye)), r = V.norm(V.cross(f, [0, 1, 0])), u = V.cross(r, f), k = (H / 2) / Math.tan(fov / 2);
    return { eye, f, r, u, k, cx: o.cx ?? W / 2, cy: o.cy ?? H / 2 };
  };
  T3.project = (cam, p) => { const d = V.sub(p, cam.eye), z = V.dot(d, cam.f); return [cam.cx + V.dot(d, cam.r) * cam.k / z, cam.cy - V.dot(d, cam.u) * cam.k / z, z]; };
  // a face: {pts: [[x,y,z]...] (counter-clockwise seen from outside), col, emit (0..1 self-lit), line (edge colour), alpha, ds (two-sided)}
  T3.face = (pts, col, o = {}) => ({ pts, col, ...o });
  // primitives (centred at c; size w x h x d along x, y, z)
  T3.box = (c, w, h, d, col, o = {}) => {
    const [x, y, z] = c, a = w / 2, b = h / 2, e = d / 2, P = (i, j, k) => [x + i * a, y + j * b, z + k * e];
    const F = [[P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], [P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)], [P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)],
      [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)], [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)], [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)]];
    const names = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    return F.map((pts, i) => ({ pts, col: (o.cols && o.cols[names[i]]) || col, name: names[i], ...o, cols: undefined })).filter(f => !(o.skip || []).includes(f.name));
  };
  // a cylinder along axis 'x' | 'y' | 'z', n sides, with caps
  T3.cyl = (c, r, len, n, col, o = {}) => {
    const ax = o.axis || 'y', out = [], ring = (s) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 + (o.rot || 0), u = Math.cos(a) * r, v = Math.sin(a) * r;
      return ax === 'y' ? [c[0] + u, c[1] + s, c[2] + v] : ax === 'x' ? [c[0] + s, c[1] + u, c[2] + v] : [c[0] + u, c[1] + v, c[2] + s]; });
    const A = ring(-len / 2), B = ring(len / 2);
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; out.push({ pts: ax === 'y' ? [A[j], A[i], B[i], B[j]] : [A[i], A[j], B[j], B[i]], col: o.side || col, ...o }); }   // outward normals
    if (o.caps !== false) { out.push({ pts: ax === 'y' ? B.slice().reverse() : B.slice(), col: o.cap || col, ...o }); out.push({ pts: ax === 'y' ? A.slice() : A.slice().reverse(), col: o.cap || col, ...o }); }
    return out;
  };
  // transform a list of faces by fn(point)
  T3.map = (faces, fn) => faces.map(f => ({ ...f, pts: f.pts.map(fn) }));
  T3.move = (faces, d) => T3.map(faces, p => V.add(p, d));
  // render: light = direction towards the light; amb = ambient; fog = {col, near, far}
  T3.render = (ctx, cam, faces, o = {}) => {
    const L = V.norm(o.light || [-0.4, 0.8, 0.6]), amb = o.amb ?? 0.35, list = [];
    for (const f of faces) {
      if (f.alpha === 0) continue;
      const p0 = f.pts[0], n = V.norm(V.cross(V.sub(f.pts[1], p0), V.sub(f.pts[2], p0)));
      const c = f.pts.reduce((a, p) => V.add(a, p), [0, 0, 0]).map(v => v / f.pts.length), toEye = V.sub(cam.eye, c);
      let facing = V.dot(n, toEye) > 0; if (!facing && !f.ds) continue;
      const pr = f.pts.map(p => T3.project(cam, p)); if (pr.some(q => q[2] <= (o.near ?? 1))) continue;
      const nn = facing ? n : V.mul(n, -1), diff = Math.max(0, V.dot(nn, L)), spec = Math.pow(Math.max(0, V.dot(V.norm(V.add(L, V.norm(toEye))), nn)), o.shine ?? 24) * (f.spec ?? o.spec ?? 0.25);
      const depth = Math.hypot(toEye[0], toEye[1], toEye[2]) + (f.bias || 0);
      list.push({ f, pr, k: f.emit ? 1 : amb + (1 - amb) * diff, spec, depth });
    }
    list.sort((a, b) => b.depth - a.depth);
    for (const it of list) {
      const { f, pr } = it, rgb = parseColor(f.col);
      let k = it.k, r = rgb[0] * k + 255 * it.spec, g = rgb[1] * k + 255 * it.spec, b = rgb[2] * k + 255 * it.spec;
      if (o.fog) { const q = clamp((it.depth - o.fog.near) / (o.fog.far - o.fog.near)), fc = parseColor(o.fog.col); r = lerp(r, fc[0], q); g = lerp(g, fc[1], q); b = lerp(b, fc[2], q); }
      ctx.beginPath(); pr.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath();
      ctx.globalAlpha = f.alpha ?? 1; ctx.fillStyle = `rgb(${Math.min(255, r) | 0},${Math.min(255, g) | 0},${Math.min(255, b) | 0})`; ctx.fill();
      if (f.line || o.line) { ctx.strokeStyle = f.line || o.line; ctx.lineWidth = f.lw ?? o.lw ?? 1.2; ctx.lineJoin = 'round'; ctx.stroke(); }
      else { ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.8; ctx.stroke(); }   // hides hairline gaps between faces
      ctx.globalAlpha = 1;
    }
    return list.length;
  };
  // ───────── the machine (world units: metres; the floor is y = 0) ─────────
  const K = { T3 };
  K.COL = { bg: '#0E1116', case: '#383E48', caseIn: '#4A515C', trim: '#F28C28', metal: '#A9B2BC', dark: '#1C2026', heat: '#FF7A1A', bean0: '#8DA35A', bean1: '#5A3A22', floor: '#16191F', ink: '#F3F1EC', ink2: '#B9BEC6' };
  K.stage = (ctx, cam, o = {}) => {
    ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H);
    // the floor disc under the spotlight, then the cone of light
    const c = T3.project(cam, [0, 0, 0]);
    const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 760); g.addColorStop(0, 'rgba(255,214,170,0.22)'); g.addColorStop(1, 'rgba(255,214,170,0)');
    ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, 0.32); ctx.translate(-c[0], -c[1]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], 760, 0, TAU); ctx.fill(); ctx.restore();
    const top = T3.project(cam, [0, 4.2, 0]);
    ctx.save(); const lg = ctx.createLinearGradient(top[0], top[1], c[0], c[1]); lg.addColorStop(0, 'rgba(255,230,200,0.10)'); lg.addColorStop(1, 'rgba(255,230,200,0.02)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(top[0] - 40, top[1]); ctx.lineTo(top[0] + 40, top[1]); ctx.lineTo(c[0] + 620, c[1]); ctx.lineTo(c[0] - 620, c[1]); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  // s = {open: 0..1 casing off, drum: angle, fan: angle, arm: angle, heat: 0..1, roast: 0..1}
  K.faces = (s) => {
    const C = K.COL, F = [], o = clamp(s.open || 0);
    // casing: the front and right panels slide away as it opens; the inside walls are lighter
    const caseF = T3.box([0, 0.55, 0], 1.0, 1.0, 0.9, C.case, { skip: ['front', 'right', 'bottom'], spec: 0.35 });
    F.push(...caseF);
    if (o < 1) { F.push(...T3.move(T3.box([0, 0.55, 0.45], 1.0, 1.0, 0.03, C.case, { spec: 0.4 }), [0, 0, o * 0.9]).map(f => ({ ...f, alpha: 1 - o })));
                 F.push(...T3.move(T3.box([0.5, 0.55, 0], 0.03, 1.0, 0.9, C.case, { spec: 0.4 }), [o * 0.9, 0, 0]).map(f => ({ ...f, alpha: 1 - o }))); }
    if (o > 0) F.push(...T3.box([0, 0.55, 0], 0.96, 0.96, 0.86, C.caseIn, { ds: true, skip: ['front', 'right', 'top'], spec: 0.05 }).map(f => ({ ...f, bias: 0.02 })));
    // trim and the base
    F.push(...T3.box([0, 0.03, 0], 1.06, 0.06, 0.96, C.trim, { spec: 0.3 }));
    F.push(...T3.box([0, 1.06, 0], 1.04, 0.04, 0.94, C.trim, { spec: 0.3 }));
    // the hopper on top
    F.push(...T3.cyl([-0.18, 1.18, -0.05], 0.13, 0.22, 16, C.metal, { spec: 0.6, cap: C.dark }));
    // the drum (axis x), its open end towards +x, turning
    F.push(...T3.cyl([-0.08, 0.66, 0], 0.22, 0.56, 18, C.metal, { axis: 'x', rot: s.drum || 0, caps: false, ds: true, spec: 0.7 }));
    F.push(...T3.cyl([-0.36, 0.66, 0], 0.22, 0.01, 18, C.dark, { axis: 'x', caps: true, ds: true }));
    for (let i = 0; i < 6; i++) { const a = (s.drum || 0) + i / 6 * TAU; F.push(...T3.box([-0.08, 0.66 + Math.sin(a) * 0.2, Math.cos(a) * 0.2], 0.54, 0.018, 0.018, '#7E8792', { spec: 0.4 })); }
    // the heater coils under the drum, glowing with s.heat
    const hc = mix('#3A2A20', C.heat, clamp(s.heat ?? 0));
    for (let i = 0; i < 5; i++) F.push(...T3.box([-0.3 + i * 0.12, 0.38, 0], 0.05, 0.03, 0.42, hc, { emit: (s.heat ?? 0) > 0.4 ? 1 : 0 }));
    // the exhaust fan at the back (axis z), turning
    F.push(...T3.cyl([0.28, 0.66, -0.36], 0.16, 0.05, 18, C.dark, { axis: 'z' }));
    for (let i = 0; i < 4; i++) { const a = (s.fan || 0) + i / 4 * TAU; F.push(...T3.map(T3.box([0, 0.08, 0], 0.05, 0.14, 0.01, C.metal, { spec: 0.5 }), p => T3.v.add(T3.rz(p, a), [0.28, 0.66, -0.32]))); }
    // the cooling tray (axis y) at the front, its stirring arm turning
    F.push(...T3.cyl([0.12, 0.17, 0.16], 0.26, 0.06, 24, '#3B414B', { cap: '#555D68', spec: 0.3 }));
    F.push(...T3.map(T3.box([0, 0, 0.12], 0.03, 0.03, 0.24, C.trim), p => T3.v.add(T3.ry(p, s.arm || 0), [0.12, 0.215, 0.16])));
    // the chaff collector, top right
    F.push(...T3.cyl([0.3, 0.86, 0.1], 0.08, 0.2, 14, '#6A727E', { spec: 0.5 }));
    return F;
  };
  // the beans: in the drum (tumbling low in it, turned by the drum) and in the tray (swept by the arm)
  K.beans = (ctx, cam, s, where = 'drum') => {
    const C = K.COL, col = mix(C.bean0, C.bean1, clamp(s.roast ?? 0)), n = where === 'drum' ? 70 : 60, out = [];
    for (let i = 0; i < n; i++) {
      let p;
      if (where === 'drum') { const a = -Math.PI / 2 + 0.55 + (hash(i * 3.1) - 0.5) * 1.6 + Math.sin((s.drum || 0) * 1.3 + i) * 0.25, r = 0.06 + hash(i * 5.7) * 0.14;
        p = [-0.32 + hash(i * 7.3) * 0.5, 0.66 + Math.sin(a) * r, Math.cos(a) * r]; }
      else { const a = hash(i * 2.2) * TAU + (s.arm || 0) * (0.3 + hash(i) * 0.2), r = Math.sqrt(hash(i * 9.1)) * 0.23; p = [0.12 + Math.cos(a) * r, 0.205, 0.16 + Math.sin(a) * r]; }
      const q = T3.project(cam, p); if (q[2] > 0.1) out.push([q, i]);
    }
    out.sort((a, b) => b[0][2] - a[0][2]);
    for (const [q, i] of out) { const r = 0.016 * cam.k / q[2]; ctx.save(); ctx.translate(q[0], q[1]); ctx.rotate(hash(i) * 3); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, r * 0.2); ctx.beginPath(); ctx.moveTo(-r, 0); ctx.quadraticCurveTo(0, r * 0.3, r, 0); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.4, r * 0.4, r * 0.25, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  };
  // a dark veil from the left edge, so the lines stay readable over the machine
  K.scrim = (ctx, a = 0.85, x1 = 1050) => { const g = ctx.createLinearGradient(0, 0, x1, 0); g.addColorStop(0, `rgba(14,17,22,${a})`); g.addColorStop(0.55, `rgba(14,17,22,${a * 0.75})`); g.addColorStop(1, 'rgba(14,17,22,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, x1, H); };
  K.f = (size, w = 900) => `${w} ${size}px ${FAM.display}`;
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size, o.w ?? 900); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillText(s, x, y); ctx.restore(); };
  K.rise = (ctx, s, x, y, size, lt, o = {}) => { const p = Ease.outExpo(clamp((lt - (o.at ?? 0)) / 0.6)); if (p <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 1.1, W, size * 1.45); ctx.clip(); K.text(ctx, s, x, y + size * 0.9 * (1 - p), size, { ...o, alpha: (o.alpha ?? 1) * clamp(p * 2) }); ctx.restore(); };
  // a label pinned to a 3D point: a dot, a line up and out, a tag
  K.pin = (ctx, cam, pt, to, s, p) => {
    if (p <= 0) return; const q = T3.project(cam, pt), C = K.COL;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.fillStyle = C.trim; ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(243,241,236,0.8)'; ctx.lineWidth = 2; const e = Ease.ioC(clamp(p * 1.5)); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(lerp(q[0], to[0], e), lerp(q[1], to[1], e)); ctx.stroke();
    if (p > 0.5) { ctx.font = K.f(40, 800); const w = ctx.measureText(s).width + 36, x = to[0] > q[0] ? to[0] : to[0] - w; ctx.fillStyle = 'rgba(20,23,28,0.85)'; ctx.beginPath(); ctx.roundRect(x, to[1] - 34, w, 64, 12); ctx.fill();
      ctx.strokeStyle = C.trim; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = C.ink; ctx.fillText(s, x + 18, to[1] + 12); }
    ctx.restore();
  };
  // the front display: 220°C in orange, drawn in 2D over the front panel's centre
  K.display = (ctx, cam, s, val, a = 1) => {
    if (a <= 0.01) return; const q = T3.project(cam, [0.18, 0.78, 0.46 + (s.open || 0) * 0.9]), sz = 0.095 * cam.k / q[2];
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#0A0C10'; ctx.beginPath(); ctx.roundRect(q[0] - sz * 1.6, q[1] - sz * 0.7, sz * 3.2, sz * 1.4, sz * 0.2); ctx.fill();
    ctx.font = `700 ${sz * 0.9}px ${FAM.mono}`; ctx.fillStyle = K.COL.trim; ctx.shadowColor = K.COL.trim; ctx.shadowBlur = 12; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(val, q[0], q[1] + 2); ctx.restore();
  };
  window.BREW = K;
})();

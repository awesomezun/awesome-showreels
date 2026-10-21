// rock: the 번개다방 reel's kit (a project module). A rock stage in 2D that reacts to each instrument separately: the
// arranger's own drum hits and guitar and bass notes are recorded into modules/envmap.js, and K.ev() turns them into
// envelopes at any time t, so the kick drives the floor lights and the crowd, the snare the lightning and the strobe,
// the guitar the speaker cones and the guitarist's glow, the bass the rings on the floor, the hats the cymbals.
(() => {
  const K = {}, COL = { bg: '#050506', ink: '#FFFFFF', bolt: '#FFE14D', red: '#FF3B30', dark: '#0A0A0C', amp: '#141416' };
  K.COL = COL;
  // ───────── envelopes from the recorded events ─────────
  const lastIdx = (arr, t, key) => { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1, v = key ? arr[m][0] : arr[m]; if (v <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r; };
  const TAU_ = { kick: 0.13, snare: 0.16, hats: 0.06, ohats: 0.18, toms: 0.2 };
  K.ev = (cut, name, t) => {
    const M = window.ENVMAP && window.ENVMAP[cut]; if (!M || !M[name]) return 0; const A = M[name];
    if (name === 'guitar' || name === 'bass') { const i = lastIdx(A, t, true); let v = 0, gmax = name === 'guitar' ? 0.32 : 0.32;
      for (let k = i; k >= 0 && k > i - 6; k--) { const [t0, d, g] = A[k], a = t - t0; if (a < 0 || a > d + 0.15) continue; v = Math.max(v, (g / gmax) * Math.exp(-a / Math.max(0.08, d * 0.45))); }
      return clamp(v); }
    const i = lastIdx(A, t, false); if (i < 0) return 0; return Math.exp(-(t - A[i]) / (TAU_[name] || 0.12));
  };
  K.since = (cut, name, t) => { const A = window.ENVMAP && window.ENVMAP[cut] && window.ENVMAP[cut][name]; if (!A) return 9; const i = lastIdx(A, t, false); return i < 0 ? 9 : t - A[i]; };
  K.count = (cut, name, t) => { const A = window.ENVMAP && window.ENVMAP[cut] && window.ENVMAP[cut][name]; if (!A) return 0; return lastIdx(A, t, typeof A[0] !== 'number') + 1; };
  K.levels = (cut, t) => ({ kick: K.ev(cut, 'kick', t), snare: K.ev(cut, 'snare', t), hats: Math.max(K.ev(cut, 'hats', t), K.ev(cut, 'ohats', t)), toms: K.ev(cut, 'toms', t), guitar: K.ev(cut, 'guitar', t), bass: K.ev(cut, 'bass', t) });
  // ───────── type ─────────
  K.f = (size) => `400 ${size}px ${FAM.display}`;
  K.slam = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.18; if (p <= 0) return; const k = p >= 1 ? 1 + 0.06 * Math.exp(-(p - 1) * 2.5) * Math.cos((p - 1) * 9) : lerp(1.8, 1, Ease.inC(p));
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(o.rot ?? 0); ctx.font = K.f(size); ctx.textAlign = o.align || 'left'; ctx.lineJoin = 'round'; ctx.globalAlpha *= clamp(p * 3) * (o.alpha ?? 1);
    ctx.lineWidth = size * 0.14; ctx.strokeStyle = o.stroke || '#000'; ctx.strokeText(s, 0, 0); ctx.fillStyle = o.color || COL.bolt; ctx.fillText(s, 0, 0); ctx.restore(); };
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size); ctx.textAlign = o.align || 'left'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  // ───────── the lightning bolt (the band's mark) ─────────
  const BOLT = [[0.12, -1], [-0.42, 0.08], [-0.04, 0.08], [-0.22, 1], [0.44, -0.18], [0.04, -0.18], [0.3, -1]];
  K.bolt = (ctx, x, y, s, glow = 0, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0.12);
    const path = () => { ctx.beginPath(); BOLT.forEach(([u, v], i) => i ? ctx.lineTo(u * s, v * s) : ctx.moveTo(u * s, v * s)); ctx.closePath(); };
    if (glow > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = COL.bolt; ctx.shadowBlur = 80 * glow; path(); ctx.fillStyle = `rgba(255,225,77,${0.5 * glow})`; ctx.fill(); ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over'; }
    path(); ctx.fillStyle = o.fill || mix('#5A4A10', COL.bolt, 0.35 + 0.65 * glow); ctx.fill(); ctx.lineWidth = o.lw ?? 6; ctx.strokeStyle = o.stroke || '#000'; ctx.stroke(); ctx.restore(); };
  // a real crack of lightning from (x0, y0) down to (x1, y1): jagged, branching, seeded per hit
  K.crack = (ctx, x0, y0, x1, y1, a, seed) => { if (a <= 0.02) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const seg = 14, pts = [[x0, y0]]; for (let i = 1; i <= seg; i++) { const k = i / seg; pts.push([lerp(x0, x1, k) + (i < seg ? (hash(seed * 13 + i) - 0.5) * 120 : 0), lerp(y0, y1, k)]); }
    for (const [w, al, c] of [[18, 0.25, '255,225,77'], [7, 0.7, '255,240,180'], [2.5, 1, '255,255,255']]) { ctx.strokeStyle = `rgba(${c},${al * a})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
    for (let b = 0; b < 3; b++) { const i = 3 + Math.floor(hash(seed + b) * 8), [bx, by] = pts[i]; ctx.strokeStyle = `rgba(255,240,180,${0.6 * a})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by);
      let x = bx, y = by; for (let j = 0; j < 4; j++) { x += (hash(seed * 7 + b * 5 + j) - 0.3) * 70 * (b % 2 ? -1 : 1); y += 40; ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.restore(); };
  // ───────── the stage ─────────
  const LIGHTS = [[250, '#FFE14D'], [560, '#FF3B30'], [850, '#FFFFFF'], [1070, '#FFFFFF'], [1360, '#FF3B30'], [1670, '#FFE14D']];
  K.backdrop = (ctx, L, o = {}) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#050506'); g.addColorStop(0.62, mix('#1A0606', '#3A0A0A', L.kick * (o.hot ?? 1))); g.addColorStop(1, '#050506');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  K.beams = (ctx, t, L, o = {}) => { const on = o.on ?? 1; if (on <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    LIGHTS.forEach(([x, c], i) => { const sw = Math.sin(t * (0.9 + i * 0.13) + i * 1.7) * 0.32 + (o.cross ? (i < 3 ? 0.25 : -0.25) : 0), len = 1100, a = on * (0.16 + 0.22 * L.kick + (o.boost ?? 0));
      const ex = x + Math.sin(sw) * len, ey = 110 + Math.cos(sw) * len, spread = 150; const gg = ctx.createLinearGradient(x, 110, ex, ey); const rgb = parseColor(c);
      gg.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`); gg.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`); ctx.fillStyle = gg;
      ctx.beginPath(); ctx.moveTo(x - 10, 112); ctx.lineTo(x + 10, 112); ctx.lineTo(ex + spread * Math.cos(sw), ey - spread * Math.sin(sw)); ctx.lineTo(ex - spread * Math.cos(sw), ey + spread * Math.sin(sw)); ctx.closePath(); ctx.fill(); });
    ctx.restore(); };
  K.truss = (ctx, L, o = {}) => { ctx.fillStyle = '#1A1A1E'; ctx.fillRect(0, 92, W, 16); ctx.strokeStyle = '#2A2A30'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = 0; x < W; x += 40) { ctx.moveTo(x, 92); ctx.lineTo(x + 20, 108); ctx.lineTo(x + 40, 92); } ctx.stroke();
    LIGHTS.forEach(([x, c]) => { ctx.fillStyle = '#0E0E10'; ctx.beginPath(); ctx.roundRect(x - 26, 104, 52, 34, 8); ctx.fill(); ctx.fillStyle = mix('#3A3A3A', c, (o.on ?? 1) * (0.5 + 0.5 * L.kick)); ctx.beginPath(); ctx.arc(x, 128, 14, 0, TAU); ctx.fill(); }); };
  // an amp stack: cabinets with four speakers each that pump with the guitar (or the bass on the right)
  K.amps = (ctx, x0, L, drive, o = {}) => { for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const x = x0 + c * 222, y = 452 + r * 156, w = 214, h = 150;
      ctx.fillStyle = COL.amp; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = '#2C2C30'; ctx.lineWidth = 4; ctx.stroke();
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const cx = x + 56 + i * 102, cy = y + 40 + j * 70, R = 30 * (1 + 0.08 * drive), g = ctx.createRadialGradient(cx, cy, 2, cx, cy, R);
        g.addColorStop(0, '#3A3A40'); g.addColorStop(0.35, '#1C1C20'); g.addColorStop(0.8, '#2A2A30'); g.addColorStop(1, '#0A0A0C'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
        if (drive > 0.05) { ctx.strokeStyle = `rgba(255,225,77,${0.5 * drive})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R + 4 + 6 * drive, 0, TAU); ctx.stroke(); } }
      ctx.fillStyle = '#C9C2B0'; ctx.fillRect(x + w / 2 - 26, y + h - 14, 52, 8); } };
  // a person in silhouette, rim-lit; pose: {bob, lean, armL: [[ex, ey], [hx, hy]], armR, legs}
  K.person = (ctx, x, y, s, pose, rim = COL.bolt) => {
    const P = (u, v) => [x + u * s, y + v * s], hip = P(pose.lean * 10, -140), sh = P(pose.lean * 30, -250), head = P(pose.lean * 44 + (pose.headX ?? 0), -288 + (pose.bob ?? 0));
    const limb = (pts, w) => { ctx.lineWidth = w * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([u, v], i) => i ? ctx.lineTo(u, v) : ctx.moveTo(u, v)); ctx.stroke(); };
    const body = (col, dx, dy) => { ctx.save(); ctx.translate(dx, dy); ctx.strokeStyle = col; ctx.fillStyle = col;
      limb([[hip[0] - 18 * s, hip[1]], P(-44 - (pose.stance ?? 0), 0)], 30); limb([[hip[0] + 18 * s, hip[1]], P(44 + (pose.stance ?? 0), 0)], 30);
      ctx.beginPath(); ctx.moveTo(sh[0] - 50 * s, sh[1]); ctx.lineTo(sh[0] + 50 * s, sh[1]); ctx.lineTo(hip[0] + 32 * s, hip[1]); ctx.lineTo(hip[0] - 32 * s, hip[1]); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(head[0], head[1], 28 * s, 0, TAU); ctx.fill();
      ctx.lineWidth = 7 * s; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(head[0] + i * 10 * s, head[1] - 10 * s); ctx.quadraticCurveTo(head[0] + i * 14 * s, head[1] + 40 * s, head[0] + i * 16 * s + (pose.hair ?? 0) * 30 * s, head[1] + 70 * s); ctx.stroke(); }
      if (pose.armL) limb([[sh[0] - 44 * s, sh[1] + 6 * s], ...pose.armL], 20); if (pose.armR) limb([[sh[0] + 44 * s, sh[1] + 6 * s], ...pose.armR], 20); ctx.restore(); };
    body(rim, -4, -3); body(COL.dark, 0, 0);
    return { hip, sh, head };
  };
  // a guitar (or a bass: longer neck) centred on (cx, cy) at angle a; the body lights with g
  K.guitar = (ctx, cx, cy, a, s, col, g = 0, bass = false) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    const nl = (bass ? 300 : 240) * s; ctx.fillStyle = '#1A1208'; ctx.fillRect(10 * s, -7 * s, nl, 14 * s); ctx.fillStyle = '#0A0A0C'; ctx.beginPath(); ctx.roundRect(10 * s + nl, -12 * s, 50 * s, 24 * s, 6 * s); ctx.fill();
    if (g > 0.05) { ctx.shadowColor = col; ctx.shadowBlur = 40 * g; }
    ctx.fillStyle = mix('#3A0A0A', col, 0.55 + 0.45 * g); ctx.beginPath(); ctx.ellipse(-40 * s, 0, 62 * s, 54 * s, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(18 * s, 0, 44 * s, 42 * s, 0, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = '#0A0A0C'; ctx.fillRect(-60 * s, -22 * s, 10 * s, 44 * s); ctx.beginPath(); ctx.arc(-6 * s, 0, 14 * s, 0, TAU); ctx.fill();
    ctx.restore(); };
  // the drummer and the kit; the kick's head carries the band's mark
  K.drums = (ctx, t, L, cut, o = {}) => { const cx = 960, fy = 760;
    ctx.fillStyle = '#121214'; ctx.fillRect(cx - 280, fy - 70, 560, 70); ctx.fillStyle = '#1E1E22'; ctx.fillRect(cx - 280, fy - 70, 560, 6);
    // the drummer behind
    const ls = K.since(cut, 'snare', t), rs = Math.min(K.since(cut, 'hats', t), K.since(cut, 'ohats', t)), up = v => clamp(v / 0.2);
    K.person(ctx, cx, fy - 70, 0.8, { lean: 0, bob: 8 * L.kick, armL: [[cx - 70, fy - 250], [cx - 120 + 40 * up(ls), fy - 230 - 70 * up(ls)]], armR: [[cx + 70, fy - 250], [cx + 140 - 30 * up(rs), fy - 240 - 50 * up(rs)]], hair: 0.3 * L.kick }, o.rim || COL.red);
    // cymbals and toms
    for (const [x, y, w, k] of [[cx - 230, fy - 300, 110, L.hats], [cx + 240, fy - 320, 130, L.snare * 0.6 + L.hats * 0.4]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(0.12 * k * Math.sin(t * 40)); ctx.fillStyle = mix('#7A6A30', '#FFE9A0', k); ctx.beginPath(); ctx.ellipse(0, 0, w, 14, 0, 0, TAU); ctx.fill(); ctx.restore(); ctx.fillStyle = '#2A2A2E'; ctx.fillRect(x - 3, y + 10, 6, fy - 70 - y - 10); }
    for (const [x, y, r] of [[cx - 110, fy - 210, 48], [cx + 110, fy - 210, 52]]) { ctx.fillStyle = '#1A1A1E'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.45, 0, 0, TAU); ctx.fill(); ctx.fillStyle = mix('#5A5650', '#EDE6D6', 0.3 + 0.7 * L.toms); ctx.beginPath(); ctx.ellipse(x, y - 6, r * 0.9, r * 0.36, 0, 0, TAU); ctx.fill(); }
    const kr = 108 * (1 + 0.05 * L.kick); ctx.fillStyle = '#0A0A0C'; ctx.beginPath(); ctx.arc(cx, fy - 120, kr + 12, 0, TAU); ctx.fill(); ctx.fillStyle = mix('#BDB5A2', '#FFFFFF', L.kick); ctx.beginPath(); ctx.arc(cx, fy - 120, kr, 0, TAU); ctx.fill();
    K.bolt(ctx, cx, fy - 146, 54 * (1 + 0.05 * L.kick), 0, { lw: 4 }); ctx.save(); ctx.font = K.f(30); ctx.textAlign = 'center'; ctx.fillStyle = '#000'; ctx.fillText('번개다방', cx, fy - 44); ctx.restore(); };
  // rings on the floor for the bass
  K.floor = (ctx, t, L, cut) => { const g = ctx.createLinearGradient(0, 760, 0, H); g.addColorStop(0, mix('#1A1010', '#5A1414', L.kick)); g.addColorStop(1, '#050506'); ctx.fillStyle = g; ctx.fillRect(0, 760, W, H - 760);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const A = window.ENVMAP && window.ENVMAP[cut] && window.ENVMAP[cut].bass || [];
    const i0 = lastIdx(A, t, true); for (let k = i0; k >= 0 && k > i0 - 6; k--) { const a = t - A[k][0]; if (a < 0 || a > 0.9) continue; const r = 120 + a * 900; ctx.strokeStyle = `rgba(255,59,48,${0.5 * (1 - a / 0.9) * A[k][2] / 0.32})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(1330, 860, r, r * 0.16, 0, 0, TAU); ctx.stroke(); }
    ctx.restore(); };
  // the crowd in front: heads, shoulders, horns up; they jump with the kick
  K.crowd = (ctx, t, L, o = {}) => { ctx.fillStyle = '#030304'; const jump = o.jump ?? 1;
    for (let i = 0; i < 26; i++) { const x = i * 78 + (i % 2) * 20 - 20, ph = hash(i * 3.3), b = jump * L.kick * (14 + 10 * ph) * (Math.sin(i + t * 2) > -0.3 ? 1 : 0.4), y = 1000 + ph * 40 - b;
      ctx.beginPath(); ctx.arc(x, y - 70, 34, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 60, y - 40, 120, 160, 40); ctx.fill();
      if (i % 3 === 1) { const ax = x + (ph - 0.5) * 50, hy = y - 190 - b * 1.5 - 20 * Math.sin(t * 3 + i); ctx.strokeStyle = '#030304'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 30, y - 30); ctx.lineTo(ax, hy); ctx.stroke();
        ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(ax - 8, hy); ctx.lineTo(ax - 14, hy - 34); ctx.moveTo(ax + 8, hy); ctx.lineTo(ax + 14, hy - 34); ctx.stroke(); } } };
  // the channel meters: one bar per instrument, LED segments
  K.meters = (ctx, x, y, L, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.beginPath(); ctx.roundRect(x, y, 470, 286, 18); ctx.fill(); ctx.strokeStyle = '#2C2C30'; ctx.lineWidth = 3; ctx.stroke();
    [['킥', L.kick], ['스네어', L.snare], ['베이스', L.bass], ['기타', L.guitar]].forEach(([s, v], i) => { const yy = y + 52 + i * 62; K.text(ctx, s, x + 24, yy + 14, 40, { color: '#D8D2C2' });
      for (let k = 0; k < 12; k++) { const on = v * 12 > k; ctx.fillStyle = on ? (k < 7 ? '#5BD27A' : k < 10 ? COL.bolt : COL.red) : '#1E1E22'; ctx.fillRect(x + 168 + k * 24, yy - 16, 18, 34); } });
    ctx.restore(); };
  // the amp knob for the opening: 0 to 11
  K.knob = (ctx, x, y, r, v, glow = 0) => { const a0 = -Math.PI * 1.25, a1 = Math.PI * 0.25, ang = lerp(a0, a1, v / 11);
    for (let n = 0; n <= 11; n++) { const an = lerp(a0, a1, n / 11), lit = v >= n - 0.01; K.text(ctx, String(n), x + Math.cos(an) * (r + 70), y + Math.sin(an) * (r + 70) + 20, n === 11 ? 72 : 48, { align: 'center', color: lit ? (n === 11 ? COL.red : COL.bolt) : '#3A3A40' });
      ctx.strokeStyle = lit ? COL.bolt : '#2A2A30'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * (r + 14), y + Math.sin(an) * (r + 14)); ctx.lineTo(x + Math.cos(an) * (r + 34), y + Math.sin(an) * (r + 34)); ctx.stroke(); }
    if (glow > 0) { ctx.save(); ctx.shadowColor = COL.bolt; ctx.shadowBlur = 60 * glow; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
    for (let i = 0; i < 48; i++) { const an = i / 48 * TAU; ctx.fillStyle = i % 2 ? '#2A2A2E' : '#3A3A40'; ctx.beginPath(); ctx.arc(x + Math.cos(an) * r, y + Math.sin(an) * r, 12, 0, TAU); ctx.fill(); }
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, 10, x, y, r); g.addColorStop(0, '#5A5A62'); g.addColorStop(0.6, '#26262C'); g.addColorStop(1, '#141416'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r - 4, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#E8E4DA'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r * 0.25, y + Math.sin(ang) * r * 0.25); ctx.lineTo(x + Math.cos(ang) * r * 0.86, y + Math.sin(ang) * r * 0.86); ctx.stroke(); };
  // the guitarist (left, red guitar) and the bassist (right, orange bass): they bang their heads on the kick, the
  // picking hand strums up and down on every guitar or bass note, and each instrument glows while it sounds
  K.band = (ctx, t, L, cut, o = {}) => { const dim = o.dim ?? 0;
    const player = (x, name, col, rim, bass) => { const lvl = bass ? L.bass : L.guitar, n = K.count(cut, name, t), sn = K.since(cut, name, t), dir = n % 2 ? 1 : -1, st = dir * 20 * (1 - Math.exp(-sn / 0.05));
      const y = 860, pose = { lean: -0.15 * L.kick, bob: 18 * L.kick, hair: 0.8 * L.kick * (bass ? -1 : 1), stance: 14,
        armL: [[x - 74, y - 196], [x - 18, y - 160 + st]], armR: [[x + 96, y - 214], [x + (bass ? 200 : 168), y - 236]] };
      ctx.save(); if (dim) ctx.globalAlpha *= 1 - dim;
      K.person(ctx, x, y, 1, pose, rim); K.guitar(ctx, x + 6, y - 150, -0.42, 1, col, lvl * (1 - dim), bass);
      ctx.strokeStyle = COL.dark; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 74, y - 196); ctx.lineTo(x - 18, y - 160 + st); ctx.stroke(); ctx.restore(); };
    player(600, 'guitar', '#E8282B', o.rimG || COL.bolt, false); if (!o.soloOnly) player(1330, 'bass', '#F08A24', COL.red, true); };
  // the whole stage, back to front (no crowd, no text)
  K.stage = (ctx, t, L, cut, o = {}) => { K.backdrop(ctx, L, o); K.floor(ctx, t, L, cut); K.beams(ctx, t, L, o); K.truss(ctx, L, o);
    K.bolt(ctx, 960, 290, 150, Math.max(L.snare * (o.boltOn ?? 1), 0.15), { lw: 8 });
    K.amps(ctx, 120, L, L.guitar * (o.on ?? 1)); K.amps(ctx, 1356, L, L.bass * (o.on ?? 1)); K.drums(ctx, t, L, cut, o); K.band(ctx, t, L, cut, o); };
  window.ROCK = K;
})();

// holo: the 오르빗 컨트롤 reel's kit (a project module). A hologram over a projector: a wireframe globe with a dot-matrix
// land mask, 300 satellites on orbital planes in three shells, orbit rings, floating UI panels with corner brackets,
// all in additive light blue with scanlines and flicker. Display type Orbit, data type Nanum Gothic Coding.
(() => {
  const K = {}, COL = { bg: '#04060E', holo: '#56D8FF', holo2: '#A8ECFF', warn: '#FF9A3C', ink: '#E8F8FF', ink2: '#7FA9C0' };
  K.COL = COL;
  const rgba = (hex, a) => { const c = parseColor(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  K.rgba = rgba;
  K.fd = (size) => `400 ${size}px ${FAM.display}`; K.fm = (size, w = 700) => `${w} ${size}px ${FAM.mono}`;
  // view: globe centre (cx, cy), radius R, yaw, tilt; camera distance for a mild perspective
  K.view = (cx, cy, R, yaw, tilt = 0.38) => ({ cx, cy, R, yaw, tilt, d: 5 });
  K.proj = (v, p) => { let [x, y, z] = p; const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw); [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    const ct = Math.cos(v.tilt), st = Math.sin(v.tilt); [y, z] = [y * ct - z * st, y * st + z * ct]; const k = v.d / (v.d - z); return [v.cx + x * v.R * k, v.cy - y * v.R * k, z]; };
  // land: a coarse procedural mask on the unit sphere, sampled on a Fibonacci lattice
  const LAND = (() => { const out = [], N = 2600; for (let i = 0; i < N; i++) { const y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996323, x = Math.cos(a) * r, z = Math.sin(a) * r;
      const n = Math.sin(x * 3.1 + 1.3) * Math.cos(y * 2.7 - 0.4) + Math.sin(z * 3.7 + x * 1.9) * 0.8 + Math.cos(y * 5.3 + z * 2.1) * 0.35; if (n > 0.35 && Math.abs(y) < 0.92) out.push([x, y, z]); } return out; })();
  K.globe = (ctx, v, a = 1, o = {}) => { if (a <= 0) return; const cut = o.reveal ?? 2; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.4;
    const line = (pts) => { let prev = null; for (const p of pts) { const q = K.proj(v, p); if (p[1] > cut - 1) { prev = null; continue; } if (prev) { ctx.strokeStyle = rgba(COL.holo, (q[2] > 0 ? 0.55 : 0.14) * a); ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); } prev = q; } };
    for (let la = -75; la <= 75; la += 15) { const r = Math.cos(la * Math.PI / 180), y = Math.sin(la * Math.PI / 180); line(Array.from({ length: 73 }, (_, k) => { const t = k / 72 * TAU; return [Math.cos(t) * r, y, Math.sin(t) * r]; })); }
    for (let lo = 0; lo < 180; lo += 15) { const t = lo * Math.PI / 180; line(Array.from({ length: 61 }, (_, k) => { const p = k / 60 * TAU; return [Math.cos(p) * Math.cos(t), Math.sin(p), Math.cos(p) * Math.sin(t)]; })); }
    for (const p of LAND) { if (p[1] > cut - 1) continue; const q = K.proj(v, p); if (q[2] < -0.05) continue; ctx.fillStyle = rgba(COL.holo2, 0.75 * a * (0.4 + 0.6 * q[2])); ctx.fillRect(q[0] - 2, q[1] - 2, 4, 4); }
    // the rim
    ctx.strokeStyle = rgba(COL.holo, 0.6 * a); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(v.cx, v.cy, v.R * 1.0, 0, TAU); ctx.stroke(); ctx.restore(); };
  // satellites: 300 on planes (shell radius in globe radii, inclination, node, angular speed); fixed for the reel
  const SATS = (() => { const S = []; const plane = (n, r, inc, node, w, ph0) => { for (let k = 0; k < n; k++) S.push({ r, inc, node, w, ph: ph0 + k / n * TAU }); };
    for (let p = 0; p < 8; p++) plane(25, 1.13 + (p % 2) * 0.03, 0.9 + (p % 3) * 0.1, p / 8 * Math.PI, 0.55, p * 0.3);    // LEO 200
    for (let p = 0; p < 3; p++) plane(20, 1.6, 0.96, p / 3 * TAU, 0.22, p);                                           // MEO 60
    plane(40, 2.15, 0.02, 0, 0.08, 0);                                                                               // GEO 40
    return S; })();
  K.SATS = SATS;
  K.satPos = (s, t) => { const a = s.ph + s.w * t, x0 = Math.cos(a) * s.r, z0 = Math.sin(a) * s.r; const y1 = Math.sin(s.inc) * z0, z1 = Math.cos(s.inc) * z0; return [x0 * Math.cos(s.node) - z1 * Math.sin(s.node), y1, x0 * Math.sin(s.node) + z1 * Math.cos(s.node)]; };
  K.rings = (ctx, v, a = 1, which = null) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.2; const seen = new Set();
    SATS.forEach((s, i) => { const key = s.r + '|' + s.inc + '|' + s.node; if (seen.has(key) || (which && !which(s, i))) return; seen.add(key); ctx.strokeStyle = rgba(COL.holo, 0.16 * a); ctx.beginPath();
      for (let k = 0; k <= 96; k++) { const q = K.proj(v, K.satPos({ ...s, ph: k / 96 * TAU, w: 0 }, 0)); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); }); ctx.restore(); };
  K.sats = (ctx, v, t, count = 300, a = 1, o = {}) => { ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < Math.min(count, SATS.length); i++) { const p = K.satPos(SATS[i], t), q = K.proj(v, p), behind = q[2] < 0 && Math.hypot(q[0] - v.cx, q[1] - v.cy) < v.R; const al = a * (behind ? 0.15 : 0.95), sz = o.hi === i ? 9 : 4.6;
      ctx.fillStyle = rgba(o.hi === i ? COL.warn : COL.ink, al); ctx.fillRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz); } ctx.restore(); };
  // the projector: a disc at the bottom and a cone of light up to the hologram
  K.projector = (ctx, x, y, w, top, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y, 0, top); g.addColorStop(0, rgba(COL.holo, 0.22 * a)); g.addColorStop(1, rgba(COL.holo, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w * 0.18, y); ctx.lineTo(x + w * 0.18, y); ctx.lineTo(x + w * 0.62, top); ctx.lineTo(x - w * 0.62, top); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#0A1220'; ctx.beginPath(); ctx.ellipse(x, y + 10, w * 0.26, 26, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(COL.holo, 0.7 * a); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, w * 0.2, 18, 0, 0, TAU); ctx.stroke(); };
  // a floating panel with corner brackets
  K.panel = (ctx, x, y, w, h, a = 1, col = COL.holo) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rgba(col, 0.06); ctx.fillRect(x, y, w, h); ctx.strokeStyle = rgba(col, 0.85); ctx.lineWidth = 2.5;
    for (const [x0, y0, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x0 + dx * 26, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + dy * 26); ctx.stroke(); } ctx.restore(); };
  K.text = (ctx, s, x, y, size, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.font = o.mono ? K.fm(size, o.w) : K.fd(size); ctx.textAlign = o.align || 'left'; ctx.letterSpacing = (o.track ?? 0) + 'px'; ctx.globalAlpha *= a;
    if (o.glow !== false) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = o.color || COL.holo; ctx.shadowBlur = size * 0.35; } ctx.fillStyle = o.color || COL.ink; ctx.fillText(s, x, y); ctx.restore(); };
  // flicker and scanlines over everything
  K.flick = (t, seed = 0) => 0.9 + 0.1 * Math.sin(t * 47 + seed) * Math.sin(t * 13) - (hash(Math.floor(t * 18) + seed) > 0.96 ? 0.35 : 0);
  K.scan = (ctx, t, a = 1) => { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${0.22 * a})`; const off = (t * 60) % 4; for (let y = off; y < H; y += 4) ctx.fillRect(0, y, W, 1.6);
    const by = ((t * 0.35) % 1.3) * H - 100; const g = ctx.createLinearGradient(0, by, 0, by + 120); g.addColorStop(0, 'rgba(86,216,255,0)'); g.addColorStop(0.5, `rgba(86,216,255,${0.05 * a})`); g.addColorStop(1, 'rgba(86,216,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, by, W, 120); ctx.restore(); };
  K.room = (ctx) => { const g = ctx.createRadialGradient(W * 0.6, H * 0.55, 0, W * 0.6, H * 0.55, 1300); g.addColorStop(0, '#0C1828'); g.addColorStop(1, COL.bg); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#060A14'; ctx.fillRect(0, 930, W, H - 930); ctx.strokeStyle = 'rgba(86,216,255,0.08)'; ctx.lineWidth = 1; for (let i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W * 0.6 + i * 60, 930); ctx.lineTo(W * 0.6 + i * 260, H); ctx.stroke(); } };
  window.HOLO = K;
})();

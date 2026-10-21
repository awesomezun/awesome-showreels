// ui: the 하루 세 칸 reel's minimal-UI kit (a project module). A near-white desk with one soft light; cards with two
// layered shadows and a hairline; iOS-like checks and toggles on springs; a progress ring; a macOS arrow cursor that
// glides between targets and clicks (a ripple); and, only when the day is complete, an iridescent bloom and confetti.
(() => {
  const K = {};
  const R = n => hash(n);
  K.COL = { bg: '#F4F5F7', card: '#FFFFFF', ink: '#1F2430', ink2: '#5A6170', muted: '#646B78', line: '#E6E8EC', blue: '#3B6EF5', blueSoft: '#E8EEFE', green: '#2BB673' };
  K.f = (size, w = 600) => `${w} ${size}px ${FAM.display}`;
  K.desk = (ctx, o = {}) => {
    ctx.fillStyle = K.COL.bg; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W * 0.5, -200, 0, W * 0.5, -200, 1500); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  K.card = (ctx, x, y, w, h, o = {}) => {
    const r = o.r ?? 28, a = o.alpha ?? 1; if (a <= 0.002) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.shadowColor = 'rgba(31,36,48,0.06)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2; ctx.fillStyle = o.fill || K.COL.card; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    ctx.shadowColor = 'rgba(31,36,48,0.10)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(31,36,48,0.06)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
  };
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = K.f(size, o.w ?? 600); ctx.fillStyle = o.color || K.COL.ink; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic'; ctx.globalAlpha *= o.alpha ?? 1; ctx.letterSpacing = (o.ls ?? -0.02 * size) + 'px'; ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w; };
  // a spring 0 -> 1 from time `at` (critically damped-ish, a touch of settle)
  K.sp = (lt, at, f = 2.6, z = 0.72) => spring(Math.max(0, lt - at), f, z);
  // a check circle: p = how checked (0..1); draws the ring, then the fill, then the tick
  K.check = (ctx, x, y, r, p, o = {}) => {
    const C = K.COL;
    ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = mix(C.line, C.blue, clamp(p * 2)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    if (p > 0) { ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x, y, r * clamp(p * 1.6), 0, TAU); ctx.fill();
      const tq = clamp((p - 0.35) / 0.65); if (tq > 0) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
        const a = [x - r * 0.42, y + r * 0.02], b = [x - r * 0.1, y + r * 0.32], c = [x + r * 0.45, y - r * 0.3];
        ctx.moveTo(a[0], a[1]); if (tq < 0.4) ctx.lineTo(lerp(a[0], b[0], tq / 0.4), lerp(a[1], b[1], tq / 0.4)); else { ctx.lineTo(b[0], b[1]); ctx.lineTo(lerp(b[0], c[0], (tq - 0.4) / 0.6), lerp(b[1], c[1], (tq - 0.4) / 0.6)); } ctx.stroke(); } }
    ctx.restore();
  };
  K.toggle = (ctx, x, y, p, o = {}) => {
    const w = o.w ?? 96, h = o.h ?? 56, C = K.COL;
    ctx.save(); ctx.fillStyle = mix('#E3E5EA', o.on || C.blue, clamp(p)); ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
    const kx = x + h / 2 + (w - h) * p; ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(kx, y + h / 2, h / 2 - 4, 0, TAU); ctx.fill(); ctx.restore();
  };
  K.ring = (ctx, x, y, r, p, o = {}) => {
    ctx.save(); ctx.lineWidth = o.w ?? 14; ctx.lineCap = 'round'; ctx.strokeStyle = K.COL.line; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    if (p > 0) { ctx.strokeStyle = o.color || K.COL.blue; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p)); ctx.stroke(); }
    ctx.restore();
  };
  // the arrow cursor at (x, y) (its tip), pressed = 0..1 (scales down a little), plus a click ripple at age `ripple`
  K.cursor = (ctx, x, y, o = {}) => {
    if (o.ripple != null && o.ripple >= 0 && o.ripple < 0.5) { const q = o.ripple / 0.5; ctx.save(); ctx.strokeStyle = K.COL.blue; ctx.globalAlpha = 0.5 * (1 - q); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 12 + 40 * q, 0, TAU); ctx.stroke(); ctx.restore(); }
    const s = (o.s ?? 1.6) * (1 - 0.12 * (o.pressed ?? 0));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 24); ctx.lineTo(6, 18.5); ctx.lineTo(10, 27.5); ctx.lineTo(14, 25.8); ctx.lineTo(10, 17); ctx.lineTo(17.5, 17); ctx.closePath();
    ctx.fillStyle = '#111'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 1.6; ctx.strokeStyle = '#FFF'; ctx.stroke(); ctx.restore();
  };
  // the cursor's path: stops = [[t, x, y, click?]]; returns {x, y, pressed, ripple}
  K.path = (stops, lt) => {
    let i = 0; while (i < stops.length - 1 && stops[i + 1][0] <= lt) i++;
    const [t0, x0, y0] = stops[i], nx = stops[i + 1];
    let x = x0, y = y0;
    if (nx && lt > t0) { const q = Ease.ioC(clamp((lt - t0) / Math.max(0.05, (nx[0] - t0) * 0.75))); x = lerp(x0, nx[1], q); y = lerp(y0, nx[2], q) - Math.sin(Math.PI * q) * 30; }
    let pressed = 0, ripple = null;
    for (const s of stops) if (s[3]) { const d = lt - s[0] - 0.02; if (d >= 0 && d < 0.18) pressed = Math.sin(Math.PI * d / 0.18); if (d >= 0) ripple = d; }
    return { x, y, pressed, ripple };
  };
  // the iridescent bloom: soft conic colours behind the content, k = 0..1
  K.bloom = (ctx, x, y, r, k, t) => {
    if (k <= 0.002) return;
    ctx.save(); ctx.globalAlpha *= k * 0.75; ctx.filter = 'blur(60px)';
    const g = ctx.createConicGradient(t * 0.6, x, y);
    ['#FFB3D1', '#FFD9A8', '#FFF3A8', '#B8F2D0', '#A8DCFF', '#C9B8FF', '#FFB3D1'].forEach((c, i) => g.addColorStop(i / 6, c));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * (0.8 + 0.2 * k), 0, TAU); ctx.fill(); ctx.restore();
  };
  K.confetti = (ctx, x, y, age, o = {}) => {
    if (age < 0 || age > 2.2) return;
    const n = o.n ?? 70, cols = ['#3B6EF5', '#FF7AA8', '#FFC24B', '#2BB673', '#8C6CF2'];
    for (let i = 0; i < n; i++) {
      const a = R(i * 3.1) * TAU, v = 380 + R(i * 7.3) * 620, vx = Math.cos(a) * v, vy = Math.sin(a) * v - 520, g = 1400;
      const px = x + vx * age * (1 - age * 0.18), py = y + vy * age + 0.5 * g * age * age, rot = R(i) * 6 + age * (4 + R(i * 2) * 8);
      ctx.save(); ctx.globalAlpha *= clamp(1 - (age - 1.4) / 0.8); ctx.translate(px, py); ctx.rotate(rot); ctx.fillStyle = cols[i % cols.length];
      if (i % 3) ctx.fillRect(-7, -3.5, 14, 7); else { ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.fill(); } ctx.restore();
    }
  };
  // a soft blue halo that breathes with the beat (life for a held icon)
  K.halo = (ctx, x, y, r, env, a = 1) => {
    const p = beatPulse(env, 3), g = ctx.createRadialGradient(x, y, 0, x, y, r * (1 + 0.15 * p));
    g.addColorStop(0, `rgba(59,110,245,${(0.10 + 0.12 * p) * a})`); g.addColorStop(1, 'rgba(59,110,245,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.2, 0, TAU); ctx.fill();
  };
  // the app icon: a rounded square with three bars, the middle one blue
  K.icon = (ctx, x, y, s, o = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 200, s / 200);
    ctx.shadowColor = 'rgba(31,36,48,0.18)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    const g = ctx.createLinearGradient(-100, -100, 100, 100); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#EEF1F6');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-100, -100, 200, 200, 46); ctx.fill(); ctx.shadowColor = 'transparent';
    [[-52, '#D5DAE3', o.fill?.[0] ?? 1], [0, K.COL.blue, o.fill?.[1] ?? 1], [52, '#D5DAE3', o.fill?.[2] ?? 1]].forEach(([dy, c, f]) => { ctx.fillStyle = '#EEF0F4'; ctx.beginPath(); ctx.roundRect(-58, dy - 15, 116, 30, 15); ctx.fill(); if (f > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(-58, dy - 15, 116 * f, 30, 15); ctx.fill(); } });
    ctx.restore();
  };
  window.UI = K;
})();

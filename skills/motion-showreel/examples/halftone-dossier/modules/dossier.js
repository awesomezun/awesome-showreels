// dossier: the 어디쯤 택배 reel's case-file kit (a project module). A comic detective dossier printed like a
// newspaper: every picture is a halftone (the subject is drawn in grey once, read back, and re-drawn as a rotated grid
// of ink dots sized by its darkness), mounted with a white border and a paperclip; a manila folder, typewritten notes
// with a caret, redaction bars that slide off, push pins and red string on a cork board, rubber stamps that slam with
// a rough edge, and scene changes as a dot wipe (red dots grow over the frame and shrink off the next one).
// Display type is Black Han Sans; the typewriter is Nanum Gothic Coding.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { news: '#EDE8DC', ink: '#1D1B19', red: '#D23B2E', manila: '#D8B878', manila2: '#C29E58', desk: '#3B2F27', cork: '#B98A55', cream: '#F4EFE4' };
  const C = K.COL;
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  const CACHE = new Map();
  const cached = (key, fn) => { if (!CACHE.has(key)) CACHE.set(key, fn()); return CACHE.get(key); };

  // ───────── grounds ─────────
  K.desk = (ctx) => ctx.drawImage(cached('desk', () => { const b = makeBuf(), g = b.g; g.fillStyle = C.desk; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 220; i++) { const y = hash(i * 3.3) * H; g.strokeStyle = `rgba(0,0,0,${0.08 + 0.12 * hash(i)})`; g.lineWidth = 1 + 4 * hash(i * 2); g.beginPath(); for (let x = 0; x <= W; x += 40) { const yy = y + 10 * Math.sin(x * 0.002 + i); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
    const l = g.createRadialGradient(W * 0.45, H * 0.4, 100, W * 0.5, H * 0.5, W * 0.7); l.addColorStop(0, 'rgba(255,220,160,0.22)'); l.addColorStop(1, 'rgba(0,0,0,0.45)'); g.fillStyle = l; g.fillRect(0, 0, W, H); return b.c; }), 0, 0);
  K.cork = (ctx) => ctx.drawImage(cached('cork', () => { const b = makeBuf(), g = b.g; g.fillStyle = C.cork; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 9000; i++) { g.fillStyle = hash(i) > 0.5 ? 'rgba(90,55,25,0.25)' : 'rgba(240,200,140,0.18)'; g.fillRect(hash(i * 1.7) * W, hash(i * 3.9) * H, 2 + 3 * hash(i * 5), 2); }
    const l = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, W * 0.7); l.addColorStop(0, 'rgba(0,0,0,0)'); l.addColorStop(1, 'rgba(0,0,0,0.35)'); g.fillStyle = l; g.fillRect(0, 0, W, H); return b.c; }), 0, 0);
  K.news = (ctx, x, y, w, h) => { ctx.save(); ctx.fillStyle = C.news; ctx.fillRect(x, y, w, h); ctx.restore(); };

  // ───────── halftone ─────────
  // a halftone print of drawFn(g, w, h) (drawn in greys): dots on a grid at 45 degrees, radius from darkness
  K.photo = (key, w, h, drawFn, o = {}) => cached('ph:' + key, () => {
    const src = makeBuf(w, h); src.g.fillStyle = '#FFF'; src.g.fillRect(0, 0, w, h); drawFn(src.g, w, h);
    const px = src.g.getImageData(0, 0, w, h).data, out = makeBuf(w, h), g = out.g, cell = o.cell ?? 9, a = o.angle ?? Math.PI / 4;
    g.fillStyle = o.paper || C.news; g.fillRect(0, 0, w, h); g.fillStyle = o.ink || C.ink;
    const ca = Math.cos(a), sa = Math.sin(a), R = Math.hypot(w, h);
    for (let v = -R; v < R; v += cell) for (let u = -R; u < R; u += cell) {
      const x = w / 2 + u * ca - v * sa, y = h / 2 + u * sa + v * ca; if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
      const xi = Math.min(w - 1, Math.max(0, x | 0)), yi = Math.min(h - 1, Math.max(0, y | 0)), i = (yi * w + xi) * 4;
      const dark = 1 - (0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2]) / 255; if (dark < 0.04) continue;
      g.beginPath(); g.arc(x, y, cell * 0.62 * Math.sqrt(dark), 0, TAU); g.fill();
    }
    return out.c;
  });
  // a print mounted on white with a shadow, a slight tilt and a paperclip (or a pin)
  K.mount = (ctx, img, x, y, rot, s = 1, o = {}) => {
    const w = img.width * s, h = img.height * s, b = o.border ?? 18;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillStyle = C.cream; ctx.fillRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b + (o.caption ? 46 : 0));
    ctx.shadowColor = 'transparent'; ctx.drawImage(img, -w / 2, -h / 2, w, h);
    if (o.caption) { ctx.fillStyle = C.ink; ctx.font = K.F(28, 'mono', 700); ctx.textAlign = 'center'; ctx.fillText(o.caption, 0, h / 2 + b + 30); }
    if (o.clip !== false) { ctx.strokeStyle = '#9CA3A8'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-w / 2 + 30, -h / 2 - b - 22); ctx.lineTo(-w / 2 + 30, -h / 2 + 30); ctx.arc(-w / 2 + 42, -h / 2 + 30, 12, Math.PI, 0, true); ctx.lineTo(-w / 2 + 54, -h / 2 - b - 10); ctx.stroke(); }
    ctx.restore();
  };

  // ───────── grey subjects (drawn once into a photo) ─────────
  const grey = v => { const c = Math.round(255 * v); return `rgb(${c},${c},${c})`; };
  K.drawBox = (g, cx, cy, s, o = {}) => {      // a parcel: a shaded cube with tape and a shipping label
    const top = [[cx - 150 * s, cy - 40 * s], [cx, cy - 115 * s], [cx + 150 * s, cy - 40 * s], [cx, cy + 35 * s]];
    const left = [[cx - 150 * s, cy - 40 * s], [cx, cy + 35 * s], [cx, cy + 215 * s], [cx - 150 * s, cy + 140 * s]];
    const right = [[cx, cy + 35 * s], [cx + 150 * s, cy - 40 * s], [cx + 150 * s, cy + 140 * s], [cx, cy + 215 * s]];
    const P = (pts, v) => { g.fillStyle = grey(v); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); };
    g.fillStyle = grey(0.55); g.beginPath(); g.ellipse(cx, cy + 222 * s, 200 * s, 34 * s, 0, 0, TAU); g.fill();
    P(top, 0.86); P(left, 0.6); P(right, 0.42);
    P([[cx - 75 * s, cy - 77 * s], [cx - 60 * s, cy - 84 * s], [cx + 90 * s, cy - 2 * s], [cx + 75 * s, cy + 5 * s]], 0.97);       // tape on the lid
    P([[cx + 75 * s, cy + 5 * s], [cx + 90 * s, cy - 2 * s], [cx + 90 * s, cy + 178 * s], [cx + 75 * s, cy + 185 * s]], 0.7);       // and down the side
    P([[cx - 128 * s, cy + 6 * s], [cx - 40 * s, cy + 52 * s], [cx - 40 * s, cy + 120 * s], [cx - 128 * s, cy + 74 * s]], 0.98);   // the label
    g.fillStyle = grey(0.15); for (let k = 0; k < 12; k++) { const x = cx - 120 * s + k * 6 * s, w = (k % 3 === 0 ? 3 : 1.6) * s; g.beginPath(); g.moveTo(x, cy + 30 * s + k * 3.1 * s); g.lineTo(x + w, cy + 30 * s + k * 3.1 * s); g.lineTo(x + w, cy + 60 * s + k * 3.1 * s); g.lineTo(x, cy + 60 * s + k * 3.1 * s); g.fill(); }
  };
  K.drawDoor = (g, w, h) => {                    // the box on a doormat before a front door
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, grey(0.8)); bg.addColorStop(1, grey(0.6)); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = grey(0.35); g.fillRect(w * 0.22, h * 0.05, w * 0.56, h * 0.72); g.fillStyle = grey(0.5); g.fillRect(w * 0.25, h * 0.08, w * 0.5, h * 0.66);
    g.fillStyle = grey(0.2); g.beginPath(); g.arc(w * 0.68, h * 0.45, 9, 0, TAU); g.fill();
    g.fillStyle = grey(0.7); g.fillRect(0, h * 0.77, w, h * 0.23); g.fillStyle = grey(0.45); g.fillRect(w * 0.2, h * 0.8, w * 0.6, h * 0.12);
    K.drawBox(g, w * 0.5, h * 0.62, 0.62);
  };
  K.drawMap = (g, w, h) => {                     // a district: blocks, a river, two main roads
    g.fillStyle = grey(0.92); g.fillRect(0, 0, w, h);
    g.fillStyle = grey(0.62); for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) if (hash(i * 7 + j) > 0.15) g.fillRect(20 + i * (w - 40) / 9 + 8, 20 + j * (h - 40) / 6 + 8, (w - 40) / 9 - 16, (h - 40) / 6 - 16);
    g.strokeStyle = grey(0.45); g.lineWidth = 36; g.beginPath(); g.moveTo(-20, h * 0.7); g.bezierCurveTo(w * 0.3, h * 0.55, w * 0.6, h * 0.95, w + 20, h * 0.75); g.stroke();
    g.strokeStyle = grey(0.97); g.lineWidth = 16; g.beginPath(); g.moveTo(0, h * 0.32); g.lineTo(w, h * 0.38); g.moveTo(w * 0.55, 0); g.lineTo(w * 0.5, h); g.stroke();
  };

  // ───────── paperwork ─────────
  K.folder = (ctx, x, y, w, h, o = {}) => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
    ctx.fillStyle = C.manila2; rr(ctx, x + 40, y - 60, 600, 84, 12); ctx.fill();
    ctx.fillStyle = C.manila; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(120,90,40,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(x + 26, y + 26, w - 52, h - 52); ctx.restore();
  };
  K.type = (ctx, s, x, y, size, lt, o = {}) => {        // typewriter: characters land at cps with a caret
    if (lt <= 0) return 0; const n = Math.min(s.length, Math.floor(lt * (o.cps ?? 14)));
    ctx.save(); ctx.font = K.F(size, 'mono', o.w ?? 700); ctx.fillStyle = o.color || C.ink; ctx.textAlign = 'left';
    let xx = x; for (let i = 0; i < n; i++) { const ch = s[i], jit = (hash(i * 9.7 + size) - 0.5) * 2; ctx.globalAlpha = 0.82 + 0.18 * hash(i * 3.3); ctx.fillText(ch, xx, y + jit); xx += ctx.measureText(ch).width; }
    if (n < s.length || (o.caret && Math.floor(lt * 2.5) % 2 === 0)) { ctx.globalAlpha = 1; ctx.fillRect(xx + 2, y - size * 0.8, size * 0.5, 4); }
    ctx.restore(); return n;
  };
  K.redact = (ctx, x, y, w, h, p) => { if (p >= 1) return; ctx.save(); ctx.fillStyle = C.ink; ctx.fillRect(x + w * Ease.ioC(clamp(p)), y, w * (1 - Ease.ioC(clamp(p))), h); ctx.restore(); };
  // a rubber stamp: a rough double frame and text, slammed in from 1.6x (p 0..1)
  K.stamp = (ctx, s, x, y, size, p, rot = -0.12, color = C.red, o = {}) => {
    if (p <= 0) return; const key = `st:${s}:${size}:${color}`;
    const img = cached(key, () => { const g0 = makeBuf(10, 10).g; g0.font = K.F(size); const tw = g0.measureText(s).width, w = tw + size * 0.9, h = size * 1.55, b = makeBuf(w + 20, h + 20), g = b.g;
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = size * 0.08; g.strokeRect(10, 10, w, h); g.lineWidth = size * 0.03; g.strokeRect(10 + size * 0.14, 10 + size * 0.14, w - size * 0.28, h - size * 0.28);
      g.font = K.F(size); g.textAlign = 'center'; g.fillText(s, 10 + w / 2, 10 + h / 2 + size * 0.36);
      g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < (w * h) / 60; i++) { g.globalAlpha = 0.4 + 0.6 * hash(i * 1.3); g.beginPath(); g.arc(hash(i * 2.1 + size) * (w + 20), hash(i * 4.7 + size) * (h + 20), 0.6 + 2.6 * hash(i * 7.1) ** 2, 0, TAU); g.fill(); }
      return b.c; });
    const sc = 1 + 0.6 * (1 - Ease.outQuint(clamp(p))); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(p * 3) * (o.alpha ?? 0.9);
    ctx.globalCompositeOperation = o.op || 'multiply'; ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
  };
  K.pin = (ctx, x, y, p, color = C.red) => { if (p <= 0) return; const s = Ease.outBack(clamp(p), 2); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(6, 10, 13, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(-4, -5, 4, 0, TAU); ctx.fill(); ctx.restore(); };
  K.string = (ctx, a, b, p, sag = 40) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.beginPath(); const n = 24;
    for (let i = 0; i <= n * clamp(p); i++) { const u = i / n, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) + sag * Math.sin(Math.PI * u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); };
  K.card = (ctx, x, y, w, h, rot, lines, a) => { if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= clamp(a);
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; ctx.fillStyle = C.cream; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
    ctx.fillStyle = C.ink; lines.forEach(([s, size, fam], i) => { ctx.font = K.F(size, fam || 'mono', 700); ctx.fillText(s, -w / 2 + 20, -h / 2 + 18 + size + i * (size + 12)); }); ctx.restore(); };

  // ───────── the dot wipe between scenes ─────────
  K.dots = (ctx, k, color = C.red) => {
    if (k <= 0) return; const cell = 52; ctx.save(); ctx.fillStyle = color;
    for (let y = cell / 2; y < H + cell; y += cell) for (let x = cell / 2; x < W + cell; x += cell) {
      const r = cell * 0.74 * clamp(k * 1.9 - 0.9 * (x + y) / (W + H)); if (r <= 0.5) continue; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  K.wipes = (ctx, env, o = {}) => { const lt = env.lt; if (o.in !== false) K.dots(ctx, 1 - clamp(lt / 0.42)); if (o.out !== false) K.dots(ctx, clamp((lt - (env.dur - env.beatSec * 0.75)) / (env.beatSec * 0.75))); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display', o.w ?? 400); ctx.fillStyle = o.color || C.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 12 * (1 - clamp(a))); ctx.restore(); };
  window.DOS = K;
})();

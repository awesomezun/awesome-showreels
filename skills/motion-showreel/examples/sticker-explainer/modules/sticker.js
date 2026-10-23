// sticker: the 궁금상자 reel's sticker-board kit (a project module). A big blue-grey board in world coordinates seen
// through a camera that glides from station to station; every picture is a sticker: the object is drawn once into its
// own canvas, a white border is grown round its silhouette (the silhouette stamped in white at offsets on a circle),
// and it is slapped onto the board with an overshoot, a tilt and a soft shadow. Stations are joined by a dotted path,
// with step labels, leader lines and a small bar chart drawn as stickers too. Jua for labels, Gothic A1 for numbers.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { board: '#DCE5EC', dot: 'rgba(60,80,100,0.12)', ink: '#22303F', blue: '#3B82F6', green: '#3FAE6A', yellow: '#F6C343', red: '#EF5B4C', purple: '#8B5CF6', white: '#FFFFFF', bottle: '#9CD3F5' };
  const C = K.COL;
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  // stations in world px (the camera glides between them)
  K.ST = { hook: [420, 560], bin: [1650, 700], truck: [2600, 560], sort: [3000, 1450], flakes: [2150, 1950], thread: [1250, 1850], shirt: [520, 2350], all: [1760, 1450] };
  K.ORDER = ['hook', 'bin', 'truck', 'sort', 'flakes', 'thread', 'shirt'];
  K.camAt = (ctx, cx, cy, z) => { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy); };
  // the camera for a scene: from the previous scene's station to this one over the first `dur` seconds
  K.cam = (env, id, z = 1, o = {}) => { const sc = (REEL.plan && REEL.plan.scenes) || [], i = sc.findIndex(s => s.id === id), prev = i > 0 ? sc[i - 1].id : id;
    const a = K.ST[prev] || K.ST[id], b = K.ST[id], k = Ease.ioC(clamp(env.lt / (o.dur ?? 0.7))), za = o.z0 ?? z;
    return { x: lerp(a[0], b[0], k) + (o.dx || 0), y: lerp(a[1], b[1], k) + (o.dy || 0), z: Math.exp(lerp(Math.log(za), Math.log(z), k)) }; };
  // the board: colour, dot grid, the dotted path through every station drawn up to `upto` (index in ORDER, fractional)
  K.board = (ctx, upto = 7) => { ctx.fillStyle = C.board; ctx.fillRect(-2000, -2000, 8000, 8000); ctx.fillStyle = C.dot; for (let y = -200; y < 3200; y += 60) for (let x = -200; x < 3800; x += 60) ctx.fillRect(x, y, 4, 4);
    ctx.save(); ctx.strokeStyle = 'rgba(34,48,63,0.35)'; ctx.lineWidth = 8; ctx.setLineDash([2, 22]); ctx.lineCap = 'round'; ctx.beginPath();
    K.ORDER.forEach((k, i) => { if (i > upto) return; let [x, y] = K.ST[k]; if (i > 0 && i > upto - 1) { const [px, py] = K.ST[K.ORDER[i - 1]], f = upto - (i - 1); x = lerp(px, x, clamp(f)); y = lerp(py, y, clamp(f)); } i ? ctx.lineTo(x, y + 200) : ctx.moveTo(x, y + 200); }); ctx.stroke(); ctx.restore(); };
  // ───────── stickers ─────────
  const CACHE = new Map();
  K.make = (key, w, h, draw, border = 14) => { if (CACHE.has(key)) return CACHE.get(key);
    const pad = border + 6, src = makeBuf(w + 2 * pad, h + 2 * pad); src.g.translate(pad, pad); draw(src.g, w, h);
    const out = makeBuf(w + 2 * pad, h + 2 * pad), g = out.g, sil = makeBuf(w + 2 * pad, h + 2 * pad); sil.g.drawImage(src.c, 0, 0); sil.g.globalCompositeOperation = 'source-in'; sil.g.fillStyle = '#FFFFFF'; sil.g.fillRect(0, 0, w + 2 * pad, h + 2 * pad);
    for (let k = 0; k < 24; k++) { const a = k / 24 * TAU; g.drawImage(sil.c, Math.cos(a) * border, Math.sin(a) * border); } g.drawImage(sil.c, 0, 0); g.drawImage(src.c, 0, 0);
    CACHE.set(key, out.c); return out.c; };
  // slap a sticker at world (x, y): p 0..1 (scale from 1.5 with overshoot), rot, scale s
  K.slap = (ctx, img, x, y, p, rot = 0, s = 1) => { if (p <= 0) return; const e = p < 1 ? 1.5 - 0.5 * Ease.outBack(clamp(p), 2.2) : 1, a = clamp(p * 4);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot * (1 + 0.5 * (1 - clamp(p)))); ctx.scale(s * e, s * e); ctx.globalAlpha *= a;
    ctx.save(); ctx.filter = 'blur(10px)'; ctx.globalAlpha *= 0.35; ctx.globalCompositeOperation = 'multiply'; ctx.translate(8 * e, 14 * e); ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
    ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore(); };
  // a text sticker (rounded label)
  K.label = (key, s, size, bg = C.ink, fg = '#FFFFFF') => K.make('lb:' + key, (() => { const g = makeBuf(10, 10).g; g.font = K.F(size); return g.measureText(s).width + size * 1.1; })(), size * 1.6, (g, w, h) => {
    g.fillStyle = bg; rr(g, 0, 0, w, h, h * 0.35); g.fill(); g.fillStyle = fg; g.font = K.F(size); g.textAlign = 'center'; g.fillText(s, w / 2, h * 0.7); }, 10);
  // ───────── objects (drawn into sticker canvases) ─────────
  K.OBJ = {
    bottle: (g, w, h) => { g.fillStyle = C.bottle; rr(g, w * 0.2, h * 0.28, w * 0.6, h * 0.7, 30); g.fill(); g.beginPath(); g.moveTo(w * 0.2, h * 0.36); g.quadraticCurveTo(w * 0.2, h * 0.18, w * 0.38, h * 0.12); g.lineTo(w * 0.62, h * 0.12); g.quadraticCurveTo(w * 0.8, h * 0.18, w * 0.8, h * 0.36); g.fill();
      g.fillStyle = '#2B6CB0'; rr(g, w * 0.36, 0, w * 0.28, h * 0.12, 8); g.fill(); g.fillStyle = C.green; g.fillRect(w * 0.2, h * 0.5, w * 0.6, h * 0.18); g.fillStyle = '#FFFFFF'; g.globalAlpha = 0.6; rr(g, w * 0.28, h * 0.32, w * 0.08, h * 0.6, 6); g.fill(); g.globalAlpha = 1; },
    bin: (g, w, h) => { g.fillStyle = C.blue; g.beginPath(); g.moveTo(w * 0.08, h * 0.18); g.lineTo(w * 0.92, h * 0.18); g.lineTo(w * 0.82, h); g.lineTo(w * 0.18, h); g.closePath(); g.fill(); g.fillStyle = '#2C5FB8'; rr(g, 0, h * 0.06, w, h * 0.14, 12); g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = k / 3 * TAU - Math.PI / 2; g.beginPath(); g.arc(w / 2, h * 0.58, w * 0.2, a + 0.3, a + 1.7); g.stroke(); } },
    truck: (g, w, h) => { g.fillStyle = C.green; rr(g, 0, h * 0.1, w * 0.68, h * 0.62, 14); g.fill(); g.fillStyle = '#2E8B57'; rr(g, w * 0.68, h * 0.3, w * 0.3, h * 0.42, 16); g.fill(); g.fillStyle = '#BFE8FF'; rr(g, w * 0.76, h * 0.36, w * 0.16, h * 0.16, 8); g.fill();
      g.fillStyle = '#22303F'; for (const x of [0.18, 0.5, 0.84]) { g.beginPath(); g.arc(w * x, h * 0.78, h * 0.16, 0, TAU); g.fill(); } g.fillStyle = '#FFFFFF'; g.font = K.F(h * 0.18); g.fillText('재활용', w * 0.12, h * 0.48); },
    sort: (g, w, h) => { g.fillStyle = '#8796A8'; rr(g, 0, h * 0.55, w, h * 0.2, 20); g.fill(); g.fillStyle = '#5B6B7F'; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(w * (0.06 + k * 0.11), h * 0.65, h * 0.07, 0, TAU); g.fill(); }
      [[0.18, C.bottle], [0.4, C.bottle], [0.62, '#FFB86B'], [0.82, C.bottle]].forEach(([x, c]) => { g.fillStyle = c; rr(g, w * x - 22, h * 0.2, 44, h * 0.34, 10); g.fill(); }); g.fillStyle = C.yellow; g.beginPath(); g.moveTo(w * 0.62, h * 0.05); g.lineTo(w * 0.7, h * 0.18); g.lineTo(w * 0.54, h * 0.18); g.closePath(); g.fill(); },
    flakes: (g, w, h) => { for (let k = 0; k < 70; k++) { const x = w * (0.1 + 0.8 * hash(k * 3.3)), y = h * (0.35 + 0.6 * hash(k * 5.7)) * (0.6 + 0.4 * Math.abs(x / w - 0.5) * 2); g.save(); g.translate(x, y); g.rotate(hash(k) * 6); g.fillStyle = k % 5 ? C.bottle : C.green; g.fillRect(-12, -8, 24, 16); g.restore(); } },
    thread: (g, w, h) => { g.fillStyle = '#C9A06A'; rr(g, w * 0.25, 0, w * 0.5, h * 0.12, 8); g.fill(); rr(g, w * 0.25, h * 0.88, w * 0.5, h * 0.12, 8); g.fill(); g.fillStyle = '#F1F5F9'; rr(g, w * 0.3, h * 0.12, w * 0.4, h * 0.76, 10); g.fill();
      g.strokeStyle = '#CBD5E1'; g.lineWidth = 3; for (let k = 0; k < 18; k++) { g.beginPath(); g.moveTo(w * 0.3, h * (0.14 + k * 0.042)); g.lineTo(w * 0.7, h * (0.16 + k * 0.042)); g.stroke(); } },
    shirt: (g, w, h) => { g.fillStyle = C.blue; g.beginPath(); g.moveTo(w * 0.3, 0); g.lineTo(w * 0.42, h * 0.08); g.lineTo(w * 0.58, h * 0.08); g.lineTo(w * 0.7, 0); g.lineTo(w, h * 0.22); g.lineTo(w * 0.86, h * 0.42); g.lineTo(w * 0.78, h * 0.36); g.lineTo(w * 0.78, h); g.lineTo(w * 0.22, h); g.lineTo(w * 0.22, h * 0.36); g.lineTo(w * 0.14, h * 0.42); g.lineTo(0, h * 0.22); g.closePath(); g.fill();
      g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { const a = k / 3 * TAU - Math.PI / 2; g.beginPath(); g.arc(w / 2, h * 0.55, w * 0.14, a + 0.3, a + 1.7); g.stroke(); } },
    badge: (g, w, h) => { g.fillStyle = C.yellow; rr(g, 0, h * 0.2, w, h * 0.8, 18); g.fill(); g.fillStyle = '#E0A92C'; g.beginPath(); g.moveTo(0, h * 0.2); g.lineTo(w * 0.15, 0); g.lineTo(w * 0.85, 0); g.lineTo(w, h * 0.2); g.closePath(); g.fill(); g.fillStyle = C.ink; g.font = K.F(h * 0.6); g.textAlign = 'center'; g.fillText('?', w / 2, h * 0.85); },
    chart: (g, w, h) => { g.fillStyle = '#FFFFFF'; rr(g, 0, 0, w, h, 20); g.fill(); g.fillStyle = C.ink; g.font = K.F(30); g.fillText('한빛시 페트병 재활용률 (가상)', 26, 50);
      [[2024, 61], [2025, 67], [2026, 72]].forEach(([y, v], i) => { const bh = (h - 150) * v / 80, x = 60 + i * (w - 120) / 3; g.fillStyle = i === 2 ? C.green : '#9AA9BA'; rr(g, x, h - 60 - bh, (w - 120) / 3 - 30, bh, 10); g.fill(); g.fillStyle = C.ink; g.font = K.F(34, 'mono'); g.fillText(`${v}%`, x + 10, h - 70 - bh); g.font = K.F(28); g.fillText(String(y), x + 10, h - 22); }); },
  };
  K.obj = (k, w, h) => K.make('o:' + k, w, h, K.OBJ[k]);
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.fam || 'display'); ctx.fillStyle = o.color || C.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 10 * (1 - clamp(a))); ctx.restore(); };
  // a step: number disc + label sticker near a station
  K.step = (ctx, n, s, x, y, p, col = C.ink) => { K.slap(ctx, K.label('st' + n + s, `${n}단계 · ${s}`, 46, col), x, y, p, -0.03); };
  window.STK = K;
})();
(() => {
  const K = STK, C = K.COL;
  K.SPEC = { hook: ['bottle', 220, 420, -0.08], bin: ['bin', 300, 360, 0.05, 1, '분리배출', C.blue], truck: ['truck', 460, 280, -0.04, 2, '수거', C.green],
    sort: ['sort', 520, 300, 0.03, 3, '선별', C.purple], flakes: ['flakes', 420, 300, -0.05, 4, '분쇄 → 플레이크', C.red], thread: ['thread', 200, 340, 0.06, 5, '녹여서 실', '#B7791F'], shirt: ['shirt', 420, 400, -0.04, 6, '옷', C.blue] };
  // the stickers of one station, slapped at local time u (u >= 1: settled), with a slight idle wobble
  K.station = (ctx, id, u, lt) => { const s = K.SPEC[id], [x, y] = K.ST[id]; if (!s) return; const wob = 0.015 * Math.sin(lt * 2 + x);
    K.slap(ctx, K.obj(s[0], s[1], s[2]), x, y, u, s[3] + wob);
    if (s[4]) K.step(ctx, s[4], s[5], x, y + s[2] / 2 + 90, (u - 0.5) * 1.6, s[6]);
    if (id === 'flakes') K.slap(ctx, K.obj('chart', 600, 380), x + 580, y + 60, (u - 1.2) * 1.4, 0.04 + wob); };
  // a station scene: glide from the previous station, slap this one, keep the earlier ones on the board
  K.scene = (ctx, env, id, caption) => {
    const lt = env.lt, cam = K.cam(env, id, 1.0), idx = K.ORDER.indexOf(id), z = cam.z * (1 + 0.04 * clamp(lt / env.dur));
    ctx.save(); K.camAt(ctx, cam.x, cam.y, z); K.board(ctx, idx - 1 + clamp(lt / 0.7));
    K.ORDER.slice(0, idx).forEach(k => K.station(ctx, k, 9, lt)); K.station(ctx, id, (lt - 0.5) / 0.3, lt);
    ctx.restore();
    if (caption) { ctx.save(); ctx.globalAlpha = clamp((lt - 0.9) / 0.3); ctx.font = K.F(60); const w = ctx.measureText(caption).width + 80; ctx.fillStyle = 'rgba(255,255,255,0.92)'; rr(ctx, W / 2 - w / 2, 930, w, 100, 50); ctx.fill(); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(caption, W / 2, 1000); ctx.restore(); }
  };
})();

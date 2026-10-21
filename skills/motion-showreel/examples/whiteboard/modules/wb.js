// wb: the whiteboard reel's kit (a project module). A long white board seen through a camera that pans and zooms;
// marker strokes drawn on along their paths; handwriting revealed left to right; and the hand itself (a flat vector
// hand in a navy cuff holding a black marker) whose marker tip rides whatever is being drawn.
(() => {
  const K = {};
  const R = n => hash(n);
  K.COL = { board: '#FBFBF8', ink: '#1E1F22', red: '#D9392B', blue: '#2563C9', green: '#2E9E5B', yellow: '#F4C63D', grey: '#9AA0A6', skin: '#F1C7A4', skinD: '#D9A27E', cuff: '#2C3E66' };
  // camera: world -> screen; cam = {x, y, z} is the world point at the screen centre and the zoom
  K.cam = (ctx, cam) => { ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y); };
  K.toScreen = (cam, x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
  // the board: off-white with a faint sheen, ghosts of erased marker and the aluminium frame at the very edges
  K.board = (ctx, cam, o = {}) => {
    ctx.fillStyle = '#E9EAEC'; ctx.fillRect(0, 0, W, H);
    ctx.save(); K.cam(ctx, cam);
    ctx.fillStyle = K.COL.board; ctx.fillRect(-600, -400, 11000, 1900);
    ctx.strokeStyle = 'rgba(80,90,100,0.06)'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) { const x = R(i * 3.3) * 10000, y = R(i * 7.1) * 1100; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 120, y - 60, x + 220, y + 50, x + 360, y - 10); ctx.stroke(); }
    ctx.restore();
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.04)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  // ───────── strokes ─────────
  K.pts = (corners, step = 8) => { const out = []; for (let i = 0; i < corners.length - 1; i++) { const [a, b] = [corners[i], corners[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step)); for (let k = 0; k < n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]); } out.push(corners[corners.length - 1].slice()); return out; };
  K.arc = (cx, cy, rx, ry, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
  const LEN = new WeakMap();
  const cum = p => { let c = LEN.get(p); if (!c) { c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); LEN.set(p, c); } return c; };
  K.at = (p, u) => { const c = cum(p), L = c[c.length - 1] * clamp(u); let i = 1; while (i < c.length - 1 && c[i] < L) i++; const k = (L - c[i - 1]) / ((c[i] - c[i - 1]) || 1); return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; };
  // a marker stroke along p to fraction u (by length); returns the tip
  K.stroke = (ctx, p, u, o = {}) => {
    if (u <= 0) return null;
    const c = cum(p), L = c[c.length - 1] * clamp(u);
    ctx.save(); ctx.strokeStyle = o.color || K.COL.ink; ctx.lineWidth = o.w ?? 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.alpha ?? 1;
    ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); let tip = p[0];
    for (let i = 1; i < p.length; i++) { if (c[i] <= L) { ctx.lineTo(p[i][0], p[i][1]); tip = p[i]; } else { const k = (L - c[i - 1]) / (c[i] - c[i - 1]); tip = [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; ctx.lineTo(tip[0], tip[1]); break; } }
    ctx.stroke(); ctx.restore(); return tip;
  };
  // a group of strokes drawn one after another over u (each gets a share by length); returns the tip
  K.group = (ctx, list, u, o = {}) => {
    const lens = list.map(s => { const c = cum(s.p || s); return c[c.length - 1]; }), tot = lens.reduce((a, b) => a + b, 0); let acc = 0, tip = null;
    list.forEach((s, i) => { const p = s.p || s, a = acc / tot, b = (acc + lens[i]) / tot; acc += lens[i]; const q = rm(u, a, b); if (q > 0) { const tp = K.stroke(ctx, p, q, { ...o, ...(s.o || {}) }); if (q < 1) tip = tp; } });
    return tip;
  };
  // a hatched fill inside a clip (marker colouring), drawn row by row over u
  K.hatch = (ctx, clip, box, u, o = {}) => {
    if (u <= 0) return; const gap = o.gap ?? 14, rows = Math.ceil((box.w + box.h) / gap);
    ctx.save(); clip(ctx); ctx.clip(); ctx.strokeStyle = o.color || K.COL.yellow; ctx.lineWidth = o.w ?? 12; ctx.lineCap = 'round'; ctx.globalAlpha *= o.alpha ?? 0.7;
    const n = Math.floor(rows * clamp(u)); ctx.beginPath();
    for (let i = 0; i < n; i++) { const d = i * gap; ctx.moveTo(box.x + d, box.y); ctx.lineTo(box.x + d - box.h, box.y + box.h); }
    ctx.stroke(); ctx.restore();
  };
  // handwriting: the line is revealed left to right; returns the pen position (the reveal edge, on the baseline band)
  K.write = (ctx, s, x, y, u, o = {}) => {
    if (u <= 0) return null; const size = o.size ?? 96;
    ctx.save(); ctx.font = `${o.weight ?? 400} ${size}px ${o.fam || FAM.display}`; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, edge = x0 + w * clamp(u);
    ctx.beginPath(); ctx.rect(x0 - 20, y - size * 1.2, edge - x0 + 20, size * 1.7); ctx.clip();
    ctx.fillStyle = o.color || K.COL.ink; ctx.fillText(s, x0, y); ctx.restore();
    return u < 1 ? [edge, y - size * (0.3 + 0.18 * Math.sin(u * 40))] : null;
  };
  K.textW = (ctx, s, size, fam) => { ctx.save(); ctx.font = `400 ${size}px ${fam || FAM.display}`; const w = ctx.measureText(s).width; ctx.restore(); return w; };
  // ───────── the hand ─────────
  // tip at (x, y) in screen px; the marker leans down-right into a hand in a navy cuff (s = scale)
  K.hand = (ctx, x, y, o = {}) => {
    const s = o.s ?? 1, a = o.a ?? 0.62, C = K.COL;
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
    ctx.shadowColor = 'rgba(20,25,35,0.22)'; ctx.shadowBlur = 30; ctx.shadowOffsetX = 14; ctx.shadowOffsetY = 20;
    // marker
    ctx.fillStyle = '#2A2B2F'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(26, -9); ctx.lineTo(26, 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#E8E8E6'; ctx.beginPath(); ctx.roundRect(24, -19, 40, 38, 6); ctx.fill();
    ctx.fillStyle = '#2A2B2F'; ctx.beginPath(); ctx.roundRect(62, -21, 230, 42, 10); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(70, -15, 210, 6);
    // the hand: palm behind, fingers wrapped over the barrel, thumb under it
    ctx.fillStyle = C.skin; ctx.strokeStyle = C.skinD; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(205, -70, 120, 92, -0.25, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(150, 2, 104, 52, 26); ctx.fill(); ctx.stroke();                     // thumb
    [[96, -40, 70], [122, -58, 82], [150, -70, 86]].forEach(([fx, fy, fl]) => { ctx.beginPath(); ctx.roundRect(fx, fy, 50, fl, 25); ctx.fill(); ctx.stroke(); });
    ctx.fillStyle = C.skinD; ctx.globalAlpha = 0.5; [[110, 20], [138, 14], [166, 4]].forEach(([nx, ny]) => { ctx.beginPath(); ctx.ellipse(nx, ny, 12, 7, 0.3, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1;
    // cuff and sleeve
    ctx.fillStyle = C.cuff; ctx.beginPath(); ctx.roundRect(300, -150, 120, 190, 18); ctx.fill(); ctx.fillRect(400, -170, 600, 230);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(300, -130, 120, 6);
    ctx.restore();
  };

  // ───────── a timeline of drawing tasks and the hand that does them ─────────
  // K.task.strokes(list, a, b, o) / K.task.write(s, x, y, a, b, o) / K.task.hatch(clip, box, a, b, o): each knows where
  // it starts and ends, so between tasks the hand travels from one to the next, and it enters and leaves the frame.
  K.task = {
    strokes: (list, a, b, o = {}) => { const f = list[0].p || list[0], l = list[list.length - 1].p || list[list.length - 1]; return { a, b, from: f[0], to: l[l.length - 1], draw: (ctx, u) => K.group(ctx, list, u, o) }; },
    write: (s, x, y, a, b, o = {}) => ({ a, b, s, x, y, o, draw: (ctx, u) => K.write(ctx, s, x, y, u, o), ext: ctx => { const w = K.textW(ctx, s, o.size ?? 96, o.fam), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, yy = y - (o.size ?? 96) * 0.3; return [[x0, yy], [x0 + w, yy]]; } }),
    hatch: (clip, box, a, b, o = {}) => ({ a, b, from: [box.x, box.y], to: [box.x + box.w - box.h, box.y + box.h], draw: (ctx, u) => { K.hatch(ctx, clip, box, u, o); const n = clamp(u) * (box.w + box.h); return u < 1 ? [box.x + n - box.h * 0.5, box.y + box.h * 0.5] : null; } }),
  };
  // run the tasks (drawn in world space, inside the camera) and return the hand's world position (null = away)
  K.run = (ctx, tasks, lt, o = {}) => {
    let hand = null;
    tasks.forEach(tk => { if (tk.ext) { const [f, t2] = tk.ext(ctx); tk.from = f; tk.to = t2; } });
    tasks.forEach(tk => { const u = rm(lt, tk.a, tk.b); if (u > 0) { const tip = tk.draw(ctx, u); if (lt >= tk.a && lt < tk.b && tip) hand = tip; } });
    if (hand || !tasks.length) return hand;
    const sorted = tasks.slice().sort((x, y) => x.a - y.a), first = sorted[0], last = sorted.reduce((m, x) => (x.b > m.b ? x : m), sorted[0]);
    const away = o.away || [first.from[0] + 900, first.from[1] + 900];
    if (lt < first.a) { const q = Ease.outC(rm(lt, first.a - 0.45, first.a)); return q > 0 ? [lerp(away[0], first.from[0], q), lerp(away[1], first.from[1], q)] : null; }
    if (lt >= last.b) { const q = Ease.inC(rm(lt, last.b, last.b + 0.45)); const end = last.to; const aw = o.awayEnd || [end[0] + 900, end[1] + 900]; return q < 1 ? [lerp(end[0], aw[0], q), lerp(end[1], aw[1], q)] : null; }
    let prev = null, next = null;
    for (const tk of sorted) { if (tk.b <= lt && (!prev || tk.b > prev.b)) prev = tk; if (tk.a > lt && (!next || tk.a < next.a)) next = tk; }
    if (prev && next) { const q = Ease.ioC(rm(lt, prev.b, next.a)); return [lerp(prev.to[0], next.from[0], q), lerp(prev.to[1], next.from[1], q) - Math.sin(Math.PI * q) * 60]; }
    return null;
  };
  // the previous scene in this cut (for the camera to come from)
  K.prev = env => { const S = (REEL.plan && REEL.plan.scenes) || [], i = S.findIndex(x => x.id === env.id); return i > 0 ? S[i - 1].id : null; };
  K.inCut = (env, id) => ((REEL.plan && REEL.plan.scenes) || []).some(x => x.id === id);

  // ───────── the board's panels (world coordinates); each returns its tasks in its own local seconds ─────────
  const T = K.task, P2 = K.pts, ARC = K.arc;
  const envelope = (x, y, w, h) => [P2([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]), P2([[x, y], [x + w / 2, y + h * 0.58], [x + w, y]])];
  K.PANEL = {
    title: { cx: 960, cy: 540, tasks: C => [
      T.strokes(envelope(360, 410, 400, 250), 0.1, 0.9, { w: 9 }),
      T.strokes([P2([[700, 110], [700, 382]]), ARC(672, 382, 28, 30, 0, Math.PI), P2([[644, 382], [644, 350], [632, 366]])], 0.9, 1.35, { w: 8, color: C.red }),
      T.write('사내 보안 교육', 880, 330, 1.35, 1.75, { size: 66, color: C.blue }),
      T.write('피싱 메일', 870, 520, 1.75, 2.55, { size: 190 }),
      T.write('3초 판별법', 880, 700, 2.55, 3.25, { size: 132, color: C.red }),
      T.strokes([P2([[880, 740], [1180, 752], [1480, 738]])], 3.25, 3.55, { w: 10, color: C.red })] },
    checks: { cx: 2950, cy: 520, cols: [2350, 2950, 3550], tasks: (C, dur = 6.43, B = 0.536) => {
      const out = [], labels = [['보낸 사람', '철자 한 글자까지'], ['링크 주소', '버튼 글자와 같은지'], ['재촉하는 말', "'24시간 안에!'"]];
      [2350, 2950, 3550].forEach((x, i) => {
        const a = 0.25 + i * 1.75;
        out.push(T.strokes([ARC(x, 230, 46, 46, -Math.PI / 2, Math.PI * 1.5)], a, a + 0.25, { w: 7, color: C.blue }));
        out.push(T.write(String(i + 1), x, 262, a + 0.25, a + 0.4, { size: 96, color: C.blue, align: 'center' }));
        if (i === 0) out.push(T.strokes([...envelope(x - 150, 340, 210, 140)], a + 0.4, a + 0.9, { w: 8 }), T.write('@', x + 110, 470, a + 0.9, a + 1.1, { size: 130, color: C.red }));
        if (i === 1) out.push(T.strokes([P2([[x - 160, 400], [x - 40, 400]]), ARC(x - 160, 430, 30, 30, -Math.PI / 2, -Math.PI * 1.5, 24), P2([[x - 160, 460], [x - 40, 460]]), ARC(x - 40, 430, 30, 30, -Math.PI / 2, Math.PI / 2, 24),
          ARC(x + 70, 410, 62, 62, 0, TAU), P2([[x + 115, 455], [x + 175, 515]])], a + 0.4, a + 1.1, { w: 8 }));
        if (i === 2) out.push(T.strokes([ARC(x - 30, 420, 95, 95, -Math.PI / 2, Math.PI * 1.5), P2([[x - 30, 420], [x - 30, 360]]), P2([[x - 30, 420], [x + 20, 445]]), P2([[x + 110, 340], [x + 110, 450]]), P2([[x + 110, 488], [x + 110, 492]])], a + 0.4, a + 1.1, { w: 8, color: C.ink }));
        out.push(T.write(labels[i][0], x, 680, a + 1.1, a + 1.5, { size: 92, align: 'center' }));
        out.push(T.write(labels[i][1], x, 790, a + 1.5, a + 1.75, { size: 60, align: 'center', color: i === 2 ? C.red : C.grey }));
      });
      // the hold: the hand ticks each column off in green, one per bar line, while the scene lasts
      for (let i = 0, at = 6.25; at + 0.45 < dur - 0.4 && i < 3; i++, at += 4 * B) { const x = [2350, 2950, 3550][i]; out.push(T.strokes([P2([[x + 80, 160], [x + 110, 200], [x + 170, 110]])], at, at + 0.45, { w: 12, color: C.green })); }
      return out; } },
    example: { cx: 4900, cy: 540, tasks: C => [
      T.write('이런 메일이라면?', 4900, 190, 0.1, 0.6, { size: 92, align: 'center' }),
      T.strokes([P2([[4300, 270], [5500, 270], [5500, 880], [4300, 880], [4300, 270]]), P2([[4300, 340], [5500, 340]])], 0.6, 1.2, { w: 7 }),
      T.write('보낸 사람: 보안팀 <security@hangye0l.co.kr>', 4360, 430, 1.2, 1.8, { size: 50 }),
      T.write('[긴급] 24시간 안에 비밀번호를 바꾸세요', 4360, 520, 1.8, 2.4, { size: 50 }),
      T.strokes([P2([[4360, 620], [4780, 620], [4780, 720], [4360, 720], [4360, 620]])], 2.4, 2.7, { w: 7, color: C.blue }),
      T.write('지금 확인하기', 4570, 690, 2.7, 3.0, { size: 56, align: 'center', color: C.blue }),
      T.strokes([ARC(5130, 413, 40, 46, 0, TAU * 1.08)], 3.1, 3.4, { w: 8, color: C.red }),
      T.strokes([ARC(4636, 506, 150, 56, 0, TAU * 1.06)], 3.4, 3.8, { w: 8, color: C.red }),
      T.strokes([P2([[4790, 690], [4980, 760], [4950, 735], [4980, 760], [4945, 778]])], 3.8, 4.1, { w: 8, color: C.red }),
      T.write('진짜 주소: hangye0l-login.xyz', 5000, 790, 4.1, 4.7, { size: 46, color: C.red })] },
    report: { cx: 6900, cy: 540, tasks: C => [
      T.write('의심되면 누르지 말고', 6900, 250, 0.1, 0.8, { size: 104, align: 'center' }),
      T.strokes(envelope(6280, 400, 300, 190), 0.8, 1.4, { w: 9 }),
      T.strokes([P2([[6640, 495], [7100, 495]]), P2([[7060, 465], [7100, 495], [7060, 525]])], 1.4, 1.8, { w: 9, color: C.green }),
      T.strokes([P2([[7300, 370], [7400, 410], [7500, 370], [7500, 480], [7400, 600], [7300, 480], [7300, 370]]), P2([[7350, 480], [7390, 525], [7460, 440]])], 1.8, 2.4, { w: 9, color: C.green }),
      T.write('보안팀으로 전달', 6900, 790, 2.4, 3.0, { size: 112, align: 'center', color: C.green }),
      T.write('security@hangyeol.co.kr', 6900, 890, 3.0, 3.4, { size: 52, align: 'center', color: C.grey })] },
    message: { cx: 8900, cy: 540, tasks: C => [
      T.strokes([ARC(8330, 560, 230, 230, -Math.PI / 2, Math.PI * 1.5), P2([[8300, 330], [8300, 300], [8360, 300], [8360, 330]]), P2([[8270, 290], [8390, 290]])], 0.1, 0.8, { w: 10 }),
      T.write('링크 누르기 전,', 8640, 470, 0.8, 1.6, { size: 128 }),
      T.write('3초만.', 8640, 730, 1.6, 2.2, { size: 240, color: C.red }),
      T.write('한결상사 보안팀 · 가상의 회사 교육 예제', 8900, 960, 2.4, 2.9, { size: 46, align: 'center', color: C.grey })] },
  };
  // draw every panel of this cut up to the current one: earlier ones finished, the current one at lt; returns the hand
  K.world = (ctx, env, cur, lt, o = {}) => {
    const order = ['title', 'checks', 'example', 'report', 'message'], C = K.COL; let hand = null;
    for (const id of order) {
      const scene = { title: 'hook', checks: 'checks', example: 'example', report: 'report', message: 'message' }[id];
      if (!K.inCut(env, scene)) continue;
      const sc = ((REEL.plan && REEL.plan.scenes) || []).find(x => x.id === scene), tasks = K.PANEL[id].tasks(C, sc ? sc.dur : 0, env.beatSec);
      if (id === cur) { hand = K.run(ctx, tasks, lt, o); break; }
      K.run(ctx, tasks, 999);
    }
    return hand;
  };
  K.SCENE_PANEL = { hook: 'title', checks: 'checks', example: 'example', report: 'report', message: 'message' };

  // the camera of a panel at local time lt: it travels over from the previous scene's panel (dipping out a little,
  // as a whiteboard camera does), then holds or, on the checks panel, follows each column and pulls back at the end
  K.camFor = (env, id, lt) => {
    const pan = K.PANEL[id], prev = K.prev(env), from = prev ? K.PANEL[K.SCENE_PANEL[prev]] : null;
    let target;
    if (id === 'checks') {
      const cols = pan.cols, f = i => ({ x: cols[i], y: 500, z: 1.28 });
      const k1 = Ease.ioC(rm(lt, 1.85, 2.25)), k2 = Ease.ioC(rm(lt, 3.6, 4.0)), ko = Ease.ioC(rm(lt, 5.45, 6.1));
      const a = f(0), b = f(1), c = f(2), x = lerp(lerp(lerp(a.x, b.x, k1), c.x, k2), pan.cx, ko);
      target = { x, y: lerp(500, 520, ko), z: lerp(1.28, 0.9, ko) };
    } else target = { x: pan.cx, y: pan.cy, z: id === 'title' ? 1 + 0.04 * clamp(lt / 6) : 1 };
    const br = 1 + 0.018 * Math.sin(TAU * lt / 3.2); target = { x: target.x + 10 * Math.sin(TAU * lt / 4.1), y: target.y + 6 * Math.cos(TAU * lt / 5.3), z: target.z * br };
    if (!from) return target;
    const startT = id === 'checks' ? { x: pan.cols[0], y: 500, z: 1.28 } : target;
    const fromCam = prev === 'checks' ? { x: from.cx, y: 520, z: 0.9 } : { x: from.cx, y: from.cy, z: 1 };
    const q = Ease.ioC(rm(lt, 0, 0.7)); if (q >= 1) return target;
    const dip = 1 - 0.18 * Math.sin(Math.PI * q);
    return { x: lerp(fromCam.x, startT.x, q), y: lerp(fromCam.y, startT.y, q), z: lerp(fromCam.z, startT.z, q) * dip };
  };
  window.WB = K;
})();

// manual: the 반듯 선반 reel's assembly-instruction kit (a project module). Wordless line art on white: boxes drawn in
// isometric projection with white faces and thin black edges (painter's order, so hidden edges are covered), parts
// that slide into place along dotted motion arrows, screws turning in under a screwdriver, numbered step discs, part
// letters with counts, OK / wrong-way panels and a small faceless person who does the work. Gothic A1 throughout.
(() => {
  const K = {}, TAU = Math.PI * 2, CS = Math.cos(Math.PI / 6), SN = Math.sin(Math.PI / 6);
  K.COL = { paper: '#FFFFFF', ink: '#1A1A1A', grey: '#D9D9D9', grey2: '#EFEFEF', blue: '#2F6FED' };
  const C = K.COL;
  K.F = (size, w = 800) => `${w} ${size}px ${FAM.display}`;
  // isometric projection about an origin (ox, oy) with scale s: x right-down, z left-down, y up
  K.iso = (o, x, y, z) => [o.x + (x - z) * CS * o.s, o.y + ((x + z) * SN - y) * o.s];
  K.box = (ctx, o, x, y, z, w, h, d, fill = C.paper, lw = 3) => {
    const P = (a, b, c) => K.iso(o, x + a, y + b, z + c);
    const faces = [[P(0, h, 0), P(w, h, 0), P(w, h, d), P(0, h, d)], [P(0, 0, d), P(w, 0, d), P(w, h, d), P(0, h, d)], [P(w, 0, 0), P(w, 0, d), P(w, h, d), P(w, h, 0)]];
    const shade = [fill, fill === C.paper ? '#F4F4F4' : fill, fill === C.paper ? '#E8E8E8' : fill];
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = C.ink;
    faces.forEach((f, i) => { ctx.fillStyle = shade[i]; ctx.beginPath(); f.forEach(([a, b], j) => j ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); ctx.fill(); ctx.stroke(); });
    ctx.restore(); };
  // the shelf: two side panels A and up to three shelves B; parts: {sideL, sideR, shelves: [..]} each an offset [dx,dy,dz] and a visibility
  K.shelf = (ctx, o, st = {}) => {
    const T = 18, Wd = 300, Hh = 460, D = 150, part = (k, def) => st[k] ?? def;
    const sL = part('sideL', [0, 0, 0, 1]), sR = part('sideR', [0, 0, 0, 1]), sh = st.shelves || [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]];
    if (sL[3] > 0) { ctx.save(); ctx.globalAlpha *= sL[3]; K.box(ctx, o, sL[0], sL[1], sL[2], T, Hh, D); ctx.restore(); }
    [10, 210, 420].forEach((yy, i) => { const s = sh[i]; if (!s || s[3] <= 0) return; ctx.save(); ctx.globalAlpha *= s[3]; K.box(ctx, o, T + s[0], yy + s[1], s[2], Wd - T, T, D); ctx.restore(); });
    if (sR[3] > 0) { ctx.save(); ctx.globalAlpha *= sR[3]; K.box(ctx, o, Wd + sR[0], sR[1], sR[2], T, Hh, D); ctx.restore(); }
  };
  K.arrow = (ctx, a, b, p, o = {}) => { if (p <= 0) return; const x = lerp(a[0], b[0], clamp(p)), y = lerp(a[1], b[1], clamp(p)); ctx.save(); ctx.strokeStyle = o.col || C.ink; ctx.lineWidth = 3; ctx.setLineDash([10, 9]);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); const an = Math.atan2(b[1] - a[1], b[0] - a[0]); ctx.fillStyle = o.col || C.ink; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * 16, y + Math.sin(an) * 16); ctx.lineTo(x + Math.cos(an + 2.5) * 16, y + Math.sin(an + 2.5) * 16); ctx.lineTo(x + Math.cos(an - 2.5) * 16, y + Math.sin(an - 2.5) * 16); ctx.closePath(); ctx.fill(); ctx.restore(); };
  K.screw = (ctx, x, y, r, rot, a = 1) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.fillStyle = C.paper; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, 0); ctx.moveTo(0, -r * 0.6); ctx.lineTo(0, r * 0.6); ctx.stroke(); ctx.restore(); };
  K.driver = (ctx, x, y, s, rot) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.7); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -120); ctx.stroke();
    rr(ctx, -18, -250, 36, 130, 14); ctx.fill(); ctx.stroke(); for (let k = 0; k < 4; k++) { const xx = -12 + ((k * 8 + rot * 30) % 32); ctx.beginPath(); ctx.moveTo(xx, -240); ctx.lineTo(xx, -130); ctx.stroke(); } ctx.restore(); };
  // the faceless helper: feet at (x, y), scale s; arm 0..1 reaches up; bob on the beat
  K.person = (ctx, x, y, s, lt, o = {}) => { ctx.save(); ctx.translate(x, y - 6 * Math.abs(Math.sin(lt * 3.4)) * (o.bob ?? 1)); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.strokeStyle = C.ink; ctx.fillStyle = C.paper; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-10, -120); ctx.moveTo(18, 0); ctx.lineTo(10, -120); ctx.stroke(); rr(ctx, -42, -260, 84, 150, 36); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -310, 42, 0, TAU); ctx.fill(); ctx.stroke(); const arm = o.arm ?? 0; ctx.beginPath(); ctx.moveTo(-34, -230); ctx.lineTo(-80, -150 - 60 * arm); ctx.moveTo(34, -230); ctx.lineTo(90, -170 - 90 * arm); ctx.stroke();
    if (o.heart) { ctx.save(); ctx.translate(0, -400 - 10 * Math.sin(lt * 4)); ctx.scale(o.heart, o.heart); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-34, -10, -16, -36, 0, -18); ctx.bezierCurveTo(16, -36, 34, -10, 0, 14); ctx.fill(); ctx.restore(); } ctx.restore(); };
  K.step = (ctx, n, x, y, p) => { if (p <= 0) return; const s = Ease.outBack(clamp(p), 2); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill(); ctx.fillStyle = C.paper; ctx.font = K.F(64, 900); ctx.textAlign = 'center'; ctx.fillText(String(n), 0, 23); ctx.restore(); };
  K.tagPart = (ctx, letter, count, x, y, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = C.ink; ctx.font = K.F(36, 900); ctx.textAlign = 'center'; ctx.fillText(letter, x, y + 13); ctx.font = K.F(40, 700); ctx.textAlign = 'left'; ctx.fillText(`×${count}`, x + 44, y + 14); ctx.restore(); };
  K.panel = (ctx, x, y, w, h, ok, a, draw) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.fillStyle = C.paper; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.stroke(); draw && draw(ctx);
    ctx.lineWidth = 8; ctx.strokeStyle = ok ? C.ink : C.ink; ctx.beginPath(); if (ok) { ctx.moveTo(x + w - 70, y + h - 50); ctx.lineTo(x + w - 52, y + h - 30); ctx.lineTo(x + w - 20, y + h - 70); } else { ctx.moveTo(x + w - 64, y + h - 64); ctx.lineTo(x + w - 24, y + h - 24); ctx.moveTo(x + w - 24, y + h - 64); ctx.lineTo(x + w - 64, y + h - 24); } ctx.stroke(); ctx.restore(); };
  K.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(size, o.w ?? 800); ctx.fillStyle = o.color || C.ink; ctx.textAlign = o.align || 'left'; ctx.fillText(s, x, y + 8 * (1 - clamp(a))); ctx.restore(); };
  K.ground = (ctx) => { ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = C.grey; ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80); };
  window.MAN = K;
})();
(() => {
  const K = MAN;
  K.O = { x: 1180, y: 820, s: 1.0 };
  // screws on the front edges of the side panels (iso screen points)
  K.SCREWS = [10, 210, 420].flatMap(y => [K.iso(K.O, 9, y + 9, 150), K.iso(K.O, 309, y + 9, 150)]);
  // things on the shelves once it stands: books, a pot with leaves, a cup (p 0..1)
  K.things = (ctx, p, lt) => { const o = K.O; if (p <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(p);
    [0, 1, 2, 3].forEach(k => K.box(ctx, o, 40 + k * 28, 228, 40, 24, 120 - k * 12, 90, k % 2 ? '#EFEFEF' : '#FFFFFF'));
    K.box(ctx, o, 180, 438, 50, 70, 60, 70, '#FFFFFF'); const [lx, ly] = K.iso(o, 215, 520, 85); ctx.strokeStyle = K.COL.ink; ctx.lineWidth = 3; ctx.fillStyle = '#FFFFFF';
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(lx + Math.cos(k * 1.3) * 26, ly - 26 - k * 14 + 3 * Math.sin(lt * 2 + k), 22, 12, k, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    K.box(ctx, o, 120, 28, 60, 50, 50, 50, '#FFFFFF'); ctx.restore(); };
  // drop a part from above: returns the y offset for a fall over 0.35 s from t0
  K.fall = (lt, t0) => { const u = (lt - t0) / 0.35; return u <= 0 ? null : 260 * (1 - Ease.outBack(clamp(u), 1.3)); };
})();

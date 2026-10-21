// toon: the 산책왕 멍멍 reel's kit (a project module). Saturday-morning cartoon: flat colours inside thick black ink
// lines, one shadow tone, rubber-hose legs, squash and stretch, smears and speed lines, stars, burst balloons. The
// star is 멍멍, a tan dog with floppy ears, a red collar and a tail that never stops. Titles Black Han Sans, lines Jua.
(() => {
  const K = {}, COL = { ink: '#1B1B1B', sky: '#6EC8FF', grass: '#7ED957', grass2: '#5BB83A', yel: '#FFD23F', red: '#FF5A5F', dog: '#F4A259', dog2: '#D9823B', white: '#FFFFFF', blue: '#3D7CFF', pink: '#FF8FB1' };
  K.COL = COL;
  const LW = 8;
  // fill a path with a flat colour and ink it; o.shade: a darker band on the lower right, clipped inside
  K.ink = (ctx, fn, fill, o = {}) => { ctx.save(); ctx.beginPath(); fn(ctx); ctx.fillStyle = fill; ctx.fill();
    // cel shade: inside the shape, a darker tone, then the shape again shifted up-left in its own colour, so a crescent
    // of shade is left on the lower right
    if (o.shade) { ctx.save(); ctx.clip(); ctx.fillStyle = o.shadeCol || 'rgba(0,0,0,0.16)'; ctx.fillRect(-1e4, -1e4, 2e4, 2e4); ctx.translate(-o.shade[0], -o.shade[1]); ctx.beginPath(); fn(ctx); ctx.fillStyle = fill; ctx.fill(); ctx.restore(); }
    ctx.lineWidth = o.lw ?? LW; ctx.strokeStyle = COL.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); fn(ctx); ctx.stroke(); ctx.restore(); };
  K.circle = (ctx, x, y, r, fill, o = {}) => K.ink(ctx, c => c.arc(x, y, r, 0, TAU), fill, o);
  K.ell = (ctx, x, y, rx, ry, rot, fill, o = {}) => K.ink(ctx, c => c.ellipse(x, y, rx, ry, rot, 0, TAU), fill, o);
  K.star = (ctx, x, y, r, rot, fill = COL.yel, o = {}) => K.ink(ctx, c => { for (let i = 0; i < 10; i++) { const a = rot + i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, fill, { lw: 6, ...o });
  // a burst balloon with a word in it
  K.burst = (ctx, x, y, r, s, size, p = 1, fill = COL.yel) => { if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(clamp(p)); if (e <= 1e-3) return; ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(-0.08);
    K.ink(ctx, c => { const n = 14; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rr = i % 2 ? r * 0.72 : r * (1 + 0.08 * Math.sin(i * 3)); i ? c.lineTo(Math.cos(a) * rr * 1.3, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr * 1.3, Math.sin(a) * rr); } c.closePath(); }, fill);
    K.word(ctx, s, 0, size * 0.35, size, { align: 'center', fill: COL.red }); ctx.restore(); };
  // cartoon lettering: thick ink outline, flat fill, a hard drop
  K.word = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = `400 ${size}px ${o.fam || FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.a ?? 1;
    ctx.lineWidth = size * 0.16; ctx.strokeStyle = COL.ink; ctx.strokeText(s, x + size * 0.05, y + size * 0.07); ctx.fillStyle = COL.ink; ctx.fillText(s, x + size * 0.05, y + size * 0.07);
    ctx.strokeText(s, x, y); ctx.fillStyle = o.fill || COL.white; ctx.fillText(s, x, y); ctx.restore(); };
  K.pop = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.3; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return; ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(o.rot ?? 0); K.word(ctx, s, 0, 0, size, o); ctx.restore(); };
  K.speed = (ctx, x, y, w, h, t, a = 1) => { ctx.save(); ctx.strokeStyle = `rgba(27,27,27,${0.6 * a})`; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const yy = y + hash(i * 3.3) * h, len = 80 + hash(i * 1.7) * 160, off = ((t * 1400 + hash(i) * 600) % 700); ctx.lineWidth = 5 + (i % 3) * 2; ctx.beginPath(); ctx.moveTo(x - off, yy); ctx.lineTo(x - off - len, yy); ctx.stroke(); } ctx.restore(); };
  // 멍멍: x, y = the ground under its middle; s scale; run = run phase (radians) or null for standing; o: {sq, wag, tongue, crown, look}
  K.dog = (ctx, x, y, s, run, o = {}) => { const D1 = o.col || COL.dog, D2 = o.col2 || COL.dog2, sq = o.sq ?? 0, sx = s * (1 + 0.2 * sq), sy = s * (1 - 0.2 * sq), bob = run != null ? Math.abs(Math.sin(run)) * 18 * s : 0;
    ctx.save(); ctx.translate(x, y - bob); ctx.scale(sx / s, sy / s);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(0, bob, 150 * s, 18 * s, 0, 0, TAU); ctx.fill();
    // legs (rubber hose): back pair then front pair, swinging opposite
    const leg = (lx, ph, far) => { const a = run != null ? Math.sin(run + ph) * 0.8 : 0, kx = lx + Math.sin(a) * 50 * s, ky = -20 * s + Math.abs(Math.cos(a)) * -4 * s; ctx.save(); ctx.strokeStyle = COL.ink; ctx.lineCap = 'round'; ctx.lineWidth = 34 * s + LW; ctx.beginPath(); ctx.moveTo(lx, -80 * s); ctx.quadraticCurveTo(lx + Math.sin(a) * 30 * s, -45 * s, kx, ky); ctx.stroke();
      ctx.strokeStyle = far ? D2 : D1; ctx.lineWidth = 34 * s; ctx.stroke(); ctx.restore(); K.ell(ctx, kx + 8 * s, ky + 4 * s, 26 * s, 14 * s, 0, COL.white, { lw: 6 }); };
    leg(-80 * s, Math.PI, true); leg(70 * s, 0, true);
    // tail
    const wag = Math.sin(o.wag ?? 0) * 0.5; ctx.save(); ctx.translate(-140 * s, -150 * s); ctx.rotate(-0.9 + wag); K.ink(ctx, c => { c.moveTo(0, 0); c.quadraticCurveTo(-30 * s, -60 * s, 10 * s, -110 * s); c.quadraticCurveTo(14 * s, -60 * s, 22 * s, 4 * s); c.closePath(); }, D1); ctx.restore();
    // body
    K.ink(ctx, c => c.ellipse(0, -140 * s, 160 * s, 85 * s, 0, 0, TAU), D1, { shade: [10 * s, 14 * s] });
    K.ink(ctx, c => c.ellipse(20 * s, -110 * s, 90 * s, 45 * s, 0, 0, TAU), COL.white, { lw: 0.01 });
    leg(-60 * s, 0, false); leg(90 * s, Math.PI, false);
    // head
    const hx = 150 * s + (o.look ?? 0) * 10 * s, hy = -250 * s;
    K.ell(ctx, hx - 70 * s, hy - 10 * s, 40 * s, 80 * s, 0.5 + 0.15 * Math.sin((run ?? 0) * 2), D2);
    K.circle(ctx, hx, hy, 100 * s, D1, { shade: [8 * s, 12 * s] });
    K.ell(ctx, hx + 70 * s, hy + 30 * s, 60 * s, 46 * s, 0, COL.white);
    K.ell(ctx, hx + 112 * s, hy + 10 * s, 20 * s, 15 * s, 0, COL.ink, { lw: 1 });
    for (const [ex, er] of [[hx + 10 * s, 1], [hx + 60 * s, 0.9]]) { K.ell(ctx, ex, hy - 30 * s, 20 * s * er, 28 * s * er, 0, COL.white, { lw: 6 }); ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.ellipse(ex + 6 * s, hy - 26 * s, 10 * s * er, 15 * s * er, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(ex + 9 * s, hy - 32 * s, 4 * s, 0, TAU); ctx.fill(); }
    if (o.tongue !== false) K.ink(ctx, c => { c.moveTo(hx + 70 * s, hy + 60 * s); c.quadraticCurveTo(hx + 76 * s, hy + 110 * s, hx + 96 * s, hy + 100 * s); c.quadraticCurveTo(hx + 104 * s, hy + 70 * s, hx + 92 * s, hy + 60 * s); c.closePath(); }, COL.pink, { lw: 6 });
    K.ink(ctx, c => { c.moveTo(hx - 70 * s, hy + 70 * s); c.quadraticCurveTo(hx, hy + 110 * s, hx + 50 * s, hy + 80 * s); }, 'rgba(0,0,0,0)', { lw: 26 * s }); ctx.save(); ctx.strokeStyle = COL.red; ctx.lineWidth = 16 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx - 70 * s, hy + 70 * s); ctx.quadraticCurveTo(hx, hy + 110 * s, hx + 50 * s, hy + 80 * s); ctx.stroke(); ctx.restore();
    K.circle(ctx, hx - 10 * s, hy + 112 * s, 14 * s, COL.yel, { lw: 5 });
    if (o.crown) { const c = o.crown; ctx.save(); ctx.translate(hx - 10 * s, hy - 100 * s - c * 0); K.ink(ctx, cc => { cc.moveTo(-60 * s, 0); cc.lineTo(-70 * s, -70 * s); cc.lineTo(-30 * s, -35 * s); cc.lineTo(0, -85 * s); cc.lineTo(30 * s, -35 * s); cc.lineTo(70 * s, -70 * s); cc.lineTo(60 * s, 0); cc.closePath(); }, COL.yel, { shade: [6 * s, 6 * s] }); ctx.restore(); }
    ctx.restore(); };
  // the park: sky, inked clouds, hills, lollipop trees, a path; pan scrolls it
  K.park = (ctx, pan, o = {}) => { ctx.fillStyle = COL.sky; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) { const x = ((i * 600 - pan * 0.15) % 2400 + 2400) % 2400 - 250, y = 120 + (i % 2) * 90; K.ink(ctx, c => { c.arc(x, y, 55, Math.PI, 0); c.arc(x + 80, y - 20, 65, Math.PI, 0); c.arc(x + 165, y, 50, Math.PI, 0); c.closePath(); }, COL.white, { lw: 6 }); }
    K.ink(ctx, c => { c.moveTo(0, 700); for (let x = 0; x <= W; x += 40) c.lineTo(x, 640 + Math.sin((x + pan * 0.4) * 0.006) * 50); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); }, COL.grass2, { lw: 6 });
    for (let i = 0; i < 6; i++) { const x = ((i * 420 - pan * 0.6) % 2520 + 2520) % 2520 - 200; ctx.save(); ctx.lineWidth = 6; K.ink(ctx, c => c.rect(x - 14, 560, 28, 160), '#9A5B2E', { lw: 6 }); K.circle(ctx, x, 520, 90, i % 2 ? '#4CAF50' : '#66BB55', { shade: [12, 12] }); ctx.restore(); }
    K.ink(ctx, c => c.rect(-20, 760, W + 40, 360), COL.grass, { lw: 6 }); K.ink(ctx, c => c.rect(-20, 840, W + 40, 120), '#F2D49B', { lw: 6 });
    ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 5; for (let i = 0; i < 14; i++) { const x = ((i * 170 - pan) % 2380 + 2380) % 2380 - 200; ctx.beginPath(); ctx.moveTo(x, 900); ctx.lineTo(x + 50, 900); ctx.stroke(); } ctx.restore(); };
  // a phone card for the app's numbers
  K.card = (ctx, x, y, w, h, p = 1) => { if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(clamp(p)); if (e <= 1e-3) return; ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(e, e); ctx.translate(-(x + w / 2), -(y + h / 2));
    K.ink(ctx, c => c.roundRect(x + 10, y + 12, w, h, 34), COL.ink); K.ink(ctx, c => c.roundRect(x, y, w, h, 34), COL.white); ctx.restore(); };
  K.text = (ctx, s, x, y, size, o = {}) => { ctx.save(); ctx.font = `400 ${size}px ${o.fam || FAM.sans}`; ctx.textAlign = o.align || 'left'; ctx.fillStyle = o.color || COL.ink; ctx.globalAlpha *= o.a ?? 1; ctx.fillText(s, x, y); ctx.restore(); };
  window.TOON = K;
})();

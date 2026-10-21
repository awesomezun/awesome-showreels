// kong: the 콩이 reel's kit (a project module). A character-IP look: soft, glossy, no outlines. 콩이 is a green bean
// with a sprout: a kidney body with a radial gradient, a long highlight, blush, glossy eyes, little capsule arms and
// feet; faces (happy, wink, surprised, love, smile) and props (party hat, sunglasses, crown, bow) change on the beat.
// The stage: velvet curtains, a bulb frame, a spotlight, a glossy floor, fans' light sticks, confetti. Jua throughout.
(() => {
  const K = {}, COL = { bean: '#7CC95A', bean2: '#4E9A3A', bean0: '#B8EC93', ink: '#2A2140', pink: '#FF8FC7', purple: '#7B5CD6', gold: '#FFD15C', red: '#C8283C', cream: '#FFF6EC', white: '#FFFFFF' };
  K.COL = COL;
  const g2 = (ctx, x0, y0, r, a, b) => { const g = ctx.createRadialGradient(x0, y0, 0, x0, y0, r); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
  // 콩이 at (x, y) = feet on the ground; s scale; o = {face, prop, sq, arms: [l, r] (radians), lean, blink, hop}
  K.kong = (ctx, x, y, s, t, o = {}) => { const sq = o.sq ?? 0, sx = s * (1 + 0.16 * sq), sy = s * (1 - 0.16 * sq);
    ctx.save(); ctx.fillStyle = 'rgba(40,20,60,0.25)'; ctx.beginPath(); ctx.ellipse(x, y, 150 * s, 24 * s, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(x, y - (o.hop ?? 0)); ctx.rotate(o.lean ?? 0); ctx.scale(sx, sy);
    // feet
    for (const d of [-1, 1]) { ctx.fillStyle = COL.bean2; ctx.beginPath(); ctx.ellipse(d * 55, -14, 46, 24, 0, 0, TAU); ctx.fill(); }
    // arms (capsules from the shoulders)
    // arms: [left, right], 0 = hanging a little out, larger = raised (2.4 is straight up)
    const arms = o.arms || [0.3, 0.3];
    [[-1, arms[0]], [1, arms[1]]].forEach(([d, a]) => { ctx.save(); ctx.translate(d * 120, -170); ctx.rotate(-d * (0.5 + a)); ctx.fillStyle = COL.bean; ctx.beginPath(); ctx.roundRect(-22, 0, 44, 140, 22); ctx.fill();
      ctx.fillStyle = COL.bean0; ctx.beginPath(); ctx.arc(0, 136, 27, 0, TAU); ctx.fill(); ctx.restore(); });
    // the body: a kidney
    const body = () => { ctx.beginPath(); ctx.moveTo(0, -330); ctx.bezierCurveTo(130, -340, 175, -230, 160, -140); ctx.bezierCurveTo(150, -40, 90, -20, 0, -22); ctx.bezierCurveTo(-90, -20, -150, -40, -160, -140); ctx.bezierCurveTo(-175, -230, -130, -340, 0, -330); ctx.closePath(); };
    body(); ctx.fillStyle = g2(ctx, -50, -240, 260, COL.bean0, COL.bean2); ctx.fill();
    ctx.save(); body(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(-88, -230, 22, 70, 0.35, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(-70, -140, 9, 0, TAU); ctx.fill(); ctx.restore();
    // the sprout
    ctx.strokeStyle = COL.bean2; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -328); ctx.quadraticCurveTo(10, -380, -6, -410); ctx.stroke();
    ctx.fillStyle = COL.bean; ctx.beginPath(); ctx.ellipse(-36, -420, 38, 18, -0.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(26, -408, 34, 16, 0.5, 0, TAU); ctx.fill();
    // face
    const face = o.face || 'smile', blink = o.blink ?? ((Math.floor(t * 6) % 23) === 0);
    const eye = (ex, kind) => { if (kind === 'closed' || blink && kind === 'open') { ctx.strokeStyle = COL.ink; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(ex, -205, 24, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); return; }
      if (kind === 'heart') { ctx.fillStyle = '#FF4F8B'; ctx.beginPath(); ctx.moveTo(ex, -175); ctx.bezierCurveTo(ex - 50, -205, ex - 22, -248, ex, -222); ctx.bezierCurveTo(ex + 22, -248, ex + 50, -205, ex, -175); ctx.fill(); return; }
      const r = kind === 'big' ? 34 : 27; ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.ellipse(ex, -205, r * 0.85, r, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(ex - r * 0.3, -205 - r * 0.38, r * 0.32, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(ex + r * 0.28, -205 + r * 0.3, r * 0.14, 0, TAU); ctx.fill(); };
    const E = { smile: ['open', 'open'], happy: ['closed', 'closed'], wink: ['open', 'closed'], surprised: ['big', 'big'], love: ['heart', 'heart'] }[face] || ['open', 'open'];
    eye(-55, E[0]); eye(55, E[1]);
    ctx.fillStyle = 'rgba(255,120,150,0.5)'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 100, -160, 26, 15, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = COL.ink; ctx.fillStyle = '#E8506E'; ctx.lineWidth = 8;
    if (face === 'surprised') { ctx.beginPath(); ctx.ellipse(0, -140, 16, 22, 0, 0, TAU); ctx.fillStyle = COL.ink; ctx.fill(); }
    else if (face === 'happy' || face === 'love') { ctx.beginPath(); ctx.moveTo(-30, -160); ctx.quadraticCurveTo(0, -110, 30, -160); ctx.closePath(); ctx.fillStyle = COL.ink; ctx.fill(); ctx.fillStyle = '#FF6F8E'; ctx.beginPath(); ctx.ellipse(0, -138, 14, 8, 0, 0, TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, -165, 24, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    // props
    const prop = o.prop;
    if (prop === 'hat') { ctx.save(); ctx.translate(30, -330); ctx.rotate(0.25); const hg = ctx.createLinearGradient(-60, 0, 60, 0); hg.addColorStop(0, COL.pink); hg.addColorStop(1, COL.purple); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(0, -150); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = COL.gold; ctx.beginPath(); ctx.arc(0, -150, 18, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-20 + i * 18, -40 - i * 30, 7, 0, TAU); ctx.fill(); } ctx.restore(); }
    if (prop === 'glasses') { ctx.fillStyle = '#1C1830'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.roundRect(d * 55 - 45, -235, 90, 58, 18); ctx.fill(); } ctx.fillRect(-12, -222, 24, 8); ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 55 - 30, -228); ctx.lineTo(d * 55 - 12, -228); ctx.lineTo(d * 55 - 34, -190); ctx.closePath(); ctx.fill(); } }
    if (prop === 'crown') { ctx.save(); ctx.translate(0, -322); const cg = ctx.createLinearGradient(0, -90, 0, 0); cg.addColorStop(0, '#FFE89A'); cg.addColorStop(1, '#F2B33D'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(-90, -80); ctx.lineTo(-40, -40); ctx.lineTo(0, -95); ctx.lineTo(40, -40); ctx.lineTo(90, -80); ctx.lineTo(80, 0); ctx.closePath(); ctx.fill();
      for (const [cx, cc] of [[-45, COL.pink], [0, '#5AC8FA'], [45, COL.pink]]) { ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(cx, -22, 10, 0, TAU); ctx.fill(); } ctx.restore(); }
    if (prop === 'bow') { ctx.save(); ctx.translate(90, -300); ctx.rotate(0.3); ctx.fillStyle = COL.pink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -40); ctx.lineTo(-60, 40); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(60, -40); ctx.lineTo(60, 40); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FF5FA8'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore(); };
  // the stage
  K.stage = (ctx, t, o = {}) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3A2470'); g.addColorStop(0.65, '#B04A9A'); g.addColorStop(1, '#2A1850'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // bulbs round a frame
    for (let i = 0; i < 26; i++) { const u = i / 26, x = 260 + u * 1400, on = (Math.floor(t * 4) + i) % 3 !== 0; ctx.fillStyle = on ? COL.gold : '#7A5A30'; ctx.beginPath(); ctx.arc(x, 90, 11, 0, TAU); ctx.fill(); if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,209,92,0.25)'; ctx.beginPath(); ctx.arc(x, 90, 26, 0, TAU); ctx.fill(); ctx.restore(); } }
    const fl = ctx.createLinearGradient(0, 820, 0, H); fl.addColorStop(0, '#5A2E7A'); fl.addColorStop(1, '#1E1036'); ctx.fillStyle = fl; ctx.fillRect(0, 820, W, H - 820);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, 820, W, 4);
    const sp = o.spot ?? 1; if (sp > 0) { const sx = o.sx ?? W / 2; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createLinearGradient(0, 0, 0, 900); sg.addColorStop(0, `rgba(255,240,200,${0.05 * sp})`); sg.addColorStop(1, `rgba(255,240,200,${0.3 * sp})`); ctx.fillStyle = sg;
      ctx.beginPath(); ctx.moveTo(sx - 60, 0); ctx.lineTo(sx + 60, 0); ctx.lineTo(sx + 330, 900); ctx.lineTo(sx - 330, 900); ctx.closePath(); ctx.fill(); ctx.fillStyle = `rgba(255,240,200,${0.25 * sp})`; ctx.beginPath(); ctx.ellipse(sx, 900, 330, 50, 0, 0, TAU); ctx.fill(); ctx.restore(); } };
  // red velvet curtains: open = 0 closed .. 1 fully open
  K.curtains = (ctx, open) => { const w = W / 2 * (1 - 0.82 * open);
    for (const side of [0, 1]) { const x0 = side ? W - w : 0; const g = ctx.createLinearGradient(x0, 0, x0 + w, 0); for (let i = 0; i <= 8; i++) g.addColorStop(i / 8, i % 2 ? '#8E1426' : COL.red); ctx.fillStyle = g; ctx.fillRect(x0, 0, w, H); }
    ctx.fillStyle = '#7A1020'; ctx.fillRect(0, 0, W, 60); ctx.fillStyle = COL.gold; ctx.fillRect(0, 56, W, 8); };
  K.sticks = (ctx, t, B, a = 1) => { for (let i = 0; i < 22; i++) { const x = 40 + i * 88 + (i % 2) * 20, y = 1030 - (i % 3) * 20, ang = Math.sin(t / B * Math.PI + i * 0.4) * 0.5, col = i % 3 === 0 ? COL.pink : i % 3 === 1 ? '#7CE0FF' : COL.gold;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = '#1A1030'; ctx.fillRect(-7, 0, 14, 80); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col; ctx.shadowBlur = 24 * a; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-10, -90, 20, 90, 10); ctx.fill(); ctx.restore(); } };
  K.confetti = (ctx, t, a = 1) => { if (a <= 0) return; for (let i = 0; i < 70; i++) { const x = (hash(i * 3.1) * W + Math.sin(t * 2 + i) * 40), y = ((hash(i * 7.7) * H + t * (160 + 120 * hash(i))) % (H + 40)) - 20, c = [COL.pink, COL.gold, '#7CE0FF', '#9BE07A', '#FFFFFF'][i % 5];
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 4 + i); ctx.scale(1, Math.cos(t * 6 + i)); ctx.fillStyle = c; ctx.fillRect(-8, -5, 16, 10); ctx.restore(); } };
  // type: Jua, white with a soft coloured glow and a pop
  K.title = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.32; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.rotate(o.rot ?? 0); ctx.font = `400 ${size}px ${FAM.display}`; ctx.textAlign = o.align || 'left'; ctx.lineJoin = 'round';
    ctx.shadowColor = o.glow || COL.pink; ctx.shadowBlur = size * 0.35; ctx.lineWidth = size * 0.12; ctx.strokeStyle = o.edge || '#5A2A8A'; ctx.strokeText(s, 0, 0); ctx.shadowBlur = 0; ctx.fillStyle = o.color || COL.white; ctx.fillText(s, 0, 0); ctx.restore(); };
  K.tag = (ctx, s, x, y, size, lt, o = {}) => { const p = (lt - (o.at ?? 0)) / 0.25; if (p <= 0) return; const e = p >= 1 ? 1 : Ease.outBack(p); if (e <= 1e-3) return; ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.font = `400 ${size}px ${FAM.display}`; const w = ctx.measureText(s).width + size;
    ctx.fillStyle = o.bg || COL.white; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 0.95, w, size * 1.35, size * 0.67); ctx.fill(); ctx.fillStyle = o.color || COL.purple; ctx.textAlign = 'center'; ctx.fillText(s, 0, size * 0.1); ctx.restore(); };
  window.KONG = K;
})();

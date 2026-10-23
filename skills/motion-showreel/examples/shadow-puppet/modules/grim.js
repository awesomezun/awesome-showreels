// grim: the 그림자 토끼전 reel's shadow-theatre kit (a project module). A cloth screen lit from behind by an oil lamp
// (a warm radial light that flickers, a fine weave, the proscenium and curtains around it), and leather puppets as
// shadows: each puppet is drawn into its own buffer as a warm dark silhouette, its carved holes cut out so the lamp
// shows through, translucent dye laid in some of them, jointed parts turning on pivots, held by rods from below; a
// puppet lifted off the screen goes soft and large. Subtitles sit in the strip under the stage. Board letters are
// Song Myung, captions Gowun Batang.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { shadow: '#24150E', red: '#D9503A', green: '#5FA35A', blue: '#3F7FC4', gold: '#F2B640', pink: '#E77B86', cream: '#F4E6CC' };
  const C = K.COL;
  K.SX = 160; K.SY = 50; K.SW = 1600; K.SH = 820;
  K.F = (size, fam = 'display', w = 400) => `${w} ${size}px ${FAM[fam]}`;
  K.lamp = (lt, on = 1) => on * (0.9 + 0.05 * Math.sin(lt * 13.1) + 0.03 * Math.sin(lt * 29.7 + 1) + 0.02 * Math.sin(lt * 5.3));
  let weave = null, buf = null;
  // the stage: proscenium, curtains, the lit screen (L = lamp level, lx = where the lamp stands)
  K.stage = (ctx, L, o = {}) => {
    ctx.fillStyle = '#0D0806'; ctx.fillRect(0, 0, W, H);
    const { SX, SY, SW, SH } = K, lx = o.lx ?? SX + SW / 2, ly = SY + SH * 0.62;
    const g = ctx.createRadialGradient(lx, ly, 40, lx, ly, SW * 0.75);
    const c0 = [255, 226, 168], c1 = [196, 108, 46], c2 = [70, 30, 14];
    const col = (c, k) => `rgb(${c[0] * k | 0},${c[1] * k | 0},${c[2] * k | 0})`;
    g.addColorStop(0, col(c0, L)); g.addColorStop(0.45, col(c1, L)); g.addColorStop(1, col(c2, 0.4 + 0.6 * L));
    ctx.fillStyle = g; ctx.fillRect(SX, SY, SW, SH);
    if (!weave) { weave = makeBuf(); const w = weave.g; w.fillStyle = '#FFF'; w.fillRect(0, 0, W, H); w.strokeStyle = 'rgba(120,90,60,0.09)'; w.lineWidth = 1;
      for (let x = 0; x < W; x += 4) { w.beginPath(); w.moveTo(x, 0); w.lineTo(x, H); w.stroke(); } for (let y = 0; y < H; y += 4) { w.beginPath(); w.moveTo(0, y); w.lineTo(W, y); w.stroke(); }
      for (let i = 0; i < 400; i++) { w.fillStyle = 'rgba(110,70,40,0.06)'; w.fillRect(hash(i * 3) * W, hash(i * 7) * H, 30 + 60 * hash(i), 2); } }
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(weave.c, SX, SY, SW, SH, SX, SY, SW, SH); ctx.restore();
  };
  K.frame = (ctx) => {          // drawn last: the wooden proscenium and red curtains over the screen's edge
    const { SX, SY, SW, SH } = K;
    ctx.fillStyle = '#2A1710'; ctx.fillRect(0, 0, W, SY + 6); ctx.fillRect(0, SY + SH - 6, W, H - SY - SH + 6); ctx.fillRect(0, 0, SX + 6, H); ctx.fillRect(SX + SW - 6, 0, W - SX - SW + 6, H);
    for (const side of [0, 1]) { const x0 = side ? SX + SW - 70 : 0, w = SX + 70;
      const g = ctx.createLinearGradient(x0, 0, x0 + w, 0); for (let k = 0; k <= 8; k++) g.addColorStop(k / 8, k % 2 ? '#7A1B16' : '#4A0E0B'); ctx.fillStyle = g;
      ctx.beginPath(); if (side) { ctx.moveTo(W, 0); ctx.lineTo(x0 + 40, 0); ctx.quadraticCurveTo(x0 - 10, H * 0.5, x0 + 60, SY + SH); ctx.lineTo(W, SY + SH); } else { ctx.moveTo(0, 0); ctx.lineTo(w - 40, 0); ctx.quadraticCurveTo(w + 10, H * 0.5, w - 60, SY + SH); ctx.lineTo(0, SY + SH); } ctx.closePath(); ctx.fill(); }
    const v = ctx.createLinearGradient(0, 0, 0, 90); v.addColorStop(0, '#5A120E'); v.addColorStop(1, '#3A0A08'); ctx.fillStyle = v; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, 70);
    for (let x = W; x >= 0; x -= 80) ctx.quadraticCurveTo(x - 40, 110, x - 80, 70); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1A0E09'; ctx.fillRect(0, SY + SH, W, 16);
  };
  K.caption = (ctx, s, a) => { if (a <= 0 || !s) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = K.F(50, 'sans', 700); ctx.fillStyle = C.cream; ctx.textAlign = 'center'; ctx.fillText(s, W / 2, 975 + 8 * (1 - clamp(a))); ctx.restore(); };

  // ───────── puppets ─────────
  // draw(p) gets a painter p: p.fill(pathFn) the leather, p.cut(pathFn) a carved hole, p.dye(pathFn, colour) a dyed
  // hole; o.lift 0..1 = how far the puppet is from the screen (softer, larger, paler)
  K.puppet = (ctx, draw, o = {}) => {
    if (!buf) buf = makeBuf(); const g = buf.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
    const P = {
      g,
      fill: (fn) => { g.save(); g.globalCompositeOperation = 'source-over'; g.fillStyle = C.shadow; g.beginPath(); fn(g); g.fill(); g.restore(); },
      cut: (fn) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); fn(g); g.fill(); g.restore(); },
      dye: (fn, col, a = 0.62) => { g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); fn(g); g.fill(); g.globalCompositeOperation = 'source-over'; g.globalAlpha = a; g.fillStyle = col; g.beginPath(); fn(g); g.fill(); g.restore(); },
      line: (pts, w) => { g.save(); g.strokeStyle = C.shadow; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); },
    };
    draw(P);
    const lift = clamp(o.lift ?? 0), { SX, SY, SW, SH } = K;
    ctx.save(); ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip(); ctx.globalAlpha *= o.alpha ?? 1;
    if (lift > 0) { const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, s = 1 + 0.12 * lift; ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.filter = `blur(${(1 + 9 * lift).toFixed(1)}px)`; ctx.globalAlpha *= 1 - 0.35 * lift; }
    ctx.drawImage(buf.c, 0, 0); ctx.restore();
  };
  K.rod = (ctx, x, y, a = 1, lean = 0) => { ctx.save(); ctx.strokeStyle = 'rgba(36,21,14,0.85)'; ctx.lineWidth = 3; ctx.globalAlpha *= a; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + lean, K.SY + K.SH + 10); ctx.stroke(); ctx.restore(); };
  const ell = (g, x, y, rx, ry, r = 0) => g.ellipse(x, y, rx, ry, r, 0, TAU);

  // 토끼: feet at (x, y), facing right (dir -1 faces left); hop 0..1 lifts it in an arc and tucks the legs; ear 0..1 flicks
  K.rabbit = (ctx, x, y, s, o = {}) => {
    const dir = o.dir ?? 1, hop = o.hop ?? 0, ear = o.ear ?? 0, lift = Math.sin(Math.PI * clamp(hop)) * (o.height ?? 90);
    K.puppet(ctx, P => {
      const g = P.g; g.translate(x, y - lift); g.scale(s * dir, s); g.rotate(-0.25 * Math.sin(Math.PI * clamp(hop)) * (hop < 0.5 ? 1 : -0.6));
      P.fill(g2 => { ell(g2, 0, -72, 74, 48, -0.15); ell(g2, 62, -132, 38, 34, 0); ell(g2, -78, -84, 17, 17); ell(g2, -28, -34, 46, 24, 0.25 * hop); ell(g2, 40, -30, 14, 30, 0.3 + 0.5 * hop); });
      for (const [k, dx] of [[0, 46], [1, 64]]) { g.save(); g.translate(dx, -158); g.rotate(-0.35 + k * 0.28 + 0.25 * Math.sin(ear * Math.PI * 2 + k)); P.fill(g2 => ell(g2, 0, -48, 15, 52)); P.dye(g2 => ell(g2, 0, -48, 6, 34), C.pink, 0.55); g.restore(); }
      P.cut(g2 => ell(g2, 70, -140, 6, 7)); P.fill(g2 => ell(g2, 72, -138, 2.5, 3));
      for (let k = 0; k < 3; k++) P.dye(g2 => { g2.arc(-30 + k * 30, -78 + (k % 2) * 8, 13, 0.3, Math.PI - 0.3); }, C.red, 0.6);
      P.cut(g2 => { for (let k = 0; k < 5; k++) { g2.moveTo(-50 + k * 22 + 4, -46); g2.arc(-50 + k * 22, -46, 4, 0, TAU); } });
    }, { lift: o.lift, cx: x, cy: y - 80 });
    if (o.rods !== false) { K.rod(ctx, x, y - lift - 70 * s, 1, 30 * dir); K.rod(ctx, x + 60 * s * dir, y - lift - 130 * s, 0.8, 60 * dir); }
  };
  // 자라: centre of the shell at (x, y); swim 0..1 cycles the flippers; neck 0..1 stretches the head out
  K.turtle = (ctx, x, y, s, o = {}) => {
    const dir = o.dir ?? 1, sw = o.swim ?? 0, neck = o.neck ?? 0;
    K.puppet(ctx, P => {
      const g = P.g; g.translate(x, y); g.scale(s * dir, s); g.rotate(o.tilt ?? 0);
      for (const [px, py, ph, len] of [[70, 10, 0, 70], [-70, 12, Math.PI, 60], [55, 18, Math.PI / 2, 62], [-60, 20, 3 * Math.PI / 2, 52]]) {
        g.save(); g.translate(px, py); g.rotate((px > 0 ? 0.6 : 2.5) + 0.5 * Math.sin(sw * TAU + ph)); P.fill(g2 => ell(g2, len / 2, 0, len / 2, 13)); g.restore(); }
      P.fill(g2 => { g2.moveTo(-120, 18); g2.quadraticCurveTo(-110, -78, 0, -82); g2.quadraticCurveTo(110, -78, 120, 18); g2.closePath(); });
      P.fill(g2 => { const nx = 118 + 46 * neck; g2.moveTo(100, -6); g2.lineTo(nx, -14 - 10 * neck); g2.lineTo(nx, 10); g2.lineTo(100, 14); g2.closePath(); ell(g2, nx + 22, -6 - 8 * neck, 30, 22, -0.2 * neck); });
      P.fill(g2 => { g2.moveTo(-118, 6); g2.lineTo(-150, 14); g2.lineTo(-118, 14); g2.closePath(); });
      const hex = (cx, cy, r) => g2 => { for (let k = 0; k <= 6; k++) { const a = k / 6 * TAU + Math.PI / 6; k ? g2.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : g2.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } };
      for (const [cx, cy] of [[0, -42], [-46, -24], [46, -24], [-86, -2], [86, -2], [0, -4]]) P.dye(hex(cx, cy, 18), C.green, 0.6);
      P.cut(g2 => ell(g2, 128 + 46 * neck, -14 - 8 * neck, 5, 5));
    }, { lift: o.lift, cx: x, cy: y });
    if (o.rods !== false) { K.rod(ctx, x, y + 10 * s, 1, -20 * dir); K.rod(ctx, x + (130 + 46 * neck) * s * dir, y - 6 * s, 0.8, 40 * dir); }
  };
  K.fish = (ctx, x, y, s, ph, col = C.blue) => K.puppet(ctx, P => { const g = P.g; g.translate(x, y); g.scale(s, s); g.rotate(0.12 * Math.sin(ph));
    P.fill(g2 => { ell(g2, 0, 0, 46, 22); g2.moveTo(-40, 0); g2.lineTo(-76, -22 + 8 * Math.sin(ph * 2)); g2.lineTo(-76, 22 + 8 * Math.sin(ph * 2)); g2.closePath(); });
    P.dye(g2 => { for (let k = 0; k < 3; k++) { g2.moveTo(-4 + k * 14 + 8, 0); g2.arc(-4 + k * 14, 0, 8, 0, TAU); } }, col, 0.6); P.cut(g2 => ell(g2, 30, -5, 4, 4)); });
  // waves: a silhouette strip with a moving crest and dyed bubbles; top = crest height
  K.waves = (ctx, top, lt, o = {}) => K.puppet(ctx, P => { const g = P.g, sp = o.speed ?? 60;
    P.fill(g2 => { g2.moveTo(K.SX - 20, K.SY + K.SH + 20); for (let x = K.SX - 20; x <= K.SX + K.SW + 20; x += 20) g2.lineTo(x, top + 18 * Math.sin((x + lt * sp) * 0.012) + 8 * Math.sin((x - lt * sp * 0.7) * 0.03)); g2.lineTo(K.SX + K.SW + 20, K.SY + K.SH + 20); g2.closePath(); });
    P.dye(g2 => { for (let k = 0; k < 14; k++) { const x = K.SX + ((hash(k * 3.3) * K.SW + lt * sp * 0.5) % K.SW), yy = top + 50 + 60 * hash(k * 5.1), r = 6 + 8 * hash(k); g2.moveTo(x + r, yy); g2.arc(x, yy, r, 0, TAU); } }, C.blue, 0.5);
  }, { lift: o.lift, alpha: o.alpha });
  // land: a hill with a pine, dyed grass tufts
  K.land = (ctx, x0, x1, top, o = {}) => K.puppet(ctx, P => { const g = P.g;
    P.fill(g2 => { g2.moveTo(x0 - 160, K.SY + K.SH + 20); g2.quadraticCurveTo(x0 - 60, top + 50, x0, top + 40); g2.quadraticCurveTo((x0 + x1) / 2, top - 40, x1, top + 60); g2.lineTo(x1 + 60, K.SY + K.SH + 20); g2.closePath(); });
    const px = x0 + (x1 - x0) * 0.3, py = top + 10; P.fill(g2 => { g2.rect(px - 7, py - 150, 14, 160); for (let k = 0; k < 4; k++) { const yy = py - 120 - k * 50, w = 110 - k * 22; g2.moveTo(px - w, yy + 20); g2.lineTo(px, yy - 40); g2.lineTo(px + w, yy + 20); g2.closePath(); } });
    P.dye(g2 => { for (let k = 0; k < 6; k++) { const x = x0 + 60 + k * (x1 - x0 - 120) / 5, yy = top + 70 + 10 * Math.sin(k); g2.moveTo(x, yy); g2.lineTo(x + 10, yy - 26); g2.lineTo(x + 20, yy); g2.closePath(); } }, C.green, 0.6);
  }, { lift: o.lift });
  // a hanging board with letters cut through it, on two strings from the top (drop 0..1)
  K.board = (ctx, s, cx, y, size, drop, o = {}) => { if (drop <= 0) return; const yy = y - 420 * (1 - Ease.outBack(clamp(drop), 1.4)), sway = 0.03 * Math.sin((o.lt ?? 0) * 1.7) * (1 - clamp(drop - 0.6));
    K.puppet(ctx, P => { const g = P.g; g.translate(cx, yy); g.rotate(sway); g.font = K.F(size, o.fam || 'display'); const w = g.measureText(s).width + size * 1.2, h = size * 1.55;
      P.fill(g2 => { g2.rect(-w / 2, -h / 2, w, h); }); P.cut(g2 => { g2.rect(-w / 2 + 10, -h / 2 + 10, w - 20, 4); g2.rect(-w / 2 + 10, h / 2 - 14, w - 20, 4); });
      g.save(); g.globalCompositeOperation = 'destination-out'; g.textAlign = 'center'; g.fillText(s, 0, size * 0.36); g.restore();
      g.save(); g.globalAlpha = 0.35; g.fillStyle = o.dye || C.gold; g.textAlign = 'center'; g.fillText(s, 0, size * 0.36); g.restore();
      P.line([[-w / 2 + 30, -h / 2], [-w / 2 + 30, -h / 2 - 600]], 3); P.line([[w / 2 - 30, -h / 2], [w / 2 - 30, -h / 2 - 600]], 3);
    }); };
  K.moon = (ctx, x, y, r) => K.puppet(ctx, P => { P.fill(g => { g.arc(x, y, r + 14, 0, TAU); }); P.dye(g => { g.arc(x, y, r, 0, TAU); }, C.gold, 0.45); P.line([[x, y - r - 14], [x, K.SY - 20]], 4); });
  // 용궁 and 용왕
  K.palace = (ctx, cx, base, s, lt) => K.puppet(ctx, P => { const g = P.g; g.translate(cx, base); g.scale(s, s);
    P.fill(g2 => { g2.rect(-260, -200, 520, 200); g2.moveTo(-340, -190); g2.quadraticCurveTo(-300, -200, -280, -260); g2.lineTo(280, -260); g2.quadraticCurveTo(300, -200, 340, -190); g2.lineTo(300, -230); g2.lineTo(-300, -230); g2.closePath();
      g2.moveTo(-220, -270); g2.quadraticCurveTo(-190, -280, -170, -330); g2.lineTo(170, -330); g2.quadraticCurveTo(190, -280, 220, -270); g2.closePath(); });
    for (let k = 0; k < 5; k++) P.dye(g2 => g2.rect(-220 + k * 92, -160, 50, 90), C.gold, 0.4 + 0.2 * Math.sin(lt * 3 + k));
    P.dye(g2 => g2.rect(-50, -300, 100, 30), C.red, 0.6);
  });
  K.king = (ctx, x, y, s, lt) => K.puppet(ctx, P => { const g = P.g; g.translate(x, y); g.scale(s, s); g.rotate(0.03 * Math.sin(lt * 2));
    P.fill(g2 => { g2.moveTo(-90, 0); g2.lineTo(-60, -230); g2.lineTo(60, -230); g2.lineTo(90, 0); g2.closePath(); ell(g2, 0, -270, 42, 46); g2.rect(-46, -340, 92, 40); });
    g.save(); g.translate(50, -200); g.rotate(-0.5 - 0.3 * Math.sin(lt * 3)); P.fill(g2 => ell(g2, 50, 0, 60, 22)); g.restore();
    P.dye(g2 => { for (let k = 0; k < 3; k++) { g2.moveTo(30 - k * 30 + 14, -170 + k * 50); g2.arc(-k * 0, -150 + k * 50, 14, 0, TAU); } }, C.red, 0.6);
    P.dye(g2 => { for (let k = 0; k < 4; k++) { g2.moveTo(-36 + k * 24, -340); g2.lineTo(-30 + k * 24, -372); g2.lineTo(-24 + k * 24, -340); g2.closePath(); } }, C.gold, 0.6);
    P.cut(g2 => ell(g2, 16, -280, 5, 5)); P.fill(g2 => { g2.moveTo(-10, -240); g2.quadraticCurveTo(10, -170, 30, -200); g2.lineTo(20, -238); g2.closePath(); });
  });
  window.GRIM = K;
})();

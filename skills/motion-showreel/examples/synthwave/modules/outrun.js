// outrun: the 네온 하이웨이 1986 reel's synthwave kit (a project module). A violet sky that burns pink at the horizon, a
// sun in a yellow-to-magenta gradient cut by bands that thicken toward the horizon and slide down, wireframe
// mountains, a magenta perspective grid rushing at the camera with a road and dashes, palm silhouettes passing, a red
// sports car seen from behind with glowing tail lights, chrome lettering with a horizon line and a sheen, neon tubes
// that flicker, and a VHS pass over everything (scanlines, a tracking band that tears the picture sideways, a soft
// ghost, the on-screen display). Display type is Gugi, the display and HUD Orbit.
(() => {
  const K = {}, TAU = Math.PI * 2;
  K.COL = { sky0: '#0E0420', sky1: '#2D0B4E', glow: '#FF4F9A', grid: '#FF3CC8', cyan: '#3CF0FF', sun0: '#FFE45C', sun1: '#FF2E88', car: '#E8203C', white: '#FFF4FF' };
  const C = K.COL;
  K.F = (size, fam = 'display') => `${size}px ${FAM[fam]}`;
  K.HY = 600;      // horizon
  K.sky = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, K.HY); g.addColorStop(0, C.sky0); g.addColorStop(0.65, C.sky1); g.addColorStop(1, '#7A1B6E'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, K.HY);
    for (let i = 0; i < 120; i++) { const x = hash(i * 1.7) * W, y = hash(i * 3.1) * K.HY * 0.7; ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.5 * hash(i * 7)})`; ctx.fillRect(x, y, 2, 2); }
    const h = ctx.createLinearGradient(0, K.HY - 160, 0, K.HY + 10); h.addColorStop(0, 'rgba(255,79,154,0)'); h.addColorStop(1, 'rgba(255,79,154,0.55)'); ctx.fillStyle = h; ctx.fillRect(0, K.HY - 160, W, 170); };
  K.sun = (ctx, x, y, r, lt, o = {}) => {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
    const g = ctx.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, C.sun0); g.addColorStop(0.55, '#FF8A4C'); g.addColorStop(1, C.sun1); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.globalCompositeOperation = 'destination-out'; const sl = (lt * 22) % 40;
    for (let k = 0; k < 10; k++) { const yy = y + r * 0.05 + k * 40 + sl - 40, th = 3 + (yy - y) / r * 22; if (yy > y - 10) ctx.fillRect(x - r, yy, 2 * r, Math.max(0, th)); }
    ctx.restore(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.8); gl.addColorStop(0, 'rgba(255,90,150,0.35)'); gl.addColorStop(1, 'rgba(255,90,150,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 2 * r, y - 2 * r, 4 * r, 4 * r); ctx.restore();
  };
  K.mountains = (ctx, off = 0) => { ctx.save(); const pts = []; for (let x = -100; x <= W + 100; x += 60) { const k = Math.floor((x + off) / 60); pts.push([x - (off % 60), K.HY - 40 - 130 * Math.abs(Math.sin(k * 1.31)) * (0.4 + 0.6 * hash(k))]); }
    ctx.fillStyle = '#1B0634'; ctx.beginPath(); ctx.moveTo(-100, K.HY); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(W + 100, K.HY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(60,240,255,0.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo((x0 + x1) / 2, K.HY); ctx.lineTo(x1, y1); ctx.stroke(); } ctx.restore(); };
  // the grid: z from 1 (horizon) to near; speed in units/s; the camera may bank (roll)
  K.grid = (ctx, lt, speed = 1, o = {}) => {
    const g = ctx.createLinearGradient(0, K.HY, 0, H); g.addColorStop(0, '#2A0838'); g.addColorStop(1, '#0B0214'); ctx.fillStyle = g; ctx.fillRect(0, K.HY, W, H - K.HY);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = C.grid; ctx.shadowColor = C.grid; ctx.shadowBlur = 12; ctx.lineWidth = 2.2;
    const vx = W / 2 + (o.vx || 0);
    for (let k = -24; k <= 24; k++) { ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.moveTo(vx + k * 18, K.HY); ctx.lineTo(vx + k * 240, H + 40); ctx.stroke(); }
    const ph = (lt * speed) % 1;
    for (let i = 0; i < 18; i++) { const z = (i + 1 - ph), y = K.HY + 900 / (z * 1.6 + 0.3) - 900 / (18 * 1.6 + 0.3); if (y < K.HY || y > H + 10) continue; ctx.globalAlpha = clamp((y - K.HY) / 120) * 0.85; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    if (o.road) { ctx.save(); ctx.fillStyle = 'rgba(10,2,20,0.85)'; ctx.beginPath(); ctx.moveTo(vx - 60, K.HY); ctx.lineTo(vx + 60, K.HY); ctx.lineTo(vx + 760, H + 40); ctx.lineTo(vx - 760, H + 40); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = C.cyan; ctx.shadowColor = C.cyan; ctx.shadowBlur = 14; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(vx - 60, K.HY); ctx.lineTo(vx - 760, H + 40); ctx.moveTo(vx + 60, K.HY); ctx.lineTo(vx + 760, H + 40); ctx.stroke();
      ctx.fillStyle = '#FFF4FF'; for (let i = 0; i < 10; i++) { const z = (i + 1 - (lt * speed * 2) % 1), y0 = K.HY + 700 / (z + 0.2) * 0.6 - 30, y1 = K.HY + 700 / (z - 0.35 + 0.2 + 0.0001) * 0.6 - 30; if (y0 < K.HY || y0 > H) continue;
        const w0 = (y0 - K.HY) / (H - K.HY) * 18, w1 = (Math.min(H, y1) - K.HY) / (H - K.HY) * 18, f = (y) => vx + 0 * y; ctx.beginPath(); ctx.moveTo(f(y0) - w0, y0); ctx.lineTo(f(y0) + w0, y0); ctx.lineTo(f(y1) + w1, Math.min(H, y1)); ctx.lineTo(f(y1) - w1, Math.min(H, y1)); ctx.closePath(); ctx.fill(); }
      ctx.restore(); }
  };
  // palms at the roadside rushing past: side -1/1, phase in units of spacing
  K.palms = (ctx, lt, speed = 1, vx = 0) => { for (const side of [-1, 1]) for (let i = 0; i < 6; i++) { const z = (i + 1 - (lt * speed * 0.8 + (side > 0 ? 0.5 : 0)) % 1) * 1.0, s = 1 / (z * 0.55 + 0.08) * 0.22, x = W / 2 + vx + side * (160 + 900 * s), y = K.HY + 380 * s * 0.85;
      if (s < 0.05 || y > H + 400) continue; K.palm(ctx, x, y, s, side, lt + i); } };
  K.palm = (ctx, x, y, s, side, ph) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#12021F'; ctx.strokeStyle = '#12021F'; ctx.lineCap = 'round';
    ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-40 * side, -300, 20 * side, -620); ctx.stroke();
    for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.42 + 0.05 * Math.sin(ph * 2 + k); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(20 * side, -620); ctx.quadraticCurveTo(20 * side + Math.cos(a) * 160, -620 + Math.sin(a) * 160 - 40, 20 * side + Math.cos(a) * 300, -620 + Math.sin(a) * 120 + 120); ctx.stroke(); }
    ctx.restore(); };
  // the car from behind, centred at (x, y = bottom), s scale, bob 0..1
  K.car = (ctx, x, y, s, lt, o = {}) => {
    ctx.save(); ctx.translate(x, y + 3 * Math.sin(lt * 23)); ctx.scale(s, s); ctx.rotate(o.bank || 0);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.ellipse(0, 6, 300, 26, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#0B0B10'; rr(ctx, -270, -70, 90, 76, 14); ctx.fill(); rr(ctx, 180, -70, 90, 76, 14); ctx.fill();
    ctx.fillStyle = o.col || C.car; ctx.beginPath(); ctx.moveTo(-280, -40); ctx.lineTo(-250, -150); ctx.lineTo(250, -150); ctx.lineTo(280, -40); ctx.lineTo(280, -10); ctx.lineTo(-280, -10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2A0A2E'; ctx.beginPath(); ctx.moveTo(-180, -150); ctx.lineTo(-130, -235); ctx.lineTo(130, -235); ctx.lineTo(180, -150); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(60,240,255,0.25)'; ctx.beginPath(); ctx.moveTo(-160, -158); ctx.lineTo(-120, -225); ctx.lineTo(120, -225); ctx.lineTo(160, -158); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#16060E'; ctx.fillRect(-250, -150, 500, 10);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = '#FF1E3C'; ctx.shadowBlur = 30; ctx.fillStyle = '#FF2E4A'; ctx.fillRect(-250, -112, 170, 26); ctx.fillRect(80, -112, 170, 26); ctx.restore();
    ctx.fillStyle = '#F2E9FF'; ctx.fillRect(-60, -72, 120, 36); ctx.fillStyle = '#20102A'; ctx.font = K.F(28, 'sans'); ctx.textAlign = 'center'; ctx.fillText(o.plate || '1986', 0, -44);
    ctx.restore();
  };
  // chrome lettering: a sky-to-ground gradient with a horizon line, magenta outline, a sheen sweeping across
  let chromeB = null;
  K.chrome = (ctx, s, x, y, size, a = 1, o = {}) => {
    if (a <= 0) return; if (!chromeB) chromeB = makeBuf(); const g = chromeB.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
    const sc = o.slam ? 1 + 0.6 * (1 - Ease.outQuint(clamp(o.slam))) : 1; g.translate(x, y); g.scale(sc, sc); g.font = K.F(size); g.textAlign = 'center';
    const gr = g.createLinearGradient(0, -size * 0.85, 0, size * 0.1); gr.addColorStop(0, '#E9F6FF'); gr.addColorStop(0.45, '#8FC4F0'); gr.addColorStop(0.5, '#1A1030'); gr.addColorStop(0.56, '#FFB45E'); gr.addColorStop(1, '#FFF1C9');
    g.lineWidth = size * 0.07; g.strokeStyle = C.grid; g.shadowColor = C.grid; g.shadowBlur = 24; g.strokeText(s, 0, 0); g.shadowBlur = 0; g.fillStyle = gr; g.fillText(s, 0, 0);
    if (o.sheen != null) { g.globalCompositeOperation = 'source-atop'; const sx = lerp(-W * 0.4, W * 0.4, o.sheen % 1), sg = g.createLinearGradient(sx - 60, 0, sx + 60, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.85)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sg; g.fillRect(-W / 2, -size, W, size * 1.3); }
    ctx.save(); ctx.globalAlpha *= clamp(a); ctx.drawImage(chromeB.c, 0, 0); ctx.restore();
  };
  K.neon = (ctx, s, x, y, size, a = 1, o = {}) => { if (a <= 0) return; const fl = o.flicker ? (Math.sin(o.flicker * 47) > 0.92 ? 0.35 : 1) : 1;
    ctx.save(); ctx.globalAlpha *= clamp(a) * fl; ctx.font = K.F(size, o.fam || 'sans'); ctx.textAlign = o.align || 'center'; ctx.lineJoin = 'round'; const col = o.col || C.cyan;
    ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.strokeStyle = col; ctx.lineWidth = size * 0.09; ctx.strokeText(s, x, y); ctx.shadowBlur = 10; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.025; ctx.strokeText(s, x, y); ctx.restore(); };
  // VHS: scanlines, a tracking band tearing the picture sideways, a ghost, the OSD
  let scan = null;
  K.vhs = (ctx, lt, o = {}) => {
    if (!scan) { scan = makeBuf(); const g = scan.g; for (let y = 0; y < H; y += 3) { g.fillStyle = 'rgba(0,0,0,0.16)'; g.fillRect(0, y, W, 1); } }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.07; ctx.drawImage(ctx.canvas, 4, 0, W, H); ctx.restore();
    const by = ((lt * 0.23) % 1.3) * H - 80, bh = 46 + 20 * Math.sin(lt * 3);
    if (by > -bh && by < H) { ctx.drawImage(ctx.canvas, 0, Math.max(0, by), W, bh, 14 + 10 * Math.sin(lt * 40), Math.max(0, by), W, bh); ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(0, by, W, bh);
      for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,255,255,${0.15 + 0.3 * hash(i + Math.floor(lt * 30))})`; ctx.fillRect(hash(i * 3 + Math.floor(lt * 24)) * W, by + hash(i * 7 + Math.floor(lt * 24)) * bh, 20 + 60 * hash(i), 2); } }
    if (o.tear) { const k = o.tear; for (let s = 0; s < 6; s++) { const y = hash(s * 9 + Math.floor(lt * 20)) * H, h = 20 + 60 * hash(s); ctx.drawImage(ctx.canvas, 0, y, W, h, (hash(s * 5 + Math.floor(lt * 20)) - 0.5) * 120 * k, y, W, h); } }
    ctx.drawImage(scan.c, 0, 0);
    if (o.osd !== false) { ctx.save(); ctx.font = K.F(40, 'sans'); ctx.fillStyle = '#F4F4F4'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
      if (Math.floor(lt * 1.6) % 2 === 0 || o.solid) { ctx.beginPath(); ctx.moveTo(120, 96); ctx.lineTo(150, 114); ctx.lineTo(120, 132); ctx.closePath(); ctx.fill(); ctx.fillText('PLAY', 168, 128); }
      ctx.textAlign = 'right'; const sec = Math.floor(lt + (o.clock || 0)); ctx.fillText(`SP  0:00:${String(sec).padStart(2, '0')}`, W - 120, 128); ctx.fillText('JUL. 14 1986', W - 120, H - 100); ctx.restore(); }
  };
  K.power = (ctx, p) => {   // a CRT switching on (p 0..1): a bright line opening into the picture; or off when reversed
    if (p >= 1) return; ctx.save(); const h = H * Ease.outC(clamp((p - 0.25) / 0.75)); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, (H - h) / 2); ctx.fillRect(0, (H + h) / 2, W, (H - h) / 2);
    const lw = W * Ease.outC(clamp(p / 0.25)); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - clamp((p - 0.25) / 0.5))})`; ctx.fillRect((W - lw) / 2, H / 2 - 3 - h / 2 * 0.02, lw, 6 + h * 0.02); ctx.restore(); };
  window.OUTRUN = K;
})();

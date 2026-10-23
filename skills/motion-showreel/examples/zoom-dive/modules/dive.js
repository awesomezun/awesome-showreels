// dive: the 끝없는 확대 reel's powers-of-ten kit (a project module). Eleven layers, 1 m down to 0.1 nm, each drawn in
// its own frame where the screen is 10^-k m tall and the centre is the point the camera dives into. The zoom z is one
// continuous number: layer floor(z) fills the screen at scale 10^(z-k), and the next layer sits in its centre at a
// tenth of that, clipped to its own frame, so it shows first as a small framed picture and grows until it covers the
// screen (z rising by one is exactly ten times closer). A HUD reads the power, the size and the name. Hahmlet for
// names, IBM Plex Sans KR for numbers.
(() => {
  const D = {}, TAU = Math.PI * 2;
  D.INFO = [['1 m', '전시대'], ['10 cm', '은행잎'], ['1 cm', '잎맥'], ['1 mm', '잎의 표피 세포'], ['100 µm', '기공'], ['10 µm', '엽록체'],
    ['1 µm', '틸라코이드'], ['100 nm', '광합성 막'], ['10 nm', '빛을 모으는 단백질'], ['1 nm', '엽록소 분자'], ['0.1 nm', '마그네슘 원자']];
  D.F = (size, fam = 'display', w = 700) => `${w} ${size}px ${FAM[fam]}`;
  const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const rng = (s) => () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const blob = (ctx, x, y, rx, ry, rot, seed, wob = 0.08, n = 28) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * TAU, w = 1 + wob * (Math.sin(a * 3 + seed * 5.1) + 0.6 * Math.sin(a * 5 + seed * 2.3));
    const px = Math.cos(a) * rx * w, py = Math.sin(a) * ry * w; ctx[i ? 'lineTo' : 'moveTo'](x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)); } ctx.closePath(); };
  const L = [];

  // 1 m and 10 cm: walnut planks under everything (s = 1 or 10, the same planks at either scale)
  const wood = (ctx, s) => { const ph = 150 * s; ctx.fillStyle = '#3E2716'; ctx.fillRect(-1000, -600, 2000, 1200);
    for (let i = Math.floor(-600 / ph) - 1; i <= Math.ceil(600 / ph); i++) { const y = i * ph; ctx.fillStyle = mix('#5A3A24', '#7B5234', hash(i * 3.1 + 7) * 0.8); ctx.fillRect(-1000, y + 2 * s, 2000, ph - 4 * s);
      ctx.strokeStyle = 'rgba(35,18,8,0.25)'; ctx.lineWidth = 2.2 * s; for (let g = 0; g < 7; g++) { const gy = y + ph * (0.08 + 0.13 * g + 0.05 * hash(i * 9 + g)); if (gy < -620 || gy > 620) continue;
        ctx.beginPath(); for (let x = -1000; x <= 1000; x += 40) ctx[x > -1000 ? 'lineTo' : 'moveTo'](x, gy + 6 * s * Math.sin(x / (160 * s) + i * 2 + g) + 3 * s * Math.sin(x / (37 * s) + g)); ctx.stroke(); } } };
  // the ginkgo leaf in 10 cm units: a fan of forking veins from the petiole at P, notched at the top
  const P = [120, 600], A0 = -2.72, A1 = -0.42, R0 = 120;
  const edge = (a) => (1080 + 24 * Math.sin(a * 23) + 12 * Math.sin(a * 57 + 1) - 300 * Math.exp(-(((a + Math.PI / 2) / 0.045) ** 2))) * (1 - 0.14 * Math.exp(-(((a - A0) / 0.14) ** 2)) - 0.14 * Math.exp(-(((a - A1) / 0.14) ** 2)));
  const pol = (r, a) => [P[0] + r * Math.cos(a), P[1] + r * Math.sin(a)];
  const leafPath = (ctx, dx = 0, dy = 0) => { ctx.beginPath(); const s0 = pol(R0, A0); ctx.moveTo(s0[0] + dx, s0[1] + dy);
    for (let i = 1; i <= 12; i++) { const r = R0 + (edge(A0) - R0) * i / 12, a = A0 + 0.06 * Math.sin(Math.PI * i / 12), p = pol(r, a); ctx.lineTo(p[0] + dx, p[1] + dy); }
    for (let i = 0; i <= 240; i++) { const a = A0 + (A1 - A0) * i / 240, p = pol(edge(a), a); ctx.lineTo(p[0] + dx, p[1] + dy); }
    for (let i = 12; i >= 0; i--) { const r = R0 + (edge(A1) - R0) * i / 12, a = A1 - 0.06 * Math.sin(Math.PI * i / 12), p = pol(r, a); ctx.lineTo(p[0] + dx, p[1] + dy); } ctx.closePath(); };
  const NV = 64, VA = (i) => A0 + 0.05 + (A1 - A0 - 0.1) * (i + 0.5) / NV, FORK = [R0, 230, 360, 480, 600, 720];
  const veins = (ctx, lo, hi, r0, a0, d) => { const leaf = hi - lo === 1, aC = leaf ? VA(lo) : (VA(lo) + VA(hi - 1)) / 2, r1 = leaf ? edge(aC) - 20 : FORK[Math.min(d + 1, 5)];
    ctx.beginPath(); for (let j = 0; j <= 8; j++) { const u = j / 8, p = pol(lerp(r0, r1, u), lerp(a0, aC, Math.min(1, u * 3))); ctx[j ? 'lineTo' : 'moveTo'](p[0], p[1]); } ctx.stroke();
    if (!leaf) { const mid = (lo + hi) >> 1; veins(ctx, lo, mid, r1, aC, d + 1); veins(ctx, mid, hi, r1, aC, d + 1); } };
  const leaf = (ctx, fine) => { ctx.fillStyle = 'rgba(20,10,4,0.35)'; leafPath(ctx, 50, 70); ctx.fill();
    ctx.strokeStyle = '#5E8F2C'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(P[0], P[1] - 40); ctx.quadraticCurveTo(P[0] + 40, P[1] + 260, P[0] - 30, P[1] + 520); ctx.stroke();
    const g = ctx.createRadialGradient(P[0], P[1], 100, P[0], P[1], 1100); g.addColorStop(0, '#5F9A2C'); g.addColorStop(0.6, '#86BF45'); g.addColorStop(1, '#A9D35E'); ctx.fillStyle = g; leafPath(ctx); ctx.fill();
    ctx.strokeStyle = 'rgba(214,236,160,0.55)'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; veins(ctx, 0, NV / 2, R0, A0 + 0.5, 0); veins(ctx, NV / 2, NV, R0, A1 - 0.5, 0);
    if (fine) { ctx.strokeStyle = 'rgba(250,255,225,0.5)'; ctx.lineWidth = 0.8; veins(ctx, 0, NV / 2, R0, A0 + 0.5, 0); veins(ctx, NV / 2, NV, R0, A1 - 0.5, 0); } };

  L[0] = (ctx, t) => { wood(ctx, 1);
    // a metre stick along the top, a magnifier, two ginkgo seeds and the exhibit card
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-534, -462, 1080, 46); ctx.fillStyle = '#E9C878'; ctx.fillRect(-540, -470, 1080, 46);
    ctx.fillStyle = '#3A2A12'; for (let c = 0; c <= 100; c++) { const x = -540 + c * 10.8, h = c % 10 === 0 ? 22 : c % 5 === 0 ? 14 : 8; ctx.fillRect(x - 0.8, -470, 1.6, h); }
    ctx.font = D.F(15, 'sans', 500); ctx.textAlign = 'center'; for (let c = 10; c < 100; c += 10) ctx.fillText(String(c), -540 + c * 10.8, -432); ctx.textAlign = 'left';
    for (const [x, y, r] of [[-300, 170, 26], [-250, 205, 24]]) { const g = ctx.createRadialGradient(x - 8, y - 8, 2, x, y, r); g.addColorStop(0, '#FFE6A0'); g.addColorStop(1, '#C98A2A'); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.arc(x + 6, y + 8, r, 0, TAU); ctx.fill(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(560, -160); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.arc(14, 18, 128, 0, TAU); ctx.fill();
    ctx.save(); ctx.rotate(0.8); ctx.fillStyle = '#1E1E22'; rr(ctx, 120, -18, 240, 36, 18); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(190,225,255,0.16)'; ctx.beginPath(); ctx.arc(0, 0, 120, 0, TAU); ctx.fill(); ctx.strokeStyle = '#26262B'; ctx.lineWidth = 18; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 92, 3.6, 4.4); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(500, 300); ctx.rotate(-0.04); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-172, -84, 360, 190); ctx.fillStyle = '#F4EEDF'; ctx.fillRect(-180, -95, 360, 190);
    ctx.fillStyle = '#2B2622'; ctx.font = D.F(36, 'display', 700); ctx.fillText('은행잎', -150, -35); ctx.font = D.F(20, 'sans', 500); ctx.fillStyle = '#5A524A'; ctx.fillText('Ginkgo biloba', -150, -2);
    ctx.fillText('끝없는 확대 · 전시물 1', -150, 58); ctx.fillStyle = '#C9B98F'; ctx.fillRect(-150, 16, 300, 2); ctx.restore();
    ctx.save(); ctx.scale(0.1, 0.1); leaf(ctx, false); ctx.restore(); };
  L[1] = (ctx, t) => { wood(ctx, 10); leaf(ctx, false); };
  // 1 cm: the same blade ten times closer, the veins now broad ridges, with a stippled skin cached once
  let skin = null;
  const skinPat = (ctx) => { if (!skin) { const b = makeBuf(240, 240), r = rng(7); for (let i = 0; i < 520; i++) { const x = r() * 240, y = r() * 240, s = 4 + r() * 7; b.g.fillStyle = r() < 0.5 ? 'rgba(40,90,20,0.16)' : 'rgba(230,255,190,0.14)'; b.g.beginPath(); b.g.ellipse(x, y, s, s * 1.6, 0, 0, TAU); b.g.fill(); } skin = b.c; } return ctx.createPattern(skin, 'repeat'); };
  L[2] = (ctx, t) => { ctx.save(); ctx.scale(10, 10); ctx.fillStyle = '#7FB83F'; ctx.fillRect(-100, -60, 200, 120); leaf(ctx, true); ctx.restore();
    ctx.fillStyle = skinPat(ctx); ctx.fillRect(-1000, -600, 2000, 1200);
    // a dew drop resting between two veins
    const dx = -520, dy = -240, g = ctx.createRadialGradient(dx - 30, dy - 40, 10, dx, dy, 130); g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.35, 'rgba(210,240,200,0.35)'); g.addColorStop(1, 'rgba(120,180,90,0.25)');
    ctx.fillStyle = 'rgba(30,60,10,0.25)'; ctx.beginPath(); ctx.ellipse(dx + 24, dy + 30, 128, 120, 0, 0, TAU); ctx.fill(); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(dx, dy, 124, 118, 0, 0, TAU); ctx.fill(); };
  // 1 mm: jigsaw epidermis cells elongated along the veins, with stomata; one stoma right at the centre
  const stoma = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#2F6B2A'; ctx.beginPath(); ctx.ellipse(0, 0, 300, 380, 0, 0, TAU); ctx.fill();
    for (const sg of [-1, 1]) { ctx.fillStyle = '#9BD068'; ctx.beginPath(); ctx.ellipse(0, 0, 270, 345, 0, sg < 0 ? Math.PI / 2 : -Math.PI / 2, sg < 0 ? 1.5 * Math.PI : Math.PI / 2); ctx.ellipse(0, 0, 34, 255, 0, sg < 0 ? 1.5 * Math.PI : Math.PI / 2, sg < 0 ? Math.PI / 2 : -Math.PI / 2, true); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = '#1B2A17'; ctx.beginPath(); ctx.ellipse(0, 0, 30, 250, 0, 0, TAU); ctx.fill(); ctx.restore(); };
  L[3] = (ctx, t) => { ctx.fillStyle = '#2F6B2A'; ctx.fillRect(-1000, -600, 2000, 1200);
    for (let r = -4; r <= 4; r++) for (let c = -10; c <= 10; c++) { const x = c * 116 + (r & 1) * 58 + (hash(r * 31 + c) - 0.5) * 30, y = r * 210 + (hash(r * 17 + c * 3) - 0.5) * 40;
      if (Math.hypot(x, y) < 90) continue; ctx.fillStyle = mix('#A6D47A', '#C4E49A', hash(r * 7 + c * 13)); blob(ctx, x, y, 52, 100, 0.04 * (hash(c + r * 5) - 0.5), r * 21 + c, 0.12, 36); ctx.fill();
      ctx.fillStyle = 'rgba(60,110,40,0.35)'; ctx.beginPath(); ctx.arc(x + 14 * (hash(c * 3 + r) - 0.5), y + 30 * (hash(c + r * 9) - 0.5), 9, 0, TAU); ctx.fill(); }
    for (const [x, y] of [[15, 0], [-470, 315], [530, -320], [700, 330], [-760, -260], [-180, -440], [240, 440]]) stoma(ctx, x, y, 0.1); };
  // 100 µm: one stoma, its two guard cells full of chloroplasts; the camera's target is a chloroplast in the left one
  const CHL = (() => { const out = [[0, 0, 0.5]], r = rng(41); let n = 0; while (out.length < 30 && n++ < 3000) { const a = Math.PI / 2 + r() * Math.PI, p = 0.3 + r() * 0.55, x = 150 + Math.cos(a) * 270 * p, y = Math.sin(a) * 345 * p;
    if (((x - 150) / 34) ** 2 + (y / 250) ** 2 < 1.6) continue; const xx = r() < 0.5 ? x : 300 - x; if (out.every(([px, py]) => Math.hypot(px - xx, py - y) > 62)) out.push([xx, y, r() * 3]); } return out; })();
  L[4] = (ctx, t) => { ctx.fillStyle = '#3E7D2F'; ctx.fillRect(-1000, -600, 2000, 1200);
    for (const [x, y, rx, ry, s] of [[-700, -330, 300, 260, 1], [-720, 330, 300, 270, 2], [150, -640, 420, 230, 3], [150, 640, 420, 230, 4], [930, -300, 330, 280, 5], [930, 330, 330, 270, 6]]) {
      ctx.fillStyle = mix('#B5DD8C', '#CBE8A8', hash(s)); blob(ctx, x, y, rx, ry, 0, s, 0.1); ctx.fill(); ctx.fillStyle = 'rgba(70,120,50,0.3)'; ctx.beginPath(); ctx.arc(x + 60, y - 30, 36, 0, TAU); ctx.fill(); }
    stoma(ctx, 150, 0, 1);
    for (const [x, y, a] of CHL) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#3F9A35'; ctx.beginPath(); ctx.ellipse(0, 0, 27, 16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#2C7426'; for (let k = -1; k <= 1; k++) ctx.fillRect(k * 9 - 3, -4, 6, 8); ctx.restore(); } };
  // 10 µm: inside the guard cell, chloroplasts drifting in the streaming cytoplasm; the target one stays put
  const plastid = (ctx, x, y, rx, ry, a, seed) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#2E7A2A'; ctx.beginPath(); ctx.ellipse(0, 0, rx + 8, ry + 8, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#5DB045'; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill(); const r = rng(seed);
    for (let i = 0; i < 16; i++) { const u = r() * 2 - 1, v = r() * 2 - 1; if (u * u + v * v > 0.7) continue; ctx.fillStyle = '#2F7D28'; rr(ctx, u * rx - rx * 0.09, v * ry - ry * 0.08, rx * 0.18, ry * 0.16, 6); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,240,170,0.6)'; ctx.beginPath(); ctx.arc(rx * 0.45, -ry * 0.35, ry * 0.08, 0, TAU); ctx.fill(); ctx.restore(); };
  L[5] = (ctx, t) => { const g = ctx.createLinearGradient(0, -600, 0, 600); g.addColorStop(0, '#D7ECC0'); g.addColorStop(1, '#C3E2A6'); ctx.fillStyle = g; ctx.fillRect(-1000, -600, 2000, 1200);
    ctx.fillStyle = '#7DB55A'; ctx.beginPath(); ctx.ellipse(-1700, 0, 900, 1400, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#A7D27E'; ctx.beginPath(); ctx.ellipse(-1700, 0, 840, 1340, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#D9B26A'; for (const [x, y, a] of [[420, 420, 0.4], [-420, -430, -0.3], [860, -80, 1.2]]) { const dx = Math.sin(t * 0.6 + x) * 30; ctx.save(); ctx.translate(x + dx, y); ctx.rotate(a); rr(ctx, -90, -38, 180, 76, 38); ctx.fill(); ctx.strokeStyle = '#A9803E'; ctx.lineWidth = 6; ctx.beginPath(); for (let k = -2; k <= 2; k++) { ctx.moveTo(k * 28, -26); ctx.lineTo(k * 28 + 10, 26); } ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(-1000 + ((hash(i) * 2000 + t * 40) % 2000), -600 + hash(i + 9) * 1200, 5 + hash(i + 3) * 6, 0, TAU); ctx.fill(); }
    for (const [x, y, a, s] of [[-640, -260, 0.5, 2], [700, 230, -0.3, 3], [-420, 400, 0.15, 4], [760, -390, 0.6, 5], [240, -470, -0.2, 6], [-90, 470, 0.3, 7]]) plastid(ctx, x + Math.sin(t * 0.8 + s) * 20, y + Math.cos(t * 0.7 + s) * 14, 230, 130, a, s);
    plastid(ctx, 0, 0, 270, 150, 0.12, 1); };
  // 1 µm: inside one chloroplast: grana (stacks of thylakoid discs) joined by stroma lamellae; a disc's top at the centre
  const granum = (ctx, x, y, w, n, j0) => { for (let j = j0; j < j0 + n; j++) { const yy = y + j * 22 - 2.7; ctx.fillStyle = '#2E7D2A'; rr(ctx, x - w / 2, yy, w, 20, 10); ctx.fill(); ctx.fillStyle = '#7CC860'; rr(ctx, x - w / 2 + 5, yy + 5, w - 10, 10, 5); ctx.fill(); } };
  L[6] = (ctx, t) => { ctx.fillStyle = '#CDE7A4'; ctx.fillRect(-1000, -600, 2000, 1200);
    const G = [[-700, -260, 420, 9, -4], [660, 190, 460, 10, -5], [-560, 360, 380, 7, -3], [720, -380, 400, 8, -4], [60, -470, 360, 6, -3], [-80, 430, 300, 6, -2]];
    ctx.strokeStyle = '#3F8E35'; ctx.lineWidth = 9; for (const [x, y] of G) { ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(x * 0.4, 30 + y * 0.1, x * 0.6, y * 0.9, x, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(30,70,20,0.35)'; const r = rng(3); for (let i = 0; i < 180; i++) { ctx.beginPath(); ctx.arc(-1000 + r() * 2000, -600 + r() * 1200, 4 + r() * 3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = '#F2D46A'; for (const [x, y, s] of [[-250, -250, 34], [380, -60, 28], [300, 380, 40], [-860, 80, 30]]) { ctx.beginPath(); ctx.arc(x, y + Math.sin(t * 2 + x) * 6, s, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,250,0.7)'; ctx.beginPath(); ctx.ellipse(-300, 120, 150, 90, 0.3, 0, TAU); ctx.fill();
    for (const [x, y, w, n, j0] of G) granum(ctx, x, y, w, n, j0); granum(ctx, 0, 0, 520, 10, -5); };
  // 100 nm: the disc's membranes in cross-section: lipid bilayers with protein complexes; the target is a light-harvesting complex
  const PROT = [['#3FA7A0', 170, 120], ['#8A6BD0', 120, 90], ['#4FB04A', 90, 70], ['#E39B3B', 70, 60]];
  L[7] = (ctx, t) => { ctx.fillStyle = '#D6EBB4'; ctx.fillRect(-1000, -600, 2000, 1200);
    for (let j = -3; j <= 2; j++) { ctx.fillStyle = '#EFF7DC'; ctx.fillRect(-1000, j * 220 + 27, 2000, 119); }
    for (let j = -3; j <= 2; j++) for (const cy of [j * 220, j * 220 + 173]) { if (cy < -640 || cy > 640) continue;
      ctx.strokeStyle = '#E7C25A'; ctx.lineWidth = 3; ctx.beginPath(); for (let x = -1000; x <= 1000; x += 19) { const w = Math.sin(t * 3 + x * 0.05 + cy) * 2; ctx.moveTo(x - 3, cy - 14); ctx.lineTo(x + 2 + w, cy - 2); ctx.moveTo(x + 3, cy - 14); ctx.lineTo(x - 1 - w, cy - 2); ctx.moveTo(x - 3, cy + 14); ctx.lineTo(x + 2 - w, cy + 2); ctx.moveTo(x + 3, cy + 14); ctx.lineTo(x - 1 + w, cy + 2); } ctx.stroke();
      ctx.fillStyle = '#E58A8F'; for (let x = -1000; x <= 1000; x += 19) for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x, cy + s * 19, 8.5, 0, TAU); ctx.fill(); }
      const r = rng(1000 + j * 7 + (cy % 2)); for (let x = -980 + r() * 200; x < 1000; x += 260 + r() * 260) { if (j === 0 && cy === 0 && Math.abs(x) < 240) continue; const [c, w, h] = PROT[Math.floor(r() * 4)];
        ctx.fillStyle = c; blob(ctx, x, cy + Math.sin(t * 2 + x) * 3, w / 2, h / 2 + 16, 0, x, 0.1); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; blob(ctx, x - w * 0.12, cy - h * 0.15, w / 4, h / 5, 0, x + 1, 0.1); ctx.fill(); } }
    ctx.fillStyle = '#3E9E3A'; blob(ctx, 0, Math.sin(t * 2) * 3, 110, 64, 0, 2, 0.09); ctx.fill(); ctx.fillStyle = '#62C055'; blob(ctx, -16, -12, 70, 36, 0, 3, 0.1); ctx.fill(); };
  // 10 nm: a light-harvesting trimer seen from above in a sea of lipid heads; one chlorophyll sits at the centre
  const TRI = (() => { const T = [300, 30], out = { T, hel: [], chl: [[0, 0, 0.3]], car: [] };
    for (let m = 0; m < 3; m++) { const f = -Math.PI / 2 + m * TAU / 3 + 0.3, ro = (x, y) => [T[0] + x * Math.cos(f) - y * Math.sin(f), T[1] + x * Math.sin(f) + y * Math.cos(f)];
      for (const [x, y] of [[110, -60], [210, 20], [150, 110], [290, -40]]) out.hel.push(ro(x, y));
      for (let i = 0; i < 9; i++) { const p = ro(90 + (i % 3) * 85 + 20 * Math.sin(i), -120 + Math.floor(i / 3) * 105); if (Math.hypot(p[0], p[1]) > 70) out.chl.push([p[0], p[1], f + i]); }
      out.car.push([ro(70, -150), ro(330, 120)]); } return out; })();
  L[8] = (ctx, t) => { ctx.fillStyle = '#F3D9D3'; ctx.fillRect(-1000, -600, 2000, 1200); ctx.fillStyle = '#E8A9A7';
    for (let y = -600; y <= 600; y += 46) for (let x = -1000 + ((y / 46) & 1) * 23; x <= 1000; x += 46) { const j = Math.sin(t * 3 + x * 0.3 + y) * 3; ctx.beginPath(); ctx.arc(x + j, y, 17, 0, TAU); ctx.fill(); }
    const T = TRI.T; ctx.fillStyle = 'rgba(40,70,60,0.18)'; ctx.beginPath(); ctx.arc(T[0], T[1], 520, 0, TAU); ctx.fill(); ctx.fillStyle = '#BFE0C8'; blob(ctx, T[0], T[1], 470, 470, 0, 4, 0.06, 48); ctx.fill();
    ctx.strokeStyle = '#F08A24'; ctx.lineWidth = 14; ctx.lineJoin = 'round'; for (const [a, b] of TRI.car) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const u = i / 12, nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny), z = (i & 1 ? 1 : -1) * 14; ctx[i ? 'lineTo' : 'moveTo'](lerp(a[0], b[0], u) + nx / l * z, lerp(a[1], b[1], u) + ny / l * z); } ctx.stroke(); }
    for (const [x, y] of TRI.hel) { const g = ctx.createRadialGradient(x - 14, y - 14, 6, x, y, 58); g.addColorStop(0, '#8FB7E8'); g.addColorStop(1, '#3F6FB4'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 56, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 38, 0.5, 2.8); ctx.stroke(); }
    TRI.chl.forEach(([x, y, a], i) => { const w = i === 0 ? 54 : 44; ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.sin(t * 2 + i) * 0.05); ctx.fillStyle = '#1F8A3A'; rr(ctx, -w / 2, -w / 2, w, w, 8); ctx.fill(); ctx.fillStyle = '#7BE38B'; ctx.beginPath(); ctx.arc(0, 0, w * 0.18, 0, TAU); ctx.fill(); ctx.restore(); }); };
  // 1 nm: a chlorophyll molecule, ball and stick, the magnesium at the centre; atoms tremble with heat
  const MOL = (() => { const A = [['Mg', 0, 0]], B = [], add = (e, x, y) => (A.push([e, x, y]), A.length - 1), bond = (i, j, d) => B.push([i, j, d]), K = 108;
    const pyr = []; for (let q = 0; q < 4; q++) { const d = q * Math.PI / 2, c = [Math.cos(d) * 3.2 * K, Math.sin(d) * 3.2 * K], v = [];
      for (let k = 0; k < 5; k++) { const a = d + Math.PI + k * TAU / 5; v.push(add(k ? 'C' : 'N', c[0] + Math.cos(a) * 1.17 * K, c[1] + Math.sin(a) * 1.17 * K)); }
      for (let k = 0; k < 5; k++) bond(v[k], v[(k + 1) % 5]); bond(0, v[0], 1); pyr.push(v);
      for (const k of [2, 3]) { if (q === 0 && k === 2) continue; const [, x, y] = A[v[k]], l = Math.hypot(x, y), s = add('C', x + x / l * 1.5 * K + (k === 2 ? 1 : -1) * Math.sin(d) * 0.2 * K, y + y / l * 1.5 * K); bond(v[k], s); } }
    for (let q = 0; q < 4; q++) { const d = q * Math.PI / 2 + Math.PI / 4, m = add('C', Math.cos(d) * 3.4 * K, Math.sin(d) * 3.4 * K); bond(m, pyr[q][4]); bond(m, pyr[(q + 1) % 4][1]); const h = add('H', Math.cos(d) * 4.45 * K, Math.sin(d) * 4.45 * K); bond(m, h); }
    const [, sx, sy] = A[pyr[0][2]]; let prev = add('C', sx + 1.4 * K, sy + 0.4 * K); bond(pyr[0][2], prev); const o1 = add('O', sx + 2.3 * K, sy - 0.5 * K), o2 = add('O', sx + 1.9 * K, sy + 1.5 * K); bond(prev, o1); bond(prev, o2, 2); prev = o1;
    for (let i = 0; i < 12; i++) { const n = add('C', sx + (3.4 + i * 1.25) * K, sy + (-0.5 + (i & 1 ? 0.75 : 0)) * K); bond(prev, n); prev = n; if (i % 4 === 2) bond(n, add('C', A[n][1] + 0.3 * K, A[n][2] - 1.2 * K)); }
    return { A, B }; })();
  const ATOM = { C: ['#9AA2AD', '#4B525C', 36], N: ['#7FA2FF', '#2C4FC0', 38], O: ['#FF8A8A', '#B8262C', 38], Mg: ['#B5FFBE', '#2FA34A', 56], H: ['#FFFFFF', '#A9B3BF', 22] };
  L[9] = (ctx, t) => { const g = ctx.createRadialGradient(0, 0, 50, 0, 0, 1100); g.addColorStop(0, '#1E2A5E'); g.addColorStop(1, '#090D22'); ctx.fillStyle = g; ctx.fillRect(-1000, -600, 2000, 1200);
    const pos = MOL.A.map(([e, x, y], i) => i ? [x + 5 * Math.sin(t * 9 + i * 1.7), y + 5 * Math.cos(t * 8 + i * 2.3)] : [0, 0]);
    ctx.lineCap = 'round'; for (const [i, j, d] of MOL.B) { const [x0, y0] = pos[i], [x1, y1] = pos[j]; if (d === 1) { ctx.setLineDash([14, 14]); ctx.strokeStyle = 'rgba(181,255,190,0.55)'; ctx.lineWidth = 8; } else { ctx.setLineDash([]); ctx.strokeStyle = '#2E3550'; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.strokeStyle = '#B6BED0'; ctx.lineWidth = 14; }
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); if (d === 2) { const nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny); ctx.beginPath(); ctx.moveTo(x0 + nx / l * 26, y0 + ny / l * 26); ctx.lineTo(x1 + nx / l * 26, y1 + ny / l * 26); ctx.stroke(); } }
    ctx.setLineDash([]);
    MOL.A.forEach(([e], i) => { const [x, y] = pos[i], [c0, c1, r] = ATOM[e], g2 = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g2.addColorStop(0, c0); g2.addColorStop(1, c1); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 160); glow.addColorStop(0, 'rgba(181,255,190,0.35)'); glow.addColorStop(1, 'rgba(181,255,190,0)'); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 160, 0, TAU); ctx.fill(); };
  // 0.1 nm: the magnesium atom: a stippled electron cloud (1s core, 2s shell, three 2p lobes, the faint 3s haze) redrawn
  // twelve times a second, around a tiny nucleus
  L[10] = (ctx, t) => { ctx.fillStyle = '#04050D'; ctx.fillRect(-1000, -600, 2000, 1200);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 900); g.addColorStop(0, 'rgba(120,150,255,0.35)'); g.addColorStop(0.3, 'rgba(90,70,200,0.16)'); g.addColorStop(1, 'rgba(40,20,90,0)'); ctx.fillStyle = g; ctx.fillRect(-1000, -600, 2000, 1200);
    const r = rng(1 + Math.floor(t * 12) * 7919), gs = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(TAU * r()), dot = (x, y, s) => ctx.fillRect(x - s / 2, y - s / 2, s, s);
    ctx.fillStyle = 'rgba(200,120,255,0.5)'; for (let i = 0; i < 1300; i++) { const a = r() * TAU, d = 380 + Math.abs(gs()) * 520; dot(Math.cos(a) * d, Math.sin(a) * d, 4); }
    ctx.fillStyle = 'rgba(110,200,255,0.55)'; for (let i = 0; i < 700; i++) { const a = r() * TAU, d = 150 + Math.abs(gs()) * 120; dot(Math.cos(a) * d, Math.sin(a) * d, 4); }
    ctx.fillStyle = 'rgba(140,170,255,0.6)'; for (const ax of [0, Math.PI / 2, Math.PI / 4 + t * 0.2]) for (let i = 0; i < 650; i++) { const s = r() < 0.5 ? -1 : 1, u = 60 + Math.abs(gs()) * 170, v = gs() * (30 + u * 0.4); dot(s * u * Math.cos(ax) - v * Math.sin(ax), s * u * Math.sin(ax) + v * Math.cos(ax), 4); }
    ctx.fillStyle = 'rgba(235,245,255,0.85)'; for (let i = 0; i < 500; i++) { const a = r() * TAU, d = Math.abs(gs()) * 45; dot(Math.cos(a) * d, Math.sin(a) * d, 3); }
    const nr = rng(5); for (let i = 0; i < 24; i++) { const a = nr() * TAU, d = Math.sqrt(nr()) * 14, x = Math.cos(a) * d + Math.sin(t * 20 + i) * 1.2, y = Math.sin(a) * d; ctx.fillStyle = i % 2 ? '#FF6A5A' : '#C9CFD8'; ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); } };

  // the camera at zoom z: the covering layer, then the next one or two framed in its centre
  D.view = (ctx, z, t) => { z = clamp(z, 0, 10); const k0 = Math.min(10, Math.floor(z + 1e-9)), m0 = 10 ** (z - k0);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(m0, m0); L[k0](ctx, t); ctx.restore();
    for (let k = k0 + 1; k <= Math.min(10, k0 + 2); k++) { const m = 10 ** (z - k); if (m < 0.012) break; const w = W * m, h = H * m, x = W / 2 - w / 2, y = H / 2 - h / 2, a = sm((m - 0.1) / 0.1);
      if (a > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.globalAlpha = a; ctx.translate(W / 2, H / 2); ctx.scale(m, m); L[k](ctx, t); ctx.restore(); }
      const b = clamp((1 - m) / 0.35) * clamp((m - 0.012) / 0.02);
      if (b > 0) { ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.9 * b})`; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
        if (w > 150) { ctx.globalAlpha = b; ctx.font = D.F(22, 'sans', 500); ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 6; ctx.fillText(D.INFO[k][0], x + 4, y - 10); } ctx.restore(); } } };
  // the readout: 10^-k m, the plain size and the name at the bottom left; a log track of all eleven steps at the bottom right
  D.hud = (ctx, z, a = 1) => { if (a <= 0) return; z = clamp(z, 0, 10); const k = Math.min(10, Math.floor(z + 1e-6)), f = z - k;
    ctx.save(); ctx.globalAlpha *= clamp(a); const g = ctx.createLinearGradient(0, H - 330, 0, H); g.addColorStop(0, 'rgba(4,6,16,0)'); g.addColorStop(1, 'rgba(4,6,16,0.62)'); ctx.fillStyle = g; ctx.fillRect(0, H - 330, W, 330);
    ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10; ctx.font = D.F(96, 'sans', 700); ctx.fillText('10', 120, 1000); let x = 120 + ctx.measureText('10').width + 6;
    const ex = k ? '-' + k : '0'; ctx.font = D.F(54, 'sans', 700); ctx.fillText(ex, x, 944); x += ctx.measureText(ex).width + 18; ctx.font = D.F(96, 'sans', 500); ctx.fillText('m', x, 1000); x += ctx.measureText('m').width + 56;
    const pop = Math.exp(-f * 10); ctx.font = D.F(58, 'display', 700); ctx.fillText(D.INFO[k][1], x, 950 - 10 * pop); ctx.font = D.F(36, 'sans', 500); ctx.fillStyle = '#C9D4E8'; ctx.fillText(D.INFO[k][0], x + 2, 1004);
    const x0 = 1240, dx = 56, y0 = 990; ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + 10 * dx, y0); ctx.stroke();
    ctx.font = D.F(22, 'sans', 500); ctx.textAlign = 'center'; for (let i = 0; i <= 10; i++) { ctx.fillStyle = i <= z + 1e-6 ? '#FFFFFF' : 'rgba(255,255,255,0.45)'; ctx.fillRect(x0 + i * dx - 1.5, y0 - (i % 3 ? 8 : 14), 3, i % 3 ? 16 : 28); if (i % 3 === 0) ctx.fillText(['1 m', '1 mm', '1 µm', '1 nm'][i / 3], x0 + i * dx, y0 + 46); }
    const mx = x0 + z * dx, gl = ctx.createRadialGradient(mx, y0, 0, mx, y0, 30); gl.addColorStop(0, 'rgba(140,220,255,0.8)'); gl.addColorStop(1, 'rgba(140,220,255,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(mx, y0, 30, 0, TAU); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(mx, y0, 9, 0, TAU); ctx.fill(); ctx.textAlign = 'left'; ctx.restore(); };
  D.text = (ctx, s, x, y, size, a, o = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.font = D.F(size, o.fam || 'display', o.w || 700); ctx.fillStyle = o.color || '#FFFFFF'; ctx.textAlign = o.align || 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 18; ctx.fillText(s, x, y + 12 * (1 - sm(a))); ctx.restore(); };
  // a dark band fading to the right behind a caption, so white type reads over any layer
  D.scrim = (ctx, y0, y1, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); const g = ctx.createLinearGradient(0, 0, 1300, 0); g.addColorStop(0, 'rgba(4,6,16,0.5)'); g.addColorStop(1, 'rgba(4,6,16,0)');
    ctx.fillStyle = g; const n = 24, h = (y1 - y0) / n, a0 = ctx.globalAlpha; for (let i = 0; i < n; i++) { ctx.globalAlpha = a0 * Math.sin(Math.PI * (i + 0.5) / n); ctx.fillRect(0, y0 + i * h, 1300, h + 0.5); } ctx.restore(); };
  D.sm = sm;
  window.DIVE = D;
})();

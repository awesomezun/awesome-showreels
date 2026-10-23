// app (30-second cut, 3 bars): the culprit is a tracker. A phone shows 어디쯤 택배: the halftone map with the route
// drawing on in red and the parcel's dot moving along it; a notice pops, 두 정거장 전이에요; beside it the app's name,
// 지금 어디쯤인지, 지도에서 바로, and its three features typed.
(() => {
  const ROUTE = [[0.15, 0.85], [0.3, 0.6], [0.55, 0.55], [0.62, 0.35], [0.85, 0.22]];
  SCENES['app'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt, C = K.COL;
      K.desk(ctx);
      const px = 420, py = 120, pw = 470, ph = 860, sx = px + 26, sy = py + 90, sw = pw - 52, sh = ph - 180;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; ctx.fillStyle = '#141414'; rr(ctx, px, py, pw, ph, 56); ctx.fill(); ctx.restore();
      const map = K.photo('appmap', 420, 680, (g, w, h) => K.drawMap(g, w, h), { cell: 8 });
      ctx.save(); rr(ctx, sx, sy, sw, sh, 10); ctx.clip(); ctx.drawImage(map, sx, sy, sw, sh);
      const pts = ROUTE.map(([u, v]) => [sx + u * sw, sy + v * sh]), p = Ease.ioC(rm(lt, 0.3, 2.2));
      ctx.strokeStyle = C.red; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.setLineDash([1, 0]); ctx.globalAlpha = 0.25; ctx.stroke(); ctx.globalAlpha = 1;
      const pp = polyStroke(ctx, pts, p); ctx.stroke();
      const at = pointAt(pts, p * 0.999 + 0.0005 * Math.sin(lt * 4)); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(at.x, at.y, 16 + 3 * Math.sin(lt * 6), 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(at.x, at.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = C.cream; ctx.font = K.F(34, 'display'); ctx.fillText('어디쯤 택배', px + 40, py + 64);
      const np = (lt - 2.0) / 0.35; if (np > 0) { const yy = py + 120 - 40 * (1 - Ease.outBack(clamp(np))); ctx.save(); ctx.globalAlpha = clamp(np * 2);
        ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16; ctx.fillStyle = C.cream; rr(ctx, sx + 10, yy, sw - 20, 110, 18); ctx.fill(); ctx.shadowColor = 'transparent';
        ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(sx + 56, yy + 55, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = C.ink; ctx.font = K.F(36, 'display'); ctx.fillText('두 정거장 전이에요', sx + 94, yy + 68); ctx.restore(); }
      K.text(ctx, '어디쯤 택배', 1040, 420, 140, (lt - 0.3) / 0.3, { color: C.cream });
      K.text(ctx, '지금 어디쯤인지, 지도에서 바로', 1046, 500, 44, (lt - 0.6) / 0.3, { fam: 'mono', w: 700, color: C.cream });
      ['· 실시간 위치', '· 두 정거장 전 알림', '· 문 앞 도착 사진'].forEach((s, i) => K.type(ctx, s, 1046, 640 + i * 70, 40, lt - 1.2 - i * 0.55, { cps: 20, color: 'rgba(244,239,228,0.85)' }));
      K.wipes(ctx, env);
    },
  };
})();

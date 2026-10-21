// night (3 bars, 30-s cut): the whole Earth, half in night with its cities lit; the orbit draws itself round the globe
// and the station's light runs along it, passing into the dark and out into the dawn; 90분에 한 바퀴, then 하루 열여섯
// 번 해가 뜬다.
(() => {
  SCENES['night'] = {
    draw(ctx, t, env) {
      const K = ORBIT, T3 = K.T3, V = T3.v, lt = env.lt, C = K.COL, CE = K.CE;
      const eye = V.add(CE, [70 - 4 * lt, 34, 290]), cam = T3.camera(eye, V.add(CE, [-80, 4, 0]), 0.6);
      const sun = V.norm([-1, 0.15, 0.25]);
      K.earth(ctx, cam, { sun, time: lt, spin: 2.0 + lt * 0.02, stars: 1, halo: 0.6 });
      // the orbit: a circle 68 from the centre, tilted; hidden where the globe is in front of it
      const inc = 0.9, node = 0.5, pt = a => { let p = [Math.cos(a) * 68, 0, Math.sin(a) * 68]; p = T3.rx(p, inc); p = T3.ry(p, node); return V.add(CE, p); };
      const seen = p => { const d = V.sub(p, eye), L = Math.hypot(...d), u = V.mul(d, 1 / L), oc = V.sub(eye, CE), b = V.dot(oc, u), h = b * b - V.dot(oc, oc) + K.R * K.R; return h < 0 || -b - Math.sqrt(h) > L; };
      const draw = clamp(lt / 2.2), N = 240;
      ctx.save(); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      for (let i = 0; i < N * draw; i++) { const a0 = i / N * TAU, a1 = (i + 1) / N * TAU, p0 = pt(a0), p1 = pt(a1); if (!seen(p0) || !seen(p1)) continue;
        const q0 = T3.project(cam, p0), q1 = T3.project(cam, p1); ctx.strokeStyle = 'rgba(232,185,100,0.75)'; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(q1[0], q1[1]); ctx.stroke(); }
      const sp = pt(-1.2 + lt * 0.55), sq = T3.project(cam, sp);
      if (seen(sp) && draw > 0.3) { const g = ctx.createRadialGradient(sq[0], sq[1], 0, sq[0], sq[1], 36); g.addColorStop(0, 'rgba(255,240,210,1)'); g.addColorStop(0.25, 'rgba(255,210,140,0.6)'); g.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sq[0], sq[1], 36, 0, TAU); ctx.fill(); }
      ctx.restore();
      K.bars(ctx);
      K.card(ctx, '90분에 한 바퀴,', 150, 470, 60, lt, { at: 0.5, align: 'left' });
      K.card(ctx, '하루 열여섯 번 해가 뜬다.', 150, 560, 60, lt, { at: 1.9, align: 'left', color: C.gold });
    },
  };
})();

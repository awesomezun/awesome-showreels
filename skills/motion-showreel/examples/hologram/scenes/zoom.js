// zoom (3 bars, 30-s cut): one satellite. It lights orange in the fleet, a leader line runs to a panel, and the
// panel shows it in turning wireframe with its telemetry typing in: 배터리 92%, 고도 550km, 속도 7.6km/s; 한 기씩, 자세히.
(() => {
  const TEL = [['배터리', '92%'], ['고도', '550km'], ['속도', '7.6km/s'], ['상태', '정상']];
  SCENES['zoom'] = {
    draw(ctx, t, env) {
      const K = HOLO, lt = env.lt, f = K.flick(lt, 2), HI = 7;
      K.room(ctx);
      const v = K.view(560, 520, 165, 1.4 + lt * 0.12, 0.42);
      K.projector(ctx, 560, 920, 820, 80, 1);
      K.rings(ctx, v, f * 0.7); K.globe(ctx, v, f * 0.7); K.sats(ctx, v, lt, 300, f * 0.8, { hi: HI });
      const q = K.proj(v, K.satPos(K.SATS[HI], lt)), px = 1080, py = 170, pw = 740, ph = 640, a = clamp((lt - 0.4) / 0.3);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = K.rgba(K.COL.warn, 0.8 * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(lerp(q[0], px, Ease.outC(a)), lerp(q[1], py + 120, Ease.outC(a))); ctx.stroke();
      ctx.beginPath(); ctx.arc(q[0], q[1], 16 + 4 * Math.sin(lt * 8), 0, TAU); ctx.stroke(); ctx.restore();
      K.panel(ctx, px, py, pw, ph, a);
      // the satellite in wireframe: a body, two wings, a dish; turning
      if (a > 0) { const c = [px + 220, py + 320], yaw = lt * 0.9, P = (x, y, z) => { const X = x * Math.cos(yaw) + z * Math.sin(yaw), Z = -x * Math.sin(yaw) + z * Math.cos(yaw), k = 600 / (600 - Z); return [c[0] + X * k, c[1] - (y + Z * 0.25) * k]; };
        const box = (x0, y0, z0, x1, y1, z1) => { const V = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(p => P(...p));
          [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(...V[i]); ctx.lineTo(...V[j]); ctx.stroke(); }); };
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = K.rgba(K.COL.holo2, 0.85 * a * f); ctx.lineWidth = 2;
        box(-45, -55, -45, 45, 55, 45); box(-200, -6, -30, -55, 6, 30); box(55, -6, -30, 200, 6, 30);
        ctx.beginPath(); for (let k = 0; k <= 24; k++) { const an = k / 24 * TAU, p = P(Math.cos(an) * 34, 90 + Math.sin(an) * 8, Math.sin(an) * 34); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); ctx.restore(); }
      TEL.forEach(([k, val], i) => { const ai = clamp((lt - 1.0 - i * 0.35) / 0.25); K.text(ctx, k, px + 470, py + 150 + i * 120, 40, { mono: true, a: ai * a, color: K.COL.ink2, glow: false }); K.text(ctx, val, px + 470, py + 206 + i * 120, 52, { mono: true, a: ai * a }); });
      K.text(ctx, '위성 SAT-0007', px + 40, py + 70, 48, { mono: true, a, color: K.COL.warn });
      K.text(ctx, '한 기씩, 자세히', 1080, 940, 84, { a: clamp((lt - 0.6) / 0.3) });
      K.scan(ctx, lt);
    },
  };
})();

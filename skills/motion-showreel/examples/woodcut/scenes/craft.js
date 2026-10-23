// craft (2 bars; 3 in the 30-second cut): three prints in a row, carved one by one on the beat: rice washed in a bowl
// (ripples spreading, grains), the nuruk cake pressed in straw (it turns), and the jar waiting under a sun that
// crosses the sky, the days counting to 100. Under them 쌀을 씻고 / 누룩을 빚고 / 백 일을 기다려요.
(() => {
  const PX = [130, 700, 1270], PY = 130, PW = 520, PH = 560;
  SCENES['craft'] = {
    draw(ctx, t, env) {
      const K = PAN, lt = env.lt, B = env.beatSec, TAU = Math.PI * 2;
      ctx.save(); K.push(ctx, lt, env.dur, 0.02);
      K.paper(ctx);
      const starts = [0.15, 0.15 + 2 * B, 0.15 + 4 * B];
      const r = K.redBegin();
      // panel 3's sun crossing an arc (a day passing; it loops)
      const s3 = lt - starts[2], day = ((Math.max(0, s3) * 0.9) % 1);
      if (s3 > 0) { r.beginPath(); r.arc(PX[2] + 60 + day * (PW - 120), PY + 190 - Math.sin(day * Math.PI) * 120, 34, 0, TAU); r.fill(); }
      K.redEnd(ctx, s3 > 0 ? 1 : 0);
      const g = K.begin(); const tips = [];
      starts.forEach((s0, i) => {
        const a = lt - s0; if (a <= 0) return;
        const x0 = PX[i], y0 = PY, cx = x0 + PW / 2;
        g.save(); g.beginPath(); g.rect(x0, y0, PW, PH); g.clip();
        g.globalAlpha = clamp(a / 0.15); g.fillRect(x0, y0, PW, PH); g.globalAlpha = 1;
        if (i === 0) {        // the bowl: water ripples spreading, rice grains, a stream of water
          const bowlY = y0 + 360;
          K.cut(g, [[x0 + 30, y0 + 470, 8], [x0 + PW - 30, y0 + 470, 8]], a / 0.3, { seed: 700 });
          for (let k = 0; k < 4; k++) {
            const ph = (a * 0.6 + k / 4) % 1, rx = 30 + ph * 200, pts = [];
            for (let q = 0; q <= 40; q++) { const an = q / 40 * TAU; pts.push([cx + Math.cos(an) * rx, bowlY + Math.sin(an) * rx * 0.28, 7 * (1 - ph) + 1]); }
            K.cut(g, pts, clamp((a - 0.2) / 0.3), { seed: 710 + k, taper: 0.02 });
          }
          for (let k = 0; k < 26; k++) { const an = hash(k * 3.1) * TAU, rr2 = 30 + 150 * hash(k * 7.7), gx = cx + Math.cos(an) * rr2, gy = bowlY + Math.sin(an) * rr2 * 0.28;
            K.cut(g, [[gx - 6, gy, 6], [gx + 6, gy + 1, 6]], (a - 0.35 - k * 0.012) / 0.12, { seed: 720 + k, taper: 0.45 }); }
          for (let k = 0; k < 3; k++) { const pts = []; for (let q = 0; q <= 12; q++) { const u = q / 12; pts.push([cx - 10 + k * 10 + 6 * Math.sin(u * 9 + a * 8 + k), y0 + 30 + u * (bowlY - y0 - 40), 5]); }
            K.cut(g, pts, (a - 0.1) / 0.35, { seed: 760 + k, taper: 0.05 }); }
        } else if (i === 1) { // the nuruk cake: a disc with straw marks, turning
          const rot = a * 0.5, R = 175, cy = y0 + 280;
          const ring = []; for (let q = 0; q <= 60; q++) { const an = q / 60 * TAU; ring.push([cx + Math.cos(an) * R, cy + Math.sin(an) * R * 0.92, 9]); }
          K.cut(g, ring, a / 0.45, { seed: 800, taper: 0.02 });
          for (let k = 0; k < 18; k++) { const an = rot + k / 18 * TAU, r0 = 40 + 30 * hash(k), r1 = R - 18;
            K.cut(g, [[cx + Math.cos(an) * r0, cy + Math.sin(an) * r0 * 0.92, 3], [cx + Math.cos(an) * r1, cy + Math.sin(an) * r1 * 0.92, 6]], (a - 0.3 - k * 0.02) / 0.25, { seed: 810 + k, taper: 0.3 }); }
          for (let k = 0; k < 9; k++) { const yy = y0 + 495 + k * 7; K.cut(g, [[x0 + 40 + k * 9, yy, 4], [x0 + PW - 40 - k * 9, yy + 4, 4]], (a - 0.2) / 0.4, { seed: 830 + k }); }
        } else {              // the jar under a crossing sun; the days counting
          const cy = y0 + 520;
          g.save(); g.beginPath(); g.rect(x0, y0, PW, PH); K.jarPath(g, cx, cy, 300, true); g.clip('evenodd');   // the wall behind the jar, cut light
          for (let k = 0; k < 24; k++) { const yy = y0 + 30 + k * 22; K.cut(g, [[x0 + 10, yy, 11 - k * 0.25], [cx, yy + 2, 13 - k * 0.3], [x0 + PW - 10, yy, 11 - k * 0.25]], (a - k * 0.02) / 0.35, { seed: 900 + k, taper: 0.03 }); }
          g.restore();
          g.save(); K.jarPath(g, cx, cy, 300); g.fill(); g.restore();
          g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(PX[2] + 60 + day * (PW - 120), PY + 190 - Math.sin(day * Math.PI) * 120, 40, 0, TAU); g.fill(); g.restore();
          tips.push(...K.cuts(g, K.jar(cx, cy, 300, 0.2), a));
          g.fillRect(x0 + PW - 210, y0 + 48, 190, 96);
          const n = Math.min(100, Math.max(1, Math.floor(a / 2.2 * 100)));
          K.carveText(g, `${n}일`, x0 + PW - 40, y0 + 120, 70, clamp((a - 0.3) / 0.3), { align: 'right', fam: 'sans' });
        }
        g.restore();
      });
      ['쌀을 씻고', '누룩을 빚고', '백 일을 기다려요'].forEach((s, i) => K.printText(g, s, PX[i] + PW / 2, 820, 66, (lt - starts[i] - 0.25) / 0.3, { align: 'center' }));
      K.end(ctx);
      starts.forEach((s0, i) => { if (lt > s0) K.border(ctx, PX[i] - 4, PY - 4, PW + 8, PH + 8); });
      ctx.restore();
    },
  };
})();

// delivery (3-4 bars): the core message. A loaf in a helmet rides a coral scooter down a clay street, houses rolling
// by; the street slows and stops at a mint door; the door opens and a bread box is set on the step;
// 갓 구운 빵, / 말랑하게 문 앞까지.
(() => {
  SCENES['delivery'] = {
    draw(ctx, t, env) {
      const K = CLAY, lt = env.lt, st = K.step(lt), C = K.COL; K.boil(lt);
      const stopAt = env.dur * 0.55, run = Math.min(st, stopAt) + (st > stopAt ? 0 : 0), speed = 420, off = run * speed;
      ctx.fillStyle = '#CDEAF2'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 4; i++) K.ell(ctx, ((i * 620 - off * 0.2) % 2400 + 2400) % 2400 - 200, 150 + (i % 2) * 70, 110, 44, '#FFFFFF', { seed: 40 + i, shadow: false });
      // houses
      const HOUSES = [['#F7C6C7', '#E8686A'], ['#FFE3A3', '#F2A541'], ['#C9E4CA', '#5FA36A'], ['#D7D0F5', '#7F6FD1']];
      for (let i = 0; i < 6; i++) { const hx = 300 + i * 520 - off, [wc, rc] = HOUSES[i % 4]; if (hx < -500 || hx > W + 100) continue;
        K.rrect(ctx, hx, 430, 400, 360, 30, wc, { seed: 50 + i }); K.blob(ctx, u => { const p = u * 3; return p < 1 ? [lerp(hx - 30, hx + 200, p), lerp(450, 270, p)] : p < 2 ? [lerp(hx + 200, hx + 430, p - 1), lerp(270, 450, p - 1)] : [lerp(hx + 430, hx - 30, p - 2), 450]; }, rc, { seed: 60 + i, n: 30 });
        K.rrect(ctx, hx + 50, 520, 100, 90, 16, '#BFE3F0', { seed: 70 + i, shadow: false }); }
      // the door at the stop
      const dx = 1380 - (off - stopAt * speed), open = clamp((st - stopAt - 0.3) / 0.5);
      K.rrect(ctx, dx - 40, 380, 420, 410, 30, '#FFF0D9', { seed: 80 });
      K.rrect(ctx, dx + 90, 520, 160, 270, 22, '#3A2A3A', { seed: 81, shadow: false });
      K.rrect(ctx, dx + 90 + 160 * 0.8 * open, 520, 160 * (1 - 0.8 * open), 270, 22, C.mint, { seed: 82 });
      K.rrect(ctx, -40, 790, W + 80, 320, 20, '#E8D2B8', { seed: 83, shadow: false });
      // the scooter, bouncing on its stepped time
      const bob = st < stopAt ? 6 * Math.sin(st * 30) : 0, sx = 700, sy = 760 + bob;
      for (const wx of [sx - 130, sx + 150]) { K.ell(ctx, wx, 800, 56, 56, '#3D3340', { seed: wx }); ctx.save(); ctx.strokeStyle = '#8A7F8F'; ctx.lineWidth = 6; const a = -st * 12; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(wx, 800); ctx.lineTo(wx + Math.cos(a + k * 2.1) * 40, 800 + Math.sin(a + k * 2.1) * 40); ctx.stroke(); } ctx.restore(); }
      K.rrect(ctx, sx - 200, sy - 120, 400, 110, 50, C.coral, { seed: 90 }); K.rrect(ctx, sx + 120, sy - 280, 40, 190, 18, C.coral, { seed: 91 });
      const box = st > stopAt + 0.8 ? 1 : 0;
      if (!box) { K.rrect(ctx, sx - 230, sy - 290, 190, 170, 24, '#FFF6E8', { seed: 92 }); K.small(ctx, '말랑', sx - 135, sy - 185, 90, { align: 'center', color: C.coral }); }
      else { K.rrect(ctx, dx + 280, 650, 150, 140, 22, '#FFF6E8', { seed: 93 }); K.small(ctx, '말랑', dx + 355, 740, 80, { align: 'center', color: C.coral }); }
      K.loaf(ctx, sx + 20, sy - 120, 0.75, st, 'milk', { sq: 0.05 * Math.sin(st * 30), rot: -0.06 });
      K.ell(ctx, sx + 20, sy - 255, 82, 44, '#F6D365', { seed: 94 });
      K.title(ctx, '갓 구운 빵,', 120, 210, 130, st, { at: 0.3, step: 0.06 });
      K.title(ctx, '말랑하게 문 앞까지', 120, 360, 110, st, { at: 1.2, step: 0.05, color: C.coral });
    },
  };
})();

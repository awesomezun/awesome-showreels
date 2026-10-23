// jar (30-second cut, 2 bars): close on one jar, its right half cut away: inside, the brew with bubbles rising and
// bursting at the surface; 항아리 속에서, 천천히 printed in the margin and 백 일 carved below.
(() => {
  SCENES['jar'] = {
    draw(ctx, t, env) {
      const K = PAN, lt = env.lt, TAU = Math.PI * 2, cx = 1180, by = 1000, h = 860;
      ctx.save(); K.push(ctx, lt, env.dur, 0.035);
      K.paper(ctx);
      const g = K.begin();
      g.save(); K.jarPath(g, cx, by, h); g.fill(); g.restore();
      K.cuts(g, K.jar(cx, by, h, 0.1), lt);
      // the cut-away: the right half opened to the brew (paper), its surface line and the jar wall in section
      const open = Ease.ioC(rm(lt, 0.5, 1.2)), w = h * 0.42;
      g.save(); K.jarPath(g, cx, by, h); g.clip(); g.globalCompositeOperation = 'destination-out';
      g.fillRect(cx + 30, by - h * 0.88, (w * 1.3) * open, h * 0.86); g.restore();
      const surf = by - h * 0.62;
      g.save(); K.jarPath(g, cx, by, h); g.clip(); g.fillRect(cx + 30, surf - 4, w * 1.3 * open, 8);
      for (let k = 0; k < 22; k++) {          // bubbles: black rings rising from the bottom, popping at the surface
        const ph = (lt * (0.18 + 0.12 * hash(k)) + hash(k * 3)) % 1, bx = cx + 70 + hash(k * 7) * (w * 1.05), byy = by - 40 - ph * (by - 40 - surf), rr2 = 6 + 14 * hash(k * 5) * (0.6 + 0.4 * ph);
        if (bx > cx + 30 + w * 1.3 * open) continue;
        g.lineWidth = 4; g.beginPath(); g.arc(bx, byy, rr2, 0, TAU); g.stroke();
      }
      g.restore();
      K.printText(g, '항아리 속에서, 천천히', 130, 300, 84, (lt - 0.6) / 0.4);
      g.fillRect(100, 700, 560, 300);
      K.carveText(g, '백 일', 150, 940, 220, rm(lt, 1.2, 2.0));
      K.end(ctx);
      ctx.restore();
    },
  };
})();

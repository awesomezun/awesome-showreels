// flavors (3 bars; 4 in the 30-second cut): three wobbling blobs pop in one per beat (grapefruit pink, lime green,
// grape purple), each a big drop with satellites orbiting, merging and splitting off, bubbles rising inside, its name
// under it: 자몽, 라임, 청포도; then they drift together and merge, their colours mixing where they meet.
(() => {
  const FL = [['pink', '자몽', 480], ['lime', '라임', 960], ['grape', '청포도', 1440]];
  SCENES['flavors'] = {
    draw(ctx, t, env) {
      const K = TOK, lt = env.lt, B = env.beatSec, balls = [], merge = Ease.ioC(rm(lt, env.dur - 1.9, env.dur - 0.6));
      K.ground(ctx);
      FL.forEach(([c, name, x0], i) => {
        const s = spring(Math.max(0, lt - (0.25 + i) * B), 2.6, 0.45), x = lerp(x0, 960 + (i - 1) * 70, merge), y = 470 + 12 * Math.sin(lt * 2 + i);
        balls.push({ x, y, r: 130 * s, col: K.COL[c] });
        for (let k = 0; k < 3; k++) { const a = lt * (1.3 + 0.2 * k) + k * 2.1 + i, d = (150 + 26 * Math.sin(lt * 2.2 + k)) * s; balls.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.8, r: (40 + 10 * k) * s, col: K.COL[c] }); }
      });
      K.liquid(ctx, balls);
      K.bubbles(ctx, balls, lt, 50, 3);
      FL.forEach(([c, name, x0], i) => K.text(ctx, name, x0, 760, 76, Math.min((lt - (0.45 + i) * B) / 0.25, 1 - merge * 1.5), { pop: true, color: K.COL[c] }));
      K.text(ctx, '세 가지 맛, 한 번에 톡', 960, 800, 72, (lt - (env.dur - 1.3)) / 0.3, { pop: true });
    },
  };
})();

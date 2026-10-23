// hook (2 bars): candy-pink drops fall one per beat into a pool rising from the bottom, each throwing up a crown of
// droplets; on the fifth beat the liquid swells up into the word 톡톡, glossy and gooey; 스파클링 and 탄산수 · 세 가지 맛.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = TOK, lt = env.lt, B = env.beatSec, C = K.COL, xs = [700, 1220, 960];
      K.ground(ctx);
      const level = 60 + 70 * clamp(lt / 2.0), balls = [];
      for (let k = 0; k < 14; k++) balls.push({ x: -80 + k * 160, y: H + 430 - level + 10 * Math.sin(lt * 3 + k), r: 190, col: C.candy });
      xs.forEach((x, i) => { const t0 = (0.5 + i) * B - 0.45; balls.push(...K.drop(lt, x, -80, H - level - 70, t0, t0 + 0.45, 34, C.candy)); balls.push(...K.crown(lt, x, H - level - 60, t0 + 0.45, C.candy, 7, 0.8)); });
      const k = Ease.ioC(rm(lt, 2.0, 2.7));
      K.liquid(ctx, balls, { text: { lines: [{ s: '톡톡', x: 960, y: 560, size: 330 }], k, col: C.candy } });
      K.bubbles(ctx, balls.slice(0, 14), lt, 30, 1);
      K.text(ctx, '스파클링', 960, 720, 96, (lt - 2.5) / 0.3, { pop: true });
      K.text(ctx, '탄산수 · 세 가지 맛', 960, 790, 40, (lt - 2.8) / 0.3, { fam: 'sans' });
    },
  };
})();

// splash (30-second cut, 3 bars): drops of the three flavours land one per two beats on a pink surface, each throwing a
// crown of droplets; 톡! pops above every landing.
(() => {
  const D = [[520, 'pink'], [1400, 'grape'], [960, 'lime']];
  SCENES['splash'] = {
    draw(ctx, t, env) {
      const K = TOK, lt = env.lt, B = env.beatSec, C = K.COL, surf = 820, balls = [];
      K.ground(ctx);
      for (let k = 0; k < 14; k++) balls.push({ x: -80 + k * 160, y: surf + 470 + 10 * Math.sin(lt * 3 + k), r: 190, col: C.candy });
      D.forEach(([x, c], i) => { const t0 = (1 + 2 * i) * B - 0.5; balls.push(...K.drop(lt, x, -80, surf - 40, t0, t0 + 0.5, 40, C[c])); balls.push(...K.crown(lt, x, surf - 20, t0 + 0.5, C[c], 9, 1.1)); });
      K.liquid(ctx, balls);
      D.forEach(([x, c], i) => { const t0 = (1 + 2 * i) * B; K.text(ctx, '톡!', x, 420, 150, Math.min((lt - t0) / 0.15, 1 - (lt - t0 - 1.0) / 0.3), { pop: true, color: C[c] }); });
    },
  };
})();

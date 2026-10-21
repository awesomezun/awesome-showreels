// you (2 bars, 30-s cut): a visitor, a soft white glow, walks through the field and the lines part round them and
// close behind; 당신이 움직이면 / 흐름도 비켜 가요.
(() => {
  SCENES['you'] = {
    draw(ctx, t, env) {
      const K = FLOW, lt = env.lt, vx = lerp(560, 1500, Ease.ioSine(clamp(lt / env.dur))), vy = 560 + Math.sin(lt * 1.6) * 60;
      K.bg(ctx, { c0: '#0E1226' });
      K.flow(ctx, t, { n: 2800, life: 2.8, kind: 'wind', pal: K.PAL.drift, alpha: 0.55, seed: 21, speed: 160, avoid: { x: vx, y: vy, r: 150 },
        spawn: (k, c) => [-300 + hash(k * 1.7 + c) * (W + 300), hash(k * 4.9 + c * 2) * H] });
      const g = ctx.createRadialGradient(vx, vy, 0, vx, vy, 120); g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.4, 'rgba(220,230,255,0.18)'); g.addColorStop(1, 'rgba(220,230,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(vx, vy, 120, 0, TAU); ctx.fill();
      K.line(ctx, '당신이 움직이면', 150, 230, 96, lt, { at: 0.2 });
      K.line(ctx, '흐름도 비켜 가요', 150, 360, 96, lt, { at: 0.9, color: '#B9D2FF' });
    },
  };
})();

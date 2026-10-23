// trail (2 bars; 3 in the 30-second cut): the cork board. A halftone map of the district is pinned up under 행적 추적;
// four pins pop one per beat with their index cards (09:12 출고, 13:40 터미널, 16:05 배송 출발, 18:22 문 앞) and red
// string runs from pin to pin to the door.
(() => {
  const MX = 960, MY = 580, MW = 1040, MH = 600;
  const PTS = [[0.12, 0.2], [0.42, 0.62], [0.7, 0.35], [0.9, 0.78]];
  const CARDS = [['09:12', '출고'], ['13:40', '터미널 도착'], ['16:05', '배송 출발'], ['18:22', '문 앞 도착']];
  const CPOS = [[250, 300], [330, 930], [1650, 260], [1640, 900]];
  SCENES['trail'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt, B = env.beatSec;
      K.cork(ctx);
      const map = K.photo('map', MW, MH, (g, w, h) => K.drawMap(g, w, h), { cell: 10 });
      K.mount(ctx, map, MX, MY + 30 * (1 - Ease.outQuint(clamp(lt / 0.4))), -0.012, 1, { clip: false, border: 14 });
      ctx.save(); ctx.translate(120, 120); ctx.rotate(-0.03); ctx.fillStyle = K.COL.cream; ctx.fillRect(0, 0, 420, 110); K.text(ctx, '행적 추적', 30, 84, 76, (lt - 0.15) / 0.25); ctx.restore();
      const sp = PTS.map(([u, v]) => [MX - MW / 2 + u * MW, MY - MH / 2 + v * MH]);
      for (let i = 0; i < 3; i++) K.string(ctx, sp[i], sp[i + 1], (lt - (1 + i) * B - 0.1) / (B * 0.8), 50);
      sp.forEach((p, i) => {
        const tp = (lt - (0.5 + i) * B) / 0.2;
        K.string(ctx, p, CPOS[i], tp * 1.5, 0);
        K.card(ctx, CPOS[i][0], CPOS[i][1], 290, 120, (i % 2 ? 0.04 : -0.05), [[CARDS[i][0], 44, 'display'], [CARDS[i][1], 30]], tp);
        K.pin(ctx, p[0], p[1], tp, i === 3 ? '#E6B400' : K.COL.red);
      });
      if (lt > 4 * B) { const k = (lt - 4 * B) * 2.4; ctx.save(); ctx.strokeStyle = K.COL.red; ctx.lineWidth = 5; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(sp[3][0], sp[3][1], 30 + 10 * Math.sin(k * 3), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      K.wipes(ctx, env);
    },
  };
})();

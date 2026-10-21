// run (4-5 bars): the core message, played. Stage 1-1, a dusk market street: the hero runs right, jumps on the beat,
// takes a coin at the top of each jump and bumps a ? block for one more; the score and the coin count climb; a box
// up top types 다시, / 동전 하나의 모험.
(() => {
  const JUMPS = [2, 5, 8, 11, 14, 17], SPEED = 32, Q = 2;   // jump starts (beats), px per beat, the jump that hits the block
  const SIGNS = ['게임기', '카트리지', '오락실', '스티커', '부품', '게임기', '카트리지'];
  SCENES['run'] = {
    draw(ctx, t, env) {
      const K = PX8, lt = env.lt, B = env.beatSec, beat = lt / B, G = K.GROUND;
      const hx = 40 + SPEED * beat, cam = Math.max(0, hx - 120);
      let hy = 0, mode = 'run';
      for (const j of JUMPS) if (beat >= j && beat < j + 2) { const u = (beat - j) / 2, hj = j === JUMPS[Q] ? 38 : 46; hy = -4 * hj * u * (1 - u); mode = 'jump'; }
      K.begin(); K.sky(); K.stars(lt, 0.6); K.sun(380 - cam * 0.05, 196, 30); K.skyline(cam); K.hills(cam); K.lanterns(cam, lt);
      SIGNS.forEach((s, i) => K.stall(70 + i * 150, cam, s, i % 2 ? '#3B7DD8' : '#E8475F', i + 1));
      K.street(cam);
      // coins at the top of each jump (not the block's), the block and its coin
      let coins = 0, score = 0;
      JUMPS.forEach((j, i) => { const apex = j + 1, cx = 40 + SPEED * apex + 2 - cam, cy = G - K.HH - 46 - 4;
        if (i === Q) { const bx = 40 + SPEED * apex - 2 - cam, by = G - K.HH - 38 - 16, hit = beat >= apex; K.qblock(bx, by, hit, hit && beat < apex + 0.4 ? 3 * Math.sin((beat - apex) / 0.4 * Math.PI) : 0);
          if (hit) { coins++; score += 200; const a = (beat - apex) * B; if (a < 0.6) { K.coin(bx + 4, by - 10 - 40 * Ease.outC(a / 0.6), lt * 2); } if (a < 1) K.text('+200', bx + 8, by - 22 - a * 10, 12, '#FFFFFF', { align: 'center', shadow: '#1A1423' }); } return; }
        if (beat < apex) { K.coin(cx, cy + Math.round(Math.sin(lt * 6 + i)), lt + i * 0.1); return; }
        coins++; score += 100; const a = (beat - apex) * B; if (a < 0.7) K.text('+100', cx + 4, cy - 2 - a * 16, 12, '#FFD84A', { align: 'center', shadow: '#1A1423' }); });
      // a little dust behind the feet when running
      if (mode === 'run' && Math.floor(lt * 9) % 2) K.rect(hx - cam - 2, G - 3, 2, 2, '#C8A890');
      K.hero(hx - cam, G - K.HH + hy, mode, lt);
      K.hud(score, coins, '1-1', 300 - Math.floor(lt * 2));
      // the message box
      if (beat > 1 && beat < (env.dur / B) - 1.5) { K.box(110, 52, 260, 66);
        const l1 = '다시,', l2 = '동전 하나의 모험', n1 = Math.floor(clamp((beat - 1.2) * 4, 0, l1.length)), n2 = Math.floor(clamp((beat - 3) * 5, 0, l2.length));
        K.text(l1.slice(0, n1), 126, 80, 24, '#FFFFFF'); K.text(l2.slice(0, n2), 126, 108, 24, '#FFD84A'); }
      K.present(ctx);
    },
  };
})();

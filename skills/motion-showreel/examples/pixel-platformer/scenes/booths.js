// booths (4 bars, 30-s cut): stage 1-2, the booths. The hero runs on past three big booths; as each comes up, a box
// names it (카트리지 장터 / 도트 공방 / 고수 대전) with what it offers; a crate to jump, a heart to take.
(() => {
  const SPEED = 32, BOOTHS = [['카트리지 장터', '고전 게임 300종', '#E8475F'], ['도트 공방', '도트 그림 배우기', '#5BD27A'], ['고수 대전', '오락실 최고 점수전', '#3B7DD8']];
  SCENES['booths'] = {
    draw(ctx, t, env) {
      const K = PX8, lt = env.lt, B = env.beatSec, beat = lt / B, G = K.GROUND;
      const hx = 120 + SPEED * beat, cam = hx - 120;
      let hy = 0, mode = 'run';
      for (const j of [3, 7, 11]) if (beat >= j && beat < j + 2) { const u = (beat - j) / 2; hy = -4 * 40 * u * (1 - u); mode = 'jump'; }
      K.begin(); K.sky(0.25); K.stars(lt); K.skyline(cam + 400); K.hills(cam + 400); K.lanterns(cam, lt);
      BOOTHS.forEach(([s, , c], i) => K.stall(170 + i * 170, cam, s, c, i + 3));
      K.street(cam);
      // crates to jump
      [3, 7, 11].forEach(j => { const x = Math.round(120 + SPEED * (j + 1) + 2 - cam); K.rect(x, G - 12, 12, 12, '#5A3A1E'); K.rect(x + 1, G - 11, 10, 10, '#A0663E'); K.rect(x + 1, G - 6, 10, 1, '#5A3A1E'); K.rect(x + 5, G - 11, 1, 10, '#5A3A1E'); });
      // a heart over the second crate
      const hb = 8, hxw = 120 + SPEED * hb + 4 - cam; if (beat < hb) K.heart(hxw, G - 70 + Math.round(Math.sin(lt * 5) * 2)); else if ((beat - hb) * B < 0.7) K.text('1UP', hxw + 3, G - 74 - (beat - hb) * 8, 12, '#5BD27A', { align: 'center', shadow: '#1A1423' });
      K.hero(hx - cam, G - K.HH + hy, mode, lt);
      K.hud(1400 + Math.floor(beat) * 50, 6, '1-2', 280 - Math.floor(lt * 2));
      // the booth boxes, one at a time
      const i = Math.min(2, Math.floor(beat / 5.33)), lb = beat - i * 5.33, [s1, s2, c] = BOOTHS[i];
      if (lb > 0.4) { K.box(100, 50, 280, 66, { edge: c }); const n = Math.floor(clamp((lb - 0.5) * 5, 0, s1.length)); K.text(s1.slice(0, n), 240, 80, 24, '#FFFFFF', { align: 'center' }); if (lb > 1.6) K.text(s2, 240, 104, 12, '#FFD84A', { align: 'center' }); }
      K.present(ctx);
    },
  };
})();

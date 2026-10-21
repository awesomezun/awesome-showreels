// boot (2 bars): the title screen over a dusk skyline: 레트로 게임 박람회, 8비트 장터 dropping in at 3x the font's grid,
// 2026; 동전을 넣으세요 blinks; a coin drops into the slot, the credit counter ticks to 01 and the screen flashes white.
(() => {
  SCENES['boot'] = {
    draw(ctx, t, env) {
      const K = PX8, lt = env.lt, B = env.beatSec, R = K.rect;
      K.begin(); K.sky(); K.stars(lt); K.sun(240, 196, 30); K.skyline(lt * 6); K.street(lt * 6);
      K.text('레트로 게임 박람회', 240, 42, 12, '#FFF3D6', { align: 'center', shadow: '#1A1423' });
      const drop = (at) => { const p = clamp((lt - at) / 0.35); return p <= 0 ? null : Math.round(-60 * (1 - p) * (1 - p) + (p >= 1 ? 0 : 0)); };
      const y1 = drop(0.15); if (y1 !== null) K.text('8비트 장터', 240, 100 + y1, 36, '#FFD84A', { align: 'center', shadow: '#8A2F2F', sx: 3, sy: 3 });
      const y2 = drop(0.45); if (y2 !== null) K.text('2026', 240, 136 + y2, 24, '#FFFFFF', { align: 'center', shadow: '#1A1423', sx: 2, sy: 2 });
      const inserted = lt > 2.2;
      if (!inserted && Math.floor(lt / (B / 2)) % 2 === 0 && lt > 0.8) K.text('동전을 넣으세요', 240, 178, 12, '#FFFFFF', { align: 'center', shadow: '#1A1423' });
      if (inserted) K.text('크레딧 01', 240, 178, 12, '#5BD27A', { align: 'center', shadow: '#1A1423' });
      // the slot and the coin falling into it
      R(222, 196, 36, 18, '#1A1423'); R(224, 198, 32, 14, '#3A2552'); R(236, 202, 8, 6, '#1A1423');
      if (lt > 1.4 && lt < 2.2) { const p = (lt - 1.4) / 0.8; K.coin(236, lerp(150, 198, p * p), lt); }
      // the flash: white, stepped down in three tones
      if (lt > 2.9) { const k = Math.floor((lt - 2.9) / 0.1); R(0, 0, K.BW, K.BH, ['#FFFFFF', '#FFF3D6', '#FFD84A', '#FFFFFF'][k % 4]); }
      K.present(ctx);
    },
  };
})();

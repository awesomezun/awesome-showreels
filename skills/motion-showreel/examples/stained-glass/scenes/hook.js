// hook (2 bars): a dark stone interior. The lead of an arched window is drawn out from its sun, then the glass lights
// piece by piece in the same order (the sun first, then its rays, the sky, three flowers, leaves, the border) while a
// brighter band of sun slides across; 유리공예 미술관 · 2027년 봄 개관 and 빛뜰 미술관 come up on the left.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = GLASS, lt = env.lt;
      K.wall(ctx);
      K.window(ctx, 1060, 70, 0.98, { lead: rm(lt, 0.15, 1.9), lit: c => (lt - 1.5 - c.order * 2.6) / 0.45, band: lerp(-300, 1500, lt / env.dur), tint: '#FFF4E0' });
      K.text(ctx, '유리공예 미술관 · 2027년 봄 개관', 150, 430, 40, (lt - 0.8) / 0.5, { fam: 'sans', w: 700, color: 'rgba(243,233,216,0.75)' });
      K.text(ctx, '빛뜰 미술관', 140, 610, 150, (lt - 3.0) / 0.6, { color: '#F6D58A', glow: 'rgba(244,205,85,0.5)' });
    },
  };
})();

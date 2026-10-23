// cell (30-second cut, 2 bars): the dive from layer 4 to layer 6, ten times closer every four beats; 세포 속의 작은 공장.
(() => {
  SCENES['cell'] = {
    draw(ctx, t, env) {
      const D = DIVE, lt = env.lt, z = 4 + 2 * lt / env.dur, a = Math.min((lt - 0.2) / 0.4, (env.dur - 0.5 - lt) / 0.4);
      D.view(ctx, z, t); D.hud(ctx, z); D.scrim(ctx, 70, 350, a);
      D.text(ctx, '세포 속의 작은 공장', 120, 200, 84, a); D.text(ctx, '기공을 지나 엽록체로', 124, 270, 40, a - 0.3, { fam: 'sans', w: 500 });
    },
  };
})();

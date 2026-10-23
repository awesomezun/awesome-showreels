// end (2 bars; 3 in the 30-second cut): the whole drawing held, a brighter glint running along the line from the nib
// to the heart; 한 번도 떼지 않은 선, then 이음 만년필 · 가상의 브랜드입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = ONE, lt = env.lt, cam = { ...K.FULL, z: K.FULL.z * (1 + 0.03 * clamp(lt / env.dur)) };
      K.ground(ctx);
      K.draw(ctx, K.TOTAL, cam, { glint: K.TOTAL * clamp((lt - 0.3) / (env.dur - 0.6)) + 400 });
      K.text(ctx, '한 번도 떼지 않은 선', W / 2, 930, 84, 1, { align: 'center' });
      K.text(ctx, '이음 만년필 · 가상의 브랜드입니다', W / 2, 1010, 36, (lt - 0.4) / 0.5, { align: 'center', fam: 'sans', w: 400, color: 'rgba(242,232,210,0.75)' });
    },
  };
})();

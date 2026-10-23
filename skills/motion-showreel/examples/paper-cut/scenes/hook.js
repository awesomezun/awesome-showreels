// hook (2 bars): a square of red hanji on the cream table is folded three times on the beat (in half, in half
// again, on the diagonal), each flap swinging over its crease and showing its back; 설맞이 한지 오리기 클래스 and
// 오림 공방 beside it.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = ORIM, lt = env.lt, B = env.beatSec;
      K.table(ctx);
      let u = 3; [1, 3, 5].forEach((b, i) => { u -= Ease.ioC(clamp((lt - b * B) / B)); });
      K.sheet(ctx, 1280, 520, 0.78, u, K.sheetBuf('rosette', K.COL.red, false), { rot: 0.04 * Math.sin(lt * 0.8) });
      K.text(ctx, '설맞이 한지 오리기 클래스', 150, 400, 44, (lt - 0.3) / 0.4, { fam: 'sans', w: 400 });
      K.text(ctx, '오림 공방', 140, 590, 170, (lt - 0.8) / 0.5, { color: K.COL.red });
      K.text(ctx, '① 세 번 접고', 150, 760, 56, (lt - 3.3) / 0.35, { fam: 'sans' });
    },
  };
})();

// end (1-2 bars): the name again, one crayon colour per letter, a scribbled star, the child waving; 오늘 그린
// 그림이 내일 동화책으로, and the fiction label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL;
      K.paper(ctx, P);
      const g = K.begin();
      K.text(g, '꼬마 화가', 960, 520, lt - 0.1, { size: 250, align: 'center', step: 0.09, dur: 0.35, colors: [C.red, C.orange, C.green, C.blue, C.purple] });
      K.line(g, K.path([[620, 580], [960, 596], [1310, 578]], 9, { bow: 0.05 }), rm(lt, 0.5, 1.1), { color: C.yellow, w: 18, seed: 9, t: lt });
      K.text(g, '오늘 그린 그림이 내일 동화책으로', 960, 720, lt - 0.7, { size: 64, color: C.black, align: 'center', step: 0.035 });
      K.kid(g, 1560, 930, 170, rm(lt, 0.2, 1.2), lt, { dress: C.orange });
      K.sun(g, 330, 240, 70, rm(lt, 0.1, 1.0), lt, { spin: lt * 0.3 });
      K.text(g, '가상의 앱 · 예제', 960, 1010, lt - 1.0, { size: 40, color: C.brown, align: 'center', step: 0.02 });
      K.end(ctx);
    },
  };
})();

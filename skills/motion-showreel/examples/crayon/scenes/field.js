// field (2 bars, 30-s cut): the same drawing, and the child keeps colouring: flowers pop up along the hills one by
// one in six colours, the kite climbs; 크레파스 한 통이면 충분해요.
(() => {
  SCENES['field'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, C = K.COL, T = lt + 4.3;          // the drawing's own clock carries on
      K.paper(ctx, P);
      const g = K.begin();
      K.drawing(g, T, { hills: 1, house: 1, tree: 1, kid: 1, kite: 1, sun: 1, clouds: 1, flowers: rm(lt, 0.2, 3.6) });
      g.save(); g.globalAlpha = 1 - clamp(lt / 0.4); K.text(g, '아이가 그리면,', 120, 210, 9, { size: 116, color: C.black }); g.restore();
      K.text(g, '크레파스 한 통이면', 120, 190, lt - 0.45, { size: 100, color: C.black, step: 0.06 });
      K.text(g, '충분해요', 120, 320, lt - 1.1, { size: 100, color: C.purple, step: 0.08 });
      K.end(ctx);
    },
  };
})();

// hook (2 bars): out of a red dot field, a manila folder slides up the desk. 사라진 택배 is stencilled on it, the tab
// is typed (No.0427 · 어디쯤 택배 수사 기록), 사건 파일 is stamped in red on the second beat and a halftone photo of
// the parcel is clipped on; red dots grow over everything on the last beat.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt, B = env.beatSec;
      K.desk(ctx);
      const fy = lerp(H + 40, 170, Ease.outQuint(clamp(lt / 0.55)));
      ctx.save(); ctx.translate(0, fy - 170);
      K.folder(ctx, 240, 170, 1440, 820);
      K.type(ctx, 'No.0427 · 어디쯤 택배 수사 기록', 306, 148, 30, lt - 0.45, { cps: 26 });
      K.text(ctx, '사라진 택배', 330, 560, 170, (lt - 0.6) / 0.25);
      K.type(ctx, '마지막 연락: 어제 오후 1시 40분', 340, 680, 40, lt - 1.5, { cps: 22, caret: true });
      K.mount(ctx, K.photo('box', 420, 380, (g, w, h) => { const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#DADADA'); bg.addColorStop(1, '#9A9A9A'); g.fillStyle = bg; g.fillRect(0, 0, w, h); K.drawBox(g, w / 2, h / 2 - 20, 0.95); }),
        1330, 640 - 400 * (1 - Ease.outBack(clamp((lt - 1.1) / 0.4), 1.3)), 0.07, 0.75, {});
      ctx.restore();
      K.stamp(ctx, '사건 파일', 1360, 330, 90, rm(lt, 2 * B, 2 * B + 0.12), -0.14);
      K.wipes(ctx, env, { in: false });
    },
  };
})();

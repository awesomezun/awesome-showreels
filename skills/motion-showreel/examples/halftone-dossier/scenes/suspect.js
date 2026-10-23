// suspect (2 bars; 3 in the 30-second cut): a flash, and the mugshot: the parcel in halftone against a height chart,
// a placard 피의자 · 택배 상자 · 2.4 kg; beside it 마지막 목격, 어제 오후 1시 40분 is typed and a redaction bar slides off
// 장소: 한빛 터미널.
(() => {
  SCENES['suspect'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt, C = K.COL;
      K.desk(ctx);
      const mug = K.photo('mug', 620, 620, (g, w, h) => { g.fillStyle = '#D8D8D8'; g.fillRect(0, 0, w, h); g.fillStyle = '#8A8A8A';
        for (let k = 0; k < 9; k++) { const y = 40 + k * 64; g.fillRect(0, y, w, k % 2 ? 2 : 5); } K.drawBox(g, w / 2, h / 2 - 10, 1.05); });
      const s = 1 + 0.03 * clamp(lt / env.dur);
      ctx.save(); ctx.translate(640, 520); ctx.scale(s, s); ctx.translate(-640, -520);
      K.mount(ctx, mug, 640, 500, -0.015, 1, { clip: false });
      ctx.fillStyle = C.ink; ctx.fillRect(400, 840, 480, 96); ctx.fillStyle = C.cream; ctx.font = K.F(36, 'mono', 700); ctx.textAlign = 'center'; ctx.fillText('피의자 · 택배 상자 · 2.4 kg', 640, 900); ctx.textAlign = 'left';
      for (let k = 0; k < 5; k++) { ctx.fillStyle = C.cream; ctx.font = K.F(22, 'mono', 700); ctx.fillText(`${(4 - k) * 20}`, 345, 248 + k * 128); }
      ctx.restore();
      K.text(ctx, '마지막 목격', 1110, 330, 96, (lt - 0.35) / 0.25, { color: C.cream });
      K.type(ctx, '어제 오후 1시 40분', 1114, 430, 50, lt - 0.7, { cps: 16, color: C.cream });
      K.type(ctx, '장소: 한빛 터미널', 1114, 520, 50, lt - 1.5, { cps: 40, color: C.cream });
      K.redact(ctx, 1230, 476, 380, 64, rm(lt, 2.0, 2.5));
      K.type(ctx, '현재 상태: 아직 오는 중', 1114, 610, 40, lt - 2.6, { cps: 16, color: 'rgba(244,239,228,0.75)', caret: true });
      if (lt < 0.35) env.fx.flash = Math.max(env.fx.flash || 0, 0.9 * (1 - lt / 0.35)), env.fx.flashColor = '#FFFFFF';
      K.wipes(ctx, env);
    },
  };
})();

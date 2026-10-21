// end (3-4 bars): the app's name with 멍멍 jumping for joy on every other beat, crown on; where to get it; the fiction
// label.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = TOON, lt = env.lt, C = K.COL, B = env.beatSec;
      ctx.fillStyle = C.yel; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 20; i++) { ctx.save(); ctx.translate(1380, 600); ctx.rotate(i / 20 * TAU + lt * 0.3); ctx.fillStyle = i % 2 ? '#FFE07A' : '#FFD23F'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-240, -1600); ctx.lineTo(240, -1600); ctx.fill(); ctx.restore(); }
      const ph = (lt / (2 * B)) % 1, jump = Math.sin(Math.PI * ph) * 120, sq = ph < 0.08 || ph > 0.92 ? 0.3 : -0.1;
      K.dog(ctx, 1330, 920 - jump, 1.0, null, { crown: 1, wag: lt * 24, sq });
      K.pop(ctx, '산책왕 멍멍', 110, 400, 170, lt, { at: 0.1, fill: C.white });
      K.pop(ctx, '앱스토어 · 구글플레이', 120, 540, 64, lt, { at: 0.4, fam: FAM.sans, fill: C.blue });
      K.text(ctx, '가상의 앱 · 예제', 124, 640, 48, { a: clamp((lt - 0.7) / 0.3), fam: FAM.sans });
    },
  };
})();

// end (2 bars; 3 in the 30-second cut): the last photo, the parcel on the doormat before the front door, in halftone;
// 해결 is stamped across its corner on the first beat; 사건 종결: / 택배는 문 앞에, then 어디쯤 택배 and 가상의 앱입니다.
(() => {
  SCENES['end'] = {
    draw(ctx, t, env) {
      const K = DOS, lt = env.lt, B = env.beatSec, C = K.COL;
      K.desk(ctx);
      const s = 1 + 0.025 * clamp(lt / env.dur);
      ctx.save(); ctx.translate(560, 540); ctx.scale(s, s); ctx.translate(-560, -540);
      K.mount(ctx, K.photo('door', 640, 700, (g, w, h) => K.drawDoor(g, w, h)), 560, 520, -0.03, 1, {});
      ctx.restore();
      K.stamp(ctx, '해결', 770, 300, 130, rm(lt, B, B + 0.12), -0.2);
      K.text(ctx, '사건 종결:', 1040, 430, 104, (lt - 0.2) / 0.25, { color: C.cream });
      K.text(ctx, '택배는 문 앞에', 1040, 560, 116, (lt - 0.55) / 0.25, { color: '#F2C9A0' });
      K.type(ctx, '어디쯤 택배 · 택배 추적 앱', 1046, 680, 42, lt - 1.2, { cps: 24, color: C.cream });
      K.text(ctx, '가상의 앱입니다', 1046, 900, 30, (lt - 1.8) / 0.3, { fam: 'mono', w: 700, color: 'rgba(244,239,228,0.6)' });
      K.wipes(ctx, env, { out: false });
    },
  };
})();

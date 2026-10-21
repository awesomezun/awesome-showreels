// alert (3 bars, 30-s cut): a collision warning. A piece of debris (orange) crosses towards one satellite; a counter
// reads 충돌 위험 03:00; the satellite raises its orbit along a short arc and the paths part: 회피 완료; 충돌 위험, /
// 3분 전에 피해요.
(() => {
  SCENES['alert'] = {
    draw(ctx, t, env) {
      const K = HOLO, lt = env.lt, f = K.flick(lt, 4), HI = 12, cx = 1300, cy = 520;
      K.room(ctx);
      const v = K.view(cx, cy, 200, 2.2, 0.42);
      K.projector(ctx, cx, 930, 860, 80, 1);
      K.globe(ctx, v, f * 0.6); K.rings(ctx, v, f * 0.5, (s, i) => i === HI);
      const S = K.SATS[HI], man = Ease.ioC(clamp((lt - 2.4) / 1.2)), sat = { ...S, r: S.r + 0.12 * man };
      const tt = 0.6 + lt * 0.05, sp = K.proj(v, K.satPos(sat, tt));
      // the debris: a short orange streak on a crossing path that would meet the satellite at lt = 3.4
      const meet = K.proj(v, K.satPos(S, 0.6 + 3.4 * 0.05)), dk = clamp(lt / 3.4), from = [meet[0] + 520, meet[1] - 300], dp = [lerp(from[0], meet[0] - 260, dk), lerp(from[1], meet[1] + 150, dk)];
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.setLineDash([10, 10]); ctx.strokeStyle = K.rgba(K.COL.warn, 0.55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(meet[0] - 260, meet[1] + 150); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = K.COL.warn; ctx.beginPath(); ctx.arc(dp[0], dp[1], 6, 0, TAU); ctx.fill();
      if (lt > 2.4) { ctx.strokeStyle = K.rgba(K.COL.holo2, 0.9); ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const q = K.proj(v, K.satPos({ ...S, r: S.r + 0.12 * Ease.ioC(k / 20 * man) }, 0.6 + (2.4 + k / 20 * (lt - 2.4)) * 0.05)); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); }
      ctx.fillStyle = lt < 2.4 ? K.COL.warn : K.COL.ink; ctx.fillRect(sp[0] - 6, sp[1] - 6, 12, 12); ctx.strokeStyle = K.rgba(lt < 3.6 ? K.COL.warn : K.COL.holo, 0.9); ctx.beginPath(); ctx.arc(sp[0], sp[1], 22 + 6 * Math.sin(lt * 10), 0, TAU); ctx.stroke(); ctx.restore();
      K.sats(ctx, v, lt * 0.5, 300, f * 0.45);
      const left = Math.max(0, 180 - Math.floor(lt * 20)), mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
      K.panel(ctx, 1500, 150, 360, 160, 1, lt < 3.6 ? K.COL.warn : K.COL.holo);
      K.text(ctx, lt < 3.6 ? '충돌 위험' : '회피 완료', 1530, 215, 44, { mono: true, color: lt < 3.6 ? K.COL.warn : K.COL.holo2 });
      K.text(ctx, lt < 3.6 ? `${mm}:${ss}` : '궤도 +12km', 1530, 285, 52, { mono: true });
      K.text(ctx, '충돌 위험,', 110, 330, 110, { a: clamp((lt - 0.2) / 0.3), color: K.COL.warn });
      K.text(ctx, '3분 전에 피해요', 110, 480, 110, { a: clamp((lt - 1.0) / 0.3) });
      K.scan(ctx, lt);
    },
  };
})();

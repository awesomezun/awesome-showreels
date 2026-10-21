// ticket (2 bars, 30-s cut): a ticket stub cut from kraft paper slaps down with its perforated edge; a red stamp
// thuds onto it on beat 3: 7월 1일 오픈.
(() => {
  SCENES['ticket'] = {
    draw(ctx, t, env) {
      const K = COLLAGE, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = K.q(lt);
      K.board(ctx, P, { color: '#E4EEF3' });
      K.scraps(ctx, 5, lt, { alpha: 0.45 });
      const s = K.slap(lt, 0.1, 0.3);
      if (s) K.piece(ctx, 960, 540, K.torn(1180, 520, 91, 3, 20), { base: C.kraft, fill: 'print', tileA: 0.12, rot: -0.04 + s.dr, scale: s.s, sh: s.sh, alpha: s.a,
        inner: c => {
          c.strokeStyle = 'rgba(30,27,26,0.6)'; c.setLineDash([10, 12]); c.lineWidth = 4; c.beginPath(); c.moveTo(300, -260); c.lineTo(300, 260); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.ink; c.font = '64px "Black Han Sans"'; c.fillText('종이비행 페스티벌', -540, -120);
          c.font = '46px "Do Hyeon"'; c.fillText('8.14 — 8.16  ·  사흘 자유 입장', -540, -30); c.fillText('물빛공원 야외무대', -540, 40);
          c.font = '40px "Song Myung"'; c.fillText('ADMIT ONE', 360, 0);
          c.fillStyle = 'rgba(30,27,26,0.75)'; for (let i = 0; i < 26; i++) c.fillRect(-540 + i * 16, 140, (i * 7) % 3 + 4, 70);
        } });
      const st = K.slap(lt, 3 * B, 0.15);
      if (st) { if (lt - 3 * B < 0.12) env.fx.shake = Math.max(env.fx.shake, 10);
        K.piece(ctx, 1260, 600, K.blob(170, 7), { base: 'rgba(0,0,0,0)', border: false, shadow: false, rot: -0.2, scale: st.s * 0.95, alpha: st.a * 0.9,
          inner: c => { c.strokeStyle = C.red; c.lineWidth = 12; c.beginPath(); c.arc(0, 0, 150, 0, TAU); c.stroke(); c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 128, 0, TAU); c.stroke();
            c.fillStyle = C.red; c.textAlign = 'center'; c.font = '72px "Black Han Sans"'; c.fillText('7월 1일', 0, -6); c.font = '58px "Black Han Sans"'; c.fillText('오픈', 0, 64); } }); }
      K.strip(ctx, '티켓은', 230, 190, 80, lt, 1.5 * B, { bg: C.ink, fg: C.white, rot: -0.05, seed: 95 });
    },
  };
})();

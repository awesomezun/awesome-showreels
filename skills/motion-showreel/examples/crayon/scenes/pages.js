// pages (2 bars, 30-s cut): the book keeps going. Two pages turn, each on a beat pair, showing more of the child's
// drawings (a night with the moon, a birthday cake); 한 장씩 넘기면, 우리 아이 이야기.
(() => {
  function moon(g, K, r, t) {                                  // page drawing 1: night, moon and stars
    const C = K.COL;
    K.fill(g, gg => { gg.beginPath(); gg.rect(r.x + 40, r.y + 60, r.w - 80, r.h - 120); }, { x: r.x, y: r.y, w: r.w, h: r.h }, 1, { color: '#2C3E8C', gap: 14, seed: 201, t });
    K.fill(g, gg => { gg.beginPath(); gg.arc(r.x + r.w * 0.62, r.y + r.h * 0.36, 90, 0, TAU); }, { x: r.x + r.w * 0.62 - 90, y: r.y + r.h * 0.36 - 90, w: 180, h: 180 }, 1, { color: C.yellow, gap: 11, seed: 202, t });
    for (let i = 0; i < 9; i++) { const x = r.x + 90 + ((i * 173) % (r.w - 180)), y = r.y + 110 + ((i * 97) % (r.h * 0.5)); K.line(g, K.path([[x - 14, y], [x + 14, y], [x, y - 14], [x, y + 14], [x - 10, y - 10], [x + 10, y + 10]], 210 + i), 1, { color: C.yellow, w: 6, seed: 210 + i, t }); }
    K.kid(g, r.x + r.w * 0.32, r.y + r.h - 90, 150, 1, t, { dress: C.pink, wave: 1 });
  }
  function cake(g, K, r, t) {                                  // page drawing 2: a birthday cake
    const C = K.COL, x = r.x + r.w / 2, y = r.y + r.h * 0.72;
    K.fill(g, gg => { gg.beginPath(); gg.rect(x - 190, y - 170, 380, 170); }, { x: x - 190, y: y - 170, w: 380, h: 170 }, 1, { color: C.pink, gap: 12, seed: 221, t });
    K.line(g, K.path([[x - 190, y], [x - 190, y - 170], [x + 190, y - 170], [x + 190, y], [x - 194, y]], 222), 1, { color: '#C2456F', w: 8, seed: 222, t });
    K.line(g, K.curve([[x - 190, y - 120], [x - 120, y - 95], [x - 50, y - 125], [x + 20, y - 95], [x + 100, y - 125], [x + 190, y - 100]], 10), 1, { color: C.white, w: 12, seed: 223, t });
    [-110, -40, 30, 100].forEach((dx, i) => { K.line(g, K.path([[x + dx, y - 172], [x + dx, y - 250]], 230 + i), 1, { color: [C.sky, C.yellow, C.green, C.purple][i], w: 12, seed: 230 + i, t });
      const fl = Math.sin(t * 9 + i) * 4; K.line(g, K.loop(x + dx, y - 278 + fl, 11, 20, 240 + i, { n: 16 }), 1, { color: C.orange, w: 8, seed: 240 + i, t }); });
    K.text(g, '생일 축하해!', x, r.y + 170, 9, { size: 60, color: C.red, align: 'center' });
  }
  SCENES['pages'] = {
    draw(ctx, t, env) {
      const K = CRAYON, P = env.palette, lt = env.lt, B = env.beatSec, C = K.COL, T = lt + 15;
      K.paper(ctx, P);
      const g = K.begin();
      const pw = 680, ph = 740, cx = 960, cy = 610, bk = K.book(g, cx, cy, pw, ph, 1, T);
      const flip = i => Ease.ioC(rm(lt, (0.5 + i * 2) * B, (0.5 + i * 2) * B + 0.6));
      const f0 = flip(0), f1 = flip(1);
      const pages = [r => { const s = Math.min(pw / W, ph / H) * 0.94; g.save(); g.translate(r.x + (pw - W * s) / 2, r.y + (ph - H * s) / 2 + 30); g.scale(s, s); g.beginPath(); g.rect(0, 0, W, H); g.clip(); K.drawing(g, T, { hills: 1, house: 1, tree: 1, kid: 1, kite: 1, sun: 1, clouds: 1, flowers: env.cut === '30' ? 1 : 0 }); g.restore(); },
        r => moon(g, K, r, T), r => cake(g, K, r, T)];
      const cur = f1 >= 1 ? 2 : f0 >= 1 ? 1 : 0, turning = f0 > 0 && f0 < 1 ? 0 : f1 > 0 && f1 < 1 ? 1 : -1;
      // the right page shows the next drawing under a turning page; the turning page narrows to the spine, then opens left
      const under = turning >= 0 ? turning + 1 : cur;
      g.save(); g.beginPath(); g.rect(bk.right.x, bk.right.y - 20, pw, ph + 60); g.clip(); pages[under](bk.right); g.restore();
      if (turning >= 0) {
        const f = turning ? f1 : f0, ang = f * Math.PI, wv = Math.cos(ang) * pw;
        g.save(); g.fillStyle = C.white; g.globalAlpha = 0.95;
        const x0 = wv >= 0 ? cx : cx + wv, w0 = Math.abs(wv);
        g.fillRect(x0, bk.right.y, w0, ph); g.restore();
        if (wv > 0) { g.save(); g.beginPath(); g.rect(cx, bk.right.y, wv, ph); g.clip(); g.translate(cx, 0); g.scale(wv / pw, 1); g.translate(-cx, 0); pages[turning](bk.right); g.restore(); }
        K.line(g, K.path([[cx + wv, bk.right.y + 10], [cx + wv, bk.right.y + ph]], 300 + turning), 1, { color: C.brown, w: 6, seed: 300, t: T });
      }
      // the left page: the story line of the spread on show (the turning page carries the next one past the spine)
      const story = ['옛날 옛적,|바람 부는 언덕에|연을 날리는|아이가 살았어요.', '밤이 되면|달님에게|인사했어요.', '오늘은|내 생일이에요!'];
      const showL = turning >= 0 && Math.cos((turning ? f1 : f0) * Math.PI) < 0 ? turning + 1 : cur;
      story[showL].split('|').forEach((s1, i) => K.text(g, s1, bk.left.x + 70, bk.left.y + 190 + i * 112, 9, { size: 70, color: C.brown }));
      const w1 = K.text(g, '한 장씩 넘기면,', 420, 150, lt - 0.3, { size: 92, color: C.black, step: 0.05 });
      K.text(g, '우리 아이 이야기', 420 + w1 + 40, 150, lt - 1.0 * B, { size: 92, color: C.purple, step: 0.06 });
      K.end(ctx);
    },
  };
})();

// hook (2 bars): the studio wall and a blank sheet. Five inks are pulled one by one, every beat: a yellow sky, the
// orange sun, the sea, the green island, then the darkest ink with 바람섬, the trail and the band 다섯 길; each lands a
// little out of register and snaps in. Beside it the run sheet ticks off 1도 하늘 … 5도 먹, then 한 장에 다섯 번.
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = SILK, lt = env.lt, B = env.beatSec, times = [0.5, 1.5, 2.5, 3.5, 4.5].map(b => b * B);
      K.wall(ctx);
      ctx.save(); ctx.translate(480, 120); ctx.rotate(K.sway(lt)); ctx.translate(-480, -120);
      K.poster(ctx, 'title', 180, 120, 1, lt, times); ctx.restore();
      K.text(ctx, '섬 트레일 포스터 · 실크스크린', 930, 250, 36, lt / 0.4, { fam: 'sans', w: 700, color: 'rgba(243,234,215,0.75)' });
      K.runSheet(ctx, 930, 330, 'title', lt, times, ['하늘', '해', '바다', '섬', '먹']);
      K.text(ctx, '한 장에 다섯 번', 930, 760, 84, (lt - 2.9) / 0.35, { color: K.INK.yellow });
    },
  };
})();

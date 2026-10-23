// hook (2 bars): a yellow sunburst turning, confetti falling; the show's name pops in character by character in two
// fat lines, 냥이네 / 하숙집, with sparkles around it; then the tag 오늘의 하숙생은?
(() => {
  SCENES['hook'] = {
    draw(ctx, t, env) {
      const K = NYANG, lt = env.lt, B = env.beatSec;
      K.burst(ctx, lt); K.confetti(ctx, lt, 50);
      K.cap(ctx, '냥이네', W / 2, 760, 230, lt - B, { style: 'pink', stagger: 0.07 });
      K.cap(ctx, '하숙집', W / 2, 1010, 230, lt - 2 * B, { style: 'sky', stagger: 0.07 });
      if (lt > 2.5 * B) K.sparkles(ctx, W / 2, 860, 470, lt, 10);
      K.tag(ctx, '오늘의 하숙생은?', W / 2, 1260, 64, (lt - 5 * B) / 0.25);
    },
  };
})();

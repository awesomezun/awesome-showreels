// projector (3 bars, 30-s cut): the booth. The two reels turn, the beam fans out with dust drifting in it;
// 그때 그 필름 영사기로.
(() => {
  SCENES['projector'] = {
    draw(ctx, t, env) {
      const K = REEL8, lt = env.lt, C = K.COL;
      ctx.save(); K.weave(ctx, lt); K.projector(ctx, lt); ctx.restore();
      const a = clamp((lt - 0.5) / 0.4); ctx.fillStyle = `rgba(10,7,4,${0.8 * a})`; ctx.fillRect(0, 880, W, 170);
      K.text(ctx, '그때 그 필름 영사기로', W / 2, 990, 84, { a, align: 'center' });
      K.film(ctx, lt);
    },
  };
})();

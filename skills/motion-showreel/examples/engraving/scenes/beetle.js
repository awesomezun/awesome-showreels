// beetle (3 bars): plate 7, a stag beetle seen from above, engraved in order: outlines, the suture, mandibles with
// their inner teeth, legs with spines, antennae, then the hatching that shades each dome (wide where it turns from
// the light, crossed in deep shade). A magnification roundel opens on the mandible's tooth; 도판 7 · 사슴벌레, 1 cm.
(() => {
  const BX = 700, BY = 560, BS = 0.95;
  SCENES['beetle'] = {
    draw(ctx, t, env) {
      const K = DONG, lt = env.lt, list = K.beetle(0.1, 1);
      ctx.save(); K.push(ctx, lt, env.dur, 0.02, 900, 540);
      K.paper(ctx);
      const tips = K.drawBug(ctx, list, lt, BX, BY, BS);
      const focus = [BX + 92 * BS, BY - 405 * BS];
      K.roundel(ctx, 1480, 380, 220, rm(lt, 2.7, 3.15), focus, 2.6, (g) => { g.translate(BX, BY); g.scale(BS, BS); K.lines(g, list, lt); }, { leader: true });
      if (lt > 3.2) {              // a soft reflection sliding across the lens during the hold
        const ph = ((lt - 3.2) * 0.35) % 1; ctx.save(); ctx.beginPath(); ctx.arc(1480, 380, 216, 0, Math.PI * 2); ctx.clip();
        const x = lerp(1180, 1780, ph), g = ctx.createLinearGradient(x - 80, 0, x + 80, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(1260, 160, 440, 440); ctx.restore();
      }
      K.label(ctx, '도판 7', 1270, 760, 40, (lt - 2.4) / 0.4);
      K.label(ctx, '사슴벌레', 1270, 850, 84, (lt - 2.6) / 0.4, { fam: 'display', weight: 800 });
      K.scale(ctx, 1274, 905, 92, '1 cm', rm(lt, 3.0, 3.5));
      K.glint(ctx, tips, lt);
      ctx.restore();
    },
  };
})();

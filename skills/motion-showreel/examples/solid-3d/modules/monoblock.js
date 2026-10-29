// 모노블록 cast: the speaker in solid 3D (runtime g3.js), shared by every scene.
// MONOBLOCK.product(finish) -> a G3 group: an anodised rounded block, a dotted grille, a top button and a status light.
// MONOBLOCK.insides() -> the parts in their assembled places, for the exploded view.
(() => {
  const FINISH = { graphite: '#2E3136', sand: '#CDBFA8', sage: '#8FA392', vermilion: '#E0502D' };
  const NAMES = { graphite: '그라파이트', sand: '샌드', sage: '세이지', vermilion: '버밀리언' };
  const SIZE = { w: 2.2, h: 1.3, d: 1.1, r: 0.24 };
  let grilleCanvas = null;
  // the grille as a texture: a dark field of punched holes on a hexagonal pitch
  function grille() {
    if (grilleCanvas) return grilleCanvas;
    const b = makeBuf(760, 400), g = b.g;
    g.fillStyle = '#1B1C1F'; g.fillRect(0, 0, 760, 400);
    for (let y = 0, row = 0; y < 400 + 20; y += 17, row++) {
      for (let x = (row % 2) * 9; x < 760 + 20; x += 18) {
        g.fillStyle = '#0B0B0C'; circle(g, x, y, 5.2); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.07)'; circle(g, x - 1, y - 1.5, 2.2); g.fill();
      }
    }
    grilleCanvas = b.c;
    return b.c;
  }
  function product(finish = 'graphite', o = {}) {
    const T = G3.THREE, grp = new T.Group();
    const col = FINISH[finish] || finish;
    const body = G3.mesh(G3.geo.box(SIZE.w, SIZE.h, SIZE.d, SIZE.r, 6), G3.mat('metal', { color: col, roughness: 0.4, metalness: 0.7 }), { name: o.prefix ? o.prefix + 'body' : 'body' });
    const gr = G3.card(grille(), { w: SIZE.w - 0.34, h: SIZE.h - 0.34, radius: 0.16, mat: 'satin', roughness: 0.8, shadow: false, pos: [0, 0, SIZE.d / 2 + 0.003] });
    gr.name = (o.prefix || '') + 'grille';
    const button = G3.mesh(G3.geo.torus(0.14, 0.028, 64), G3.mat('chrome', { color: '#D9D9D9' }), { pos: [0.55, SIZE.h / 2 + 0.005, 0], rot: [Math.PI / 2, 0, 0], shadow: false });
    const cap = G3.mesh(G3.geo.cylinder(0.12, 0.12, 0.03, 48), G3.mat('satin', { color: col, roughness: 0.6 }), { pos: [0.55, SIZE.h / 2 + 0.003, 0], shadow: false });
    const led = G3.mesh(G3.geo.sphere(0.028, 24), G3.mat('neon', { color: 'accent' }), { name: (o.prefix || '') + 'led', pos: [SIZE.w / 2 - 0.3, -SIZE.h / 2 + 0.11, SIZE.d / 2 + 0.01], shadow: false });
    body.add(button, cap, led);                 // they ride with the shell (the exploded view lifts it)
    grp.add(body, gr);
    grp.userData.parts = { body, grille: gr, button, led };
    return grp;
  }
  function insides() {
    const T = G3.THREE, parts = new T.Group();
    // 40 mm driver: a cone with a dust cap and a magnet behind it
    const driver = new T.Group(); driver.name = 'driver';
    const cone = G3.mesh(G3.geo.lathe([[0.02, 0], [0.18, 0.02], [0.36, 0.12], [0.4, 0.13], [0.42, 0.11]], 64), G3.mat('satin', { color: '#2A2B2F', side: 'double', roughness: 0.7 }));
    cone.rotation.x = -Math.PI / 2;
    const dust = G3.mesh(G3.geo.sphere(0.09, 32), G3.mat('satin', { color: '#3A3C42' }), { pos: [0, 0, 0.02], scale: [1, 1, 0.45] });
    const magnet = G3.mesh(G3.geo.cylinder(0.2, 0.2, 0.16, 48), G3.mat('metal', { color: '#9AA0A8', roughness: 0.3 }), { pos: [0, 0, -0.1], rot: [Math.PI / 2, 0, 0] });
    driver.add(cone, dust, magnet); driver.position.set(-0.45, 0.02, 0.3);
    // passive radiator at the back: a flat disc in a rubber surround
    const radiator = new T.Group(); radiator.name = 'radiator';
    radiator.add(G3.mesh(G3.geo.cylinder(0.42, 0.42, 0.03, 64), G3.mat('metal', { color: '#B9BEC6', roughness: 0.25 }), { rot: [Math.PI / 2, 0, 0] }));
    radiator.add(G3.mesh(G3.geo.torus(0.44, 0.035, 96), G3.mat('satin', { color: '#1F2023', roughness: 0.9 })));
    radiator.position.set(0.1, 0, -0.45);
    // battery and the board
    const battery = G3.mesh(G3.geo.box(1.1, 0.34, 0.3, 0.05), G3.mat('satin', { color: 'accent2', roughness: 0.55 }), { name: 'battery', pos: [0.45, -0.3, -0.05] });
    const board = G3.mesh(G3.geo.box(0.9, 0.04, 0.55, 0.01), G3.mat('satin', { color: '#2F6B4A', roughness: 0.6 }), { name: 'board', pos: [0.5, 0.3, 0.05] });
    for (let i = 0; i < 6; i++) board.add(G3.mesh(G3.geo.box(0.1 + (i % 3) * 0.04, 0.04, 0.08, 0.01), G3.mat('metal', { color: '#C7CCD3', roughness: 0.3 }), { pos: [-0.3 + i * 0.12, 0.04, (i % 2 ? 0.12 : -0.1)], shadow: false }));
    parts.add(driver, radiator, battery, board);
    return parts;
  }
  window.MONOBLOCK = { FINISH, NAMES, SIZE, product, insides, grille };
})();

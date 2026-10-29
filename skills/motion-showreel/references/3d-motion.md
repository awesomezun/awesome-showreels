# Solid 3D motion (runtime/g3.js)

`G3` gives scenes real 3D: lit meshes with physical materials, soft shadows, image-based light, fog, depth of field,
camera rigs, arrangements, deformers, extruded text in any font (Hangul included), captures as cards in space, and
six 3D transitions. It sits on three.js 0.186 (`runtime/vendor/`, MIT) and ships only with projects that use it.
Full signatures: `engine-api.md` section 6b. The technique catalogue in section 5 follows the categories of
TakayuStudio's [3D Motion Reference](https://takayustudio.jp/3d-motion-reference/) (a study collection of 227
original Three.js demos); the names and categories guided what G3 covers, and every line of G3 is written here.

## 1. When 3D earns its place

- **Use it** when the claim is spatial or physical: a product's form and finish, what is inside it, how parts fit,
  a logo that should feel made of something, depth that orders information (timelines, carousels, cover flow), a
  camera move that tells the viewer where to look (dolly zoom on the decisive moment, a pull-back that reveals the
  whole).
- **Keep 2D** for reading. Body copy, captions, UI captures that must stay crisp front-on, charts with exact values.
  Tilted screenshots belong to `GL.panel` (perspective-correct, crisp text); 3D cards (`G3.card`) are for captures
  that move through space as objects.
- **Mix them.** A 3D stage renders into the scene's 2D context like any other layer: paint the background, render the
  stage, then put kinetic type, callouts (`st.project()` gives screen points) and the HUD-free copy on top.
- The material still decides the look: palette roles drive every default colour (`'accent'`, `'bg2'`...), the style's
  spring and ease drive the motion, and the tone pass decides whether a reel is 3D at all.

## 2. The contract (purity)

Frames render out of order in parallel workers, so a stage must look the same at time t whatever was drawn before.

```js
(() => {
  SCENES['hero'] = {
    draw(ctx, t, env) {
      const P = env.palette, lt = env.lt;
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      const st = G3.stage('hero', s => {                       // runs once per page; geometry, materials, lights
        s.studio({ floor: 'shadow', rim: { color: 'accent2' } });
        s.add(G3.mesh(G3.geo.box(1.2, 1.2, 1.2, 0.12), G3.mat('clearcoat', { color: 'accent' })), { name: 'box', pos: [0, 0.6, 0] });
      });
      const e = styleSpring(lt - 0.2);                            // every animated property, every frame, from t
      G3.pose(st.get('box'), { pos: [0, (1 - e) * 2, 0], rot: [0, lt * 0.6, 0], scale: lerp(0.6, 1, e) });
      st.render(ctx, G3.rig.arc({ target: [0, 0.6, 0], p: Ease.ioC(rm(lt, 0, 3)) }), { dof: { focus: [0, 0.6, 0], maxBlur: 10 } });
      text(ctx, 'Made of something.', 140, 940, { size: ts(5), color: P.ink });
    },
  };
})();
```

- Build once in `G3.stage(key, build)` (key = scene id, or `id + ':' + variant`). Inside `build`, use `s.get()`,
  never the outer `st` (it is not assigned yet).
- Set **every** animated property on every frame from `t`/`env`. Never `+=`, never read last frame's value.
- `G3.pose`, `G3.explode` and the deformers keep the build-time transform or geometry as their base, so they are
  pure by construction. Code that moves an object directly must set its full transform.
- Randomness: `G3.rng(seed)` or `hash()`. Simulations: `G3.bake(key, {init, step, sample})` precomputes a table at a
  fixed step and `at(t)` interpolates it (deterministic; same inputs, same table).
- Check: render the same times in two different orders (`stills.mjs ... 2.6 6.4` and `... 6.4 2.6`) and compare the
  PNGs; they must match (one-level differences in a few pixels of a mirror floor are GPU rounding).

## 3. Stage, look and render

- `s.studio(o)`: background (`bg`, palette role or CSS; `null` = transparent over the 2D frame), hemisphere fill,
  a key light with soft PCF shadows (`key: {dir, intensity, soft, size, mapSize}`), optional rim light (`rim: {color,
  dir, intensity}`), image-based light from a studio room (`env`, `envIntensity`), fog (`fog: {near, far}` or
  `{density}`), and a floor: `'shadow'` (shadow catcher, the floor colour stays the background), `'solid'`,
  `'grid'`, `'mirror'` (reflections, `reflect` 0..1) or `false`. Lights stay reachable as `st.lights.key|rim|hemi`.
- Tone mapping defaults to `neutral` (Khronos PBR Neutral keeps brand colours close to their hex); `agx` and `aces`
  for filmic looks (`G3.stage(key, build, {tone, exposure})` or per `render`). The background colour is exact in
  every mode.
- `st.render(ctx, rig, {dof, tone, exposure, alpha, rect})`. `dof: {focus (distance or a world point), aperture,
  maxBlur px at 1080p}` blurs by depth; `dof: {mode: 'tilt', center, width, feather}` is a tilt-shift band.
  Bloom, grain, vignette, chroma, flashes, shake and motion blur stay compositor work (`env.fx`, reel.config
  `motionBlur`), so they match the 2D scenes.
- `st.project(point, object?)` -> `[x, y, depth, visible]` for 2D callouts, labels and leader lines on 3D points.

## 4. Building blocks

| Need | Call |
|---|---|
| shapes | `G3.geo.box(w, h, d, radius)` `sphere` `cylinder` `cone` `torus` `knot` `capsule` `plane` `disc` `ring` `ico` `lathe(profile)` `tube(points, r)` `roundRect` `slab` |
| logo / title in 3D | `G3.geo.text(str, {size, depth, bevel, fam, weight, letters: true})` -> `{geometry, letters: [{geometry, offset}]}`; `G3.geo.svg(svgOrPathD, {size, depth, bevel})` |
| materials | `G3.mat(kind, {color, ...})`: `matte plastic satin metal chrome brushed glass crystal iridescent clearcoat velvet wax neon toon wire basic xray` (+ any three.js material property) |
| a capture or canvas in space | `G3.card(img|canvas, {w, radius, depth, edge, back, dynamic, emissive})`; `dynamic: true` re-uploads a canvas you redraw each frame (a live phone screen) |
| text in space | `G3.label(str, {h, color, bg, billboard})` |
| many copies | `G3.instanced(geo, mat, n)` then `inst.set(i, {pos, rot, scale, color})` |
| soft particles | `G3.points(n, {size, color, additive, soft})` then `pts.set(i, [x, y, z], size, alpha, color)` |
| hinge / pivot | `G3.pivot(obj, [x, y, z])` |
| transforms from data | `G3.pose(obj, {pos, rot, scale})` (added on the build-time base) |

## 5. Technique catalogue

Category names follow the reference; each row lists techniques and the G3 calls that make them.

**Camera work** (dolly zoom, orbit, dolly in, zoom vs dolly, truck, pan & tilt, crane, rack focus, fly-through,
handheld, lens compression, follow cam, pull-back reveal, dutch angle, whip pan, arc shot, top-down tracking, crash
zoom, bullet time, low-angle hero, POV walk, split diopter, impact shake, shake anatomy, shutter angle, staging,
screen direction, dynamic FOV, kill cam)

| Technique | G3 |
|---|---|
| orbit, dolly, dolly zoom, truck, pan & tilt, crane, arc, fly-through, follow, top-down, low angle, POV walk, whip | `G3.rig.orbit dolly dollyZoom truck panTilt crane arc flythrough follow topDown lowAngle povWalk whip` |
| pull-back reveal | `rig.dolly` (or `arc`) from a macro distance to the whole, with `dof.focus` following the subject |
| crash zoom, dutch angle, dynamic FOV | `rig.crashZoom(r, p)`, `rig.dutch(r, roll)`, `rig.dynamicFov(r, boost)` |
| handheld, impact shake (amplitude, frequency, decay) | `rig.handheld(r, t, {amp})`, `rig.shake(r, t, hits, {amp, freq, decay, rot})`; hits = cue times (`env.cues`) |
| lens compression, zoom vs dolly | `rig.lens(mm)` / `rig.mm(fov)`, `rig.distForFov(h, fov, share)` keeps the subject size while the lens changes |
| rack focus, split diopter, tilt-shift | `render(..., {dof: {focus}})` animated between two points; two stages or `rect` halves for a split; `dof: {mode: 'tilt'}` |
| bullet time, kill cam | `G3.timeRemap(t, {at, hold, slow, ramp})` slows the action while the camera keeps real time |
| shutter angle, motion blur | reel.config `"motionBlur": {"samples": 8, "shutter": 0.5}` (exact: scenes are pure) |
| staging, 180-degree rule, screen direction | design rules: one subject lit and in focus; keep cameras on one side of the action line across cuts; motion keeps its screen direction through a `match` or `push` |

**Depth cues** (perspective, depth of field, contact shadow, motion parallax, atmospheric perspective, occlusion,
relative size, texture gradient, shading, tilt-shift, anaglyph, floor reflection): perspective and occlusion come
free; `studio({floor: 'shadow'})` gives contact shadows; `fog` gives atmospheric perspective; a `truck` past near and
far objects gives parallax; `floor: 'grid'` or a textured floor shows the texture gradient; `floor: 'mirror'` the
reflection; `dof` and `mode: 'tilt'` blur. Anaglyph is not built in (render two rigs and tint them in 2D if needed).

**Three-dimensional motion** (floating idle, card flip, three-axis rotation, turntable, orbital motion, throw into
depth, pop out, spring wobble, squash & stretch, look-at, gimbal, hinge, rolling cube, follow-through, banking):
`G3.motion.float turntable flip spring wobble squash cubeRoll followThrough arc hinge`; `G3.pivot` for hinges and
gimbals (nest pivots); `obj.lookAt(x, y, z)` for look-at; banking: `G3.pathAt(points, u)` for position and a roll
proportional to the turn (difference of headings).

**Arrays and swarms** (grid wave, helix, Fibonacci sphere, infinite tunnel, carousel, swarm, depth stagger,
starfield, radial burst, stack tower, depth timeline, kaleidoscope, cover flow): `G3.arrange.grid gridWave helix sphere
tunnel carousel coverFlow stack delay burst kaleido`, usually driving `G3.instanced` or cards; swarms and starfields
with `G3.points` and a `bake`.

**Deformation** (twist, bend, wave surface, breathing, morph, flag, page curl, ...): `G3.deform.twist bend wave
breathe flag curl`, `G3.geo.morphPair()` + `G3.deform.morph(mesh, k)`, or `G3.deform(mesh, fn)` for your own.
Give the mesh enough segments (a bent bar needs 40-60 along its length).

**Spatial transitions** (shatter, flip-board, cube, zoom through, panel travel, accordion fold, view switch, depth
push, portal, Droste zoom, match cut): compositor transitions `cube flip flipBoard fold depthPush shatter` (any two
scenes, see `engine-api.md` section 7); `zoomInto`, `portalFlash` and `match` already exist; panel travel and view
switch are camera moves inside one stage (`rig.blend(a, b, k)`).

**Light and shadow** (orbiting key, rim light, sun sweep, follow spotlight, ambient occlusion, silhouette reveal,
projection mapping, shadow play, caustics, point lights, image-based light, light size, bounce light): animate
`st.lights.key.position` (orbit, sun sweep), `studio({rim})`, `key.soft` and `key.size` (hard vs soft), add
`new G3.THREE.SpotLight(...)` or `PointLight` to `s.scene` for follow spots and practicals; `studio({env})` is the
image-based light; contact darkening comes from soft shadows. Silhouette reveal: start with `key.intensity` 0 and the
rim only. Caustics and true global illumination are not simulated.

**Material** (glass refraction, chrome, iridescence, wireframe to solid, emissive pulse, matte to mirror, clear parts,
toon vs PBR, PBR parameters, subsurface, anisotropy, Fresnel, dispersion, absorption, clearcoat, bevel, normal and
bump): `mat('glass' | 'crystal' (dispersion) | 'chrome' | 'iridescent' | 'clearcoat' | 'brushed' (anisotropy) |
'wax' (subsurface look) | 'toon' | 'xray' (Fresnel) | 'neon' | 'wire')`; animate `roughness`, `metalness`,
`emissiveIntensity`, `opacity` per frame; glass absorption with `{tint, absorb}`; bevels on `geo.box(..., radius)`,
`slab` and extruded text.

**Particles and volume** (radial burst, dust in a light beam, sparks with trails, confetti, data stream, smoke):
`G3.points` for dust, sparks and smoke puffs (soft, additive on dark scenes), `G3.instanced` for confetti; motion from
`G3.bake` (gravity, drag, bounce) or closed forms. For dense glowing clouds and particle logos `GL.drawCloud` is
cheaper and already tuned.

**Physics** (domino chain, Newton's cradle, stack collapse, bounce, magnet snap, hanging sign, cloth drape,
suction): closed forms `G3.sim.bounce domino pendulum oscillator ballistic` cover most; anything else is a
`G3.bake` with your own step function (no physics engine; keep bodies few and stepping simple).

**Product presentation** (hero light sweep, unbox lift, macro detail pass, feature callouts, colour variant swap,
X-ray scan, unveil, scale comparison, side by side): key-light orbit on a clearcoat or metal body, `motion.hinge` for
the lid, `dof` for the macro pass, `st.project` + `callout()` for leader lines, per-frame `material.color.lerpColors`
for variants, `mat('xray')` over a solid for the scan, two stages or two objects for comparisons.

**Logo and title** (extrude reveal, letter fly-in, light-sweep title, neon boot-up, split-flap, fly-through to title,
CRT power-on, particles to logo, logo from shadow): `G3.geo.text(..., {letters: true})` and `G3.geo.svg` for the
mark, letters posed with staggered springs, a key light sweeping across the bevels, `mat('neon')` with flickering
`emissiveIntensity`, `flipBoard` for split-flap, `GL.textPoints` for particles to logo.

**Screen effects** (bloom pulse, chromatic hit, CRT, glitch cut, exposure flash, colour grade, halftone, VHS, motion
blur, flare, vignette, distortion): compositor `env.fx` and transitions (`glitch`, `flash`, `impact`), `style.post`,
and reel.config `motionBlur`; they apply to 3D and 2D alike.

**Structure** (exploded view, assemble, unfolding cube, slice and section, voxel build, stack to fan):
`G3.explode(parts, k)` (k from 1 to 0 assembles), pivots for unfolding faces, `material.clippingPlanes` with
`renderer().localClippingEnabled = true` for sections, `G3.instanced` voxels with `arrange.delay` for build-up.

**2.5D and web** (tilt on hover, layered card, scroll camera, isometric, billboard, perspective strength, CSS cube,
depth-map photo): layered cards are `G3.card`s at different z; isometric is a rig with `ortho: <half height>`;
billboards are `G3.label(..., {billboard: true})`; perspective strength is the FOV (`rig.lens`).

**Physical UI, sound, data** (cassette insert, dial, toggle, push button, 3D equaliser, waveform terrain, cut on the
beat, extruded bars, rising map, 3D pie, network graph): pivots and springs for controls landing on cues; bars and
terrain from `G3.instanced` / `deform.wave` driven by `env.beat` and `beatPulse(env)`; network graphs read better as
`GL.edges` + clouds.

**CG basics, destruction, impact, animation principles** (local vs world, quaternions, linear workflow, tone mapping,
passes, premultiplied alpha, sampling; disintegration, debris, lifetime fade, vacuum pickup, terrain deformation,
fields, curl noise, instancing; hit stop, knockback, shockwave, ragdoll, fracture; timing and spacing, anticipation,
easing, overshoot, bounce, spring parameters, seamless loops): groups and `G3.pivot` for parenting, `obj.quaternion`
for gimbal-free turns, tone mapping per stage, `G3.bake` for debris and pickups, `timeRemap` for hit stop,
`motion.spring({k, c, m})` and `sim.oscillator` for spring parameters, `motion.hinge` for anticipation and overshoot,
and loops by making every motion periodic in the scene length.

## 6. Recipes (tested in a seven-scene test reel and the `solid-3d` example)

```js
// logo letters fly in from depth with a staggered spring, the camera arcs in, focus pulls to the word
const st = G3.stage('logo', s => {
  s.studio({ floor: 'shadow', rim: { color: 'accent2', intensity: 1.6 } });
  const w = G3.geo.text('모노블록', { size: 1.1, depth: 0.3, bevel: 0.025, letters: true });
  const m = G3.mat('clearcoat', { color: 'accent' });
  w.letters.forEach((l, i) => s.add(G3.mesh(l.geometry, m), { name: 'L' + i, pos: [l.offset[0], l.offset[1] + 0.7, l.offset[2]] }));
});
for (let i = 0; st.get('L' + i); i++) {
  const e = G3.Ease3.outBack(clamp((lt - 0.1 * i) / 0.9), 1.3);
  G3.pose(st.get('L' + i), { pos: [0, (1 - e) * 2.2, (1 - e) * 4], rot: [(1 - e) * -1.4, 0, 0] });
}
st.render(ctx, G3.rig.arc({ target: [0, 0.7, 0], p: Ease.ioC(rm(lt, 0, 3)) }), { dof: { focus: lerp(9, 6.2, Ease.ioC(rm(lt, 1.6, 2.6))), maxBlur: 10 } });

// dolly zoom on the decisive beat, shaken on two cues
let r = G3.rig.dollyZoom({ target: [0, 1.1, 0], d0: 3.2, d1: 13, fov0: 62, p: Ease.ioC(rm(lt, 0, 1.9)) });
r = G3.rig.shake(r, lt, env.cues.filter(c => c.sfx.startsWith('impact')).map(c => c.lt), { amp: 0.12 });

// exploded view with leader lines on projected points
G3.explode(st.get('parts').children, Ease.ioC(rm(lt, 0.4, 1.4)), { dist: 0.6, stagger: 0.03 });
st.render(ctx, rig);
const [x, y, , vis] = st.project([0, 0.3, 0], st.get('driver'));
if (vis) callout(ctx, x, y, rm(lt, 1.2, 2), { label: '40 mm driver', dx: 1, t });

// a live 2D canvas as the product's screen
if (!screen) screen = makeBuf(540, 1100);
drawScreen(screen.g, t);                                    // your 2D UI, every frame
// in build: grp.add(G3.card(screen.c, { w: 1.18, radius: 0.12, dynamic: true, mat: 'basic', pos: [0, 0, d / 2 + bevel + 0.002] }));
```

## 7. Pitfalls and costs

- A `slab` of depth `d` and bevel `b` has its front face at `z = d / 2 + b`: put screens and labels just in front of
  it, or they hide inside the bevel.
- Glass, crystal and transmission need something behind them to bend; on an empty background they read as white.
  Put coloured objects or type behind glass.
- `G3.geo.text` traces a raster outline (any font the page has loaded, Hangul included) and is cached; build it in
  the stage builder, not per frame. Lower `bevel` for thin strokes; raise `px` (default 220) for very large titles.
- Deform only geometry with enough segments, and never set deformed meshes' positions by hand.
- Cost: a lit stage with soft shadows renders at 1080p in a few milliseconds on a GPU; DOF adds a depth pass and a
  64-tap blur; a mirror floor renders the scene twice. A seven-scene test reel (every 3D transition) rendered 1,575
  frames at about 29 fps in parallel on an Apple laptop. Headless without a GPU (SwiftShader) is several times slower.
- No WebGL2: `G3.ok` is false, stages draw nothing and warn once, 3D transitions fall back to `push`/`dissolve`.
  Plan a 2D fallback only if the reel must play on such machines.
- Whole-frame FX from a 3D scene (`env.fx.bloom` on a glowing stage) must ramp in from the scene's own `lt`: the
  compositor already draws the scene during the previous transition window.
- The vendored three.js adds about 790 KB to a 3D reel's single-file HTML (it is skipped for reels without 3D).

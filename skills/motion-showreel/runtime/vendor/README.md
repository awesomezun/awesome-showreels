# Vendored runtime libraries

`three.min.js` is [three.js](https://threejs.org) 0.186.1 (MIT, `three.LICENSE`) with the addons `g3.js` uses
(RoundedBoxGeometry, RoomEnvironment, SVGLoader, Reflector, BufferGeometryUtils), bundled into one classic script
that sets `window.THREE` (addons on `THREE.addons`). Reels load it only when a project uses `G3` or `THREE`, or a 3D
transition (`stills.mjs` `uses3D`), so reels without 3D stay as small as before.

Rebuild (outside the repo; any clean folder):

```bash
npm init -y && npm install three@0.186.1 esbuild@0.28.2
cp "$S/runtime/vendor/three-entry.js" entry.js
npx esbuild entry.js --bundle --minify --format=iife --target=es2020 --legal-comments=none --outfile=three.min.js
# prepend the one-line licence header from the current vendor/three.min.js, then replace the file
```

Upgrading three.js: check `g3.js` against the release notes (shadow map types, tone mapping constants,
`MeshPhysicalMaterial` properties, `Reflector` and `RoomEnvironment` constructors), then run the 3D smoke test
(`node --test tests/g3.test.mjs` from the repo root) and look at the example stills.

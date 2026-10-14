# Nattapart's interactive badge

The photo in `front.png` is a deterministic crop of the original
`assets/Profile/IMG_9526.JPG`, using pixel rectangle `(195, 215, 323, 350)`.
`portrait-original-crop.png` preserves those original pixels without resizing.
The print uses a mild deterministic unsharp mask before resizing. No generated
portrait pixels, facial reconstruction or changes to facial geometry are used.
The available source is 600 x 900; the original crop is only 128 x 135 pixels.
Higher-resolution rendering cannot recover details absent from that source.

The approved Stitch image is a visual reference for the holder, clip and copper
lanyard. Its generated portrait is not used as a model texture.

Geometry source: `src/badge/model.ts`.
Simulation: `src/badge/scene.ts`, Three.js and a fixed-length damped pendulum.
Only rotation about the suspension point is simulated. The fixed radius is
4.38 world units; gravity is 9.81 and angular damping is 0.62. Vertical dragging
cannot stretch or compress the strap. No spring or elastic rope is used.
Print texture script: `scripts/build-badge-textures.py` (Pillow).
Browser bundle: `npm run build:badge`.
Strict types: `npm run check:badge`.
Preview: `badge-physics-preview.html`, served over HTTP.

The preview exports a GLB of the visible holder, card, metal parts and lanyard,
with front and back artwork embedded. GLB contains geometry and materials;
the pendulum motion, pointer dragging and gravity are implemented by the browser
simulation, rather than the GLB file itself.

Libraries are bundled locally with their license notices. The scene loads
only near the viewport and pauses simulation offscreen. Reduced-motion users
start with the physics paused and can explicitly start it with a control.

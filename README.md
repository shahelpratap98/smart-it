# Smart IT — 3D Landing Page

Landing page for **Smart IT**, an AI automation & web development firm.
A single self-contained `index.html` — no build step, no dependencies to install.

## The scroll journey

A fixed WebGL canvas (Three.js r128) sits behind the content. As you scroll,
a GSAP ScrollTrigger timeline (`scrub: 1`) flies the camera through five zones
in deep space:

1. **Hero** — wireframe icosahedron "AI core" with orbiting rings
2. **AI Automation** — chrome torus knot with orbiting spheres
3. **Web Development** — instanced cube grid rippling like a waveform
4. **Process** — spinning gyroscope rings
5. **Finale** — a glowing portal that frames the call-to-action

## Performance & accessibility

- Device pixel ratio capped at 2; particle count halved on mobile
- Single renderer, shared geometries/materials, `InstancedMesh` for the cube grid
- Render loop pauses when the tab is hidden
- `prefers-reduced-motion` respected (live listener) — auto-rotation and
  entrance animations disabled
- Canvas has `role="img"` + descriptive `aria-label`; skip link, semantic
  headings, 44px+ touch targets, WCAG-checked color pairs

## Run locally

Open `index.html` directly, or serve it:

```
npx serve .
```

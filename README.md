# Smart IT — 3D Landing Page (React)

Landing page for **Smart IT**, an AI automation & web development firm.
React + Vite + Three.js (react-three-fiber). A little jetpack robot flies
through deep space as you scroll, leading the camera through the story.

## The scroll journey

A fixed `<Canvas>` sits behind the content. Scroll progress (damped) drives
both the robot and the camera along a Catmull-Rom flight path through five zones:

1. **Hero** — the robot hovers facing you; scroll and it turns and flies off
2. **AI Automation** — chrome torus knot with orbiting spheres
3. **Web Development** — instanced cube grid rippling like a waveform
4. **Process** — spinning gyroscope rings
5. **Finale** — a glowing portal that frames the call-to-action

The robot is built entirely from primitives (no model downloads): glowing
visor eyes, chest core, antenna, and twin jetpack thrusters with flickering
additive flames. It banks into turns and bobs while idling.

## Stack

- React 18 + Vite 5
- three ^0.169 + @react-three/fiber ^8
- No animation library — scroll damping via `THREE.MathUtils.damp`,
  DOM reveals via IntersectionObserver + CSS transitions

## Performance & accessibility

- DPR capped at 2, instanced cubes, shared materials, star count halved on mobile
- `prefers-reduced-motion` respected live (robot idles, no auto-rotation)
- Scene container has `role="img"` + descriptive label; skip link, semantic
  headings, 44px+ touch targets, WCAG-checked color pairs

## Develop

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Robot from './Robot.jsx';
import { Knot, CubeWave, Gyro, Portal, Stars } from './Zones.jsx';
import { curve, journeyState, ROBOT_LEAD, CAM_END, ROBOT_END, isSmall } from './journey.js';
import { useReducedMotionRef } from './useReducedMotion.js';

const _camPos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _right = new THREE.Vector3();
const _robotPos = new THREE.Vector3();
const _look = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

function CameraRig() {
  const { camera } = useThree();
  const noMotion = useReducedMotionRef();
  const pointerFine = useRef(
    window.matchMedia('(pointer: fine)').matches
  );
  const mouse = useRef({ x: 0, y: 0 });
  const scrollMax = useRef(1);

  useEffect(() => {
    const measure = () => {
      scrollMax.current = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
    };
    measure();
    const t = setTimeout(measure, 800); // re-measure after fonts settle
    window.addEventListener('resize', measure);
    const onMove = e => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (pointerFine.current) window.addEventListener('pointermove', onMove);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  useFrame((state, delta) => {
    const target = Math.min(window.scrollY / scrollMax.current, 1);
    journeyState.t = THREE.MathUtils.damp(journeyState.t, target, 3, delta);
    const t = journeyState.t;

    const camT = Math.min(t, CAM_END);
    curve.getPointAt(camT, _camPos);
    curve.getTangentAt(camT, _tangent);
    curve.getPointAt(Math.min(t + ROBOT_LEAD, ROBOT_END), _robotPos);

    _right.crossVectors(_tangent, UP).normalize();

    // Shift the camera off-axis so the robot rides beside the text column,
    // easing back to center for the finale so the portal frames the CTA.
    const endFade = 1 - THREE.MathUtils.smoothstep(t, 0.78, CAM_END);
    const lateral = (isSmall ? -0.55 : -1.6) * endFade;
    _camPos.addScaledVector(_right, lateral).addScaledVector(UP, 0.75 * endFade);

    // Gentle pointer parallax on fine pointers.
    if (pointerFine.current && !noMotion.current) {
      _camPos.addScaledVector(_right, mouse.current.x * 0.45);
      _camPos.y += mouse.current.y * 0.3;
    }

    camera.position.copy(_camPos);

    _look.copy(_robotPos).addScaledVector(_tangent, 2);
    if (isSmall) {
      // aim low-left → robot rides the upper right, clear of the headline
      _look.y -= 1.6 * endFade;
      _look.addScaledVector(_right, -0.5 * endFade);
    } else {
      _look.addScaledVector(_right, -0.9 * endFade); // robot rides right of the text
    }
    camera.lookAt(_look);
  });
  return null;
}

export default function SceneCanvas() {
  return (
    <div className="scene" role="img"
      aria-label="Decorative 3D journey: a small robot with a jetpack flies through deep space, past machines and glowing structures, as you scroll.">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: isSmall ? 82 : 68, near: 0.1, far: 200, position: [3, 1, 9] }}
      >
        <fogExp2 attach="fog" args={[0x050510, 0.016]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 10, 8]} intensity={0.85} />
        {/* decay=1: match the soft falloff of the legacy-lights static version */}
        <pointLight color={0x7c3aed} position={[0, 3, 3]} intensity={8} decay={1} distance={34} />
        <pointLight color={0x22d3ee} position={[3, 2, -29]} intensity={7} decay={1} distance={34} />
        <pointLight color={0x7c3aed} position={[-3, 3, -61]} intensity={7} decay={1} distance={34} />
        <pointLight color={0x22d3ee} position={[2, -2, -93]} intensity={7} decay={1} distance={34} />
        <Stars />
        <Knot />
        <CubeWave />
        <Gyro />
        <Portal />
        <Robot />
        <CameraRig />
      </Canvas>
    </div>
  );
}

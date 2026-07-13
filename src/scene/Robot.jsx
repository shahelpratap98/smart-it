import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { curve, journeyState, ROBOT_LEAD } from './journey.js';
import { useReducedMotionRef } from './useReducedMotion.js';

const _pos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _target = new THREE.Vector3();
const EYE_BASE = new THREE.Color(0x67e8f9);

export default function Robot() {
  const group = useRef();   // path follower (position + heading)
  const body = useRef();    // idle bob + banking, local to the follower
  const flameL = useRef();
  const flameR = useRef();
  const eyeMatRef = useRef();
  const lightRef = useRef();
  const noMotion = useReducedMotionRef();

  const mats = useMemo(() => ({
    shell:  new THREE.MeshStandardMaterial({ color: 0xd9ddf2, metalness: 0.75, roughness: 0.3 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.6, roughness: 0.3, emissive: 0x2e1065, emissiveIntensity: 0.5 }),
    dark:   new THREE.MeshStandardMaterial({ color: 0x11131f, metalness: 0.4, roughness: 0.5 }),
    glowCyan: new THREE.MeshBasicMaterial({ color: 0x67e8f9 }),
    glowPurple: new THREE.MeshBasicMaterial({ color: 0xc4b5fd }),
    flame: new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
  }), []);

  useFrame((state, delta) => {
    const t = journeyState.t;
    const robotT = Math.min(t + ROBOT_LEAD, 1);

    curve.getPointAt(robotT, _pos);
    curve.getTangentAt(robotT, _tangent);

    const g = group.current;
    g.position.copy(_pos);

    // Face the direction of travel…
    _target.copy(_pos).add(_tangent);
    g.lookAt(_target);
    // …but turn around to greet the visitor while at the top of the page.
    const face = THREE.MathUtils.clamp(1 - t / 0.025, 0, 1);
    g.rotateY(Math.PI * face);

    const el = state.clock.elapsedTime;
    const b = body.current;
    if (!noMotion.current) {
      b.position.y = Math.sin(el * 1.6) * 0.14;
      b.rotation.z = -_tangent.x * 0.55 * (1 - face); // bank into turns
      b.rotation.x = Math.sin(el * 0.9) * 0.05;

      const flicker = 0.75 + Math.sin(el * 31) * 0.18 + Math.sin(el * 53) * 0.07;
      flameL.current.scale.set(1, flicker, 1);
      flameR.current.scale.set(1, 1.9 - flicker, 1);
      lightRef.current.intensity = 2.2 + flicker * 1.6;
      eyeMatRef.current.color.copy(EYE_BASE).multiplyScalar(0.75 + Math.sin(el * 2.4) * 0.25);
    }
  });

  return (
    <group ref={group}>
      <group ref={body} scale={0.55}>
        {/* head */}
        <group position={[0, 1.18, 0]}>
          <mesh material={mats.shell}>
            <boxGeometry args={[0.88, 0.72, 0.78]} />
          </mesh>
          {/* visor */}
          <mesh position={[0, 0.02, 0.4]} material={mats.dark}>
            <boxGeometry args={[0.62, 0.32, 0.06]} />
          </mesh>
          {/* eyes */}
          <mesh position={[-0.14, 0.02, 0.45]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial ref={eyeMatRef} color={0x67e8f9} />
          </mesh>
          <mesh position={[0.14, 0.02, 0.45]} material={mats.glowCyan}>
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
          {/* ears */}
          <mesh position={[-0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
          </mesh>
          <mesh position={[0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.accent}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
          </mesh>
          {/* antenna */}
          <mesh position={[0, 0.5, 0]} material={mats.shell}>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
          </mesh>
          <mesh position={[0, 0.68, 0]} material={mats.glowPurple}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>

        {/* torso */}
        <mesh position={[0, 0.25, 0]} material={mats.shell}>
          <cylinderGeometry args={[0.42, 0.52, 0.95, 18]} />
        </mesh>
        {/* chest core */}
        <mesh position={[0, 0.32, 0.42]} material={mats.glowCyan}>
          <sphereGeometry args={[0.13, 16, 16]} />
        </mesh>
        <mesh position={[0, 0.32, 0.4]} material={mats.accent}>
          <torusGeometry args={[0.2, 0.045, 10, 28]} />
        </mesh>
        {/* pelvis */}
        <mesh position={[0, -0.42, 0]} material={mats.accent}>
          <sphereGeometry args={[0.34, 16, 16]} />
        </mesh>

        {/* arms — trailing flight pose */}
        {[-1, 1].map(s => (
          <group key={`arm${s}`} position={[s * 0.58, 0.5, -0.05]} rotation={[0.85, 0, s * -0.25]}>
            <mesh position={[0, -0.3, 0]} material={mats.shell}>
              <cylinderGeometry args={[0.09, 0.08, 0.58, 10]} />
            </mesh>
            <mesh position={[0, -0.64, 0]} material={mats.accent}>
              <sphereGeometry args={[0.115, 12, 12]} />
            </mesh>
          </group>
        ))}

        {/* legs — trailing */}
        {[-1, 1].map(s => (
          <group key={`leg${s}`} position={[s * 0.2, -0.68, -0.08]} rotation={[0.55, 0, 0]}>
            <mesh position={[0, -0.32, 0]} material={mats.shell}>
              <cylinderGeometry args={[0.12, 0.09, 0.6, 10]} />
            </mesh>
            <mesh position={[0, -0.66, 0.03]} material={mats.dark}>
              <boxGeometry args={[0.2, 0.12, 0.3]} />
            </mesh>
          </group>
        ))}

        {/* jetpack */}
        <group position={[0, 0.35, -0.48]}>
          {[-1, 1].map(s => (
            <group key={`jet${s}`} position={[s * 0.19, 0, 0]}>
              <mesh material={mats.accent}>
                <cylinderGeometry args={[0.13, 0.15, 0.52, 12]} />
              </mesh>
              <mesh position={[0, -0.32, 0]} material={mats.dark}>
                <cylinderGeometry args={[0.09, 0.13, 0.14, 12]} />
              </mesh>
            </group>
          ))}
          {/* flames */}
          <mesh ref={flameL} position={[-0.19, -0.62, 0]} rotation={[Math.PI, 0, 0]} material={mats.flame}>
            <coneGeometry args={[0.09, 0.5, 10]} />
          </mesh>
          <mesh ref={flameR} position={[0.19, -0.62, 0]} rotation={[Math.PI, 0, 0]} material={mats.flame}>
            <coneGeometry args={[0.09, 0.5, 10]} />
          </mesh>
          <pointLight ref={lightRef} position={[0, -0.7, 0]} color={0x22d3ee} intensity={3} decay={1} distance={7} />
        </group>
      </group>
    </group>
  );
}

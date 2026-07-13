import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZONES, journeyState, isSmall } from './journey.js';
import { useReducedMotionRef } from './useReducedMotion.js';

const metalCyan = new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.7, roughness: 0.25, emissive: 0x164e63, emissiveIntensity: 0.7 });
const metalPurple = new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.65, roughness: 0.28, emissive: 0x2e1065, emissiveIntensity: 0.4 });
const cyanWire = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.5 });
const glow = new THREE.MeshBasicMaterial({ color: 0xc4b5fd });

/* ---------- Zone 2: automation knot ---------- */
export function Knot() {
  const knot = useRef();
  const orbs = useRef([]);
  const noMotion = useReducedMotionRef();
  useFrame((state, delta) => {
    if (noMotion.current) return;
    knot.current.rotation.y += delta * 0.32;
    knot.current.rotation.x += delta * 0.12;
    orbs.current.forEach((orb, i) => {
      if (!orb) return;
      const a = state.clock.elapsedTime * 0.55 + (i / 5) * Math.PI * 2;
      const r = 3.1 + (i % 2) * 0.5;
      orb.position.set(Math.cos(a) * r, Math.sin(a * 1.4) * 1.1, Math.sin(a) * r);
    });
  });
  return (
    <group position={ZONES.knot}>
      <mesh ref={knot} material={metalCyan}>
        <torusKnotGeometry args={[1.7, 0.45, 140, 24]} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} ref={el => (orbs.current[i] = el)} material={glow}>
          <sphereGeometry args={[0.16, 12, 12]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Zone 3: instanced cube wave ---------- */
const GRID = isSmall ? 10 : 14;
const CUBES = GRID * GRID;
const dummy = new THREE.Object3D();

export function CubeWave() {
  const mesh = useRef();
  const frame = useRef();
  const noMotion = useReducedMotionRef();

  const layout = (m, t) => {
    let i = 0;
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        const px = (x - GRID / 2) * 1.05;
        const pz = (z - GRID / 2) * 1.05;
        dummy.position.set(px, Math.sin(px * 0.7 + t) * Math.cos(pz * 0.7 + t * 0.8) * 0.55, pz);
        dummy.rotation.set(0, t * 0.1, 0);
        dummy.updateMatrix();
        m.setMatrixAt(i++, dummy.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => { layout(mesh.current, 0); }, []);
  useFrame((state, delta) => {
    if (noMotion.current) return;
    layout(mesh.current, state.clock.elapsedTime * 1.4);
    frame.current.rotation.y += delta * 0.25;
    frame.current.rotation.z += delta * 0.1;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, CUBES]} position={ZONES.grid} material={metalPurple}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
      </instancedMesh>
      <mesh ref={frame} position={ZONES.gridFrame} material={cyanWire}>
        <icosahedronGeometry args={[2, 0]} />
      </mesh>
    </>
  );
}

/* ---------- Zone 4: gyroscope ---------- */
export function Gyro() {
  const a = useRef(); const b = useRef(); const c = useRef(); const core = useRef();
  const noMotion = useReducedMotionRef();
  useFrame((state, delta) => {
    if (noMotion.current) return;
    a.current.rotation.x += delta * 0.5;
    b.current.rotation.y += delta * 0.65;
    c.current.rotation.x -= delta * 0.45;
    c.current.rotation.y += delta * 0.3;
    core.current.rotation.y += delta * 0.8;
  });
  return (
    <group position={ZONES.gyro}>
      <mesh ref={a} material={metalCyan}><torusGeometry args={[2.6, 0.05, 12, 80]} /></mesh>
      <mesh ref={b} material={metalPurple}><torusGeometry args={[2.0, 0.05, 12, 80]} /></mesh>
      <mesh ref={c} material={metalCyan}><torusGeometry args={[1.4, 0.05, 12, 80]} /></mesh>
      <mesh ref={core} material={glow}><octahedronGeometry args={[0.65, 0]} /></mesh>
    </group>
  );
}

/* ---------- Zone 5: the portal ---------- */
export function Portal() {
  const ring = useRef(); const ring2 = useRef(); const core = useRef();
  const coreMat = useRef();
  const light = useRef();
  const noMotion = useReducedMotionRef();
  useFrame((state, delta) => {
    // Core fades as the robot flies through, so it never washes out the CTA.
    const targetOpacity = journeyState.t > 0.82 ? 0.06 : 0.9;
    coreMat.current.opacity = THREE.MathUtils.damp(coreMat.current.opacity, targetOpacity, 3, delta);
    if (noMotion.current) return;
    const el = state.clock.elapsedTime;
    ring.current.rotation.z += delta * 0.18;
    ring2.current.rotation.z -= delta * 0.4;
    core.current.scale.setScalar(1 + Math.sin(el * 1.6) * 0.08);
    light.current.intensity = 9 + Math.sin(el * 2.5) * 2;
  });
  return (
    <group position={ZONES.portal}>
      <mesh ref={ring} material={metalPurple}><torusGeometry args={[3.4, 0.16, 20, 100]} /></mesh>
      <mesh ref={ring2} material={cyanWire}><torusGeometry args={[2.6, 0.05, 12, 90]} /></mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial ref={coreMat} color={0xa78bfa} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={light} color={0xa78bfa} intensity={9} decay={1} distance={34} />
    </group>
  );
}

/* ---------- star fields ---------- */
export function Stars() {
  const noMotion = useReducedMotionRef();
  const p1 = useRef(); const p2 = useRef();
  const geo = useMemo(() => {
    const count = isSmall ? 1200 : 2600;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 56;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 2] = 20 - Math.random() * 170;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((state, delta) => {
    if (noMotion.current) return;
    p1.current.rotation.y += delta * 0.008;
    p2.current.rotation.y -= delta * 0.005;
  });
  return (
    <>
      <points ref={p1} geometry={geo}>
        <pointsMaterial color={0x9d8df1} size={0.07} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <points ref={p2} geometry={geo} rotation={[0, 0, 0.6]}>
        <pointsMaterial color={0x22d3ee} size={0.045} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  );
}

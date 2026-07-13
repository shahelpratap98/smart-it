import * as THREE from 'three';

// The flight path the robot travels as the page scrolls (hero → portal).
export const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3.0, 0.4, 4),
  new THREE.Vector3(2.0, 0.8, -12),
  new THREE.Vector3(-1.5, 0.2, -28),
  new THREE.Vector3(-2.5, -0.4, -44),
  new THREE.Vector3(0.5, 1.2, -62),
  new THREE.Vector3(2.2, 1.0, -78),
  new THREE.Vector3(0.5, 0.6, -94),
  new THREE.Vector3(-1.0, 0.2, -110),
  new THREE.Vector3(0, 0, -122),
  new THREE.Vector3(0, 0, -136),
], false, 'catmullrom', 0.5);

export const ZONES = {
  knot:   new THREE.Vector3(1.8, 0.6, -33),
  grid:   new THREE.Vector3(0, -6, -64),
  gridFrame: new THREE.Vector3(0, 0.8, -64),
  gyro:   new THREE.Vector3(3, 0.8, -97),
  portal: new THREE.Vector3(0, 0, -128),
};

export const isSmall = typeof window !== 'undefined'
  && window.matchMedia('(max-width: 760px)').matches;

if (isSmall) {
  ZONES.knot.x = 1.2;
  ZONES.gyro.x = 2;
}

// How far ahead of the camera the robot flies (as curve progress).
export const ROBOT_LEAD = 0.032;

// Shared per-frame journey state (written by CameraRig, read by everyone).
export const journeyState = { t: 0 };

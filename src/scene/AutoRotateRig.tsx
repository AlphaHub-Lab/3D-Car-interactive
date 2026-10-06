import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useCalloutStore, STAGE_POSITIONS } from '../store/useCalloutStore';

interface AutoRotateRigProps {
  carGroupRef: React.RefObject<THREE.Group>;
}

// 7 Cinematic Camera Stages along the scroll journey
interface StageKeyframe {
  progress: number;
  camPos: [number, number, number];
  target: [number, number, number];
  rotY: number;
}

const STAGES: StageKeyframe[] = [
  // 0: Hero Opening (Front 3/4 aggressive low stance, car occupies ~80-85% of screen)
  {
    progress: STAGE_POSITIONS.hero,
    camPos: [2.9, 0.85, 3.2],
    target: [0.0, 0.22, 0.2],
    rotY: 0.08,
  },
  // 1: Aerodynamic Front Wing (Close zoom on nose & cascade flaps)
  {
    progress: STAGE_POSITIONS.wing,
    camPos: [1.4, 0.45, 2.6],
    target: [0.0, 0.22, 1.85],
    rotY: 0.22,
  },
  // 2: Push-Rod Suspension & Pirelli Assembly
  {
    progress: STAGE_POSITIONS.susp,
    camPos: [2.1, 0.62, 1.45],
    target: [0.55, 0.38, 0.85],
    rotY: 0.58,
  },
  // 3: Titanium Halo & Cockpit Cell (Look-down into driver cell)
  {
    progress: STAGE_POSITIONS.cockpit,
    camPos: [0.35, 1.45, 0.8],
    target: [0.0, 0.48, 0.1],
    rotY: 1.25,
  },
  // 4: Rear Wing & DRS Hydraulic Actuator
  {
    progress: STAGE_POSITIONS.drs,
    camPos: [1.8, 1.35, 3.2],
    target: [0.65, 0.96, 1.93],
    rotY: 2.80,
  },
  // 5: Ground Effect Diffuser & Underfloor Strakes
  {
    progress: STAGE_POSITIONS.diff,
    camPos: [1.2, 0.42, 3.0],
    target: [0.18, 0.18, 1.85],
    rotY: 3.30,
  },
  // 6: Final Full-Car Dramatic Studio Reveal (Full wide composition)
  {
    progress: STAGE_POSITIONS.reveal,
    camPos: [3.3, 0.95, 3.2],
    target: [0.0, 0.25, 0.1],
    rotY: Math.PI * 2 + 0.08,
  },
];

// Helper to interpolate between stages with smoothstep
const sampleStage = (progress: number) => {
  const p = Math.max(0, Math.min(1, progress));

  // If at or past the final keyframe, return final stage
  if (p >= STAGES[STAGES.length - 1].progress) {
    const last = STAGES[STAGES.length - 1];
    return { pos: last.camPos, target: last.target, rotY: last.rotY };
  }

  // Find bounding keyframes
  let idx = 0;
  for (let i = 0; i < STAGES.length - 1; i++) {
    if (p >= STAGES[i].progress && p <= STAGES[i + 1].progress) {
      idx = i;
      break;
    }
  }

  const k1 = STAGES[idx];
  const k2 = STAGES[Math.min(idx + 1, STAGES.length - 1)];

  const segRange = k2.progress - k1.progress;
  const rawT = segRange > 0 ? Math.max(0, Math.min(1, (p - k1.progress) / segRange)) : 0;
  // Smoothstep easing for cinematic continuity
  const t = rawT * rawT * (3 - 2 * rawT);

  const pos = [
    THREE.MathUtils.lerp(k1.camPos[0], k2.camPos[0], t),
    THREE.MathUtils.lerp(k1.camPos[1], k2.camPos[1], t),
    THREE.MathUtils.lerp(k1.camPos[2], k2.camPos[2], t),
  ] as [number, number, number];

  const target = [
    THREE.MathUtils.lerp(k1.target[0], k2.target[0], t),
    THREE.MathUtils.lerp(k1.target[1], k2.target[1], t),
    THREE.MathUtils.lerp(k1.target[2], k2.target[2], t),
  ] as [number, number, number];

  const rotY = THREE.MathUtils.lerp(k1.rotY, k2.rotY, t);

  return { pos, target, rotY };
};

export const AutoRotateRig: React.FC<AutoRotateRigProps> = ({ carGroupRef }) => {
  const {
    targetScrollProgress,
    setScrollProgress,
    activeCallout,
    calloutVisible,
    setCalloutScreenPos,
    isAutoCruising,
  } = useCalloutStore();

  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const smoothedProgressRef = useRef(0);
  const isUserDraggingRef = useRef(false);
  const tempVec = useRef(new THREE.Vector3());

  // Handle optional auto-cruise
  useEffect(() => {
    // initialize camera position to hero
    const init = sampleStage(0);
    camera.position.set(...init.pos);
    if (controlsRef.current) {
      controlsRef.current.target.set(...init.target);
    }
  }, [camera]);

  useFrame((_state, delta) => {
    // 1. Auto-cruising continuous scroll if enabled
    if (isAutoCruising && !isUserDraggingRef.current) {
      window.scrollBy(0, delta * 350);
    }

    // 2. Continuous spring damping toward target scroll progress
    smoothedProgressRef.current = THREE.MathUtils.damp(
      smoothedProgressRef.current,
      targetScrollProgress,
      12,
      delta
    );

    const currentP = smoothedProgressRef.current;
    setScrollProgress(currentP);

    // 3. Sample cinematic stage at current smoothed progress
    const { pos, target, rotY } = sampleStage(currentP);

    // If user is not manually orbiting with mouse, smoothly track cinematic camera
    if (!isUserDraggingRef.current) {
      camera.position.set(pos[0], pos[1], pos[2]);

      if (controlsRef.current) {
        controlsRef.current.target.set(target[0], target[1], target[2]);
        controlsRef.current.update();
      }
    }

    // 4. Update car rotation continuously from scroll progress
    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = rotY;

      // Scale down car group at 100% scroll to reveal the "FOR MORE EXPLORE OUR OTHER MODELS" heading
      const endScale = currentP > 0.90
        ? THREE.MathUtils.lerp(1.0, 0.72, (currentP - 0.90) / 0.10)
        : 1.0;
      const endPosY = currentP > 0.90
        ? THREE.MathUtils.lerp(0.0, -0.22, (currentP - 0.90) / 0.10)
        : 0.0;
      carGroupRef.current.scale.setScalar(endScale);
      carGroupRef.current.position.y = endPosY;

      // 5. Project 3D anchor to 2D screen space for leader lines
      if (activeCallout && activeCallout.anchor3D && calloutVisible) {
        tempVec.current.set(...activeCallout.anchor3D);
        tempVec.current.applyMatrix4(carGroupRef.current.matrixWorld);
        tempVec.current.project(camera);

        const screenX = (tempVec.current.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-tempVec.current.y * 0.5 + 0.5) * window.innerHeight;
        const isVisible = tempVec.current.z < 1.0;

        setCalloutScreenPos({
          x: screenX,
          y: screenY,
          visible: isVisible,
        });
      } else {
        setCalloutScreenPos(null);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableRotate={true}
      rotateSpeed={0.5}
      minPolarAngle={Math.PI / 4.5}
      maxPolarAngle={Math.PI / 2.05}
      onStart={() => {
        isUserDraggingRef.current = true;
      }}
      onEnd={() => {
        // Resume smooth camera tracking shortly after drag
        window.setTimeout(() => {
          isUserDraggingRef.current = false;
        }, 1200);
      }}
    />
  );
};

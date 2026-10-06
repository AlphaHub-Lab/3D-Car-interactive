import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCalloutStore } from '../store/useCalloutStore';
import { CAR_MODELS, CarModelData } from '../data/modelsData';

interface CarModelProps {
  carGroupRef: React.RefObject<THREE.Group>;
  car?: CarModelData;
}

export const CarModel: React.FC<CarModelProps> = ({ carGroupRef, car }) => {
  const { activeCallout, activeCalloutId, activeCar } = useCalloutStore();
  const carToRender = car || activeCar || CAR_MODELS[0];

  const { scene } = useGLTF(carToRender.modelPath);
  const highlightedMeshesRef = useRef<Map<THREE.Mesh, { material: THREE.MeshStandardMaterial; targetIntensity: number }>>(new Map());

  // Clone scene and normalize dimensions (scale to car.scale or ~5.1 units, ground at y = 0)
  const normalizedCar = useMemo(() => {
    const cloned = scene.clone(true);

    // Apply rotation offset if model was authored with different axis convention (e.g. Hennessey Z-up)
    if (carToRender.rotationOffset) {
      cloned.rotation.set(...carToRender.rotationOffset);
      cloned.updateMatrix();
    }

    // Compute initial bounding box
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Target length ~5.1 units (occupies ~80-85% of viewport width)
    const targetLength = carToRender.scale || 5.1;
    const maxDim = Math.max(size.x, size.z);
    const scaleFactor = targetLength / (maxDim || 1);
    cloned.scale.setScalar(scaleFactor);

    // Recompute box after scaling
    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    // Align center to origin and bottom to floor (y = 0)
    cloned.position.x = -scaledCenter.x;
    cloned.position.z = -scaledCenter.z;
    cloned.position.y = -scaledBox.min.y;

    // Clone materials to allow independent emissive highlighting and realistic PBR response
    const meshMap = new Map<THREE.Mesh, { material: THREE.MeshStandardMaterial; targetIntensity: number }>();
    const tealColor = new THREE.Color('#2be7d6');

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const isTire = mesh.name.toLowerCase().includes('wheel') || mesh.name.toLowerCase().includes('tire');

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => {
            const clonedMat = mat.clone() as THREE.MeshStandardMaterial;
            if (clonedMat.isMeshStandardMaterial) {
              if (isTire) {
                clonedMat.roughness = 0.75;
                clonedMat.metalness = 0.15;
              } else {
                clonedMat.roughness = Math.max(0.2, clonedMat.roughness ?? 0.32);
                clonedMat.metalness = Math.max(0.55, clonedMat.metalness ?? 0.7);
              }
            }
            return clonedMat;
          });
        } else if (mesh.material) {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const clonedMat = originalMat.clone();
          if (clonedMat.isMeshStandardMaterial) {
            if (isTire) {
              clonedMat.roughness = 0.75;
              clonedMat.metalness = 0.15;
            } else {
              clonedMat.roughness = Math.max(0.2, clonedMat.roughness ?? 0.32);
              clonedMat.metalness = Math.max(0.55, clonedMat.metalness ?? 0.7);
            }
            clonedMat.emissive = tealColor;
            clonedMat.emissiveIntensity = 0;
            meshMap.set(mesh, { material: clonedMat, targetIntensity: 0 });
          }
          mesh.material = clonedMat;
        }
      }
    });

    highlightedMeshesRef.current = meshMap;
    return cloned;
  }, [scene, carToRender]);

  // Update emissive target intensity based on active callout
  useFrame((state, delta) => {
    const activeNames = activeCalloutId ? (activeCallout?.meshNames || []) : [];
    const pulseFactor = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 5);

    highlightedMeshesRef.current.forEach((entry, mesh) => {
      let isMatch = false;
      let curr: THREE.Object3D | null = mesh;

      while (curr && curr !== normalizedCar) {
        const currName = curr.name || '';
        if (activeNames.some((n) => currName.toLowerCase().includes(n.toLowerCase()))) {
          isMatch = true;
          break;
        }
        curr = curr.parent;
      }

      // Subtle calibrated luminous rim glow (preserves carbon fiber and decals)
      const targetIntensity = isMatch ? 0.09 * pulseFactor : 0.0;
      entry.material.emissiveIntensity = THREE.MathUtils.lerp(
        entry.material.emissiveIntensity,
        targetIntensity,
        delta * 6
      );
    });
  });

  return (
    <group ref={carGroupRef}>
      <primitive object={normalizedCar} />
    </group>
  );
};

// Preload models for ultra-snappy switching
CAR_MODELS.forEach((c) => {
  try {
    useGLTF.preload(c.modelPath);
  } catch {
    // ignore preload issues
  }
});

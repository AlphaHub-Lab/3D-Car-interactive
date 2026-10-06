import React, { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei';

interface ModelCard3DProps {
  modelPath: string;
  scale?: number;
  scaleFactor?: number;
  rotationOffset?: [number, number, number];
  autoRotateSpeed?: number;
}

const CarMesh: React.FC<{
  modelPath: string;
  targetScale: number;
  rotationOffset?: [number, number, number];
}> = ({ modelPath, targetScale, rotationOffset }) => {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  const normalized = useMemo(() => {
    const cloned = scene.clone(true);

    if (rotationOffset) {
      cloned.rotation.set(...rotationOffset);
      cloned.updateMatrix();
    }

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.z);
    const scaleFactor = targetScale / (maxDim || 1);
    cloned.scale.setScalar(scaleFactor);

    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);

    cloned.position.x = -scaledCenter.x;
    cloned.position.z = -scaledCenter.z;
    cloned.position.y = -scaledBox.min.y;

    return cloned;
  }, [scene, targetScale, rotationOffset]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={normalized} />
    </group>
  );
};

export const ModelCard3D: React.FC<ModelCard3DProps> = ({
  modelPath,
  scale = 3.6,
  scaleFactor,
  rotationOffset,
}) => {
  const activeScale = scaleFactor || scale;
  return (
    <div className="w-full h-48 sm:h-56 relative overflow-hidden rounded-xl bg-gradient-to-b from-white/90 via-[#F4F6F5]/90 to-[#E5EAE8]/90">
      <Canvas
        camera={{ position: [2.8, 1.2, 2.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.2} color="#FFFFFF" />
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-4, 3, -3]} intensity={1.4} color="#2BE7D6" />

        <Suspense fallback={null}>
          <CarMesh modelPath={modelPath} targetScale={activeScale} rotationOffset={rotationOffset} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.45}
            scale={7}
            blur={1.5}
            far={2}
            resolution={512}
            color="#111719"
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
      <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] font-mono font-bold tracking-widest text-[#5E686B]/60 uppercase">
        DRAG TO ROTATE 360°
      </div>
    </div>
  );
};

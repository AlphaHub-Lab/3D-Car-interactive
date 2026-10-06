import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { StudioEnvironment } from './StudioEnvironment';
import { CarModel } from './CarModel';
import { AutoRotateRig } from './AutoRotateRig';
import { CarModelData } from '../data/modelsData';

interface CarViewerCanvasProps {
  car?: CarModelData;
}

export const CarViewerCanvas: React.FC<CarViewerCanvasProps> = ({ car }) => {
  const carGroupRef = useRef<THREE.Group>(null);

  return (
    <div className="w-full h-full absolute inset-0 z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [2.9, 0.85, 3.2], fov: 38 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.10,
          powerPreference: 'default',
        }}
        resize={{ scroll: false, debounce: 200 }}
      >
        <Suspense fallback={null}>
          <StudioEnvironment />
          <CarModel car={car} carGroupRef={carGroupRef} />
          <AutoRotateRig carGroupRef={carGroupRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};

import React from 'react';
import { ContactShadows } from '@react-three/drei';

export const StudioEnvironment: React.FC = () => {
  return (
    <>
      {/* 1. Rich Ambient Illumination (Light pearl-white studio ambiance) */}
      <ambientLight intensity={0.9} color="#FFFFFF" />

      {/* 2. Studio Key Light (Front-Upper-Left): Neutral white automotive key spotlight */}
      <spotLight
        position={[-5, 8, 6]}
        intensity={3.6}
        angle={0.7}
        penumbra={0.85}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        color="#ffffff"
      />

      {/* 3. Studio Fill Light (Front-Right): Soft cool-white illumination */}
      <directionalLight position={[6, 4, 3]} intensity={1.8} color="#F5F8F7" />

      {/* 4. Overhead Top Light: Reveals cockpit, halo, airbox, engine cover, and top deck */}
      <spotLight
        position={[0, 9, 0]}
        intensity={2.2}
        angle={0.8}
        penumbra={0.9}
        color="#ffffff"
      />

      {/* 5. Petronas Teal Rim Spotlight (Behind-Left focused exclusively on car silhouette) */}
      <spotLight
        position={[-4, 3.5, -4]}
        intensity={2.6}
        angle={0.55}
        penumbra={1}
        color="#2be7d6"
      />

      {/* 6. Two Softbox Studio Light Strips (Cast glossy highlights along car aerodynamic contours) */}
      <group position={[0, 4.6, -3.8]}>
        {/* Left softbox strip */}
        <mesh position={[-2.8, 0, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
          <planeGeometry args={[4.5, 0.4]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* Right softbox strip */}
        <mesh position={[2.8, 0, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
          <planeGeometry args={[4.5, 0.4]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>

      {/* 7. Realistic PBR Ground Contact Shadows (Seamless studio anchoring) */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.55}
        scale={14}
        blur={1.8}
        far={3.5}
        resolution={1024}
        color="#111719"
      />

      {/* 8. Directional Shadow Catcher Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.16} />
      </mesh>
    </>
  );
};


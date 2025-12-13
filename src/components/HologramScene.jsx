import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import HologramCore from './HologramCore';
import HomeHeader from './HomeHeader'; 
import AboutPanel from './AboutPanel';
import ProjectGallery from './ProjectGallery';
import SkillsCloud from './SkillsCloud';
import ContactPanel from './ContactPanel';

function SceneRig() {
  const { camera, size } = useThree();
  
  useFrame(() => {
    const aspect = size.width / size.height;
    const isMobile = size.width < 768;
    
    // Dynamic Z adjustment
    const targetZ = isMobile ? 20 / aspect : 13; 
    const finalZ = Math.min(targetZ, 25);

    camera.position.lerp(new THREE.Vector3(0, 0, finalZ), 0.1); 
    camera.updateProjectionMatrix();
  });

  return null; 
}

export default function HologramScene({ mode }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <SceneRig />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.8} 
        autoRotate={mode === "HOME"} 
        autoRotateSpeed={0.5}
      />

      <color attach="background" args={['#000000']} />
      <Stars radius={50} count={3000} factor={4} fade speed={1} />
      
      <HomeHeader visible={mode === "HOME"} /> 
      <HologramCore visible={mode === "HOME"} /> 
      
      <AboutPanel visible={mode === "ABOUT"} />
      <ProjectGallery visible={mode === "PROJECTS"} />
      <SkillsCloud visible={mode === "SKILLS"} />
      <ContactPanel visible={mode === "CONTACT"} />
      
      <gridHelper args={[30, 30, 0x222222, 0x050505]} position={[0, -3, 0]} />

      {/* FIXED: Adjusted Bloom to prevent blurry text */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={0.2} // Only very bright things glow (prevents text blur)
            mipmapBlur 
            intensity={0.5} // Lowered intensity for clarity
            radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
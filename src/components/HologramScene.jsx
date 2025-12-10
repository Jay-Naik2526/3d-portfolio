import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';

// Import all modular components
import HologramCore from './HologramCore';
import HomeHeader from './HomeHeader'; // <-- NEW IMPORT
import AboutPanel from './AboutPanel';
import ProjectGallery from './ProjectGallery';
import SkillsCloud from './SkillsCloud';
import ContactPanel from './ContactPanel';

function SceneRig() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  // Base Camera Z position (Pulled back for all content)
  const cameraZ = isMobile ? 18 : 13; 

  return <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} />;
}

export default function HologramScene({ mode }) {
  return (
    <>
      <SceneRig />
      
      <OrbitControls 
        enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} 
        autoRotate={mode === "HOME"} autoRotateSpeed={0.5}
      />

      <color attach="background" args={['#000000']} />
      <Stars radius={50} count={3000} factor={4} fade speed={1} />
      
      {/* 1. HOME SCREEN COMPONENTS */}
      <HomeHeader visible={mode === "HOME"} /> {/* <-- RENDER THE HEADER */}
      <HologramCore visible={mode === "HOME"} /> 
      
      {/* 2. OTHER COMPONENTS */}
      <AboutPanel visible={mode === "ABOUT"} />
      <ProjectGallery visible={mode === "PROJECTS"} />
      <SkillsCloud visible={mode === "SKILLS"} />
      <ContactPanel visible={mode === "CONTACT"} />
      
      <gridHelper args={[30, 30, 0x222222, 0x050505]} position={[0, -3, 0]} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur intensity={1.2} radius={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
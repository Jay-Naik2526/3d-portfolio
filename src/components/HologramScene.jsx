import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import HologramCore from './HologramCore';
import HomeHeader from './HomeHeader'; 
import AboutPanel from './AboutPanel';
import ProjectGallery from './ProjectGallery';
import SkillsCloud from './SkillsCloud';
import ContactPanel from './ContactPanel';
import { myProjects } from '../data';
import InteractiveParticles from './InteractiveParticles';

function SceneRig({ mode, selectedProject }) {
  const { camera, size, viewport } = useThree();
  
  useFrame(() => {
    const aspect = size.width / size.height;
    const isMobile = size.width < 768;
    const count = myProjects ? myProjects.length : 6;
    
    // Calculate radius to match ProjectGallery spacing
    const baseRadius = isMobile ? Math.min(viewport.width * 0.4, 2.5) : 6;
    const radius = isMobile
      ? baseRadius + Math.max(0, count - 6) * 0.15
      : baseRadius + Math.max(0, count - 6) * 0.35;

    // Dynamic Z adjustment based on mode, project count, and project selection
    let targetZ;
    if (mode === "PROJECTS") {
      if (selectedProject) {
        // Zoom in close to the centered card
        targetZ = radius + (isMobile ? 3.0 : 3.8);
      } else {
        // Zoom out to view the whole ring
        const desktopZ = 13 + Math.max(0, count - 6) * 0.45;
        const mobileZ = (20 / aspect) + Math.max(0, count - 6) * 0.25;
        targetZ = isMobile ? mobileZ : desktopZ;
      }
    } else {
      targetZ = isMobile ? 20 / aspect : 13; 
    }
    
    const finalZ = Math.min(targetZ, 30);

    camera.position.lerp(new THREE.Vector3(0, 0, finalZ), 0.08); 
    camera.updateProjectionMatrix();
  });

  return null; 
}

export default function HologramScene({ 
  mode, 
  selectedSkill, 
  setSelectedSkill, 
  selectedProject, 
  setSelectedProject 
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <SceneRig mode={mode} selectedProject={selectedProject} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.8} 
        autoRotate={mode === "HOME"} 
        autoRotateSpeed={0.5}
        enableRotate={!selectedProject}
      />

      <color attach="background" args={['#000000']} />
      <InteractiveParticles count={1500} />
      
      <HomeHeader visible={mode === "HOME"} /> 
      <HologramCore visible={mode === "HOME"} /> 
      
      <AboutPanel visible={mode === "ABOUT"} />
      <ProjectGallery 
        visible={mode === "PROJECTS"} 
        selectedSkill={selectedSkill}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
      <SkillsCloud 
        visible={mode === "SKILLS"} 
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
      />
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
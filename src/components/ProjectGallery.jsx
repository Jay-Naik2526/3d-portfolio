import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Image } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { myProjects } from '../data'; 
import { playClick, playHover, playSuccess } from '../utils/audio';

// Custom shaders for holographic scanline overlay
const scanlineVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const scanlineFragmentShader = `
  uniform float time;
  uniform float opacity;
  varying vec2 vUv;
  void main() {
    // Scrolling scanlines
    float scanline = sin(vUv.y * 100.0 + time * 6.0) * 0.08 + 0.92;
    // Fast pulsing laser line
    float linePattern = step(0.96, sin(vUv.y * 150.0 - time * 10.0)) * 0.12;
    // Glowing sci-fi cyan
    vec3 color = vec3(0.0, 0.95, 1.0); 
    gl_FragColor = vec4(color, opacity * (linePattern + (1.0 - scanline) * 0.35));
  }
`;

// Helper to determine if a project uses a specific skill (handles stack aliases)
const projectMatchesSkill = (project, skill) => {
  if (!skill) return true;
  const title = project.title.toLowerCase();
  const desc = project.desc.toLowerCase();
  const s = skill.toLowerCase();
  
  if (title.includes(s) || desc.includes(s)) return true;
  if (desc.includes("mern") && ["mongodb", "react", "node.js", "express", "experss", "javascript"].includes(s)) {
    return true;
  }
  return false;
};

function HoloPanel({ 
  project, 
  position, 
  rotation, 
  scale = 1, 
  selectedSkill, 
  selectedProject, 
  setSelectedProject 
}) {
  const group = useRef();
  const scanlineRef = useRef();
  const [hovered, setHover] = useState(false);
  const [textureUrl, setTextureUrl] = useState('/img/resume.png');
  const isFirstRender = useRef(true);

  const isSelected = selectedProject?.title === project.title;

  useEffect(() => {
    if (!project.image) return;
    const img = new window.Image();
    img.src = project.image;
    img.onload = () => setTextureUrl(project.image);
    img.onerror = () => setTextureUrl('/img/resume.png');
  }, [project.image]);

  useFrame((state, delta) => {
    // Initialize position and rotation on first frame to prevent layout flashing
    if (isFirstRender.current) {
      group.current.position.copy(new THREE.Vector3(...position));
      group.current.rotation.y = rotation[1];
      isFirstRender.current = false;
    } else {
      // Smoothly animate the card to its new coordinates (handles carousel restructuring)
      easing.damp3(group.current.position, position, 0.25, delta);
      
      let diffY = rotation[1] - group.current.rotation.y;
      diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));
      group.current.rotation.y += diffY * 0.15;
    }

    // Dynamic scale depending on selection and filter matches
    let targetScale = scale;
    if (isSelected) {
      targetScale = scale * 1.25;
    } else if (hovered) {
      targetScale *= 1.15;
    }
    
    easing.damp3(group.current.scale, [targetScale, targetScale, targetScale], 0.18, delta);

    if (scanlineRef.current) {
      scanlineRef.current.uniforms.time.value = state.clock.getElapsedTime();
      easing.damp(scanlineRef.current.uniforms.opacity, 'value', 0.45, 0.2, delta);
    }
  });

  return (
    <group 
      ref={group} 
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        setHover(true); 
        document.body.style.cursor = 'pointer'; 
        playHover(); 
      }}
      onPointerOut={(e) => { 
        e.stopPropagation(); 
        setHover(false); 
        document.body.style.cursor = 'grab'; 
      }}
      onClick={(e) => { 
        e.stopPropagation(); 
        playSuccess();
        window.open(project.url, '_blank');
        setSelectedProject(isSelected ? null : project); 
      }}
    >
      {/* Backing for Image */}
      <mesh position={[0, 0.5, 0.04]}>
        <planeGeometry args={[2.3, 1.4]} />
        <meshBasicMaterial 
          color="white" 
          side={THREE.FrontSide} 
          transparent 
          opacity={1.0} 
        />
      </mesh>
      
      {/* Image */}
      <Image 
        url={textureUrl} 
        transparent={true}
        opacity={1.0} 
        toneMapped={false} 
        side={THREE.FrontSide} 
        scale={[2.3, 1.4]} 
        position={[0, 0.5, 0.05]} 
      />

      {/* Custom Hologram Scanline Shader Overlay */}
      <mesh position={[0, 0.5, 0.051]}>
        <planeGeometry args={[2.3, 1.4]} />
        <shaderMaterial
          ref={scanlineRef}
          vertexShader={scanlineVertexShader}
          fragmentShader={scanlineFragmentShader}
          uniforms={{
            time: { value: 0 },
            opacity: { value: 0.45 }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[2.5, 1.6]} />
        <meshBasicMaterial color={isSelected ? "#00f3ff" : (hovered ? "#ffffff" : "#00f3ff")} transparent opacity={0.15} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <ringGeometry args={[1.4, 1.45, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial 
          color={isSelected ? "#00f3ff" : (hovered ? "#ffffff" : "#00f3ff")} 
          transparent 
          opacity={1.0} 
          side={THREE.FrontSide} 
          toneMapped={false}
        />
      </mesh>

      {/* TEXT */}
      <group position={[0, -1.3, 0.1]}>
        <Text 
            position={[0, 0.4, 0]} 
            fontSize={0.25} 
            color="white" 
            anchorX="center"
            fontWeight="bold"
            fillOpacity={1.0}
        >
            {project.title.toUpperCase()}
        </Text>
        <Text 
            position={[0, 0, 0]} 
            fontSize={0.13} 
            color="#d0ffff" 
            anchorX="center" 
            maxWidth={2.2} 
            textAlign="center"
            lineHeight={1.4}
            fillOpacity={1.0}
        >
            {project.desc}
        </Text>
        <Text 
            position={[0, -0.4, 0.01]} 
            fontSize={0.12} 
            color={isSelected ? "#00f3ff" : (hovered ? "white" : "#00f3ff")}
            fillOpacity={1.0}
        >
            {isSelected ? "[ ACTIVE DETAIL ]" : "[ CLICK TO SELECT ]"}
        </Text>
      </group>
    </group>
  );
}

export default function ProjectGallery({ 
  visible, 
  controls, 
  selectedSkill, 
  selectedProject, 
  setSelectedProject 
}) {
  const groupRef = useRef();
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const velocity = useRef(0); 
  
  const { viewport, gl } = useThree();

  if (!myProjects) return null;

  // Filter projects dynamically based on the active selectedSkill
  const filteredProjects = selectedSkill 
    ? myProjects.filter(project => projectMatchesSkill(project, selectedSkill))
    : myProjects;

  const count = filteredProjects.length;
  const isMobile = viewport.width < 7;
  
  // Calculate dynamic radius and scale based on filtered project count
  const panelScale = isMobile 
    ? Math.max(0.4, 0.6 * (1.0 - Math.max(0, count - 6) * 0.025)) 
    : Math.max(0.6, 1.0 * (1.0 - Math.max(0, count - 6) * 0.03));
    
  const baseRadius = isMobile ? Math.min(viewport.width * 0.4, 2.5) : 6;
  const radius = isMobile
    ? baseRadius + Math.max(0, count - 6) * 0.15
    : baseRadius + Math.max(0, count - 6) * 0.35;

  useEffect(() => {
    const handleDown = (e) => {
      isDragging.current = true;
      previousPointerX.current = e.clientX || e.touches?.[0].clientX;
      document.body.style.cursor = 'grabbing';
    };
    const handleUp = () => { isDragging.current = false; document.body.style.cursor = 'grab'; };
    const handleMove = (e) => {
      if (!isDragging.current) return;
      const clientX = e.clientX || e.touches?.[0].clientX;
      const delta = clientX - previousPointerX.current;
      velocity.current = delta * 0.005; 
      previousPointerX.current = clientX;
    };
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleDown); canvas.addEventListener('mousemove', handleMove); canvas.addEventListener('mouseup', handleUp); canvas.addEventListener('mouseleave', handleUp);
    canvas.addEventListener('touchstart', handleDown); canvas.addEventListener('touchmove', handleMove); canvas.addEventListener('touchend', handleUp);
    return () => {
      canvas.removeEventListener('mousedown', handleDown); canvas.removeEventListener('mousemove', handleMove); canvas.removeEventListener('mouseup', handleUp); canvas.removeEventListener('mouseleave', handleUp);
      canvas.removeEventListener('touchstart', handleDown); canvas.removeEventListener('touchmove', handleMove); canvas.removeEventListener('touchend', handleUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    easing.damp3(groupRef.current.position, visible ? [0, 0, 0] : [0, -15, 0], 0.4, delta);
    if (visible) {
      if (selectedProject) {
        // Auto-rotate the gallery to center the selected project card in front
        const index = filteredProjects.findIndex(p => p.title === selectedProject.title);
        if (index !== -1) {
          const angleStep = (Math.PI * 2) / count;
          const targetRot = -index * angleStep;
          let diff = targetRot - groupRef.current.rotation.y;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          groupRef.current.rotation.y += diff * 0.08;
          velocity.current = 0; // lock user drift
        }
      } else if (controls && controls.x !== 0) {
          groupRef.current.rotation.y += controls.x * delta * 2;
      } else {
         groupRef.current.rotation.y += velocity.current;
         if (!isDragging.current) {
            velocity.current *= 0.95;
            if (Math.abs(velocity.current) < 0.001) groupRef.current.rotation.y += 0.0005; 
         }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {filteredProjects.map((project, i) => {
        const angleStep = (Math.PI * 2) / count;
        const angle = i * angleStep;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius; 
        const rotY = angle; 

        return (
            <HoloPanel 
                key={project.title} 
                project={project} 
                position={[x, 0, z]} 
                rotation={[0, rotY, 0]}
                scale={panelScale} 
                selectedSkill={selectedSkill}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
            />
        );
      })}
    </group>
  );
}
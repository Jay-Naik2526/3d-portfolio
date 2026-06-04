import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Image } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { myProjects } from '../data'; 
import { playClick, playHover } from '../utils/audio';

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

  const matchesSkill = selectedSkill ? projectMatchesSkill(project, selectedSkill) : true;
  const isSelected = selectedProject?.title === project.title;

  useEffect(() => {
    if (!project.image) return;
    const img = new window.Image();
    img.src = project.image;
    img.onload = () => setTextureUrl(project.image);
    img.onerror = () => setTextureUrl('/img/resume.png');
  }, [project.image]);

  useFrame((state, delta) => {
    // Dynamic scale depending on selection and filter matches
    let targetScale = scale;
    if (selectedSkill) {
      targetScale = matchesSkill ? scale * 1.15 : scale * 0.55;
    }
    if (isSelected) {
      targetScale = scale * 1.25;
    } else if (hovered) {
      targetScale *= 1.15;
    }
    
    easing.damp3(group.current.scale, [targetScale, targetScale, targetScale], 0.18, delta);

    if (scanlineRef.current) {
      scanlineRef.current.uniforms.time.value = state.clock.getElapsedTime();
      const targetOpacity = selectedSkill && !matchesSkill ? 0.08 : 0.45;
      easing.damp(scanlineRef.current.uniforms.opacity, 'value', targetOpacity, 0.2, delta);
    }
  });

  const opacity = selectedSkill && !matchesSkill ? 0.25 : 1.0;
  const frameOpacity = selectedSkill && !matchesSkill ? 0.05 : 0.15;
  const frameColor = isSelected ? "#00f3ff" : (matchesSkill && selectedSkill ? "#00f3ff" : (hovered ? "#ffffff" : "#00f3ff"));

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation}
      scale={scale} 
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
          color={selectedSkill && !matchesSkill ? "#111111" : "white"} 
          side={THREE.FrontSide} 
          transparent 
          opacity={opacity} 
        />
      </mesh>
      
      {/* Image */}
      <Image 
        url={textureUrl} 
        transparent={true}
        opacity={opacity} 
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
        <meshBasicMaterial color={frameColor} transparent opacity={frameOpacity} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <ringGeometry args={[1.4, 1.45, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial 
          color={isSelected ? "#00f3ff" : (hovered ? "#ffffff" : "#00f3ff")} 
          transparent 
          opacity={opacity} 
          side={THREE.FrontSide} 
          toneMapped={false}
        />
      </mesh>

      {/* TEXT */}
      <group position={[0, -1.3, 0.1]}>
        <Text 
            position={[0, 0.4, 0]} 
            fontSize={0.25} 
            color={selectedSkill && !matchesSkill ? "#555" : "white"} 
            anchorX="center"
            fontWeight="bold"
            fillOpacity={opacity}
        >
            {project.title.toUpperCase()}
        </Text>
        <Text 
            position={[0, 0, 0]} 
            fontSize={0.13} 
            color={selectedSkill && !matchesSkill ? "#333" : "#d0ffff"} 
            anchorX="center" 
            maxWidth={2.2} 
            textAlign="center"
            lineHeight={1.4}
            fillOpacity={opacity}
        >
            {project.desc}
        </Text>
        <Text 
            position={[0, -0.4, 0.01]} 
            fontSize={0.12} 
            color={isSelected ? "#00f3ff" : (hovered ? "white" : "#00f3ff")}
            fillOpacity={opacity}
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
  const count = myProjects.length;
  const isMobile = viewport.width < 7;
  
  // Calculate dynamic radius and scale based on project count to prevent overlapping
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
        const index = myProjects.findIndex(p => p.title === selectedProject.title);
        if (index !== -1) {
          const angleStep = (Math.PI * 2) / count;
          const targetRot = -index * angleStep;
          let diff = targetRot - groupRef.current.rotation.y;
          // Shortest path interpolation
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
      {myProjects.map((project, i) => {
        const angleStep = (Math.PI * 2) / count;
        const angle = i * angleStep;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius; 
        const rotY = angle; 

        return (
            <HoloPanel 
                key={i} 
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
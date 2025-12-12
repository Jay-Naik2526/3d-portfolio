import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Image } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { myProjects } from '../data'; 

function HoloPanel({ project, position, rotation, scale = 1 }) {
  const group = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    easing.damp3(group.current.scale, hovered ? 1.15 * scale : 1 * scale, 0.2, delta);
  });

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation}
      scale={scale} 
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'grab'; }}
      onClick={(e) => { 
        e.stopPropagation(); 
        window.open(project.url, '_blank'); 
      }}
    >
      <mesh position={[0, 0.5, 0.04]}>
        <planeGeometry args={[2.3, 1.4]} />
        <meshBasicMaterial color="white" side={THREE.FrontSide} />
      </mesh>
      <Image 
        url={project.image} 
        transparent={false}
        opacity={1} 
        toneMapped={false}
        side={THREE.FrontSide} 
        scale={[2.3, 1.4]} 
        position={[0, 0.5, 0.05]} 
      />
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[2.5, 1.6]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.15} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <ringGeometry args={[1.4, 1.45, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#00f3ff"} side={THREE.FrontSide} toneMapped={false}/>
      </mesh>
      <group position={[0, -1.3, 0.1]}>
        <Text position={[0, 0.3, 0]} fontSize={0.2} color="white" anchorX="center">{project.title.toUpperCase()}</Text>
        <Text position={[0, 0, 0]} fontSize={0.1} color="#aaffff" anchorX="center" maxWidth={2.2} textAlign="center">{project.desc}</Text>
        <Text position={[0, -0.3, 0.01]} fontSize={0.1} color={hovered ? "white" : "#00f3ff"}>[ CLICK TO VIEW ]</Text>
      </group>
    </group>
  );
}

export default function ProjectGallery({ visible, controls }) {
  const groupRef = useRef();
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const velocity = useRef(0); 
  
  const { viewport, gl } = useThree();
  const isMobile = viewport.width < 7;
  
  // Calculate radius based on viewport width
  // Ensures it fits within the screen bounds
  const radius = isMobile ? Math.min(viewport.width * 0.4, 2.5) : 6;
  const panelScale = isMobile ? 0.6 : 1; 

  if (!myProjects) return null;
  const count = myProjects.length;

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
      if (controls && controls.x !== 0) {
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
            />
        );
      })}
    </group>
  );
}
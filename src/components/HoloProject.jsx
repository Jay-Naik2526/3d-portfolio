import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { easing } from 'maath';

export default function HoloProject({ project, position }) {
  const group = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    // Smooth hover scale
    easing.damp3(group.current.scale, hovered ? 1.1 : 1, 0.2, delta);
  });

  return (
    <group 
      ref={group} 
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => window.open(project.url, '_blank')}
    >
      {/* 1. THE PANEL FRAME (Neon Box) */}
      <mesh>
        <boxGeometry args={[3, 4, 0.1]} />
        {/* Wireframe Material for that "Iron Man" look */}
        <meshBasicMaterial color={hovered ? "#ffffff" : "#00f3ff"} wireframe />
      </mesh>

      {/* 2. BACKGROUND GLOW (Subtle) */}
      <mesh>
        <boxGeometry args={[2.9, 3.9, 0.05]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
      </mesh>

      {/* 3. TEXT CONTENT */}
      <group position={[0, 0, 0.1]}>
        <Text 
          position={[0, 1.5, 0]} 
          fontSize={0.3} 
          color="white" 
          anchorX="center"
          font="https://fonts.gstatic.com/s/rajdhani/v10/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff"
        >
          {project.title.toUpperCase()}
        </Text>

        <Text 
          position={[0, 0, 0]} 
          fontSize={0.15} 
          color="#aaffff" 
          anchorX="center" 
          maxWidth={2.5}
          textAlign="center"
          font="https://fonts.gstatic.com/s/rajdhani/v10/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff"
        >
          {project.desc}
        </Text>

        {/* BUTTON */}
        <Text 
          position={[0, -1.5, 0]} 
          fontSize={0.15} 
          color={hovered ? "#00f3ff" : "gray"}
          font="https://fonts.gstatic.com/s/rajdhani/v10/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff"
        >
          [ CLICK TO INITIALIZE ]
        </Text>
      </group>
    </group>
  );
}
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { easing } from 'maath';
import { aboutMe, myProfile } from '../data'; 

function HexNode({ position, title, content, color = "#00f3ff", scale = 1, maxWidth = 3 }) {
  const lineLength = Math.sqrt(position[0]**2 + position[1]**2);
  const angle = Math.atan2(position[1], position[0]);

  return (
    <group position={position} scale={scale}>
      <mesh position={[-position[0]/2, -position[1]/2, -0.1]} rotation={[0, 0, angle]} >
        <planeGeometry args={[lineLength, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh rotation={[0, 0, Math.PI/2]}>
          <circleGeometry args={[2.2, 6]} />
          <meshBasicMaterial color="black" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.01]} rotation={[0, 0, Math.PI/2]}>
          <ringGeometry args={[2.2, 2.25, 6]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <group position={[0, 0.2, 0.1]}>
          <Text position={[0, 0.8, 0]} fontSize={0.25} color={color} anchorX="center" fontWeight="bold">
            {title}
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.16} color="white" anchorX="center" anchorY="middle" maxWidth={maxWidth} textAlign="center" lineHeight={1.3}>
            {content}
          </Text>
        </group>
      </Float>
    </group>
  );
}

export default function AboutPanel({ visible }) {
  const group = useRef();
  const { viewport } = useThree();
  
  // --- ROBUST RESPONSIVE LOGIC ---
  const isMobile = viewport.width < 7;
  
  // Calculate dynamic positions based on available screen width
  // 'vw' acts like a percentage of the 3D viewport width
  const vw = viewport.width; 
  const vh = viewport.height;

  // Clamp values so they don't get too spread out on tablets or too squished on tiny phones
  const xSpread = isMobile ? Math.min(vw * 0.35, 2.0) : 4.5; 
  const ySpread = isMobile ? Math.min(vh * 0.35, 4.5) : 2.0;

  if (!aboutMe || !myProfile) return null;

  useFrame((state, delta) => {
    easing.damp3(group.current.position, visible ? [0, 0, 0] : [-30, 0, 0], 0.4, delta);
  });

  const layout = isMobile ? {
      bio: [0, ySpread, 0],      // Top
      edu: [0, -ySpread, 0],     // Bottom
      lead: [-xSpread, -0.5, 0], // Left
      tech: [xSpread, -0.5, 0],  // Right
      headerY: ySpread + 1.5,
      nodeScale: 0.6,
      textWidth: 2.0
  } : {
      bio: [-4.5, 2, 0],
      edu: [4.5, 2, 0],
      lead: [-4.5, -2, 0],
      tech: [4.5, -2, 0],
      headerY: 3.5,
      nodeScale: 1,
      textWidth: 3
  };

  return (
    <group ref={group}>
      <group position={[0, 0, 0]}>
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.2}>
          <group scale={isMobile ? 0.7 : 1}>
             <mesh rotation={[1.5, 0, 0]}><torusGeometry args={[2.5, 0.02, 16, 100]} /><meshBasicMaterial color="#00f3ff" transparent opacity={0.3} /></mesh>
             <mesh><octahedronGeometry args={[1.5, 0]} /><meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.1} /></mesh>
          </group>
        </Float>
        <Text position={[0, 0, 0.1]} fontSize={isMobile ? 0.2 : 0.3} color="#00f3ff" anchorX="center" anchorY="middle" fontWeight="bold">
          FULL STACK DEV
        </Text>
      </group>

      <Text position={[0, layout.headerY, 0]} fontSize={isMobile ? 0.35 : 0.5} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#00f3ff">
        {myProfile.name.toUpperCase()}
      </Text>

      <HexNode position={layout.bio} title="PROFILE SCAN" content={aboutMe.bio} scale={layout.nodeScale} maxWidth={layout.textWidth} />
      <HexNode position={layout.edu} title="ACADEMICS" content={aboutMe.education} scale={layout.nodeScale} maxWidth={layout.textWidth} />
      <HexNode position={layout.lead} title="LEADERSHIP" content="Web Dev Lead @ GDG on Campus" scale={layout.nodeScale} maxWidth={layout.textWidth} />
      <HexNode position={layout.tech} title="TOOLKIT" content="VS Code, Git, Figma, Vercel" scale={layout.nodeScale} maxWidth={layout.textWidth} />
    </group>
  );
}
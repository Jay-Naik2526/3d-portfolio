import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { easing } from 'maath';
import { myProfile } from '../data'; 

function ContactArtifact({ position, color, label, iconType, action }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    const speed = hovered ? 2.5 : 0.5;
    mesh.current.rotation.x += delta * speed;
    mesh.current.rotation.y += delta * speed;
    easing.damp3(mesh.current.scale, hovered ? 1.2 : 1, 0.2, delta);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group 
        position={position}
        onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
        onClick={action}
      >
        <mesh ref={mesh}>
          {iconType === "cube" && <boxGeometry args={[1, 1, 1]} />}
          {iconType === "sphere" && <icosahedronGeometry args={[0.7, 1]} />}
          {iconType === "diamond" && <octahedronGeometry args={[0.8, 0]} />}
          <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={hovered ? 4 : 1.5} toneMapped={false} />
        </mesh>
        <mesh scale={0.5}>
          {iconType === "cube" && <boxGeometry args={[1, 1, 1]} />}
          {iconType === "sphere" && <icosahedronGeometry args={[0.7, 1]} />}
          {iconType === "diamond" && <octahedronGeometry args={[0.8, 0]} />}
          <meshBasicMaterial color="white" />
        </mesh>
        <Text position={[0, -1.2, 0]} fontSize={0.25} color={hovered ? "white" : color} anchorX="center">{label}</Text>
        <Text position={[0, -1.5, 0]} fontSize={0.1} color="gray" anchorX="center">[ CLICK TO OPEN ]</Text>
      </group>
    </Float>
  );
}

export default function ContactPanel({ visible }) {
  const group = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  if (!myProfile) return null;

  useFrame((state, delta) => {
    easing.damp3(group.current.position, visible ? [0, 0, 0] : [0, 15, 0], 0.4, delta);
  });

  // Responsive Layout
  const pos = isMobile ? {
      gh: [0, 2.5, 0],  // Top
      mail: [0, 0, 1],  // Center
      li: [0, -2.5, 0]  // Bottom
  } : {
      gh: [-2.5, 0, 0], // Left
      mail: [0, 0, 1],  // Center
      li: [2.5, 0, 0]   // Right
  };

  return (
    <group ref={group}>
      <Text position={[0, isMobile ? 4 : 2, 0]} fontSize={0.4} color="white" anchorX="center">COMMS_LINK</Text>
      <ContactArtifact position={pos.gh} color="#a020f0" label="GITHUB" iconType="diamond" action={() => window.open(`https://${myProfile.github}`, '_blank')} />
      <ContactArtifact position={pos.mail} color="#00ff88" label="EMAIL" iconType="sphere" action={() => window.open(`mailto:${myProfile.email}`)} />
      <ContactArtifact position={pos.li} color="#00f3ff" label="LINKEDIN" iconType="cube" action={() => window.open(`https://${myProfile.linkedin}`, '_blank')} />
    </group>
  );
}
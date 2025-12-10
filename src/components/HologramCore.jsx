import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

export default function HologramCore({ visible }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.5;
    // Shrink if not visible, Grow if visible
    easing.damp3(meshRef.current.scale, visible ? 1.5 : 0, 0.25, delta);
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshBasicMaterial wireframe transparent opacity={0.8} color="#00f3ff" />
    </mesh>
  );
}
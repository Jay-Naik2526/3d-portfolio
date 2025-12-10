import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { easing } from 'maath'; // <--- CORRECTED LINE 4
import { mySkills } from '../data'; 

export default function SkillsCloud({ visible, controls }) {
  const groupRef = useRef();
  
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  const radius = isMobile ? 2.5 : 5; 

  if (!mySkills) return null;

  useFrame((state, delta) => {
    // Reveal Animation
    easing.damp3(groupRef.current.scale, visible ? 1 : 0, 0.25, delta);

    if (visible) {
        // MANUAL BUTTON CONTROL (Left/Right)
        if (controls && controls.x !== 0) {
            groupRef.current.rotation.y += controls.x * delta * 2;
        } else {
            // Auto Rotate
            groupRef.current.rotation.y += delta * 0.05;
        }
    }
  });

  return (
    <group ref={groupRef}>
      {mySkills.map((skill, i) => {
        // Helix Math (Responsive, avoids overlap)
        const count = mySkills.length;
        const angle = (i / count) * Math.PI * 2; 
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 2; 

        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group position={[x, y, z]}>
              
              {/* 1. THE DIAMOND */}
              <mesh>
                <octahedronGeometry args={[0.6, 0]} /> 
                <meshStandardMaterial 
                    color="#a020f0" 
                    emissive="#a020f0"
                    emissiveIntensity={2}
                    wireframe={true} 
                    toneMapped={false}
                />
              </mesh>
              
              {/* 2. GLOW CORE */}
              <mesh>
                 <octahedronGeometry args={[0.2, 0]} />
                 <meshBasicMaterial color="white" />
              </mesh>

              {/* 3. TEXT LABEL */}
              <Text 
                position={[0, 0.8, 0]} 
                fontSize={0.3} 
                color="#e0b0ff" 
                anchorX="center" 
                anchorY="middle"
              >
                {skill.toUpperCase()}
              </Text>
            </group>
          </Float>
        );
      })}
    </group>
  );
}
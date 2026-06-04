import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { easing } from 'maath';
import { mySkills } from '../data'; 
import { playClick, playHover } from '../utils/audio';

function SkillItem({ skill, position, selectedSkill, setSelectedSkill }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedSkill === skill;
  const groupRef = useRef();

  useFrame((state, delta) => {
    const targetScale = isSelected ? 1.3 : (hovered ? 1.15 : 1.0);
    easing.damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        playHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        setSelectedSkill(prev => prev === skill ? null : skill);
      }}
    >
      <mesh>
        <octahedronGeometry args={[0.6, 0]} /> 
        <meshStandardMaterial 
            color={isSelected ? "#00f3ff" : (hovered ? "#d050ff" : "#a020f0")} 
            emissive={isSelected ? "#00f3ff" : (hovered ? "#d050ff" : "#a020f0")}
            emissiveIntensity={isSelected ? 3 : (hovered ? 2.5 : 2)}
            wireframe={true} 
            toneMapped={false}
        />
      </mesh>
      <mesh>
         <octahedronGeometry args={[0.2, 0]} />
         <meshBasicMaterial color={isSelected ? "#00f3ff" : "white"} />
      </mesh>
      <Text 
        position={[0, 0.8, 0]} 
        fontSize={0.3} 
        color={isSelected ? "#00f3ff" : (hovered ? "#ffffff" : "#e0b0ff")} 
        anchorX="center" 
        anchorY="middle"
        fontWeight={isSelected ? "bold" : "normal"}
      >
        {skill.toUpperCase()}
      </Text>
    </group>
  );
}

export default function SkillsCloud({ visible, controls, selectedSkill, setSelectedSkill }) {
  const groupRef = useRef();
  
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  const radius = isMobile ? 2.5 : 5; 

  if (!mySkills) return null;

  useFrame((state, delta) => {
    easing.damp3(groupRef.current.scale, visible ? 1 : 0, 0.25, delta);

    if (visible) {
        if (controls && controls.x !== 0) {
            groupRef.current.rotation.y += controls.x * delta * 2;
        } else {
            groupRef.current.rotation.y += delta * 0.05;
        }
    }
  });

  return (
    <group ref={groupRef}>
      {mySkills.map((skill, i) => {
        const count = mySkills.length;
        const angle = (i / count) * Math.PI * 2; 
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 2; 

        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <SkillItem
              skill={skill}
              position={[x, y, z]}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
            />
          </Float>
        );
      })}
    </group>
  );
}
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; 
import { Text } from '@react-three/drei';
import { easing } from 'maath';

export default function HomeHeader({ visible }) {
  const groupRef = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  // FIXED: Lowered mobile target Y from 5.5 to 4.5 to prevent cutting
  const targetY = isMobile ? 4.5 : 3.5; 
  const fontSize = isMobile ? 0.35 : 0.6; 
  const lineGap = isMobile ? 0.30 : 0; 

  useFrame((state, delta) => {
    easing.damp3(groupRef.current.position, visible ? [0, targetY, 0] : [0, 10, 0], 0.5, delta);
  });

  return (
    <group ref={groupRef}>
      {isMobile ? (
        <>
          <Text 
            position={[0, lineGap, 0]} 
            fontSize={fontSize} 
            color="white" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#00f3ff"
          >
            JAY NAIK'S
          </Text>
          <Text 
            position={[0, -lineGap, 0]} 
            fontSize={fontSize} 
            color="white" 
            anchorX="center" 
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#00f3ff"
          >
            PORTFOLIO
          </Text>
        </>
      ) : (
        <Text 
          position={[0, 0, 0]} 
          fontSize={fontSize} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#00f3ff"
        >
          JAY NAIK'S PORTFOLIO
        </Text>
      )}
    </group>
  );
}
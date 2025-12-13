import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; 
import { Text } from '@react-three/drei';
import { easing } from 'maath';

export default function HomeHeader({ visible }) {
  const groupRef = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 7;
  
  const targetY = isMobile ? 4.5 : 3.5; 
  const fontSize = isMobile ? 0.45 : 0.7; // Increased size
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
            outlineWidth={0.02} // Reduced outline thickness for sharpness
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
            outlineWidth={0.02}
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
          outlineWidth={0.02}
          outlineColor="#00f3ff"
        >
          JAY NAIK'S PORTFOLIO
        </Text>
      )}
    </group>
  );
}
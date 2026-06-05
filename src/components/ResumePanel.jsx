import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import { resumeData } from '../data';
import { playClick, playHover, playSuccess } from '../utils/audio';

export default function ResumePanel({ visible }) {
  const groupRef = useRef();
  const [activeTab, setActiveTab] = useState("education"); 
  const [hoveredTab, setHoveredTab] = useState(null);
  const [downloadHovered, setDownloadHovered] = useState(false);

  useFrame((state, delta) => {
    // Animate panel visibility scale and slide (Y shifted to 0.65 to clear menu)
    easing.damp3(groupRef.current.scale, visible ? [1, 1, 1] : [0, 0, 0], 0.25, delta);
    easing.damp3(groupRef.current.position, visible ? [0, 0.65, 0] : [0, -10, 0], 0.25, delta);
  });

  const tabs = [
    { id: "education", label: "EDUCATION" },
    { id: "experience", label: "EXPERIENCE" },
    { id: "achievements", label: "ACHIEVEMENTS" }
  ];

  return (
    <group ref={groupRef}>
      {/* 3D Console Backplate */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[7.2, 4.8]} />
        <meshBasicMaterial color="#000e15" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      
      {/* 3D Console Neon Border Frame */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[7.4, 5.0]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.0, 0.05]}
        fontSize={0.25}
        color="#00f3ff"
        fontWeight="bold"
        anchorX="center"
      >
        --- RESUME SCANNER PROMPT ---
      </Text>

      {/* Tabs list (sub-navigation in 3D space) */}
      <group position={[0, 1.4, 0.05]}>
        {tabs.map((tab, idx) => {
          const xPos = -2.2 + idx * 2.2;
          const isSelected = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;
          
          return (
            <group key={tab.id} position={[xPos, 0, 0]}>
              {/* Tab button frame */}
              <mesh
                onPointerOver={() => {
                  setHoveredTab(tab.id);
                  document.body.style.cursor = 'pointer';
                  playHover();
                }}
                onPointerOut={() => {
                  setHoveredTab(null);
                  document.body.style.cursor = 'default';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  setActiveTab(tab.id);
                }}
              >
                <planeGeometry args={[1.9, 0.45]} />
                <meshBasicMaterial
                  color={isSelected ? "#00f3ff" : (isHovered ? "#ffffff" : "#00f3ff")}
                  transparent
                  opacity={isSelected ? 0.25 : (isHovered ? 0.15 : 0.05)}
                  side={THREE.DoubleSide}
                />
              </mesh>
              
              {/* Tab label */}
              <Text
                position={[0, 0, 0.01]}
                fontSize={0.14}
                color={isSelected ? "#00f3ff" : (isHovered ? "#ffffff" : "#cccccc")}
                fontWeight="bold"
                anchorX="center"
                anchorY="middle"
              >
                {tab.label}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Dynamic Tab Contents Panel */}
      <group position={[0, -0.4, 0.05]}>
        {/* Education content */}
        {activeTab === "education" && resumeData.education.map((item, idx) => (
          <group key={idx} position={[0, 0.8 - idx * 1.5, 0]}>
            <Text position={[-3.2, 0.4, 0]} fontSize={0.16} color="white" fontWeight="bold" anchorX="left">
              {item.institution.toUpperCase()}
            </Text>
            <Text position={[-3.2, 0.1, 0]} fontSize={0.13} color="#00f3ff" anchorX="left">
              {item.degree} • {item.duration}
            </Text>
            <Text position={[-3.2, -0.3, 0]} fontSize={0.12} color="#cccccc" maxWidth={6.4} anchorX="left" lineHeight={1.4}>
              {item.details}
            </Text>
          </group>
        ))}

        {/* Experience content */}
        {activeTab === "experience" && resumeData.experience.slice(0, 2).map((item, idx) => (
          <group key={idx} position={[0, 0.7 - idx * 1.4, 0]}>
            <Text position={[-3.2, 0.4, 0]} fontSize={0.16} color="white" fontWeight="bold" anchorX="left">
              {item.role.toUpperCase()}
            </Text>
            <Text position={[-3.2, 0.1, 0]} fontSize={0.13} color="#00f3ff" anchorX="left">
              {item.company} • {item.duration}
            </Text>
            <Text position={[-3.2, -0.28, 0]} fontSize={0.12} color="#cccccc" maxWidth={6.4} anchorX="left" lineHeight={1.3}>
              {item.details}
            </Text>
          </group>
        ))}

        {/* Achievements content */}
        {activeTab === "achievements" && resumeData.achievements.map((item, idx) => (
          <group key={idx} position={[0, 0.6 - idx * 1.0, 0]}>
            <Text position={[-3.2, 0.3, 0]} fontSize={0.15} color="white" fontWeight="bold" anchorX="left">
              • {item.title.toUpperCase()}
            </Text>
            <Text position={[-3.0, -0.05, 0]} fontSize={0.12} color="#cccccc" maxWidth={6.2} anchorX="left" lineHeight={1.4}>
              {item.details}
            </Text>
          </group>
        ))}
      </group>

      {/* Futuristic PDF Download Button */}
      <group position={[0, -1.9, 0.05]}>
        <mesh
          onPointerOver={() => {
            setDownloadHovered(true);
            document.body.style.cursor = 'pointer';
            playHover();
          }}
          onPointerOut={() => {
            setDownloadHovered(false);
            document.body.style.cursor = 'default';
          }}
          onClick={(e) => {
            e.stopPropagation();
            playSuccess();
            window.open('/Jay_Naik_Resume.pdf', '_blank');
          }}
        >
          <planeGeometry args={[4.2, 0.5]} />
          <meshBasicMaterial
            color={downloadHovered ? "#ff3366" : "#00f3ff"}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Neon Border */}
        <mesh>
          <planeGeometry args={[4.3, 0.55]} />
          <meshBasicMaterial color={downloadHovered ? "#ff3366" : "#00f3ff"} wireframe transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>

        <Text
          position={[0, 0, 0.01]}
          fontSize={0.13}
          color={downloadHovered ? "#ff3366" : "#00f3ff"}
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          [ DOWNLOAD OFFICIAL RESUME PDF ]
        </Text>
      </group>
    </group>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei'; 
import HologramScene from './components/HologramScene';
import UI from './components/UI';
import { playGlitch } from './utils/audio';

const MODES = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "RESUME", "CONTACT"];

export default function App() {
  const [mode, setMode] = useState("HOME");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const changeMode = useCallback((direction) => {
    setMode((prevMode) => {
      const currentIndex = MODES.indexOf(prevMode);
      let newIndex = currentIndex + direction;
      if (newIndex < 0) newIndex = MODES.length - 1;
      if (newIndex >= MODES.length) newIndex = 0;
      return MODES[newIndex];
    });
  }, []);

  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 1000;

    const handleWheel = (e) => {
      if (window.innerWidth < 768) return; 
      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;
      if (e.deltaY > 50) { changeMode(1); lastScrollTime = now; }
      else if (e.deltaY < -50) { changeMode(-1); lastScrollTime = now; }
    };

    const handleKey = (e) => {
      if (window.innerWidth < 768) return; 
      if (e.key === "PageDown") changeMode(1);
      if (e.key === "PageUp") changeMode(-1);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [changeMode]);

  // Play a glitch transition sound whenever the mode changes
  useEffect(() => {
    playGlitch();
    setSelectedProject(null);
    // Only reset the skill filter if we navigate away from PROJECTS or SKILLS tabs
    if (mode !== "PROJECTS" && mode !== "SKILLS") {
      setSelectedSkill(null);
    }
  }, [mode]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", position: 'relative' }}>
      
      {/* 1. THE 3D SCENE */}
      <Canvas dpr={[1, 2]}>
        <HologramScene 
          mode={mode} 
          setMode={setMode}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        /> 
      </Canvas>

      {/* 2. THE UI OVERLAY */}
      <UI 
        currentMode={mode} 
        setCurrentMode={setMode} 
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      {/* 3. THE LOADING SCREEN */}
      <Loader 
        containerStyles={{ background: 'black' }} 
        innerStyles={{ background: '#333', width: '200px', height: '10px' }} 
        barStyles={{ background: '#00f3ff', height: '10px' }} 
        dataStyles={{ color: '#00f3ff', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }} 
        dataInterpolation={(p) => `SYSTEM LOADING... ${p.toFixed(0)}%`} 
      />
      
    </div>
  );
}
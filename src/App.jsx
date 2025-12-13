import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei'; // <-- IMPORT THIS
import HologramScene from './components/HologramScene';
import UI from './components/UI';

const MODES = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

export default function App() {
  const [mode, setMode] = useState("HOME");

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

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black", position: 'relative' }}>
      
      {/* 1. THE 3D SCENE */}
      <Canvas dpr={[1, 2]}>
        <HologramScene mode={mode} /> 
      </Canvas>

      {/* 2. THE UI OVERLAY */}
      <UI 
        currentMode={mode} 
        setCurrentMode={setMode} 
      />

      {/* 3. THE LOADING SCREEN (Add this at the bottom) */}
      <Loader 
        containerStyles={{ background: 'black' }} // Black background
        innerStyles={{ background: '#333', width: '200px', height: '10px' }} // Bar container
        barStyles={{ background: '#00f3ff', height: '10px' }} // Cyan progress bar
        dataStyles={{ color: '#00f3ff', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }} // Text style
        dataInterpolation={(p) => `SYSTEM LOADING... ${p.toFixed(0)}%`} // Custom text
      />
      
    </div>
  );
}
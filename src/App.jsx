import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import HologramScene from './components/HologramScene';
import UI from './components/UI';

const MODES = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

export default function App() {
  const [mode, setMode] = useState("HOME");
  // NOTE: controls state removed as it is no longer needed.

  // --- MODE NAVIGATION LOGIC ---
  const changeMode = useCallback((direction) => {
    setMode((prevMode) => {
      const currentIndex = MODES.indexOf(prevMode);
      let newIndex = currentIndex + direction;
      // Loop navigation
      if (newIndex < 0) newIndex = MODES.length - 1;
      if (newIndex >= MODES.length) newIndex = 0;
      return MODES[newIndex];
    });
  }, []);

  // --- PC SCROLL/KEYBOARD LISTENER (Mode Switching ONLY) ---
  useEffect(() => {
    let lastScrollTime = 0;
    const cooldown = 1000;

    const handleWheel = (e) => {
      // Only use scroll for mode switching on PC (large screens)
      if (window.innerWidth < 768) return; 

      const now = Date.now();
      if (now - lastScrollTime < cooldown) return;
      if (e.deltaY > 50) { changeMode(1); lastScrollTime = now; }
      else if (e.deltaY < -50) { changeMode(-1); lastScrollTime = now; }
    };

    // Use PageUp/PageDown for PC keyboard navigation
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
      
      {/* 3D SCENE - Removed controls prop */}
      <Canvas>
        <HologramScene mode={mode} /> 
      </Canvas>

      {/* 2D UI - Removed setControls prop */}
      <UI 
        currentMode={mode} 
        setCurrentMode={setMode} 
      />
      
    </div>
  );
}
import { useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { playSuccess } from '../utils/audio';

const BOOT_LOGS = [
  "INITIALIZING PORTFOLIO CORPUS CORE...",
  "CONNECTING WEBAUDIO SYNTH SYSTEMS... OK",
  "ESTABLISHING GRAPHICS DEVICE BUFFER... OK",
  "TESTING VECTOR GRAPHICS COMPILER... OK",
  "COMPILING 3D TEXTURE MATRICES... IN PROGRESS",
  "DECRYPTING JAY NAIK COGNITIVE LOGS... IN PROGRESS",
  "PARSING B.TECH CSE CREDENTIAL DATA... OK",
  "SPAWNING INTERACTIVE COSMIC PARTICLES... OK",
  "ESTABLISHING WEBGL VIEWPORT COMPILER... OK",
  "DECRYPTION RATING: 100% SECURE",
  "SYSTEM SCAN COMPLETE: 0 ERRORS DETECTED",
  "SECURITY PROTOCOLS LOADED... ACCESS GRANTED"
];

const Bracket = ({ style }) => (
  <div 
    style={{ 
      position: 'absolute', 
      width: '12px', 
      height: '12px', 
      borderColor: '#00f3ff', 
      borderStyle: 'solid', 
      borderWidth: 0, 
      pointerEvents: 'none', 
      ...style 
    }} 
  />
);

export default function CyberLoader() {
  const { progress, active } = useProgress();
  const [logIndex, setLogIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const triggered = useRef(false);

  // Print diagnostics logs line-by-line
  useEffect(() => {
    if (logIndex < BOOT_LOGS.length) {
      const interval = setTimeout(() => {
        setLogIndex((prev) => prev + 1);
      }, 150 + Math.random() * 200); // Varied terminal typing speeds
      return () => clearTimeout(interval);
    }
  }, [logIndex]);

  // Determine if both actual Three.js assets and custom log prints are complete
  const logsComplete = logIndex >= BOOT_LOGS.length;
  const assetsLoaded = progress >= 100 || !active;
  const loaded = logsComplete && assetsLoaded;

  // Handle successful boot transition
  useEffect(() => {
    if (loaded && !triggered.current) {
      triggered.current = true;
      
      // Play ascending success sound
      try {
        playSuccess();
      } catch (e) {
        console.warn("AudioContext block on page start:", e);
      }

      // Exit animations delayed slightly for the user to read ACCESS GRANTED
      const exitTimer = setTimeout(() => {
        setVisible(false);
      }, 900);

      // Unmount component from DOM completely once exit transition ends
      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 1800); // Slide up/Glitch shutter transition takes ~900ms

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [loaded]);

  if (!mounted) return null;

  // Show last 6 logs to simulate scrolling terminal console
  const visibleLogs = BOOT_LOGS.slice(Math.max(0, logIndex - 6), logIndex);

  return (
    <>
      <style>{`
        @keyframes radar-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes radar-pulse {
          0% { opacity: 0.15; transform: scale(0.95); }
          50% { opacity: 0.35; transform: scale(1.05); }
          100% { opacity: 0.15; transform: scale(0.95); }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes boot-shutter-exit {
          0% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            opacity: 1;
            transform: scale(1);
          }
          40% {
            clip-path: polygon(0 47%, 100% 47%, 100% 53%, 0 53%);
            opacity: 0.95;
            transform: scaleY(0.9) skewX(-2deg);
          }
          80% {
            clip-path: polygon(0 49.5%, 100% 49.5%, 100% 50.5%, 0 50.5%);
            opacity: 0.8;
            transform: scaleY(0.1) skewX(8deg);
          }
          100% {
            clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
            opacity: 0;
            transform: scale(0.01);
          }
        }
        .boot-loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #00080c;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          color: #fff;
          box-sizing: border-box;
          user-select: none;
        }
        .boot-loader-exit {
          animation: boot-shutter-exit 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className={`boot-loader-container cyber-grid ${!visible ? 'boot-loader-exit' : ''}`}>
        
        {/* Fullscreen radar sweep grid overlay */}
        <div 
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            border: '1px solid rgba(0, 243, 255, 0.04)',
            borderRadius: '50%',
            opacity: 0.3,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ position: 'absolute', width: '200px', height: '200px', border: '1px solid rgba(0, 243, 255, 0.03)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '100px', height: '100px', border: '1px solid rgba(0, 243, 255, 0.02)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '100%', height: '100%', borderTop: '2px solid rgba(0, 243, 255, 0.08)', borderRadius: '50%', animation: 'radar-spin 8s linear infinite' }} />
        </div>

        {/* Central HUD Panel Box */}
        <div
          style={{
            position: 'relative',
            width: '90%',
            maxWidth: '460px',
            background: 'rgba(0, 4, 6, 0.85)',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            boxShadow: '0 0 25px rgba(0, 243, 255, 0.1)',
            padding: '30px 24px',
            borderRadius: '4px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Edge Bracket markers */}
          <Bracket style={{ borderTopWidth: 2, borderLeftWidth: 2, top: -2, left: -2 }} />
          <Bracket style={{ borderTopWidth: 2, borderRightWidth: 2, top: -2, right: -2 }} />
          <Bracket style={{ borderBottomWidth: 2, borderLeftWidth: 2, bottom: -2, left: -2 }} />
          <Bracket style={{ borderBottomWidth: 2, borderRightWidth: 2, bottom: -2, right: -2 }} />

          {/* Radar Scan Graphic */}
          <div 
            style={{ 
              position: 'relative', 
              width: '70px', 
              height: '70px', 
              margin: '0 auto 20px auto', 
              borderRadius: '50%', 
              border: '1px solid rgba(0, 243, 255, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', borderTop: '2px solid #00f3ff', animation: 'radar-spin 2s linear infinite' }} />
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, transparent 70%)', animation: 'radar-pulse 2s infinite' }} />
            <div style={{ position: 'absolute', width: '10px', height: '1px', background: 'rgba(0, 243, 255, 0.4)' }} />
            <div style={{ position: 'absolute', width: '1px', height: '10px', background: 'rgba(0, 243, 255, 0.4)' }} />
          </div>

          {/* Panel Header */}
          <div 
            style={{ 
              color: '#00f3ff', 
              borderBottom: '1px dashed rgba(0, 243, 255, 0.25)', 
              paddingBottom: '10px', 
              marginBottom: '15px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '11px', 
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            <span>[ J_NAIK.SYS DECRYPT_LOGS ]</span>
            <span className="blink-fast" style={{ color: '#ff3366' }}>[ SYSTEM OVERCLOCK ]</span>
          </div>

          {/* Scrolling Terminal Output logs */}
          <div 
            style={{ 
              minHeight: '120px', 
              background: 'rgba(0, 0, 0, 0.65)', 
              padding: '12px 14px', 
              border: '1px solid rgba(0, 243, 255, 0.15)', 
              fontSize: '10px', 
              color: '#ccc', 
              lineHeight: '1.7', 
              textAlign: 'left', 
              fontFamily: 'monospace', 
              overflow: 'hidden', 
              marginBottom: '20px',
              borderRadius: '2px',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            {visibleLogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#ff3366' }}>&gt;</span>
                <span style={{ color: log.includes('ACCESS GRANTED') || log.includes('SUCCESS') || log.includes('100%') ? '#00ff66' : '#a0d8ff' }}>
                  {log}
                </span>
              </div>
            ))}
            {!loaded && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#ff3366' }}>&gt;</span>
                <span 
                  style={{ 
                    width: '6px', 
                    height: '11px', 
                    background: '#00f3ff', 
                    boxShadow: '0 0 4px #00f3ff',
                    animation: 'cursor-blink 1s infinite', 
                    display: 'inline-block' 
                  }} 
                />
              </div>
            )}
          </div>

          {/* Progress Bar HUD */}
          <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', height: '8px', borderRadius: '4px', border: '1px solid rgba(0, 243, 255, 0.2)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #00f3ff, #ff3366)', boxShadow: '0 0 10px #00f3ff', transition: 'width 0.3s ease-out' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#00f3ff', marginTop: '6px', fontWeight: 'bold', letterSpacing: '1px' }}>
            <span>DECRYPTING DATA MATRIX</span>
            <span style={{ color: '#ff3366' }}>{progress.toFixed(0)}%</span>
          </div>

          {/* Access Banner Overlay */}
          {loaded && (
            <div 
              style={{ 
                color: '#00ff66', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                letterSpacing: '4px', 
                textShadow: '0 0 12px #00ff66', 
                marginTop: '20px', 
                animation: 'cursor-blink 0.5s infinite' 
              }}
            >
              [ ACCESS GRANTED ]
            </div>
          )}
        </div>
      </div>
    </>
  );
}

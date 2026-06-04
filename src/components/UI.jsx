import { useEffect, useState } from "react";
import { playClick, playHover } from "../utils/audio";

export default function UI({ 
  currentMode, 
  setCurrentMode, 
  selectedSkill, 
  setSelectedSkill, 
  selectedProject, 
  setSelectedProject 
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttons = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -45%) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      {/* Cyberpunk HUD Indicator when filtering or selecting a project */}
      {(selectedSkill || selectedProject) && (
        <div
          onClick={() => {
            playClick();
            setSelectedSkill(null);
            setSelectedProject(null);
          }}
          onMouseEnter={playHover}
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 243, 255, 0.08)",
            border: "1px solid #00f3ff",
            color: "#00f3ff",
            fontFamily: "monospace",
            padding: isMobile ? "8px 12px" : "10px 24px",
            borderRadius: "5px",
            fontSize: isMobile ? "10px" : "14px",
            pointerEvents: "auto",
            cursor: "pointer",
            zIndex: 1001,
            backdropFilter: "blur(8px)",
            textAlign: "center",
            boxShadow: "0 0 15px rgba(0, 243, 255, 0.2)",
            letterSpacing: "1px"
          }}
        >
          {selectedSkill && `ACTIVE FILTER: [ ${selectedSkill.toUpperCase()} ] • CLICK TO CLEAR`}
          {selectedProject && `VIEWING DETAIL: [ ${selectedProject.title.toUpperCase()} ] • CLICK TO CLOSE`}
        </div>
      )}

      {/* Futuristic Project Detail Modal Overlay */}
      {selectedProject && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : "600px",
            background: "rgba(0, 8, 12, 0.9)",
            border: "1px solid #00f3ff",
            boxShadow: "0 0 30px rgba(0, 243, 255, 0.35), inset 0 0 15px rgba(0, 243, 255, 0.15)",
            borderRadius: "8px",
            padding: isMobile ? "24px 20px" : "40px",
            zIndex: 1005,
            pointerEvents: "auto",
            backdropFilter: "blur(15px)",
            fontFamily: "monospace",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            animation: "fadeInScale 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0, 243, 255, 0.3)", paddingBottom: "12px" }}>
            <h2 style={{ margin: 0, color: "#00f3ff", fontSize: isMobile ? "18px" : "24px", fontWeight: "bold", letterSpacing: "2px" }}>
              {selectedProject.title.toUpperCase()}
            </h2>
            <button
              onClick={() => {
                playClick();
                setSelectedProject(null);
              }}
              onMouseEnter={playHover}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff3366",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              [X]
            </button>
          </div>

          {/* Description */}
          <p style={{ margin: 0, fontSize: isMobile ? "13px" : "15px", color: "#d0ffff", lineHeight: "1.6", letterSpacing: "0.5px" }}>
            {selectedProject.desc}
          </p>

          {/* Tech stack badge list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
            {/* Split description tags to display them cleanly */}
            {selectedProject.desc.split("//").map((part, idx) => {
              if (idx === 0) return null;
              return part.split("&").map(subpart => subpart.split("+").map(tag => {
                const trimmed = tag.trim();
                if (!trimmed) return null;
                return (
                  <span
                    key={trimmed}
                    style={{
                      border: "1px solid rgba(0, 243, 255, 0.4)",
                      background: "rgba(0, 243, 255, 0.05)",
                      color: "#00f3ff",
                      padding: "4px 8px",
                      borderRadius: "3px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    {trimmed.toUpperCase()}
                  </span>
                );
              }));
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "15px", marginTop: "15px", flexDirection: isMobile ? "column" : "row" }}>
            <a
              href={selectedProject.url}
              target="_blank"
              rel="noreferrer"
              onClick={playSuccess}
              onMouseEnter={playHover}
              style={{
                flex: 1,
                background: "#00f3ff",
                color: "#000",
                textDecoration: "none",
                textAlign: "center",
                padding: "14px",
                fontWeight: "bold",
                fontSize: "14px",
                borderRadius: "4px",
                boxShadow: "0 0 15px rgba(0, 243, 255, 0.3)",
                transition: "all 0.2s",
                display: "inline-block",
                letterSpacing: "1px",
              }}
            >
              LAUNCH PROJECT DEPLOYMENT
            </a>
            <button
              onClick={() => {
                playClick();
                setSelectedProject(null);
              }}
              onMouseEnter={playHover}
              style={{
                flex: isMobile ? "none" : "0 0 120px",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid #ff3366",
                color: "#ff3366",
                cursor: "pointer",
                padding: "14px",
                fontWeight: "bold",
                fontSize: "14px",
                borderRadius: "4px",
                letterSpacing: "1px",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          // Moved up to 80px to safely clear any mobile bottom navigation bars
          bottom: "80px", 
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: isMobile ? "10px" : "20px",
          // High Z-Index to ensure it sits ON TOP of everything
          zIndex: 1000, 
          width: isMobile ? "100%" : "auto", 
          justifyContent: "center",
          flexWrap: "wrap", 
          padding: "0 10px",
          // Add safe area padding for modern phones
          paddingBottom: "env(safe-area-inset-bottom, 20px)",
          pointerEvents: "none",
        }}
      >
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => {
              playClick();
              setCurrentMode(btn);
            }}
            onMouseEnter={() => {
              if (currentMode !== btn) playHover();
            }}
            style={{
              pointerEvents: "auto",
              background:
                currentMode === btn ? "rgba(0, 243, 255, 0.2)" : "rgba(0, 0, 0, 0.6)",
              border: `1px solid ${currentMode === btn ? "#00f3ff" : "#555"}`,
              color: currentMode === btn ? "#00f3ff" : "#ccc",

              padding: isMobile ? "12px 16px" : "15px 40px",
              fontSize: isMobile ? "11px" : "18px",
              fontFamily: "monospace",
              fontWeight: "bold",
              letterSpacing: "1px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              borderRadius: "5px",
              boxShadow:
                currentMode === btn
                  ? "0 0 15px rgba(0, 243, 255, 0.4)"
                  : "0 0 5px rgba(0,0,0,0.5)",
              
              flex: isMobile ? "0 1 auto" : "0 0 auto", 
              marginBottom: isMobile ? "5px" : "0", // Spacing if they wrap
              minWidth: isMobile ? "70px" : "auto",
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </>
  );
}
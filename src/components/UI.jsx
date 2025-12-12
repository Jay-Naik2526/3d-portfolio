import { useEffect, useState } from "react";

export default function UI({ currentMode, setCurrentMode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttons = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];

  return (
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
          onClick={() => setCurrentMode(btn)}
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
  );
}
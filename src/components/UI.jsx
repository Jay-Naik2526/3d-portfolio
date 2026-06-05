import { useEffect, useState } from "react";
import { playClick, playHover, playSuccess } from "../utils/audio";
import { resumeData, myProfile } from "../data";

function DecryptedText({ text, speed = 25, delay = 0 }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_-+=[]{}<>?";
    let iterations = 0;

    setDisplayText(
      text.split("").map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)])).join("")
    );

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (!isMounted) return;

        setDisplayText((prev) => {
          return text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iterations) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        });

        if (iterations >= text.length) {
          clearInterval(interval);
          if (isMounted) setDisplayText(text);
        }

        iterations += 1;
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [text, speed, delay]);

  return <>{displayText}</>;
}

function ProgressBar({ percent }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div
      style={{
        width: "100%",
        height: "6px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "3px",
        overflow: "hidden",
        border: "1px solid rgba(0, 243, 255, 0.2)",
        marginTop: "5px"
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: "100%",
          background: "linear-gradient(90deg, #00f3ff, #ff3366)",
          boxShadow: "0 0 8px #00f3ff",
          transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      />
    </div>
  );
}

export default function UI({ 
  currentMode, 
  setCurrentMode, 
  selectedSkill, 
  setSelectedSkill, 
  selectedProject, 
  setSelectedProject 
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeSubTab, setActiveSubTab] = useState("logs");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttons = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "RESUME", "CONTACT"];

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
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes hud-scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes text-glitch {
          0% { text-shadow: 1px 1px 0px rgba(0,243,255,0.4), -1px -1px 0px rgba(255,51,102,0.4); }
          50% { text-shadow: -1px 1px 0px rgba(0,243,255,0.4), 1px -1px 0px rgba(255,51,102,0.4); }
          100% { text-shadow: 1px 1px 0px rgba(0,243,255,0.4), -1px -1px 0px rgba(255,51,102,0.4); }
        }
        @keyframes hud-blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .hud-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(0, 243, 255, 0.3);
          box-shadow: 0 0 10px #00f3ff;
          opacity: 0.4;
          pointer-events: none;
          animation: hud-scanline 8s linear infinite;
          z-index: 10;
        }
        .cyber-grid {
          background-image: 
            radial-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 0),
            radial-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 0);
          background-size: 16px 16px;
          background-position: 0 0, 8px 8px;
        }
        .glitch-text {
          animation: text-glitch 4s infinite;
        }
        .blink-fast {
          animation: hud-blink 1.5s infinite;
        }
        .hud-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .hud-sidebar::-webkit-scrollbar-track {
          background: rgba(0, 243, 255, 0.01);
        }
        .hud-sidebar::-webkit-scrollbar-thumb {
          background: #00f3ff;
          box-shadow: 0 0 5px #00f3ff;
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

      {/* Cyberpunk HUD Inventory Resume Sidebar */}
      {currentMode === "RESUME" && (
        <div
          className="hud-sidebar cyber-grid"
          onWheel={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: isMobile ? "100%" : "480px",
            height: "100vh",
            background: "linear-gradient(180deg, rgba(0, 8, 12, 0.95) 0%, rgba(0, 3, 5, 0.98) 100%)",
            borderLeft: "2px solid #00f3ff",
            boxShadow: "-10px 0 35px rgba(0, 243, 255, 0.25)",
            zIndex: 999,
            pointerEvents: "auto",
            backdropFilter: "blur(25px)",
            fontFamily: "monospace",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            animation: "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            overflowY: "auto",
            boxSizing: "border-box",
            padding: "30px 24px 140px 24px"
          }}
        >
          {/* Cyber scanline tracer */}
          <div className="hud-scanline" />

          {/* Corner brackets overlay */}
          <div style={{ position: "absolute", top: "10px", left: "10px", color: "rgba(0, 243, 255, 0.3)", fontSize: "12px", pointerEvents: "none" }}>┌</div>
          <div style={{ position: "absolute", top: "10px", right: "10px", color: "rgba(0, 243, 255, 0.3)", fontSize: "12px", pointerEvents: "none" }}>┐</div>

          {/* Header */}
          <div style={{ borderBottom: "1px dashed rgba(0, 243, 255, 0.4)", paddingBottom: "15px", marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="blink-fast" style={{ color: "#ff3366", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px" }}>
                [ DECRYPTING PROFILE... ]
              </span>
              <span style={{ color: "#00f3ff", fontSize: "11px", fontWeight: "bold", border: "1px solid #00f3ff", padding: "1px 6px", borderRadius: "3px", boxShadow: "0 0 5px rgba(0, 243, 255, 0.4)" }}>
                SYS_STATUS: NOMINAL
              </span>
            </div>
            <h1 className="glitch-text" style={{ margin: "10px 0 2px 0", fontSize: "28px", fontWeight: "bold", color: "#00f3ff", letterSpacing: "2px", textShadow: "0 0 10px rgba(0, 243, 255, 0.5)" }}>
              JAY NAIK
            </h1>
            <span style={{ fontSize: "12px", color: "#888", letterSpacing: "1.5px" }}>COGNITIVE ACCESS // LEVEL 02 ENCRYPTED DATA</span>

            {/* Simulated diagnostic metrics */}
            <div style={{ display: "flex", gap: "15px", color: "#00f3ff", opacity: 0.7, fontSize: "10px", marginTop: "12px", fontFamily: "monospace" }}>
              <span>CORPUS: J_NAIK.DAT</span>
              <span>DECRYPT_RATE: 99.85%</span>
              <span>PING: 32ms</span>
              <span>SEC: OK</span>
            </div>
          </div>

          {/* Sub-tabs Navigation HUD */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
            {[
              { id: "logs", label: "DATA_LOGS" },
              { id: "skills", label: "TECH_MATRX" },
              { id: "achievements", label: "OPERATIONS" },
              { id: "system", label: "SYS_INFO" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClick();
                  setActiveSubTab(tab.id);
                }}
                onMouseEnter={playHover}
                style={{
                  flex: "1 1 calc(50% - 6px)",
                  background: activeSubTab === tab.id ? "rgba(0, 243, 255, 0.15)" : "rgba(0, 0, 0, 0.5)",
                  border: `1px solid ${activeSubTab === tab.id ? "#00f3ff" : "rgba(0, 243, 255, 0.2)"}`,
                  color: activeSubTab === tab.id ? "#00f3ff" : "#888",
                  padding: "8px 10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  borderRadius: "3px",
                  boxShadow: activeSubTab === tab.id ? "0 0 10px rgba(0, 243, 255, 0.2)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {activeSubTab === tab.id ? `[ ${tab.label} ]` : tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div style={{ flex: 1 }}>
            
            {/* TAB 1: LOGS (Education & Experience) */}
            {activeSubTab === "logs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeInScale 0.2s ease-out" }}>
                
                {/* Education Section */}
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="01 // EDUCATION_TIMELINE" /> ]
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {resumeData.education.map((edu, idx) => (
                      <div 
                        key={idx} 
                        style={{ borderLeft: "2px solid rgba(0, 243, 255, 0.3)", paddingLeft: "12px", marginLeft: "4px" }}
                        onMouseEnter={playHover}
                      >
                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{edu.institution}</div>
                        <div style={{ fontSize: "12px", color: "#ff3366", margin: "2px 0 4px 0", fontWeight: "bold" }}>{edu.degree}</div>
                        <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{edu.duration}</div>
                        <div style={{ fontSize: "12px", color: "#aaa", lineHeight: "1.4" }}>{edu.details}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <h3 style={{ margin: "10px 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="02 // PROFESSIONAL_LOGS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    {resumeData.experience.map((exp, idx) => (
                      <div 
                        key={idx} 
                        style={{ borderLeft: "2px solid #00f3ff", paddingLeft: "15px", marginLeft: "6px", position: "relative" }}
                        onMouseEnter={playHover}
                      >
                        {/* Timeline blinking node */}
                        <div 
                          style={{ 
                            position: "absolute", 
                            left: "-5px", 
                            top: "4px", 
                            width: "8px", 
                            height: "8px", 
                            borderRadius: "50%", 
                            background: idx % 2 === 0 ? "#00f3ff" : "#ff3366", 
                            boxShadow: `0 0 8px ${idx % 2 === 0 ? "#00f3ff" : "#ff3366"}` 
                          }} 
                        />
                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>{exp.role}</div>
                        <div style={{ fontSize: "11px", color: "#888", margin: "2px 0 6px 0" }}>{exp.company} • {exp.duration}</div>
                        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#ccc", display: "flex", flexDirection: "column", gap: "5px", lineHeight: "1.4" }}>
                          {exp.details.map((detail, dIdx) => (
                            <li key={dIdx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS MATRIX */}
            {activeSubTab === "skills" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeInScale 0.2s ease-out" }}>
                
                {/* Core Stack Competencies (Progress Bars) */}
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="01 // CORE_STACK_LEVELS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { name: "React.js / Next.js", level: 92 },
                      { name: "JavaScript / TypeScript", level: 88 },
                      { name: "IoT Systems (ESP32, MQTT)", level: 85 },
                      { name: "Python / Flask backend", level: 80 },
                      { name: "Database Systems (SQL, MongoDB)", level: 75 },
                      { name: "Developer Tools (Git, Vercel)", level: 90 }
                    ].map((skill, idx) => (
                      <div key={idx} onMouseEnter={playHover}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#aaa" }}>
                          <span>{skill.name.toUpperCase()}</span>
                          <span style={{ color: "#00f3ff", fontWeight: "bold" }}>{skill.level}%</span>
                        </div>
                        <ProgressBar percent={skill.level} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Skills Matrix Grid */}
                <div>
                  <h3 style={{ margin: "10px 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="02 // SKILLS_CATEGORIES" /> ]
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Object.entries(resumeData.skillsMatrix).map(([category, list]) => (
                      <div 
                        key={category}
                        style={{ 
                          border: "1px solid rgba(0, 243, 255, 0.15)", 
                          background: "rgba(0, 243, 255, 0.01)",
                          padding: "10px 12px", 
                          borderRadius: "4px",
                          position: "relative"
                        }}
                      >
                        {/* Mini brackets inside grid block */}
                        <div style={{ position: "absolute", top: "4px", right: "6px", color: "rgba(0, 243, 255, 0.3)", fontSize: "8px" }}>[ {category.toUpperCase()} ]</div>
                        <div style={{ fontWeight: "bold", fontSize: "11px", color: "#ff3366", letterSpacing: "1px", marginBottom: "6px" }}>
                          &gt; {category.toUpperCase()}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {list.map((skill) => (
                            <span
                              key={skill}
                              onMouseEnter={playHover}
                              style={{
                                border: "1px solid rgba(0, 243, 255, 0.3)",
                                background: "rgba(0, 243, 255, 0.04)",
                                color: "#00f3ff",
                                padding: "3px 6px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                transition: "all 0.15s"
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = "rgba(0, 243, 255, 0.15)";
                                e.target.style.borderColor = "#00f3ff";
                                e.target.style.transform = "scale(1.05)";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = "rgba(0, 243, 255, 0.04)";
                                e.target.style.borderColor = "rgba(0, 243, 255, 0.3)";
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div>
                  <h3 style={{ margin: "10px 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="03 // BEHAVIORAL_PROTOCOLS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {resumeData.softSkills.map((soft) => (
                      <span
                        key={soft}
                        onMouseEnter={playHover}
                        style={{
                          border: "1px solid rgba(255, 51, 102, 0.3)",
                          background: "rgba(255, 51, 102, 0.04)",
                          color: "#ff3366",
                          padding: "4px 8px",
                          borderRadius: "3px",
                          fontSize: "10px",
                          fontWeight: "bold"
                        }}
                      >
                        // {soft.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: OPERATIONS (Achievements & Live Stats) */}
            {activeSubTab === "achievements" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeInScale 0.2s ease-out" }}>
                
                {/* Completed Missions */}
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="01 // COMPLETED_MISSIONS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {resumeData.achievements.map((ach, idx) => (
                      <div 
                        key={idx}
                        onMouseEnter={playHover}
                        style={{
                          border: "1px dashed rgba(0, 243, 255, 0.3)",
                          background: "rgba(0, 243, 255, 0.02)",
                          padding: "12px",
                          borderRadius: "4px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "13px", color: "#fff", marginBottom: "4px" }}>
                          <span style={{ color: "#ff3366" }}>[SUCCESS]</span> {ach.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#ccc", lineHeight: "1.4" }}>{ach.details}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Deployments Diagnostic Live Stats */}
                <div 
                  style={{
                    border: "1px solid #00f3ff",
                    background: "rgba(0, 10, 15, 0.9)",
                    boxShadow: "0 0 15px rgba(0, 243, 255, 0.15)",
                    padding: "15px",
                    borderRadius: "4px",
                    fontFamily: "monospace"
                  }}
                  onMouseEnter={playHover}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0, 243, 255, 0.3)", paddingBottom: "6px", marginBottom: "10px", fontSize: "11px", fontWeight: "bold" }}>
                    <span style={{ color: "#00f3ff" }}>&gt; NET_DEPLOYMENT_FEED</span>
                    <span className="blink-fast" style={{ color: "#00ff66" }}>● LIVE</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", color: "#aaa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>SERVED TRAFFIC:</span>
                      <span style={{ color: "#fff", fontWeight: "bold" }}>500+ ACTIVE VISITORS</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>MAX CONCURRENCY:</span>
                      <span style={{ color: "#fff", fontWeight: "bold" }}>244 CONNECTIONS</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>EVENT UP-TIME:</span>
                      <span style={{ color: "#00ff66", fontWeight: "bold" }}>100.00%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>DB STATUS:</span>
                      <span style={{ color: "#00f3ff" }}>ESTABLISHED (MongoDB)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SYSTEM INFO (Spoken Languages, Interests, Contact) */}
            {activeSubTab === "system" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeInScale 0.2s ease-out" }}>
                
                {/* Contact Coordinates */}
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="01 // PHYSICAL_COORDINATES" /> ]
                  </h3>
                  <div 
                    style={{ 
                      border: "1px solid rgba(0, 243, 255, 0.2)", 
                      background: "rgba(0, 243, 255, 0.02)", 
                      padding: "12px", 
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "12px"
                    }}
                  >
                    <div>
                      <span style={{ color: "#ff3366", fontWeight: "bold" }}>LOC: </span>
                      <span style={{ color: "#fff" }}>{resumeData.additional.location || "Navsari, Gujarat, India"}</span>
                    </div>
                    <div>
                      <span style={{ color: "#ff3366", fontWeight: "bold" }}>TEL: </span>
                      <a href={`tel:${myProfile.phone}`} style={{ color: "#00f3ff", textDecoration: "none" }} onMouseEnter={playHover}>{myProfile.phone}</a>
                    </div>
                    <div>
                      <span style={{ color: "#ff3366", fontWeight: "bold" }}>COM: </span>
                      <a href={`mailto:${myProfile.email}`} style={{ color: "#00f3ff", textDecoration: "none" }} onMouseEnter={playHover}>{myProfile.email}</a>
                    </div>
                  </div>
                </div>

                {/* Spoken Languages */}
                <div>
                  <h3 style={{ margin: "10px 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="02 // COMMUNICATION_PROTOCOLS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {resumeData.additional.languages.map((lang) => (
                      <span
                        key={lang}
                        onMouseEnter={playHover}
                        style={{
                          border: "1px solid rgba(0, 243, 255, 0.3)",
                          background: "rgba(0, 243, 255, 0.04)",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "3px",
                          fontSize: "11px",
                          fontWeight: "bold"
                        }}
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 style={{ margin: "10px 0 12px 0", color: "#00f3ff", fontSize: "13px", letterSpacing: "1px" }}>
                    [ <DecryptedText text="03 // SUBROUTINES_&_INTERESTS" /> ]
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {resumeData.additional.interests.map((interest) => (
                      <span
                        key={interest}
                        onMouseEnter={playHover}
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          background: "rgba(255, 255, 255, 0.03)",
                          color: "#aaa",
                          padding: "4px 8px",
                          borderRadius: "3px",
                          fontSize: "10px"
                        }}
                      >
                        {interest.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Diagnostics activity stream */}
                <div style={{ fontSize: "9px", fontFamily: "monospace", color: "rgba(0, 243, 255, 0.4)", lineHeight: "1.4", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "10px" }}>
                  <div>&gt; INITIALIZING SECURE SHELL... DONE</div>
                  <div>&gt; LINKING RESUME FILE PATH... PUBLIC/JAY_NAIK_RESUME.PDF</div>
                  <div>&gt; SYNTHESIZER OSCILLATORS... ACTIVE (GAIN: 0.12)</div>
                  <div>&gt; DECRYPTING RESUME CREDENTIALS STREAM... SUCCESS</div>
                </div>
              </div>
            )}
          </div>

          {/* Initiate PDF print button */}
          <div
            onClick={playSuccess}
            onMouseEnter={playHover}
            style={{
              marginTop: "30px",
              pointerEvents: "auto",
              cursor: "pointer"
            }}
          >
            <a
              href="/Jay_Naik_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                border: "1px solid #ff3366",
                background: "rgba(255, 51, 102, 0.1)",
                color: "#ff3366",
                boxShadow: "0 0 15px rgba(255, 51, 102, 0.25), inset 0 0 8px rgba(255, 51, 102, 0.1)",
                padding: "15px",
                textAlign: "center",
                fontWeight: "bold",
                letterSpacing: "2px",
                fontSize: "13px",
                textDecoration: "none",
                borderRadius: "4px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 51, 102, 0.2)";
                e.target.style.boxShadow = "0 0 25px rgba(255, 51, 102, 0.4)";
                e.target.style.borderColor = "#ff3366";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 51, 102, 0.1)";
                e.target.style.boxShadow = "0 0 15px rgba(255, 51, 102, 0.25)";
              }}
            >
              [ INITIATE PDF PRINT / DOWNLOAD ]
            </a>
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
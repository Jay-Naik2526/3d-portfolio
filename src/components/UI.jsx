export default function UI({ currentMode, setCurrentMode }) {
    // NOTE: setControls is removed as the buttons are gone.
    
    const isMobile = window.innerWidth < 768;
  
    const buttons = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"];
  
    return (
      <>
        {/* 1. MAIN NAVIGATION BUTTONS (Visible on ALL screens) */}
        <div style={{
            position: 'absolute', 
            bottom: '30px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            display: 'flex', 
            gap: isMobile ? '5px' : '20px', 
            zIndex: 10, 
            width: isMobile ? '95%' : 'auto', 
            justifyContent: 'center', 
            flexWrap: isMobile ? 'wrap' : 'nowrap', 
            padding: '0 5px', 
            pointerEvents: 'none' 
        }}>
            {buttons.map((btn) => (
                <button
                    key={btn}
                    onClick={() => setCurrentMode(btn)}
                    style={{
                        pointerEvents: 'auto',
                        background: currentMode === btn ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                        border: `1px solid ${currentMode === btn ? '#00f3ff' : '#444'}`,
                        color: currentMode === btn ? '#00f3ff' : '#888',
                        
                        padding: isMobile ? '8px 8px' : '15px 40px', 
                        fontSize: isMobile ? '10px' : '18px',
                        fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '1px',
                        cursor: 'pointer', backdropFilter: 'blur(10px)', borderRadius: '5px',
                        boxShadow: currentMode === btn ? '0 0 15px rgba(0, 243, 255, 0.4)' : 'none',
                        
                        flexGrow: isMobile ? 1 : 0, 
                        minWidth: isMobile ? '50px' : 'auto'
                    }}
                >
                    {btn}
                </button>
            ))}
        </div>
        {/* ALL SLIDING ARROW BUTTONS REMOVED */}
      </>
    );
  }
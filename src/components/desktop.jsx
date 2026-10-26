// Desktop — icon layer of the OS
// Lives inside the screen frame div — coordinates are relative to the screen area.
// Icons positioned below the taskbar (taskbarHeightPct offset).

function DesktopIcon({ label, symbol, onDoubleClick }) {
  return (
    <div
      onDoubleClick={onDoubleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 6,
        width: 52,
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div style={{
        width: 26,
        height: 26,
        border: "1px solid #00ff41",
        backgroundColor: "#0a0a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "#00ff41",
        boxShadow: "0 0 4px rgba(0,255,65,0.35)",
        fontFamily: "monospace",
        flexShrink: 0,
      }}>
        {symbol}
      </div>
      <span style={{
        color: "#00ff41",
        fontSize: 7,
        textAlign: "center",
        fontFamily: "opendyslexic, monospace",
        textShadow: "0 0 5px rgba(0,255,65,0.8)",
        lineHeight: 1.3,
        maxWidth: 50,
        wordBreak: "break-word",
      }}>
        {label}
      </span>
    </div>
  )
}

export default function Desktop({ openWindow, taskbarHeightPct }) {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",  // pass-through by default
    }}>
      {/* Icon column — top-left, below the taskbar */}
      <div style={{
        position: "absolute",
        top: `${taskbarHeightPct + 1}%`,
        left: "1%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        pointerEvents: "auto",  // icons are interactive
      }}>
        <DesktopIcon
          label="scripted.exe"
          symbol="►"
          onDoubleClick={() => openWindow('scriptedexe', 'scripted.exe')}
        />
        <DesktopIcon
          label="doug's pretzel factory"
          symbol="∞"
          onDoubleClick={() => openWindow('dougpretfac', "doug's pretzel factory")}
        />
      </div>
    </div>
  )
}

// Desktop — icon layer of the OS
// Receives openWindow from screen.jsx and passes the call up to App.jsx
// Each DesktopIcon double-click opens a window via openWindow(appId, title)

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
        width: 56,
        cursor: "default",
        userSelect: "none",
      }}
    >
      {/* Icon graphic — placeholder ASCII box, swap for <img> later */}
      <div style={{
        width: 28,
        height: 28,
        border: "1px solid #00ff41",
        backgroundColor: "#0a0a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: "#00ff41",
        boxShadow: "0 0 4px rgba(0,255,65,0.4)",
        fontFamily: "monospace",
      }}>
        {symbol}
      </div>

      {/* Icon label */}
      <span style={{
        color: "#00ff41",
        fontSize: 7,
        textAlign: "center",
        fontFamily: "opendyslexic, monospace",
        textShadow: "0 0 6px rgba(0,255,65,0.9)",
        lineHeight: 1.3,
        maxWidth: 54,
        wordBreak: "break-word",
      }}>
        {label}
      </span>
    </div>
  )
}

export default function Desktop({ openWindow }) {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
    }}>
      {/* Icon column — top-left of screen area */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "2%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
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

// WindowBox — generic window chrome for cathedral_OS
// Props:
//   title    — string shown in the title bar
//   onClose  — called when the X button is clicked
//   children — the app component rendered inside the window body

export default function WindowBox({ title, onClose, children }) {
  return (
    <div style={{
      position: "absolute",
      top: "18%",
      left: "12%",
      width: "50%",
      minWidth: 200,
      backgroundColor: "#0a0a1a",
      border: "1px solid #009191",
      boxShadow: "0 0 10px rgba(0,145,145,0.3), 2px 2px 0 #000",
      zIndex: 203,
      fontFamily: "opendyslexic, monospace",
    }}>

      {/* ── TITLE BAR ──────────────────────────────────────────────────── */}
      <div style={{
        background: "#ffffff",
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "default",
        userSelect: "none",
      }}>
        <span style={{
          color: "#000000",
          fontWeight: "bold",
          fontSize: 9,
          fontFamily: "opendyslexic, monospace",
        }}>
          {title}
        </span>

        {/* Window control buttons */}
        <div style={{ display: "flex", gap: 2 }}>
          {/* Minimize — not yet wired */}
          <button style={{
            width: 11, height: 11,
            fontSize: 7, padding: 0,
            cursor: "pointer",
            background: "#d4d4d4",
            border: "1px solid #888",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            _
          </button>

          {/* Maximize — not yet wired */}
          <button style={{
            width: 11, height: 11,
            fontSize: 7, padding: 0,
            cursor: "pointer",
            background: "#d4d4d4",
            border: "1px solid #888",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            □
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              width: 11, height: 11,
              fontSize: 7, padding: 0,
              cursor: "pointer",
              background: "#cc0000",
              border: "1px solid #880000",
              color: "#ffffff",
              fontWeight: "bold",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── APP CONTENT ────────────────────────────────────────────────── */}
      <div style={{
        padding: 8,
        color: "#00ff41",
        fontSize: 9,
        minHeight: 80,
      }}>
        {children}
      </div>

    </div>
  )
}

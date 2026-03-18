export default function DebugPanel({ screenState, setScreenState, loop, setLoop, loopTarget, setLoopTarget }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 10,
      right: 10,
      background: "rgba(0,0,0,0.9)",
      border: "1px solid #00ff41",
      padding: "10px",
      zIndex: 99999,
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#00ff41",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minWidth: "160px",
    }}>
      <div style={{ marginBottom: "4px", letterSpacing: "0.1em" }}>DEBUG</div>
      <div style={{ color: "#00a829", marginBottom: "6px" }}>state: {screenState}</div>

      {['off', 'crt_on', 'booting', 'on', 'shutting_down'].map(s => (
        <button key={s} onClick={() => setScreenState(s)} style={{
          background: screenState === s ? "#00ff41" : "transparent",
          color: screenState === s ? "#000" : "#00ff41",
          border: "1px solid #00ff41",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: "10px",
          padding: "2px 6px",
          textAlign: "left",
        }}>
          {s}
        </button>
      ))}

      <div style={{ borderTop: "1px solid #003b10", margin: "4px 0" }} />

      <button onClick={() => setLoop(l => !l)} style={{
        background: loop ? "#00ff41" : "transparent",
        color: loop ? "#000" : "#00ff41",
        border: "1px solid #00ff41",
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: "10px",
        padding: "2px 6px",
        textAlign: "left",
      }}>
        loop: {loop ? "ON" : "OFF"}
      </button>

      {loop && (
        <>
          <div style={{ color: "#00a829", fontSize: "10px" }}>loop target:</div>
          {['crt_on', 'booting', 'on', 'shutting_down'].map(s => (
            <button key={s} onClick={() => setLoopTarget(s)} style={{
              background: loopTarget === s ? "#00a829" : "transparent",
              color: loopTarget === s ? "#000" : "#00a829",
              border: "1px solid #00a829",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: "10px",
              padding: "2px 6px",
              textAlign: "left",
            }}>
              {loopTarget === s ? "► " : "  "}{s}
            </button>
          ))}
          <div style={{ color: "#003b10", fontSize: "9px", marginTop: "2px" }}>
            loops back to {loopTarget}
          </div>
        </>
      )}
    </div>
  )
}
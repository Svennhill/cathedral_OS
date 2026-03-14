export default function Window() {
  return (
    <div style={{
      position: "relative",
      width: 320,
      backgroundColor: "#1a1a2e",
      border: "1px solid #009191",
      boxShadow: "2px 2px 0px #000000",
      zIndex: 200,
    }}>
      <div style={{
        background: "white",
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "black", fontWeight: "bold", fontSize: 9 }}>
          scripted.exe
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          <button style={{ width: 10, height: 10, fontSize: 6, padding: 0, cursor: "pointer" }}>_</button>
          <button style={{ width: 10, height: 10, fontSize: 6, padding: 0, cursor: "pointer" }}>□</button>
          <button style={{ width: 10, height: 10, fontSize: 6, padding: 0, cursor: "pointer" }}>X</button>
        </div>
      </div>
    </div>
  )
}
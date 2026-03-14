export default function App() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(to bottom, #24d6e7, #2e0901)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "opendyslexic, monospace",
    }}>
            {/*this is the window*/}
      <div style={{
        width: 666,
        backgroundColor: "#1a1a2e",
        border: "2px solid #009191",
        boxShadow: "4px 4px 0px #000000",
      }}>
        {/*TITLE BAR*/}
        <div  style={{
          background: "url('/background_OS.jpg')",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ color: "white", fontWeight: "bold", fontSize: 13}}>
            scripted.exe
          </span>
          <div style={{ display:"flex", gap: 4 }}>
            <button>_</button>
            <button>□</button>
            <button>X</button>
          </div>
        </div>
      </div>
    </div>  
  )
}
export default function Bezel({ powered, volume, knobAngle, handleKnobDown, handleKnobUp, setPowered }) {
  return (
    <>
      {/* VOLUME KNOB — behind bezel */}
      <div
        onMouseDown={handleKnobDown}
        onMouseUp={handleKnobUp}
        onMouseLeave={handleKnobUp}
        style={{
          position: "absolute",
          bottom: "27.22%",
          right: "5%",
          width: "13%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        <img src="/volume_knob.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${knobAngle}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }} />
      </div>

      {/* BEZEL */}
      <img src="/bezel.png" style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        objectFit: "fill",
        pointerEvents: "none",
        zIndex: 111,
      }} />

      {/* LED METER */}
      <div style={{
        position: "absolute",
        bottom: "41%",
        right: "5.2%",
        display: "flex",
        flexDirection: "column-reverse",
        gap: "3px",
        zIndex: 115,
        pointerEvents: "none",
      }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const lit = i < Math.round(volume * 10)
          return (
            <img key={i}
              src={lit ? "/led_on.png" : "/led_off.png"}
              style={{ width: "17px", height: "17px", pointerEvents: "none" }}
            />
          )
        })}
      </div>

      {/* POWER ON BUTTON */}
      {powered && (
        <img src="/power_on.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 112,
        }} />
      )}

      {/* POWER CLICK ZONE */}
      <div
        onClick={() => setPowered(prev => !prev)}
        style={{
          position: "absolute",
          bottom: "4%",
          left: "1%",
          width: "18%",
          height: "12%",
          cursor: "pointer",
          zIndex: 116,
        }}
      />
    </>
  )
}
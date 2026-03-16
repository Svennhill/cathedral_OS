export default function Bezel({ screenState, volume, knobAngle, handleKnobDown, handleKnobUp, setPowered }) {
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
          zIndex: 200,
        }}
      >
        <img src="/knobs/volume_knob_h_d.png" style={{
  width: "100%", height: "100%",
  transform: `rotate(${knobAngle}deg)`,
  transformOrigin: "center center",
  transition: "transform 0.1s ease-out",
  pointerEvents: "none",
}} />
      </div>

      {/* BEZEL */}
      <img src="/bezeld.png" style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        objectFit: "fill",
        pointerEvents: "none",
        zIndex: 300,
      }} />

      {/* LED METER */}
      <div style={{
        position: "absolute",
        bottom: "41%",
        right: "5.2%",
        display: "flex",
        flexDirection: "column-reverse",
        gap: "3px",
        zIndex: 315,
        pointerEvents: "none",
      }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const lit = i < Math.round(volume * 10)
          return (
            <img key={i}
              src={lit ? "/lights/led_on.png" : "/lights/led_off.png"}
              style={{ width: "17px", height: "17px", pointerEvents: "none" }}
            />
          )
        })}
      </div>

      {/* POWER ON BUTTON */}
      {(screenState === 'on' || screenState === 'shutting_down' )&& (
        <img src="/screen/power_on.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 312,
        }} />
      )}

      {/* POWER CLICK ZONE */}
      <div
        onClick={setPowered}
        style={{
          position: "absolute",
          bottom: "4%",
          left: "1%",
          width: "18%",
          height: "12%",
          cursor: "pointer",
          zIndex: 316,
        }}
      />
    </>
  )
}
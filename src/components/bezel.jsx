import { useState, } from "react"


export default function Bezel({ screenState, volume, knobAngle, handleKnobDown, handleKnobUp, setPowered, luminanceAngle, handleLuminanceDown, handleLuminanceUp, densityAngle, handleDensityDown, handleDensityUp, clarityAngle, handleClarityDown, handleClarityUp, illuminateAngle, handleIlluminateDown, handleIlluminateUp, alignAngle, handleAlignDown, handleAlignUp }) {
  const [jdzPlugged, setJdzPlugged] = useState(false)
  const [jdzUnPlugged, setJdzUnPlugged] = useState(false)

const handleJdzClick = () => {
  const newState = !jdzPlugged
  setJdzPlugged(newState)
  const sfx = new Audio(newState ? '/audio/JDZ_wire_sound.mp3' : '/audio/JDZ_wire_sound.mp3')
  sfx.volume = 0.1
  sfx.play().catch(() => {})
}
  return (
    <>
      {/* VOLUME KNOB */}
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

      {/* LUMINANCE DIAL */}
      <div
        onMouseDown={handleLuminanceDown}
        onMouseUp={handleLuminanceUp}
        onMouseLeave={handleLuminanceUp}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "24%",
          width: "6%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 317,
        }}
      >
        <img src="/knobs/dial_1.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${luminanceAngle}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }} />
      </div>

      {/* DENSITY DIAL */}
      <div
        onMouseDown={handleDensityDown}
        onMouseUp={handleDensityUp}
        onMouseLeave={handleDensityUp}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "39.5%",
          width: "6%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 317,
        }}
      >
        <img src="/knobs/dial_2.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${densityAngle}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }} />
      </div>

      {/* CLARITY DIAL */}
      <div
        onMouseDown={handleClarityDown}
        onMouseUp={handleClarityUp}
        onMouseLeave={handleClarityUp}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "55.5%",
          width: "6%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 317,
        }}
      >
        <img src="/knobs/dial_3.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${clarityAngle}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }} />
      </div>

      {/* ILLUMINATE DIAL */}
      <div
        onMouseDown={handleIlluminateDown}
        onMouseUp={handleIlluminateUp}
        onMouseLeave={handleIlluminateUp}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "72.5%",
          width: "6%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 317,
        }}
      >
        <img src="/knobs/dial_4.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${illuminateAngle}deg)`,
          transformOrigin: "center center",
          pointerEvents: "none",
        }} />
      </div>

      {/* ALIGN DIAL */}
      <div
        onMouseDown={handleAlignDown}
        onMouseUp={handleAlignUp}
        onMouseLeave={handleAlignUp}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "88.5%",
          width: "6%",
          aspectRatio: "1",
          cursor: "pointer",
          zIndex: 317,
        }}
      >
        <img src="/knobs/dial_5.png" style={{
          width: "100%", height: "100%",
          transform: `rotate(${alignAngle}deg)`,
          transformOrigin: "center center",
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

      {/* JDZ WIRE — shows when plugged in */}
      {jdzPlugged && (
        <img src="/bezel/JDZ_wire.png" style={{
          position: "absolute",
          top: 1265, left: 740,
          
          width: "20%", height: "20%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 301,
        }} />
      )}

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
      {(screenState === 'crt_on' || screenState === 'on') && (
        <img src="/screen/power_ond.png" style={{
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

      {/* JDZ CLICK ZONE — just right of clarity dial */}
      <div
        onClick={handleJdzClick}
        style={{
          position: "absolute",
          bottom: "9%",
          left: "65%",
          width: "4%",
          height: "5%",
          cursor: "pointer",
          zIndex: 316,
        }}
      />
    </>
  )
}
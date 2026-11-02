import { useState } from "react"

// ── EASTER EGG STUB: SCREW CLICKER ───────────────────────────────────────
// Each screw has an independent click counter.
// At 11 clicks: screw begins unscrewing animation (stub)
// At 22 clicks: screw falls out
// When BOTH screws fall out: bezel pull-off sequence triggers (TODO)
// See: EASTER_EGG_SCREW in the click handler below
// ---
// To implement later:
//   1. Add screwAngle state per screw (rotate on each click 11-22)
//   2. At 22, render "screw_missing.png" overlay
//   3. When both at 22, trigger bezel-removal animation

// ── JDZ JACK GEOMETRY ────────────────────────────────────────────────────
// One anchor for both the click zone and the wire graphic, so the cord
// always plugs into the jack drawn on bezeld.png.
const BEZEL_W = 2208, BEZEL_H = 2427
const JDZ_JACK = { x: 1486, y: 2141 }     // jack centre, bezeld.png px
const JDZ_ZONE = { w: 88, h: 121 }        // click zone size, bezeld.png px
// JDZ_wire.png is 383×336 with the plug head pointing up; the head's face
// is centred at (230, 55). Scaled so the head just covers the jack ring.
const WIRE_IMG   = { w: 383, h: 336, plugX: 230, plugY: 55 }
const WIRE_SCALE = 1.12

const pctX = (px) => `${(px / BEZEL_W) * 100}%`
const pctY = (px) => `${(px / BEZEL_H) * 100}%`

const JDZ_ZONE_STYLE = {
  left:   pctX(JDZ_JACK.x - JDZ_ZONE.w / 2),
  top:    pctY(JDZ_JACK.y - JDZ_ZONE.h / 2),
  width:  pctX(JDZ_ZONE.w),
  height: pctY(JDZ_ZONE.h),
}
const JDZ_WIRE_STYLE = {
  left:   pctX(JDZ_JACK.x - WIRE_IMG.plugX * WIRE_SCALE),
  top:    pctY(JDZ_JACK.y - WIRE_IMG.plugY * WIRE_SCALE),
  width:  pctX(WIRE_IMG.w * WIRE_SCALE),
  height: pctY(WIRE_IMG.h * WIRE_SCALE),
}

export default function Bezel({
  screenState, volume,
  knobAngle, handleKnobDown, handleKnobUp,
  setPowered,
  luminanceAngle,  handleLuminanceDown,  handleLuminanceUp,
  densityAngle,    handleDensityDown,    handleDensityUp,
  clarityAngle,    handleClarityDown,    handleClarityUp,
  illuminateAngle, handleIlluminateDown, handleIlluminateUp,
  alignAngle,      handleAlignDown,      handleAlignUp,
  dimensions,  // { width, height } in CSS px — used to scale fixed elements
}) {
  const [jdzPlugged, setJdzPlugged] = useState(false)

  // Easter egg screw counters (stub — see note above)
  const [leftScrewClicks,  setLeftScrewClicks]  = useState(0)
  const [rightScrewClicks, setRightScrewClicks] = useState(0)

  const handleJdzClick = () => {
    const newState = !jdzPlugged
    setJdzPlugged(newState)
    const sfx = new Audio('/audio/JDZ_wire_sound.mp3')
    sfx.volume = 0.1
    sfx.play().catch(() => {})
  }

  const handleScrewClick = (side) => {
    if (side === 'left') {
      setLeftScrewClicks(n => {
        const next = n + 1
        // EASTER_EGG_SCREW: at 22 both screws out → trigger something cool
        if (next === 22) console.log('[EASTER EGG] Left screw fell out!')
        return next
      })
    } else {
      setRightScrewClicks(n => {
        const next = n + 1
        if (next === 22) console.log('[EASTER EGG] Right screw fell out!')
        return next
      })
    }
  }

  // LED size: scale with bezel px width so it doesn't shift with browser zoom.
  // At native bezel width (2208px) each LED is 17px.
  // dimensions.width is the actual scaled CSS px width → scale proportionally.
  const ledSize = dimensions ? Math.round(dimensions.width * (17 / 2208)) : 17

  return (
    <>
      {/* VOLUME KNOB */}
      <div
        onMouseDown={handleKnobDown}
        onMouseUp={handleKnobUp}
        onMouseLeave={handleKnobUp}
        style={{
          position: "absolute",
          bottom: "27.22%", right: "5%",
          width: "13%", aspectRatio: "1",
          cursor: "pointer", zIndex: 200,
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
      <div onMouseDown={handleLuminanceDown} onMouseUp={handleLuminanceUp} onMouseLeave={handleLuminanceUp}
        style={{ position: "absolute", bottom: "6%", left: "24%", width: "6%", aspectRatio: "1", cursor: "pointer", zIndex: 317 }}>
        <img src="/knobs/dial_1.png" style={{ width: "100%", height: "100%", transform: `rotate(${luminanceAngle}deg)`, transformOrigin: "center", pointerEvents: "none" }} />
      </div>

      {/* DENSITY DIAL */}
      <div onMouseDown={handleDensityDown} onMouseUp={handleDensityUp} onMouseLeave={handleDensityUp}
        style={{ position: "absolute", bottom: "6%", left: "39.5%", width: "6%", aspectRatio: "1", cursor: "pointer", zIndex: 317 }}>
        <img src="/knobs/dial_2.png" style={{ width: "100%", height: "100%", transform: `rotate(${densityAngle}deg)`, transformOrigin: "center", pointerEvents: "none" }} />
      </div>

      {/* CLARITY DIAL */}
      <div onMouseDown={handleClarityDown} onMouseUp={handleClarityUp} onMouseLeave={handleClarityUp}
        style={{ position: "absolute", bottom: "6%", left: "55.5%", width: "6%", aspectRatio: "1", cursor: "pointer", zIndex: 317 }}>
        <img src="/knobs/dial_3.png" style={{ width: "100%", height: "100%", transform: `rotate(${clarityAngle}deg)`, transformOrigin: "center", pointerEvents: "none" }} />
      </div>

      {/* ILLUMINATE DIAL */}
      <div onMouseDown={handleIlluminateDown} onMouseUp={handleIlluminateUp} onMouseLeave={handleIlluminateUp}
        style={{ position: "absolute", bottom: "6%", left: "72.5%", width: "6%", aspectRatio: "1", cursor: "pointer", zIndex: 317 }}>
        <img src="/knobs/dial_4.png" style={{ width: "100%", height: "100%", transform: `rotate(${illuminateAngle}deg)`, transformOrigin: "center", pointerEvents: "none" }} />
      </div>

      {/* ALIGN DIAL */}
      <div onMouseDown={handleAlignDown} onMouseUp={handleAlignUp} onMouseLeave={handleAlignUp}
        style={{ position: "absolute", bottom: "6%", left: "88.5%", width: "6%", aspectRatio: "1", cursor: "pointer", zIndex: 317 }}>
        <img src="/knobs/dial_5.png" style={{ width: "100%", height: "100%", transform: `rotate(${alignAngle}deg)`, transformOrigin: "center", pointerEvents: "none" }} />
      </div>

      {/* BEZEL IMAGE */}
      <img src="/bezeld.png" style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        objectFit: "fill", pointerEvents: "none", zIndex: 300,
      }} />

      {/* JDZ WIRE — plug head sits on the JDZ jack (same anchor as the click zone);
          the cord runs down off the bottom edge of the bezel */}
      {jdzPlugged && (
        <img src="/bezel/JDZ_wire.png" style={{
          position: "absolute",
          ...JDZ_WIRE_STYLE,
          objectFit: "fill", pointerEvents: "none", zIndex: 301,
        }} />
      )}

      {/* LED METER — ledSize scales with bezel px width, not browser zoom */}
      <div style={{
        position: "absolute",
        bottom: "41%", right: "5.2%",
        display: "flex", flexDirection: "column-reverse",
        gap: `${ledSize * 0.18}px`,
        zIndex: 315, pointerEvents: "none",
      }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const lit = i < Math.round(volume * 10)
          return (
            <img
              key={i}
              src={lit ? "/lights/led_on.png" : "/lights/led_off.png"}
              style={{ width: ledSize, height: ledSize, display: "block", pointerEvents: "none" }}
            />
          )
        })}
      </div>

      {/* POWER ON INDICATOR */}
      {(screenState === 'crt_on' || screenState === 'on') && (
        <img src="/screen/power_ond.png" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill", pointerEvents: "none", zIndex: 312,
        }} />
      )}

      {/* POWER CLICK ZONE */}
      <div onClick={setPowered} style={{
        position: "absolute", bottom: "4%", left: "1%",
        width: "18%", height: "12%",
        cursor: "pointer", zIndex: 316,
      }} />

      {/* JDZ CLICK ZONE — centred on the jack */}
      <div onClick={handleJdzClick} style={{
        position: "absolute",
        ...JDZ_ZONE_STYLE,
        cursor: "pointer", zIndex: 316,
      }} />

      {/* ── SCREW EASTER EGG CLICK ZONES (invisible, no cursor change) ── */}
      {/* Bottom-left screw */}
      <div onClick={() => handleScrewClick('left')} style={{
        position: "absolute", bottom: "3%", left: "0.5%",
        width: "3%", height: "4%",
        cursor: "default", zIndex: 316,
      }} />
      {/* Bottom-right screw */}
      <div onClick={() => handleScrewClick('right')} style={{
        position: "absolute", bottom: "3%", right: "0.5%",
        width: "3%", height: "4%",
        cursor: "default", zIndex: 316,
      }} />
    </>
  )
}

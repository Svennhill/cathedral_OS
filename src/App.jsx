import { useState, useEffect, useRef } from "react"
import Bezel from "./components/bezel"
import Desktop from "./components/desktop"

export default function App() {
  const [powered, setPowered] = useState(false)
  const [knobAngle, setKnobAngle] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)
  const knobIntervalRef = useRef(null)

  useEffect(() => {
    if (!powered) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [powered])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  const handleKnobDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isTopHalf = e.clientY - rect.top < rect.height / 2
    const adjust = () => {
      setVolume(prev => Math.min(1, Math.max(0, isTopHalf ? prev + 0.03 : prev - 0.03)))
      setKnobAngle(prev => isTopHalf ? prev - 15 : prev + 15)
    }
    adjust()
    knobIntervalRef.current = setInterval(adjust, 150)
  }

  const handleKnobUp = () => clearInterval(knobIntervalRef.current)

  const height = window.innerHeight
  const width = height * (2208 / 2427)

  return (
    <>
      <audio ref={audioRef} src="/powered_off.wav" loop />
      <div style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          position: "relative",
          width: width,
          height: height,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "opendyslexic, monospace",
          overflow: "hidden",
          flexShrink: 0,
        }}>

          {/* BLACK BASE */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "#000",
            zIndex: 0,
          }} />

          {/* SCREEN CONTENT */}
          {powered ? (
            <>
              <img src="/background_OS.png" style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
                zIndex: 102,
              }} />
              <Desktop />
            </>
          ) : (
            <img src="/screen_off.png" style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "fill",
              pointerEvents: "none",
              zIndex: 101,
            }} />
          )}

          {/* BEZEL + CONTROLS */}
          <Bezel
            powered={powered}
            setPowered={setPowered}
            volume={volume}
            knobAngle={knobAngle}
            handleKnobDown={handleKnobDown}
            handleKnobUp={handleKnobUp}
          />

        </div>
      </div>
    </>
  )
}
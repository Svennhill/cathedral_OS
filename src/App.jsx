import { useState, useEffect, useRef } from "react"
import Bezel from "./components/bezel"
import Screen from "./components/screen"

export default function App() {
  const [screenState, setScreenState] = useState('off')
  const [knobAngle, setKnobAngle] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)
  const knobIntervalRef = useRef(null)
const [dimensions, setDimensions] = useState({
  height: window.innerHeight,
  width: window.innerHeight * (2208 / 2427)
})

useEffect(() => {
  const handleResize = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerHeight * (2208 / 2427)
    })
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

  useEffect(() => {
    if (screenState === 'on') {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [screenState])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  const handleKnobDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isTopHalf = e.clientY - rect.top < rect.height / 2
    const adjust = () => {
      setVolume(prev => Math.min(1, Math.max(0, isTopHalf ? prev + 0.03 : prev - 0.03)))
      setKnobAngle(isTopHalf ? -15 : 15)
    }
    adjust()
    knobIntervalRef.current = setInterval(adjust, 150)
  }

  const handleKnobUp = () => {
  clearInterval(knobIntervalRef.current)
  setKnobAngle(0)
}
  const handlePowerClick = () => {
  if (screenState === 'off') setScreenState('crt_on')
  if (screenState === 'on') setScreenState('shutting_down')
  }



  return (
    <>
  
      <audio ref={audioRef} src="/OS/music_OS.wav" loop />
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
          width: dimensions.width,
          height: dimensions.height,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "opendyslexic, monospace",
          overflow: "hidden",
          flexShrink: 0,
          //canvas div ^
        }}>

          <Screen screenState={screenState} setScreenState={setScreenState} />

          {/* BEZEL + CONTROLS */}
          <Bezel
            screenState={screenState}
            volume={volume}
            knobAngle={knobAngle}
            handleKnobDown={handleKnobDown}
            handleKnobUp={handleKnobUp}
            setPowered={handlePowerClick}
          />

        </div>
      </div>
    </>
  )
}
import { useState, useEffect, useRef } from "react" //import to bring code from another file, {} to bring specific named tools
//useState-stores a value that can change(screen updates when value is changed)
//useEffect-runs code when something specific changes
//useRef-holds 
import Bezel from "./components/bezel"
//imports the Bezel tool from the location ./c...etc
import Screen from "./components/screen"
//same
import DebugPanel from "./components/debugpanel"
//same

export default function App() {
  const [screenState, setScreenState] = useState('off')
  const [knobAngle, setKnobAngle] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [luminance, setLuminance] = useState(1)
  const [luminanceAngle, setLuminanceAngle] = useState(0)
  const [density, setDensity] = useState(1)
  const [densityAngle, setDensityAngle] = useState(0)
  const [clarity, setClarity] = useState(0)
  const [clarityAngle, setClarityAngle] = useState(0)
  const [illuminate, setIlluminate] = useState(0)
  const [illuminateAngle, setIlluminateAngle] = useState(0)
  const [align, setAlign] = useState(0)
  const [alignAngle, setAlignAngle] = useState(0)
  const [debugLoop, setDebugLoop] = useState(false)
  const [debugLoopTarget, setDebugLoopTarget] = useState('booting')
  const [bootKey, setBootKey] = useState(0)
  const audioRef = useRef(null)
  const knobIntervalRef = useRef(null)
  const luminanceIntervalRef = useRef(null)
  const densityIntervalRef = useRef(null)
  const clarityIntervalRef = useRef(null)
  const illuminateIntervalRef = useRef(null)
  const alignIntervalRef = useRef(null)
  const containerRef = useRef(null)
  const [openWindows, setOpenWindows] = useState([])

function openWindow(appId, title) {
  if (openWindows.length > 0) return // one window at a time for now
  setOpenWindows([{ id: appId, title: title }])
}

function closeWindow(appId) {
  setOpenWindows(openWindows.filter(w => w.id !== appId))
}

  const [dimensions, setDimensions] = useState(() => {
    const scale = Math.min(
      window.innerWidth / 2208,
      window.innerHeight / 2427
    )
    return {
      height: 2427 * scale,
      width: 2208 * scale
    }
  })

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const scale = Math.min(width / 2208, height / 2427)
        setDimensions({
          height: 2427 * scale,
          width: 2208 * scale
        })
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
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
    audioRef.current.volume = volume * 0.6 // 0.6 = base music volume, adjust here
  }, [volume])

  useEffect(() => {
    const unlock = () => {
      const ctx = new AudioContext()
      ctx.resume()
      document.removeEventListener('click', unlock)
    }
    document.addEventListener('click', unlock)
    return () => document.removeEventListener('click', unlock)
  }, [])

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

  const handleLuminanceDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isRightHalf = e.clientX - rect.left > rect.width / 2
    const adjust = () => {
      setLuminance(prev => {
        const next = Math.min(1, Math.max(0, isRightHalf ? prev + 0.03 : prev - 0.03))
        if (next !== prev) setLuminanceAngle(a => isRightHalf ? Math.min(0, a + 15) : a - 15)
        return next
      })
    }
    adjust()
    luminanceIntervalRef.current = setInterval(adjust, 150)
  }

  const handleLuminanceUp = () => clearInterval(luminanceIntervalRef.current)

  const handleDensityDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isRightHalf = e.clientX - rect.left > rect.width / 2
    const adjust = () => {
      setDensity(prev => {
        const next = Math.min(2, Math.max(0, isRightHalf ? prev + 0.03 : prev - 0.03))
        if (next !== prev) setDensityAngle(a => isRightHalf ? a + 15 : a - 15)
        return next
      })
    }
    adjust()
    densityIntervalRef.current = setInterval(adjust, 150)
  }

  const handleDensityUp = () => clearInterval(densityIntervalRef.current)

  const handleClarityDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isRightHalf = e.clientX - rect.left > rect.width / 2
    const adjust = () => {
      setClarity(prev => {
        const next = Math.min(10, Math.max(0, isRightHalf ? prev + 0.2 : prev - 0.2))
        if (next !== prev) setClarityAngle(a => isRightHalf ? a + 15 : a - 15)
        return next
      })
    }
    adjust()
    clarityIntervalRef.current = setInterval(adjust, 150)
  }

  const handleClarityUp = () => clearInterval(clarityIntervalRef.current)

  const handleIlluminateDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isRightHalf = e.clientX - rect.left > rect.width / 2
    const adjust = () => {
      setIlluminate(prev => {
        const next = Math.min(1, Math.max(0, isRightHalf ? prev + 0.03 : prev - 0.03))
        if (next !== prev) setIlluminateAngle(a => isRightHalf ? a + 15 : a - 15)
        return next
      })
    }
    adjust()
    illuminateIntervalRef.current = setInterval(adjust, 150)
  }

  const handleIlluminateUp = () => clearInterval(illuminateIntervalRef.current)

  const handleAlignDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isRightHalf = e.clientX - rect.left > rect.width / 2
    const adjust = () => {
      setAlign(prev => {
        const next = Math.min(1, Math.max(0, isRightHalf ? prev + 0.03 : prev - 0.03))
        if (next !== prev) setAlignAngle(a => isRightHalf ? a + 15 : a - 15)
        return next
      })
    }
    adjust()
    alignIntervalRef.current = setInterval(adjust, 150)
  }

  const handleAlignUp = () => clearInterval(alignIntervalRef.current)

  const handlePowerClick = () => {
    if (screenState === 'off') {
      setBootKey(k => k + 1)
      setScreenState('crt_on')
    }
    if (screenState === 'on') {
      setOpenWindows([])
      setScreenState('shutting_down')
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/OS/music_OSnolongerplaysfornowuntilideletethissection.wav" loop />
      <div ref={containerRef} style={{
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
        }}>

          <Screen
            screenState={screenState}
            setScreenState={setScreenState}
            luminance={luminance}
            density={density}
            clarity={clarity}
            illuminate={illuminate}
            align={align}
            setIlluminate={setIlluminate}
            debugLoop={debugLoop}
            debugLoopTarget={debugLoopTarget}
            bootKey={bootKey}
            setBootKey={setBootKey}
            openWindows={openWindows}
            openWindow={openWindow}
            closeWindow={closeWindow}
          />

          <Bezel
            screenState={screenState}
            volume={volume}
            knobAngle={knobAngle}
            handleKnobDown={handleKnobDown}
            handleKnobUp={handleKnobUp}
            setPowered={handlePowerClick}
            luminanceAngle={luminanceAngle}
            handleLuminanceDown={handleLuminanceDown}
            handleLuminanceUp={handleLuminanceUp}
            densityAngle={densityAngle}
            handleDensityDown={handleDensityDown}
            handleDensityUp={handleDensityUp}
            clarityAngle={clarityAngle}
            handleClarityDown={handleClarityDown}
            handleClarityUp={handleClarityUp}
            illuminateAngle={illuminateAngle}
            handleIlluminateDown={handleIlluminateDown}
            handleIlluminateUp={handleIlluminateUp}
            alignAngle={alignAngle}
            handleAlignDown={handleAlignDown}
            handleAlignUp={handleAlignUp}
          />

        </div>
      </div>

      {import.meta.env.DEV && (
        <DebugPanel
          screenState={screenState}
          setScreenState={setScreenState}
          loop={debugLoop}
          setLoop={setDebugLoop}
          loopTarget={debugLoopTarget}
          setLoopTarget={setDebugLoopTarget}
        />
      )}
    </>
  )
}
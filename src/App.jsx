import { useState, useEffect, useRef } from "react"
import Bezel from "./components/bezel"
import Screen from "./components/screen"
import DebugPanel from "./components/debugpanel"
import {
  BEZEL_W, BEZEL_H,
  SO_OVERLAY_TOP, SO_OVERLAY_LEFT, SO_OVERLAY_WIDTH, SO_OVERLAY_HEIGHT,
} from "./utils/screenConstants"

const DEFAULT_WIN  = { x: 5, y: 8, width: 55, height: 60 }
const STACK_OFFSET = 3

export default function App() {
  // ── SCREEN STATE ───────────────────────────────────────────────────────
  const [screenState, setScreenState] = useState('off')
  const [bootKey, setBootKey]         = useState(0)
  const [debugLoop, setDebugLoop]     = useState(false)
  const [debugLoopTarget, setDebugLoopTarget] = useState('booting')

  // ── DEBUG OVERRIDE ─────────────────────────────────────────────────────
  // false by default in production. Toggled via COS → Settings → Debug (passcode 2079).
  // Also always true in dev mode so the panel is available during development.
  const [debugEnabled, setDebugEnabled] = useState(() => !!import.meta.env.DEV)

  // ── DISPLAY KNOBS ──────────────────────────────────────────────────────
  const [volume,        setVolume]        = useState(0.5)
  const [luminance,     setLuminance]     = useState(1)
  const [luminanceAngle, setLuminanceAngle] = useState(0)
  const [density,       setDensity]       = useState(1)
  const [densityAngle,  setDensityAngle]  = useState(0)
  const [clarity,       setClarity]       = useState(0)
  const [clarityAngle,  setClarityAngle]  = useState(0)
  const [illuminate,    setIlluminate]    = useState(0)
  const [illuminateAngle, setIlluminateAngle] = useState(0)
  const [align,         setAlign]         = useState(0)
  const [alignAngle,    setAlignAngle]    = useState(0)
  const [knobAngle,     setKnobAngle]     = useState(0)

  // ── MUSIC ──────────────────────────────────────────────────────────────
  const [musicPaused, setMusicPaused] = useState(false)
  const audioRef = useRef(null)

  // ── ACCESSIBILITY ──────────────────────────────────────────────────────
  // alwaysScreenOnly: persists — determines startup default
  const [alwaysScreenOnly, setAlwaysScreenOnly] = useState(() => {
    try { return localStorage.getItem('alwaysScreenOnly') === 'true' } catch { return false }
  })
  // screenOnly: session-scoped — not written to localStorage
  const [screenOnly, setScreenOnly] = useState(
    () => { try { return localStorage.getItem('alwaysScreenOnly') === 'true' } catch { return false } }
  )
  const [greyscale, setGreyscale] = useState(() => {
    try { return localStorage.getItem('greyscale') === 'true' } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('alwaysScreenOnly', alwaysScreenOnly) } catch {}
  }, [alwaysScreenOnly])
  useEffect(() => {
    try { localStorage.setItem('greyscale', greyscale) } catch {}
  }, [greyscale])

  // ── WINDOW MANAGEMENT ──────────────────────────────────────────────────
  const [openWindows, setOpenWindows] = useState([])

  function openWindow(appId, title) {
    if (openWindows.some(w => w.id === appId)) {
      setOpenWindows(prev => prev.map(w => w.id === appId ? { ...w, minimized: false } : w))
      return
    }
    const stackIdx = openWindows.length
    setOpenWindows(prev => [...prev, {
      id: appId, title,
      minimized: false, maximized: false,
      x: DEFAULT_WIN.x + stackIdx * STACK_OFFSET,
      y: DEFAULT_WIN.y + stackIdx * STACK_OFFSET,
      width: DEFAULT_WIN.width, height: DEFAULT_WIN.height,
    }])
  }

  const closeWindow   = (id) => setOpenWindows(prev => prev.filter(w => w.id !== id))
  const minimizeWindow = (id) => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true }        : w))
  const maximizeWindow = (id) => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))
  const restoreWindow  = (id) => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false }       : w))
  const updateWindowPos  = (id, x, y)      => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, x, y }           : w))
  const updateWindowSize = (id, width, height) => setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w))

  // ── BEZEL SCALING ──────────────────────────────────────────────────────
  // ALWAYS scale against 2208×2427 (full bezel).
  // In screen-only mode, an outer clip container shrinks to SO_BEZEL size
  // and the inner full-bezel div is shifted so the screen area fills it.
  const containerRef = useRef(null)

  const calcDimensions = (w, h) => {
    const scale = Math.min(w / BEZEL_W, h / BEZEL_H)
    return { width: BEZEL_W * scale, height: BEZEL_H * scale }
  }

  const [dimensions, setDimensions] = useState(() =>
    calcDimensions(window.innerWidth, window.innerHeight)
  )

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        setDimensions(calcDimensions(width, height))
      }
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  // ── SCREEN-ONLY CLIP GEOMETRY ─────────────────────────────────────────
  // In SO mode, clip the outer container to just the screen + 50px frame,
  // and shift the inner full-bezel div left/up so the screen area fills it.
  // This eliminates the large black margins without needing new asset files.
  const soWidth  = SO_OVERLAY_WIDTH  * dimensions.width
  const soHeight = SO_OVERLAY_HEIGHT * dimensions.height
  const soLeft   = SO_OVERLAY_LEFT   * dimensions.width
  const soTop    = SO_OVERLAY_TOP    * dimensions.height

  // ── AUDIO ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return
    if (screenState === 'on' && !musicPaused) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
      if (screenState !== 'on') audioRef.current.currentTime = 0
    }
  }, [screenState, musicPaused])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume * 0.6
  }, [volume])

  useEffect(() => {
    const unlock = () => { new AudioContext().resume(); document.removeEventListener('click', unlock) }
    document.addEventListener('click', unlock)
    return () => document.removeEventListener('click', unlock)
  }, [])

  // ── KNOB HANDLERS ──────────────────────────────────────────────────────
  const knobIntervalRef       = useRef(null)
  const luminanceIntervalRef  = useRef(null)
  const densityIntervalRef    = useRef(null)
  const clarityIntervalRef    = useRef(null)
  const illuminateIntervalRef = useRef(null)
  const alignIntervalRef      = useRef(null)

  const handleKnobDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const up = e.clientY - rect.top < rect.height / 2
    const adjust = () => {
      setVolume(p => Math.min(1, Math.max(0, up ? p + 0.03 : p - 0.03)))
      setKnobAngle(up ? -15 : 15)
    }
    adjust()
    knobIntervalRef.current = setInterval(adjust, 150)
  }
  const handleKnobUp = () => { clearInterval(knobIntervalRef.current); setKnobAngle(0) }

  const makeDial = (setter, angleSetter, min, max, step, ref) => ({
    down: (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const right = e.clientX - rect.left > rect.width / 2
      const adjust = () => setter(prev => {
        const next = Math.min(max, Math.max(min, right ? prev + step : prev - step))
        if (next !== prev) angleSetter(a => right ? a + 15 : a - 15)
        return next
      })
      adjust()
      ref.current = setInterval(adjust, 150)
    },
    up: () => clearInterval(ref.current),
  })

  const lumDial  = makeDial(setLuminance,  setLuminanceAngle,  0, 1,  0.03, luminanceIntervalRef)
  const denDial  = makeDial(setDensity,    setDensityAngle,    0, 2,  0.03, densityIntervalRef)
  const claDial  = makeDial(setClarity,    setClarityAngle,    0, 10, 0.2,  clarityIntervalRef)
  const illDial  = makeDial(setIlluminate, setIlluminateAngle, 0, 1,  0.03, illuminateIntervalRef)
  const aliDial  = makeDial(setAlign,      setAlignAngle,      0, 1,  0.03, alignIntervalRef)

  // ── POWER ──────────────────────────────────────────────────────────────
  const handlePowerClick = () => {
    if (screenState === 'off') { setBootKey(k => k + 1); setScreenState('crt_on') }
    if (screenState === 'on')  { setOpenWindows([]); setScreenState('shutting_down') }
  }

  const appFilter = greyscale ? 'saturate(0)' : undefined

  // ── SHARED SCREEN + BEZEL CONTENT ─────────────────────────────────────
  const screenContent = (
    <>
      <Screen
        screenState={screenState}    setScreenState={setScreenState}
        luminance={luminance}        density={density}
        clarity={clarity}            illuminate={illuminate}
        align={align}                setIlluminate={setIlluminate}
        debugLoop={debugLoop}        debugLoopTarget={debugLoopTarget}
        bootKey={bootKey}            setBootKey={setBootKey}
        openWindows={openWindows}    openWindow={openWindow}
        closeWindow={closeWindow}    minimizeWindow={minimizeWindow}
        maximizeWindow={maximizeWindow} restoreWindow={restoreWindow}
        updateWindowPos={updateWindowPos} updateWindowSize={updateWindowSize}
        volume={volume}              musicPaused={musicPaused}
        toggleMusic={() => setMusicPaused(p => !p)}
        screenOnly={screenOnly}      setScreenOnly={setScreenOnly}
        alwaysScreenOnly={alwaysScreenOnly} setAlwaysScreenOnly={setAlwaysScreenOnly}
        greyscale={greyscale}        setGreyscale={setGreyscale}
        debugEnabled={debugEnabled}  setDebugEnabled={setDebugEnabled}
      />

      {!screenOnly && (
        <Bezel
          screenState={screenState}
          volume={volume}
          knobAngle={knobAngle}
          handleKnobDown={handleKnobDown}
          handleKnobUp={handleKnobUp}
          setPowered={handlePowerClick}
          luminanceAngle={luminanceAngle}
          handleLuminanceDown={lumDial.down} handleLuminanceUp={lumDial.up}
          densityAngle={densityAngle}
          handleDensityDown={denDial.down}   handleDensityUp={denDial.up}
          clarityAngle={clarityAngle}
          handleClarityDown={claDial.down}   handleClarityUp={claDial.up}
          illuminateAngle={illuminateAngle}
          handleIlluminateDown={illDial.down} handleIlluminateUp={illDial.up}
          alignAngle={alignAngle}
          handleAlignDown={aliDial.down}     handleAlignUp={aliDial.up}
          dimensions={dimensions}
        />
      )}

      {screenOnly && (
        <img
          src="/screenOnlyBezel.png"
          style={{
            position: "absolute",
            top:    `${SO_OVERLAY_TOP    * 100}%`,
            left:   `${SO_OVERLAY_LEFT   * 100}%`,
            width:  `${SO_OVERLAY_WIDTH  * 100}%`,
            height: `${SO_OVERLAY_HEIGHT * 100}%`,
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 300,
          }}
        />
      )}
    </>
  )

  return (
    <>
      <audio ref={audioRef} src="/OS/music_OSnolongerplaysfornowuntilideletethissection.wav" loop />

      {/* Full-page viewport container — ResizeObserver watches this */}
      <div ref={containerRef} style={{
        width: "100vw", height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: appFilter,
      }}>
        {/* ── OUTER CLIP CONTAINER ───────────────────────────────────
            In normal mode: full bezel dimensions (2208×2427 scaled).
            In screen-only mode: clips to SO_BEZEL size (1736×1417 scaled),
            eliminating the large black margins above/below the screen area.
        ────────────────────────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          width:    screenOnly ? soWidth  : dimensions.width,
          height:   screenOnly ? soHeight : dimensions.height,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {/* ── INNER FULL-BEZEL CONTENT ─────────────────────────────
              Always 2208×2427 scaled. In SO mode, shifted up/left so
              the screen area (PCT) aligns with the outer container's origin.
              All asset percentages remain correct — nothing needs to change.
          ─────────────────────────────────────────────────────────── */}
          <div style={{
            position: "absolute",
            top:  screenOnly ? -soTop  : 0,
            left: screenOnly ? -soLeft : 0,
            width:  dimensions.width,
            height: dimensions.height,
          }}>
            {screenContent}
          </div>
        </div>
      </div>

      {/* Debug panel — visible in dev mode OR when enabled via passcode */}
      {debugEnabled && (
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

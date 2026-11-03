import { useState, useEffect, useRef } from "react"
import Bezel from "./components/bezel"
import Screen from "./components/screen"
import DebugPanel from "./components/debugpanel"
import { BEZEL_W, BEZEL_H, PCT, screenOnlyBox, ZOOM_DEFAULT, clampZoom } from "./utils/screenConstants"
import {
  usePhoneLayout, isPhoneNow, usePhoneZoomGuard, PHONE_CSS,
} from "./utils/phoneLayout"

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

  // ── PHONE LAYOUT ───────────────────────────────────────────────────────
  // Below the phone breakpoint (utils/phoneLayout.js) the screen content gets
  // touch sizes and browser pinch zoom is held off inside the app.
  const phone = usePhoneLayout()
  usePhoneZoomGuard(phone)

  // ── ACCESSIBILITY ──────────────────────────────────────────────────────
  // alwaysPref: the owner's EXPLICIT "Always load Screen Only" choice —
  // true / false, or null when none was ever made. Persists.
  // ("false" alone was written on every load before, so it only counts as a
  // choice once the alwaysScreenOnlySet marker says a toggle wrote it.)
  const [alwaysPref, setAlwaysPref] = useState(readAlwaysPref)
  // With no explicit choice, a phone starts in Screen Only and a desktop
  // doesn't (the device at load decides; resizing later never flips it).
  const [phoneAtLoad] = useState(isPhoneNow)
  const alwaysScreenOnly    = alwaysPref ?? phoneAtLoad
  const setAlwaysScreenOnly = (v) => setAlwaysPref(Boolean(v))
  // screenOnly: session-scoped — not written to localStorage
  const [screenOnly, setScreenOnly] = useState(() => readAlwaysPref() ?? isPhoneNow())
  const [greyscale, setGreyscale] = useState(() => {
    try { return localStorage.getItem('greyscale') === 'true' } catch { return false }
  })

  useEffect(() => {
    if (alwaysPref === null) return   // no choice made — nothing to save
    try {
      localStorage.setItem('alwaysScreenOnly', alwaysPref)
      localStorage.setItem('alwaysScreenOnlySet', 'true')
    } catch {}
  }, [alwaysPref])
  useEffect(() => {
    try { localStorage.setItem('greyscale', greyscale) } catch {}
  }, [greyscale])

  // ── ZOOM ───────────────────────────────────────────────────────────────
  // Two independent zooms (1 = 100% = the original look):
  //   desktopZoom — desktop icons and their labels only
  //   windowZoom  — the content area of open application windows only
  const readZoom = (key) => {
    try { return clampZoom(parseFloat(localStorage.getItem(key)) || ZOOM_DEFAULT) } catch { return ZOOM_DEFAULT }
  }
  const [desktopZoom, setDesktopZoom] = useState(() => readZoom('desktopZoom'))
  const [windowZoom,  setWindowZoom]  = useState(() => readZoom('windowZoom'))
  useEffect(() => {
    try { localStorage.setItem('desktopZoom', desktopZoom) } catch {}
  }, [desktopZoom])
  useEffect(() => {
    try { localStorage.setItem('windowZoom', windowZoom) } catch {}
  }, [windowZoom])

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
      // Phone layout: windows open filling the screen (□ still restores them)
      minimized: false, maximized: phone,
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
  // Normal mode: the full 2208×2427 bezel is scaled uniformly to fit the window.
  // Screen-only mode: the same full-bezel layer is scaled so its SCREEN area
  // exactly fills the window (see screenOnlyBox) and the bezel falls outside
  // the clip. Every layer is positioned in % of that layer, so nothing else
  // needs to know which mode is active.
  const containerRef = useRef(null)

  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth, height: window.innerHeight,
  }))

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect
        setViewport({ width, height })
      }
    })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const fitScale   = Math.min(viewport.width / BEZEL_W, viewport.height / BEZEL_H)
  const dimensions = { width: BEZEL_W * fitScale, height: BEZEL_H * fitScale }
  const soBox      = screenOnlyBox(viewport.width, viewport.height)
  // The screen area's size in px (normal: inside the scaled bezel; SO: the window)
  const frame = screenOnly
    ? { w: viewport.width, h: viewport.height }
    : { w: dimensions.width * PCT.width, h: dimensions.height * PCT.height }

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
        desktopZoom={desktopZoom}    setDesktopZoom={setDesktopZoom}
        windowZoom={windowZoom}      setWindowZoom={setWindowZoom}
        phone={phone}                frame={frame}
      />

      {/* ── SCREEN-ONLY POWER ─────────────────────────────────
          Screen Only hides the bezel and its power switch, so the
          powered-off screen carries its own power control. Shown in
          every state where the device is off and the switch is hidden.
      ────────────────────────────────────────────────────────────── */}
      {screenOnly && screenState === 'off' && (
        <div style={{
          position: "absolute",
          top:    `${PCT.top    * 100}%`,
          left:   `${PCT.left   * 100}%`,
          width:  `${PCT.width  * 100}%`,
          height: `${PCT.height * 100}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 210,
          pointerEvents: "none",
        }}>
          <button
            onClick={handlePowerClick}
            aria-label="Power on"
            title="Power on"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              background: "rgba(5,5,16,0.85)",
              border: "1px solid #00ff41",
              borderRadius: 0,
              boxShadow: "0 0 10px rgba(0,255,65,0.35)",
              color: "#00ff41",
              fontFamily: "opendyslexic, monospace",
              fontSize: 14,
              fontWeight: "bold",
              letterSpacing: "0.15em",
              textShadow: "0 0 6px rgba(0,255,65,0.6)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>⏻</span>
            POWER
          </button>
        </div>
      )}

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
    </>
  )

  return (
    <>
      <audio ref={audioRef} src="/OS/music_OSnolongerplaysfornowuntilideletethissection.wav" loop />
      <style>{PHONE_CSS}</style>

      {/* Full-page viewport container — ResizeObserver watches this.
          Height comes from .cos-viewport (100dvh: the visible height). In the
          phone layout pinch / double-tap zoom can't start in here (pan-x
          pan-y keeps scrolling) — see the zoom policy in phoneLayout.js. */}
      <div ref={containerRef} className={phone ? "cos-viewport cos-phone" : "cos-viewport"} style={{
        width: "100vw",
        touchAction: phone ? "pan-x pan-y" : undefined,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: appFilter,
      }}>
        {/* ── OUTER CLIP CONTAINER ───────────────────────────────────
            Normal mode: full bezel dimensions (2208×2427 scaled to fit).
            Screen-only mode: the whole window — the screen fills it edge
            to edge and the bezel is clipped away entirely.
        ────────────────────────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          width:    screenOnly ? viewport.width  : dimensions.width,
          height:   screenOnly ? viewport.height : dimensions.height,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {/* ── INNER FULL-BEZEL LAYER ───────────────────────────────
              Normal mode: the scaled bezel at the origin.
              SO mode: sized and shifted (screenOnlyBox) so the screen
              area lands exactly on the outer container.
          ─────────────────────────────────────────────────────────── */}
          <div style={{
            position: "absolute",
            top:    screenOnly ? soBox.top    : 0,
            left:   screenOnly ? soBox.left   : 0,
            width:  screenOnly ? soBox.width  : dimensions.width,
            height: screenOnly ? soBox.height : dimensions.height,
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

// The explicit "Always load Screen Only" choice: true / false / null (none)
function readAlwaysPref() {
  try {
    const v = localStorage.getItem('alwaysScreenOnly')
    if (v === 'true') return true   // only ever written by the owner's toggle
    if (v === 'false' && localStorage.getItem('alwaysScreenOnlySet') === 'true') return false
  } catch { /* storage blocked — no saved choice */ }
  return null
}

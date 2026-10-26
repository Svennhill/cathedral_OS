import { useState } from "react"
import Desktop from "./desktop"
import BootScreen from "./bootscreen"
import WindowBox from "./windowbox"
import Taskbar from "./taskbar"
import StartMenu from "./startmenu"
import AccessibilityTab from "./accessibilitytab"
import ScriptedExe from "./apps/scriptedexe"
import DougPretFac from "./apps/dougpretfac"
import { SCREEN_CLIP, PCT, TASKBAR_HEIGHT_PCT } from "../utils/screenConstants"

// App registry — keep in sync with startmenu.jsx APPS array
function renderApp(appId) {
  switch (appId) {
    case 'scriptedexe': return <ScriptedExe />
    case 'dougpretfac': return <DougPretFac />
    default: return (
      <div style={{ color: '#ff4444', padding: 8, fontFamily: 'monospace', fontSize: 9 }}>
        ERROR: app "{appId}" not found
      </div>
    )
  }
}

export default function Screen({
  screenState, setScreenState,
  luminance, density, clarity, illuminate, align,
  setIlluminate,
  debugLoop, debugLoopTarget,
  bootKey, setBootKey,
  openWindows, openWindow, closeWindow,
  minimizeWindow, maximizeWindow, restoreWindow,
  updateWindowPos, updateWindowSize,
  volume, musicPaused, toggleMusic,
  screenOnly, setScreenOnly,
  alwaysScreenOnly, setAlwaysScreenOnly,
  greyscale, setGreyscale,
  debugEnabled, setDebugEnabled,
}) {
  // COS start menu state — lives here so StartMenu renders at screen-frame level
  // (not inside Taskbar, which would clip it with overflow:hidden)
  const [startOpen, setStartOpen] = useState(false)

  const screenFilter = screenState !== 'off'
    ? `brightness(${luminance}) contrast(${density}) blur(${clarity}px)`
    : 'none'

  // All assets are sized for the full bezel (2208×2427).
  // Screen position is always PCT — no switching needed.
  const clipPath = SCREEN_CLIP

  const frameStyle = {
    position: "absolute",
    top:    `${PCT.top    * 100}%`,
    left:   `${PCT.left   * 100}%`,
    width:  `${PCT.width  * 100}%`,
    height: `${PCT.height * 100}%`,
    overflow: "hidden",
    pointerEvents: "auto",
  }

  return (
    <>
      {/* ── BACKGROUND OS ──────────────────────────────────── */}
      {(screenState === 'on' || screenState === 'shutting_down') && (
        <img src="/OS/background_OS.png" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 201, filter: screenFilter, clipPath,
        }} />
      )}

      {/* ── SCREEN VIEWPORT ────────────────────────────────── */}
      {screenState === 'on' && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          clipPath, zIndex: 202, filter: screenFilter,
          pointerEvents: "none",
        }}>
          {/* Screen frame — coordinate root for all UI elements */}
          <div style={frameStyle}>

            <Taskbar
              openWindows={openWindows}
              openWindow={openWindow}
              restoreWindow={restoreWindow}
              minimizeWindow={minimizeWindow}
              musicPaused={musicPaused}
              toggleMusic={toggleMusic}
              volume={volume}
              taskbarHeightPct={TASKBAR_HEIGHT_PCT}
              startOpen={startOpen}
              onStartClick={() => setStartOpen(o => !o)}
            />

            {/* COS Start Menu — rendered at screen-frame level so it's not clipped */}
            {startOpen && (
              <StartMenu
                onClose={() => setStartOpen(false)}
                openWindow={openWindow}
                screenOnly={screenOnly}
                setScreenOnly={setScreenOnly}
                alwaysScreenOnly={alwaysScreenOnly}
                setAlwaysScreenOnly={setAlwaysScreenOnly}
                greyscale={greyscale}
                setGreyscale={setGreyscale}
                debugEnabled={debugEnabled}
                setDebugEnabled={setDebugEnabled}
                taskbarHeightPct={TASKBAR_HEIGHT_PCT}
              />
            )}

            <Desktop
              openWindow={openWindow}
              taskbarHeightPct={TASKBAR_HEIGHT_PCT}
            />

            {openWindows.map(win => (
              <WindowBox
                key={win.id}
                win={win}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() => maximizeWindow(win.id)}
                onUpdatePos={(x, y) => updateWindowPos(win.id, x, y)}
                onUpdateSize={(w, h) => updateWindowSize(win.id, w, h)}
                taskbarHeightPct={TASKBAR_HEIGHT_PCT}
              >
                {renderApp(win.id)}
              </WindowBox>
            ))}

          </div>
        </div>
      )}

      {/* ── ACCESSIBILITY TAB ──────────────────────────────── */}
      {/* Outside the clip — tab pokes into the bezel rim */}
      {screenState === 'on' && (
        <AccessibilityTab
          screenOnly={screenOnly}
          setScreenOnly={setScreenOnly}
          alwaysScreenOnly={alwaysScreenOnly}
          setAlwaysScreenOnly={setAlwaysScreenOnly}
          greyscale={greyscale}
          setGreyscale={setGreyscale}
          activePCT={PCT}
        />
      )}

      {/* ── SCREEN OFF ─────────────────────────────────────── */}
      {screenState === 'off' && (
        <img src="/screen/screen_off.png" style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 201, filter: screenFilter, clipPath,
        }} />
      )}

      {/* ── BOOT SCREEN ────────────────────────────────────── */}
      {screenState === 'booting' && (
        <BootScreen
          key={bootKey}
          setIlluminate={setIlluminate}
          onBootComplete={() => {
            if (debugLoop) {
              setBootKey(k => k + 1)
              setScreenState(debugLoopTarget)
            } else {
              setScreenState('on')
            }
          }}
        />
      )}

      {/* ── CRT ON VIDEO ───────────────────────────────────── */}
      {screenState === 'crt_on' && (
        <video
          src="/fx/crt_on.mp4"
          autoPlay playsInline
          onEnded={() => setScreenState('booting')}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "fill", pointerEvents: "none",
            zIndex: 204, filter: screenFilter, clipPath,
          }}
        />
      )}
      {(screenState === 'crt_on' || screenState === 'booting') && (
        <audio src="/audio/crt_on_sound.mp3" autoPlay ref={el => { if (el) el.volume = 0.5 }} />
      )}

      {/* ── CRT OFF VIDEO ──────────────────────────────────── */}
      {screenState === 'shutting_down' && (
        <video
          src="/fx/crt_off.mp4"
          autoPlay playsInline
          onEnded={() => setScreenState('off')}
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "fill", pointerEvents: "none",
            zIndex: 204, filter: screenFilter, clipPath,
          }}
        />
      )}
      {screenState === 'shutting_down' && (
        <audio src="/audio/crt_off_sound.mp3" autoPlay ref={el => { if (el) el.volume = 0.5 }} />
      )}

      {/* ── ILLUMINATE OVERLAY ─────────────────────────────── */}
      {screenState !== 'off' && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: `rgba(0,255,65,${illuminate * 0.3})`,
          pointerEvents: "none", clipPath, zIndex: 205,
        }} />
      )}

      {/* ── SCANLINES ──────────────────────────────────────── */}
      {screenState !== 'off' && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundImage: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          opacity: align, pointerEvents: "none", clipPath, zIndex: 206,
        }} />
      )}
    </>
  )
}

import { useState, useEffect } from "react"
import Desktop from "./desktop"
import BootScreen from "./bootscreen"
import LoginScreen from "./loginscreen"
import WindowBox from "./windowbox"
import Taskbar from "./taskbar"
import StartMenu from "./startmenu"
import AccessibilityTab from "./accessibilitytab"
import ScriptedExe from "./apps/scriptedexe"
import DougPretFac from "./apps/dougpretfac"
import { SCREEN_CLIP, PCT, TASKBAR_HEIGHT_PCT } from "../utils/screenConstants"
import { PHONE, taskbarPct, screenArtCover, phoneBaseScales } from "../utils/phoneLayout"

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
  loginView = null,     // debug jump: the login card to open on — 'signin' | 'create' (App.jsx LOGIN JUMP)
  clearLoginView,
  bootKey, setBootKey,
  openWindows, openWindow, closeWindow,
  minimizeWindow, maximizeWindow, restoreWindow,
  updateWindowPos, updateWindowSize,
  volume, musicPaused, toggleMusic,
  screenOnly, setScreenOnly,
  alwaysScreenOnly, setAlwaysScreenOnly,
  greyscale, setGreyscale,
  debugEnabled, setDebugEnabled,
  desktopZoom, setDesktopZoom,
  windowZoom, setWindowZoom,
  phone = false,        // phone layout (utils/phoneLayout.js)
  frame,                // { w, h } — the screen area in px
  currentUser = null,   // signed-in user's public profile (null: nobody)
  onLogin,              // (user) → App makes the user current (settings, progress)
  onLogout,             // () → App ends the session and returns to 'login'
}) {
  // COS start menu state — lives here so StartMenu renders at screen-frame level
  // (not inside Taskbar, which would clip it with overflow:hidden)
  const [startOpen, setStartOpen] = useState(false)
  // Leaving the OS (log out, power off, a debug jump) closes the menu, so the
  // next session never opens with the last one's menu showing
  const [menuState, setMenuState] = useState(screenState)
  if (menuState !== screenState) {
    setMenuState(screenState)
    if (startOpen) setStartOpen(false)
  }

  // The quote of the day: typed by the boot, kept on the login screen
  const [bootQuote, setBootQuote] = useState("")

  // ── LOGIN JUMP HAND-OFF ──
  // A debug jump to login asks for a card: LoginScreen gets it as
  // requestedView={loginView} and opens on that card as it mounts (App keys
  // this Screen by the jump, so every jump mounts the login screen fresh,
  // fields empty). The request lasts for that one visit: once the screen
  // leaves 'login' it's spent, so a later ordinary arrival at login (e.g.
  // after Log out) opens on the default card.
  useEffect(() => {
    if (screenState !== 'login' && loginView) clearLoginView?.()
  }, [screenState, loginView, clearLoginView])

  const screenFilter = screenState !== 'off'
    ? `brightness(${luminance}) contrast(${density}) blur(${clarity}px)`
    : 'none'

  // All assets are sized for the full bezel (2208×2427).
  // Screen position is always PCT — no switching needed.
  const clipPath = SCREEN_CLIP

  // Phone layout: a touch-height taskbar, and window/desktop content drawn at
  // the phone base scale (phoneBaseScales — the boosts belong to Screen
  // Only's full-viewport frame; bezel view runs at 1.0). The F6 zoom sliders
  // multiply on top, each still touching only its own layer. Desktop: the
  // original values exactly.
  const tbPct          = taskbarPct(phone, frame?.h, TASKBAR_HEIGHT_PCT)
  const baseScales     = phoneBaseScales(phone, screenOnly)
  const desktopScale   = desktopZoom * baseScales.desktop
  const windowScale    = windowZoom  * baseScales.window

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
      {(screenState === 'on' || screenState === 'shutting_down') && phone && frame && (
        // Phone: the art covers the screen area undistorted (see screenArtCover)
        <div style={{ ...frameStyle, pointerEvents: "none", zIndex: 201, filter: screenFilter }}>
          <img src="/OS/background_OS.png" alt="" style={screenArtCover(frame.w, frame.h)} />
        </div>
      )}
      {(screenState === 'on' || screenState === 'shutting_down') && !phone && (
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
          <div style={frameStyle} data-screen-frame>

            <Taskbar
              openWindows={openWindows}
              openWindow={openWindow}
              restoreWindow={restoreWindow}
              minimizeWindow={minimizeWindow}
              musicPaused={musicPaused}
              toggleMusic={toggleMusic}
              volume={volume}
              taskbarHeightPct={tbPct}
              startOpen={startOpen}
              onStartClick={() => setStartOpen(o => !o)}
              phone={phone}
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
                desktopZoom={desktopZoom}
                setDesktopZoom={setDesktopZoom}
                windowZoom={windowZoom}
                setWindowZoom={setWindowZoom}
                taskbarHeightPct={tbPct}
                phone={phone}
                currentUser={currentUser}
                onLogout={() => { setStartOpen(false); onLogout?.() }}
              />
            )}

            <Desktop
              openWindow={openWindow}
              taskbarHeightPct={tbPct}
              zoom={desktopScale}
              phone={phone}
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
                taskbarHeightPct={tbPct}
                contentZoom={windowScale}
                phone={phone}
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
          phone={phone}
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
          phone={phone}
          frame={frame}
          onBootComplete={(info) => {
            setBootQuote(info?.quote ?? "")
            if (debugLoop) {
              setBootKey(k => k + 1)
              setScreenState(debugLoopTarget)
            } else {
              setScreenState('login')   // the OS only loads after a login
            }
          }}
        />
      )}

      {/* ── LOGIN ──────────────────────────────────────────── */}
      {/* Over the cathedral picture the boot left up; a successful login
          plays the background_OS wipe, then the OS */}
      {screenState === 'login' && (
        <LoginScreen
          phone={phone}
          frame={frame}
          quote={bootQuote}
          onAuthenticated={user => onLogin?.(user)}
          onEnter={() => setScreenState('on')}
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

import Desktop from "./desktop"
import BootScreen from "./bootscreen"
import WindowBox from "./windowbox"
import ScriptedExe from "./apps/scriptedexe"
import DougPretFac from "./apps/dougpretfac"

// Registry: maps an appId to its component
// Add new apps here as they're built
function renderApp(appId) {
  switch (appId) {
    case 'scriptedexe':  return <ScriptedExe />
    case 'dougpretfac':  return <DougPretFac />
    default:             return <div style={{ color: '#ff3333', padding: 8 }}>ERROR: app not found</div>
  }
}

export default function Screen({
  screenState, setScreenState,
  luminance, density, clarity, illuminate, align,
  setIlluminate,
  debugLoop, debugLoopTarget,
  bootKey, setBootKey,
  openWindows, openWindow, closeWindow,
}) {
  const screenFilter = screenState !== 'off'
    ? `brightness(${luminance}) contrast(${density}) blur(${clarity}px)`
    : 'none'

  return (
    <>
      {/* ── BACKGROUND OS ──────────────────────────────────────────────── */}
      {(screenState === 'on' || screenState === 'shutting_down') && (
        <img src="/OS/background_OS.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 201,
          filter: screenFilter,
        }} />
      )}

      {/* ── SCREEN VIEWPORT ────────────────────────────────────────────── */}
      {/* One clipPath container for the entire interactive OS layer.       */}
      {/* Desktop icons + open windows both live here.                      */}
      {screenState === 'on' && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          clipPath: "inset(5% 10% 22% 0%)",
          zIndex: 202,
          filter: screenFilter,
        }}>
          <Desktop openWindow={openWindow} />

          {openWindows.map(win => (
            <WindowBox
              key={win.id}
              title={win.title}
              onClose={() => closeWindow(win.id)}
            >
              {renderApp(win.id)}
            </WindowBox>
          ))}
        </div>
      )}

      {/* ── SCREEN OFF ─────────────────────────────────────────────────── */}
      {screenState === 'off' && (
        <img src="/screen/screen_off.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 201,
          filter: screenFilter,
        }} />
      )}

      {/* ── BOOT SCREEN ────────────────────────────────────────────────── */}
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

      {/* ── CRT ON VIDEO ───────────────────────────────────────────────── */}
      {screenState === 'crt_on' && (
        <video
          src="/fx/crt_on.mp4"
          autoPlay
          playsInline
          onEnded={() => setScreenState('booting')}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 204, // above desktop (202) and windows (203)
            filter: screenFilter,
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
      )}

      {/* ── CRT ON AUDIO ───────────────────────────────────────────────── */}
      {(screenState === 'crt_on' || screenState === 'booting') && (
        <audio
          src="/audio/crt_on_sound.mp3"
          autoPlay
          ref={el => { if (el) el.volume = 0.5 }}
        />
      )}

      {/* ── CRT OFF VIDEO ──────────────────────────────────────────────── */}
      {screenState === 'shutting_down' && (
        <video
          src="/fx/crt_off.mp4"
          autoPlay
          playsInline
          onEnded={() => setScreenState('off')}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 204,
            filter: screenFilter,
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
      )}

      {/* ── CRT OFF AUDIO ──────────────────────────────────────────────── */}
      {screenState === 'shutting_down' && (
        <audio
          src="/audio/crt_off_sound.mp3"
          autoPlay
          ref={el => { if (el) el.volume = 0.5 }}
        />
      )}

      {/* ── CRT PHOSPHOR GLOW ──────────────────────────────────────────── */}
      {/* Renders on top of everything — gives the screen its green haze    */}
      {(screenState === 'crt_on' || screenState === 'booting' || screenState === 'on' || screenState === 'shutting_down') && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,255,65,0.06) 58%, rgba(0,255,65,0.12) 70%, rgba(0,255,65,0.04) 80%, transparent 88%)",
          pointerEvents: "none",
          clipPath: "inset(5% 10% 22% 0%)",
          zIndex: 207,
        }} />
      )}

      {/* ── ILLUMINATE OVERLAY ─────────────────────────────────────────── */}
      {screenState !== 'off' && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: `rgba(0, 255, 65, ${illuminate * 0.3})`,
          pointerEvents: "none",
          clipPath: "inset(5% 10% 22% 0%)",
          zIndex: 205,
        }} />
      )}

      {/* ── ALIGN SCANLINES ────────────────────────────────────────────── */}
      {screenState !== 'off' && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundImage: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          opacity: align,
          pointerEvents: "none",
          clipPath: "inset(5% 10% 22% 0%)",
          zIndex: 206,
        }} />
      )}
    </>
  )
}

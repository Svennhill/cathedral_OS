import Desktop from "./desktop"
import BootScreen from "./bootscreen"

export default function Screen({screenState, setScreenState, luminance, density, clarity, illuminate, align, debugLoop, debugLoopTarget}) {
  const screenFilter = screenState !== 'off'
    ? `brightness(${luminance}) contrast(${density}) blur(${clarity}px)`
    : 'none'

  return (
    <>
      {/* BACKGROUND OS */}
      {(screenState === 'on' || screenState === 'shutting_down') && (
        <>
          <img src="/OS/background_OS.png" style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            zIndex: 201,
            filter: screenFilter,
          }} />
          {screenState === 'on' && <Desktop />}
        </>
      )}

      {/* SCREEN OFF */}
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

      {/* BOOT SCREEN */}
     {screenState === 'booting' && (
  <BootScreen
    key={Date.now()}
    onBootComplete={() => debugLoop
      ? setScreenState(debugLoopTarget)
      : setScreenState('on')
    }
  />
)}

      {/* CRT ON VIDEO */}
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
            zIndex: 202,
            filter: screenFilter,
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
      )}

      {/* CRT ON AUDIO */}
      {(screenState === 'crt_on' || screenState === 'booting') && (
        <audio src="/audio/crt_on_sound.mp3" autoPlay />
      )}

      {/* CRT OFF VIDEO */}
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
            zIndex: 202,
            filter: screenFilter,
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
      )}

      {/* CRT OFF AUDIO */}
      {screenState === 'shutting_down' && (
        <audio src="/audio/crt_off_sound.mp3" autoPlay />
      )}

      {/* CRT PHOSPHOR GLOW */}
      {(screenState === 'crt_on' || screenState === 'booting' || screenState === 'on' || screenState === 'shutting_down') && (
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,255,65,0.06) 58%, rgba(0,255,65,0.12) 70%, rgba(0,255,65,0.04) 80%, transparent 88%)",
          pointerEvents: "none",
          zIndex: 207,
        }} />
      )}

      {/* ILLUMINATE OVERLAY */}
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

      {/* ALIGN SCANLINES */}
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
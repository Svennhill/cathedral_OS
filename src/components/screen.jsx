import Desktop from "./desktop"

export default function Screen({screenState, setScreenState}) {
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
          }} />
          {screenState === 'on' && <Desktop />}
        </>
      )}

      {/* SCREEN OFF */}
      {(screenState === 'off' || screenState === 'crt_on') && (
        <img src="/screen/screen_off.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 201,
        }} />
      )}

      {/* CRT ON VIDEO */}
      {screenState === 'crt_on' && (
        <video
          src="/fx/crt_on.mp4"
          autoPlay
          playsInline
          onEnded={() => setScreenState('on')}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
            zIndex: 202,
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
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
            clipPath: "inset(5% 10% 22% 0%)"
          }}
        />
      )}
    </>
  )
}
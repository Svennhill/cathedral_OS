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

{/* CRT ON AUDIO */}
{screenState === 'crt_on' && (
<audio src="/audio/crt_on_sound.mp3" 
autoPlay 

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

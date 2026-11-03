import { useState, useEffect, useRef } from "react"
import { PCT } from "../utils/screenConstants"
import { screenArtCover } from "../utils/phoneLayout"

const BOOT_LINES = [
  "RELIQUARY 316J-SVU CODEX SYSTEM",
  "BIOS v2.31 .............. OK",
  "MEMORY CHECK ............ 640K OK",
  "detecting phosphor display..... OK",
  "CRT warmup..................... OK",
  "scanline calibration........... OK",
  "trace rotation................. OK",
  "audio driver................... OK",
  "initializing scripture index... OK",
  "indexing 31,102 verses......... OK",
  "loading canonical map.......... OK",
  "apocrypha.mod.................. SKIP",
  "cross-reference engine......... OK",
  "verse_parser.exe............... OK",
  "bad_bible.csv.................. OK",
  "loading contradiction index.... OK",
  "bible_truth_index.sys.......... OK",
  "logic_integrity.exe............ OK",
  "dignity_score.sys.............. OK",
  "cursed_biology.mod............. WARN",
  "pretzel_factory.exe............ WARN",
  "JHCOFFEEFUND.sys............... OK",
  "checking for omniscience....... FAIL",
  "free_will.sys.................. NOT FOUND",
  "flat_earth.mod................. REJECTED",
  "young_earth.exe................ ERROR",
  "finalizing boot sequence.......... OK",
  "4L8R15F16J23S42K",
]

const GREEN = "#00ff41"
const MID_GREEN = "#00a829"

// phone / frame: the phone layout (utils/phoneLayout.js) and the screen
// area's size in px. The desktop layout below is untouched; the phone layout
// is drawn by PhoneBoot from the same state.
export default function BootScreen({ onBootComplete, setIlluminate, phone = false, frame = null }) {
  const [phase, setPhase] = useState('text')
  const [visibleLines, setVisibleLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [blink, setBlink] = useState(true)
  const [quote, setQuote] = useState("")
  const [catScanProgress, setCatScanProgress] = useState(0)
  const [wipeProgress, setWipeProgress] = useState(0)
  const [splashText, setSplashText] = useState("")
  const [quoteText, setQuoteText] = useState("")
  const charTimerRef = useRef(null)
  const blinkTimerRef = useRef(null)

  // Set illuminate to 25% on boot start, clean up on unmount
  useEffect(() => {
    setIlluminate(0.25)
    return () => setIlluminate(0)
  }, [])

  // Load random quote
  useEffect(() => {
    fetch('/boot/boot_bible_quotes.txt')
      .then(r => r.text())
      .then(text => {
        const lines = text.split('\n').filter(l => l.trim())
        const random = lines[Math.floor(Math.random() * lines.length)]
        setQuote(random.trim())
      })
      .catch(() => setQuote('"and the Word was made flesh" John 1:14'))
  }, [])

  // Blinking cursor
  useEffect(() => {
    blinkTimerRef.current = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(blinkTimerRef.current)
  }, [])

  // Typewriter
  useEffect(() => {
    if (phase !== 'text') return
    if (currentLine >= BOOT_LINES.length) {
      const complete = new Audio('/audio/complete.mp3')
      complete.volume = 0.01
      complete.play().catch(() => {})
      setTimeout(() => setPhase('cathedral'), 1200)
      return
    }
    const line = BOOT_LINES[currentLine]
    if (currentChar < line.length) {
      charTimerRef.current = setTimeout(() => {
        setCurrentChar(prev => prev + 1)
      }, 18)
    } else {
      charTimerRef.current = setTimeout(() => {
        setVisibleLines(prev => [...prev, line].slice(-12))
        playBootSound(line)
        setCurrentLine(prev => prev + 1)
        setCurrentChar(0)
      }, 80)
    }
    return () => clearTimeout(charTimerRef.current)
  }, [phase, currentLine, currentChar])

  // Cathedral scan-in
  useEffect(() => {
    if (phase !== 'cathedral') return
    setCatScanProgress(0)
    setIlluminate(0) // reset illuminate when cathedral begins

    const chime = new Audio('/audio/cathedral_chime.mp3')
    chime.volume = 0.08
    chime.play().catch(() => {})

    const start = Date.now()
    const duration = 6000
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setCatScanProgress(progress)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setPhase('wipe'), 3000)
      }
    }
    requestAnimationFrame(tick)

    const fullSplash = "cathedral_OS v2.3"
    let i = 0
    const splashTimer = setInterval(() => {
      i++
      setSplashText(fullSplash.slice(0, i))
      if (i >= fullSplash.length) {
        clearInterval(splashTimer)
        let j = 0
        const quoteTimer = setInterval(() => {
          j++
          setQuoteText(quote.slice(0, j))
          if (j >= quote.length) clearInterval(quoteTimer)
        }, 20)
      }
    }, 40)
    return () => clearInterval(splashTimer)
  }, [phase, quote])

  // Wipe to OS
  useEffect(() => {
    if (phase !== 'wipe') return
    setWipeProgress(0)
    const start = Date.now()
    const duration = 1000
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setWipeProgress(progress)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setPhase('done')
          onBootComplete()
        }, 100)
      }
    }
    requestAnimationFrame(tick)
  }, [phase])

  const getLineColor = (line) => {
    if (line.includes('FAIL') || line.includes('ERROR')) return '#ff4444'
    if (line.includes('WARN')) return '#ffaa00'
    if (line.includes('NOT FOUND') || line.includes('REJECTED') || line.includes('SKIP')) return '#ffaa00'
    return MID_GREEN
  }

  const playBootSound = (line) => {
    let src = null
    let vol = 0.1
    if (line.includes('FAIL') || line.includes('NOT FOUND') || line.includes('REJECTED') || line.includes('ERROR')) {
      src = '/audio/fail.mp3'
      vol = 0.01
    } else if (line.includes('WARN')) {
      src = '/audio/warn.mp3'
      vol = 0.01
    } else if (line.includes('SKIP')) {
      src = '/audio/skip.mp3'
      vol = 0.01
    } else if (line.includes('OK')) {
      src = '/audio/OK_chime.mp3'
      vol = 0.01
    }
    if (src) {
      const sfx = new Audio(src)
      sfx.volume = vol
      sfx.play().catch(() => {})
    }
  }

  if (phone && frame?.w && frame?.h) {
    return (
      <PhoneBoot
        frame={frame} phase={phase} blink={blink}
        visibleLines={visibleLines} currentLine={currentLine} currentChar={currentChar}
        catScanProgress={catScanProgress} wipeProgress={wipeProgress}
        splashText={splashText} quoteText={quoteText} getLineColor={getLineColor}
      />
    )
  }

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      overflow: "hidden",
      fontFamily: "monospace",
      fontSize: "11px",
      zIndex: 150,
    }}>

      {/* BOOT BACKGROUND */}
      <img src="/boot/boot_background.png" style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        objectFit: "fill",
        zIndex: 0,
      }} />

      {/* CATHEDRAL */}
      {(phase === 'cathedral' || phase === 'wipe') && (
        <img src="/boot/boot_cathedral.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          zIndex: 1,
          clipPath: `inset(0 0 ${(1 - catScanProgress) * 100}% 0)`,
        }} />
      )}

      {/* WIPE TO background_OS */}
      {phase === 'wipe' && (
        <img src="/OS/background_OS.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          zIndex: 2,
          clipPath: `inset(0 0 ${(1 - wipeProgress) * 100}% 0)`,
        }} />
      )}

      {/* BOOT TEXT */}
      {phase === 'text' && (
        <div style={{
          position: "absolute",
          top: "13%",
          left: "14%",
          right: "4%",
          zIndex: 10,
        }}>
          {visibleLines.map((line, i) => (
            <div key={i} style={{
              color: getLineColor(line),
              lineHeight: "1.6",
              letterSpacing: "0.05em",
              opacity: 0.85,
              transition: "all 0.15s ease-out",
            }}>
              {line}
            </div>
          ))}
          {currentLine < BOOT_LINES.length && (
            <div style={{ color: GREEN, lineHeight: "1.6", letterSpacing: "0.05em" }}>
              {BOOT_LINES[currentLine].slice(0, currentChar)}
              <span style={{ opacity: blink ? 1 : 0 }}>_</span>
            </div>
          )}
        </div>
      )}

      {/* cathedral_OS v2.3 + quote */}
      {phase === 'cathedral' && (
        <div style={{
          position: "absolute",
          bottom: "81%",
          left: "13.99%",
          zIndex: 10,
        }}>
          <div style={{
            color: GREEN,
            fontSize: "16px",
            letterSpacing: "0.1em",
            marginBottom: "6px",
          }}>
            {splashText}<span style={{ opacity: blink ? 1 : 0 }}>_</span>
          </div>
          <div style={{
            color: MID_GREEN,
            fontSize: "10px",
            letterSpacing: "0.05em",
            maxWidth: "70%",
            marginBottom: "8px",
            fontStyle: "italic",
          }}>
            {quoteText}
          </div>
          <div style={{ color: GREEN, letterSpacing: "0.1em" }}>
            {'> '}<span style={{ opacity: blink ? 1 : 0 }}>_</span>
          </div>
        </div>
      )}

    </div>
  )
}
// ── PHONE LAYOUT ──────────────────────────────────────────────────────────
// Everything is placed inside the screen area itself (not in % of the
// full-bezel layer, which Screen Only stretches to the window's shape), the
// art covers that area undistorted, and the text is sized to the screen:
// boot lines as large as fit on one line each, the splash block anchored to
// the top of the screen and growing DOWN, so the verse is always whole.
const LONGEST_LINE = Math.max(...BOOT_LINES.map(l => l.length))
const CHAR_EM      = 0.66   // monospace advance + the 0.05em letter-spacing

function PhoneBoot({
  frame, phase, blink, visibleLines, currentLine, currentChar,
  catScanProgress, wipeProgress, splashText, quoteText, getLineColor,
}) {
  const { w, h } = frame
  const pad   = Math.round(Math.max(10, Math.min(w, h) * 0.035))
  const fs    = Math.max(10, Math.min(16, Math.floor((w - 2 * pad) / (LONGEST_LINE * CHAR_EM))))
  const lineH = fs * 1.6
  const rows  = Math.max(3, Math.min(12, Math.floor((h - 2 * pad) / lineH) - 1))
  const art   = screenArtCover(w, h)
  const layer = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }

  return (
    <div style={{ ...layer, fontFamily: "monospace", fontSize: fs, zIndex: 150 }}>
      <div style={{
        position: "absolute",
        top:    `${PCT.top    * 100}%`,
        left:   `${PCT.left   * 100}%`,
        width:  `${PCT.width  * 100}%`,
        height: `${PCT.height * 100}%`,
        overflow: "hidden",
      }}>
        <div style={{ ...layer, zIndex: 0 }}>
          <img src="/boot/boot_background.png" alt="" style={art} />
        </div>

        {(phase === 'cathedral' || phase === 'wipe') && (
          <div style={{ ...layer, zIndex: 1, clipPath: `inset(0 0 ${(1 - catScanProgress) * 100}% 0)` }}>
            <img src="/boot/boot_cathedral.png" alt="" style={art} />
          </div>
        )}

        {phase === 'wipe' && (
          <div style={{ ...layer, zIndex: 2, clipPath: `inset(0 0 ${(1 - wipeProgress) * 100}% 0)` }}>
            <img src="/OS/background_OS.png" alt="" style={art} />
          </div>
        )}

        {phase === 'text' && (
          <div style={{ position: "absolute", top: pad, left: pad, right: pad, zIndex: 10 }}>
            {visibleLines.slice(-rows).map((line, i) => (
              <div key={i} style={{
                color: getLineColor(line), lineHeight: 1.6, letterSpacing: "0.05em",
                opacity: 0.85, whiteSpace: "nowrap",
              }}>
                {line}
              </div>
            ))}
            {currentLine < BOOT_LINES.length && (
              <div style={{ color: GREEN, lineHeight: 1.6, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                {BOOT_LINES[currentLine].slice(0, currentChar)}
                <span style={{ opacity: blink ? 1 : 0 }}>_</span>
              </div>
            )}
          </div>
        )}

        {phase === 'cathedral' && (
          <div data-boot-splash style={{
            position: "absolute",
            top: Math.round(Math.max(pad, h * 0.04)),
            left: pad, right: pad,
            zIndex: 10,
            textShadow: "0 0 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
          }}>
            <div style={{ color: GREEN, fontSize: Math.max(18, fs + 5), letterSpacing: "0.1em", marginBottom: 8 }}>
              {splashText}<span style={{ opacity: blink ? 1 : 0 }}>_</span>
            </div>
            <div style={{
              color: MID_GREEN, fontSize: Math.max(14, fs), lineHeight: 1.5,
              letterSpacing: "0.05em", marginBottom: 8, fontStyle: "italic",
            }}>
              {quoteText}
            </div>
            <div style={{ color: GREEN, letterSpacing: "0.1em" }}>
              {'> '}<span style={{ opacity: blink ? 1 : 0 }}>_</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

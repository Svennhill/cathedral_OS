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

// The prompt under the quote "enters" this, then the login form takes over
const PROMPT_COMMAND = "login"
// Phases that show the cathedral splash (title, quote, prompt)
const SPLASH_PHASES = ['cathedral', 'command', 'handoff']

// Phases: 'text' (boot lines) → 'cathedral' (picture scans in, chime, title
// and quote type out) → 'command' ("login" types at the > _ prompt) →
// 'handoff' (the prompt fades) → onBootComplete({ quote }). There is no wipe
// here any more: the cathedral stays up and the login screen draws on it;
// the wipe to the desktop wallpaper plays after a successful login.
//
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
  const [scanDone, setScanDone] = useState(false)
  const [quoteDone, setQuoteDone] = useState(false)
  const [splashText, setSplashText] = useState("")
  const [quoteText, setQuoteText] = useState("")
  const [commandText, setCommandText] = useState("")
  const charTimerRef = useRef(null)
  const blinkTimerRef = useRef(null)
  // Latest onBootComplete, so the timers below never call a stale one
  const onCompleteRef = useRef(onBootComplete)
  useEffect(() => { onCompleteRef.current = onBootComplete })

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

  // Cathedral scan-in, chime, title and quote. Every timer is cleared on
  // the way out, so leaving mid-boot (power, debug jump) can't fire later.
  useEffect(() => {
    if (phase !== 'cathedral') return
    setCatScanProgress(0)
    setScanDone(false)
    setQuoteDone(false)
    setIlluminate(0) // reset illuminate when cathedral begins

    const chime = new Audio('/audio/cathedral_chime.mp3')
    chime.volume = 0.08
    chime.play().catch(() => {})

    const start = Date.now()
    const duration = 6000
    let raf = 0
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      setCatScanProgress(progress)
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setScanDone(true)
      }
    }
    raf = requestAnimationFrame(tick)

    const fullSplash = "cathedral_OS v2.3"
    let i = 0
    let quoteTimer = null
    const splashTimer = setInterval(() => {
      i++
      setSplashText(fullSplash.slice(0, i))
      if (i >= fullSplash.length) {
        clearInterval(splashTimer)
        let j = 0
        quoteTimer = setInterval(() => {
          j++
          setQuoteText(quote.slice(0, j))
          if (j >= quote.length) {
            clearInterval(quoteTimer)
            setQuoteDone(true)
          }
        }, 20)
      }
    }, 40)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(splashTimer)
      clearInterval(quoteTimer)
    }
  }, [phase, quote])

  // Picture fully in and quote fully typed → the prompt takes its command
  useEffect(() => {
    if (phase !== 'cathedral' || !scanDone || !quoteDone) return
    const t = setTimeout(() => setPhase('command'), 700)
    return () => clearTimeout(t)
  }, [phase, scanDone, quoteDone])

  // "login" types at the prompt, as if entered, then a beat for the Enter
  useEffect(() => {
    if (phase !== 'command') return
    let k = 0
    let t = null
    const typeNext = () => {
      k++
      setCommandText(PROMPT_COMMAND.slice(0, k))
      t = k < PROMPT_COMMAND.length
        ? setTimeout(typeNext, 110)
        : setTimeout(() => setPhase('handoff'), 450)
    }
    t = setTimeout(typeNext, 250)
    return () => clearTimeout(t)
  }, [phase])

  // The prompt fades out (CSS, 400ms), then the login screen takes over
  // with the cathedral picture still up
  useEffect(() => {
    if (phase !== 'handoff') return
    const t = setTimeout(() => onCompleteRef.current?.({ quote }), 450)
    return () => clearTimeout(t)
  }, [phase, quote])

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
        catScanProgress={catScanProgress} commandText={commandText}
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
      {SPLASH_PHASES.includes(phase) && (
        <img src="/boot/boot_cathedral.png" style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          zIndex: 1,
          clipPath: `inset(0 0 ${(1 - catScanProgress) * 100}% 0)`,
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

      {/* cathedral_OS v2.3 + quote + prompt */}
      {SPLASH_PHASES.includes(phase) && (
        <DesktopSplash
          splashText={splashText} quoteText={quoteText} blink={blink}
          command={commandText} promptOut={phase === 'handoff'}
        />
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

// Screen-area metrics for the phone layout — shared by the boot lines, the
// splash, and the login screen so they line up exactly
function phoneMetrics(frame) {
  const { w, h } = frame
  const pad   = Math.round(Math.max(10, Math.min(w, h) * 0.035))
  const fs    = Math.max(10, Math.min(16, Math.floor((w - 2 * pad) / (LONGEST_LINE * CHAR_EM))))
  const lineH = fs * 1.6
  const rows  = Math.max(3, Math.min(12, Math.floor((h - 2 * pad) / lineH) - 1))
  return { w, h, pad, fs, lineH, rows }
}

// The > prompt under the quote. While "login" is being entered it carries the
// command and the cursor; promptOut fades it away (the login form follows).
function PromptLine({ command = "", blink, promptOut }) {
  return (
    <div style={{
      color: GREEN, letterSpacing: "0.1em",
      opacity: promptOut ? 0 : 1, transition: "opacity 0.4s ease-out",
    }}>
      {'> '}{command}<span style={{ opacity: blink && !promptOut ? 1 : 0 }}>_</span>
    </div>
  )
}

// Desktop splash, in % of the full-bezel layer (same in Screen Only).
// Exported so the login screen draws the very same block where boot left it.
export function DesktopSplash({ splashText, quoteText, blink, command, promptOut }) {
  return (
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
      <PromptLine command={command} blink={blink} promptOut={promptOut} />
    </div>
  )
}

// Phone splash: anchored to the top of the screen and growing DOWN, so the
// verse is always whole. position "absolute" (boot) or "static" (the login
// screen, where it sits above the form in one scrolling column).
export function PhoneSplash({ frame, splashText, quoteText, blink, command, promptOut, position = "absolute" }) {
  const { h, pad, fs } = phoneMetrics(frame)
  return (
    <div data-boot-splash style={{
      position,
      top: position === "absolute" ? Math.round(Math.max(pad, h * 0.04)) : undefined,
      left: pad, right: pad,
      zIndex: 10,
      fontFamily: "monospace",
      fontSize: fs,
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
      <PromptLine command={command} blink={blink} promptOut={promptOut} />
    </div>
  )
}

function PhoneBoot({
  frame, phase, blink, visibleLines, currentLine, currentChar,
  catScanProgress, commandText, splashText, quoteText, getLineColor,
}) {
  const { pad, fs, rows } = phoneMetrics(frame)
  const art   = screenArtCover(frame.w, frame.h)
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

        {SPLASH_PHASES.includes(phase) && (
          <div style={{ ...layer, zIndex: 1, clipPath: `inset(0 0 ${(1 - catScanProgress) * 100}% 0)` }}>
            <img src="/boot/boot_cathedral.png" alt="" style={art} />
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

        {SPLASH_PHASES.includes(phase) && (
          <PhoneSplash
            frame={frame} splashText={splashText} quoteText={quoteText} blink={blink}
            command={commandText} promptOut={phase === 'handoff'}
          />
        )}
      </div>
    </div>
  )
}

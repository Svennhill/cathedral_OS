// scripted.exe — command-line automation engine for cathedral_OS
// Framework skeleton: terminal interface, command registry, history navigation

import { useState, useRef, useEffect } from "react"

const GREEN  = "#00ff41"
const DIM    = "#004d1a"
const DIMMED = "rgba(0,255,65,0.4)"
const RED    = "#ff4444"
const PROMPT = "scripted@cos:~$ "

// ── COMMAND REGISTRY ──────────────────────────────────────────────────────
// Add new commands here as the app grows.
// Each entry: fn that returns a string (or array of strings for multi-line output).
// Return null to suppress output. Use 'clear' as a special key (handled separately).

const COMMANDS = {

  help: () => [
    `scripted.exe — cathedral_OS automation engine`,
    ``,
    `available commands:`,
    `  help      — this message`,
    `  clear     — clear terminal`,
    `  about     — about this application`,
    `  whoami    — current user info`,
    `  version   — build information`,
    `  ls        — list available scripts  [stub]`,
    `  run <id>  — execute a script        [stub]`,
    `  new       — create a new script     [stub]`,
    `  log       — view execution history  [stub]`,
  ],

  about: () => [
    `// scripted.exe v0.1`,
    `//`,
    `// a scriptable automation engine for cathedral_OS.`,
    `// create, schedule, and run lightweight scripts`,
    `// that interact with your OS and connected services.`,
    `//`,
    `// status: prototype — commands marked [stub] are planned`,
  ],

  whoami: () => [`guest`],

  version: () => [
    `scripted.exe    0.1.0-alpha`,
    `cathedral_OS    0.0.1-dev`,
    `kernel build    ${new Date().getFullYear()}.04`,
  ],

  ls: () => [
    `// no scripts found — use "new" to create one  [stub]`,
  ],

  run: (args) => {
    if (!args.length) return [`usage: run <script-id>`]
    return [`// run "${args.join(' ')}" — executor not yet wired  [stub]`]
  },

  new: () => [`// script editor not yet available  [stub]`],

  log: () => [`// execution log empty  [stub]`],
}

// ── TERMINAL COMPONENT ────────────────────────────────────────────────────
export default function ScriptedExe() {
  const [lines, setLines] = useState([
    { type: 'sys',    text: '// scripted.exe v0.1' },
    { type: 'sys',    text: '// type "help" to begin' },
    { type: 'blank',  text: '' },
  ])
  const [input, setInput]         = useState('')
  const [history, setHistory]     = useState([])  // command history (newest first)
  const [histIdx,  setHistIdx]    = useState(-1)  // -1 = no history selected
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // ── COMMAND RUNNER ───────────────────────────────────────────────────────
  const runCommand = (raw) => {
    const trimmed  = raw.trim()
    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)

    const echo = { type: 'echo', text: PROMPT + raw }

    if (!trimmed) {
      setLines(prev => [...prev, echo, { type: 'blank', text: '' }])
      return
    }

    if (cmd === 'clear') {
      setLines([{ type: 'blank', text: '' }])
      return
    }

    const handler = COMMANDS[cmd]
    if (handler) {
      const result = handler(args)
      const outLines = result.map(t => ({ type: 'out', text: t }))
      setLines(prev => [...prev, echo, ...outLines, { type: 'blank', text: '' }])
    } else {
      setLines(prev => [
        ...prev,
        echo,
        { type: 'err', text: `command not found: ${cmd}` },
        { type: 'sys', text: `// type "help" for available commands` },
        { type: 'blank', text: '' },
      ])
    }
  }

  const submit = () => {
    runCommand(input)
    if (input.trim()) setHistory(h => [input, ...h])
    setHistIdx(-1)
    setInput('')
  }

  // ── KEYBOARD HANDLER ─────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : (history[next] ?? ''))
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Basic tab completion — complete known command names
      const candidates = Object.keys(COMMANDS).filter(k => k.startsWith(input))
      if (candidates.length === 1) setInput(candidates[0])
    }
  }

  // ── LINE COLOR MAP ────────────────────────────────────────────────────────
  const lineColor = (type) => {
    switch (type) {
      case 'echo':  return DIM
      case 'err':   return RED
      case 'sys':   return DIMMED
      default:      return GREEN
    }
  }

  return (
    <div
      style={{
        fontFamily: "opendyslexic, monospace",
        fontSize: 9,
        lineHeight: 1.7,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "text",
        userSelect: "text",
        background: "transparent",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── OUTPUT AREA ──────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "4px 6px",
        scrollbarWidth: "thin",
        scrollbarColor: `${DIM} transparent`,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line.type), whiteSpace: "pre-wrap", minHeight: "1em" }}>
            {line.text || '\u00A0'}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT LINE ───────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "2px 6px 3px",
        borderTop: `1px solid ${DIM}`,
        flexShrink: 0,
      }}>
        <span style={{ color: DIM, flexShrink: 0, pointerEvents: "none" }}>{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: GREEN,
            fontFamily: "opendyslexic, monospace",
            fontSize: 9,
            padding: 0,
            caretColor: GREEN,
          }}
        />
      </div>
    </div>
  )
}

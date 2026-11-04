// PasscodePrompt — the ONE owner-passcode check that guards the debug tools.
// Two doors use it, and nothing else checks the code:
//   • COS Start Menu → SETTINGS → SYSTEM → Debug Panel (startmenu.jsx)
//   • the debug cheat-code combo, from any screen state (App.jsx → PasscodeOverlay)
//
// Enter checks the code. Right → onSuccess(). Wrong → the field clears and
// "incorrect" shows in the prompt (it stays open; no alert dialogs).

import { useState, useRef, useEffect, useId } from "react"

export const DEBUG_CODE = "2079"

const GREEN = "#00ff41"
const TEAL  = "#009191"
const DIM   = "#004d1a"
const BG    = "#050510"
const RED   = "#ff4444"
const FONT  = "opendyslexic, monospace"
const ERROR_MS = 1200

// The field itself. Text sizes are % of the parent's font size, so the same
// markup sits in the Start Menu and in the larger overlay box.
export default function PasscodePrompt({ onSuccess, inputWidth = 60 }) {
  const [code, setCode]   = useState('')
  const [error, setError] = useState(false)
  const inputRef   = useRef(null)
  const errorTimer = useRef(null)
  const fieldId    = useId()

  useEffect(() => {
    inputRef.current?.focus()
    return () => clearTimeout(errorTimer.current)
  }, [])

  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return
    if (code === DEBUG_CODE) {
      clearTimeout(errorTimer.current)
      setCode('')
      setError(false)
      onSuccess()
      return
    }
    setCode('')
    setError(true)
    clearTimeout(errorTimer.current)
    errorTimer.current = setTimeout(() => setError(false), ERROR_MS)
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <label htmlFor={fieldId} style={{ display: "block", fontSize: "68%", color: `rgba(0,255,65,0.5)`, marginBottom: 2 }}>
        enter passcode:
      </label>
      <input
        id={fieldId}
        ref={inputRef}
        type="password"
        value={code}
        onChange={e => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        maxLength={6}
        autoComplete="off"
        aria-invalid={error || undefined}
        style={{
          background: "transparent",
          border: `1px solid ${error ? RED : DIM}`,
          color: error ? RED : GREEN,
          fontFamily: FONT,
          fontSize: "72%",
          padding: "1px 4px",
          width: inputWidth,
          outline: "none",
          letterSpacing: "0.2em",
        }}
      />
      <span role="status" aria-live="polite" style={{ marginLeft: 6, color: RED, fontSize: "68%" }}>
        {error ? "incorrect" : ""}
      </span>
    </div>
  )
}

// The cheat-code door: the same prompt in a box over everything (above the
// debug panel too). Esc or a click outside the box closes it without enabling
// anything. While open it takes the keyboard — Esc/Tab never reach the app —
// and mouse presses never reach the app either (so e.g. an open Start Menu
// stays open). On close, focus goes back to wherever it was, so a half-typed
// field elsewhere carries on exactly as it was left.
export function PasscodeOverlay({ onSuccess, onCancel }) {
  const boxRef = useRef(null)
  const downOutside = useRef(false)   // the press started outside the box

  // Whatever had focus when the combo was pressed — read on the first render,
  // before the prompt's own field takes focus. Handed back on close.
  const [returnFocus] = useState(() => document.activeElement)
  useEffect(() => () => {
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus()
  }, [returnFocus])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onCancel()
      } else if (e.key === 'Tab') {
        // The passcode field is the dialog's only stop — keep focus in here
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onCancel])

  return (
    <div
      data-debug-passcode-overlay
      onMouseDown={e => {
        e.stopPropagation()
        downOutside.current = !boxRef.current?.contains(e.target)
        // Inside the box, keep focus in the field (unless the field itself was clicked)
        if (!downOutside.current && e.target.tagName !== 'INPUT') e.preventDefault()
      }}
      onClick={e => {
        if (downOutside.current && !boxRef.current?.contains(e.target)) onCancel()
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,           // the debug panel sits at 99999
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label="Debug passcode"
        style={{
          width: 260,
          maxWidth: "100%",
          boxSizing: "border-box",
          background: BG,
          border: `1px solid ${TEAL}`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 8px rgba(0,145,145,0.2)`,
          fontFamily: FONT,
          fontSize: 18,             // the prompt's %-sized text scales off this
        }}
      >
        <div style={{ background: TEAL, padding: "2px 8px" }}>
          <span style={{ color: BG, fontSize: "72%", letterSpacing: "0.1em" }}>≡ DEBUG ACCESS</span>
        </div>
        <div style={{ padding: "8px 12px 4px" }}>
          <PasscodePrompt onSuccess={onSuccess} inputWidth={96} />
        </div>
        <div style={{ padding: "2px 12px 8px", fontSize: "58%", color: `rgba(0,255,65,0.45)` }}>
          Enter to unlock · Esc to cancel
        </div>
      </div>
    </div>
  )
}

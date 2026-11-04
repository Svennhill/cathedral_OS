import { useRef } from "react"
import { IconClose, IconMaximize, IconMinimize, IconResizeGrip, IconRestore } from "./icons"

// WindowBox — full window manager chrome for cathedral_OS
//
// Props:
//   win             — { id, title, x, y, width, height, minimized, maximized }
//   onClose         — close the window entirely
//   onMinimize      — minimize to taskbar
//   onMaximize      — toggle maximize (fills screen frame)
//   onUpdatePos     — (x, y) → update position in parent state
//   onUpdateSize    — (w, h) → update size in parent state
//   taskbarHeightPct — taskbar height as % of screen frame (so maximize lands below it)
//   contentZoom     — window zoom for the app content (independent of desktop zoom)
//   phone           — phone layout: touch-sized title bar and buttons
//   children        — the app rendered inside
//
// Chrome colors come from the --os-* theme variables (index.css) and the
// control glyphs from the OS icon system (icons.jsx) — the flat white
// title bar and text-glyph buttons are gone.

const GREEN = "var(--os-accent)"
const TEAL  = "var(--os-accent-2)"
const DIM   = "var(--os-accent-dim)"
const BG    = "var(--os-bg-deep)"
const mix = (pct, color) => `color-mix(in srgb, ${color} ${pct}%, transparent)`

export default function WindowBox({
  win,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePos,
  onUpdateSize,
  taskbarHeightPct,
  contentZoom = 1,
  phone = false,
  children,
}) {
  const { title, x, y, width, height, minimized, maximized } = win
  const windowRef = useRef(null)

  // Don't render anything when minimized — window lives in the taskbar
  if (minimized) return null

  // ── DRAG ──────────────────────────────────────────────────────────────
  const handleTitleMouseDown = (e) => {
    if (maximized) return           // can't drag a maximized window
    if (e.button !== 0) return      // left button only
    e.preventDefault()

    const frameEl = windowRef.current?.parentElement
    if (!frameEl) return
    const frameRect  = frameEl.getBoundingClientRect()
    const windowRect = windowRef.current.getBoundingClientRect()
    const offsetX = e.clientX - windowRect.left
    const offsetY = e.clientY - windowRect.top

    const onMouseMove = (e) => {
      const rawX = ((e.clientX - offsetX - frameRect.left) / frameRect.width)  * 100
      const rawY = ((e.clientY - offsetY - frameRect.top)  / frameRect.height) * 100
      // Clamp: don't drag off the right/bottom; don't go above taskbar
      const clampedX = Math.max(0, Math.min(rawX, 100 - width))
      const clampedY = Math.max(taskbarHeightPct, Math.min(rawY, 95))
      onUpdatePos(clampedX, clampedY)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onMouseUp)
  }

  // ── RESIZE (bottom-right corner handle) ───────────────────────────────
  const handleResizeMouseDown = (e) => {
    if (maximized) return
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    const frameEl = windowRef.current?.parentElement
    if (!frameEl) return
    const frameRect = frameEl.getBoundingClientRect()
    const startW = width
    const startH = height
    const startX = e.clientX
    const startY = e.clientY

    const onMouseMove = (e) => {
      const deltaXPct = ((e.clientX - startX) / frameRect.width)  * 100
      const deltaYPct = ((e.clientY - startY) / frameRect.height) * 100
      const newW = Math.max(20, Math.min(startW + deltaXPct, 100 - x))
      const newH = Math.max(15, Math.min(startH + deltaYPct, 100 - y))
      onUpdateSize(newW, newH)
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup',   onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup',   onMouseUp)
  }

  // ── COMPUTED STYLE ────────────────────────────────────────────────────
  const boxStyle = maximized ? {
    position: "absolute",
    top:    `${taskbarHeightPct}%`,
    left:   0,
    width:  "100%",
    height: `${100 - taskbarHeightPct}%`,
    zIndex: 203,
  } : {
    position: "absolute",
    left:   `${x}%`,
    top:    `${y}%`,
    width:  `${width}%`,
    height: `${height}%`,
    zIndex: 203,
  }

  return (
    <div ref={windowRef} style={{
      ...boxStyle,
      backgroundColor: BG,
      border: `1px solid ${TEAL}`,
      borderRadius: "var(--os-radius)",
      boxShadow: "var(--os-bevel-panel), 0 0 10px color-mix(in srgb, var(--os-accent-2) 25%, transparent)",
      fontFamily: "opendyslexic, monospace",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── TITLE BAR ─────────────────────────────────────────────────── */}
      <div
        onMouseDown={handleTitleMouseDown}
        style={{
          background: "var(--os-titlebar)",
          borderBottom: `1px solid ${DIM}`,
          padding: phone ? "0 0 0 8px" : "3px 4px 3px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: maximized ? "default" : "move",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <span style={{
          color: GREEN, fontWeight: "bold",
          fontSize: phone ? 14 : 9,
          letterSpacing: "0.06em",
          textShadow: `0 0 6px ${mix(45, GREEN)}`,
        }}>
          {title}
        </span>

        <div style={{ display: "flex", gap: phone ? 0 : 3, alignItems: "center" }}>
          {/* Minimize */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onMinimize}
            aria-label="Minimize"
            style={phone ? PHONE_HIT : faceStyle(false)}
          >{phone ? <span style={phoneFace(false)}><IconMinimize size={14} /></span> : <IconMinimize size={9} />}</button>

          {/* Maximize / Restore */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onMaximize}
            aria-label={maximized ? "Restore" : "Maximize"}
            style={phone ? PHONE_HIT : faceStyle(false)}
          >{phone
            ? <span style={phoneFace(false)}>{maximized ? <IconRestore size={14} /> : <IconMaximize size={14} />}</span>
            : (maximized ? <IconRestore size={9} /> : <IconMaximize size={9} />)}</button>

          {/* Close */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onClose}
            aria-label="Close"
            style={phone ? PHONE_HIT : faceStyle(true)}
          >{phone ? <span style={phoneFace(true)}><IconClose size={14} /></span> : <IconClose size={9} />}</button>
        </div>
      </div>

      {/* ── APP CONTENT ───────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: 8,
        color: GREEN,
        fontSize: 9,
        zoom: contentZoom,
      }}>
        {children}
      </div>

      {/* ── RESIZE HANDLE (bottom-right corner) ───────────────────────── */}
      {!maximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 1, right: 1,
            width: 12, height: 12,
            cursor: "nwse-resize",
            zIndex: 1,
            color: TEAL,
            opacity: 0.55,
          }}
        >
          <IconResizeGrip size={12} />
        </div>
      )}

    </div>
  )
}

// Window-control button face — one treatment for all three controls:
// dark gradient face, accent border and glyph; the close control swaps
// the accent for the danger ramp. Part of the chrome language in
// index.css (--os-radius-sm corner, --os-bevel-hi top highlight).
function faceStyle(danger) {
  return {
    width: 15, height: 15,
    padding: 0,
    cursor: "pointer",
    background: danger
      ? `linear-gradient(180deg, ${mix(65, "var(--os-danger-strong)")}, ${mix(40, "var(--os-danger-deep)")})`
      : `linear-gradient(180deg, ${mix(30, TEAL)}, ${mix(12, TEAL)})`,
    border: `1px solid ${danger ? "var(--os-danger-deep)" : mix(55, GREEN)}`,
    borderRadius: "var(--os-radius-sm)",
    boxShadow: "var(--os-bevel-hi)",
    color: danger ? "#ffffff" : GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  }
}

// Phone layout: a 40×40 invisible hit area around a 26px button face, so the
// title bar keeps its small retro buttons and still takes a fingertip.
const PHONE_HIT = {
  width: 40, height: 40, padding: 0, margin: 0,
  background: "transparent", border: "none", borderRadius: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
}
function phoneFace(danger) {
  return {
    ...faceStyle(danger),
    width: 26, height: 26,
    boxSizing: "border-box",
  }
}

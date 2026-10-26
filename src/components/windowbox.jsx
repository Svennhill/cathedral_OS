import { useRef } from "react"

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
//   children        — the app rendered inside

const GREEN  = "#00ff41"
const TEAL   = "#009191"
const BG     = "#0a0a1a"
const WHITE  = "#ffffff"

export default function WindowBox({
  win,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePos,
  onUpdateSize,
  taskbarHeightPct,
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
      boxShadow: `0 0 10px rgba(0,145,145,0.25), 2px 2px 0 #000`,
      fontFamily: "opendyslexic, monospace",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── TITLE BAR ─────────────────────────────────────────────────── */}
      <div
        onMouseDown={handleTitleMouseDown}
        style={{
          background: WHITE,
          padding: "2px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: maximized ? "default" : "move",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#000", fontWeight: "bold", fontSize: 9 }}>
          {title}
        </span>

        <div style={{ display: "flex", gap: 2 }}>
          {/* Minimize */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onMinimize}
            style={btnStyle("#d4d4d4", "#888", "#000")}
          >_</button>

          {/* Maximize / Restore */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onMaximize}
            style={btnStyle("#d4d4d4", "#888", "#000")}
          >{maximized ? "❐" : "□"}</button>

          {/* Close */}
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onClose}
            style={btnStyle("#cc0000", "#880000", "#fff")}
          >✕</button>
        </div>
      </div>

      {/* ── APP CONTENT ───────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: 8,
        color: GREEN,
        fontSize: 9,
      }}>
        {children}
      </div>

      {/* ── RESIZE HANDLE (bottom-right corner) ───────────────────────── */}
      {!maximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 0, right: 0,
            width: 10, height: 10,
            cursor: "nwse-resize",
            zIndex: 1,
          }}
        >
          {/* Subtle visual indicator */}
          <svg width="10" height="10" style={{ display: "block", opacity: 0.4 }}>
            <line x1="10" y1="0" x2="0" y2="10" stroke={TEAL} strokeWidth="1" />
            <line x1="10" y1="4" x2="4" y2="10" stroke={TEAL} strokeWidth="1" />
          </svg>
        </div>
      )}

    </div>
  )
}

function btnStyle(bg, border, color) {
  return {
    width: 11, height: 11,
    fontSize: 7, padding: 0,
    cursor: "pointer",
    background: bg,
    border: `1px solid ${border}`,
    color,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
  }
}

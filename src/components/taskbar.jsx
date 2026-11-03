import { useState } from "react"

const GREEN  = "#00ff41"
const TEAL   = "#009191"
const DIM    = "#004d1a"
const BG     = "#050510"
const BTN    = {
  background: "transparent",
  border: "none",
  color: GREEN,
  fontFamily: "opendyslexic, monospace",
  cursor: "pointer",
  padding: "0 6px",
  display: "flex",
  alignItems: "center",
  gap: 3,
  height: "100%",
  fontSize: "75%",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
}

// Square corners and no rounded focus ring (same cleanup as the COS badge):
// the global button styles in index.css would otherwise turn the active
// fill into a pill. Keyboard focus gets a square inset outline instead.
function TrayButton({ label, title, onClick, active, phone }) {
  const [keyFocus, setKeyFocus] = useState(false)
  return (
    <button
      onClick={onClick}
      title={title}
      onFocus={e => setKeyFocus(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setKeyFocus(false)}
      style={{
        ...BTN,
        color:       active ? BG : GREEN,
        background:  active ? GREEN : "transparent",
        padding: phone ? "0 10px" : "0 5px",
        minWidth: phone ? 44 : undefined,
        borderLeft: `1px solid ${DIM}`,
        borderRadius: 0,
        outline:       keyFocus ? `1px solid ${TEAL}` : "none",
        outlineOffset: -2,
      }}
    >
      {label}
    </button>
  )
}

// ── VOLUME MIXER PANEL ────────────────────────────────────────────────────
// IMPORTANT: rendered with position:absolute, top:"100%" — so the parent
// MUST NOT have overflow:hidden or the panel will be clipped.
function VolumeMixerPanel({ volume, musicPaused, toggleMusic, onClose, phone }) {
  return (
    <div style={{
      position: "absolute",
      top: "100%",
      right: 0,
      background: BG,
      border: `1px solid ${TEAL}`,
      boxShadow: `0 0 8px rgba(0,145,145,0.3)`,
      minWidth: 160,
      zIndex: 500,
      fontFamily: "opendyslexic, monospace",
      fontSize: "70%",
      color: GREEN,
      // Prevent the panel from being clipped by the screen frame's overflow:hidden
      // by positioning in screen-space (zIndex 500 handles stacking)
    }}>
      {/* Header */}
      <div style={{
        background: "#ffffff",
        padding: "2px 6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: "#000", fontWeight: "bold", fontSize: "80%" }}>volume mixer</span>
        <button
          onClick={onClose}
          aria-label="Close volume mixer"
          style={phone
            ? { background: "#cc0000", border: "none", borderRadius: 0, color: "#fff", cursor: "pointer", fontSize: "90%", width: 40, height: 40, padding: 0 }
            : { background: "#cc0000", border: "none", color: "#fff", cursor: "pointer", fontSize: "70%", padding: "1px 3px" }}
        >
          ✕
        </button>
      </div>

      {/* OS Music channel */}
      <div style={{ padding: "6px 8px", borderBottom: `1px solid ${DIM}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span>OS music</span>
          <button
            onClick={toggleMusic}
            style={{ ...BTN, height: phone ? 40 : "auto", padding: phone ? "0 10px" : "1px 4px", border: `1px solid ${GREEN}`, borderRadius: phone ? 0 : undefined, fontSize: phone ? "90%" : "70%" }}
          >
            {musicPaused ? "► play" : "⏸ pause"}
          </button>
        </div>
        <div style={{ height: 4, background: DIM, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${volume * 100}%`, background: GREEN, borderRadius: 2, transition: "width 0.1s" }} />
        </div>
        <div style={{ color: DIM, marginTop: 2 }}>controlled via hardware knob</div>
      </div>

      {/* Future channels */}
      <div style={{ padding: "4px 8px", color: DIM, fontStyle: "italic" }}>
        // future app channels here
      </div>
    </div>
  )
}

// ── TASKBAR ───────────────────────────────────────────────────────────────
export default function Taskbar({
  openWindows,
  openWindow,
  restoreWindow,
  minimizeWindow,
  musicPaused,
  toggleMusic,
  volume,
  taskbarHeightPct,
  startOpen,          // controlled externally (Screen lifts this state)
  onStartClick,       // toggle callback from Screen
  phone = false,      // phone layout: touch-sized buttons (utils/phoneLayout.js)
}) {
  const [mixerOpen, setMixerOpen] = useState(false)
  const [cosKeyFocus, setCosKeyFocus] = useState(false)  // keyboard focus on COS

  const tbStyle = {
    position: "absolute",
    top: 0, left: 0,
    width: "100%",
    height: `${taskbarHeightPct}%`,
    background: BG,
    borderBottom: `1px solid ${TEAL}`,
    display: "flex",
    alignItems: "center",
    zIndex: 300,
    boxSizing: "border-box",
    // NOTE: overflow must NOT be "hidden" here — the VolumeMixerPanel uses
    // position:absolute top:"100%" and would be clipped otherwise.
    // The window list handles its own overflow internally.
    overflow: "visible",
    pointerEvents: "auto",
    userSelect: "none",
    // Phone: every %-sized label scales off this (75% → 15px)
    fontSize: phone ? 20 : undefined,
  }

  return (
    <div style={tbStyle}>

      {/* ── START BUTTON (left) ──────────────────────────── */}
      {/* One element: the boxed COS mark. The button itself is invisible
          chrome (square, no fill, no border, no rounded focus ring) — the
          global button styles in index.css would otherwise draw a stray pill
          beside the mark. Open state fills the mark; keyboard focus gets a
          square outline on the mark itself. */}
      <button
        onClick={onStartClick}
        aria-expanded={startOpen}
        title="COS menu"
        data-cos-start
        onFocus={e => setCosKeyFocus(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setCosKeyFocus(false)}
        style={{
          ...BTN,
          background: "transparent",
          borderRadius: 0,
          outline: "none",
          padding: phone ? "0 10px" : "0 6px",
          minWidth: phone ? 60 : undefined,
          fontWeight: "bold",
          letterSpacing: "0.1em",
          height: "100%",
          flexShrink: 0,
        }}
      >
        <span style={{
          display: "inline-block",
          border: `1px solid ${GREEN}`,
          background: startOpen ? GREEN : "transparent",
          color:      startOpen ? BG    : GREEN,
          outline:    cosKeyFocus ? `1px solid ${TEAL}` : "none",
          outlineOffset: 1,
          padding: "0 3px",
          fontSize: "85%",
          lineHeight: 1.3,
        }}>
          COS
        </span>
      </button>

      {/* ── WINDOW LIST (center) ─────────────────────────── */}
      {/* overflow-x:auto only here so it doesn't clip the vol mixer popup */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        height: "100%",
        gap: 3,
        padding: "0 4px",
        overflowX: "auto",
        overflowY: "hidden",
      }}>
        {openWindows.map(win => (
          <button
            key={win.id}
            title={win.title}
            onClick={() => win.minimized ? restoreWindow(win.id) : minimizeWindow(win.id)}
            style={{
              background:   win.minimized ? "transparent" : `rgba(0,145,145,0.15)`,
              border:       `1px solid ${win.minimized ? DIM : TEAL}`,
              cursor:       "pointer",
              padding:      0,
              flexShrink:   0,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              width:        phone ? 40 : "1.4em",
              height:       phone ? 36 : "70%",
              aspectRatio:  "1",
              color:        win.minimized ? DIM : GREEN,
              fontSize:     "70%",
              fontFamily:   "opendyslexic, monospace",
              boxSizing:    "border-box",
            }}
          >
            ▪
          </button>
        ))}
      </div>

      {/* ── SYSTEM TRAY (right) ──────────────────────────── */}
      {/* position:relative so VolumeMixerPanel's top:"100%" anchors here */}
      <div style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        borderLeft: `1px solid ${DIM}`,
        position: "relative",
        flexShrink: 0,
      }}>
        <TrayButton
          label={musicPaused ? "♪ off" : "♪ on"}
          title="Toggle OS music"
          onClick={toggleMusic}
          active={!musicPaused}
          phone={phone}
        />
        <TrayButton
          label={`vol ${Math.round(volume * 100)}%`}
          title="Open volume mixer"
          onClick={() => setMixerOpen(o => !o)}
          active={mixerOpen}
          phone={phone}
        />
        {mixerOpen && (
          <VolumeMixerPanel
            volume={volume}
            musicPaused={musicPaused}
            toggleMusic={toggleMusic}
            onClose={() => setMixerOpen(false)}
            phone={phone}
          />
        )}
      </div>

    </div>
  )
}

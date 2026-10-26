// StartMenu — drops down from the COS button inside the screen frame
// Sections: APPS (open windows), SETTINGS (accessibility + debug passcode)

import { useState, useRef, useEffect } from "react"

const GREEN  = "#00ff41"
const TEAL   = "#009191"
const DIM    = "#004d1a"
const BG     = "#050510"
const FONT   = "opendyslexic, monospace"
const DEBUG_CODE = "2079"

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ label, open, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 8px",
        background: DIM,
        cursor: "pointer",
        userSelect: "none",
        fontFamily: FONT,
        fontSize: "72%",
        color: GREEN,
        letterSpacing: "0.1em",
        borderBottom: `1px solid ${TEAL}`,
      }}
    >
      <span>{label}</span>
      <span style={{ opacity: 0.6, fontSize: "80%" }}>{open ? "▲" : "▼"}</span>
    </div>
  )
}

function AppEntry({ title, symbol, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "3px 12px",
        cursor: "pointer",
        background: hovered ? `rgba(0,145,145,0.15)` : "transparent",
        fontFamily: FONT,
        fontSize: "72%",
        color: hovered ? GREEN : `rgba(0,255,65,0.7)`,
        transition: "background 0.1s",
        userSelect: "none",
      }}
    >
      <span style={{
        display: "inline-block",
        width: 14, height: 14,
        border: `1px solid ${hovered ? TEAL : DIM}`,
        textAlign: "center",
        lineHeight: "12px",
        fontSize: "65%",
        flexShrink: 0,
      }}>
        {symbol}
      </span>
      <span>{title}</span>
    </div>
  )
}

function SettingToggle({ label, checked, onChange, locked, lockNote }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "2px 12px",
      cursor: locked ? "default" : "pointer",
      fontFamily: FONT,
      fontSize: "72%",
      color: locked ? `rgba(0,255,65,0.35)` : `rgba(0,255,65,0.8)`,
      userSelect: "none",
      gap: 6,
    }}>
      <span>{label}{locked ? <span style={{ marginLeft: 4, opacity: 0.5, fontSize: "80%" }}>({lockNote})</span> : null}</span>
      {!locked && (
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ width: 10, height: 10, cursor: "pointer", accentColor: GREEN }}
        />
      )}
    </label>
  )
}

function Divider() {
  return <div style={{ height: 1, background: DIM, margin: "3px 8px" }} />
}

// ── DEBUG PASSCODE PANEL ──────────────────────────────────────────────────
function DebugSection({ debugEnabled, onEnableDebug, onDisableDebug }) {
  const [expanded, setExpanded] = useState(false)
  const [code, setCode]         = useState('')
  const [error, setError]       = useState(false)
  const inputRef = useRef(null)

  const tryCode = (e) => {
    if (e.key === 'Enter') {
      if (code === DEBUG_CODE) {
        onEnableDebug()
        setExpanded(false)
        setCode('')
        setError(false)
      } else {
        setError(true)
        setCode('')
        setTimeout(() => setError(false), 1200)
      }
    }
  }

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus()
  }, [expanded])

  return (
    <div>
      <div
        onClick={() => {
          if (debugEnabled) { onDisableDebug(); return }
          setExpanded(o => !o)
          setCode('')
          setError(false)
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2px 12px",
          cursor: "pointer",
          fontFamily: FONT,
          fontSize: "72%",
          color: debugEnabled ? GREEN : `rgba(0,255,65,0.8)`,
          userSelect: "none",
        }}
      >
        <span>Debug Panel</span>
        <span style={{ fontSize: "70%", opacity: 0.7 }}>
          {debugEnabled ? "● ON" : (expanded ? "▲" : "▶")}
        </span>
      </div>

      {!debugEnabled && expanded && (
        <div style={{ padding: "2px 12px 4px", fontFamily: FONT }}>
          <div style={{ fontSize: "68%", color: `rgba(0,255,65,0.5)`, marginBottom: 2 }}>
            enter passcode:
          </div>
          <input
            ref={inputRef}
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={tryCode}
            maxLength={6}
            style={{
              background: "transparent",
              border: `1px solid ${error ? "#ff4444" : DIM}`,
              color: error ? "#ff4444" : GREEN,
              fontFamily: FONT,
              fontSize: "72%",
              padding: "1px 4px",
              width: 60,
              outline: "none",
              letterSpacing: "0.2em",
            }}
          />
          {error && (
            <span style={{ marginLeft: 6, color: "#ff4444", fontSize: "68%" }}>incorrect</span>
          )}
        </div>
      )}
    </div>
  )
}

// ── MAIN START MENU ───────────────────────────────────────────────────────

// App registry — keep in sync with screen.jsx renderApp()
const APPS = [
  { id: 'scriptedexe', title: 'scripted.exe',       symbol: '►' },
  { id: 'dougpretfac', title: "doug's pretzel factory", symbol: '∞' },
]

export default function StartMenu({
  onClose,
  openWindow,
  screenOnly,    setScreenOnly,
  alwaysScreenOnly, setAlwaysScreenOnly,
  greyscale,     setGreyscale,
  debugEnabled,  setDebugEnabled,
  taskbarHeightPct,
}) {
  const [appsOpen,     setAppsOpen]     = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const menuRef = useRef(null)

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleOpenApp = (id, title) => {
    openWindow(id, title)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: "absolute",
        top: `${taskbarHeightPct}%`,
        left: 0,
        zIndex: 400,
        minWidth: 200,
        background: BG,
        border: `1px solid ${TEAL}`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 8px rgba(0,145,145,0.2)`,
        fontFamily: FONT,
        pointerEvents: "auto",
      }}
    >
      {/* Menu title bar */}
      <div style={{
        background: TEAL,
        padding: "2px 8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: BG, fontSize: "72%", letterSpacing: "0.1em", fontFamily: FONT }}>
          ≡ CATHEDRAL OS
        </span>
        <button
          onClick={onClose}
          style={{
            background: "transparent", border: "none",
            color: BG, cursor: "pointer", fontSize: "72%",
            fontFamily: FONT, padding: "0 2px", lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* ── APPS SECTION ──────────────────────────────────── */}
      <SectionHeader label="APPS" open={appsOpen} onToggle={() => setAppsOpen(o => !o)} />
      {appsOpen && (
        <div style={{ paddingTop: 2, paddingBottom: 4 }}>
          {APPS.map(app => (
            <AppEntry
              key={app.id}
              title={app.title}
              symbol={app.symbol}
              onClick={() => handleOpenApp(app.id, app.title)}
            />
          ))}
        </div>
      )}

      {/* ── SETTINGS SECTION ──────────────────────────────── */}
      <SectionHeader label="SETTINGS" open={settingsOpen} onToggle={() => setSettingsOpen(o => !o)} />
      {settingsOpen && (
        <div style={{ paddingTop: 2, paddingBottom: 4 }}>

          {/* Accessibility */}
          <div style={{ padding: "1px 12px", fontFamily: FONT, fontSize: "65%", color: TEAL, letterSpacing: "0.08em" }}>
            ACCESSIBILITY
          </div>
          <SettingToggle
            label="Screen Only (this session)"
            checked={screenOnly}
            onChange={setScreenOnly}
          />
          <SettingToggle
            label="Always load Screen Only"
            checked={alwaysScreenOnly}
            onChange={(v) => { setAlwaysScreenOnly(v); setScreenOnly(v) }}
          />
          <SettingToggle
            label="Greyscale"
            checked={greyscale}
            onChange={setGreyscale}
          />
          <SettingToggle
            label="Increase Size"
            checked={false}
            onChange={() => {}}
            locked
            lockNote="coming soon"
          />

          <Divider />

          {/* Debug */}
          <div style={{ padding: "1px 12px", fontFamily: FONT, fontSize: "65%", color: TEAL, letterSpacing: "0.08em" }}>
            SYSTEM
          </div>
          <DebugSection
            debugEnabled={debugEnabled}
            onEnableDebug={() => setDebugEnabled(true)}
            onDisableDebug={() => setDebugEnabled(false)}
          />

          <Divider />

          {/* Personalization — login required stub */}
          <div style={{ padding: "1px 12px", fontFamily: FONT, fontSize: "65%", color: TEAL, letterSpacing: "0.08em" }}>
            PERSONALIZATION
          </div>
          <SettingToggle
            label="Background"
            locked
            lockNote="login required"
          />
          <SettingToggle
            label="Color theme"
            locked
            lockNote="login required"
          />
        </div>
      )}

    </div>
  )
}

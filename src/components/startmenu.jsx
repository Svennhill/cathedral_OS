// StartMenu — drops down from the COS button inside the screen frame
// User line (who is signed in + Log out), then sections: APPS (open
// windows), CASE PROGRESS (scripted.exe save state + start-over), SETTINGS
// (accessibility + debug passcode)
//
// phone: the phone layout (utils/phoneLayout.js) — full-width menu, rows and
// controls at touch size. Every desktop value is unchanged.

import { useState, useRef, useEffect } from "react"
import { ZOOM_STEPS } from "../utils/screenConstants"
import { PHONE } from "../utils/phoneLayout"
import { PASSAGES } from "./the_bible/passages"
import { caseActions, useCaseState, caseStatus } from "./apps/scripted/casestore"
import { displayName } from "../data/userstore"
import PasscodePrompt from "./passcodeprompt"
import { AppIcon, IconCathedral, IconChevronDown, IconChevronRight, IconChevronUp, IconClose } from "./icons"

// All colors come from the --os-* theme variables (index.css); translucent
// shades are color-mix() derivations so the menu swings with the palette.
const GREEN  = "var(--os-accent)"
const TEAL   = "var(--os-accent-2)"
const DIM    = "var(--os-accent-dim)"
const BG     = "var(--os-bg)"
const INK    = "var(--os-ink)"
const DANGER = "var(--os-danger)"
const mix = (pct, color = "var(--os-accent)") =>
  `color-mix(in srgb, ${color} ${pct}%, transparent)`
const FONT   = "opendyslexic, monospace"

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ label, open, onToggle, phone, id }) {
  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      data-section={id}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() } }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: phone ? "0 12px" : "3px 8px",
        minHeight: phone ? PHONE.HIT + 4 : undefined,
        boxSizing: "border-box",
        background: `linear-gradient(180deg, ${mix(90, DIM)}, ${mix(65, DIM)})`,
        boxShadow: "var(--os-bevel-hi)",
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
      <span style={{ opacity: 0.7, display: "flex" }}>{open ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}</span>
    </div>
  )
}

function AppEntry({ title, appId, onClick, phone }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: phone ? 12 : 8,
        padding: phone ? "0 14px" : "3px 12px",
        minHeight: phone ? PHONE.HIT + 4 : undefined,
        cursor: "pointer",
        background: hovered ? mix(15, TEAL) : "transparent",
        fontFamily: FONT,
        fontSize: "72%",
        color: hovered ? GREEN : mix(70),
        transition: "background 0.1s",
        userSelect: "none",
      }}
    >
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: phone ? 26 : 18, height: phone ? 26 : 18,
        border: `1px solid ${hovered ? TEAL : DIM}`,
        borderRadius: "var(--os-radius-sm)",
        background: "var(--os-tile)",
        boxShadow: "var(--os-bevel-hi)",
        color: GREEN,
        flexShrink: 0,
      }}>
        <AppIcon id={appId} size={phone ? 16 : 12} />
      </span>
      <span>{title}</span>
    </div>
  )
}

function SettingToggle({ label, checked, onChange, locked, lockNote, phone }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: phone ? "0 14px" : "2px 12px",
      minHeight: phone ? PHONE.HIT + 4 : undefined,
      cursor: locked ? "default" : "pointer",
      fontFamily: FONT,
      fontSize: "72%",
      color: locked ? mix(35) : mix(80),
      userSelect: "none",
      gap: 6,
    }}>
      <span>{label}{locked ? <span style={{ marginLeft: 4, opacity: 0.5, fontSize: "80%" }}>({lockNote})</span> : null}</span>
      {!locked && (
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          style={{ width: phone ? 22 : 10, height: phone ? 22 : 10, cursor: "pointer", accentColor: GREEN, flexShrink: 0 }}
        />
      )}
    </label>
  )
}

// − 100% + stepper over ZOOM_STEPS
function ZoomSetting({ label, value, onChange, phone }) {
  const idx = ZOOM_STEPS.indexOf(value)
  const i = idx === -1 ? ZOOM_STEPS.indexOf(1) : idx
  const stepBtn = (disabled) => ({
    background: "transparent",
    border: `1px solid ${disabled ? DIM : TEAL}`,
    borderRadius: 0,
    color: disabled ? DIM : GREEN,
    cursor: disabled ? "default" : "pointer",
    fontFamily: FONT,
    fontSize: "100%",
    lineHeight: 1,
    width: phone ? PHONE.HIT : 14, height: phone ? PHONE.HIT : 14,
    padding: 0,
  })
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: phone ? "2px 14px" : "2px 12px",
      fontFamily: FONT,
      fontSize: "72%",
      color: mix(80),
      userSelect: "none",
      gap: 6,
    }}>
      <span>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: phone ? 6 : 4 }}>
        <button
          aria-label={`${label} out`}
          disabled={i === 0}
          onClick={() => onChange(ZOOM_STEPS[i - 1])}
          style={stepBtn(i === 0)}
        >−</button>
        <span style={{ minWidth: phone ? 44 : 30, textAlign: "center" }}>{Math.round(ZOOM_STEPS[i] * 100)}%</span>
        <button
          aria-label={`${label} in`}
          disabled={i === ZOOM_STEPS.length - 1}
          onClick={() => onChange(ZOOM_STEPS[i + 1])}
          style={stepBtn(i === ZOOM_STEPS.length - 1)}
        >+</button>
      </span>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: DIM, margin: "3px 8px" }} />
}

// ── DEBUG PASSCODE PANEL ──────────────────────────────────────────────────
// The passcode field and its check are the shared PasscodePrompt (the same
// one the Ctrl+Alt+D cheat-code overlay uses). Off → click to show the field;
// right code turns debug on and folds the field away. On → click turns it off.
function DebugSection({ debugEnabled, onEnableDebug, onDisableDebug, phone }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div
        onClick={() => {
          if (debugEnabled) { onDisableDebug(); return }
          setExpanded(o => !o)
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: phone ? "0 14px" : "2px 12px",
          minHeight: phone ? PHONE.HIT + 4 : undefined,
          cursor: "pointer",
          fontFamily: FONT,
          fontSize: "72%",
          color: debugEnabled ? GREEN : mix(80),
          userSelect: "none",
        }}
      >
        <span>Debug Panel</span>
        <span style={{ fontSize: "70%", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
          {debugEnabled ? (
            <>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 5px ${GREEN}`, display: "inline-block" }} />
              ON
            </>
          ) : (expanded ? <IconChevronUp size={12} /> : <IconChevronRight size={12} />)}
        </span>
      </div>

      {!debugEnabled && expanded && (
        <div style={{ padding: "2px 12px 4px" }}>
          <PasscodePrompt onSuccess={() => { onEnableDebug(); setExpanded(false) }} />
        </div>
      )}
    </div>
  )
}

// ── MAIN START MENU ───────────────────────────────────────────────────────

// App registry — keep in sync with screen.jsx renderApp().
// Icons resolve from the app id via APP_ICONS in icons.jsx (shared with
// the desktop), so an app has one mark everywhere.
const APPS = [
  { id: 'scriptedexe', title: 'scripted.exe' },
  { id: 'dougpretfac', title: "doug's pretzel factory" },
]

export default function StartMenu({
  onClose,
  openWindow,
  screenOnly,    setScreenOnly,
  alwaysScreenOnly, setAlwaysScreenOnly,
  greyscale,     setGreyscale,
  debugEnabled,  setDebugEnabled,
  desktopZoom,   setDesktopZoom,
  windowZoom,    setWindowZoom,
  taskbarHeightPct,
  phone = false,
  currentUser = null,
  onLogout,
}) {
  const [appsOpen,     setAppsOpen]     = useState(true)
  const [progressOpen, setProgressOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const menuRef = useRef(null)

  // Click outside to close. The COS button is excluded: it toggles the menu
  // itself, and closing here first would make its click re-open the menu.
  useEffect(() => {
    const handler = (e) => {
      if (e.target.closest?.('[data-cos-start]')) return
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
      data-start-menu
      style={{
        position: "absolute",
        top: `${taskbarHeightPct}%`,
        left: 0,
        right: phone ? 0 : undefined,     // phone: the full screen width
        zIndex: 400,
        minWidth: 200,
        // Never taller than the screen below the taskbar; scrolls instead
        maxHeight: `${100 - taskbarHeightPct}%`,
        overflowY: "auto",
        boxSizing: "border-box",
        fontSize: phone ? 20 : undefined,  // phone: %-sized text scales off this (72% → 14.4px)
        background: BG,
        border: `1px solid ${TEAL}`,
        borderRadius: "0 0 var(--os-radius) var(--os-radius)",
        boxShadow: `var(--os-bevel-panel), 0 0 8px ${mix(20, TEAL)}`,
        fontFamily: FONT,
        pointerEvents: "auto",
      }}
    >
      {/* Menu title bar — same treatment as the window title bars */}
      <div style={{
        background: "var(--os-titlebar)",
        borderBottom: `1px solid ${DIM}`,
        padding: "3px 4px 3px 8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: GREEN, fontSize: "72%", letterSpacing: "0.1em", fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
          <IconCathedral size={13} />
          CATHEDRAL OS
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: "transparent", border: "none",
            color: GREEN, cursor: "pointer",
            fontFamily: FONT, padding: "0 2px", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...(phone ? { width: PHONE.HIT + 4, height: PHONE.HIT, padding: 0, marginRight: -8, borderRadius: 0 } : null),
          }}
        >
          <IconClose size={phone ? 16 : 11} />
        </button>
      </div>

      {/* ── USER ──────────────────────────────────────────── */}
      <UserLine user={currentUser} onLogout={onLogout} phone={phone} />

      {/* ── APPS SECTION ──────────────────────────────────── */}
      <SectionHeader label="APPS" id="apps" phone={phone} open={appsOpen} onToggle={() => setAppsOpen(o => !o)} />
      {appsOpen && (
        <div style={{ paddingTop: 2, paddingBottom: 4 }}>
          {APPS.map(app => (
            <AppEntry
              key={app.id}
              title={app.title}
              appId={app.id}
              onClick={() => handleOpenApp(app.id, app.title)}
              phone={phone}
            />
          ))}
        </div>
      )}

      {/* ── CASE PROGRESS SECTION ─────────────────────────── */}
      <SectionHeader label="CASE PROGRESS" id="progress" phone={phone} open={progressOpen} onToggle={() => setProgressOpen(o => !o)} />
      {progressOpen && <CaseProgress phone={phone} />}

      {/* ── SETTINGS SECTION ──────────────────────────────── */}
      <SectionHeader label="SETTINGS" id="settings" phone={phone} open={settingsOpen} onToggle={() => setSettingsOpen(o => !o)} />
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
            phone={phone}
          />
          <SettingToggle
            label="Always load Screen Only"
            checked={alwaysScreenOnly}
            onChange={(v) => { setAlwaysScreenOnly(v); setScreenOnly(v) }}
            phone={phone}
          />
          <SettingToggle
            label="Greyscale"
            checked={greyscale}
            onChange={setGreyscale}
            phone={phone}
          />
          <ZoomSetting
            label="Desktop zoom"
            value={desktopZoom}
            onChange={setDesktopZoom}
            phone={phone}
          />
          <ZoomSetting
            label="Window zoom"
            value={windowZoom}
            onChange={setWindowZoom}
            phone={phone}
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
            phone={phone}
          />

          <Divider />

          {/* Personalization — not built yet */}
          <div style={{ padding: "1px 12px", fontFamily: FONT, fontSize: "65%", color: TEAL, letterSpacing: "0.08em" }}>
            PERSONALIZATION
          </div>
          <SettingToggle
            label="Background"
            locked
            lockNote="coming soon"
            phone={phone}
          />
          <SettingToggle
            label="Color theme"
            locked
            lockNote="coming soon"
            phone={phone}
          />
        </div>
      )}

    </div>
  )
}

// ── USER LINE ─────────────────────────────────────────────────────────────
const SR_ONLY = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
}
// Who is signed in, and Log out. The display name is "First Last [tag]"
// (userstore.displayName); every part is React text. No user only happens
// when the passcode-gated debug panel jumps straight into the OS.
function UserLine({ user, onLogout, phone }) {
  const [hovered, setHovered] = useState(false)
  const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username : null
  return (
    <div data-user-line style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: phone ? "6px 8px 6px 14px" : "3px 6px 3px 12px",
      borderBottom: `1px solid ${TEAL}`,
      fontFamily: FONT,
    }}>
      <div style={{ minWidth: 0, lineHeight: 1.3 }} title={user ? displayName(user) : undefined}>
        {user ? (
          <>
            <div style={{ fontSize: "72%", color: GREEN, overflowWrap: "anywhere" }}>
              <span style={SR_ONLY}>Signed in as </span>
              <span aria-hidden="true">▸ </span>{name}
              {user.tag && <span style={{ color: TEAL }}> [{user.tag}]</span>}
            </div>
            <div style={{ fontSize: "58%", color: "rgba(0,255,65,0.55)", overflowWrap: "anywhere" }}>
              @{user.username}
            </div>
          </>
        ) : (
          <div style={{ fontSize: "65%", color: "rgba(0,255,65,0.55)" }}>▸ not signed in (debug)</div>
        )}
      </div>
      <button
        onClick={onLogout}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-logout
        style={{
          flexShrink: 0,
          fontFamily: FONT,
          fontSize: "62%",
          letterSpacing: "0.08em",
          color: hovered ? BG : GREEN,
          background: hovered ? GREEN : "transparent",
          border: `1px solid ${GREEN}`,
          borderRadius: 0,
          padding: phone ? "0 12px" : "1px 6px",
          minHeight: phone ? PHONE.HIT : undefined,
          lineHeight: 1.3,
          cursor: "pointer",
        }}
      >
        Log out
      </button>
    </div>
  )
}

// ── CASE PROGRESS ─────────────────────────────────────────────────────────
// scripted.exe's save state, reachable from the taskbar without opening any
// window. Reads the same store as the case-select cards (casestore.js) and
// resets through the same caseActions.reset behind the same two-step confirm
// as the in-panel "Start the case over" — nothing here keeps its own copy.
function CaseProgress({ phone }) {
  const { tested: testedByCase } = useCaseState()
  const started = PASSAGES.filter(c => testedByCase[c.id]?.length).length
  const note = { padding: phone ? "6px 14px" : "3px 12px", fontFamily: FONT, fontSize: "62%", color: mix(60), lineHeight: 1.45 }
  return (
    <div style={{ paddingTop: 2, paddingBottom: 4 }}>
      <div style={note}>
        Case progress saves automatically to your account on this device.
        <br />Started: {started} of {PASSAGES.length} cases
      </div>
      <div
        role="list"
        aria-label="Case progress"
        style={phone ? undefined : { maxHeight: 210, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: `${DIM} transparent` }}
      >
        {PASSAGES.map(c => {
          const tested = testedByCase[c.id] ?? []
          return (
            <div key={c.id} role="listitem" data-row style={{
              padding: phone ? "8px 14px" : "3px 12px",
              borderTop: `1px dotted ${DIM}`,
              fontFamily: FONT,
            }}>
              <div style={{ fontSize: "68%", color: GREEN, lineHeight: 1.35 }}>{c.title}</div>
              <div style={{ fontSize: "60%", color: tested.length ? TEAL : mix(50), lineHeight: 1.4 }}>
                {caseStatus(c, tested)}
              </div>
              {tested.length > 0 && <ResetCase caseId={c.id} title={c.title} phone={phone} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Same two steps and the same words as the in-panel StartOver (casepanel.jsx)
function ResetCase({ caseId, title, phone }) {
  const [asking, setAsking] = useState(false)
  const btn = (primary) => ({
    fontFamily: FONT,
    fontSize: phone ? "62%" : "58%",
    fontWeight: primary ? "bold" : "normal",
    color: primary ? GREEN : mix(75),
    background: primary ? mix(8) : "transparent",
    border: `1px solid ${primary ? GREEN : DIM}`,
    borderRadius: 0,
    padding: phone ? "0 12px" : "1px 6px",
    minHeight: phone ? PHONE.HIT : undefined,
    lineHeight: 1.3,
    cursor: "pointer",
  })
  if (!asking) {
    return (
      <div style={{ marginTop: phone ? 6 : 2 }}>
        <button style={btn(false)} onClick={() => setAsking(true)} aria-label={`Start the case over: ${title}`}>
          Start the case over
        </button>
      </div>
    )
  }
  return (
    <div role="group" aria-label={`Start ${title} over?`} style={{
      marginTop: phone ? 6 : 3, padding: phone ? "8px 10px" : "3px 6px",
      border: `1px dashed ${GREEN}`, color: GREEN,
    }}>
      <div style={{ fontSize: "60%", lineHeight: 1.4 }}>Clear every passage you've tested in this case and start again?</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: phone ? 8 : 3 }}>
        <button style={btn(false)} autoFocus onClick={() => setAsking(false)}>Keep my progress</button>
        <button style={btn(true)} onClick={() => caseActions.reset(caseId)}>Yes, start over</button>
      </div>
    </div>
  )
}

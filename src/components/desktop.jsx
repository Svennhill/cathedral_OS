// Desktop — icon layer of the OS
// Lives inside the screen frame div — coordinates are relative to the screen area.
// Icons positioned below the taskbar (taskbarHeightPct offset).
//
// Icons come from the OS icon system (components/icons.jsx) and colors from
// the --os-* theme variables (index.css) — no local hex, so the desktop
// swings with the palette like every other surface.

import { useState } from "react"
import { AppIcon } from "./icons"

// Phone layout: one tap opens (touch has no reliable double-click)
function DesktopIcon({ label, appId, onDoubleClick, phone }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onDoubleClick={phone ? undefined : onDoubleClick}
      onClick={phone ? onDoubleClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={phone ? "button" : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 6,
        width: 52,
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        border: `1px solid color-mix(in srgb, var(--os-accent) ${hovered ? 90 : 60}%, transparent)`,
        borderRadius: "var(--os-radius)",
        background: "var(--os-tile)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--os-accent)",
        boxShadow: hovered
          ? "var(--os-bevel-hi), 0 0 10px color-mix(in srgb, var(--os-accent) 45%, transparent)"
          : "var(--os-bevel-hi), 0 0 4px color-mix(in srgb, var(--os-accent) 30%, transparent)",
        transition: "box-shadow 120ms, border-color 120ms",
        flexShrink: 0,
      }}>
        <AppIcon id={appId} size={17} />
      </div>
      <span style={{
        color: "var(--os-accent)",
        fontSize: 7,
        textAlign: "center",
        fontFamily: "opendyslexic, monospace",
        textShadow: "0 0 5px color-mix(in srgb, var(--os-accent) 80%, transparent)",
        lineHeight: 1.3,
        letterSpacing: "0.02em",
        maxWidth: 50,
        wordBreak: "break-word",
      }}>
        {label}
      </span>
    </div>
  )
}

// zoom — desktop zoom (icons + labels only; never applied to app windows)
export default function Desktop({ openWindow, taskbarHeightPct, zoom = 1, phone = false }) {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      pointerEvents: "none",  // pass-through by default
    }}>
      {/* Icon column — top-left, below the taskbar */}
      <div style={{
        position: "absolute",
        top: `${taskbarHeightPct + 1}%`,
        left: "1%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zoom,
        pointerEvents: "auto",  // icons are interactive
      }}>
        <DesktopIcon
          label="scripted.exe"
          appId="scriptedexe"
          onDoubleClick={() => openWindow('scriptedexe', 'scripted.exe')}
          phone={phone}
        />
        <DesktopIcon
          label="doug's pretzel factory"
          appId="dougpretfac"
          onDoubleClick={() => openWindow('dougpretfac', "doug's pretzel factory")}
          phone={phone}
        />
      </div>
    </div>
  )
}

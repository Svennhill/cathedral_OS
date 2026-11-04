// icons.jsx — the Cathedral OS icon system
//
// One system for every OS glyph (desktop, taskbar, start menu, window
// controls). Rules:
//   • 24×24 grid, 2px stroke, round line caps and joins — everywhere.
//   • Stroke icons only: fill="none", stroke="currentColor". Color comes
//     from the parent's `color`, which is always a theme variable
//     (see the --os-* block in index.css), so icons swing with the palette.
//   • Corner language: 2px radius on rects (matches --os-radius-sm).
//   • Original line work drawn for this project — no pack art, no emoji,
//     no font glyphs. (The state/bevel treatment was informed by the
//     purchased Crom170 RPG UI pack; the drawings are ours.)
//
// To add an icon: draw it on the 24 grid with the shared props below and
// export it next to the others. Don't hand-roll an <svg> in a component.

function Svg({ size = 24, style, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// ── APP ICONS ────────────────────────────────────────────────────────────

// scripted.exe — a terminal window with a command prompt
export function IconScripted(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 13.5 10 15.5l-3.5 2" />
      <path d="M12.5 17.5H18" />
    </Svg>
  )
}

// doug's pretzel factory — a pretzel: loop with the two strands crossing
export function IconPretzel(props) {
  return (
    <Svg {...props}>
      <path d="M12 20.5C6 16.5 3.8 12.8 5.4 8.9 6.8 5.6 11 5.4 12 9c1-3.6 5.2-3.4 6.6-.1 1.6 3.9-.6 7.6-6.6 11.6Z" />
      <path d="M7.5 10.5c1.8 1 6 4.4 8 8" />
      <path d="M16.5 10.5c-1.8 1-6 4.4-8 8" />
    </Svg>
  )
}

// App-icon lookup by app id — desktop.jsx and startmenu.jsx share this so
// an app can never show two different marks in two places.
const APP_ICONS = {
  scriptedexe: IconScripted,
  dougpretfac: IconPretzel,
}

export function AppIcon({ id, ...props }) {
  const Icon = APP_ICONS[id] ?? IconWindow
  return <Icon {...props} />
}

// ── BRAND ────────────────────────────────────────────────────────────────

// Cathedral mark — a pointed-arch window under a cross (COS menu header)
export function IconCathedral(props) {
  return (
    <Svg {...props}>
      <path d="M12 2.5v3" />
      <path d="M10.25 4h3.5" />
      <path d="M5 21v-9.5C5 7.8 8 5.8 12 4.6c4 1.2 7 3.2 7 6.9V21" />
      <path d="M12 9v12" />
      <path d="M3 21h18" />
    </Svg>
  )
}

// ── CHROME GLYPHS ────────────────────────────────────────────────────────

// A window — taskbar slots for open windows
export function IconWindow(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.5" fill="currentColor" />
    </Svg>
  )
}

export function IconClose(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Svg>
  )
}

export function IconMinimize(props) {
  return (
    <Svg {...props}>
      <path d="M5 18h14" />
    </Svg>
  )
}

export function IconMaximize(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </Svg>
  )
}

export function IconRestore(props) {
  return (
    <Svg {...props}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Svg>
  )
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

export function IconChevronUp(props) {
  return (
    <Svg {...props}>
      <path d="m6 15 6-6 6 6" />
    </Svg>
  )
}

export function IconChevronRight(props) {
  return (
    <Svg {...props}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  )
}

// Resize grip — the windowbox corner handle, same stroke language
export function IconResizeGrip(props) {
  return (
    <Svg {...props}>
      <path d="M21 13 13 21" />
      <path d="M21 6 6 21" />
    </Svg>
  )
}

// ── TRAY / MEDIA ─────────────────────────────────────────────────────────

export function IconMusicNote(props) {
  return (
    <Svg {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </Svg>
  )
}

export function IconVolume(props) {
  return (
    <Svg {...props}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="M15.5 8.7a4.5 4.5 0 0 1 0 6.6" />
      <path d="M18.4 5.9a9 9 0 0 1 0 12.2" />
    </Svg>
  )
}

export function IconPlay(props) {
  return (
    <Svg {...props}>
      <path d="M7 4.8v14.4L19.5 12 7 4.8Z" />
    </Svg>
  )
}

export function IconPause(props) {
  return (
    <Svg {...props}>
      <path d="M7 4.5v15" />
      <path d="M17 4.5v15" />
    </Svg>
  )
}

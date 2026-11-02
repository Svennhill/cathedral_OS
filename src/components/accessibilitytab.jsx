// AccessibilityTab — pull-out card at the right edge of the screen
//
// Geometry (all measured against the live screen rect, so it holds in both
// normal and Screen Only modes, at any window size):
//   - The card is sized to fit inside the screen area (height ≤ 64% of the
//     screen, width ≤ 90% of it) and anchored to the screen's right edge.
//   - CLOSED: only the triangular tab shows. Normal mode: the tab pokes out
//     onto the bezel rim just right of the screen. Screen Only mode (no rim):
//     the tab sits just inside the screen's right edge.
//   - OPEN: the whole card slides in and sits fully inside the screen, its
//     right edge on the screen's right edge. The tab stays visible at its
//     top-left and closes the card again.
//   - A clip box (screen area, plus one tab-width of rim in normal mode)
//     hides and de-activates everything that is not on screen, so the card
//     can never cover the hardware panel or knobs below the screen.
//
// Pointer event model:
//   Tab zone: exactly the tab triangle — toggles open/closed.
//   OPEN only: the card body is a "click to close" zone; the checkbox
//   overlay stops propagation so it doesn't close the card.

import { useState, useRef, useLayoutEffect } from "react"

const FONT  = "opendyslexic, monospace"
const BLACK = "#1a1a1a"
const DIM   = "#888"
// aCardTab.png is 640×855: tab triangle in the top-left 114×100 px,
// card body from x=114 to the right edge.
const CARD_ASPECT    = 640 / 855   // width / height
const TAB_WIDTH_PCT  = 18          // % of card width covered by the tab
const TAB_HEIGHT_PCT = 12          // % of card height covered by the tab
const CARD_MAX_H     = 0.64        // card height, max fraction of screen height
const CARD_MAX_W     = 0.90        // card width, max fraction of screen width
const CARD_TOP       = 0.30        // preferred top, fraction of screen height

function AccOption({ label, checked, onChange }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 0",
      cursor: "pointer",
      fontFamily: FONT,
      fontSize: 11,
      color: BLACK,
      userSelect: "none",
      borderBottom: "1px solid rgba(0,0,0,0.08)",
    }}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 14, height: 14, cursor: "pointer", accentColor: BLACK }}
      />
    </label>
  )
}

export default function AccessibilityTab({
  screenOnly, setScreenOnly,
  alwaysScreenOnly, setAlwaysScreenOnly,
  greyscale,  setGreyscale,
  activePCT,
}) {
  const [open, setOpen] = useState(false)
  const anchorRef       = useRef(null)
  const [screen, setScreen] = useState({ w: 0, h: 0 })

  // Track the screen area's rendered size (changes with window size and mode)
  useLayoutEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const measure = () => setScreen({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    const obs = new ResizeObserver(measure)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const { w: W, h: H } = screen
  const cardH = Math.min(H * CARD_MAX_H, (W * CARD_MAX_W) / CARD_ASPECT)
  const cardW = cardH * CARD_ASPECT
  const tabW  = cardW * (TAB_WIDTH_PCT / 100)
  const cardTop = Math.max(0, Math.min(H * CARD_TOP, H - cardH - H * 0.03))

  const closedLeft = screenOnly ? W - tabW : W   // tab only: inside edge (SO) / on rim
  const openLeft   = W - cardW                   // whole card inside the screen

  return (
    <div
      ref={anchorRef}
      style={{
        // Exactly the screen area
        position: "absolute",
        left:   `${activePCT.left   * 100}%`,
        top:    `${activePCT.top    * 100}%`,
        width:  `${activePCT.width  * 100}%`,
        height: `${activePCT.height * 100}%`,
        zIndex: 400,
        pointerEvents: "none",
      }}
    >
      {/* Clip box — screen area (+ one tab-width of bezel rim in normal mode) */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        width: W + (screenOnly ? 0 : tabW),
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}>
      <div
        style={{
          position: "absolute",
          top: cardTop,
          left: open ? openLeft : closedLeft,
          width: cardW,
          height: cardH,
          transition: "left 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
          visibility: W ? "visible" : "hidden",
        }}
      >
        {/* Base card+tab image */}
        <img
          src="/screen/aCardTab.png"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />

        {/* ── TAB CLICK ZONE ───────────────────────────────────
            Always active and always on screen — covers just the
            triangular tab. Opens the card, or closes it when open.
        ─────────────────────────────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          title={open ? "Close accessibility" : "Accessibility"}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: `${TAB_WIDTH_PCT}%`,
            height: `${TAB_HEIGHT_PCT}%`,
            cursor: "pointer",
            zIndex: 3,
            pointerEvents: "auto",
            // Uncomment to debug click zone:
            // background: "rgba(255,0,0,0.15)",
          }}
        />

        {/* ── CARD CLOSE ZONE ──────────────────────────────────
            Only active when open — covers the body of the card.
            Clicking anywhere on the card body (outside checkboxes) closes it.
        ─────────────────────────────────────────────────────── */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              left: `${TAB_WIDTH_PCT}%`,
              right: 0,
              height: "100%",
              cursor: "pointer",
              zIndex: 2,
              pointerEvents: "auto",
            }}
          />
        )}

        {/* ── CONTENT OVERLAY ──────────────────────────────────
            Positioned over the card body (right 78% of image).
            Stops propagation so checkbox clicks don't close the panel.
            Inactive (pointer-events:none) when card is closed.
        ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: "4%",
            left: `${TAB_WIDTH_PCT + 2}%`,
            right: "2%",
            bottom: "2%",
            overflow: "auto",
            pointerEvents: open ? "auto" : "none",
            zIndex: 4,
          }}
          onClick={e => e.stopPropagation()}
        >
          <img
            src="/screen/accCard.png"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              userSelect: "none",
            }}
            draggable={false}
          />

          {/* Text content */}
          <div style={{ position: "relative", zIndex: 1, padding: "8px 10px 6px", fontFamily: FONT }}>

            <div style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: "bold",
              color: BLACK,
              letterSpacing: "0.1em",
              marginBottom: 8,
              paddingBottom: 4,
              borderBottom: "1px solid rgba(0,0,0,0.2)",
            }}>
              ACCESSIBILITY
            </div>

            <AccOption
              label="Screen Only"
              checked={screenOnly}
              onChange={setScreenOnly}
            />
            <AccOption
              label="Always load Screen Only"
              checked={alwaysScreenOnly}
              onChange={(v) => { setAlwaysScreenOnly(v); setScreenOnly(v) }}
            />
            <AccOption
              label="Greyscale"
              checked={greyscale}
              onChange={setGreyscale}
            />

            <div style={{
              marginTop: 6,
              color: DIM,
              fontFamily: FONT,
              fontSize: 9,
              lineHeight: 1.7,
              fontStyle: "italic",
            }}>
              Increase size<br />
              Color blindness modes<br />
              Magnifier<br />
              Screen reader
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

// AccessibilityTab — pull-out card at the right edge of the screen
//
// Pointer event model:
//   CLOSED: only the triangular tab strip (left ~22% of the image) is clickable.
//           Everything else is pointer-events:none so underlying UI (knobs, etc.) is unblocked.
//   OPEN:   the full card body acts as a "click to close" zone.
//           The content overlay (checkboxes) stops propagation so it doesn't close the card.

import { useState, useRef, useLayoutEffect } from "react"

const FONT  = "opendyslexic, monospace"
const BLACK = "#1a1a1a"
const DIM   = "#888"
const TAB_WIDTH_PCT = 22  // % of card image width that is the tab triangular area

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
  const [open, setOpen]           = useState(false)
  const cardRef                   = useRef(null)
  const [slideAmount, setSlideAmount] = useState(0)
  const [cardWidth, setCardWidth]     = useState(0)

  useLayoutEffect(() => {
    if (cardRef.current) {
      const w = cardRef.current.offsetWidth
      setCardWidth(w)
      setSlideAmount(Math.round(w * 0.8))
    }
  })

  const tabZoneWidth = Math.round(cardWidth * (TAB_WIDTH_PCT / 100))

  const wrapperStyle = {
    position: "absolute",
    left:   `${(activePCT.left + activePCT.width) * 100}%`,
    top:    `${(activePCT.top + activePCT.height * 0.30) * 100}%`,
    transform: open ? `translateX(-${slideAmount}px)` : 'translateX(0)',
    transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 400,
    display: "flex",
    alignItems: "flex-start",
    // Wrapper itself has no pointer events — we use explicit zones below
    pointerEvents: "none",
  }

  const cardHeightPct = `${activePCT.height * 52}%`

  return (
    <div style={wrapperStyle}>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          height: cardHeightPct,
          flexShrink: 0,
          pointerEvents: "none",
        }}
      >
        {/* Base card+tab image */}
        <img
          src="/screen/aCardTab.png"
          style={{
            height: "100%",
            width: "auto",
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />

        {/* ── TAB CLICK ZONE ───────────────────────────────────
            Always active — narrow strip covering just the triangular tab.
            Clicking opens the card.
        ─────────────────────────────────────────────────────── */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: tabZoneWidth || `${TAB_WIDTH_PCT}%`,
            height: "100%",
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
              left: tabZoneWidth || `${TAB_WIDTH_PCT}%`,
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
            overflow: "hidden",
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
  )
}

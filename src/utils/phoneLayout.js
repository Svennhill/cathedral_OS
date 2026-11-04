// phoneLayout.js — the phone layout and the phone zoom policy
//
// ONE breakpoint, ONE strategy. Below the breakpoint the app switches to the
// phone layout:
//   1. Screen Only is the startup default (unless the owner has made an
//      explicit "Always load Screen Only" choice — that always wins). The
//      bezel stays one tap away (start menu or accessibility card).
//   2. Inside the screen frame, controls get touch sizes (≈40–44 px hit
//      areas), windows open maximized, and window/desktop content is drawn
//      at a phone base scale (the F6 zoom sliders multiply on top of it).
//   3. Browser pinch / double-tap zoom is held off INSIDE the app only, so it
//      can't strand the device canvas off-screen (see PHONE ZOOM POLICY).
// Above the breakpoint nothing here applies: every desktop value is the one
// it was before this file existed.

import { useEffect, useSyncExternalStore } from "react"

// ── BREAKPOINT ───────────────────────────────────────────────────────────
// Narrow windows (any phone in portrait, small tablets in split view, a
// desktop window dragged very narrow) and short touch screens (a phone in
// landscape). A desktop browser at normal sizes never matches.
export const PHONE_QUERY = "(max-width: 639px), (pointer: coarse) and (max-height: 479px)"

const mql = () => (typeof window !== "undefined" && window.matchMedia
  ? window.matchMedia(PHONE_QUERY) : null)

export const isPhoneNow = () => Boolean(mql()?.matches)

export function usePhoneLayout() {
  return useSyncExternalStore(
    (fn) => {
      const m = mql()
      if (!m) return () => {}
      m.addEventListener("change", fn)
      return () => m.removeEventListener("change", fn)
    },
    isPhoneNow,
    () => false,
  )
}

// ── PHONE SIZES ──────────────────────────────────────────────────────────
export const PHONE = {
  TASKBAR_PX:    44,    // taskbar height in the phone layout
  TASKBAR_MAX:   22,    // …but never more than this % of the screen frame
  HIT:           40,    // minimum touch target (px)
  WINDOW_SCALE:  1.3,   // window content base scale (× the Window zoom slider)
  DESKTOP_SCALE: 1.5,   // desktop icon base scale (× the Desktop zoom slider)
}

// Taskbar height as % of the screen frame: the desktop constant above the
// breakpoint, a fixed touch height below it.
export function taskbarPct(phone, frameH, desktopPct) {
  if (!phone || !frameH) return desktopPct
  return Math.min(PHONE.TASKBAR_MAX, Math.max(desktopPct, (PHONE.TASKBAR_PX / frameH) * 100))
}

// ── PHONE BASE SCALES ────────────────────────────────────────────────────
// The base scale the F6 zoom sliders multiply. The WINDOW_SCALE /
// DESKTOP_SCALE boosts are tuned for Screen Only's full-viewport frame —
// the phone reading view. Bezel view on a phone is the device as a
// miniature: its frame is ~289 px wide, and the same boosts inside it are
// the "everything inside is too zoomed" bug (LIVE-NOTES item 1), so bezel
// view runs at the desktop's own 1.0 base and the sliders mean the same
// thing in both modes. Above the breakpoint the base is always 1.
export function phoneBaseScales(phone, screenOnly) {
  if (!phone)     return { desktop: 1, window: 1 }
  if (screenOnly) return { desktop: PHONE.DESKTOP_SCALE, window: PHONE.WINDOW_SCALE }
  return { desktop: 1, window: 1 }
}

// ── SCREEN-AREA COVER ────────────────────────────────────────────────────
// The boot/cathedral/OS art is drawn on full-bezel canvases (2208×2427) with
// the picture in the screen area. Screen Only stretches that layer to the
// window's shape, which on a tall phone squeezes the art ~2.6×. In the phone
// layout the art is instead scaled uniformly so its SCREEN AREA covers the
// frame (centered, cropped at the sides) — never distorted.
const ART = { W: 2208, H: 2427, L: 276, T: 296, SW: 1636, SH: 1317 }
export function screenArtCover(frameW, frameH) {
  const s = Math.max(frameW / ART.SW, frameH / ART.SH) || 0
  return {
    position: "absolute",
    width:  ART.W * s,
    height: ART.H * s,
    left: -ART.L * s - (ART.SW * s - frameW) / 2,
    top:  -ART.T * s - (ART.SH * s - frameH) / 2,
    maxWidth: "none",
  }
}

// ── PHONE STYLESHEET ─────────────────────────────────────────────────────
// Every rule but the first is scoped under .cos-phone, which only the phone
// layout puts on the app container — so on desktop none of them can match.
// The first (.cos-viewport) applies everywhere but resolves to the same
// number as before on desktop, where 100dvh === 100vh.
export const PHONE_CSS = `
/* Full visible height on phones: 100vh on iOS Safari includes the area under
   the browser's own toolbars, which would push the bottom of the screen out
   of view on load. dvh is the visible height (same number as vh on desktop). */
.cos-viewport { height: 100vh; height: 100dvh; }

/* The page is a device, not a document: a downward drag must not trigger
   Android Chrome's pull-to-refresh (a full reload mid-case) or rubber-band
   scroll chaining. Phone layout only — the class is never on desktop. */
.cos-phone { overscroll-behavior: none; }

/* iOS zooms the whole page when an input under 16px gets focus — that is a
   browser zoom the user didn't ask for. Inputs in the phone layout are 16px. */
.cos-phone input:not([type="checkbox"]):not([type="range"]) { font-size: 16px !important; }

/* scripted.exe controls: content is drawn at ${PHONE.WINDOW_SCALE}×, so these
   minimums land at ≈40px on screen. Layout-only — no colors or type change. */
.cos-phone .cs-root .cs-btn,
.cos-phone .sc-root .cs-btn { min-height: ${Math.ceil(PHONE.HIT / PHONE.WINDOW_SCALE)}px; }
.cos-phone .cs-foot { padding-top: 6px; padding-bottom: 6px; }
.cos-phone [role="tablist"] button,
.cos-phone [aria-label="Case view"] button { min-height: ${Math.ceil(PHONE.HIT / PHONE.WINDOW_SCALE)}px; }
`

// ── PHONE ZOOM POLICY ────────────────────────────────────────────────────
// The device is one fixed canvas laid out to the window. Browser pinch zoom
// magnifies that canvas past the window edges and leaves the user panning a
// giant bezel. So, in the phone layout only:
//   • the app container carries touch-action: pan-x pan-y — scrolling works,
//     pinch-zoom and double-tap-zoom don't start inside the app;
//   • Safari's own gesture events are cancelled (older iOS ignores
//     touch-action for pinch; these events are its own pinch path);
//   • inputs are 16px (PHONE_CSS), so iOS never auto-zooms on focus — with
//     pinch held off, that zoom would be the one the user couldn't undo.
// Magnification stays available, and reflows instead of panning: the start
// menu's Desktop/Window zoom (F6) and the OS's own zoom/magnifier, which web
// pages can't block. If a browser setting forces pinch zoom on anyway
// ("force enable zoom"), nothing here fights it and pinching back out
// undoes it. The viewport meta is NOT restricted, desktop is never
// affected, and nothing applies above the breakpoint.
export function usePhoneZoomGuard(phone) {
  useEffect(() => {
    if (!phone) return
    const stop = (e) => e.preventDefault()
    document.addEventListener("gesturestart", stop, { passive: false })
    document.addEventListener("gesturechange", stop, { passive: false })
    return () => {
      document.removeEventListener("gesturestart", stop)
      document.removeEventListener("gesturechange", stop)
    }
  }, [phone])
}

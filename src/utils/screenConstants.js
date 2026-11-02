// screenConstants.js
// Ground truth dimensions for both bezels.
// DO NOT approximate — these are exact values from the design files.

// ── FULL BEZEL (bezeld.png) ─────────────────────────────────────────────
export const BEZEL_W = 2208
export const BEZEL_H = 2427

export const SCREEN_TOP    = 296   // px from top of bezel to top of screen
export const SCREEN_BOTTOM = 814   // px from bottom of bezel to bottom of screen
export const SCREEN_LEFT   = 276   // px from left of bezel to left of screen
export const SCREEN_RIGHT  = 296   // px from right of bezel to right of screen

export const SCREEN_W = BEZEL_W - SCREEN_LEFT - SCREEN_RIGHT  // 1636
export const SCREEN_H = BEZEL_H - SCREEN_TOP  - SCREEN_BOTTOM // 1317

// Percentages of bezel container — used for CSS clipPath and frame positioning
export const PCT = {
  top:    SCREEN_TOP    / BEZEL_H,  // 0.12197
  bottom: SCREEN_BOTTOM / BEZEL_H,  // 0.33539
  left:   SCREEN_LEFT   / BEZEL_W,  // 0.12500
  right:  SCREEN_RIGHT  / BEZEL_W,  // 0.13406
  width:  SCREEN_W      / BEZEL_W,  // 0.74094
  height: SCREEN_H      / BEZEL_H,  // 0.54264
}

// clipPath — inset(top right bottom left round corners)
export const SCREEN_CLIP = `inset(${PCT.top * 100}% ${PCT.right * 100}% ${PCT.bottom * 100}% ${PCT.left * 100}% round 4px)`


// ── SCREEN-ONLY MODE ────────────────────────────────────────────────────
// Screen-only mode shows the screen alone, filling the browser window with no
// bezel and no margins. The same full-bezel layer is reused; it is sized and
// shifted so its screen area (PCT) covers exactly the viewport (vw × vh) and
// everything outside it — the bezel — falls outside the window's clip.
// The two axes scale independently so the screen fills any window shape;
// on-screen text is sized in px, so it is not distorted.
export function screenOnlyBox(vw, vh) {
  const width  = vw / PCT.width
  const height = vh / PCT.height
  return { width, height, left: -PCT.left * width, top: -PCT.top * height }
}


// ── SHARED ──────────────────────────────────────────────────────────────
// Taskbar height as a percentage of the screen frame height
export const TASKBAR_HEIGHT_PCT = 3.5

// ── ZOOM ────────────────────────────────────────────────────────────────
// Desktop zoom and window zoom are independent. 1 = 100% = original look.
export const ZOOM_STEPS   = [0.75, 1, 1.25, 1.5, 1.75, 2]
export const ZOOM_DEFAULT = 1
export const clampZoom = (z) => Math.min(ZOOM_STEPS[ZOOM_STEPS.length - 1], Math.max(ZOOM_STEPS[0], z))

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


// ── SCREEN-ONLY BEZEL (screenOnlyBezel.png) ─────────────────────────────
// A minimal gray frame, 50px rim on all sides.
export const SO_BEZEL_W  = 1736
export const SO_BEZEL_H  = 1417
export const SO_INSET    = 50   // px on each side (equal all around)

export const SO_PCT = {
  top:    SO_INSET / SO_BEZEL_H,                         // 0.03527
  bottom: SO_INSET / SO_BEZEL_H,                         // 0.03527
  left:   SO_INSET / SO_BEZEL_W,                         // 0.02882
  right:  SO_INSET / SO_BEZEL_W,                         // 0.02882
  width:  (SO_BEZEL_W - SO_INSET * 2) / SO_BEZEL_W,     // 0.94237
  height: (SO_BEZEL_H - SO_INSET * 2) / SO_BEZEL_H,     // 0.92942
}

export const SO_CLIP = `inset(${SO_PCT.top * 100}% ${SO_PCT.right * 100}% ${SO_PCT.bottom * 100}% ${SO_PCT.left * 100}% round 6px)`


// ── SCREEN-ONLY OVERLAY ─────────────────────────────────────────────────
// Position of screenOnlyBezel.png when overlaid within the FULL bezel container.
// The SO bezel's inner screen area (50px inset) must align exactly with the
// full bezel's screen area (SCREEN_TOP, SCREEN_LEFT).
// So: SO_bezel_top = SCREEN_TOP - SO_INSET, SO_bezel_left = SCREEN_LEFT - SO_INSET
export const SO_OVERLAY_TOP    = (SCREEN_TOP  - SO_INSET) / BEZEL_H   // (296-50)/2427 ≈ 0.10136
export const SO_OVERLAY_LEFT   = (SCREEN_LEFT - SO_INSET) / BEZEL_W   // (276-50)/2208 ≈ 0.10235
export const SO_OVERLAY_WIDTH  = SO_BEZEL_W / BEZEL_W                  // 1736/2208     ≈ 0.78623
export const SO_OVERLAY_HEIGHT = SO_BEZEL_H / BEZEL_H                  // 1417/2427     ≈ 0.58382


// ── SHARED ──────────────────────────────────────────────────────────────
// Taskbar height as a percentage of the screen frame height
export const TASKBAR_HEIGHT_PCT = 3.5

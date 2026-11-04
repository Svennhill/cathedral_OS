// scenestyle.js — styles for the visual (drag-and-drop) view of a case.
// Layered on top of PANEL_CSS (same head, foot, buttons, verses and tags),
// every rule scoped under .sc-root. Sizes are fluid so the scene fits a
// phone-width window: names wrap instead of clipping, and the figures wrap
// onto a second row rather than overflowing the ground.
//
// PALETTE: every scene color is a --scene-* variable, defined once below
// from the panel palette. A full-color theme is a new set of values for
// these variables plus SCENE_PALETTE = "color" in sprites.js — no rule
// below names a raw color. Red (--scene-bad) is reserved for the
// contradiction verdict readout; figures never render in it.

import { GREEN, DIM, DIMMED, RED, BG, FONT } from "./panelstyle"

export const AMBER = "#ffaa00"

export const SCENE_CSS = `
.sc-root {
  container-type: size; container-name: scene;
  --scene-fg: ${GREEN};
  --scene-dim: ${DIM};
  --scene-dimmed: ${DIMMED};
  --scene-bad: ${RED};
  --scene-warn: ${AMBER};
  --scene-panel: ${BG};
  --scene-faint: rgba(0,255,65,0.05);
  --scene-wash: rgba(0,255,65,0.06);
  --scene-soft: rgba(0,255,65,0.12);
  --scene-mid: rgba(0,255,65,0.14);
  --scene-glow: rgba(0,255,65,0.35);
  --scene-beam: rgba(0,255,65,0.07);
  --scene-star: rgba(0,255,65,0.5);
  --scene-cloud: #03240f;
  --scene-cloud-rim: rgba(0,255,65,0.45);
  --scene-hill: #041f0d;
  --scene-hill-far: #031708;
  --scene-trunk: #0a3d1c;
  --scene-bad-wash: rgba(255,68,68,0.06);
  --scene-bad-glow: rgba(255,68,68,0.25);
}
.sc-root .cs-foot .cs-hint:empty { min-width: 0; }
.sc-root .cs-step-name { white-space: normal; overflow: visible; }
.sc-root .sc-rule {
  margin: 0 0 8px; padding: 4px 8px; border-left: 2px solid var(--scene-fg);
  background: var(--scene-faint); font-size: 10px;
}
.sc-root .sc-rule b { white-space: nowrap; }

/* ── the scene ─────────────────────────────────────────────────────── */
.sc-scene {
  position: relative; display: flex; flex-direction: column;
  margin: 0 0 8px; border: 1px solid var(--scene-fg);
  box-shadow: inset 0 0 14px rgba(0,255,65,0.08);
  touch-action: manipulation;
}

/* The sky: a starfield and light rays over a top glow, and a bank of
   clouds sitting on the dividing line (the ::after puffs — a lit rim
   circle painted 2px above each dark puff, so only a crescent shows). */
.sc-heaven {
  position: relative; min-height: 140px; padding: 26px 6px 16px;
  display: flex; align-items: flex-end;
  background:
    radial-gradient(circle at 12% 30%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 37% 18%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 63% 34%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 86% 15%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 24% 52%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 74% 58%, var(--scene-star) 0 1px, transparent 1.5px),
    radial-gradient(circle at 48% 8%, var(--scene-star) 0 1px, transparent 1.5px),
    linear-gradient(97deg, transparent 38%, var(--scene-beam) 47%, transparent 56%),
    linear-gradient(88deg, transparent 56%, var(--scene-beam) 64%, transparent 72%),
    linear-gradient(104deg, transparent 16%, var(--scene-beam) 24%, transparent 32%),
    radial-gradient(ellipse 90% 50% at 50% -8%, var(--scene-soft), transparent 70%),
    linear-gradient(180deg, var(--scene-wash), transparent);
  border-bottom: 1px solid var(--scene-fg);
  transition: background-color 120ms, box-shadow 120ms;
}
.sc-heaven::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 38px;
  z-index: 0; pointer-events: none;
  background:
    radial-gradient(circle 21px at 7% 118%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 28px at 20% 122%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 19px at 33% 116%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 31px at 48% 124%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 20px at 62% 117%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 27px at 76% 121%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 22px at 90% 118%, var(--scene-cloud) 98%, transparent 100%),
    radial-gradient(circle 21px at 7% calc(118% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 28px at 20% calc(122% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 19px at 33% calc(116% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 31px at 48% calc(124% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 20px at 62% calc(117% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 27px at 76% calc(121% - 2px), var(--scene-cloud-rim) 98%, transparent 100%),
    radial-gradient(circle 22px at 90% calc(118% - 2px), var(--scene-cloud-rim) 98%, transparent 100%);
}
.sc-heaven.over, .sc-heaven.armed { box-shadow: inset 0 0 0 2px var(--scene-fg), inset 0 0 18px var(--scene-glow); }
.sc-heaven.over { background-color: var(--scene-soft); }

/* The zone's own button fills it, under the figures, so a tap on empty sky
   (or Enter on the keyboard) sends the selected figure up */
.sc-root .sc-zonebtn {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 6px;
  padding: 4px 6px; margin: 0; text-align: left;
  font-family: ${FONT}; color: var(--scene-fg); background: transparent;
  border: 0; border-radius: 0; cursor: pointer;
}
.sc-root .sc-zonebtn:hover { border: 0; }
.sc-root .sc-zonebtn:focus-visible { outline: 2px solid var(--scene-fg); outline-offset: -3px; }
.sc-zone-label {
  font-size: 13px; font-weight: bold; letter-spacing: 0.18em;
  text-shadow: 0 0 6px var(--scene-glow);
}
/* (No .sc-zone-hint / .sc-empty rules: in-scene hint and empty-state text
   were removed by Steven's ruling, 2026-11-04 — how-to lives in the case
   text above the scene, not painted into it.) */

.sc-row {
  position: relative; z-index: 1; width: 100%;
  display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: 4px 6px;
  pointer-events: none;
}
.sc-row > * { pointer-events: auto; }
/* Staging option B (Steven's ruling, 2026-11-04): the Earth row spreads
   its figures edge to edge instead of gathering them at center, and the
   Earth section carries more air above the figures (see .sc-earth
   padding). On wide scenes the spread relaxes to space-around so the
   cast never pins to distant walls. The Heaven row stays centered —
   figures sent up gather under the rays. */
.sc-earth .sc-row { justify-content: space-between; padding: 0 10px; }
@container scene (min-width: 560px) {
  .sc-earth .sc-row { justify-content: space-around; }
}
/* the row a figure is dragged out of rides above the other place's figures */
.sc-row.lift { z-index: 2; }

/* The ground: low rolling hills behind the figures (::before) and an
   olive tree standing at the left (::after — canopy blobs over a trunk
   stripe), over a textured ground strip with a bright top line. */
.sc-earth {
  position: relative; padding: 22px 6px 0;
  background: linear-gradient(180deg, transparent, var(--scene-faint));
  transition: box-shadow 120ms;
}
.sc-earth::before {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 75% 65% at 8% 112%, var(--scene-hill) 62%, transparent 63%),
    radial-gradient(ellipse 65% 55% at 55% 118%, var(--scene-hill-far) 62%, transparent 63%),
    radial-gradient(ellipse 70% 60% at 96% 110%, var(--scene-hill) 62%, transparent 63%),
    /* a continuous far ridge behind all three hills (last layer = furthest
       back): the hill line runs unbroken across the scene, so no notch of
       bare panel can split the hills mid-scene (Steven's ruling,
       2026-11-04 — same fix the reference mockups took) */
    radial-gradient(ellipse 140% 55% at 50% 125%, var(--scene-hill-far) 62%, transparent 63%);
}
.sc-earth::after {
  content: ""; position: absolute; left: 0; bottom: 20px; width: 92px; height: 66px;
  z-index: 0; pointer-events: none;
  background:
    radial-gradient(circle 17px at 34% 26%, var(--scene-hill) 98%, transparent 100%),
    radial-gradient(circle 21px at 55% 18%, var(--scene-hill) 98%, transparent 100%),
    radial-gradient(circle 15px at 72% 30%, var(--scene-hill) 98%, transparent 100%),
    radial-gradient(circle 12px at 48% 38%, var(--scene-hill) 98%, transparent 100%),
    linear-gradient(90deg, transparent 45%, var(--scene-trunk) 45%, var(--scene-trunk) 55%, transparent 55%);
}
.sc-earth.over, .sc-earth.armed { box-shadow: inset 0 0 0 2px var(--scene-fg), inset 0 0 18px var(--scene-glow); }

/* The ground's own button mirrors the zone's: rendered only while a figure
   up in the zone is selected, so a tap on empty ground (or Enter) brings
   that figure back down. Under the figures, like the zone button. */
.sc-root .sc-earthbtn {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;
  display: flex; align-items: flex-start; justify-content: flex-end;
  padding: 4px 6px; margin: 0;
  font-family: ${FONT}; color: var(--scene-fg); background: transparent;
  border: 0; border-radius: 0; cursor: pointer;
}
.sc-root .sc-earthbtn:hover { border: 0; }
.sc-root .sc-earthbtn:focus-visible { outline: 2px solid var(--scene-fg); outline-offset: -3px; }

/* The soil band stays a thin strip under the ground line (Steven's
   note on the B mockup, 2026-11-04: the crust band ran ~a fifth of the
   scene, thicker than it needs to be). */
.sc-ground {
  position: relative; z-index: 1; pointer-events: none;
  margin: 0 -6px; padding: 1px 6px 0; border-top: 2px solid var(--scene-fg);
  box-shadow: 0 -3px 8px var(--scene-glow);
  background: repeating-linear-gradient(135deg, var(--scene-mid) 0 2px, transparent 2px 6px);
  font-size: 13px; font-weight: bold; letter-spacing: 0.18em; text-align: center;
  text-shadow: 0 0 6px var(--scene-glow);
}

/* ── figures ───────────────────────────────────────────────────────── */
.sc-root .sc-fig {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: 40px; max-width: 76px; padding: 3px 3px 2px; margin: 0;
  font-family: ${FONT}; font-size: 10px; font-weight: bold; line-height: 1.15; color: var(--scene-fg);
  background: transparent; border: 1px solid transparent; border-radius: 0;
  cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none;
  -webkit-touch-callout: none;
}
.sc-root .sc-fig:hover { border-color: var(--scene-dim); background: var(--scene-wash); }
.sc-root .sc-fig:focus-visible { outline: 2px solid var(--scene-fg); outline-offset: 1px; }
.sc-root .sc-fig[aria-pressed="true"] {
  border-color: var(--scene-fg); background: var(--scene-mid); box-shadow: 0 0 8px var(--scene-glow);
}
.sc-root .sc-fig.dragging {
  z-index: 20; cursor: grabbing; border-color: var(--scene-fg); background: var(--scene-panel);
  box-shadow: 0 0 10px var(--scene-glow); transition: none;
}
.sc-root .sc-fig.settle { transition: transform 160ms ease-out; }
/* The sprite: a 16×26 layered pixel figure, shown at 2× native (32×52).
   The glyph below is the fallback for a person with no sprite yet. */
.sc-sprite { width: 32px; height: 52px; display: block; image-rendering: pixelated; pointer-events: none; }
.sc-person { width: 16px; height: 26px; display: block; shape-rendering: crispEdges; }
.sc-person rect { fill: currentColor; }
/* Up in the zone a figure carries Heaven's amber halo glow (palette rule
   confirmed by Steven, 2026-11-04: Earth green ramp, Heaven amber, red
   ONLY for the contradiction verdict — heaven is not an error state).
   The halo sprites (Jesus, Elijah) draw their own amber halo; this glow
   gives every figure sent up the same amber mark. */
.sc-fig.up .sc-sprite, .sc-fig.up .sc-person { filter: drop-shadow(0 0 3px var(--scene-warn)); }
.sc-name { max-width: 100%; text-align: center; overflow-wrap: anywhere; }

.sc-fig.arrive { animation: sc-arrive 420ms ease-out both; }
.sc-fig.land   { animation: sc-land 420ms ease-out both; }
.sc-fig.nope   { animation: sc-nope 420ms ease-out both; }
@keyframes sc-arrive { from { transform: translateY(14px); opacity: 0.3; } to { transform: none; opacity: 1; } }
@keyframes sc-land   { from { transform: translateY(-14px); opacity: 0.3; } to { transform: none; opacity: 1; } }
@keyframes sc-nope {
  0% { transform: translateY(-18px); color: var(--scene-warn); }
  45% { transform: translateY(0); }
  60% { transform: translateX(-3px); } 75% { transform: translateX(3px); }
  100% { transform: none; }
}

/* ── the result readout ────────────────────────────────────────────── */
.sc-out { margin: 0 0 8px; padding: 8px; border: 1px solid var(--scene-fg); }
.sc-out.none   { border-color: var(--scene-warn); color: var(--scene-warn); }
.sc-out.contra { border-color: var(--scene-bad); box-shadow: 0 0 6px var(--scene-bad-glow); }
.sc-out-top { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 8px; margin-bottom: 4px; }
.sc-out-say { font-size: 13px; font-weight: bold; }
.sc-out .cs-verse { margin-bottom: 6px; }
.sc-out-note { margin: 0; font-size: 10px; color: var(--scene-dimmed); }
.sc-out.none .sc-out-note { color: var(--scene-warn); opacity: 0.85; }
.sc-tag-amber { color: var(--scene-warn); }

.sc-contra {
  margin-top: 6px; padding: 6px 8px; border: 2px solid var(--scene-bad); color: var(--scene-bad);
  background: var(--scene-bad-wash);
}
.sc-contra-v { font-size: 15px; font-weight: bold; letter-spacing: 0.08em; text-shadow: 0 0 8px currentColor; }
.sc-contra p { margin: 3px 0 0; font-size: 10px; }
.sc-contra .sc-contra-rule { font-weight: bold; font-size: 11px; }
.sc-contra .sc-contra-plain { color: var(--scene-fg); opacity: 0.8; }
.sc-contra.later { animation: sc-reveal 260ms ease-out both; }
@keyframes sc-reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.sc-root .sc-help { margin: 0 0 6px; font-size: 10px; color: var(--scene-dimmed); }

/* A short window (the bezel view on a phone): keep the step line and the
   Back/Next row, and give the rest of the height to the scene. The heading
   stays in the page for screen readers and focus. */
@container scene (max-height: 300px) {
  .sc-root .cs-h {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap; margin: 0;
  }
  .sc-root .cs-body { padding-top: 4px; display: flex; flex-direction: column; }
  .sc-root .cs-body > * { flex-shrink: 0; }
  .sc-root .cs-body > .sc-rule, .sc-root .cs-body > .sc-help { order: 2; }
  .sc-root .cs-body > .cs-btn.wide { order: 3; }
  /* the scene first, so scrolling up mid-drag lands on the sky */
  .sc-root .cs-body > .cs-scorebar { order: 1; margin-bottom: 4px; padding: 2px 6px; }
  .sc-root .cs-foot { padding: 2px 6px; }
  .sc-root .cs-foot .cs-btn { padding: 2px 8px; }
  .sc-heaven { min-height: 78px; padding-top: 20px; }
  .sc-earth { padding-top: 4px; }
}

@media (prefers-reduced-motion: reduce) {
  .sc-fig.arrive, .sc-fig.land, .sc-fig.nope, .sc-contra.later { animation: none; }
  .sc-root .sc-fig.settle { transition: none; }
}
`

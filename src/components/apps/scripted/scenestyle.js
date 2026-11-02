// scenestyle.js — styles for the visual (drag-and-drop) view of a case.
// Layered on top of PANEL_CSS (same head, foot, buttons, verses and tags),
// every rule scoped under .sc-root. Sizes are fluid so the scene fits a
// phone-width window: names wrap instead of clipping, and the figures wrap
// onto a second row rather than overflowing the ground.

import { GREEN, DIM, DIMMED, RED, BG, FONT } from "./panelstyle"

export const AMBER = "#ffaa00"

export const SCENE_CSS = `
.sc-root { container-type: size; container-name: scene; }
.sc-root .cs-foot .cs-hint:empty { min-width: 0; }
.sc-root .cs-step-name { white-space: normal; overflow: visible; }
.sc-root .sc-rule {
  margin: 0 0 8px; padding: 4px 8px; border-left: 2px solid ${GREEN};
  background: rgba(0,255,65,0.05); font-size: 10px;
}
.sc-root .sc-rule b { white-space: nowrap; }

/* ── the scene ─────────────────────────────────────────────────────── */
.sc-scene {
  position: relative; display: flex; flex-direction: column;
  margin: 0 0 8px; border: 1px solid ${GREEN};
  box-shadow: inset 0 0 14px rgba(0,255,65,0.08);
  touch-action: manipulation;
}

.sc-heaven {
  position: relative; min-height: 104px; padding: 22px 6px 8px;
  display: flex; align-items: flex-end;
  background:
    radial-gradient(circle at 12% 30%, rgba(0,255,65,0.55) 0 1px, transparent 1.5px),
    radial-gradient(circle at 37% 18%, rgba(0,255,65,0.4) 0 1px, transparent 1.5px),
    radial-gradient(circle at 63% 34%, rgba(0,255,65,0.5) 0 1px, transparent 1.5px),
    radial-gradient(circle at 86% 15%, rgba(0,255,65,0.4) 0 1px, transparent 1.5px),
    linear-gradient(180deg, rgba(0,255,65,0.10), rgba(0,255,65,0.02));
  border-bottom: 1px dashed ${DIM};
  transition: background-color 120ms, box-shadow 120ms;
}
.sc-heaven.over, .sc-heaven.armed { box-shadow: inset 0 0 0 2px ${GREEN}, inset 0 0 18px rgba(0,255,65,0.35); }
.sc-heaven.over { background-color: rgba(0,255,65,0.12); }

/* The zone's own button fills it, under the figures, so a tap on empty sky
   (or Enter on the keyboard) sends the selected figure up */
.sc-root .sc-zonebtn {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 6px;
  padding: 4px 6px; margin: 0; text-align: left;
  font-family: ${FONT}; color: ${GREEN}; background: transparent;
  border: 0; border-radius: 0; cursor: pointer;
}
.sc-root .sc-zonebtn:hover { border: 0; }
.sc-root .sc-zonebtn:focus-visible { outline: 2px solid ${GREEN}; outline-offset: -3px; }
.sc-zone-label {
  font-size: 13px; font-weight: bold; letter-spacing: 0.18em;
  text-shadow: 0 0 6px rgba(0,255,65,0.6);
}
.sc-zone-hint { font-size: 9px; color: ${DIMMED}; text-align: right; overflow-wrap: anywhere; min-width: 0; }

.sc-row {
  position: relative; z-index: 1; width: 100%;
  display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: 4px 6px;
  pointer-events: none;
}
.sc-row > * { pointer-events: auto; }
.sc-empty { font-size: 9px; color: ${DIMMED}; pointer-events: none; }

.sc-earth { position: relative; padding: 10px 6px 0; }
.sc-ground {
  margin: 0 -6px; padding: 3px 6px 2px; border-top: 2px solid ${GREEN};
  box-shadow: 0 -3px 8px rgba(0,255,65,0.25);
  background: repeating-linear-gradient(135deg, rgba(0,255,65,0.14) 0 2px, transparent 2px 6px);
  font-size: 13px; font-weight: bold; letter-spacing: 0.18em; text-align: center;
  text-shadow: 0 0 6px rgba(0,255,65,0.6);
}

/* ── figures ───────────────────────────────────────────────────────── */
.sc-root .sc-fig {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: 40px; max-width: 76px; padding: 3px 3px 2px; margin: 0;
  font-family: ${FONT}; font-size: 10px; font-weight: bold; line-height: 1.15; color: ${GREEN};
  background: transparent; border: 1px solid transparent; border-radius: 0;
  cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none;
  -webkit-touch-callout: none;
}
.sc-root .sc-fig:hover { border-color: ${DIM}; background: rgba(0,255,65,0.06); }
.sc-root .sc-fig:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 1px; }
.sc-root .sc-fig[aria-pressed="true"] {
  border-color: ${GREEN}; background: rgba(0,255,65,0.14); box-shadow: 0 0 8px rgba(0,255,65,0.45);
}
.sc-root .sc-fig.dragging {
  z-index: 20; cursor: grabbing; border-color: ${GREEN}; background: ${BG};
  box-shadow: 0 0 10px rgba(0,255,65,0.6); transition: none;
}
.sc-root .sc-fig.settle { transition: transform 160ms ease-out; }
.sc-person { width: 16px; height: 26px; display: block; shape-rendering: crispEdges; }
.sc-person rect { fill: currentColor; }
.sc-fig.up .sc-person { filter: drop-shadow(0 0 3px ${GREEN}); }
.sc-fig.contra { color: ${RED}; }
.sc-fig.contra .sc-person { filter: drop-shadow(0 0 3px ${RED}); }
.sc-name { max-width: 100%; text-align: center; overflow-wrap: anywhere; }

.sc-fig.arrive { animation: sc-arrive 420ms ease-out both; }
.sc-fig.nope   { animation: sc-nope 420ms ease-out both; }
@keyframes sc-arrive { from { transform: translateY(14px); opacity: 0.3; } to { transform: none; opacity: 1; } }
@keyframes sc-nope {
  0% { transform: translateY(-18px); color: ${AMBER}; }
  45% { transform: translateY(0); }
  60% { transform: translateX(-3px); } 75% { transform: translateX(3px); }
  100% { transform: none; }
}

/* ── the result readout ────────────────────────────────────────────── */
.sc-out { margin: 0 0 8px; padding: 8px; border: 1px solid ${GREEN}; }
.sc-out.none   { border-color: ${AMBER}; color: ${AMBER}; }
.sc-out.contra { border-color: ${RED}; box-shadow: 0 0 6px rgba(255,68,68,0.25); }
.sc-out-top { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 8px; margin-bottom: 4px; }
.sc-out-say { font-size: 13px; font-weight: bold; }
.sc-out .cs-verse { margin-bottom: 6px; }
.sc-out-note { margin: 0; font-size: 10px; color: ${DIMMED}; }
.sc-out.none .sc-out-note { color: ${AMBER}; opacity: 0.85; }
.sc-tag-amber { color: ${AMBER}; }

.sc-contra {
  margin-top: 6px; padding: 6px 8px; border: 2px solid ${RED}; color: ${RED};
  background: rgba(255,68,68,0.06);
}
.sc-contra-v { font-size: 15px; font-weight: bold; letter-spacing: 0.08em; text-shadow: 0 0 8px currentColor; }
.sc-contra p { margin: 3px 0 0; font-size: 10px; }
.sc-contra .sc-contra-rule { font-weight: bold; font-size: 11px; }
.sc-contra .sc-contra-plain { color: ${GREEN}; opacity: 0.8; }
.sc-contra.later { animation: sc-reveal 260ms ease-out both; }
@keyframes sc-reveal { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.sc-root .sc-help { margin: 0 0 6px; font-size: 10px; color: ${DIMMED}; }

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
  .sc-fig.arrive, .sc-fig.nope, .sc-contra.later { animation: none; }
  .sc-root .sc-fig.settle { transition: none; }
}
`

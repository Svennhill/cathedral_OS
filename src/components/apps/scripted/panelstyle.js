// panelstyle.js — shared phosphor-green styles for scripted.exe's panels
// (the case analyser and the Bible reader)
//
// Colors are the OS theme variables (index.css, --os-*) so the panels
// swing with the OS palette instead of pinning their own hex values.
// Every consumer uses these in CSS text or inline styles, where var()
// resolves the same way.

export const GREEN  = "var(--os-accent)"
export const DIM    = "var(--os-accent-dim)"
export const DIMMED = "color-mix(in srgb, var(--os-accent) 55%, transparent)"
export const RED    = "var(--os-danger)"
export const BG     = "var(--os-bg-deep)"
export const FONT   = "opendyslexic, monospace"

// ── STYLES ───────────────────────────────────────────────────────────────
// Phosphor-green skin to match the rest of cathedral_OS. Class-based so hover,
// focus and disabled states work; every rule is scoped under .cs-root.
export const PANEL_CSS = `
.cs-root {
  height: 100%; display: flex; flex-direction: column; overflow: hidden;
  font-family: ${FONT}; font-size: 11px; line-height: 1.55; color: ${GREEN};
  text-align: left; cursor: default; user-select: text;
}
.cs-root * { box-sizing: border-box; }
.cs-root b { font-weight: bold; }

.cs-head {
  flex-shrink: 0; display: flex; align-items: center; gap: 8px;
  padding: 3px 6px; border-bottom: 1px solid ${DIM};
}
.cs-step-count { font-weight: bold; letter-spacing: 0.04em; }
.cs-step-name  { color: ${DIMMED}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-dots { display: flex; gap: 3px; }
.cs-dot  { width: 12px; height: 4px; border: 1px solid ${GREEN}; opacity: 0.45; }
.cs-dot.on { background: ${GREEN}; opacity: 1; box-shadow: 0 0 4px ${GREEN}; }

.cs-body {
  position: relative; flex: 1; overflow-y: auto; padding: 6px 8px 10px;
  scrollbar-width: thin; scrollbar-color: ${DIM} transparent;
}
.cs-h {
  margin: 0 0 6px; font-size: 13px; font-weight: bold; letter-spacing: 0.06em;
  text-transform: uppercase; text-shadow: 0 0 6px color-mix(in srgb, var(--os-accent) 50%, transparent); outline: none;
}
.cs-p    { margin: 0 0 8px; }
.cs-term { margin: 0 0 8px; color: ${DIMMED}; font-size: 10px; }
.cs-term b { color: ${GREEN}; }

.cs-foot {
  flex-shrink: 0; display: flex; align-items: center; gap: 8px;
  padding: 4px 6px; border-top: 1px solid ${DIM}; background: ${BG};
}
.cs-hint { flex: 1; text-align: center; color: ${DIMMED}; font-size: 10px; }

/* buttons — override the global index.css button rules */
.cs-root .cs-btn {
  font-family: ${FONT}; font-size: 11px; font-weight: bold; line-height: 1.3;
  color: ${GREEN}; background: transparent; border: 1px solid ${GREEN}; border-radius: 0;
  padding: 4px 10px; cursor: pointer; transition: background 120ms, box-shadow 120ms;
}
.cs-root .cs-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--os-accent) 14%, transparent); box-shadow: 0 0 6px color-mix(in srgb, var(--os-accent) 45%, transparent); border-color: ${GREEN}; }
.cs-root .cs-btn:focus-visible, .cs-root .cs-card:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 2px; }
.cs-root .cs-btn:disabled { color: ${DIM}; border-color: ${DIM}; cursor: not-allowed; }
.cs-root .cs-btn.primary:not(:disabled) { background: color-mix(in srgb, var(--os-accent) 8%, transparent); }
.cs-root .cs-btn.wide   { display: block; width: 100%; margin-top: 10px; padding: 6px 10px; }
.cs-root .cs-btn.subtle { margin-top: 12px; border-color: ${DIM}; color: ${DIMMED}; font-weight: normal; }

/* stage 0 — case card */
.cs-root .cs-card {
  display: flex; flex-direction: column; gap: 3px; width: 100%; text-align: left;
  font-family: ${FONT}; color: ${GREEN}; background: color-mix(in srgb, var(--os-accent) 4%, transparent);
  border: 1px solid ${GREEN}; border-radius: 0; padding: 10px 12px; cursor: pointer;
  box-shadow: inset 0 0 12px color-mix(in srgb, var(--os-accent) 8%, transparent); transition: background 120ms, box-shadow 120ms;
}
.cs-root .cs-card:hover { background: color-mix(in srgb, var(--os-accent) 12%, transparent); box-shadow: 0 0 8px color-mix(in srgb, var(--os-accent) 40%, transparent), inset 0 0 12px color-mix(in srgb, var(--os-accent) 12%, transparent); border-color: ${GREEN}; }
.cs-card-title { font-size: 14px; font-weight: bold; letter-spacing: 0.04em; text-shadow: 0 0 6px color-mix(in srgb, var(--os-accent) 50%, transparent); }
.cs-card-line  { font-size: 11px; }
.cs-card-meta  { font-size: 10px; color: ${DIMMED}; }
.cs-card-cta   { margin-top: 4px; font-size: 11px; font-weight: bold; }
.cs-cardwrap   { margin-bottom: 6px; }
.cs-cardwrap .cs-btn.subtle { margin-top: 4px; }
.cs-root .cs-card.reader { border-style: dashed; background: transparent; padding: 5px 12px 6px; gap: 0; }
.cs-card-row { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.cs-card.reader .cs-card-title { font-size: 12px; }
.cs-card.reader .cs-card-cta { margin-top: 0; }

.cs-confirm {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px;
  margin-top: 8px; padding: 6px 8px; border: 1px dashed ${GREEN}; font-size: 10px;
}
.cs-confirm-btns { display: flex; gap: 6px; }

/* verses */
.cs-verse {
  margin: 0 0 10px; padding: 6px 10px; border-left: 2px solid ${GREEN};
  background: color-mix(in srgb, var(--os-accent) 5%, transparent); font-size: 12px;
}
.cs-verse.big { font-size: 15px; line-height: 1.5; padding: 10px 12px; text-shadow: 0 0 5px color-mix(in srgb, var(--os-accent) 35%, transparent); }
.cs-verse cite { display: block; margin-top: 4px; font-size: 10px; font-style: normal; color: ${DIMMED}; }

/* stage 1 — rules */
.cs-rules { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.cs-rule  { display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border: 1px solid ${DIM}; }
.cs-rule-n { font-size: 10px; color: ${DIMMED}; text-transform: uppercase; letter-spacing: 0.06em; }
.cs-rule-s { font-weight: bold; }
.cs-rule-m { color: ${DIMMED}; font-size: 10px; }

/* stage 2 — passages */
.cs-scorebar {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 10px;
  margin: 0 0 8px; padding: 4px 8px; border: 1px dashed ${DIM}; font-size: 10px;
}
.cs-passage { margin: 0 0 10px; padding: 8px; border: 1px solid ${GREEN}; }
.cs-passage.tested { border-color: ${RED}; box-shadow: 0 0 6px color-mix(in srgb, var(--os-danger) 25%, transparent); }
.cs-passage.kept   { box-shadow: 0 0 6px color-mix(in srgb, var(--os-accent) 25%, transparent); }
.cs-passage-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2px 8px; margin-bottom: 6px; }
.cs-passage-title { font-size: 13px; font-weight: bold; }
.cs-passage-ref   { color: ${DIMMED}; font-size: 10px; }

.cs-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
.cs-stepline { display: flex; gap: 6px; padding-top: 5px; border-top: 1px dotted ${DIM}; }
.cs-stepline-n {
  flex-shrink: 0; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center;
  border: 1px solid ${DIMMED}; font-size: 9px; color: ${DIMMED};
}
.cs-stepline-main { flex: 1; min-width: 0; }
.cs-stepline-top  { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 8px; }
.cs-stepline-label { font-weight: bold; }
.cs-stepline-body  { margin: 2px 0 0; font-size: 10px; color: ${DIMMED}; }
.cs-verdict-line   { margin: 2px 0 0; color: ${RED}; font-weight: bold; }
.cs-verdict-line.ok { color: ${GREEN}; }

.cs-tag { font-size: 10px; font-weight: bold; padding: 0 5px; border: 1px solid currentColor; white-space: nowrap; }
.cs-tag.ok  { color: ${GREEN}; }
.cs-tag.bad { color: ${RED}; }
.cs-tag.dim { color: ${DIMMED}; }

.cs-chip {
  display: inline-block; margin-top: 3px; padding: 1px 6px; border: 1px solid;
  font-size: 10px; font-weight: bold; background: color-mix(in srgb, var(--os-danger) 8%, transparent);
}

.cs-stepline.fresh { animation: cs-in 320ms ease-out both; }
@keyframes cs-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .cs-stepline.fresh { animation: none; } }

/* stage 3 — verdict */
.cs-summary { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.cs-row   { display: flex; flex-direction: column; gap: 2px; }
.cs-row-k { font-size: 10px; color: ${DIMMED}; text-transform: uppercase; letter-spacing: 0.06em; }
.cs-row-v .cs-verse { margin-bottom: 0; }
.cs-testlist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.cs-testrow  { padding: 4px 6px; border: 1px solid ${DIM}; }

.cs-verdict {
  display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center;
  margin: 0 0 10px; padding: 10px; border: 2px solid ${RED}; color: ${RED};
  background: color-mix(in srgb, var(--os-danger) 6%, transparent); box-shadow: 0 0 10px color-mix(in srgb, var(--os-danger) 30%, transparent);
}
.cs-verdict.clear { border-color: ${GREEN}; color: ${GREEN}; background: color-mix(in srgb, var(--os-accent) 5%, transparent); box-shadow: none; }
.cs-verdict-k      { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; }
.cs-verdict-v      { font-size: 20px; font-weight: bold; letter-spacing: 0.08em; text-shadow: 0 0 8px currentColor; }
.cs-verdict-plain  { font-size: 11px; }
.cs-verdict-detail { margin-top: 4px; font-size: 10px; opacity: 0.85; }

.cs-scores { display: flex; flex-wrap: wrap; gap: 8px; }
.cs-score  { flex: 1 1 140px; display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border: 1px solid ${GREEN}; }
.cs-score-k { font-size: 10px; color: ${DIMMED}; text-transform: uppercase; letter-spacing: 0.06em; }
.cs-score-v { font-size: 18px; font-weight: bold; text-shadow: 0 0 6px color-mix(in srgb, var(--os-accent) 50%, transparent); }
.cs-score-plain { font-size: 10px; color: ${DIMMED}; }
.cs-basis { margin: 6px 0 0; font-size: 11px; }
.cs-basis span { color: ${DIMMED}; font-size: 10px; }

.cs-notice {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px;
  margin-top: 10px; padding: 6px 8px; border: 1px dashed ${GREEN}; font-size: 10px;
}
`

// casepanel.jsx — click-driven analyser view for one scripted.exe case
//
// Four stages, always with "Step n of 4" and Back/Next on screen:
//   0 Case select · 1 The Rule · 2 Test · 3 Verdict
// Progress lives in casestore.js, so stepping back and forth (or minimizing
// the window) never loses a result or re-applies a score.

import { useEffect, useRef, useState } from "react"
import { ENTITIES } from "../../the_bible/entities"
import { SEVERITY } from "../../the_bible/severity"
import { getVerse } from "../../the_bible/bible"
import { TRANSLATION } from "../../../data/bsb"
import { caseActions, useCaseState } from "./casestore"
import {
  computeScores, fmtScore, fmtImpact, fmtCount,
  LOGIC_INTEGRITY_START, TOTAL_VERSES,
} from "./scoring"

const GREEN  = "#00ff41"
const DIM    = "#004d1a"
const DIMMED = "rgba(0,255,65,0.55)"
const RED    = "#ff4444"
const BG     = "#0a0a1a"
const FONT   = "opendyslexic, monospace"

const STAGES = ["Choose a case", "The rule", "Test the passages", "Verdict"]

// One plain sentence per rule, keyed by rule id from passages.js
const RULE_MEANINGS = {
  rule_no_ascent:    "Nobody has ever gone up into heaven — no person, at any time.",
  rule_only_descent: "The only one who has been in heaven is the Son of Man (Jesus), who came down from it.",
}

// Formal terms, each explained in one plain sentence
const TERMS = {
  ruleVerse:     "The verse whose claim every other passage is checked against.",
  contradiction: "Two passages say things that cannot both be true.",
  severity:      "How serious a contradiction is, from L1 (minor) to L3 (most serious).",
  integrity:     `Starts at ${fmtScore(LOGIC_INTEGRITY_START)} for this case and drops each time a passage breaks the rule.`,
  truthIndex:    "The share of verses tested here that were not caught in a contradiction.",
}

const CASE_SUMMARY = {
  ascension_problem: "Checks John 3:13's claim that no one has gone up to heaven against passages where someone does.",
}

export default function CasePanel({ caseData }) {
  const { stage, tested, fresh } = useCaseState()
  const verses = useCaseVerses(caseData)
  const scores = computeScores(caseData, tested)

  const bodyRef    = useRef(null)
  const headingRef = useRef(null)

  // New stage: start at the top and move keyboard focus to its heading
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [stage])

  const ruleLabel = (ruleId) => {
    const i = caseData.rulesItDefines.findIndex(r => r.id === ruleId)
    return `Rule ${i + 1}`
  }

  const canNext = stage < 3 && (stage !== 2 || tested.length > 0)
  const nextHint =
    stage === 2 && !tested.length ? "Test at least one passage to see the verdict." :
    stage === 3                   ? "This is the last step."                        : null

  return (
    <div className="cs-root">
      <style>{CSS}</style>

      {/* ── STEP INDICATOR ─────────────────────────────────────────── */}
      <div className="cs-head">
        <span className="cs-step-count">Step {stage + 1} of 4</span>
        <span className="cs-step-name">{STAGES[stage]}</span>
        <span className="cs-dots" aria-hidden="true">
          {STAGES.map((_, i) => (
            <span key={i} className={"cs-dot" + (i <= stage ? " on" : "")} />
          ))}
        </span>
      </div>

      {/* ── STAGE BODY ─────────────────────────────────────────────── */}
      <div className="cs-body" ref={bodyRef}>
        <h2 className="cs-h" tabIndex={-1} ref={headingRef}>{STAGES[stage]}</h2>

        {stage === 0 && (
          <StageSelect caseData={caseData} tested={tested} />
        )}
        {stage === 1 && (
          <StageRule caseData={caseData} verses={verses} />
        )}
        {stage === 2 && (
          <StageTest
            caseData={caseData} verses={verses} tested={tested}
            fresh={fresh} scores={scores} ruleLabel={ruleLabel}
          />
        )}
        {stage === 3 && (
          <StageVerdict
            caseData={caseData} verses={verses} tested={tested}
            scores={scores}
          />
        )}
      </div>

      {/* ── BACK / NEXT ────────────────────────────────────────────── */}
      <div className="cs-foot">
        <button
          className="cs-btn"
          disabled={stage === 0}
          onClick={() => caseActions.goTo(stage - 1)}
        >← Back</button>
        <span className="cs-hint" aria-live="polite">{nextHint}</span>
        <button
          className="cs-btn primary"
          disabled={!canNext}
          onClick={() => caseActions.goTo(stage + 1)}
        >Next →</button>
      </div>
    </div>
  )
}

// ── STAGE 0 — CASE SELECT ────────────────────────────────────────────────
function StageSelect({ caseData, tested }) {
  const total = caseData.testCases.length
  const status =
    tested.length === 0     ? "Not started" :
    tested.length < total   ? `In progress — ${tested.length} of ${total} passages tested` :
                              `Complete — ${total} of ${total} passages tested`

  return (
    <>
      <p className="cs-p">Pick a case to open it.</p>
      <button className="cs-card" onClick={() => caseActions.goTo(1)}>
        <span className="cs-card-title">{caseData.title}</span>
        <span className="cs-card-line">{CASE_SUMMARY[caseData.id]}</span>
        <span className="cs-card-meta">Rule verse: {caseData.ruleVerse.reference}</span>
        <span className="cs-card-meta">{status}</span>
        <span className="cs-card-cta">Open case →</span>
      </button>
    </>
  )
}

// ── STAGE 1 — THE RULE ───────────────────────────────────────────────────
function StageRule({ caseData, verses }) {
  const ref = caseData.ruleVerse.reference
  return (
    <>
      <p className="cs-term"><b>Rule verse:</b> {TERMS.ruleVerse}</p>

      <blockquote className="cs-verse big">
        “{verses[ref] ?? "…"}”
        <cite>— {ref} ({TRANSLATION})</cite>
      </blockquote>

      <p className="cs-p">This verse sets {caseData.rulesItDefines.length} rules:</p>
      <ol className="cs-rules">
        {caseData.rulesItDefines.map((rule, i) => (
          <li key={rule.id} className="cs-rule">
            <span className="cs-rule-n">Rule {i + 1}</span>
            <span className="cs-rule-s">{rule.statement}</span>
            <span className="cs-rule-m">In plain terms: {RULE_MEANINGS[rule.id]}</span>
          </li>
        ))}
      </ol>

      <button className="cs-btn primary wide" onClick={() => caseActions.goTo(2)}>
        Test the passages →
      </button>
    </>
  )
}

// ── STAGE 2 — TEST ───────────────────────────────────────────────────────
function StageTest({ caseData, verses, tested, fresh, scores, ruleLabel }) {
  const total = caseData.testCases.length
  return (
    <>
      <p className="cs-p">
        Each passage is checked against both rules from {caseData.ruleVerse.reference}.
        A passage that disagrees with a rule is a <b>CONTRADICTION</b>.
      </p>
      <p className="cs-term"><b>Contradiction:</b> {TERMS.contradiction}</p>

      <div className="cs-scorebar">
        <span>Passages tested: <b>{tested.length} of {total}</b></span>
        <span>
          Logic Integrity Score: <b>{fmtScore(scores.logicIntegrity)}</b>
          {scores.impact !== 0 && <> ({fmtImpact(scores.impact)})</>}
        </span>
      </div>

      {caseData.testCases.map(tc => (
        <PassageCard
          key={tc.id}
          tc={tc}
          caseData={caseData}
          text={verses[tc.verse.reference]}
          isTested={tested.includes(tc.id)}
          animate={fresh === tc.id}
          ruleLabel={ruleLabel}
        />
      ))}

      {tested.length === total && (
        <button className="cs-btn primary wide" onClick={() => caseActions.goTo(3)}>
          See the verdict →
        </button>
      )}
    </>
  )
}

function PassageCard({ tc, caseData, text, isTested, animate, ruleLabel }) {
  const entity = ENTITIES[tc.entityId]
  const sev    = SEVERITY[tc.severity]
  const cardRef = useRef(null)

  // Just tested: bring the card's results into view inside the stage body
  useEffect(() => {
    if (!animate) return
    const card = cardRef.current
    const body = card?.closest(".cs-body")
    if (body) body.scrollTo({ top: card.offsetTop - 4, behavior: "smooth" })
  }, [animate])

  const steps = [
    {
      label: `Read ${tc.verse.reference}`,
      status: "DONE", tone: "ok",
      body: `Looking at what this passage says about ${entity?.name ?? "it"}.`,
    },
    ...caseData.rulesItDefines.map(rule => rule.id === tc.violatesRule ? {
      label: `Check ${ruleLabel(rule.id)}: ${rule.statement}`,
      status: "BROKEN", tone: "bad",
      body: tc.violationExplanation,
    } : {
      label: `Check ${ruleLabel(rule.id)}: ${rule.statement}`,
      status: "NOT COUNTED", tone: "dim",
      body: `This case records the break against ${ruleLabel(tc.violatesRule)} only, so this rule adds nothing to the score.`,
    }),
    {
      label: "Severity",
      chip: sev,
      body: TERMS.severity,
    },
    {
      label: "Score",
      status: fmtImpact(sev.scoreImpact), tone: "bad",
      body: `Taken off the Logic Integrity Score once for this passage.`,
    },
    {
      label: "Result",
      verdict: tc.verdict,
    },
  ]

  return (
    <section ref={cardRef} className={"cs-passage" + (isTested ? " tested" : "")}>
      <div className="cs-passage-head">
        <span className="cs-passage-title">{entity?.name ?? tc.id}</span>
        <span className="cs-passage-ref">{tc.verse.reference} ({TRANSLATION})</span>
      </div>

      <blockquote className="cs-verse">
        “{text ?? "…"}”
        <cite>— {tc.verse.reference}</cite>
      </blockquote>

      {!isTested ? (
        <button className="cs-btn primary" onClick={() => caseActions.test(tc.id)}>
          Test it against the rule
        </button>
      ) : (
        <ol className="cs-steps" aria-live="polite">
          {steps.map((s, i) => (
            <li
              key={i}
              className={"cs-stepline" + (animate ? " fresh" : "")}
              style={animate ? { animationDelay: `${i * 380}ms` } : undefined}
            >
              <span className="cs-stepline-n">{i + 1}</span>
              <div className="cs-stepline-main">
                <div className="cs-stepline-top">
                  <span className="cs-stepline-label">{s.label}</span>
                  {s.status && <span className={"cs-tag " + s.tone}>{s.status}</span>}
                </div>
                {s.chip    && <SeverityChip sev={s.chip} />}
                {s.body    && <p className="cs-stepline-body">{s.body}</p>}
                {s.verdict && <p className="cs-verdict-line">{s.verdict}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function SeverityChip({ sev }) {
  return (
    <span className="cs-chip" style={{ color: sev.color, borderColor: sev.color }}>
      L{sev.level} — {sev.name}: {sev.plain}
    </span>
  )
}

// ── STAGE 3 — VERDICT ────────────────────────────────────────────────────
function StageVerdict({ caseData, verses, tested, scores }) {
  const ruleRef   = caseData.ruleVerse.reference
  const untested  = caseData.testCases.filter(tc => !tested.includes(tc.id))
  const isContra  = scores.broken.length > 0

  return (
    <>
      <div className="cs-summary">
        <Row label="Case">{caseData.title}</Row>

        <Row label="The rule">
          <blockquote className="cs-verse">
            “{verses[ruleRef] ?? "…"}”
            <cite>— {ruleRef} ({TRANSLATION})</cite>
          </blockquote>
        </Row>

        <Row label="Tests">
          <ul className="cs-testlist">
            {caseData.testCases.map(tc => {
              const done = tested.includes(tc.id)
              const sev  = SEVERITY[tc.severity]
              return (
                <li key={tc.id} className="cs-testrow">
                  <div className="cs-stepline-top">
                    <span className="cs-stepline-label">
                      {ENTITIES[tc.entityId]?.name ?? tc.id} — {tc.verse.reference}
                    </span>
                    {!done ? <span className="cs-tag dim">NOT TESTED YET</span>
                      : tc.violatesRule ? <span className="cs-tag bad">CONTRADICTION · {fmtImpact(sev.scoreImpact)}</span>
                      : <span className="cs-tag ok">NO CONTRADICTION</span>}
                  </div>
                  {done && tc.violatesRule && <SeverityChip sev={sev} />}
                </li>
              )
            })}
          </ul>
        </Row>
      </div>

      <div className={"cs-verdict" + (isContra ? "" : " clear")}>
        <span className="cs-verdict-k">Verdict</span>
        <span className="cs-verdict-v">{isContra ? "CONTRADICTION" : "NO CONTRADICTION FOUND"}</span>
        {isContra && <span className="cs-verdict-plain">{TERMS.contradiction}</span>}
        {isContra && <span className="cs-verdict-detail">{caseData.verdict}</span>}
      </div>

      <div className="cs-scores">
        <div className="cs-score">
          <span className="cs-score-k">Logic Integrity Score</span>
          <span className="cs-score-v">{fmtScore(scores.logicIntegrity)}</span>
          <span className="cs-score-plain">{TERMS.integrity}</span>
        </div>
        <div className="cs-score">
          <span className="cs-score-k">Bible Truth Index</span>
          <span className="cs-score-v">
            {scores.truthIndex === null ? "—" : `${fmtScore(scores.truthIndex)}%`}
          </span>
          <span className="cs-score-plain">{TERMS.truthIndex}</span>
        </div>
      </div>
      <p className="cs-basis">
        Based on {fmtCount(scores.versesTested)} of {fmtCount(TOTAL_VERSES)} verses tested
        <span> (the rule verse plus {scores.tested.length} {scores.tested.length === 1 ? "passage" : "passages"})</span>
      </p>

      {untested.length > 0 && (
        <div className="cs-notice">
          <span>
            {untested.length} {untested.length === 1 ? "passage hasn't" : "passages haven't"} been
            tested yet: {untested.map(tc => tc.verse.reference).join(", ")}.
          </span>
          <button className="cs-btn" onClick={() => caseActions.goTo(2)}>← Go back and test</button>
        </div>
      )}

      <button className="cs-btn subtle" onClick={() => caseActions.reset()}>
        Start this case over
      </button>
    </>
  )
}

function Row({ label, children }) {
  return (
    <div className="cs-row">
      <span className="cs-row-k">{label}</span>
      <div className="cs-row-v">{children}</div>
    </div>
  )
}

// ── VERSE LOADING ────────────────────────────────────────────────────────
// Resolves every verse the case needs through bible.js, keyed by reference
function useCaseVerses(caseData) {
  const [verses, setVerses] = useState({})

  useEffect(() => {
    let live = true
    const refs = [caseData.ruleVerse, ...caseData.testCases.map(tc => tc.verse)]
    Promise.all(refs.map(v => getVerse(v.book, v.chapter, v.verse).then(text => [v.reference, text])))
      .then(entries => {
        if (!live) return
        setVerses(Object.fromEntries(entries.map(([ref, text]) => [ref, text ?? "[verse text unavailable]"])))
      })
    return () => { live = false }
  }, [caseData])

  return verses
}

// ── STYLES ───────────────────────────────────────────────────────────────
// Phosphor-green skin to match the rest of cathedral_OS. Class-based so hover,
// focus and disabled states work; every rule is scoped under .cs-root.
const CSS = `
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
  text-transform: uppercase; text-shadow: 0 0 6px rgba(0,255,65,0.5); outline: none;
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
.cs-root .cs-btn:hover:not(:disabled) { background: rgba(0,255,65,0.14); box-shadow: 0 0 6px rgba(0,255,65,0.45); border-color: ${GREEN}; }
.cs-root .cs-btn:focus-visible, .cs-root .cs-card:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 2px; }
.cs-root .cs-btn:disabled { color: ${DIM}; border-color: ${DIM}; cursor: not-allowed; }
.cs-root .cs-btn.primary:not(:disabled) { background: rgba(0,255,65,0.08); }
.cs-root .cs-btn.wide   { display: block; width: 100%; margin-top: 10px; padding: 6px 10px; }
.cs-root .cs-btn.subtle { margin-top: 12px; border-color: ${DIM}; color: ${DIMMED}; font-weight: normal; }

/* stage 0 — case card */
.cs-root .cs-card {
  display: flex; flex-direction: column; gap: 3px; width: 100%; text-align: left;
  font-family: ${FONT}; color: ${GREEN}; background: rgba(0,255,65,0.04);
  border: 1px solid ${GREEN}; border-radius: 0; padding: 10px 12px; cursor: pointer;
  box-shadow: inset 0 0 12px rgba(0,255,65,0.08); transition: background 120ms, box-shadow 120ms;
}
.cs-root .cs-card:hover { background: rgba(0,255,65,0.12); box-shadow: 0 0 8px rgba(0,255,65,0.4), inset 0 0 12px rgba(0,255,65,0.12); border-color: ${GREEN}; }
.cs-card-title { font-size: 14px; font-weight: bold; letter-spacing: 0.04em; text-shadow: 0 0 6px rgba(0,255,65,0.5); }
.cs-card-line  { font-size: 11px; }
.cs-card-meta  { font-size: 10px; color: ${DIMMED}; }
.cs-card-cta   { margin-top: 4px; font-size: 11px; font-weight: bold; }

/* verses */
.cs-verse {
  margin: 0 0 10px; padding: 6px 10px; border-left: 2px solid ${GREEN};
  background: rgba(0,255,65,0.05); font-size: 12px;
}
.cs-verse.big { font-size: 15px; line-height: 1.5; padding: 10px 12px; text-shadow: 0 0 5px rgba(0,255,65,0.35); }
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
.cs-passage.tested { border-color: ${RED}; box-shadow: 0 0 6px rgba(255,68,68,0.25); }
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

.cs-tag { font-size: 10px; font-weight: bold; padding: 0 5px; border: 1px solid currentColor; white-space: nowrap; }
.cs-tag.ok  { color: ${GREEN}; }
.cs-tag.bad { color: ${RED}; }
.cs-tag.dim { color: ${DIMMED}; }

.cs-chip {
  display: inline-block; margin-top: 3px; padding: 1px 6px; border: 1px solid;
  font-size: 10px; font-weight: bold; background: rgba(255,68,68,0.08);
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
  background: rgba(255,68,68,0.06); box-shadow: 0 0 10px rgba(255,68,68,0.3);
}
.cs-verdict.clear { border-color: ${GREEN}; color: ${GREEN}; background: rgba(0,255,65,0.05); box-shadow: none; }
.cs-verdict-k      { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; }
.cs-verdict-v      { font-size: 20px; font-weight: bold; letter-spacing: 0.08em; text-shadow: 0 0 8px currentColor; }
.cs-verdict-plain  { font-size: 11px; }
.cs-verdict-detail { margin-top: 4px; font-size: 10px; opacity: 0.85; }

.cs-scores { display: flex; flex-wrap: wrap; gap: 8px; }
.cs-score  { flex: 1 1 140px; display: flex; flex-direction: column; gap: 1px; padding: 6px 8px; border: 1px solid ${GREEN}; }
.cs-score-k { font-size: 10px; color: ${DIMMED}; text-transform: uppercase; letter-spacing: 0.06em; }
.cs-score-v { font-size: 18px; font-weight: bold; text-shadow: 0 0 6px rgba(0,255,65,0.5); }
.cs-score-plain { font-size: 10px; color: ${DIMMED}; }
.cs-basis { margin: 6px 0 0; font-size: 11px; }
.cs-basis span { color: ${DIMMED}; font-size: 10px; }

.cs-notice {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px;
  margin-top: 10px; padding: 6px 8px; border: 1px dashed ${GREEN}; font-size: 10px;
}
`

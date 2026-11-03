// casepanel.jsx — click-driven analyser view for one scripted.exe case
//
// Four stages, always with "Step n of 4" and Back/Next on screen:
//   0 Case select · 1 The Rule · 2 Test · 3 Verdict
// Progress lives in casestore.js, so stepping back and forth, minimizing the
// window or reloading the page never loses a result or re-applies a score.
//
// Everything case-specific comes from the case entry in passages.js — this
// file holds no per-case text, so a new case needs no changes here.

import { useEffect, useRef, useState } from "react"
import { ENTITIES } from "../../the_bible/entities"
import { SEVERITY } from "../../the_bible/severity"
import { getVerse } from "../../the_bible/bible"
import { TRANSLATION } from "../../../data/bsb"
import { caseActions, useCaseState, caseStatus } from "./casestore"
import { readerActions } from "./readerstore"
import { PANEL_CSS } from "./panelstyle"
import {
  computeScores, fmtScore, fmtImpact, fmtCount,
  LOGIC_INTEGRITY_START, TOTAL_VERSES,
} from "./scoring"

const STAGES = ["Choose a case", "The rule", "Test the passages", "Verdict"]

// Formal terms, each explained in one plain sentence
const TERMS = {
  ruleVerse:     "The verse whose claim every other passage is checked against.",
  contradiction: "Two passages say things that cannot both be true.",
  severity:      "How serious a contradiction is, from L1 (minor) to L3 (most serious).",
  integrity:     `Starts at ${fmtScore(LOGIC_INTEGRITY_START)} for this case and drops each time a passage breaks the rule.`,
  truthIndex:    "The share of verses tested here that were not caught in a contradiction.",
}

export default function CasePanel({ cases }) {
  const { stage, caseId, tested: testedByCase, fresh } = useCaseState()
  const caseData = (stage > 0 && cases.find(c => c.id === caseId)) || null
  const tested   = (caseData && testedByCase[caseData.id]) || []
  const verses   = useCaseVerses(caseData)
  const scores   = caseData && computeScores(caseData, tested)
  const shown    = caseData ? stage : 0   // stage on screen

  const bodyRef    = useRef(null)
  const headingRef = useRef(null)

  // New stage: start at the top and move keyboard focus to its heading
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [shown])

  const ruleLabel = (ruleId) => {
    const i = caseData?.rulesItDefines.findIndex(r => r.id === ruleId) ?? -1
    return `Rule ${i + 1}`
  }

  // On the select stage Next opens the case when there is only one to open;
  // with several, the user picks a card
  const onlyCase = cases.length === 1 ? cases[0] : null
  const canNext  =
    shown === 0 ? Boolean(onlyCase) :
    shown < 3 && (shown !== 2 || tested.length > 0)
  const next = () => shown === 0 ? caseActions.open(onlyCase.id) : caseActions.goTo(shown + 1)
  const nextHint =
    shown === 0 && !onlyCase      ? "Pick a case to open it."                       :
    shown === 2 && !tested.length ? "Test at least one passage to see the verdict." :
    shown === 3                   ? "This is the last step."                        : null

  return (
    <div className="cs-root">
      <style>{PANEL_CSS}</style>

      {/* ── STEP INDICATOR ─────────────────────────────────────────── */}
      <div className="cs-head">
        <span className="cs-step-count">Step {shown + 1} of 4</span>
        <span className="cs-step-name">{STAGES[shown]}</span>
        <span className="cs-dots" aria-hidden="true">
          {STAGES.map((_, i) => (
            <span key={i} className={"cs-dot" + (i <= shown ? " on" : "")} />
          ))}
        </span>
      </div>

      {/* ── STAGE BODY ─────────────────────────────────────────────── */}
      <div className="cs-body" ref={bodyRef}>
        <h2 className="cs-h" tabIndex={-1} ref={headingRef}>{STAGES[shown]}</h2>

        {!caseData && (
          <StageSelect cases={cases} testedByCase={testedByCase} />
        )}
        {caseData && stage === 1 && (
          <StageRule caseData={caseData} verses={verses} />
        )}
        {caseData && stage === 2 && (
          <StageTest
            caseData={caseData} verses={verses} tested={tested}
            fresh={fresh} scores={scores} ruleLabel={ruleLabel}
          />
        )}
        {caseData && stage === 3 && (
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
          disabled={shown === 0}
          onClick={() => caseActions.goTo(shown - 1)}
        >← Back</button>
        <span className="cs-hint" aria-live="polite">{nextHint}</span>
        <button
          className="cs-btn primary"
          disabled={!canNext}
          onClick={next}
        >Next →</button>
      </div>
    </div>
  )
}

// ── STAGE 0 — CASE SELECT ────────────────────────────────────────────────
// One card per case (cases come first), then the entry to the Bible reader
function StageSelect({ cases, testedByCase }) {
  return (
    <>
      <p className="cs-p">Pick a case to open it.</p>
      {cases.map(c => (
        <CaseCard key={c.id} caseData={c} tested={testedByCase[c.id] ?? []} />
      ))}

      <button className="cs-card reader" onClick={() => readerActions.open()}>
        <span className="cs-card-row">
          <span className="cs-card-title">Read the Bible</span>
          <span className="cs-card-cta">Open →</span>
        </span>
        <span className="cs-card-meta">The full {TRANSLATION} text the cases are tested against.</span>
      </button>
    </>
  )
}

function CaseCard({ caseData, tested }) {
  const status = caseStatus(caseData, tested)

  return (
    <div className="cs-cardwrap">
      <button className="cs-card" onClick={() => caseActions.open(caseData.id)}>
        <span className="cs-card-title">{caseData.title}</span>
        <span className="cs-card-line">{caseData.summary}</span>
        <span className="cs-card-meta">Rule verse: {caseData.ruleVerse.reference}</span>
        <span className="cs-card-meta">{status}</span>
        <span className="cs-card-cta">{tested.length ? "Continue case →" : "Open case →"}</span>
      </button>
      {tested.length > 0 && <StartOver caseId={caseData.id} />}
    </div>
  )
}

// "Start the case over" — asks once before clearing, so a stray click
// can't wipe a finished case
function StartOver({ caseId }) {
  const [asking, setAsking] = useState(false)
  if (!asking) {
    return (
      <button className="cs-btn subtle" onClick={() => setAsking(true)}>
        Start the case over
      </button>
    )
  }
  return (
    <div className="cs-confirm" role="group" aria-label="Start the case over?">
      <span>Clear every passage you've tested in this case and start again?</span>
      <span className="cs-confirm-btns">
        <button className="cs-btn" autoFocus onClick={() => setAsking(false)}>Keep my progress</button>
        <button className="cs-btn primary" onClick={() => caseActions.reset(caseId)}>
          Yes, start over
        </button>
      </span>
    </div>
  )
}

const ruleCount = (c) => {
  const n = c.rulesItDefines.length
  return n === 1 ? "the rule" : n === 2 ? "both rules" : `all ${n} rules`
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

      <p className="cs-p">
        This verse sets {caseData.rulesItDefines.length}{" "}
        {caseData.rulesItDefines.length === 1 ? "rule" : "rules"}:
      </p>
      <ol className="cs-rules">
        {caseData.rulesItDefines.map((rule, i) => (
          <li key={rule.id} className="cs-rule">
            <span className="cs-rule-n">Rule {i + 1}</span>
            <span className="cs-rule-s">{rule.statement}</span>
            <span className="cs-rule-m">In plain terms: {rule.plain}</span>
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
        Each passage is checked against {ruleCount(caseData)} from {caseData.ruleVerse.reference}.
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
  const sev    = SEVERITY[tc.severity]   // undefined for a passage that breaks no rule
  const cardRef = useRef(null)

  // Just tested: bring the card's results into view inside the stage body
  useEffect(() => {
    if (!animate) return
    const card = cardRef.current
    const body = card?.closest(".cs-body")
    if (body) body.scrollTo({ top: card.offsetTop - 4, behavior: "smooth" })
  }, [animate])

  const breaks = Boolean(tc.violatesRule)

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
    } : breaks ? {
      label: `Check ${ruleLabel(rule.id)}: ${rule.statement}`,
      status: "NOT COUNTED", tone: "dim",
      body: `This case records the break against ${ruleLabel(tc.violatesRule)} only, so this rule adds nothing to the score.`,
    } : {
      label: `Check ${ruleLabel(rule.id)}: ${rule.statement}`,
      status: "KEPT", tone: "ok",
      body: "This passage agrees with the rule.",
    }),
    ...(breaks ? [
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
    ] : []),
    {
      label: "Result",
      verdict: tc.verdict,
    },
  ]

  return (
    <section ref={cardRef} className={"cs-passage" + (isTested ? (breaks ? " tested" : " kept") : "")}>
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
                {s.verdict && <p className={"cs-verdict-line" + (breaks ? "" : " ok")}>{s.verdict}</p>}
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

      <StartOver caseId={caseData.id} />
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
    if (!caseData) return
    let live = true
    const refs = [caseData.ruleVerse, ...caseData.testCases.map(tc => tc.verse)]
    Promise.all(refs.map(v => getVerse(v.book, v.chapter, v.verse)
      .catch(() => null)
      .then(text => [v.reference, text])))
      .then(entries => {
        if (!live) return
        setVerses(Object.fromEntries(entries.map(([ref, text]) => [ref, text ?? "[verse text unavailable]"])))
      })
    return () => { live = false }
  }, [caseData])

  return verses
}

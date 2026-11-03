// casescene.jsx — the visual view of a case's Test step
//
// A sky zone (the place the case's rules are about) over a ground plane.
// The figures stand on the ground; dragging one up into the zone — or
// tapping it and then tapping the zone, or doing the same from the
// keyboard — tests it. What each figure means comes from deriveScene()
// (derivescene.js); scoring goes through caseActions.test, the same call
// the panel's "Test it against the rule" button makes, so the two views
// share one record and a passage can only ever be scored once.
//
// This replaces only step 3 of 4 (Test the passages). Steps 1, 2 and 4 are
// the panel's, and the panel stays a complete way to run every case.

import { useEffect, useRef, useState } from "react"
import { SEVERITY } from "../../the_bible/severity"
import { getVerse } from "../../the_bible/bible"
import { TRANSLATION } from "../../../data/bsb"
import { caseActions, useCaseState } from "./casestore"
import { PANEL_CSS } from "./panelstyle"
import { SCENE_CSS } from "./scenestyle"
import { computeScores, fmtScore, fmtImpact } from "./scoring"

const STAGES     = ["Choose a case", "The rule", "Test the passages", "Verdict"]
const STAGE      = 2
const DRAG_START = 6     // px a press must move before it counts as a drag
const REVEAL_MS  = 900   // the "yes" and its passage first, then the contradiction

const SOUNDS = {
  yes:    "/audio/OK_chime.mp3",
  contra: "/audio/warn.mp3",
  none:   "/audio/fail.mp3",
}
function play(name) {
  try {
    const a = new Audio(SOUNDS[name])
    a.volume = 0.5
    a.play().catch(() => {})
  } catch { /* no audio — the readout says the same thing */ }
}

const NONE = []

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export default function CaseScene({ caseData, scene }) {
  const { tested: testedByCase } = useCaseState()
  const tested = testedByCase[caseData.id] ?? NONE
  const verses = useSceneVerses(caseData)

  const [selected, setSelected] = useState(null)  // figure key picked by tap / keyboard
  const [exemptUp, setExemptUp] = useState([])    // exempt figures sent up this visit (not progress)
  const [result,   setResult]   = useState(null)  // { key, first, n } — outcome on screen
  const [hold,     setHold]     = useState(null)  // test id whose deduction is still being revealed
  const [drag,     setDrag]     = useState(null)  // { key, dx, dy, over }

  const zoneRef    = useRef(null)
  const zoneBtnRef = useRef(null)
  const outRef     = useRef(null)
  const headingRef = useRef(null)
  const timer      = useRef(null)
  const swallow    = useRef(false)   // the click that ends a drag isn't a tap
  const count      = useRef(0)
  const live       = useRef(tested)   // latest record, for handlers set up mid-drag
  useEffect(() => { live.current = tested }, [tested])

  const { place, action, figures } = scene
  const placeWord = place.name.toLowerCase()
  const byKey = (k) => figures.find(f => f.key === k)
  const isUp  = (f) => f.testId ? tested.includes(f.testId) : exemptUp.includes(f.key)
  const shown = computeScores(caseData, tested.filter(id => id !== hold))
  const total = caseData.testCases.length
  const ruleNo = (id) => caseData.rulesItDefines.findIndex(r => r.id === id) + 1

  // Same entry behavior as a panel stage: top of the body, focus on the heading
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  // A new outcome: bring the readout into view
  useEffect(() => {
    if (result) outRef.current?.scrollIntoView?.({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" })
  }, [result])

  // ── THE ONE PLACE AN OUTCOME HAPPENS ───────────────────────────────────
  // Drag, tap and keyboard all end here.
  function sendUp(f) {
    setSelected(null)
    clearTimeout(timer.current)
    setHold(null)
    let first = false

    if (f.kind === "none") {
      play("none")
    } else {
      play("yes")
      if (f.testId) {
        first = !live.current.includes(f.testId)
        if (first) caseActions.test(f.testId)   // scored by the store, once
        if (first && f.kind === "contradiction") {
          if (reducedMotion()) play("contra")
          else {
            setHold(f.testId)
            timer.current = setTimeout(() => { setHold(null); play("contra") }, REVEAL_MS)
          }
        }
      } else {
        setExemptUp(up => up.includes(f.key) ? up : [...up, f.key])
      }
    }
    setResult({ key: f.key, first, n: ++count.current })
  }

  // ── DRAGGING (mouse, pen and touch through Pointer Events) ─────────────
  function onPointerDown(e, f) {
    if (e.pointerType === "mouse" && e.button !== 0) return
    swallow.current = false
    const el   = e.currentTarget
    const body = el.closest(".cs-body")
    const start = { x: e.clientX, y: e.clientY, id: e.pointerId, scroll: body?.scrollTop ?? 0 }
    // Window zoom scales this subtree; turn screen pixels into its own
    const zoom = el.getBoundingClientRect().width / el.offsetWidth || 1
    let moving = false
    let last = null      // latest pointer position
    let frame = 0        // auto-scroll loop
    try { el.setPointerCapture(e.pointerId) } catch { /* old browser — moves still arrive while over the figure */ }

    // Over the zone, and over the part of it the scroll box actually shows
    const overZone = (p) => {
      const r = zoneRef.current?.getBoundingClientRect()
      const b = body?.getBoundingClientRect() ?? r
      if (!r) return false
      return p.x >= Math.max(r.left, b.left) && p.x <= Math.min(r.right, b.right)
        && p.y >= Math.max(r.top, b.top) && p.y <= Math.min(r.bottom, b.bottom)
    }
    const show = () => {
      const scrolled = (body?.scrollTop ?? 0) - start.scroll
      setDrag({ key: f.key, dx: (last.x - start.x) / zoom, dy: (last.y - start.y + scrolled) / zoom, over: overZone(last) })
    }
    // In a short window the sky and the ground don't fit at once: holding a
    // figure near the top or bottom edge scrolls the scene under it
    const edgeScroll = () => {
      frame = 0
      if (!body || !last) return
      const b = body.getBoundingClientRect()
      const edge = Math.min(28, b.height / 4)
      const v = last.y < b.top + edge ? -6 : last.y > b.bottom - edge ? 6 : 0
      if (!v) return
      const before = body.scrollTop
      body.scrollTop += v
      if (body.scrollTop === before) return
      show()
      frame = requestAnimationFrame(edgeScroll)
    }
    const move = (ev) => {
      if (ev.pointerId !== start.id) return
      last = { x: ev.clientX, y: ev.clientY }
      if (!moving && Math.hypot(last.x - start.x, last.y - start.y) < DRAG_START) return
      moving = true
      setSelected(null)
      show()
      if (!frame) frame = requestAnimationFrame(edgeScroll)
    }
    const finish = (ev, cancelled) => {
      if (ev.pointerId !== start.id) return
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", cancel)
      cancelAnimationFrame(frame)
      if (!moving) return
      swallow.current = true
      setDrag(null)
      if (!cancelled && overZone({ x: ev.clientX, y: ev.clientY })) sendUp(f)
    }
    const up     = (ev) => finish(ev, false)
    const cancel = (ev) => finish(ev, true)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", cancel)
  }

  // ── TAP / KEYBOARD: pick a figure, then the zone ───────────────────────
  function onFigureClick(e, f) {
    // A real click (detail > 0) right after a drag is the drag's own click
    if (swallow.current && e.detail !== 0) { swallow.current = false; return }
    swallow.current = false
    if (selected === f.key) { setSelected(null); return }
    setSelected(f.key)
    // Next stop is the zone — move there so Enter sends the figure up
    zoneBtnRef.current?.focus({ preventScroll: true })
  }
  function onZoneClick() {
    const f = selected && byKey(selected)
    if (f) sendUp(f)
  }
  function onKeyDown(e) {
    if (e.key === "Escape" && selected) { e.stopPropagation(); setSelected(null) }
  }

  const sel = selected && byKey(selected)
  const zoneLabel = sel
    ? `${action.verb} ${sel.label} ${action.dir} to ${place.name}`
    : `${place.name}. Pick a person first, then choose this to ${action.verb.toLowerCase()} them ${action.dir}.`

  const renderFigure = (f) => {
    const upNow = isUp(f)
    const d = drag?.key === f.key ? drag : null
    const tc = f.testId && caseData.testCases.find(t => t.id === f.testId)
    const fx =
      result?.key === f.key && f.kind === "none" ? " nope" :
      result?.key === f.key && upNow             ? " arrive" : ""
    return (
      <button
        key={f.key + (fx ? `:${result.n}` : "")}
        type="button"
        className={
          "sc-fig" + (upNow ? " up" : "") + (upNow && tc?.violatesRule ? " contra" : "")
          + (d ? " dragging" : "") + (d ? "" : fx)
        }
        style={d ? { transform: `translate(${d.dx}px, ${d.dy}px)` } : undefined}
        aria-pressed={selected === f.key}
        aria-label={`${f.label} — ${upNow ? `in ${place.name}` : `on ${scene.ground}`}`}
        onPointerDown={(e) => onPointerDown(e, f)}
        onClick={(e) => onFigureClick(e, f)}
        onDragStart={(e) => e.preventDefault()}
      >
        <Person />
        <span className="sc-name">{f.label}</span>
      </button>
    )
  }

  const upFigs     = figures.filter(isUp)
  const groundFigs = figures.filter(f => !isUp(f))
  const canNext    = tested.length > 0

  return (
    <div className="cs-root sc-root" onKeyDown={onKeyDown}>
      <style>{PANEL_CSS + SCENE_CSS}</style>

      <div className="cs-head">
        <span className="cs-step-count">Step {STAGE + 1} of 4</span>
        <span className="cs-step-name">{STAGES[STAGE]}</span>
        <span className="cs-dots" aria-hidden="true">
          {STAGES.map((_, i) => <span key={i} className={"cs-dot" + (i <= STAGE ? " on" : "")} />)}
        </span>
      </div>

      <div className="cs-body">
        <h2 className="cs-h" tabIndex={-1} ref={headingRef}>{STAGES[STAGE]}</h2>

        <p className="sc-rule">
          <b>Rule verse — {caseData.ruleVerse.reference}:</b>{" "}
          {verses[caseData.ruleVerse.reference] ?? "…"}
        </p>
        <p className="sc-help">
          Drag a person {action.dir} into {place.name}. No drag? Tap a person, then tap {place.name}
          {" "}(keyboard: Tab to a person and press Enter, then Enter again to send them).
          A passage that breaks a rule is a <b>CONTRADICTION</b>.
        </p>

        <div className="cs-scorebar">
          <span>Passages tested: <b>{shown.tested.length} of {total}</b></span>
          <span>
            Logic Integrity Score: <b>{fmtScore(shown.logicIntegrity)}</b>
            {shown.impact !== 0 && <> ({fmtImpact(shown.impact)})</>}
          </span>
        </div>

        <div className="sc-scene">
          <div
            ref={zoneRef}
            className={"sc-heaven" + (drag?.over ? " over" : "") + (sel ? " armed" : "")}
          >
            <button type="button" ref={zoneBtnRef} className="sc-zonebtn" onClick={onZoneClick} aria-label={zoneLabel}>
              <span className="sc-zone-label" aria-hidden="true">{place.name.toUpperCase()}</span>
              <span className="sc-zone-hint" aria-hidden="true">
                {sel ? `Tap to ${action.verb.toLowerCase()} ${sel.label} ${action.dir}` : drag ? "Drop here" : ""}
              </span>
            </button>
            <div className="sc-row">
              {upFigs.length ? upFigs.map(renderFigure)
                : <span className="sc-empty">No one yet.</span>}
            </div>
          </div>

          <div className="sc-earth">
            <div className="sc-row">
              {groundFigs.length ? groundFigs.map(renderFigure)
                : <span className="sc-empty">Everyone has been tested.</span>}
            </div>
            <div className="sc-ground" aria-hidden="true">{scene.ground.toUpperCase()}</div>
          </div>
        </div>

        <div ref={outRef} aria-live="polite">
          {result && (
            <Outcome
              key={result.n}
              f={byKey(result.key)} first={result.first}
              caseData={caseData} scene={scene} verses={verses}
              ruleNo={ruleNo} placeWord={placeWord}
              delay={result.first && !reducedMotion() ? REVEAL_MS : 0}
            />
          )}
        </div>

        <p className="sc-help" aria-live="polite">
          {canNext ? null : "Test at least one passage to see the verdict."}
        </p>

        {tested.length === total && (
          <button className="cs-btn primary wide" onClick={() => caseActions.goTo(3)}>
            See the verdict →
          </button>
        )}
      </div>

      <div className="cs-foot">
        <button className="cs-btn" onClick={() => caseActions.goTo(STAGE - 1)}>← Back</button>
        <span className="cs-hint" />
        <button className="cs-btn primary" disabled={!canNext} onClick={() => caseActions.goTo(STAGE + 1)}>
          Next →
        </button>
      </div>
    </div>
  )
}

// ── ONE OUTCOME ──────────────────────────────────────────────────────────
function Outcome({ f, first, caseData, scene, verses, ruleNo, placeWord, delay }) {
  const [revealed, setRevealed] = useState(delay === 0)
  useEffect(() => {
    if (delay === 0) return
    const t = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const { action } = scene
  const said = `${action.past} ${action.prep} ${placeWord}`

  if (f.kind === "none") {
    return (
      <section className="sc-out none">
        <div className="sc-out-top">
          <span className="sc-out-say">{f.name} has not {said}.</span>
          <span className="cs-tag sc-tag-amber">NO RECORD</span>
        </div>
        <p className="sc-out-note">
          No passage in this case records it, so {f.name} goes back to {scene.ground}.
          This is not a contradiction, and no score changes.
        </p>
      </section>
    )
  }

  const verse = <Verse verse={f.verse} text={verses[f.verse.reference]} />

  if (f.kind === "exempt") {
    const rule = caseData.rulesItDefines.find(r => r.id === f.ruleId)
    return (
      <section className="sc-out">
        <div className="sc-out-top">
          <span className="sc-out-say">Yes — {f.name} {said}.</span>
          <span className="cs-tag ok">YES</span>
        </div>
        {verse}
        <p className="sc-out-note">
          This is the exception the rule verse itself makes — Rule {ruleNo(rule.id)}: {rule.statement}{" "}
          It breaks no rule, so nothing is scored.
        </p>
      </section>
    )
  }

  const tc = caseData.testCases.find(t => t.id === f.testId)

  if (f.kind === "consistent") {
    return (
      <section className="sc-out">
        <div className="sc-out-top">
          <span className="sc-out-say">{f.label}</span>
          <span className="cs-tag ok">NO CONTRADICTION</span>
        </div>
        {verse}
        <p className="cs-verdict-line ok">{tc.verdict}</p>
        {!first && <p className="sc-out-note">Already tested — the result is recorded.</p>}
      </section>
    )
  }

  // Contradiction: the "yes" and the passage, then the panel's result
  const rule = caseData.rulesItDefines.find(r => r.id === tc.violatesRule)
  const sev  = SEVERITY[tc.severity]
  return (
    <section className={"sc-out" + (revealed ? " contra" : "")}>
      <div className="sc-out-top">
        <span className="sc-out-say">{f.affirms ? `Yes — ${f.name} ${said}.` : f.label}</span>
        <span className="cs-tag ok">YES</span>
      </div>
      {verse}
      {revealed && (
        <div className={"sc-contra" + (delay ? " later" : "")}>
          <div className="sc-out-top">
            <span className="sc-contra-v">CONTRADICTION</span>
            <span className="cs-tag bad">{fmtImpact(sev.scoreImpact)}</span>
          </div>
          <p className="sc-contra-plain">Two passages say things that cannot both be true.</p>
          <p className="sc-contra-rule">Breaks Rule {ruleNo(rule.id)}: {rule.statement}</p>
          <p>{tc.violationExplanation}</p>
          <span className="cs-chip" style={{ color: sev.color, borderColor: sev.color }}>
            L{sev.level} — {sev.name}: {sev.plain}
          </span>
          <p>
            {first
              ? <>Score {fmtImpact(sev.scoreImpact)} — taken off the Logic Integrity Score once for this passage.</>
              : <>Already recorded — this was taken off once, when {f.name} was first tested. Nothing more is taken off.</>}
          </p>
          <p className="cs-verdict-line">{tc.verdict}</p>
        </div>
      )}
    </section>
  )
}

function Verse({ verse, text }) {
  return (
    <blockquote className="cs-verse">
      {text ?? "…"}
      <cite>— {verse.reference} ({TRANSLATION})</cite>
    </blockquote>
  )
}

// A small pixel figure, drawn in the text color
function Person() {
  return (
    <svg className="sc-person" viewBox="0 0 8 13" aria-hidden="true">
      <rect x="3" y="0" width="2" height="2" />
      <rect x="2" y="1" width="4" height="2" />
      <rect x="3" y="3" width="2" height="1" />
      <rect x="1" y="4" width="6" height="1" />
      <rect x="0" y="5" width="2" height="3" />
      <rect x="6" y="5" width="2" height="3" />
      <rect x="2" y="4" width="4" height="5" />
      <rect x="2" y="9" width="2" height="4" />
      <rect x="4" y="9" width="2" height="4" />
    </svg>
  )
}

// ── VERSE LOADING ────────────────────────────────────────────────────────
// Same source as the panel: every verse by reference from the BSB store
function useSceneVerses(caseData) {
  const [verses, setVerses] = useState({})
  useEffect(() => {
    let alive = true
    const refs = [caseData.ruleVerse, ...caseData.testCases.map(tc => tc.verse)]
    Promise.all(refs.map(v => getVerse(v.book, v.chapter, v.verse)
      .catch(() => null)
      .then(text => [v.reference, text ?? "[verse text unavailable]"])))
      .then(entries => { if (alive) setVerses(Object.fromEntries(entries)) })
    return () => { alive = false }
  }, [caseData])
  return verses
}

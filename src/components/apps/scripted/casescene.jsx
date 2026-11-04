// casescene.jsx — the visual view of a case's Test step
//
// A sky zone (the place the case's rules are about) over a ground plane.
// The figures stand on the ground; dragging one up into the zone — or
// tapping it and then tapping the zone, or doing the same from the
// keyboard — tests it. Every move works the other way too: drag a figure
// back down, or tap it and then tap the ground.
//
// Where a figure stands is this scene's own state, kept apart from the
// record. What each figure means comes from deriveScene() (derivescene.js);
// scoring goes through caseActions.test, the same call the panel's "Test it
// against the rule" button makes, so the two views share one record and a
// passage can only ever be scored once — the first time it goes up.
// Bringing a figure back down never untests it; sending it up again replays
// the recorded result. On entry, every tested figure starts in the zone
// (its record puts it there); untested and exempt figures start on the
// ground. Decoys never leave the ground: a drop in the zone is their
// NO RECORD outcome, not a move.
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
const SETTLE_MS  = 200   // a drop that moves nothing glides back (scenestyle .settle)

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

// The two places a figure can stand
const ZONE = "zone"
const GROUND = "ground"
const other = (at) => at === ZONE ? GROUND : ZONE

export default function CaseScene({ caseData, scene }) {
  const { tested: testedByCase } = useCaseState()
  const tested = testedByCase[caseData.id] ?? NONE
  const verses = useSceneVerses(caseData)

  const [selected, setSelected] = useState(null)  // figure key picked by tap / keyboard
  const [placed,   setPlaced]   = useState({})    // { [figure key]: ZONE | GROUND } — moves this visit (not progress)
  const [result,   setResult]   = useState(null)  // { key, first, back, n } — outcome on screen
  const [hold,     setHold]     = useState(null)  // test id whose deduction is still being revealed
  const [drag,     setDrag]     = useState(null)  // { key, dx, dy, from, over }
  const [fx,       setFx]       = useState(null)  // { key, name } — a figure's one-off animation
  const [settle,   setSettle]   = useState(null)  // figure key gliding back after a drop that moved nothing

  const rootRef     = useRef(null)
  const zoneRef     = useRef(null)
  const zoneBtnRef  = useRef(null)
  const earthRef    = useRef(null)
  const earthBtnRef = useRef(null)
  const outRef      = useRef(null)
  const headingRef  = useRef(null)
  const timer       = useRef(null)
  const settleTimer = useRef(null)
  const endDrag     = useRef(null)    // tears down a drag in progress (unmount)
  const swallow     = useRef(false)   // the click that ends a drag isn't a tap
  const count       = useRef(0)
  const live        = useRef(tested)  // latest record, for handlers set up mid-drag
  useEffect(() => { live.current = tested }, [tested])

  const { place, action, figures } = scene
  const placeWord = place.name.toLowerCase()
  const byKey = (k) => figures.find(f => f.key === k)
  // Position, never the record: a scored figure is up when its passage is
  // tested and it hasn't been brought back down this visit. A scored figure
  // can only be up once tested (the only way up is the test).
  const isUp = (f) =>
    f.kind === "none" ? false :
    f.testId          ? tested.includes(f.testId) && placed[f.key] !== GROUND :
                        placed[f.key] === ZONE
  const at    = (f) => isUp(f) ? ZONE : GROUND
  const shown = computeScores(caseData, tested.filter(id => id !== hold))
  const total = caseData.testCases.length
  const ruleNo = (id) => caseData.rulesItDefines.findIndex(r => r.id === id) + 1

  // Same entry behavior as a panel stage: top of the body, focus on the heading
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [])
  useEffect(() => () => {
    clearTimeout(timer.current)
    clearTimeout(settleTimer.current)
    endDrag.current?.()
  }, [])

  // A new outcome: bring the readout into view
  useEffect(() => {
    if (result) outRef.current?.scrollIntoView?.({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" })
  }, [result])

  // ── THE ONE PLACE A MOVE HAPPENS ───────────────────────────────────────
  // Drag, tap and keyboard all end here, in either direction.
  function moveTo(f, to) {
    setSelected(null)
    clearTimeout(timer.current)
    setHold(null)
    if (to === ZONE) sendUp(f)
    else bringDown(f)
  }

  // Up: the outcome. The score is taken here, once — the first time a
  // passage goes up. Every later trip up replays the recorded result.
  function sendUp(f) {
    let first = false

    if (f.kind === "none") {
      play("none")
    } else {
      play("yes")
      setPlaced(p => ({ ...p, [f.key]: ZONE }))
      if (f.testId) {
        first = !live.current.includes(f.testId)
        if (first) {
          caseActions.test(f.testId)   // scored by the store, once
          live.current = [...live.current, f.testId]
        }
        if (first && f.kind === "contradiction") {
          if (reducedMotion()) play("contra")
          else {
            setHold(f.testId)
            timer.current = setTimeout(() => { setHold(null); play("contra") }, REVEAL_MS)
          }
        }
      }
    }
    setFx({ key: f.key, name: f.kind === "none" ? "nope" : "arrive" })
    setResult({ key: f.key, first, n: ++count.current })
  }

  // Down: position only. The record — tested, scored, counted — stays put.
  function bringDown(f) {
    setPlaced(p => ({ ...p, [f.key]: GROUND }))
    setFx({ key: f.key, name: "land" })
    setResult({ key: f.key, back: true, n: ++count.current })
  }

  // ── DRAGGING (mouse, pen and touch through Pointer Events) ─────────────
  function onPointerDown(e, f) {
    if (e.pointerType === "mouse" && e.button !== 0) return
    endDrag.current?.()                  // one drag at a time: a new press ends the last
    swallow.current = false
    clearTimeout(settleTimer.current)
    setSettle(null)

    const el   = e.currentTarget
    const body = el.closest(".cs-body")
    // The figure's element, found fresh each time: a re-render mid-drag
    // may replace it, and window zoom or a resize may move it
    const node = () => rootRef.current?.querySelector(`[data-fig="${f.key}"]`) ?? el
    // Window zoom scales this subtree; turn screen pixels into its own
    const zoomOf = (n) => n.getBoundingClientRect().width / n.offsetWidth || 1
    const r0 = el.getBoundingClientRect(), z0 = zoomOf(el)
    const grab  = { x: (e.clientX - r0.left) / z0, y: (e.clientY - r0.top) / z0 }  // where it was picked up
    const start = { x: e.clientX, y: e.clientY, id: e.pointerId }
    const from  = at(f)
    let moving = false
    let last = null      // latest pointer position
    let frame = 0        // auto-scroll loop
    try { el.setPointerCapture(e.pointerId) } catch { /* old browser — window listeners still see the moves */ }

    // Which place a point is over — counting only the part of it the scroll
    // box actually shows
    const inside = (ref, p) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return false
      const b = body?.getBoundingClientRect() ?? r
      return p.x >= Math.max(r.left, b.left) && p.x <= Math.min(r.right, b.right)
        && p.y >= Math.max(r.top, b.top) && p.y <= Math.min(r.bottom, b.bottom)
    }
    const areaAt = (p) => inside(zoneRef, p) ? ZONE : inside(earthRef, p) ? GROUND : null

    // Draw the figure with the grab point under the pointer. Measured from
    // where the figure rests right now (its drawn box minus the offset it is
    // drawn with), so a scroll, a resize or a zoom change mid-drag can't
    // leave it behind or make it jump.
    const show = () => {
      if (!moving || !last) return
      const n = node()
      const z = zoomOf(n)
      const r = n.getBoundingClientRect()
      const t = getComputedStyle(n).transform
      const m = t && t !== "none" ? new DOMMatrixReadOnly(t) : { m41: 0, m42: 0 }
      const restX = r.left - m.m41 * z, restY = r.top - m.m42 * z
      const over = areaAt(last)
      setDrag({
        key: f.key, from,
        dx: (last.x - restX) / z - grab.x,
        dy: (last.y - restY) / z - grab.y,
        over: over === other(from) ? over : null,   // only the place it would move to lights up
      })
    }
    // In a short window the sky and the ground don't fit at once: holding a
    // figure near the top or bottom edge scrolls the scene under it, either
    // way — and stops once the far edge of the scene is in view, so a held
    // figure ends up over the sky or the ground rather than the text past them
    const edgeScroll = () => {
      frame = 0
      if (!body || !last || !zoneRef.current || !earthRef.current) return
      const b = body.getBoundingClientRect()
      const z = b.width / body.offsetWidth || 1
      const edge = Math.min(28, b.height / 4)
      const above = (b.top - zoneRef.current.getBoundingClientRect().top) / z          // sky hidden above
      const below = (earthRef.current.getBoundingClientRect().bottom - b.bottom) / z   // ground hidden below
      const v = last.y < b.top + edge && above > 0.5    ? -Math.min(6, Math.ceil(above)) :
                last.y > b.bottom - edge && below > 0.5 ?  Math.min(6, Math.ceil(below)) : 0
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
      if (!moving) {
        moving = true
        setSelected(null)
        setFx(x => x?.key === f.key ? null : x)   // don't replay its last animation after
      }
      show()
      if (!frame) frame = requestAnimationFrame(edgeScroll)
    }
    const layout = () => show()   // scrolled or resized under a held figure
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(layout) : null

    const stop = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel)
      window.removeEventListener("resize", layout)
      body?.removeEventListener("scroll", layout)
      ro?.disconnect()
      cancelAnimationFrame(frame)
      endDrag.current = null
    }
    const finish = (ev, cancelled) => {
      if (ev.pointerId !== start.id) return
      stop()
      if (!moving) return
      swallow.current = true
      setDrag(null)
      // Where it stands now (read off the page — it can't have moved, but
      // the page is the truth) and where it was let go
      const now = node().closest(".sc-heaven") ? ZONE : GROUND
      const to  = cancelled ? null : areaAt({ x: ev.clientX, y: ev.clientY })
      if (to && to !== now) {
        moveTo(f, to)
      } else {
        // Dropped on its own place or on neither: back where it was, nothing happens
        setSettle(f.key)
        settleTimer.current = setTimeout(() => setSettle(null), SETTLE_MS)
      }
    }
    const up     = (ev) => finish(ev, false)
    const cancel = (ev) => finish(ev, true)
    // On the window, not the figure: the figure's element can be replaced
    // mid-drag, and a listener on it would go with it
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", cancel)
    window.addEventListener("resize", layout)
    body?.addEventListener("scroll", layout, { passive: true })
    if (body) ro?.observe(body)
    endDrag.current = () => { stop(); setDrag(null) }
  }

  // ── TAP / KEYBOARD: pick a figure, then the place it should go ─────────
  function onFigureClick(e, f) {
    // A real click (detail > 0) right after a drag is the drag's own click
    if (swallow.current && e.detail !== 0) { swallow.current = false; return }
    swallow.current = false
    if (selected === f.key) { setSelected(null); return }
    setSelected(f.key)
    // Next stop is the other place — move there so Enter moves the figure
    ;(isUp(f) ? earthBtnRef : zoneBtnRef).current?.focus({ preventScroll: true })
  }
  function onAreaClick(area) {
    const f = selected && byKey(selected)
    if (!f) return
    if (area === at(f)) { setSelected(null); return }   // its own place: keep it there
    moveTo(f, area)
  }
  function onKeyDown(e) {
    if (e.key === "Escape" && selected) { e.stopPropagation(); setSelected(null) }
  }

  const sel    = selected && byKey(selected)
  const selAt  = sel ? at(sel) : null
  const target = drag ? other(drag.from) : sel ? other(selAt) : null   // where a move would go
  const zoneLabel =
    selAt === GROUND ? `${action.verb} ${sel.label} ${action.dir} to ${place.name}` :
    selAt === ZONE   ? `Keep ${sel.label} in ${place.name}` :
    `${place.name}. Pick a person on ${scene.ground} first, then choose this to ${action.verb.toLowerCase()} them ${action.dir}.`
  const earthLabel =
    selAt === ZONE   ? `${action.back} ${sel.label} to ${scene.ground}` :
    selAt === GROUND ? `Keep ${sel.label} on ${scene.ground}` :
    `${scene.ground}. Pick a person in ${place.name} first, then choose this to ${action.back.toLowerCase()} them.`
  const zoneHint =
    drag ? (target === ZONE ? "Drop here" : "") :
    selAt === GROUND ? `Tap to ${action.verb.toLowerCase()} ${sel.label} ${action.dir}` : ""
  const earthHint =
    drag ? (target === GROUND ? "Drop here" : "") :
    selAt === ZONE ? `Tap to ${action.back.toLowerCase()} ${sel.label} to ${scene.ground}` : ""

  const renderFigure = (f) => {
    const upNow = isUp(f)
    const d = drag?.key === f.key ? drag : null
    const tc = f.testId && caseData.testCases.find(t => t.id === f.testId)
    // The record's look belongs to the record, not the position: a tested
    // contradiction keeps it wherever the figure stands
    const done = Boolean(tc) && tested.includes(tc.id)
    const anim = !d && fx?.key === f.key && settle !== f.key ? " " + fx.name : ""
    const record = !done ? "" : tc.violatesRule ? ", tested: CONTRADICTION" : ", tested: NO CONTRADICTION"
    return (
      <button
        key={f.key}
        data-fig={f.key}
        type="button"
        className={
          "sc-fig" + (upNow ? " up" : "") + (done && tc.violatesRule ? " contra" : "")
          + (d ? " dragging" : "") + (settle === f.key && !d ? " settle" : "") + anim
        }
        style={d ? { transform: `translate(${d.dx}px, ${d.dy}px)` } : undefined}
        aria-pressed={selected === f.key}
        aria-label={`${f.label} — ${upNow ? `in ${place.name}` : `on ${scene.ground}`}${record}`}
        onPointerDown={(e) => onPointerDown(e, f)}
        onClick={(e) => onFigureClick(e, f)}
        onAnimationEnd={(e) => { if (e.target === e.currentTarget) setFx(x => x?.key === f.key ? null : x) }}
        onDragStart={(e) => e.preventDefault()}
      >
        <Person />
        <span className="sc-name">{f.label}</span>
      </button>
    )
  }

  const upFigs     = figures.filter(isUp)
  const groundFigs = figures.filter(f => !isUp(f))
  const lift       = (figs) => drag && figs.some(f => f.key === drag.key) ? " lift" : ""
  const canNext    = tested.length > 0

  return (
    <div className="cs-root sc-root" ref={rootRef} onKeyDown={onKeyDown}>
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
          Drag a person {action.dir} into {place.name}, or back {action.backDir} to {scene.ground}.
          {" "}No drag? Tap a person, then tap where they should go (keyboard: Tab to a person and
          press Enter, then Enter again to move them). A passage is scored once, the first time
          its person goes {action.dir}; moving them back {action.backDir} doesn't undo it.
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
            className={"sc-heaven" + (drag?.over === ZONE ? " over" : "") + (!drag && target === ZONE ? " armed" : "")}
          >
            <button type="button" ref={zoneBtnRef} className="sc-zonebtn" onClick={() => onAreaClick(ZONE)} aria-label={zoneLabel}>
              <span className="sc-zone-label" aria-hidden="true">{place.name.toUpperCase()}</span>
              <span className="sc-zone-hint" aria-hidden="true">{zoneHint}</span>
            </button>
            <div className={"sc-row" + lift(upFigs)}>
              {upFigs.length ? upFigs.map(renderFigure)
                : <span className="sc-empty">No one is in {place.name}.</span>}
            </div>
          </div>

          <div
            ref={earthRef}
            className={"sc-earth" + (drag?.over === GROUND ? " over" : "") + (!drag && target === GROUND ? " armed" : "")}
          >
            <button type="button" ref={earthBtnRef} className="sc-zonebtn" onClick={() => onAreaClick(GROUND)} aria-label={earthLabel} />
            <div className={"sc-row" + lift(groundFigs)}>
              {groundFigs.length ? groundFigs.map(renderFigure)
                : <span className="sc-empty">No one is on {scene.ground}.</span>}
            </div>
            <div className="sc-ground" aria-hidden="true">
              <span>{scene.ground.toUpperCase()}</span>
              {earthHint && <span className="sc-zone-hint">{earthHint}</span>}
            </div>
          </div>
        </div>

        <div ref={outRef} aria-live="polite">
          {result && (
            <Outcome
              key={result.n}
              f={byKey(result.key)} first={result.first} back={result.back}
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
function Outcome({ f, first, back, caseData, scene, verses, ruleNo, placeWord, delay }) {
  const [revealed, setRevealed] = useState(delay === 0)
  useEffect(() => {
    if (delay === 0) return
    const t = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const { action } = scene
  const said = `${action.past} ${action.prep} ${placeWord}`

  // Brought back down: a move, not an outcome — the record doesn't change
  if (back) {
    const tc  = f.testId && caseData.testCases.find(t => t.id === f.testId)
    const sev = tc?.violatesRule && SEVERITY[tc.severity]
    return (
      <section className="sc-out">
        <div className="sc-out-top">
          <span className="sc-out-say">{f.label} is back on {scene.ground}.</span>
          {!tc  ? <span className="cs-tag dim">NOT SCORED</span>
            : sev ? <span className="cs-tag bad">CONTRADICTION · {fmtImpact(sev.scoreImpact)}</span>
            : <span className="cs-tag ok">NO CONTRADICTION</span>}
        </div>
        <p className="sc-out-note">
          {tc
            ? <>
                Moving {f.name} doesn't change the record: {tc.verse.reference} stays tested
                {sev ? <>, and its {fmtImpact(sev.scoreImpact)} was taken off once</> : null}.
                {" "}{action.verb} them {action.dir} again to see the result.
              </>
            : <>Nothing was scored for {f.name}, so nothing changes.</>}
        </p>
      </section>
    )
  }

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

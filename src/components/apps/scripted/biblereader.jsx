// biblereader.jsx — click-driven BSB reader inside scripted.exe
//
// Three steps, with "Step n of 3" and Back/Next on screen like the case flow:
//   0 Pick a book · 1 Pick a chapter · 2 Read
// Browsing only — no search, bookmarks, notes, commentary or second
// translation. The text is the same BSB store the analyser tests against,
// loaded one book file at a time.

import { useEffect, useRef, useState } from "react"
import { BOOKS, getChapter } from "../../the_bible/bible"
import { TRANSLATION } from "../../../data/bsb"
import { readerActions, useReaderState, neighbour } from "./readerstore"
import { PANEL_CSS, GREEN, DIM, DIMMED } from "./panelstyle"

const STEPS = ["Pick a book", "Pick a chapter", "Read"]

const bookById = (id) => BOOKS.find(b => b.id === id) ?? null

export default function BibleReader() {
  const { step, book, chapter } = useReaderState()
  const b = bookById(book)

  // Guard against a step with nothing picked for it
  const shown = step === 2 && b && chapter ? 2 : step >= 1 && b ? 1 : 0

  const bodyRef    = useRef(null)
  const headingRef = useRef(null)

  // New step or chapter: start at the top and move keyboard focus to the heading
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [shown, book, chapter])

  const heading =
    shown === 2 ? `${b.name} ${chapter}` :
    shown === 1 ? `${b.name} — pick a chapter` :
                  "Pick a book"

  const canNext  = (shown === 0 && b) || (shown === 1 && chapter)
  const nextHint =
    shown === 0 ? (b ? null : "Click a book to open it.") :
    shown === 1 ? (chapter ? null : "Click a chapter number to read it.") :
                  null

  return (
    <div className="cs-root">
      <style>{PANEL_CSS}{READER_CSS}</style>

      {/* ── STEP INDICATOR ─────────────────────────────────────────── */}
      <div className="cs-head">
        <span className="cs-step-count">Read the Bible · Step {shown + 1} of 3</span>
        <span className="cs-step-name">{STEPS[shown]}</span>
        <span className="cs-dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={"cs-dot" + (i <= shown ? " on" : "")} />
          ))}
        </span>
      </div>

      {/* ── STEP BODY ──────────────────────────────────────────────── */}
      <div className="cs-body" ref={bodyRef}>
        <h2 className="cs-h" tabIndex={-1} ref={headingRef}>{heading}</h2>

        {shown === 0 && <PickBook current={book} />}
        {shown === 1 && <PickChapter book={b} current={chapter} />}
        {shown === 2 && <ReadChapter book={b} chapter={chapter} />}
      </div>

      {/* ── BACK / NEXT ────────────────────────────────────────────── */}
      <div className="cs-foot">
        <button
          className="cs-btn"
          onClick={() => shown === 0 ? readerActions.close() : readerActions.goTo(shown - 1)}
        >{shown === 0 ? "← Back to cases" : "← Back"}</button>
        <span className="cs-hint" aria-live="polite">{nextHint}</span>
        <button
          className="cs-btn primary"
          disabled={!canNext}
          onClick={() => readerActions.goTo(shown + 1)}
        >Next →</button>
      </div>
    </div>
  )
}

// ── STEP 0 — PICK A BOOK ─────────────────────────────────────────────────
function PickBook({ current }) {
  const groups = [
    ["Old Testament", BOOKS.filter(b => b.testament === "OT")],
    ["New Testament", BOOKS.filter(b => b.testament === "NT")],
  ]
  return (
    <>
      <p className="cs-p">The {TRANSLATION} — Berean Standard Bible. Pick a book to open it.</p>
      {groups.map(([label, books]) => (
        <section key={label} className="br-group">
          <h3 className="br-group-h">{label} <span>({books.length} books)</span></h3>
          <div className="br-grid books">
            {books.map(b => (
              <button
                key={b.id}
                className={"cs-btn br-pick" + (b.id === current ? " current" : "")}
                aria-current={b.id === current ? "true" : undefined}
                onClick={() => readerActions.pickBook(b.id)}
              >{b.name}</button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

// ── STEP 1 — PICK A CHAPTER ──────────────────────────────────────────────
function PickChapter({ book, current }) {
  return (
    <>
      <p className="cs-p">
        {book.name} has {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}.
        Pick one to read it.
      </p>
      <div className="br-grid chapters">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            className={"cs-btn br-pick num" + (n === current ? " current" : "")}
            aria-label={`${book.name} chapter ${n}`}
            aria-current={n === current ? "true" : undefined}
            onClick={() => readerActions.pickChapter(n)}
          >{n}</button>
        ))}
      </div>
    </>
  )
}

// ── STEP 2 — READ ────────────────────────────────────────────────────────
function ReadChapter({ book, chapter }) {
  const { status, verses, retry } = useChapter(book.id, chapter)

  return (
    <>
      <ChapterNav book={book} chapter={chapter} />

      {status === "loading" && <p className="cs-p br-status">Loading {book.name} {chapter}…</p>}
      {status === "error" && (
        <div className="cs-notice">
          <span>Couldn't load {book.name}. Check the connection and try again.</span>
          <button className="cs-btn" onClick={retry}>Try again</button>
        </div>
      )}
      {status === "ready" && (
        <ol className="br-text">
          {withGaps(verses).map(v => (
            <li key={v.verse} className={"br-verse" + (v.text === null ? " gap" : "")}>
              <span className="br-vn" aria-hidden="true">{v.verse}</span>
              <span className="br-vt">
                <span className="br-sr">Verse {v.verse}. </span>
                {v.text ?? `(no verse ${v.verse} in the ${TRANSLATION} text)`}
              </span>
            </li>
          ))}
        </ol>
      )}

      {status === "ready" && (
        <>
          <p className="br-source">{book.name} {chapter} — {TRANSLATION}, public domain</p>
          <ChapterNav book={book} chapter={chapter} />
        </>
      )}
    </>
  )
}

// Previous / Next chapter, crossing into the next or previous book at the ends
function ChapterNav({ book, chapter }) {
  const prev = neighbour(book.id, chapter, -1)
  const next = neighbour(book.id, chapter, +1)
  const name = (p) => `${bookById(p.book).name} ${p.chapter}`

  return (
    <nav className="br-nav" aria-label="Chapter">
      <button
        className="cs-btn br-navbtn"
        disabled={!prev}
        onClick={() => readerActions.read(prev.book, prev.chapter)}
      >
        <span>← Previous chapter</span>
        <span className="br-navto">{prev ? name(prev) : "Start of the Bible"}</span>
      </button>
      <button
        className="cs-btn br-navbtn right"
        disabled={!next}
        onClick={() => readerActions.read(next.book, next.chapter)}
      >
        <span>Next chapter →</span>
        <span className="br-navto">{next ? name(next) : "End of the Bible"}</span>
      </button>
    </nav>
  )
}

// A few verses are not in the BSB text (e.g. Matthew 17:21). Show the number
// with a plain note rather than letting the count silently skip.
function withGaps(verses) {
  const out = []
  let expect = 1
  for (const v of verses) {
    for (; expect < v.verse; expect++) out.push({ verse: expect, text: null })
    out.push(v)
    expect = v.verse + 1
  }
  return out
}

// ── CHAPTER LOADING ──────────────────────────────────────────────────────
function useChapter(book, chapter) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, status: "loading", verses: [] })
  const key = `${book} ${chapter} ${attempt}`

  useEffect(() => {
    let live = true
    getChapter(book, chapter).then(
      verses => live && setResult({ key, status: "ready", verses }),
      ()     => live && setResult({ key, status: "error", verses: [] }),
    )
    return () => { live = false }
  }, [book, chapter, key])

  // Until this chapter's own result arrives, it's loading
  const current = result.key === key ? result : { status: "loading", verses: [] }
  return { ...current, retry: () => setAttempt(n => n + 1) }
}

// ── STYLES ───────────────────────────────────────────────────────────────
// Adds to PANEL_CSS. Reading text is larger, calmer and longer-lined than
// the analyser's UI text — glow kept off the body copy for legibility.
const READER_CSS = `
.br-group { margin: 0 0 10px; }
.br-group-h {
  margin: 0 0 5px; font-size: 11px; font-weight: bold; letter-spacing: 0.06em;
  text-transform: uppercase;
}
.br-group-h span { color: ${DIMMED}; font-weight: normal; text-transform: none; letter-spacing: 0; }

.br-grid { display: grid; gap: 4px; }
.br-grid.books    { grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); }
.br-grid.chapters { grid-template-columns: repeat(auto-fill, minmax(38px, 1fr)); }
.cs-root .cs-btn.br-pick { font-weight: normal; text-align: left; padding: 4px 7px; border-color: ${DIM}; }
.cs-root .cs-btn.br-pick.num { text-align: center; padding: 5px 0; }
.cs-root .cs-btn.br-pick:hover:not(:disabled) { border-color: ${GREEN}; }
.cs-root .cs-btn.br-pick.current { border-color: ${GREEN}; font-weight: bold; background: rgba(0,255,65,0.10); }

.br-nav { display: flex; justify-content: space-between; gap: 6px; margin: 4px 0 10px; }
.cs-root .cs-btn.br-navbtn {
  flex: 1 1 0; max-width: 220px; display: flex; flex-direction: column; align-items: flex-start; gap: 1px;
}
.cs-root .cs-btn.br-navbtn.right { align-items: flex-end; margin-left: auto; }
.br-navto { font-size: 10px; font-weight: normal; color: ${DIMMED}; }
.cs-root .cs-btn:disabled .br-navto { color: ${DIM}; }

.br-status { color: ${DIMMED}; }

.br-text {
  list-style: none; margin: 0 0 8px; padding: 0; max-width: 64ch;
  font-size: 13px; line-height: 1.75;
}
.br-verse { display: flex; gap: 8px; margin: 0 0 4px; }
.br-vn {
  flex-shrink: 0; width: 26px; text-align: right; padding-top: 3px;
  font-size: 10px; font-weight: bold; color: ${DIMMED};
}
.br-vt { flex: 1; min-width: 0; white-space: pre-line; }
.br-verse.gap .br-vt { color: ${DIMMED}; font-size: 11px; font-style: italic; }
.br-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}
.br-source { margin: 0 0 8px; font-size: 10px; color: ${DIMMED}; }
`

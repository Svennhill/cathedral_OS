// casestore.js — analyser progress for scripted.exe
//
// Lives at module level (not in component state) so a case survives the
// window being minimized, which unmounts the app, and is mirrored to
// localStorage so it survives a page reload too (same try/catch pattern as
// the preferences in App.jsx — storage being unavailable just means
// progress isn't kept).
//
// Progress belongs to the signed-in user: it is saved under
// cos:<username>:scriptedCaseProgress (see data/userprefs.js), and
// loadCaseStoreFor() swaps it in on login and out on logout. With no user
// signed in the store starts empty and reads and writes nothing.
//
// Scores are never held as state — they're derived from `tested`, so testing
// a passage can only ever count once, and restoring a saved case can't apply
// a score a second time. The saved copy carries a scores snapshot as a
// record of the result; restore ignores it and recomputes from `tested`.

import { useSyncExternalStore } from "react"
import { PASSAGES } from "../../the_bible/passages"
import { computeScores } from "./scoring"
import { userKey, USER_KEYS } from "../../../data/userprefs"

let storageKey = null   // cos:<username>:scriptedCaseProgress, or null (no user)
const LAST_STAGE  = 3   // 0 select · 1 rule · 2 test · 3 verdict

const initial = {
  stage: 0,       // see LAST_STAGE
  caseId: null,   // the open case (null on the select stage)
  tested: {},     // { [caseId]: test case ids, in the order they were run }
  fresh: null,    // id of the test whose result should animate in (never saved)
}

const caseById = (id) => PASSAGES.find(c => c.id === id) ?? null

// ── PERSISTENCE ──────────────────────────────────────────────────────────
// Whatever is read back is checked against the current case data, so a
// stale or hand-edited save can't put the panel in an impossible state.
function restore() {
  if (!storageKey) return initial
  let saved
  try { saved = JSON.parse(localStorage.getItem(storageKey)) } catch { return initial }
  if (!saved || typeof saved !== "object") return initial

  const tested = {}
  for (const [id, ids] of Object.entries(saved.tested ?? {})) {
    const c = caseById(id)
    if (!c || !Array.isArray(ids)) continue
    const known = c.testCases.map(tc => tc.id)
    const kept = [...new Set(ids)].filter(t => known.includes(t))
    if (kept.length) tested[id] = kept
  }

  const caseId = caseById(saved.caseId) ? saved.caseId : null
  let stage = Number.isInteger(saved.stage) ? Math.min(Math.max(saved.stage, 0), LAST_STAGE) : 0
  if (!caseId) stage = 0
  // The verdict is only reachable once something has been tested
  if (stage === LAST_STAGE && !tested[caseId]?.length) stage = LAST_STAGE - 1

  return { stage, caseId: stage ? caseId : null, tested, fresh: null }
}

function persist(s) {
  if (!storageKey) return
  try {
    if (s.stage === 0 && !Object.keys(s.tested).length) {
      localStorage.removeItem(storageKey)
      return
    }
    const scores = {}
    for (const [id, ids] of Object.entries(s.tested)) {
      const { logicIntegrity, truthIndex, versesTested, versesContradicted } = computeScores(caseById(id), ids)
      scores[id] = { logicIntegrity, truthIndex, versesTested, versesContradicted }
    }
    localStorage.setItem(storageKey, JSON.stringify({
      v: 1, stage: s.stage, caseId: s.caseId, tested: s.tested, scores,
    }))
  } catch { /* storage full or blocked — progress just isn't kept */ }
}

// ── STORE ────────────────────────────────────────────────────────────────
let state = initial
const listeners = new Set()

// (Re)load the store for a user — call on login with their username and on
// logout with null. Whatever was showing is replaced at once.
export function loadCaseStoreFor(username) {
  storageKey = username ? userKey(username, USER_KEYS.scriptedCaseProgress) : null
  state = restore()
  listeners.forEach(fn => fn())
}

function set(next) {
  state = { ...state, ...next }
  persist(state)
  listeners.forEach(fn => fn())
}

export const caseActions = {
  open(caseId) {
    if (!caseById(caseId)) return
    set({ caseId, stage: 1, fresh: null })
  },
  goTo(stage) {
    // Leaving or re-entering a stage shows results instantly, not replayed
    set({ stage, caseId: stage === 0 ? null : state.caseId, fresh: null })
  },
  test(id) {
    const done = state.tested[state.caseId] ?? []
    if (!state.caseId || done.includes(id)) return
    set({ tested: { ...state.tested, [state.caseId]: [...done, id] }, fresh: id })
  },
  // Clears one case's progress (and its saved copy) and returns to the list
  reset(caseId) {
    const tested = { ...state.tested }
    delete tested[caseId]
    set({ stage: 0, caseId: null, tested, fresh: null })
  },
}

// One case's progress in words — shared by the case-select cards and the
// start menu's CASE PROGRESS list so the two can never disagree
export function caseStatus(caseData, tested = []) {
  const total = caseData.testCases.length
  return tested.length === 0   ? "Not started" :
         tested.length < total ? `In progress — ${tested.length} of ${total} passages tested` :
                                 `Complete — ${total} of ${total} passages tested`
}

export function useCaseState() {
  return useSyncExternalStore(
    fn => { listeners.add(fn); return () => listeners.delete(fn) },
    () => state,
  )
}

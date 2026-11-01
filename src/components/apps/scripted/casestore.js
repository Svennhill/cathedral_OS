// casestore.js — analyser progress for scripted.exe
//
// Lives at module level (not in component state) so a case survives the
// window being minimized, which unmounts the app. Resets on page reload.
//
// Scores are never stored — they're derived from `tested`, so testing a
// passage can only ever count once.

import { useSyncExternalStore } from "react"

const initial = {
  stage: 0,       // 0 select · 1 rule · 2 test · 3 verdict
  tested: [],     // test case ids, in the order they were run
  fresh: null,    // id of the test whose result should animate in
}

let state = initial
const listeners = new Set()

function set(next) {
  state = { ...state, ...next }
  listeners.forEach(fn => fn())
}

export const caseActions = {
  goTo(stage) {
    // Leaving or re-entering a stage shows results instantly, not replayed
    set({ stage, fresh: null })
  },
  test(id) {
    if (state.tested.includes(id)) return
    set({ tested: [...state.tested, id], fresh: id })
  },
  reset() {
    set(initial)
  },
}

export function useCaseState() {
  return useSyncExternalStore(
    fn => { listeners.add(fn); return () => listeners.delete(fn) },
    () => state,
  )
}

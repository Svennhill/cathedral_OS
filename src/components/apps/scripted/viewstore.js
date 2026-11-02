// viewstore.js — which view of an open case scripted.exe shows
//
//   "panel"   the click-driven CasePanel (default, and the full fallback)
//   "visual"  the drag-and-drop scene for the Test step (CaseScene)
//
// Only the view changes; progress and scores live in casestore.js, so
// switching views never loses or re-applies a result. Module level so a
// minimized window keeps its view; deliberately NOT saved to localStorage,
// so every session (Screen Only included) starts in the panel.

import { useSyncExternalStore } from "react"

let mode = "panel"
const listeners = new Set()

export const viewActions = {
  set(next) {
    if (next !== "panel" && next !== "visual") return
    mode = next
    listeners.forEach(fn => fn())
  },
}

export function useCaseView() {
  return useSyncExternalStore(
    fn => { listeners.add(fn); return () => listeners.delete(fn) },
    () => mode,
  )
}

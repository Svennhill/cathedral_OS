// eventbus.js — a tiny shared event bus + a registry of on-screen regions
//
// The login screen talks to the (separately built) helper-character system
// through this module only; neither imports the other. The helper owns any
// idle timer — nothing here keeps time.
//
// EVENTS (names are fixed — the helper listens for exactly these):
//   login.input       any keydown / input / paste / autofill change in a
//                     sign-in or create-user field. Never carries the value.
//   login.submit      any login or create-user submit attempt (valid or not)
//   login.modeSwitch  the card switched between sign-in and create-user
// Mouse movement, focus and clicks emit nothing.
//
// REGISTRY (what the helper must stay clear of, and what it may point at):
//   registerExclusion(id, rect)  a rect, in viewport CSS px, to keep clear of
//   registerTarget(id, el)       an element it may point at
// Both announce changes as "registry.exclusion" / "registry.target" events,
// so a host that mounts later can read the current state with
// getExclusions() / getTargets() and then subscribe.

export const LOGIN_EVENTS = Object.freeze({
  INPUT:       "login.input",
  SUBMIT:      "login.submit",
  MODE_SWITCH: "login.modeSwitch",
})

const listeners = new Map()   // event name → Set of handlers

export function on(name, fn) {
  if (!listeners.has(name)) listeners.set(name, new Set())
  listeners.get(name).add(fn)
  return () => off(name, fn)
}

export function off(name, fn) {
  listeners.get(name)?.delete(fn)
}

export function emit(name, detail = {}) {
  const set = listeners.get(name)
  if (!set) return
  for (const fn of [...set]) {
    // One broken listener must never break the login form
    try { fn(detail) } catch { /* ignored */ }
  }
}

// ── REGISTRY ─────────────────────────────────────────────────────────────
const exclusions = new Map()   // id → { x, y, width, height, top, right, bottom, left }
const targets    = new Map()   // id → Element

export function registerExclusion(id, rect) {
  if (!rect) return unregisterExclusion(id)
  const r = {
    x: rect.left, y: rect.top, width: rect.width, height: rect.height,
    top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left,
  }
  const prev = exclusions.get(id)
  if (prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height) return
  exclusions.set(id, Object.freeze(r))
  emit("registry.exclusion", { id, rect: exclusions.get(id) })
}

export function unregisterExclusion(id) {
  if (!exclusions.delete(id)) return
  emit("registry.exclusion", { id, rect: null })
}

export function registerTarget(id, el) {
  if (!el) return unregisterTarget(id)
  if (targets.get(id) === el) return
  targets.set(id, el)
  emit("registry.target", { id, el })
}

export function unregisterTarget(id, el) {
  // With an element given, only remove it if it is still the registered one
  if (el && targets.get(id) !== el) return
  if (!targets.delete(id)) return
  emit("registry.target", { id, el: null })
}

export const getExclusions = () => new Map(exclusions)
export const getTargets    = () => new Map(targets)

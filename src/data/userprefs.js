// userprefs.js — everything saved on this device belongs to a user
//
// Every per-user value lives under one namespaced localStorage key:
//
//     cos:<username, lowercased>:<name>
//
// Usernames are case-insensitive (Steven and steven are one account), so the
// namespace always uses the lowercased form. The names in use:
//
//   greyscale             "true" / "false"
//   alwaysScreenOnly      "true" / "false" — the explicit Screen Only choice
//   alwaysScreenOnlySet   "true" once a toggle wrote alwaysScreenOnly
//   desktopZoom           number (ZOOM_STEPS)
//   windowZoom            number (ZOOM_STEPS)
//   volume                number 0–1 (persisted per user starting with login)
//   scriptedCaseProgress  scripted.exe case progress (casestore.js)
//   lilpopeTour           RESERVED — the helper-character tour-completion
//                         flag. Written by the Lil Pope build only; nothing
//                         here reads, writes, or migrates it.
//
// Nothing is read or written for "no user": before a login the OS runs on
// defaults and saves nothing.

import { ZOOM_DEFAULT, clampZoom } from "../utils/screenConstants"

export const USER_KEYS = Object.freeze({
  greyscale:            "greyscale",
  alwaysScreenOnly:     "alwaysScreenOnly",
  alwaysScreenOnlySet:  "alwaysScreenOnlySet",
  desktopZoom:          "desktopZoom",
  windowZoom:           "windowZoom",
  volume:               "volume",
  scriptedCaseProgress: "scriptedCaseProgress",
  lilpopeTour:          "lilpopeTour",   // reserved (see above)
})

export const VOLUME_DEFAULT = 0.5

// The flat, pre-login keys earlier builds wrote (volume was never saved)
export const LEGACY_KEYS = Object.freeze([
  "greyscale", "alwaysScreenOnly", "alwaysScreenOnlySet",
  "desktopZoom", "windowZoom", "scriptedCaseProgress",
])

// The names this build owns — lilpopeTour is deliberately not among them
const OWNED = Object.freeze([
  USER_KEYS.greyscale, USER_KEYS.alwaysScreenOnly, USER_KEYS.alwaysScreenOnlySet,
  USER_KEYS.desktopZoom, USER_KEYS.windowZoom, USER_KEYS.volume,
  USER_KEYS.scriptedCaseProgress,
])

export const userNamespace = (username) => String(username ?? "").trim().toLowerCase()
export const userKey = (username, name) => `cos:${userNamespace(username)}:${name}`

const get = (key) => { try { return localStorage.getItem(key) } catch { return null } }

export function writeUserPref(username, name, value) {
  if (!userNamespace(username)) return
  try { localStorage.setItem(userKey(username, name), String(value)) } catch { /* storage full or blocked */ }
}

// A user's saved preferences. Anything never saved comes back null, so the
// caller decides the default.
export function readUserPrefs(username) {
  const read = (name) => get(userKey(username, name))
  const num  = (name) => {
    const v = read(name)
    const n = v === null ? NaN : parseFloat(v)
    return Number.isFinite(n) ? n : null
  }

  const g = read(USER_KEYS.greyscale)
  const dz = num(USER_KEYS.desktopZoom)
  const wz = num(USER_KEYS.windowZoom)
  const vol = num(USER_KEYS.volume)

  // The explicit "Always load Screen Only" choice: true / false / null (none).
  // A bare "false" only counts once the Set marker says a toggle wrote it
  // (older builds wrote "false" on every load).
  const a = read(USER_KEYS.alwaysScreenOnly)
  const alwaysPref = a === "true" ? true
    : (a === "false" && read(USER_KEYS.alwaysScreenOnlySet) === "true") ? false
    : null

  return {
    greyscale:   g === null ? null : g === "true",
    alwaysPref,
    desktopZoom: dz === null ? null : clampZoom(dz || ZOOM_DEFAULT),
    windowZoom:  wz === null ? null : clampZoom(wz || ZOOM_DEFAULT),
    volume:      vol === null ? null : Math.min(1, Math.max(0, vol)),
  }
}

// ── MIGRATION ────────────────────────────────────────────────────────────
// The first login on a device that still holds the old flat keys hands them
// to that user — but only if the user has nothing of their own saved yet.
// Every value is copied before any legacy key is removed; if a copy fails
// the copies are undone and the legacy keys stay, so nothing is ever lost.
// Returns the names that were adopted (empty when there was nothing to do).
export function adoptLegacyData(username) {
  if (!userNamespace(username)) return []
  let present
  try {
    present = LEGACY_KEYS.filter(k => localStorage.getItem(k) !== null)
  } catch { return [] }
  if (!present.length) return []
  if (OWNED.some(name => get(userKey(username, name)) !== null)) return []

  const written = []
  try {
    for (const k of present) {
      localStorage.setItem(userKey(username, k), localStorage.getItem(k))
      written.push(k)
    }
  } catch {
    for (const k of written) { try { localStorage.removeItem(userKey(username, k)) } catch { /* ignore */ } }
    return []
  }
  for (const k of present) { try { localStorage.removeItem(k) } catch { /* ignore */ } }
  return present
}

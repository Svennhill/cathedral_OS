// uservalidation.js — the rules for a new account, in one place
//
// The create-user form checks these as you submit; userstore.createUser
// checks them again before anything is saved (as a hosted server would), so
// the two can never disagree. Every value is treated as plain data: nothing
// here (or anywhere it is shown) is evaluated or injected as HTML.

export const LIMITS = Object.freeze({
  NAME_MAX:     40,
  TAG_MAX:      16,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
})

export const GENERIC_LOGIN_ERROR = "username or password not recognized"
export const USERNAME_TAKEN      = "that username is taken"

export const PASSWORD_RULE =
  `${LIMITS.PASSWORD_MIN}+ characters, with a lowercase letter, an uppercase letter, and a number or symbol`
export const USERNAME_RULE =
  `${LIMITS.USERNAME_MIN}–${LIMITS.USERNAME_MAX} letters, numbers, or underscores`

// Letters (any alphabet, accents included), spaces, hyphens, and apostrophes
// (straight ' and the curly ’ that phone keyboards type)
const NAME_CHARS  = /^[\p{L}\p{M} '’-]+$/u
const HAS_LETTER  = /\p{L}/u
const USERNAME_CHARS = /^[A-Za-z0-9_]+$/
// Control characters and the bidirectional overrides that can make a name
// display as something other than what was typed
const TAG_FORBIDDEN = /[\p{Cc}‎‏‪-‮⁦-⁩]/u

// ── PROFANITY ────────────────────────────────────────────────────────────
// A STARTER blocklist — modest on purpose, not exhaustive. Matching is
// case-insensitive and by substring, so entries are chosen to avoid
// blocking ordinary words that merely contain them (no "ass", "cock",
// "rape", "spic": classic, peacock, grape, spice). Common digit swaps
// (sh1t, b1tch, 5lut) are folded back to letters first. Extend the
// list here; the hosted service should own a proper one.
const BLOCKLIST = [
  "fuck", "shit", "cunt", "bitch", "bastard", "asshole", "dickhead",
  "cocksucker", "slut", "whore", "piss", "dildo", "jizz", "pussy", "porn",
  "wanker", "twat", "rapist", "nigger", "nigga", "faggot", "kike",
  "tranny", "retard",
]
const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", 9: "g" }

export function containsProfanity(value) {
  const lower = String(value ?? "").toLowerCase()
  const folded = lower.replace(/[01345789]/g, ch => LEET[ch])
  return BLOCKLIST.some(w => lower.includes(w) || folded.includes(w))
}

// ── FIELD RULES ──────────────────────────────────────────────────────────
// Each returns an error message, or null when the value is fine.

export function checkName(value, label) {
  const v = String(value ?? "").trim()
  if (!v) return `enter a ${label}`
  if (v.length > LIMITS.NAME_MAX) return `${label}: ${LIMITS.NAME_MAX} characters max`
  if (!NAME_CHARS.test(v) || !HAS_LETTER.test(v)) return `${label}: letters, spaces, hyphens, and apostrophes only`
  return null
}

export function checkTag(value) {
  const v = String(value ?? "").trim()
  if (!v) return null   // optional
  if (v.length > LIMITS.TAG_MAX) return `tag: ${LIMITS.TAG_MAX} characters max`
  if (TAG_FORBIDDEN.test(v)) return "tag can't contain control characters"
  if (containsProfanity(v)) return "that tag isn't allowed — choose another"
  return null
}

// Format only — whether the name is taken needs the store (async)
export function checkUsername(value) {
  const v = String(value ?? "").trim()
  if (!v) return "choose a username"
  if (!USERNAME_CHARS.test(v)) return "username: letters, numbers, and underscores only"
  if (v.length < LIMITS.USERNAME_MIN || v.length > LIMITS.USERNAME_MAX) {
    return `username must be ${LIMITS.USERNAME_MIN}–${LIMITS.USERNAME_MAX} characters`
  }
  if (containsProfanity(v)) return "that username isn't allowed — choose another"
  return null
}

// What a password is missing, in words (empty array = it passes)
export function passwordMissing(pw) {
  const p = String(pw ?? "")
  const missing = []
  if (p.length < LIMITS.PASSWORD_MIN) missing.push(`at least ${LIMITS.PASSWORD_MIN} characters`)
  if (!/\p{Ll}/u.test(p)) missing.push("a lowercase letter")
  if (!/\p{Lu}/u.test(p)) missing.push("an uppercase letter")
  if (!/[\p{N}\p{P}\p{S}]/u.test(p)) missing.push("a number or symbol")
  return missing
}

const joinList = (items) =>
  items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`

export function checkPassword(pw) {
  const p = String(pw ?? "")
  if (!p) return "choose a password"
  if (p.length > LIMITS.PASSWORD_MAX) return `password: ${LIMITS.PASSWORD_MAX} characters max`
  const missing = passwordMissing(p)
  return missing.length ? `password needs ${joinList(missing)}` : null
}

export function checkConfirm(pw, confirm) {
  if (!confirm) return "re-enter the password to confirm it"
  return confirm === pw ? null : "passwords don't match"
}

// The whole create-user form. `confirmPassword` is checked only when given
// (the form sends it; a hosted API would not need it).
// Returns { errors: { field: message }, clean: trimmed values }.
export function validateNewUser(fields = {}) {
  const clean = {
    firstName: String(fields.firstName ?? "").trim(),
    lastName:  String(fields.lastName  ?? "").trim(),
    tag:       String(fields.tag       ?? "").trim(),
    username:  String(fields.username  ?? "").trim(),
  }
  const errors = {}
  const add = (field, msg) => { if (msg) errors[field] = msg }
  add("firstName", checkName(clean.firstName, "first name"))
  add("lastName",  checkName(clean.lastName,  "last name"))
  add("tag",       checkTag(clean.tag))
  add("username",  checkUsername(clean.username))
  add("password",  checkPassword(fields.password))
  if ("confirmPassword" in fields) add("confirmPassword", checkConfirm(fields.password, fields.confirmPassword))
  return { errors, clean }
}

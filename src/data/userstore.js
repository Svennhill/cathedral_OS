// userstore.js — user accounts (local-first, hosted-ready)
//
// HONEST NOTE ON SECURITY: this is local-first storage, and the password
// hashing here is obfuscation-grade, not real authentication. Accounts live
// in this browser's localStorage, where anyone with access to the device
// (or its dev tools) can read, copy, or delete them, and a single SHA-256
// round is fast to brute-force. What it does guarantee: a password is never
// stored or logged in plaintext — only SHA-256(salt + password), with a
// random salt per user.
//
// Real authentication arrives when the hosted database drops in behind this
// SAME API: createUser / verifyLogin / userExists / getUser (+ hasAnyUsers)
// keep their names, async shape, and result objects, so the login and
// create-user screens never need rebuilding — only this file changes.
//
// Registry, under the localStorage key "cosUsers":
//   { [usernameLower]: { username, firstName, lastName, tag, salt, hash, createdAt } }
// Only a public profile ever leaves this module — never salt or hash.

import { sha256Hex } from "./sha256"
import { validateNewUser, GENERIC_LOGIN_ERROR, USERNAME_TAKEN, LIMITS } from "./uservalidation"
import { userNamespace } from "./userprefs"

const REGISTRY_KEY = "cosUsers"
const STORAGE_ERROR = "couldn't save — storage on this device is full or blocked"

const isStr = (v) => typeof v === "string"

// Every record is checked on the way in, so a damaged or hand-edited
// registry can't crash the login screen; bad entries are just ignored.
function readRegistry() {
  let raw
  try { raw = localStorage.getItem(REGISTRY_KEY) } catch { return { ok: false, reg: {} } }
  let parsed
  try { parsed = raw ? JSON.parse(raw) : {} } catch { parsed = {} }
  const reg = {}
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    for (const [key, r] of Object.entries(parsed)) {
      if (r && isStr(r.username) && isStr(r.salt) && isStr(r.hash) && userNamespace(r.username) === key) {
        reg[key] = {
          username:  r.username,
          firstName: isStr(r.firstName) ? r.firstName : "",
          lastName:  isStr(r.lastName)  ? r.lastName  : "",
          tag:       isStr(r.tag)       ? r.tag       : "",
          salt: r.salt, hash: r.hash,
          createdAt: isStr(r.createdAt) ? r.createdAt : "",
        }
      }
    }
  }
  return { ok: true, reg }
}

function writeRegistry(reg) {
  try { localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg)); return true } catch { return false }
}

const publicProfile = (r) => ({
  username: r.username, firstName: r.firstName, lastName: r.lastName,
  tag: r.tag, createdAt: r.createdAt,
})

function newSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")
}

const hashPassword = (salt, password) => sha256Hex(salt + password)

// ── API ──────────────────────────────────────────────────────────────────

export async function userExists(username) {
  const key = userNamespace(username)
  return Boolean(key && readRegistry().reg[key])
}

export async function getUser(username) {
  const r = readRegistry().reg[userNamespace(username)]
  return r ? publicProfile(r) : null
}

// Drives the login screen's "no users yet" state
export async function hasAnyUsers() {
  return Object.keys(readRegistry().reg).length > 0
}

// fields: { firstName, lastName, tag, username, password }
// → { ok: true, user } | { ok: false, errors: { field | "form": message } }
export async function createUser(fields = {}) {
  const { confirmPassword: _ignored, ...rest } = fields   // a UI concern, not stored
  const { errors, clean } = validateNewUser(rest)
  const { ok, reg } = readRegistry()
  if (!ok) return { ok: false, errors: { ...errors, form: STORAGE_ERROR } }
  const key = userNamespace(clean.username)
  if (!errors.username && reg[key]) errors.username = USERNAME_TAKEN
  if (Object.keys(errors).length) return { ok: false, errors }

  const salt = newSalt()
  const record = {
    username:  clean.username,
    firstName: clean.firstName,
    lastName:  clean.lastName,
    tag:       clean.tag,
    salt,
    hash: await hashPassword(salt, fields.password),
    createdAt: new Date().toISOString(),
  }
  // Re-read right before writing so a second tab's new user isn't clobbered
  const latest = readRegistry().reg
  if (latest[key]) return { ok: false, errors: { username: USERNAME_TAKEN } }
  if (!writeRegistry({ ...latest, [key]: record })) return { ok: false, errors: { form: STORAGE_ERROR } }
  return { ok: true, user: publicProfile(record) }
}

// → { ok: true, user } | { ok: false, error }
// Unknown user and wrong password give the SAME message (and do the same
// hashing work), so the screen can't reveal which usernames exist.
const DUMMY_SALT = "0".repeat(32)
export async function verifyLogin(username, password) {
  const r = readRegistry().reg[userNamespace(username)]
  const pw = String(password ?? "")
  const hash = await hashPassword(r ? r.salt : DUMMY_SALT, pw.slice(0, LIMITS.PASSWORD_MAX))
  if (!r || !pw || pw.length > LIMITS.PASSWORD_MAX || hash !== r.hash) {
    return { ok: false, error: GENERIC_LOGIN_ERROR }
  }
  return { ok: true, user: publicProfile(r) }
}

// "First Last [tag]" — always rendered as React text, never as HTML
export function displayName(user) {
  if (!user) return ""
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username
  return user.tag ? `${name} [${user.tag}]` : name
}

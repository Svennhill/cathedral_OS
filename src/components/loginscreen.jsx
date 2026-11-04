// loginscreen.jsx — the login gate (screenState 'login')
//
// Boot ends with the cathedral picture up and "login" entered at the prompt;
// this screen keeps that picture (same full-frame art, same splash block in
// the same place, prompt gone) and draws one card over it. The card holds
// two modes, switched by the buttons along its bottom:
//   SIGN IN (default)  username + password → Login
//   CREATE USER        names, optional tag, username, password + confirm
// On a successful login the user is handed to App at once (their settings
// and case progress load), "access granted" shows, and the background_OS
// wipe that used to end the boot plays here instead — then the OS.
//
// Every error is shown in the card (never alert()); every user string is
// rendered as React text. All storage goes through data/userstore.js.
//
// Helper-character hooks (utils/eventbus.js): login.input / login.submit /
// login.modeSwitch are emitted here; the card is registered as the
// "loginForm" exclusion rect and the Create User button as the
// "createUserButton" target. This file keeps no timer of its own.
//
// phone / frame: the phone layout (utils/phoneLayout.js) and the screen
// area's size in px — the same props, art cover, and splash as PhoneBoot.

import { useState, useEffect, useLayoutEffect, useRef, useCallback, useId } from "react"
import { PCT } from "../utils/screenConstants"
import { screenArtCover } from "../utils/phoneLayout"
import { DesktopSplash, PhoneSplash } from "./bootscreen"
import { hasAnyUsers, userExists, createUser, verifyLogin } from "../data/userstore"
import {
  validateNewUser, LIMITS, PASSWORD_RULE, USERNAME_RULE,
  GENERIC_LOGIN_ERROR, USERNAME_TAKEN,
} from "../data/uservalidation"
import {
  emit, LOGIN_EVENTS,
  registerExclusion, unregisterExclusion, registerTarget, unregisterTarget,
} from "../utils/eventbus"

const GREEN = "#00ff41"
const DIM   = "#004d1a"
const BG    = "#050510"
const RED   = "#ff4444"
const FONT  = "opendyslexic, monospace"
const TITLE = "cathedral_OS v2.3"

const SIGNIN_FIELDS = ["username", "password"]
const CREATE_FIELDS = ["firstName", "lastName", "tag", "username", "password", "confirmPassword"]
const EMPTY_CREATE  = { firstName: "", lastName: "", tag: "", username: "", password: "", confirmPassword: "" }
const NAMES = {   // how a field is named in a summary message
  username: "username", password: "password", firstName: "first name", lastName: "last name",
  tag: "tag", confirmPassword: "confirm password",
}

const AUTOFILL_ANIMATION = "cosLoginAutofill"
const LOGIN_CSS = `
@keyframes ${AUTOFILL_ANIMATION} { from { opacity: 1; } to { opacity: 1; } }
.cos-login input:-webkit-autofill,
.cos-login input:-webkit-autofill:hover,
.cos-login input:-webkit-autofill:focus {
  animation-name: ${AUTOFILL_ANIMATION};
  animation-duration: 0.01s;
  -webkit-text-fill-color: ${GREEN};
  -webkit-box-shadow: 0 0 0 1000px ${BG} inset;
  caret-color: ${GREEN};
}
.cos-login input:focus { border-color: ${GREEN} !important; box-shadow: 0 0 6px rgba(0,255,65,0.45); }
.cos-login input[aria-invalid="true"]:focus { border-color: ${RED} !important; box-shadow: 0 0 6px rgba(255,68,68,0.45); }
.cos-login button { border-radius: 0 !important; transition: none; }
.cos-login button:hover { border-color: ${GREEN} !important; }
.cos-login button:not([data-primary]):hover { background-color: rgba(0,255,65,0.12) !important; }
.cos-login button:focus { outline: none; }
.cos-login button:focus-visible { outline: 1px solid ${GREEN} !important; outline-offset: 2px; }
`

// The visible part of rect r inside rect a (null when none of it shows)
function visiblePart(r, a) {
  if (!a) return r
  const left = Math.max(r.left, a.left), top = Math.max(r.top, a.top)
  const right = Math.min(r.right, a.right), bottom = Math.min(r.bottom, a.bottom)
  if (right <= left || bottom <= top) return null
  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

// ── FIELD ────────────────────────────────────────────────────────────────
// error: a message (shown under the field) or true (invalid, and the
// message is the card's alert — the generic sign-in error)
function Field({ id, name, label, help, error, alertId, phone, fs, inputRef, ...input }) {
  const helpId = help ? `${id}-help` : null
  const errId  = typeof error === "string" ? `${id}-err` : null
  const describedBy = [errId, error === true ? alertId : null, helpId].filter(Boolean).join(" ") || undefined
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
      <label htmlFor={id} style={{ color: GREEN, fontSize: phone ? 14 : "85%", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        ref={inputRef}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: phone ? 44 : undefined,
          padding: phone ? "8px 10px" : "3px 6px",
          background: "rgba(0,0,0,0.55)",
          border: `1px solid ${error ? RED : DIM}`,
          borderRadius: 0,
          outline: "none",
          color: GREEN,
          caretColor: GREEN,
          fontFamily: FONT,
          fontSize: phone ? 16 : fs,
          letterSpacing: "0.04em",
        }}
        {...input}
      />
      {help && (
        <div id={helpId} style={{ color: "rgba(0,255,65,0.62)", fontSize: phone ? 13 : "75%", lineHeight: 1.35 }}>
          {help}
        </div>
      )}
      {errId && (
        <div id={errId} style={{ color: RED, fontSize: phone ? 14 : "80%", lineHeight: 1.35 }}>
          {error}
        </div>
      )}
    </div>
  )
}

// ── LOGIN SCREEN ─────────────────────────────────────────────────────────
// onAuthenticated(user): called once, the moment a login succeeds
// onEnter(): called when the wipe into the OS has finished
export default function LoginScreen({ phone = false, frame = null, quote = "", onAuthenticated, onEnter }) {
  const uid = useId()
  const fid = (name) => `${uid}-${name}`
  const titleId = `${uid}-title`
  const alertId = `${uid}-alert`

  const [mode, setMode]             = useState("signin")
  const [usersExist, setUsersExist] = useState(null)        // null until checked
  const [signin, setSignin]         = useState({ username: "", password: "" })
  const [create, setCreate]         = useState(EMPTY_CREATE)
  const [errors, setErrors]         = useState({})          // field → message | true
  const [alert, setAlert]           = useState(null)        // { text, n } — red, announced
  const [status, setStatus]         = useState(null)        // { text, n } — green, announced
  const [busy, setBusy]             = useState(false)
  const [granted, setGranted]       = useState(null)        // the user, once signed in
  const [wipe, setWipe]             = useState(0)           // 0–1, background_OS wipe
  const [blink, setBlink]           = useState(true)
  const [focusReq, setFocusReq]     = useState(null)        // { name, n }

  const inputs  = useRef({})     // field name → element (plus "createUser")
  const cardRef = useRef(null)
  const areaRef = useRef(null)
  const alive   = useRef(false)
  const inFlight = useRef(false)   // one submit at a time, even within one tick
  const counter = useRef(0)
  const phoneAtMount = useRef(phone)
  const onAuthRef  = useRef(onAuthenticated)
  const onEnterRef = useRef(onEnter)
  useEffect(() => { onAuthRef.current = onAuthenticated; onEnterRef.current = onEnter })

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  const next = () => ++counter.current
  const requestFocus = (name) => setFocusReq({ name, n: next() })
  const say = (setter, text) => setter(text ? { text, n: next() } : null)

  // ── refs & helper-character registry ─────────────────────────────────
  const fieldRef = useCallback((el) => {
    if (!el) return
    const name = el.name
    inputs.current[name] = el
    return () => { if (inputs.current[name] === el) delete inputs.current[name] }
  }, [])

  const createButtonRef = useCallback((el) => {
    if (!el) return
    inputs.current.createUser = el
    registerTarget("createUserButton", el)
    return () => {
      unregisterTarget("createUserButton", el)
      if (inputs.current.createUser === el) delete inputs.current.createUser
    }
  }, [])

  // Focus lands where it's asked for, after the render that shows it
  useEffect(() => {
    if (!focusReq) return
    const el = inputs.current[focusReq.name]
    if (el) el.focus()
  }, [focusReq])

  // How many users exist decides sign-in vs the "no users yet" state.
  // Desktop: focus the first useful control. Phone: no autofocus, so the
  // keyboard doesn't jump over the picture before the person taps.
  useEffect(() => {
    let live = true
    hasAnyUsers()
      .catch(() => false)
      .then(any => {
        if (!live) return
        setUsersExist(any)
        if (!phoneAtMount.current) setFocusReq({ name: any ? "username" : "createUser", n: ++counter.current })
      })
    return () => { live = false }
  }, [])

  // Title cursor, as on the boot splash
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530)
    return () => clearInterval(t)
  }, [])

  // The card as an exclusion rect — kept current through resizes, scrolls,
  // mode switches, and errors appearing; dropped once the card goes
  const interactive = usersExist !== null && !granted
  useLayoutEffect(() => {
    const card = cardRef.current
    if (!interactive || !card) { unregisterExclusion("loginForm"); return }
    const area = areaRef.current
    const update = () => {
      const rect = visiblePart(card.getBoundingClientRect(), area?.getBoundingClientRect())
      if (rect) registerExclusion("loginForm", rect)
      else unregisterExclusion("loginForm")
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(card)
    if (area) ro.observe(area)
    window.addEventListener("resize", update)
    area?.addEventListener("scroll", update, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
      area?.removeEventListener("scroll", update)
    }
  }, [interactive, mode, phone, errors, alert, status])
  useEffect(() => () => unregisterExclusion("loginForm"), [])

  // ── after a successful login: "access granted", then the wipe ────────
  useEffect(() => {
    if (!granted) return
    let raf = 0
    let done = null
    const start = setTimeout(() => {
      const t0 = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - t0) / 1000, 1)
        setWipe(p)
        if (p < 1) raf = requestAnimationFrame(tick)
        else done = setTimeout(() => onEnterRef.current?.(), 100)
      }
      raf = requestAnimationFrame(tick)
    }, 700)
    return () => { clearTimeout(start); clearTimeout(done); cancelAnimationFrame(raf) }
  }, [granted])

  // ── events for the helper character ──────────────────────────────────
  // Field events only (keydown / input / paste / autofill) — never the
  // value, never mouse movement, focus, or clicks.
  const fieldEvent = (kind) => (e) => {
    if (e.target?.tagName !== "INPUT") return
    emit(LOGIN_EVENTS.INPUT, { mode, field: e.target.name, kind })
  }
  const onAutofill = (e) => {
    if (e.animationName === AUTOFILL_ANIMATION) fieldEvent("autofill")(e)
  }

  // ── mode switching ───────────────────────────────────────────────────
  const switchMode = (to) => {
    if (to === mode || busy || granted) return
    emit(LOGIN_EVENTS.MODE_SWITCH, { from: mode, to })
    setMode(to)
    setErrors({})
    say(setAlert, null)
    say(setStatus, null)
    if (to === "create") {
      setSignin(s => ({ ...s, password: "" }))
      requestFocus("firstName")
    } else {
      setCreate(c => ({ ...c, password: "", confirmPassword: "" }))
      requestFocus(!usersExist ? "createUser" : signin.username ? "password" : "username")
    }
  }

  // ── submitting ───────────────────────────────────────────────────────
  // Values are read from the inputs themselves, so a browser autofill that
  // never fired an input event still counts.
  const valueOf = (name, fallback) => inputs.current[name]?.value ?? fallback

  const showErrors = (errs, order) => {
    const bad = order.filter(f => errs[f])
    setErrors(errs)
    say(setStatus, null)
    if (errs.form) say(setAlert, errs.form)
    else if (bad.length === 1) say(setAlert, errs[bad[0]])
    else say(setAlert, `${bad.length} fields need attention: ${bad.map(f => NAMES[f]).join(", ")}`)
    if (bad.length) requestFocus(bad[0])
  }

  async function submitSignin() {
    if (!usersExist) { requestFocus("createUser"); return }
    const username = valueOf("username", signin.username).trim()
    const password = valueOf("password", signin.password)
    setSignin({ username, password })
    const errs = {}
    if (!username) errs.username = "enter your username"
    if (!password) errs.password = "enter your password"
    if (Object.keys(errs).length) return showErrors(errs, SIGNIN_FIELDS)

    setBusy(true)
    let res
    try { res = await verifyLogin(username, password) } catch { res = { ok: false } }
    if (!alive.current) return
    setBusy(false)
    if (!res.ok) {
      // One message for unknown user AND wrong password
      setErrors({ username: true, password: true })
      say(setStatus, null)
      say(setAlert, GENERIC_LOGIN_ERROR)
      setSignin({ username, password: "" })
      requestFocus("password")
      return
    }
    setErrors({})
    say(setAlert, null)
    setGranted(res.user)
    onAuthRef.current?.(res.user)
  }

  async function submitCreate() {
    const fields = Object.fromEntries(CREATE_FIELDS.map(f => [f, valueOf(f, create[f])]))
    setCreate(fields)
    const { errors: errs, clean } = validateNewUser(fields)

    setBusy(true)
    if (!errs.username) {
      try { if (await userExists(clean.username)) errs.username = USERNAME_TAKEN } catch { /* createUser re-checks */ }
    }
    if (!alive.current) return
    if (Object.keys(errs).length) { setBusy(false); return showErrors(errs, CREATE_FIELDS) }

    let res
    try {
      res = await createUser({ ...clean, password: fields.password })
    } catch {
      res = { ok: false, errors: { form: "couldn't create the user — try again" } }
    }
    if (!alive.current) return
    setBusy(false)
    if (!res.ok) return showErrors(res.errors, CREATE_FIELDS)

    // Created: back to sign-in with the username filled in — signing in
    // with the new password is the round trip that proves it was saved
    emit(LOGIN_EVENTS.MODE_SWITCH, { from: "create", to: "signin" })
    setMode("signin")
    setUsersExist(true)
    setCreate(EMPTY_CREATE)
    setErrors({})
    setSignin({ username: res.user.username, password: "" })
    say(setAlert, null)
    say(setStatus, `user ${res.user.username} created — enter the password to sign in`)
    requestFocus("password")
  }

  const onSubmit = (e) => {
    e.preventDefault()
    emit(LOGIN_EVENTS.SUBMIT, { mode })
    if (inFlight.current || granted) return
    inFlight.current = true
    const run = mode === "signin" ? submitSignin : submitCreate
    run().finally(() => { inFlight.current = false })
  }

  // ── layout ───────────────────────────────────────────────────────────
  const fw = frame?.w || 640
  const fh = frame?.h || 480
  const fs = phone ? 16 : Math.max(12, Math.min(16, Math.round(fh / 34)))
  const cardW = phone ? "100%"
    : mode === "create" ? Math.min(fw * 0.94, fs * 40) : Math.min(fw * 0.9, fs * 26)
  const twoCol = !phone && mode === "create" && typeof cardW === "number" && cardW >= fs * 30
  const wiping = wipe > 0

  const btn = (primary) => ({
    flex: phone ? "1 1 0" : "0 0 auto",
    minHeight: phone ? 44 : undefined,
    padding: phone ? "0 12px" : "4px 12px",
    background: primary ? GREEN : "transparent",
    color: primary ? BG : GREEN,
    border: `1px solid ${GREEN}`,
    borderRadius: 0,
    fontFamily: FONT,
    fontSize: phone ? 15 : "88%",
    fontWeight: "bold",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    whiteSpace: "nowrap",
  })

  const field = (name, label, props) => (
    <Field
      key={name}
      id={fid(name)}
      name={name}
      label={label}
      error={errors[name]}
      alertId={alertId}
      phone={phone}
      fs={fs}
      inputRef={fieldRef}
      spellCheck={false}
      {...props}
    />
  )
  const bindSignin = (name) => ({
    value: signin[name],
    onChange: e => setSignin(s => ({ ...s, [name]: e.target.value })),
  })
  const bindCreate = (name) => ({
    value: create[name],
    onChange: e => setCreate(c => ({ ...c, [name]: e.target.value })),
  })
  const noCaps = { autoCapitalize: "none", autoCorrect: "off" }

  const signinBody = usersExist === false ? (
    <div data-empty-state style={{ lineHeight: 1.5, color: GREEN }}>
      <div>No users on this device yet.</div>
      <div style={{ color: "rgba(0,255,65,0.72)" }}>
        Choose <strong>Create User</strong> below to make the first account. ↓
      </div>
    </div>
  ) : (
    <>
      {field("username", "Username", {
        ...bindSignin("username"), ...noCaps,
        type: "text", autoComplete: "username", maxLength: LIMITS.USERNAME_MAX,
      })}
      {field("password", "Password", {
        ...bindSignin("password"), ...noCaps,
        type: "password", autoComplete: "current-password", maxLength: LIMITS.PASSWORD_MAX,
      })}
    </>
  )

  const createBody = (
    <div style={{
      display: "grid",
      gridTemplateColumns: twoCol ? "1fr 1fr" : "1fr",
      columnGap: 10,
      rowGap: phone ? 12 : 8,
      alignItems: "start",
    }}>
      {field("firstName", "First name", {
        ...bindCreate("firstName"), type: "text", autoComplete: "given-name",
        autoCapitalize: "words", maxLength: LIMITS.NAME_MAX,
      })}
      {field("lastName", "Last name", {
        ...bindCreate("lastName"), type: "text", autoComplete: "family-name",
        autoCapitalize: "words", maxLength: LIMITS.NAME_MAX,
      })}
      {field("tag", "Tag (optional)", {
        ...bindCreate("tag"), ...noCaps, type: "text", autoComplete: "off",
        maxLength: LIMITS.TAG_MAX, help: "a short flourish shown after your name",
      })}
      {field("username", "Username", {
        ...bindCreate("username"), ...noCaps, type: "text", autoComplete: "username",
        maxLength: LIMITS.USERNAME_MAX, help: USERNAME_RULE,
      })}
      {field("password", "Password", {
        ...bindCreate("password"), ...noCaps, type: "password", autoComplete: "new-password",
        maxLength: LIMITS.PASSWORD_MAX, help: PASSWORD_RULE,
      })}
      {field("confirmPassword", "Confirm password", {
        ...bindCreate("confirmPassword"), ...noCaps, type: "password", autoComplete: "new-password",
        maxLength: LIMITS.PASSWORD_MAX,
      })}
    </div>
  )

  const card = (
    <form
      ref={cardRef}
      noValidate
      aria-labelledby={titleId}
      aria-busy={busy || undefined}
      data-login-card
      data-mode={mode}
      onSubmit={onSubmit}
      onKeyDown={fieldEvent("keydown")}
      onPaste={fieldEvent("paste")}
      onChange={fieldEvent("input")}
      onAnimationStart={onAutofill}
      style={{
        width: cardW,
        maxWidth: "100%",
        boxSizing: "border-box",
        margin: phone ? "14px 0 0" : "auto",
        padding: phone ? "12px 14px 14px" : `${Math.round(fs * 0.6)}px ${Math.round(fs * 0.9)}px`,
        background: "rgba(5,5,16,0.9)",
        border: `1px solid ${GREEN}`,
        borderRadius: 0,
        boxShadow: "0 0 12px rgba(0,255,65,0.25)",
        color: GREEN,
        fontFamily: FONT,
        fontSize: fs,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: phone ? 12 : Math.round(fs * 0.55),
        opacity: usersExist === null ? 0 : 1,
        transition: "opacity 0.25s ease-out",
        pointerEvents: "auto",
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8,
        borderBottom: `1px solid ${DIM}`, paddingBottom: phone ? 8 : 4,
      }}>
        <h2 id={titleId} style={{
          margin: 0, fontSize: phone ? 18 : "100%", fontWeight: "bold",
          letterSpacing: "0.14em", color: GREEN,
        }}>
          {"> "}{granted ? "ACCESS GRANTED" : mode === "signin" ? "SIGN IN" : "CREATE USER"}
        </h2>
        <span aria-hidden="true" style={{ fontSize: phone ? 12 : "70%", color: "rgba(0,255,65,0.5)", letterSpacing: "0.08em" }}>
          cathedral_OS
        </span>
      </div>

      {granted ? (
        <div role="status" style={{ lineHeight: 1.5 }}>
          welcome, {granted.firstName || granted.username}. loading your desktop…
        </div>
      ) : (
        <>
          {mode === "signin" ? signinBody : createBody}

          <div id={alertId} role="alert" style={{ color: RED, lineHeight: 1.4, fontSize: phone ? 15 : "90%" }}>
            {alert && <span key={alert.n}>{alert.text}</span>}
          </div>
          <div role="status" style={{ color: GREEN, lineHeight: 1.4, fontSize: phone ? 15 : "90%" }}>
            {status && <span key={status.n}>{status.text}</span>}
            {busy && <span>checking…</span>}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: phone ? 10 : 8 }}>
            {mode === "signin"
              ? (usersExist && (
                  <button key="login" type="submit" data-primary style={btn(true)}>
                    Login
                  </button>
                ))
              : (
                  <button
                    key="back"
                    type="button"
                    style={btn(false)}
                    onClick={e => { e.preventDefault(); switchMode("signin") }}
                  >
                    Back to sign in
                  </button>
                )}
            {/* One element in both modes: switches to CREATE USER from sign-in,
                submits the new user in CREATE USER mode. preventDefault keeps
                the switch click from also submitting once its type flips. */}
            <button
              key="create"
              ref={createButtonRef}
              name="createUser"
              type={mode === "create" ? "submit" : "button"}
              data-primary={mode === "create" || usersExist === false || undefined}
              style={btn(mode === "create" || usersExist === false)}
              onClick={mode === "signin" ? (e => { e.preventDefault(); switchMode("create") }) : undefined}
            >
              Create User
            </button>
          </div>
        </>
      )}
    </form>
  )

  const fullLayer = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }
  const screenBox = {
    position: "absolute",
    top:    `${PCT.top    * 100}%`,
    left:   `${PCT.left   * 100}%`,
    width:  `${PCT.width  * 100}%`,
    height: `${PCT.height * 100}%`,
    overflow: "hidden",
  }

  // ── PHONE ────────────────────────────────────────────────────────────
  if (phone && frame?.w && frame?.h) {
    const art = screenArtCover(frame.w, frame.h)
    // Same spacing as PhoneBoot, so the splash doesn't move at handoff
    const pad = Math.round(Math.max(10, Math.min(frame.w, frame.h) * 0.035))
    const top = Math.round(Math.max(pad, frame.h * 0.04))
    return (
      <div className="cos-login" style={{ ...fullLayer, zIndex: 150, pointerEvents: "none" }}>
        <style>{LOGIN_CSS}</style>
        <div style={screenBox}>
          <div style={{ ...fullLayer, zIndex: 0 }}><img src="/boot/boot_background.png" alt="" style={art} /></div>
          <div style={{ ...fullLayer, zIndex: 1 }}><img src="/boot/boot_cathedral.png" alt="" style={art} /></div>
          {wiping && (
            <div style={{ ...fullLayer, zIndex: 2, clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)` }}>
              <img src="/OS/background_OS.png" alt="" style={art} />
            </div>
          )}
          {!wiping && (
            <div ref={areaRef} style={{
              ...fullLayer,
              zIndex: 10,
              overflowX: "hidden",
              overflowY: "auto",
              boxSizing: "border-box",
              padding: `${top}px ${pad}px ${pad}px`,
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto",
            }}>
              <PhoneSplash
                frame={frame} position="static" splashText={TITLE} quoteText={quote}
                blink={blink} command="" promptOut
              />
              {card}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── DESKTOP (and Screen Only) ────────────────────────────────────────
  // Art and splash in % of the full-bezel layer, exactly as BootScreen
  // draws them; the card lives in the screen area, below the splash
  // (which ends 19% down the layer — ~12.5% down the screen).
  const img = (z) => ({ ...fullLayer, objectFit: "fill", zIndex: z })
  return (
    <div className="cos-login" style={{ ...fullLayer, zIndex: 150, pointerEvents: "none", fontFamily: "monospace", fontSize: 11 }}>
      <style>{LOGIN_CSS}</style>
      <img src="/boot/boot_background.png" alt="" style={img(0)} />
      <img src="/boot/boot_cathedral.png" alt="" style={img(1)} />
      {wiping && (
        <img src="/OS/background_OS.png" alt="" style={{ ...img(2), clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)` }} />
      )}
      {!wiping && (
        <DesktopSplash splashText={TITLE} quoteText={quote} blink={blink} command="" promptOut />
      )}
      {!wiping && (
        <div style={{ ...screenBox, zIndex: 20 }}>
          <div ref={areaRef} style={{
            position: "absolute",
            top: "14%", left: 0, right: 0, bottom: 0,
            overflowX: "hidden",
            overflowY: "auto",
            boxSizing: "border-box",
            padding: Math.round(fs * 0.6),
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
          }}>
            {card}
          </div>
        </div>
      )}
    </div>
  )
}

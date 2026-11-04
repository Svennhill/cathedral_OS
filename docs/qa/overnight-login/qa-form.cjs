// qa-form.cjs — the login card itself, against `npm run dev` (the dev-only
// debug panel's new 'login' button jumps straight to the gate):
// empty state, every validation path through the real form, the generic
// sign-in error, focus, labels, aria-live, Enter-to-submit, and the
// helper-character hooks (events + exclusion/target registry).
const L = require('./qa-lib.cjs')
const BASE = process.env.QA_DEV || 'http://localhost:5173'

;(async () => {
  const { browser, page, errors } = await L.launch()
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  const jump = async (s) => { await page.locator('button', { hasText: new RegExp(`^${s}$`) }).first().click(); await page.waitForTimeout(400) }

  // Record bus traffic from the moment the page loads
  await page.evaluate(async () => {
    const bus = await import('/src/utils/eventbus.js')
    window.__bus = bus
    window.__ev = []
    for (const n of ['login.input', 'login.submit', 'login.modeSwitch', 'registry.exclusion', 'registry.target']) {
      bus.on(n, d => window.__ev.push({ n, d: n === 'registry.target' ? { id: d.id, el: d.el ? d.el.textContent : null } : d }))
    }
  })
  const events = (name) => page.evaluate((n) => window.__ev.filter(e => e.n === n), name)
  const clearEv = () => page.evaluate(() => { window.__ev = [] })
  const excl = () => page.evaluate(() => {
    const r = window.__bus.getExclusions().get('loginForm')
    const c = document.querySelector('form[data-login-card]')?.getBoundingClientRect()
    return { r, c: c ? { top: c.top, left: c.left, width: c.width, height: c.height } : null }
  })
  const rectMatches = ({ r, c }) => r && c && Math.abs(r.top - c.top) < 1 && Math.abs(r.left - c.left) < 1 && Math.abs(r.width - c.width) < 1 && Math.abs(r.height - c.height) < 1
  const target = () => page.evaluate(() => {
    const el = window.__bus.getTargets().get('createUserButton')
    return el ? { text: el.textContent.trim(), connected: el.isConnected, isCardButton: !!el.closest('form[data-login-card]') } : null
  })
  const c = L.card(page)

  // ── EMPTY STATE ─────────────────────────────────────────────────────────
  await jump('login')
  L.check('zero users: empty state says so and points at Create User', /No users on this device yet/.test(await c.innerText()) && /Create User/.test(await c.locator('[data-empty-state]').innerText()))
  L.check('zero users: no sign-in fields, no Login button', (await c.locator('input').count()) === 0 && (await c.getByRole('button', { name: 'Login' }).count()) === 0)
  L.check('zero users: focus lands on Create User', (await L.focusedLabel(page)) === 'BUTTON:Create User', await L.focusedLabel(page))
  await L.shot(page, 'desktop-1-empty-state.png')

  L.check('hook: card registered as exclusion "loginForm" (matches the card rect)', rectMatches(await excl()))
  const t1 = await target()
  L.check('hook: Create User button registered as target "createUserButton"', t1 && t1.text === 'Create User' && t1.connected && t1.isCardButton, JSON.stringify(t1))

  // Mouse movement emits nothing
  await clearEv()
  const box = await c.boundingBox()
  for (let i = 0; i < 25; i++) await page.mouse.move(box.x + (i * 13) % box.width, box.y + (i * 7) % box.height)
  L.check('hook: mouse movement emits no login.* events', (await page.evaluate(() => window.__ev.filter(e => e.n.startsWith('login.')).length)) === 0)

  // ── MODE SWITCH ─────────────────────────────────────────────────────────
  const beforeH = (await excl()).r.height
  await page.keyboard.press('Enter')   // Enter on the focused Create User button
  await page.waitForTimeout(150)
  L.check('Enter on Create User switches to CREATE USER (no submit)', (await c.getAttribute('data-mode')) === 'create' && (await events('login.submit')).length === 0)
  const ms = await events('login.modeSwitch')
  L.check('hook: login.modeSwitch emitted {signin → create}', ms.length === 1 && ms[0].d.from === 'signin' && ms[0].d.to === 'create', JSON.stringify(ms))
  L.check('focus on mode switch → First name', (await L.focusedLabel(page)) === 'First name')
  const ex2 = await excl()
  L.check('hook: exclusion rect updated on mode switch', rectMatches(ex2) && ex2.r.height > beforeH, `${beforeH} → ${ex2.r.height}`)
  L.check('hook: target is the same Create User element after the switch', JSON.stringify(await target()) === JSON.stringify(t1))
  const labelsOk = await page.evaluate(() => [...document.querySelectorAll('form[data-login-card] input')].every(i => document.querySelector(`label[for="${i.id}"]`)))
  L.check('create mode: every field has a <label for>', labelsOk && (await c.locator('input').count()) === 6)
  const pwHelp = await page.evaluate(() => {
    const i = document.querySelector('form[data-login-card] input[name="password"]')
    return (i.getAttribute('aria-describedby') || '').split(' ').map(id => document.getElementById(id)?.textContent).join(' | ')
  })
  L.check('password rule shown as helper text under the field (and described-by)', /8\+ characters, with a lowercase letter, an uppercase letter, and a number or symbol/.test(pwHelp), pwHelp)

  // ── EMPTY SUBMIT ────────────────────────────────────────────────────────
  await clearEv()
  await c.getByLabel('First name').press('Enter')
  await page.waitForTimeout(150)
  L.check('hook: login.submit emitted on an invalid create attempt', (await events('login.submit')).length === 1 && (await events('login.submit'))[0].d.mode === 'create')
  const a0 = await L.alertText(page)
  L.check('empty create: alert names the 5 required fields', a0 === '5 fields need attention: first name, last name, username, password, confirm password', a0)
  L.check('empty create: focus on the first invalid field (First name)', (await L.focusedLabel(page)) === 'First name')
  const fe = await L.fieldError(page, 'First name')
  L.check('empty create: field shows its own message + aria-invalid', fe.invalid && fe.text === 'enter a first name', JSON.stringify(fe))
  L.check('alert region is role=alert (aria-live)', (await c.locator('[role="alert"]').count()) === 1)
  L.check('tag is optional (no error when blank)', !(await L.fieldError(page, 'Tag (optional)')).invalid)
  await L.shot(page, 'desktop-2-create-errors.png')

  // ── FIELD EVENTS ────────────────────────────────────────────────────────
  await clearEv()
  await c.getByLabel('First name').pressSequentially('St3ven', { delay: 10 })
  const inp = await events('login.input')
  L.check('hook: login.input on keydown + input for each keystroke', inp.some(e => e.d.kind === 'keydown') && inp.some(e => e.d.kind === 'input') && inp.every(e => e.d.field === 'firstName'), `${inp.length} events`)
  L.check('hook: login.input never carries the value', inp.every(e => !('value' in e.d) && !JSON.stringify(e.d).includes('St3ven')))
  await clearEv()
  await page.evaluate(() => {
    const el = document.querySelector('form[data-login-card] input[name="lastName"]')
    const dt = new DataTransfer(); dt.setData('text/plain', 'Hildreth')
    el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }))
    el.dispatchEvent(new AnimationEvent('animationstart', { bubbles: true, animationName: 'cosLoginAutofill' }))
  })
  const pe = await events('login.input')
  L.check('hook: login.input on paste and on autofill', pe.some(e => e.d.kind === 'paste') && pe.some(e => e.d.kind === 'autofill'), JSON.stringify(pe.map(e => e.d.kind)))
  await clearEv()
  await c.getByRole('button', { name: 'Create User' }).focus()
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab')
  L.check('hook: keys on buttons (not fields) emit no login.input', (await events('login.input')).length === 0)

  // ── VALIDATION THROUGH THE FORM ─────────────────────────────────────────
  const submitCreate = async (u) => { await L.createUserVia(page, u); await page.waitForTimeout(150) }
  await submitCreate({ firstName: 'St3ven', lastName: 'Hildreth', username: 'steven', password: 'Passw0rd' })
  L.check('first name with a digit → its own message', (await L.fieldError(page, 'First name')).text === 'first name: letters, spaces, hyphens, and apostrophes only')
  L.check('focus on error → the invalid field', (await L.focusedLabel(page)) === 'First name')
  await submitCreate({ firstName: 'Steven', lastName: 'Hildreth', username: 'steven', password: 'Passw0rd', confirm: 'Passw0rD' })
  L.check('confirm mismatch blocked', (await L.fieldError(page, 'Confirm password')).text === "passwords don't match" && (await L.focusedLabel(page)) === 'Confirm password')
  for (const [pw, want] of [
    ['Abcde1!', 'password needs at least 8 characters'],
    ['alllowercase1', 'password needs an uppercase letter'],
    ['ALLUPPER1', 'password needs a lowercase letter'],
    ['NoDigitsHere', 'password needs a number or symbol'],
  ]) {
    await submitCreate({ firstName: 'Steven', lastName: 'Hildreth', username: 'steven', password: pw })
    L.check(`password rule fails in the form: "${pw}"`, (await L.fieldError(page, 'Password')).text === want, (await L.fieldError(page, 'Password')).text)
  }
  for (const u of ['ab', 'bad name', 'shithead', 'FuCk_it', 'b1tch_please']) {
    await submitCreate({ firstName: 'Steven', lastName: 'Hildreth', username: u, password: 'Passw0rd' })
    const fe2 = await L.fieldError(page, 'Username')
    L.check(`username "${u}" rejected in the form`, fe2.invalid && fe2.text.length > 0, fe2.text)
  }
  L.check('profanity message', (await L.fieldError(page, 'Username')).text === "that username isn't allowed — choose another")

  // Storage full/blocked → an in-form message, not a crash or an alert()
  let dialogs = 0
  page.on('dialog', d => { dialogs++; d.dismiss() })
  await page.evaluate(() => { window.__realSet = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError') } })
  await submitCreate({ firstName: 'Steven', lastName: 'Hildreth', username: 'steven', password: 'Passw0rd!' })
  await page.evaluate(() => { Storage.prototype.setItem = window.__realSet })
  L.check('storage full/blocked → message in the form (no alert dialog), still in CREATE USER', (await L.alertText(page)) === "couldn't save — storage on this device is full or blocked" && (await c.getAttribute('data-mode')) === 'create' && dialogs === 0, await L.alertText(page))

  // A good one → back to sign-in, username filled, focus on password
  await clearEv()
  await submitCreate({ firstName: 'Steven', lastName: 'Hildreth', tag: 'the Skeptic', username: 'Steven', password: 'Passw0rd!' })
  await page.waitForTimeout(200)
  L.check('valid create (Passw0rd! passes) → SIGN IN mode', (await c.getAttribute('data-mode')) === 'signin')
  L.check('created: username prefilled, password empty, focus on Password', (await c.getByLabel('Username', { exact: true }).inputValue()) === 'Steven' && (await c.getByLabel('Password', { exact: true }).inputValue()) === '' && (await L.focusedLabel(page)) === 'Password')
  const st = (await c.locator('[role="status"]').first().innerText()).trim()
  L.check('created: status line announces it (role=status)', st === 'user Steven created — enter the password to sign in', st)
  L.check('hook: auto switch back emits login.modeSwitch {create → signin}', (await events('login.modeSwitch')).some(e => e.d.from === 'create' && e.d.to === 'signin'))
  await L.shot(page, 'desktop-3-created.png')

  // Duplicate (case-insensitive) via the form
  await c.getByRole('button', { name: 'Create User' }).click()
  await submitCreate({ firstName: 'Other', lastName: 'Person', username: 'STEVEN', password: 'Passw0rd!' })
  L.check('duplicate username (other case) → "that username is taken"', (await L.fieldError(page, 'Username')).text === 'that username is taken' && (await L.focusedLabel(page)) === 'Username')
  await L.shot(page, 'desktop-4-username-taken.png')
  await c.getByRole('button', { name: 'Back to sign in' }).click()
  await page.waitForTimeout(150)
  L.check('Back → SIGN IN; username still filled → focus on Password', (await c.getAttribute('data-mode')) === 'signin' && (await L.focusedLabel(page)) === 'Password', await L.focusedLabel(page))
  const signLabels = await page.evaluate(() => [...document.querySelectorAll('form[data-login-card] input')].every(i => document.querySelector(`label[for="${i.id}"]`)))
  L.check('sign-in mode: every field has a <label for>', signLabels && (await c.locator('input').count()) === 2)

  // Keyboard order: Username → Password → Login → Create User
  await c.getByLabel('Username', { exact: true }).focus()
  const order = []
  for (let i = 0; i < 4; i++) { order.push(await L.focusedLabel(page)); await page.keyboard.press('Tab') }
  L.check('Tab order: Username → Password → Login → Create User', order.join(' > ') === 'Username > Password > BUTTON:Login > BUTTON:Create User', order.join(' > '))

  // ── SIGN IN ─────────────────────────────────────────────────────────────
  await clearEv()
  await c.getByLabel('Username', { exact: true }).fill('')
  await c.getByRole('button', { name: 'Login' }).click()
  await page.waitForTimeout(150)
  L.check('sign in with both fields empty → per-field messages, focus Username', (await L.fieldError(page, 'Username')).text === 'enter your username' && (await L.fieldError(page, 'Password')).text === 'enter your password' && (await L.focusedLabel(page)) === 'Username')
  L.check('hook: login.submit on a sign-in attempt', (await events('login.submit')).some(e => e.d.mode === 'signin'))
  await L.signIn(page, 'steven', 'wrong-Passw0rd')
  await page.waitForTimeout(200)
  const g1 = await L.alertText(page)
  L.check('wrong password → "username or password not recognized" (Enter submitted)', g1 === 'username or password not recognized', g1)
  L.check('after error: password cleared, focus on Password, both fields aria-invalid', (await c.getByLabel('Password', { exact: true }).inputValue()) === '' && (await L.focusedLabel(page)) === 'Password' && (await L.fieldError(page, 'Username')).invalid && (await L.fieldError(page, 'Password')).invalid)
  await L.shot(page, 'desktop-5-generic-error.png')
  await L.signIn(page, 'nobody_here', 'Passw0rd!')
  await page.waitForTimeout(200)
  const g2 = await L.alertText(page)
  L.check('unknown user → the identical generic message', g2 === g1, g2)
  await L.signIn(page, 'steven', 'passw0rd!')
  await page.waitForTimeout(200)
  L.check('password is case-sensitive → generic message', (await L.alertText(page)) === g1)
  const pwInEvents = await page.evaluate(() => JSON.stringify(window.__ev).includes('Passw0rd'))
  L.check('hook: no password text ever in any bus event', !pwInEvents)

  // Resize → exclusion follows
  await page.setViewportSize({ width: 1100, height: 760 })
  await page.waitForTimeout(300)
  L.check('hook: exclusion rect follows a window resize', rectMatches(await excl()))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(300)

  // Right password (username in another case) → granted → wipe → OS
  await clearEv()
  await L.signIn(page, '  STEVEN', 'Passw0rd!')
  await page.waitForTimeout(250)
  L.check('right password → ACCESS GRANTED', /ACCESS GRANTED/.test(await c.innerText()))
  await L.shot(page, 'desktop-6-access-granted.png')
  // Sample the wipe: background_OS revealed top-down over the cathedral
  const seen = []
  let wipeShot = false
  for (let i = 0; i < 60 && seen.length < 40; i++) {
    const clip = await page.evaluate(() => document.querySelector('.cos-login img[src="/OS/background_OS.png"]')?.style.clipPath ?? null)
    if (clip) {
      const pct = parseFloat(clip.split(' ')[2])
      seen.push(pct)
      if (!wipeShot && pct < 60 && pct > 30) { wipeShot = true; await L.shot(page, 'desktop-7-wipe.png') }
    } else if (seen.length) break
    await page.waitForTimeout(40)
  }
  L.check('the background_OS wipe plays over the cathedral (login → OS transition)', seen.length > 3 && seen[0] > seen[seen.length - 1], `uncovered % sampled: ${seen.map(Math.round).join(',')}`)
  L.check('reaches the OS after the wipe', await L.waitForState(page, 'on', 4000))
  const reg = await page.evaluate(() => ({ ex: window.__bus.getExclusions().has('loginForm'), tg: window.__bus.getTargets().has('createUserButton') }))
  L.check('hook: exclusion + target unregistered once the form is gone', !reg.ex && !reg.tg)
  L.check('no page errors', errors.length === 0, errors.join(' | '))

  await page.evaluate(() => localStorage.clear())
  await browser.close()
  process.exit(L.summary() ? 1 : 0)
})()

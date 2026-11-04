// qa-phone.cjs — the gate in the phone layout and in Screen Only, on the
// PRODUCTION build (`npm run preview`): iPhone portrait (Screen Only by
// default), iPhone landscape, a phone with the bezel showing, and desktop
// Screen Only. Touch sizes, 16px inputs, scroll reach, tap-through.
const L = require('./qa-lib.cjs')
const { devices } = require('playwright')
const BASE = process.env.QA_PROD || 'http://localhost:4173'
const U = { firstName: 'Pat', lastName: 'Phone', tag: '✝', username: 'pat_phone', password: 'Touch-Screen9' }

async function sizes(page) {
  return page.evaluate(() => {
    const c = document.querySelector('form[data-login-card]')
    const frameEl = c.closest('div[style*="overflow: hidden"]')
    const inputs = [...c.querySelectorAll('input')].map(i => { const r = i.getBoundingClientRect(); return { h: Math.round(r.height), fs: getComputedStyle(i).fontSize } })
    const buttons = [...c.querySelectorAll('button')].map(b => Math.round(b.getBoundingClientRect().height))
    const cr = c.getBoundingClientRect(), fr = frameEl.getBoundingClientRect()
    return { inputs, buttons, insideX: cr.left >= fr.left - 1 && cr.right <= fr.right + 1, cardW: Math.round(cr.width), frameW: Math.round(fr.width) }
  })
}

;(async () => {
  // ── iPHONE PORTRAIT ─────────────────────────────────────────────────────
  {
    const { browser, page, errors } = await L.launch({ device: devices['iPhone 13'] })
    await page.goto(BASE + '/')
    await page.evaluate(() => localStorage.clear()); await page.reload()
    L.check('phone portrait: starts in Screen Only (own POWER button)', await page.getByRole('button', { name: 'Power on' }).count() === 1)
    await page.getByRole('button', { name: 'Power on' }).tap()
    await L.finishVideo(page, '/fx/crt_on.mp4')
    let sawCmd = false
    for (let i = 0; i < 300 && (await L.domState(page)) !== 'login'; i++) {
      if (!sawCmd && /> login/.test(await page.evaluate(() => document.querySelector('[data-boot-splash]')?.innerText || ''))) {
        sawCmd = true; await L.shot(page, 'phone-1-prompt-login.png')
      }
      await page.waitForTimeout(150)
    }
    await page.waitForTimeout(400)
    L.check('phone: PhoneBoot types "login" at the prompt, then hands off to the gate', sawCmd && (await L.domState(page)) === 'login')
    L.check('phone: no autofocus (keyboard does not jump up on arrival)', (await L.focusedLabel(page)) === 'BODY:' || !(await page.evaluate(() => document.activeElement?.closest('form'))))
    await L.shot(page, 'phone-2-empty-state.png')
    const c = L.card(page)
    await c.getByRole('button', { name: 'Create User' }).tap()
    await page.waitForTimeout(200)
    let z = await sizes(page)
    L.check('phone: every input ≥ 44px tall and 16px text (no iOS focus zoom)', z.inputs.every(i => i.h >= 44 && i.fs === '16px'), JSON.stringify(z.inputs))
    L.check('phone: every button ≥ 44px tall', z.buttons.every(h => h >= 44), JSON.stringify(z.buttons))
    L.check('phone: card fits the screen width', z.insideX, `${z.cardW} in ${z.frameW}`)
    await c.getByRole('button', { name: 'Create User' }).tap()   // empty submit
    await page.waitForTimeout(200)
    L.check('phone: errors shown in the form, focus on first invalid field', (await L.alertText(page)).startsWith('5 fields need attention') && (await L.focusedLabel(page)) === 'First name')
    await L.shot(page, 'phone-3-create-errors.png')
    for (const [label, v] of [['First name', U.firstName], ['Last name', U.lastName], ['Tag (optional)', U.tag], ['Username', U.username], ['Password', U.password], ['Confirm password', U.password]]) {
      const f = c.getByLabel(label, { exact: true }); await f.tap(); await f.fill(v)
    }
    await L.shot(page, 'phone-4-create-filled.png')
    await c.getByRole('button', { name: 'Create User' }).tap()   // scrolled into reach by the area
    await page.waitForTimeout(300)
    L.check('phone: create → sign in, username filled', (await c.getAttribute('data-mode')) === 'signin' && (await c.getByLabel('Username', { exact: true }).inputValue()) === U.username)
    await c.getByLabel('Password', { exact: true }).fill(U.password)
    await L.shot(page, 'phone-5-signin.png')
    await c.getByRole('button', { name: 'Login' }).tap()
    L.check('phone: sign in → OS', await L.waitForState(page, 'on', 6000))
    await page.waitForTimeout(300)
    await page.tap('[data-cos-start]')
    await page.waitForTimeout(200)
    const lo = await page.evaluate(() => { const b = document.querySelector('[data-logout]'); const r = b.getBoundingClientRect(); return { h: Math.round(r.height), line: document.querySelector('[data-user-line]').innerText.replace(/\s+/g, ' ') } })
    L.check('phone: start menu shows the user (tag as flourish) + touch-size Log out', lo.line.includes('Pat Phone [✝]') && lo.line.includes('@pat_phone') && lo.h >= 40, JSON.stringify(lo))
    await L.shot(page, 'phone-6-startmenu-user.png')

    // Phone with the bezel showing (Screen Only turned off for the session)
    await page.locator('[data-section="settings"]').tap()
    await page.locator('[data-start-menu] label', { hasText: /^Screen Only \(this session\)/ }).locator('input').tap()
    await page.waitForTimeout(300)
    if (!(await page.$('[data-start-menu]'))) await page.tap('[data-cos-start]')
    await page.waitForTimeout(200)
    await page.tap('[data-logout]')
    await page.waitForTimeout(500)
    L.check('phone + bezel: logout lands on the gate, still in bezel view', (await L.domState(page)) === 'login' && (await page.getByRole('button', { name: 'Power on' }).count()) === 0)
    await L.shot(page, 'phone-7-bezel-gate.png')
    const pw = c.getByLabel('Password', { exact: true })
    await pw.scrollIntoViewIfNeeded()
    L.check('phone + bezel: password field reachable (the card scrolls inside the small screen)', await pw.isVisible())
    await c.getByLabel('Username', { exact: true }).fill(U.username)
    await pw.fill(U.password)
    await pw.press('Enter')
    L.check('phone + bezel: sign in works', await L.waitForState(page, 'on', 6000))
    L.check('phone portrait: no page errors', errors.length === 0, errors.join(' | '))
    await browser.close()
  }

  // ── iPHONE LANDSCAPE ────────────────────────────────────────────────────
  {
    const { browser, page, errors } = await L.launch({ device: devices['iPhone 13 landscape'] })
    await page.goto(BASE + '/')
    await page.evaluate((u) => { localStorage.clear() }, U); await page.reload()
    const b = await L.bootToLogin(page)
    L.check('phone landscape: boots to the gate', b.ok)
    const c = L.card(page)
    await c.getByRole('button', { name: 'Create User' }).tap()
    await page.waitForTimeout(200)
    await L.shot(page, 'phone-8-landscape-create.png')
    const area = await page.evaluate(() => { const a = document.querySelector('form[data-login-card]').parentElement; return { scrollH: a.scrollHeight, clientH: a.clientHeight, oy: getComputedStyle(a).overflowY } })
    L.check('phone landscape: the form area scrolls when the card is taller than the screen', area.oy === 'auto' && area.scrollH > area.clientH, JSON.stringify(area))
    for (const [label, v] of [['First name', 'Lan'], ['Last name', 'Scape'], ['Username', 'landscape'], ['Password', 'Wide-Screen1'], ['Confirm password', 'Wide-Screen1']]) {
      await c.getByLabel(label, { exact: true }).fill(v)
    }
    await c.getByLabel('Confirm password').press('Enter')
    await page.waitForTimeout(300)
    await c.getByLabel('Password', { exact: true }).fill('Wide-Screen1')
    await c.getByLabel('Password', { exact: true }).press('Enter')
    L.check('phone landscape: create + sign in → OS', await L.waitForState(page, 'on', 6000))
    L.check('phone landscape: no page errors', errors.length === 0, errors.join(' | '))
    await browser.close()
  }

  // ── DESKTOP SCREEN ONLY ─────────────────────────────────────────────────
  {
    const { browser, page, errors } = await L.launch({ viewport: { width: 1280, height: 800 } })
    await page.goto(BASE + '/')
    await page.evaluate(() => localStorage.clear()); await page.reload()
    const b = await L.bootToLogin(page)
    L.check('desktop: boots to the gate in bezel view (no user → device default)', b.ok && (await page.getByRole('button', { name: 'Power on' }).count()) === 0)
    await L.createUserVia(page, { firstName: 'Sol', lastName: 'Only', username: 'screen_only', password: 'Only-Screen1' })
    await L.signIn(page, 'screen_only', 'Only-Screen1')
    await L.waitForState(page, 'on', 6000)
    await page.click('[data-cos-start]'); await page.click('[data-section="settings"]')
    await page.locator('[data-start-menu] label', { hasText: /^Always load Screen Only/ }).locator('input').click()
    await page.waitForTimeout(300)
    if (!(await page.$('[data-start-menu]'))) await page.click('[data-cos-start]')
    await page.click('[data-logout]')
    await page.waitForTimeout(500)
    const box = await L.card(page).boundingBox()
    L.check('desktop Screen Only: logout keeps Screen Only; the gate fills the window', (await L.domState(page)) === 'login' && box.width > 300, JSON.stringify(box))
    await L.shot(page, 'desktop-8-screen-only-gate.png')
    await L.signIn(page, 'SCREEN_ONLY', 'Only-Screen1')
    L.check('desktop Screen Only: sign in works (Enter)', await L.waitForState(page, 'on', 6000))
    const s = await page.evaluate(() => localStorage.getItem('cos:screen_only:alwaysScreenOnly'))
    L.check('"Always load Screen Only" saved for that user only', s === 'true')
    L.check('desktop Screen Only: no page errors', errors.length === 0, errors.join(' | '))
    await browser.close()
  }
  process.exit(L.summary() ? 1 : 0)
})()

// qa-debug.cjs — the passcode-gated debug panel, against `npm run dev`
// (where the panel is always present): its 'login' button, its 'on' button
// (which DOES bypass the gate — documented, by design), what an OS session
// with no user does (saves nothing), and loop mode's boot-to-target behavior.
const L = require('./qa-lib.cjs')
const BASE = process.env.QA_DEV || 'http://localhost:5173'

;(async () => {
  const { browser, page, errors } = await L.launch()
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.clear()); await page.reload()
  const panelBtn = (s) => page.locator('button', { hasText: new RegExp(`^(► |  )?${s}$`) }).first()
  const panelState = async () => (await page.getByText(/^state: /).innerText()).replace('state: ', '')

  L.check("panel lists 'login' among the state jumps", (await page.locator('button', { hasText: /^login$/ }).count()) === 1)
  await panelBtn('login').click(); await page.waitForTimeout(300)
  L.check("panel 'login' → the gate", (await L.domState(page)) === 'login' && (await panelState()) === 'login')

  // The bypass: 'on' with nobody signed in
  await panelBtn('on').click(); await page.waitForTimeout(400)
  L.check("panel 'on' BYPASSES the gate (dev tool, by design)", (await L.domState(page)) === 'on')
  await page.click('[data-cos-start]')
  L.check("no-user OS: start menu says 'not signed in (debug)'", /not signed in \(debug\)/.test(await page.locator('[data-user-line]').innerText()))
  await page.click('[data-section="settings"]')
  await page.locator('[data-start-menu] label', { hasText: /^Greyscale/ }).locator('input').click()
  await page.click('[data-start-menu] button[aria-label="Desktop zoom in"]')
  await page.waitForTimeout(200)
  L.check('no-user OS: changing settings writes nothing to storage', (await page.evaluate(() => localStorage.length)) === 0)
  await page.click('[data-logout]'); await page.waitForTimeout(400)
  L.check('no-user OS: Log out → the gate, defaults restored', (await L.domState(page)) === 'login' && !(await page.evaluate(() => document.querySelector('.cos-viewport').style.filter)))

  // Loop mode, target 'booting': boot → boot → … (never the gate)
  await panelBtn('off').click(); await page.waitForTimeout(300)
  await page.locator('button', { hasText: /^loop: OFF$/ }).click()
  L.check("loop default target is 'booting'", /loops back to booting/.test(await page.locator('body').innerText()))
  await L.pressPower(page)
  await L.finishVideo(page, '/fx/crt_on.mp4')
  let sawCmd = false, reboot = false, sawGate = false
  const t0 = Date.now()
  while (Date.now() - t0 < 70000) {
    const st = await L.domState(page)
    if (st === 'login') sawGate = true
    const txt = await page.evaluate(() => document.body.innerText)
    if (/> login/.test(txt)) sawCmd = true
    if (sawCmd && /RELIQUARY 316J-SVU/.test(txt)) { reboot = true; break }
    await page.waitForTimeout(120)
  }
  L.check("loop → 'booting': the boot ends and restarts (the gate never shows)", reboot && !sawGate, `cmd ${sawCmd} reboot ${reboot} gate ${sawGate}`)

  // Switch the loop target to 'on' mid-loop: this boot ends in the OS
  await page.locator('button', { hasText: /^ {2}on$/ }).click()
  L.check("loop target → 'on'", /loops back to on/.test(await page.locator('body').innerText()))
  L.check("loop → 'on': boot goes straight to the OS (existing boot-to-target behavior)", await L.waitForState(page, 'on', 60000))
  L.check('no page errors', errors.length === 0, errors.join(' | '))
  await browser.close()
  process.exit(L.summary() ? 1 : 0)
})()

// qa-flows.cjs — end to end on the PRODUCTION build (`npm run preview`,
// port 4173: no debug panel), every boot ridden in real time:
//   migration of the old flat keys into the first account,
//   per-user isolation (settings, volume, case progress) across logout/login,
//   power cycle from the OS back to the gate, power-off from the gate,
//   the OS unreachable without a login, and the debug panel's visibility.
const L = require('./qa-lib.cjs')
const BASE = process.env.QA_PROD || 'http://localhost:4173'

const OWNER = { firstName: 'Steven', lastName: 'Hildreth', tag: 'the Skeptic', username: 'Owner_1', password: 'Cathedral#2079' }
const BEA   = { firstName: 'Bea', lastName: "O'Neil-Ruiz", tag: '', username: 'bea', password: 'Second!user9' }
const LEGACY_PROGRESS = JSON.stringify({ v: 1, stage: 2, caseId: 'ascension_problem', tested: { ascension_problem: ['enoch_ascent'] }, scores: {} })

;(async () => {
  const { browser, page, errors } = await L.launch()
  await page.goto(BASE + '/')
  await page.evaluate((p) => {
    localStorage.clear()
    // The owner's existing (pre-login) settings and progress
    Object.entries({
      greyscale: 'true', desktopZoom: '1.5', windowZoom: '1.25',
      alwaysScreenOnly: 'false', alwaysScreenOnlySet: 'true', scriptedCaseProgress: p,
    }).forEach(([k, v]) => localStorage.setItem(k, v))
  }, LEGACY_PROGRESS)
  await page.reload()

  // Watch the whole run: the OS must never appear without a login
  await page.evaluate(() => {
    window.__osSeen = []
    new MutationObserver(() => {
      if (document.querySelector('[data-screen-frame]') && !window.__inOS) { window.__inOS = true; window.__osSeen.push(Date.now()) }
      if (!document.querySelector('[data-screen-frame]')) window.__inOS = false
    }).observe(document.body, { childList: true, subtree: true })
  })
  const store = () => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)])))
  const S = {
    menu: async () => { if (!(await page.$('[data-start-menu]'))) await page.click('[data-cos-start]'); await page.waitForTimeout(100) },
    closeMenu: async () => { if (await page.$('[data-start-menu]')) await page.click('[data-cos-start]'); await page.waitForTimeout(100) },
    section: async (id) => {
      const h = page.locator(`[data-section="${id}"]`)
      if ((await h.getAttribute('aria-expanded')) !== 'true') await h.click()
    },
    os: async () => {
      await S.menu()
      await S.section('settings'); await S.section('progress')
      const r = await page.evaluate(() => {
        const m = document.querySelector('[data-start-menu]')
        const zoom = (label) => [...m.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === `${label} in`)?.previousElementSibling?.textContent
        return {
          user: m.querySelector('[data-user-line]')?.innerText.replace(/\s+/g, ' ').trim(),
          greyscaleBox: [...m.querySelectorAll('label')].find(l => l.textContent.startsWith('Greyscale'))?.querySelector('input')?.checked,
          greyscaleFilter: document.querySelector('.cos-viewport')?.style.filter || '',
          desktopZoom: zoom('Desktop zoom'), windowZoom: zoom('Window zoom'),
          vol: [...document.querySelectorAll('button')].find(b => /^vol \d+%$/.test(b.textContent))?.textContent,
          progress: [...m.querySelectorAll('[role="listitem"]')].map(li => li.innerText.split('\n').slice(0, 2).join(' :: ')),
          windows: document.querySelectorAll('[data-screen-frame] [data-window], [data-screen-frame] .window').length,
        }
      })
      await S.closeMenu()
      return r
    },
    logout: async () => { await S.menu(); await page.click('[data-logout]'); await page.waitForTimeout(500) },
    toggleSetting: async (label) => {
      await S.menu(); await S.section('settings')
      await page.locator('[data-start-menu] label', { hasText: new RegExp('^' + label) }).locator('input').click()
      await S.closeMenu()
    },
    zoomIn: async (label) => { await S.menu(); await S.section('settings'); await page.click(`[data-start-menu] button[aria-label="${label} in"]`); await S.closeMenu() },
    knob: async (dir, ms) => {
      const k = await page.evaluate(() => {
        const el = [...document.querySelectorAll('div')].find(d => d.style.bottom === '27.22%' && d.style.right === '5%')
        const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height * (0.25), y2: r.y + r.height * 0.75 }
      })
      await page.mouse.move(k.x, dir === 'up' ? k.y : k.y2); await page.mouse.down(); await page.waitForTimeout(ms); await page.mouse.up()
    },
    testPassage: async (caseTitle) => {
      await S.menu(); await S.section('apps')
      await page.locator('[data-start-menu] span', { hasText: /^scripted\.exe$/ }).click()
      await page.waitForTimeout(500)
      // Saved progress reopens the last case where it was left: step back to the list
      for (let i = 0; i < 4 && !(await page.locator('button.cs-card', { hasText: caseTitle }).count()); i++) {
        await page.locator('button.cs-btn', { hasText: '← Back' }).click()
        await page.waitForTimeout(150)
      }
      await page.locator('button.cs-card', { hasText: caseTitle }).click()
      await page.locator('button.cs-btn.primary', { hasText: 'Next →' }).click()
      await page.locator('button.cs-btn.primary', { hasText: 'Test it against the rule' }).first().click()
      await page.waitForTimeout(300)
    },
  }
  const progressOf = (os, title) => (os.progress.find(p => p.startsWith(title)) || '').split(' :: ')[1]

  // ── BOOT 1: real boot to the gate ───────────────────────────────────────
  const b1 = await L.bootToLogin(page)
  L.check('boot ends at the login gate (not the OS)', b1.ok && (await L.domState(page)) === 'login', `crt video: ${b1.how}`)
  L.check('no debug panel on the production login screen', !(await page.getByText('DEBUG', { exact: true }).count()))
  const pre = await store()
  L.check('before any login the case store reads/writes nothing: legacy keys untouched, no cos:* keys', pre.scriptedCaseProgress === LEGACY_PROGRESS && pre.greyscale === 'true' && !Object.keys(pre).some(k => k.startsWith('cos')), Object.keys(pre).join(','))
  L.check('before login the legacy greyscale is NOT applied (no user yet)', !(await page.evaluate(() => document.querySelector('.cos-viewport').style.filter)))
  await L.shot(page, 'flow-1-gate-after-boot.png')

  // ── MIGRATION: the first account adopts the legacy keys ────────────────
  await L.createUserVia(page, OWNER)
  L.check('owner account created → back at sign in', (await L.card(page).getAttribute('data-mode')) === 'signin')
  await L.signIn(page, 'owner_1', OWNER.password)
  L.check('owner signs in → OS', await L.waitForState(page, 'on', 6000))
  await page.waitForTimeout(300)
  let s = await store()
  L.check('migration: legacy keys removed', ['greyscale', 'desktopZoom', 'windowZoom', 'alwaysScreenOnly', 'alwaysScreenOnlySet', 'scriptedCaseProgress'].every(k => !(k in s)))
  L.check('migration: values now under cos:owner_1:*', s['cos:owner_1:greyscale'] === 'true' && s['cos:owner_1:desktopZoom'] === '1.5' && s['cos:owner_1:windowZoom'] === '1.25' && s['cos:owner_1:alwaysScreenOnly'] === 'false' && JSON.parse(s['cos:owner_1:scriptedCaseProgress']).tested.ascension_problem[0] === 'enoch_ascent')
  let A = await S.os()
  L.check('migration: owner sees the old settings (greyscale on, zoom 150% / 125%)', A.greyscaleBox === true && /saturate\(0\)/.test(A.greyscaleFilter) && A.desktopZoom === '150%' && A.windowZoom === '125%', JSON.stringify({ ...A, progress: undefined }))
  L.check('migration: owner sees the old case progress', /In progress — 1 of 2/.test(progressOf(A, 'The Ascension Problem') || ''), progressOf(A, 'The Ascension Problem'))
  L.check('start menu user line: display name with tag + @username + Log out', A.user === 'Signed in as ▸ Steven Hildreth [the Skeptic] @Owner_1 Log out', A.user)
  await S.menu(); await L.shot(page, 'flow-2-owner-startmenu.png'); await S.closeMenu()

  // Owner changes things in their session
  await S.knob('down', 620)          // ~5 steps of 3%
  await S.testPassage('Who Incited David?')
  A = await S.os()
  const ownerVol = A.vol
  L.check('owner: volume knob changed and saved per user', ownerVol !== 'vol 50%' && (await store())['cos:owner_1:volume'] === String(parseInt(ownerVol.slice(4)) / 100), `${ownerVol} / saved ${(await store())['cos:owner_1:volume']}`)
  L.check('owner: new case progress saved', /In progress — 1 of 2/.test(progressOf(A, 'Who Incited David?') || ''))

  // ── LOGOUT → B ──────────────────────────────────────────────────────────
  await S.logout()
  L.check('Log out → back to the login gate (cathedral), windows closed', (await L.domState(page)) === 'login' && !(await page.$('.cs-root')))
  L.check('logged out: owner greyscale no longer applied on the gate', !(await page.evaluate(() => document.querySelector('.cos-viewport').style.filter)))
  L.check('logged out: no debug panel', !(await page.getByText('DEBUG', { exact: true }).count()))
  await L.shot(page, 'flow-3-after-logout.png')
  await L.createUserVia(page, BEA)
  await L.signIn(page, 'BEA', BEA.password)
  L.check('B signs in → OS', await L.waitForState(page, 'on', 6000))
  await page.waitForTimeout(300)
  let B = await S.os()
  L.check("B's world: defaults (no greyscale, 100% zooms, vol 50%)", B.greyscaleBox === false && !B.greyscaleFilter && B.desktopZoom === '100%' && B.windowZoom === '100%' && B.vol === 'vol 50%', JSON.stringify({ ...B, progress: undefined }))
  L.check("B's world: none of the owner's case progress", B.progress.every(p => /Not started/.test(p)), B.progress.filter(p => !/Not started/.test(p)).join(' | '))
  L.check("B's user line", B.user === "Signed in as ▸ Bea O'Neil-Ruiz @bea Log out", B.user)
  await S.zoomIn('Window zoom')
  await S.testPassage('The Census Numbers')
  B = await S.os()
  L.check('B: own progress + window zoom saved', /Complete — 1 of 1/.test(progressOf(B, 'The Census Numbers') || '') && B.windowZoom === '125%')
  await S.menu(); await L.shot(page, 'flow-4-bea-startmenu.png'); await S.closeMenu()

  // ── LOGOUT → A again: intact ────────────────────────────────────────────
  await S.logout()
  await L.signIn(page, 'Owner_1', OWNER.password)
  await L.waitForState(page, 'on', 6000)
  await page.waitForTimeout(300)
  A = await S.os()
  L.check("A after B's session: settings intact (greyscale, 150%/125%, volume)", A.greyscaleBox === true && A.desktopZoom === '150%' && A.windowZoom === '125%' && A.vol === ownerVol, JSON.stringify({ ...A, progress: undefined }))
  L.check("A after B's session: progress intact, B's case not there", /In progress — 1 of 2/.test(progressOf(A, 'The Ascension Problem') || '') && /In progress — 1 of 2/.test(progressOf(A, 'Who Incited David?') || '') && /Not started/.test(progressOf(A, 'The Census Numbers') || ''))
  s = await store()
  const ownerProg = JSON.parse(s['cos:owner_1:scriptedCaseProgress']).tested
  const beaProg = JSON.parse(s['cos:bea:scriptedCaseProgress']).tested
  L.check('storage: two separate namespaces, no leakage', Object.keys(ownerProg).sort().join() === 'ascension_problem,incited_david' && Object.keys(beaProg).join() === 'census_numbers' && s['cos:bea:windowZoom'] === '1.25' && s['cos:owner_1:windowZoom'] === '1.25' && s['cos:bea:greyscale'] === 'false')
  L.check('storage: no flat legacy keys came back', !['greyscale', 'desktopZoom', 'windowZoom', 'alwaysScreenOnly', 'alwaysScreenOnlySet', 'scriptedCaseProgress', 'volume'].some(k => k in s), Object.keys(s).join(','))
  L.check('storage: no plaintext password anywhere', !Object.values(s).some(v => v.includes(OWNER.password) || v.includes(BEA.password)))

  // ── DEBUG PANEL: unlocked inside a session, gone at logout ─────────────
  await S.menu(); await S.section('settings')
  await page.locator('[data-start-menu] span', { hasText: /^Debug Panel$/ }).click()
  await page.locator('[data-start-menu] input[type="password"]').fill('2079')
  await page.locator('[data-start-menu] input[type="password"]').press('Enter')
  await S.closeMenu()
  L.check('debug panel unlocks with the passcode inside a session', await page.getByText('DEBUG', { exact: true }).count() > 0)

  // ── POWER CYCLE from the OS ─────────────────────────────────────────────
  await L.pressPower(page)
  L.check('power from the OS → shutting down', ['shutting_down', 'off'].includes(await L.domState(page)))
  await L.finishVideo(page, '/fx/crt_off.mp4')
  L.check('…→ off', await L.waitForState(page, 'off', 8000))
  L.check('power-off ended the session: debug panel re-locked', !(await page.getByText('DEBUG', { exact: true }).count()))
  await page.evaluate(() => { window.__osSeen = [] })
  const b2 = await L.bootToLogin(page)
  L.check('power on → boot → the login gate again (not the OS)', b2.ok)
  L.check('the OS never appeared during the power cycle', (await page.evaluate(() => window.__osSeen.length)) === 0)
  await L.signIn(page, 'bea', BEA.password)
  await L.waitForState(page, 'on', 6000)
  B = await S.os()
  L.check("after the power cycle, logging in as B shows B's world", B.user.includes('@bea') && /Complete — 1 of 1/.test(progressOf(B, 'The Census Numbers') || '') && B.greyscaleBox === false)

  // ── POWER-OFF from the gate ─────────────────────────────────────────────
  await S.logout()
  await L.pressPower(page)
  await L.finishVideo(page, '/fx/crt_off.mp4')
  L.check('power-off works from the login gate too', await L.waitForState(page, 'off', 8000))

  L.check('no page errors', errors.length === 0, errors.join(' | '))
  await browser.close()
  process.exit(L.summary() ? 1 : 0)
})()

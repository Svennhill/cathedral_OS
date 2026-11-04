// qa-lib.cjs — shared helpers for the overnight-login QA runs.
// Uses the Playwright that is installed on the QA machine (it is NOT a project
// dependency). Run each qa-*.cjs with: node docs/qa/overnight-login/<file>
// against `npm run dev` (port 5173) or `npm run preview` (port 4173).
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const SHOTS = path.join(__dirname, '..', '..', 'pr-screenshots', 'overnight-login')
fs.mkdirSync(SHOTS, { recursive: true })

const results = []
function check(name, pass, detail = '') {
  results.push({ name, pass: !!pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
  return !!pass
}
function summary() {
  const failed = results.filter(r => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) { console.log('FAILED:'); failed.forEach(f => console.log('  - ' + f.name + (f.detail ? ' — ' + f.detail : ''))) }
  return failed.length
}

async function launch({ viewport = { width: 1440, height: 900 }, device = null } = {}) {
  const browser = await chromium.launch()
  const context = device ? await browser.newContext({ ...device }) : await browser.newContext({ viewport, deviceScaleFactor: 2 })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  return { browser, context, page, errors }
}

// Which screen state the DOM shows (works without the debug panel)
async function domState(page) {
  return page.evaluate(() => {
    if (document.querySelector('form[data-login-card]')) return 'login'
    if (document.querySelector('[data-screen-frame]')) return 'on'
    if (document.querySelector('video[src="/fx/crt_off.mp4"]')) return 'shutting_down'
    if (document.querySelector('video[src="/fx/crt_on.mp4"]')) return 'crt_on'
    if (document.querySelector('img[src="/screen/screen_off.png"]')) return 'off'
    if (document.querySelector('img[src="/boot/boot_background.png"]')) return 'booting'
    return 'unknown'
  })
}

// Click the bezel's power zone, or Screen Only's own POWER button
async function pressPower(page) {
  const so = page.getByRole('button', { name: 'Power on' })
  if (await so.count()) { await so.click(); return }
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(d => d.style.bottom === '4%' && d.style.left === '1%' && d.style.zIndex === '316')
    el.click()
  })
}

// Playwright's Chromium can't decode the H.264 CRT videos, so 'ended' never
// fires on its own; after a grace period the harness fires it (the app's own
// onEnded handler then runs exactly as it would in a real browser).
async function finishVideo(page, src, graceMs = 4500) {
  const t0 = Date.now()
  while (Date.now() - t0 < graceMs) {
    if (!(await page.$(`video[src="${src}"]`))) return 'ended-naturally'
    await page.waitForTimeout(250)
  }
  const fired = await page.evaluate((s) => {
    const v = document.querySelector(`video[src="${s}"]`)
    if (!v) return false
    v.dispatchEvent(new Event('ended'))
    return true
  }, src)
  return fired ? 'ended-dispatched' : 'ended-naturally'
}

async function waitForState(page, want, timeoutMs = 60000) {
  const t0 = Date.now()
  let s
  while (Date.now() - t0 < timeoutMs) {
    s = await domState(page)
    if (s === want) return true
    await page.waitForTimeout(200)
  }
  return false
}

// Power on from 'off' and ride the real boot to the login gate
async function bootToLogin(page) {
  await pressPower(page)
  const how = await finishVideo(page, '/fx/crt_on.mp4')
  const ok = await waitForState(page, 'login', 60000)
  await page.waitForTimeout(350)   // the card fades in
  return { ok, how }
}

// Screenshots: the monitor only (the black page margin is cropped away),
// JPEG to keep the repo light
async function shot(page, name) {
  const file = path.join(SHOTS, name.replace(/\.png$/, '.jpg'))
  const clip = await page.evaluate(() => {
    const el = document.querySelector('.cos-viewport > div')
    const r = el.getBoundingClientRect()
    const x = Math.max(0, r.left), y = Math.max(0, r.top)
    return { x, y, width: Math.min(innerWidth, r.right) - x, height: Math.min(innerHeight, r.bottom) - y }
  })
  await page.screenshot({ path: file, type: 'jpeg', quality: 82, clip })
  return file
}

const card = (page) => page.locator('form[data-login-card]')

async function signIn(page, username, password) {
  const c = card(page)
  await c.getByLabel('Username', { exact: true }).fill(username)
  await c.getByLabel('Password', { exact: true }).fill(password)
  await c.getByLabel('Password', { exact: true }).press('Enter')
}

async function createUserVia(page, u) {
  const c = card(page)
  if ((await c.getAttribute('data-mode')) !== 'create') await c.getByRole('button', { name: 'Create User' }).click()
  await c.getByLabel('First name').fill(u.firstName ?? '')
  await c.getByLabel('Last name').fill(u.lastName ?? '')
  await c.getByLabel('Tag (optional)').fill(u.tag ?? '')
  await c.getByLabel('Username', { exact: true }).fill(u.username ?? '')
  await c.getByLabel('Password', { exact: true }).fill(u.password ?? '')
  await c.getByLabel('Confirm password').fill(u.confirm ?? u.password ?? '')
  await c.getByRole('button', { name: 'Create User' }).click()
  await page.waitForTimeout(150)
}

async function alertText(page) {
  return (await card(page).locator('[role="alert"]').innerText()).trim()
}
async function fieldError(page, label) {
  return page.evaluate((label) => {
    const lab = [...document.querySelectorAll('form[data-login-card] label')].find(l => l.textContent.trim() === label)
    if (!lab) return null
    const input = document.getElementById(lab.htmlFor)
    const err = document.getElementById(lab.htmlFor + '-err')
    return { invalid: input?.getAttribute('aria-invalid') === 'true', text: err ? err.textContent.trim() : '' }
  }, label)
}
const focusedLabel = (page) => page.evaluate(() => {
  const a = document.activeElement
  if (!a) return null
  if (a.tagName === 'INPUT') return document.querySelector(`label[for="${a.id}"]`)?.textContent.trim() ?? a.name
  return a.tagName + ':' + a.textContent.trim()
})

module.exports = {
  check, summary, launch, domState, pressPower, finishVideo, waitForState, bootToLogin,
  shot, card, signIn, createUserVia, alertText, fieldError, focusedLabel, SHOTS,
}

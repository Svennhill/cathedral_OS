// qa-units.cjs — the data layer, run in a real page against `npm run dev`
// (the modules are imported by URL, so these are the app's own instances):
// hashing, validation, the user store, namespacing, and migration.
const L = require('./qa-lib.cjs')
const BASE = process.env.QA_DEV || 'http://localhost:5173'

;(async () => {
  const { browser, page, errors } = await L.launch()
  await page.goto(BASE + '/')
  await page.evaluate(() => localStorage.clear())

  const r = await page.evaluate(async () => {
    const out = {}
    const sha = await import('/src/data/sha256.js')
    const V = await import('/src/data/uservalidation.js')
    const S = await import('/src/data/userstore.js')
    const P = await import('/src/data/userprefs.js')
    const hex = b => Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('')

    // ── SHA-256: built-in fallback == crypto.subtle, byte for byte ──
    const inputs = ['', 'abc', 'a'.repeat(55), 'a'.repeat(56), 'a'.repeat(64), 'a'.repeat(1000),
      'pässwörd—✝—日本語', 'The quick brown fox jumps over the lazy dog']
    out.shaMatch = []
    for (const t of inputs) {
      const bytes = new TextEncoder().encode(t)
      const a = hex(await crypto.subtle.digest('SHA-256', bytes))
      const b = hex(sha.sha256Fallback(bytes))
      out.shaMatch.push(a === b)
    }
    out.shaAbc = await sha.sha256Hex('abc')

    // ── validation ──
    const name = s => V.checkName(s, 'first name')
    out.names = {
      ok: ['Steven', 'Mary-Jane', "O'Brien", 'O’Brien', 'José', 'Zoë Ann', 'van der Berg'].map(name),
      bad: ['', '   ', 'St3ven', 'Steve!', '---', "''", '<b>x</b>', 'a'.repeat(41)].map(name),
    }
    out.usernames = {
      ok: ['abc', 'steven', 'Steven_H', 'user_2079', 'a'.repeat(20), 'classic_gamer', 'peacock', 'grape_drape', 'spice', 'assassin'].map(V.checkUsername),
      bad: ['', 'ab', 'a'.repeat(21), 'bad name', 'bad-name', 'bäd', 'shithead', 'SH1T_lord', 'FuckYeah', 'b1tch', 'a55hole', 'xXslutXx'].map(V.checkUsername),
    }
    out.passwords = {
      short: V.checkPassword('Abcde1!'),
      noUpper: V.checkPassword('alllowercase1'),
      noLower: V.checkPassword('ALLUPPER1'),
      noDigitSym: V.checkPassword('NoDigitsHere'),
      allMissing: V.checkPassword('aaaa'),
      empty: V.checkPassword(''),
      tooLong: V.checkPassword('Aa1' + 'x'.repeat(126)),
      ok1: V.checkPassword('Passw0rd'),
      ok2: V.checkPassword('Password!'),
      ok3: V.checkPassword('correct Horse battery staple?'),
    }
    out.confirm = { mismatch: V.checkConfirm('Passw0rd', 'Passw0rD'), empty: V.checkConfirm('Passw0rd', ''), ok: V.checkConfirm('Passw0rd', 'Passw0rd') }
    out.tags = {
      ok: ['', 'the Skeptic', 'Jr.', '✝', 'Rev. ☩'].map(V.checkTag),
      bad: ['x'.repeat(17), 'evil‮abc', 'tab\there', 'bitchin'].map(V.checkTag),
    }

    // ── user store ──
    out.emptyBefore = await S.hasAnyUsers()
    const PW = 'Sup3r-Secret!'
    const c1 = await S.createUser({ firstName: ' Steven ', lastName: 'Hildreth', tag: 'the Skeptic', username: 'Steven', password: PW })
    out.create1 = c1.ok && c1.user.username === 'Steven' && c1.user.firstName === 'Steven' && !('hash' in c1.user) && !('salt' in c1.user)
    out.dupLower = await S.createUser({ firstName: 'A', lastName: 'B', username: 'steven', password: PW })
    out.dupUpper = await S.createUser({ firstName: 'A', lastName: 'B', username: 'STEVEN', password: PW })
    out.badCreate = await S.createUser({ firstName: '', lastName: '9', username: 'x', password: 'weak' })
    out.anyAfter = await S.hasAnyUsers()
    out.exists = [await S.userExists('steven'), await S.userExists('STEVEN'), await S.userExists('nobody')]
    out.getUser = await S.getUser('sTeVeN')
    const reg = JSON.parse(localStorage.getItem('cosUsers'))
    const rec = reg.steven
    out.regShape = Object.keys(rec).sort().join(',')
    out.hashIsSaltedSha = rec.hash === hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rec.salt + PW)))
    out.saltLen = rec.salt.length
    out.plaintextAnywhere = Object.keys(localStorage).some(k => (localStorage.getItem(k) || '').includes(PW))
    const c2 = await S.createUser({ firstName: 'Bea', lastName: 'Two', username: 'bea', password: PW })
    out.saltsDiffer = JSON.parse(localStorage.getItem('cosUsers')).bea.salt !== rec.salt
    out.hashDiffersSamePw = JSON.parse(localStorage.getItem('cosUsers')).bea.hash !== rec.hash && c2.ok
    out.verify = {
      right: await S.verifyLogin('steven', PW),
      rightCase: await S.verifyLogin('  STEVEN ', PW),
      wrongPw: await S.verifyLogin('steven', PW + 'x'),
      pwCase: await S.verifyLogin('steven', PW.toLowerCase()),
      unknown: await S.verifyLogin('nobody', PW),
      empty: await S.verifyLogin('steven', ''),
      overlong: await S.verifyLogin('steven', PW + 'x'.repeat(200)),
    }
    out.display = [S.displayName(c1.user), S.displayName({ firstName: 'A', lastName: 'B', tag: '' }), S.displayName({ firstName: '<img src=x onerror=alert(1)>', lastName: 'Z', tag: '"><b>' })]

    // A damaged registry: bad entries are ignored, never a crash
    localStorage.setItem('cosUsers', '{not json')
    out.corruptAny = await S.hasAnyUsers()
    out.corruptVerify = (await S.verifyLogin('steven', PW)).ok
    localStorage.setItem('cosUsers', JSON.stringify({ steven: rec, junk: { username: 5 }, mismatch: { ...rec, username: 'other' } }))
    out.partialAny = await S.hasAnyUsers()
    out.partialVerify = (await S.verifyLogin('steven', PW)).ok
    out.partialJunk = await S.userExists('junk')

    // ── namespacing + migration ──
    out.key = P.userKey('Steven', 'greyscale')
    out.reservedKey = P.userKey('Steven', P.USER_KEYS.lilpopeTour)
    localStorage.clear()
    const legacy = { greyscale: 'true', alwaysScreenOnly: 'false', alwaysScreenOnlySet: 'true', desktopZoom: '1.5', windowZoom: '1.25', scriptedCaseProgress: '{"v":1,"stage":0,"caseId":null,"tested":{}}' }
    for (const [k, v] of Object.entries(legacy)) localStorage.setItem(k, v)
    localStorage.setItem('cos:steven:lilpopeTour', 'done')   // reserved key must not block or be touched
    out.adopted = P.adoptLegacyData('Steven')
    out.afterAdopt = Object.fromEntries(Object.keys(legacy).map(k => [k, [localStorage.getItem(k), localStorage.getItem('cos:steven:' + k)]]))
    out.lilpopeUntouched = localStorage.getItem('cos:steven:lilpopeTour') === 'done'
    out.prefs = P.readUserPrefs('STEVEN')
    for (const [k, v] of Object.entries(legacy)) localStorage.setItem(k, v)   // legacy again…
    out.adoptedSecond = P.adoptLegacyData('steven')                            // …but steven has values
    out.legacyKeptWhenSkipped = localStorage.getItem('greyscale') === 'true'
    out.adoptedOther = P.adoptLegacyData('bea')                                // bea has none → adopts
    out.noUserPrefs = P.readUserPrefs('nobody')

    // ── plain http (no crypto.subtle): accounts still work, same hashes ──
    localStorage.clear()
    const desc = Object.getOwnPropertyDescriptor(Crypto.prototype, 'subtle')
    Object.defineProperty(Crypto.prototype, 'subtle', { configurable: true, get: () => undefined })
    out.subtleGone = globalThis.crypto.subtle === undefined
    const made = await S.createUser({ firstName: 'Lan', lastName: 'Phone', username: 'lan', password: 'Over-Http1' })
    const insecureOk = (await S.verifyLogin('lan', 'Over-Http1')).ok
    Object.defineProperty(Crypto.prototype, 'subtle', desc)
    out.http = { made: made.ok, insecureOk, secureOk: (await S.verifyLogin('lan', 'Over-Http1')).ok, wrong: (await S.verifyLogin('lan', 'Over-Http2')).ok }

    // ── storage that throws (blocked / full) ──
    const realSet = Storage.prototype.setItem
    Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError') }
    out.blocked = await S.createUser({ firstName: 'No', lastName: 'Room', username: 'noroom', password: 'Full-Disk1' })
    Storage.prototype.setItem = realSet
    out.blockedNotSaved = !(await S.userExists('noroom'))
    localStorage.clear()
    return out
  })

  L.check('SHA-256 fallback matches crypto.subtle on 8 vectors (incl. empty, block edges, Unicode)', r.shaMatch.every(Boolean), JSON.stringify(r.shaMatch))
  L.check('SHA-256("abc") known answer', r.shaAbc === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  L.check('names: letters/spaces/hyphens/apostrophes (incl. curly ’ and accents) pass', r.names.ok.every(x => x === null), JSON.stringify(r.names.ok))
  L.check('names: empty, digits, symbols, no-letter, markup, >40 chars fail', r.names.bad.every(x => typeof x === 'string'), JSON.stringify(r.names.bad))
  L.check('usernames: 3–20 letters/numbers/underscore pass (incl. classic/peacock/grape/spice/assassin)', r.usernames.ok.every(x => x === null), JSON.stringify(r.usernames.ok))
  L.check('usernames: empty, 2 chars, 21 chars, space, hyphen, non-ASCII, profanity (case + digit swaps) fail', r.usernames.bad.every(x => typeof x === 'string'), JSON.stringify(r.usernames.bad))
  L.check('password: too short fails', /at least 8 characters/.test(r.passwords.short ?? ''), r.passwords.short)
  L.check('password: no uppercase fails', r.passwords.noUpper === 'password needs an uppercase letter', r.passwords.noUpper)
  L.check('password: no lowercase fails', r.passwords.noLower === 'password needs a lowercase letter', r.passwords.noLower)
  L.check('password: no digit or symbol fails', r.passwords.noDigitSym === 'password needs a number or symbol', r.passwords.noDigitSym)
  L.check('password: lists every missing piece', r.passwords.allMissing === 'password needs at least 8 characters, an uppercase letter, and a number or symbol', r.passwords.allMissing)
  L.check('password: empty and >128 fail', !!r.passwords.empty && !!r.passwords.tooLong)
  L.check('password: Passw0rd / Password! / passphrase pass', [r.passwords.ok1, r.passwords.ok2, r.passwords.ok3].every(x => x === null))
  L.check('confirm: mismatch and empty fail, match passes', r.confirm.mismatch === "passwords don't match" && !!r.confirm.empty && r.confirm.ok === null)
  L.check('tag: optional; flourishes incl. symbols pass', r.tags.ok.every(x => x === null), JSON.stringify(r.tags.ok))
  L.check('tag: >16 chars, bidi override, control char, profanity fail', r.tags.bad.every(x => typeof x === 'string'), JSON.stringify(r.tags.bad))
  L.check('store: empty registry → hasAnyUsers false', r.emptyBefore === false)
  L.check('store: createUser trims and returns a public profile (no salt/hash)', r.create1)
  L.check('store: duplicate username blocked, any case', !r.dupLower.ok && !r.dupUpper.ok && r.dupLower.errors.username === 'that username is taken' && r.dupUpper.errors.username === 'that username is taken')
  L.check('store: createUser re-validates (server-style)', !r.badCreate.ok && ['firstName', 'lastName', 'username', 'password'].every(k => r.badCreate.errors[k]), JSON.stringify(r.badCreate.errors))
  L.check('store: userExists case-insensitive', JSON.stringify(r.exists) === '[true,true,false]')
  L.check('store: getUser case-insensitive, public profile only', r.getUser && r.getUser.username === 'Steven' && !r.getUser.hash)
  L.check('registry record shape is exactly { username, firstName, lastName, tag, salt, hash, createdAt }', r.regShape === 'createdAt,firstName,hash,lastName,salt,tag,username', r.regShape)
  L.check('hash = SHA-256(salt + password); 128-bit random salt', r.hashIsSaltedSha && r.saltLen === 32)
  L.check('password never stored in plaintext (no localStorage value contains it)', r.plaintextAnywhere === false)
  L.check('per-user salts differ; same password → different hashes', r.saltsDiffer && r.hashDiffersSamePw)
  L.check('verifyLogin: right password ok; username any case/whitespace ok', r.verify.right.ok && r.verify.rightCase.ok)
  const gen = 'username or password not recognized'
  L.check('verifyLogin: wrong password / wrong case / unknown user / empty / overlong → the same generic error',
    ['wrongPw', 'pwCase', 'unknown', 'empty', 'overlong'].every(k => !r.verify[k].ok && r.verify[k].error === gen))
  L.check('displayName: "First Last [tag]"; markup stays a plain string', r.display[0] === 'Steven Hildreth [the Skeptic]' && r.display[1] === 'A B' && r.display[2] === '<img src=x onerror=alert(1)> Z ["><b>]', JSON.stringify(r.display))
  L.check('corrupt registry → treated as empty, no crash', r.corruptAny === false && r.corruptVerify === false)
  L.check('damaged entries ignored, good ones kept', r.partialAny && r.partialVerify && r.partialJunk === false)
  L.check('namespace key is cos:<lowercased username>:<name>', r.key === 'cos:steven:greyscale')
  L.check('reserved key cos:<username>:lilpopeTour', r.reservedKey === 'cos:steven:lilpopeTour')
  L.check('migration: all six legacy keys adopted into the namespace, legacy removed', r.adopted.length === 6 && Object.values(r.afterAdopt).every(([g, n]) => g === null && n !== null), JSON.stringify(r.afterAdopt))
  L.check('migration: lilpopeTour neither blocks adoption nor is touched', r.lilpopeUntouched)
  L.check('migration: adopted values read back (greyscale, zooms, explicit Screen Only false)', r.prefs.greyscale === true && r.prefs.desktopZoom === 1.5 && r.prefs.windowZoom === 1.25 && r.prefs.alwaysPref === false && r.prefs.volume === null, JSON.stringify(r.prefs))
  L.check('migration: a user who already has values adopts nothing and legacy is kept', r.adoptedSecond.length === 0 && r.legacyKeptWhenSkipped)
  L.check('migration: next user with an empty namespace adopts what is left', r.adoptedOther.length === 6)
  L.check('unsaved prefs read back as null (caller picks defaults)', Object.values(r.noUserPrefs).every(v => v === null))
  L.check('plain http (no crypto.subtle): create + sign in work via the built-in SHA-256', r.subtleGone && r.http.made && r.http.insecureOk, JSON.stringify(r.http))
  L.check('…and that account signs in on https too (identical hashes); wrong password still fails', r.http.secureOk && !r.http.wrong)
  L.check('storage full/blocked: createUser fails with an in-form message, nothing half-saved', !r.blocked.ok && /storage on this device is full or blocked/.test(r.blocked.errors.form) && r.blockedNotSaved, JSON.stringify(r.blocked))
  L.check('no page errors', errors.length === 0, errors.join(' | '))
  await page.evaluate(() => localStorage.clear())
  await browser.close()
  process.exit(L.summary() ? 1 : 0)
})()

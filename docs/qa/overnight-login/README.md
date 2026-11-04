# overnight-login QA

The scripts that produced the QA evidence in the login PR. They drive the real app in
Chromium with Playwright. Playwright is **not** a project dependency: it has to be
available to Node on the machine running them (for example `npm i -g playwright` and
`npx playwright install chromium`).

| Script | Runs against | Covers |
|---|---|---|
| `qa-units.cjs` | `npm run dev` (5173) | hashing (incl. the no-Web-Crypto fallback), validation rules, user store, namespacing, migration, blocked storage |
| `qa-form.cjs` | `npm run dev` (5173) | the card: empty state, every validation path through the form, generic sign-in error, focus, labels, aria-live, Enter, Tab order, the background_OS wipe, the helper-character events and registry |
| `qa-flows.cjs` | `npm run preview` (4173) | real boots on the production build: migration, per-user isolation across logout/login, power cycle, the OS unreachable without a login, debug-panel visibility |
| `qa-phone.cjs` | `npm run preview` (4173) | iPhone portrait/landscape, phone with the bezel, desktop Screen Only |
| `qa-debug.cjs` | `npm run dev` (5173) | the dev-only debug panel: `login` jump, `on` bypass (by design), loop mode |

```bash
npm run dev            # terminal 1
npm run build && npm run preview   # terminal 2
node docs/qa/overnight-login/qa-units.cjs
```

Each script prints PASS/FAIL per check and exits non-zero on any failure. Boots run in
real time (about 34 seconds each). Screenshots are written to
`docs/pr-screenshots/overnight-login/`. Every script clears this browser profile's
localStorage for the origin it tests; it never touches a real browser's data.

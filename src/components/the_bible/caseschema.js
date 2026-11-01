// src/components/the_bible/caseschema.js
// Shape check for analyser cases (see the header of passages.js). Returns a
// list of problems — empty means the case can be dropped into PASSAGES and
// scripted.exe will render it with no component changes.

import { ENTITIES } from "./entities"
import { SEVERITY } from "./severity"
import { resolveBook } from "../../data/bsb"

const isText = (v) => typeof v === "string" && v.trim().length > 0

function checkVerse(v, where, out) {
  if (!v || typeof v !== "object") return out.push(`${where}: missing verse`)
  if (!resolveBook(v.book))          out.push(`${where}: "${v.book}" is not a BSB book`)
  if (!(Number(v.chapter) >= 1))     out.push(`${where}: bad chapter`)
  if (!(Number(v.verse) >= 1))       out.push(`${where}: bad verse`)
  if (!isText(v.reference))          out.push(`${where}: missing reference`)
}

export function validateCase(c) {
  const out = []
  if (!c || typeof c !== "object") return ["case is not an object"]
  const at = c.id ?? "(no id)"

  for (const k of ["id", "title", "summary", "verdict"]) {
    if (!isText(c[k])) out.push(`${at}: missing ${k}`)
  }
  if (!SEVERITY[c.severity]) out.push(`${at}: severity ${c.severity} is not in SEVERITY`)
  checkVerse(c.ruleVerse, `${at}.ruleVerse`, out)

  const rules = Array.isArray(c.rulesItDefines) ? c.rulesItDefines : []
  if (!rules.length) out.push(`${at}: rulesItDefines is empty`)
  const ruleIds = new Set()
  rules.forEach((r, i) => {
    const w = `${at}.rulesItDefines[${i}]`
    if (!isText(r.id)) out.push(`${w}: missing id`)
    else if (ruleIds.has(r.id)) out.push(`${w}: duplicate id ${r.id}`)
    ruleIds.add(r.id)
    if (!isText(r.statement)) out.push(`${w}: missing statement`)
    if (!isText(r.plain))     out.push(`${w}: missing plain`)
  })

  const tests = Array.isArray(c.testCases) ? c.testCases : []
  if (!tests.length) out.push(`${at}: testCases is empty`)
  const testIds = new Set()
  tests.forEach((t, i) => {
    const w = `${at}.testCases[${i}]`
    if (!isText(t.id)) out.push(`${w}: missing id`)
    else if (testIds.has(t.id)) out.push(`${w}: duplicate id ${t.id}`)
    testIds.add(t.id)
    if (!ENTITIES[t.entityId]) out.push(`${w}: entity "${t.entityId}" is not in ENTITIES`)
    checkVerse(t.verse, `${w}.verse`, out)
    if (!isText(t.verdict)) out.push(`${w}: missing verdict`)
    if (t.violatesRule != null) {
      if (!ruleIds.has(t.violatesRule)) out.push(`${w}: violatesRule "${t.violatesRule}" is not a rule of this case`)
      if (!SEVERITY[t.severity])        out.push(`${w}: severity ${t.severity} is not in SEVERITY`)
      if (!isText(t.violationExplanation)) out.push(`${w}: missing violationExplanation`)
    }
  })

  return out
}

// Checks every case and that ids are unique across cases
export function validateCases(cases) {
  const out = cases.flatMap(validateCase)
  const ids = cases.map(c => c?.id)
  ids.forEach((id, i) => { if (ids.indexOf(id) !== i) out.push(`duplicate case id ${id}`) })
  return out
}

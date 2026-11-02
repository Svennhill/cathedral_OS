// derivescene.js — turns one analyser case into a drag-and-drop scene
//
// deriveScene(caseData) reads only the case's existing fields and returns
// null when the case can't be staged as a scene — that case then stays
// panel-only, which is always a complete way to run it.
//
// How the scene is read off the case (passages.js shape, see its header):
//
//   zone      the `target` of a barring rule (permitted: false) when that
//             target is a place in ENTITIES and the rule's `action` is one
//             the visual layer knows how to stage (ACTIONS in scenedata.js).
//             Ascension: rule_no_ascent → target "heaven", action "ascend".
//
//   figures   one per test case (its entityId, which must be a person).
//             Dropping it in the zone runs caseActions.test(tc.id) — the
//             panel's own action — so scoring is the panel's scoring.
//               violatesRule set   → "contradiction": the passage, then the
//                                    CONTRADICTION result (Enoch, Elijah)
//               violatesRule null  → "consistent": the passage and verdict
//
//             plus one per person who is the `subject` of a permitted rule
//             about the same place and has no test case ("exempt") — the
//             rule verse itself names them as the exception, so it is their
//             passage. Ascension: rule_only_descent → Jesus, John 3:13.
//             Nothing is recorded for them; they don't touch the score.
//
//             plus DECOYS people from ROSTER ("none"): no record, an error,
//             never a contradiction, no score change.
//
// A case is only staged when every one of its test cases maps to a figure,
// so the visual view never offers part of a case.

import { ENTITIES } from "../../the_bible/entities"
import { ACTIONS, ROSTER, DECOYS } from "./scenedata"

const isPerson = (id) => ENTITIES[id]?.visualType === "person"

// Small stable hash so a case always gets the same decoys and order
function seedOf(text) {
  let h = 2166136261
  for (const ch of String(text)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return h >>> 0
}
function seeded(seed) {
  let s = seed || 1
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ (s + 0x9e3779b9)) >>> 0) / 2 ** 32
}
function shuffle(list, rand) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function deriveScene(caseData) {
  if (!caseData) return null
  const rules = caseData.rulesItDefines ?? []

  const bar = rules.find(r =>
    r.permitted === false && ENTITIES[r.target]?.type === "place" && ACTIONS[r.action])
  if (!bar) return null

  const place  = ENTITIES[bar.target]
  const action = ACTIONS[bar.action]
  const placeRules = new Set(rules.filter(r => r.target === bar.target).map(r => r.id))

  // Every test case must be a person we can draw, or the scene is incomplete
  if (!caseData.testCases.every(tc => isPerson(tc.entityId))) return null

  const repeated = (id) => caseData.testCases.filter(tc => tc.entityId === id).length > 1

  const figures = caseData.testCases.map(tc => ({
    key:    `test:${tc.id}`,
    kind:   tc.violatesRule ? "contradiction" : "consistent",
    name:   ENTITIES[tc.entityId].name,
    // Two passages about one person: tell the figures apart by reference
    label:  repeated(tc.entityId)
      ? `${ENTITIES[tc.entityId].name} (${tc.verse.reference})`
      : ENTITIES[tc.entityId].name,
    testId: tc.id,
    verse:  tc.verse,
    // Only claim the figure reached the place if the rule it breaks is
    // about that place
    affirms: Boolean(tc.violatesRule && placeRules.has(tc.violatesRule)),
  }))

  const tested = new Set(caseData.testCases.map(tc => tc.entityId))
  for (const r of rules) {
    if (r.permitted !== true || r.target !== bar.target) continue
    if (!isPerson(r.subject) || tested.has(r.subject)) continue
    tested.add(r.subject)
    figures.push({
      key:    `exempt:${r.subject}`,
      kind:   "exempt",
      name:   ENTITIES[r.subject].name,
      label:  ENTITIES[r.subject].name,
      ruleId: r.id,
      verse:  caseData.ruleVerse,
      affirms: true,
    })
  }

  const rand  = seeded(seedOf(caseData.id))
  const taken = new Set(figures.map(f => f.name.toLowerCase()))
  const decoys = shuffle(ROSTER.filter(p => !taken.has(p.name.toLowerCase())), rand)
    .slice(0, DECOYS)
    .map(p => ({ key: `none:${p.id}`, kind: "none", name: p.name, label: p.name }))

  return {
    place:   { id: place.id, name: place.name },
    ground:  action.ground,
    action,
    figures: shuffle([...figures, ...decoys], rand),
  }
}

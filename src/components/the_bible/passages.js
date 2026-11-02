// src/components/the_bible/passages.js
//
// The analyser's cases. Each entry is one complete case; scripted.exe renders
// whatever is listed here, so adding a case is a data-only change — append an
// entry in this shape (checked by validateCase in caseschema.js):
//
//   id            unique string, also the localStorage progress key
//   title         case name shown on its card
//   summary       one plain sentence for the case card
//   ruleVerse     { book, chapter, verse, reference } — the verse being tested
//   rulesItDefines[]
//     id          unique within the case
//     statement   the rule, formally
//     plain       the rule in everyday words ("In plain terms: …")
//   testCases[]
//     id          unique within the case
//     entityId    key in ENTITIES (entities.js) — names the passage card
//     verse       { book, chapter, verse, reference }
//     violatesRule  a rule id, or null if the passage keeps every rule
//     violationExplanation  why it breaks that rule (when violatesRule is set)
//     severity    level in SEVERITY (severity.js) (when violatesRule is set)
//     verdict     one-line result for this passage
//   severity      overall level in SEVERITY
//   verdict       the full case verdict sentence
//   scoreImpact   overall impact (informational — scores are computed from
//                 the tested passages, see apps/scripted/scoring.js)
//
// Verse text is never stored here: it is read from the BSB store by reference.

export const PASSAGES = [
  {
    id: "ascension_problem",
    title: "The Ascension Problem",
    summary: "Checks John 3:13's claim that no one has gone up to heaven against passages where someone does.",

    // The rule-setting verse
    ruleVerse: {
      book: "John",
      chapter: 3,
      verse: 13,
      reference: "John 3:13",
    },

    // What logical rules this verse establishes
    rulesItDefines: [
      {
        id: "rule_no_ascent",
        statement: "No human has ascended to heaven.",
        plain: "Nobody has ever gone up into heaven — no person, at any time.",
        subject: "human",
        action: "ascend",
        target: "heaven",
        permitted: false,
      },
      {
        id: "rule_only_descent",
        statement: "The only one who has been in heaven is the one who descended from it.",
        plain: "The only one who has been in heaven is the Son of Man (Jesus), who came down from it.",
        subject: "jesus",
        action: "descend",
        target: "heaven",
        permitted: true,
        exclusive: true,
      },
    ],

    // Test cases that violate the rules
    testCases: [
      {
        id: "enoch_ascent",
        entityId: "enoch",
        verse: {
          book: "Genesis",
          chapter: 5,
          verse: 24,
          reference: "Genesis 5:24",
        },
        violatesRule: "rule_no_ascent",
        violationExplanation: "Genesis states God 'took' Enoch — the Hebrew word laqach used here is the same word used elsewhere for being taken directly to God. Jewish and Christian tradition consistently interprets this as Enoch ascending to heaven without dying.",
        severity: 3,
        verdict: "CONTRADICTION — Enoch's ascent directly violates the exclusive claim of John 3:13.",
      },
      {
        id: "elijah_ascent",
        entityId: "elijah",
        verse: {
          book: "2 Kings",
          chapter: 2,
          verse: 11,
          reference: "2 Kings 2:11",
        },
        violatesRule: "rule_no_ascent",
        violationExplanation: "2 Kings explicitly states Elijah went up to heaven in a whirlwind. This is not ambiguous — the text uses the word heaven (shamayim) directly. Elijah ascended. John 3:13 says no one has ascended.",
        severity: 3,
        verdict: "CONTRADICTION — Elijah's ascent is explicit and directly violates the exclusive claim of John 3:13.",
      },
    ],

    // Overall case verdict
    severity: 3,
    verdict: "LEVEL 3 DOCTRINAL VIOLATION — John 3:13 makes an exclusive universal claim that is directly contradicted by at least two prior Old Testament accounts accepted as canonical by the same tradition.",
    scoreImpact: -2.0,
  },
  {
    "id": "lying_spirit",
    "title": "The Lying Spirit",
    "summary": "Checks Hebrews 6:18 — it is impossible for God to lie — against 1 Kings 22:23, where the LORD puts a lying spirit in the prophets' mouths, and 2 Thessalonians 2:11, where God sends a delusion so that people believe the lie.",
    "ruleVerse": {
      "book": "Hebrews",
      "chapter": 6,
      "verse": 18,
      "reference": "Hebrews 6:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_god_cannot_lie",
        "statement": "It is impossible for God to lie.",
        "plain": "Hebrews states it as a property of God, not a habit: 'it is impossible for God to lie.' Deception is not merely something He does not do; it is something He cannot do.",
        "subject": "god",
        "action": "lie",
        "target": "anyone",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "kings_lying_spirit",
        "entityId": "god",
        "verse": {
          "book": "1 Kings",
          "chapter": 22,
          "verse": 23,
          "reference": "1 Kings 22:23"
        },
        "violatesRule": "rule_god_cannot_lie",
        "violationExplanation": "Micaiah's verdict on Ahab's prophets: 'the LORD has put a lying spirit in the mouths of all these prophets of yours.' The lie those prophets speak is false prophecy, and its author, by the prophet's own account, is the LORD.",
        "severity": 3,
        "verdict": "CONTRADICTION — God authors a lying spirit's message."
      },
      {
        "id": "thess_delusion",
        "entityId": "god",
        "verse": {
          "book": "2 Thessalonians",
          "chapter": 2,
          "verse": 11,
          "reference": "2 Thessalonians 2:11"
        },
        "violatesRule": "rule_god_cannot_lie",
        "violationExplanation": "Paul: 'For this reason God will send them a powerful delusion so that they believe the lie.' The delusion is sent by God, and its stated purpose is that its victims believe something false.",
        "severity": 3,
        "verdict": "CONTRADICTION — God sends a delusion whose purpose is belief in a lie."
      }
    ],
    "severity": 3,
    "verdict": "Hebrews makes it a definition: it is impossible for God to lie. Kings has the LORD placing a lying spirit in His own prophets' mouths to deceive a king to his death. Thessalonians has God sending a powerful delusion so that people will believe the lie. A God who cannot lie is doing the lying by instrument in both accounts.",
    "scoreImpact": -2.0
  },
]
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
    "id": "who_baptized",
    "title": "Who Baptized?",
    "summary": "Checks John 3:22 — Jesus spent time with His disciples and baptized — against John 4:2, the same Gospel's correction: it was not Jesus who baptized, but His disciples.",
    "ruleVerse": {
      "book": "John",
      "chapter": 3,
      "verse": 22,
      "reference": "John 3:22"
    },
    "rulesItDefines": [
      {
        "id": "rule_jesus_baptized",
        "statement": "Jesus baptized.",
        "plain": "John's narrator states it plainly: Jesus went into the Judean countryside, 'where He spent some time with them and baptized.' John's disciples repeat it in 3:26: 'He is baptizing, and everyone is going to Him.'",
        "subject": "jesus",
        "action": "baptize",
        "target": "disciples",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "not_jesus",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 4,
          "verse": 2,
          "reference": "John 4:2"
        },
        "violatesRule": "rule_jesus_baptized",
        "violationExplanation": "Two chapters after stating that Jesus baptized — and one verse after repeating that He was 'gaining and baptizing more disciples than John' (4:1) — the narrator stops to correct the record in a parenthesis: '(although it was not Jesus who baptized, but His disciples).' The correction negates the earlier statement in the same Gospel, by the same narrator.",
        "severity": 2,
        "verdict": "CONTRADICTION — John 4:2 takes back what John 3:22 stated: it was not Jesus who baptized."
      }
    ],
    "severity": 2,
    "verdict": "John's Gospel states that Jesus baptized, builds a comparison with John the Baptist on it, and then corrects itself in a parenthesis: it was not Jesus who baptized at all. Both versions stand in the finished text, two chapters apart.",
    "scoreImpact": -0.5
  },
]
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
    "id": "empty_tomb",
    "title": "The Empty Tomb Count",
    "summary": "Checks Matthew 28:2 — one angel, who sat on the stone — against the other Gospels' figures at the tomb: two angels, two men, one young man.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 28,
      "verse": 2,
      "reference": "Matthew 28:2"
    },
    "rulesItDefines": [
      {
        "id": "rule_one_angel",
        "statement": "One angel descended from heaven, rolled away the stone, and sat on it.",
        "plain": "Matthew's account: a single angel, outside the tomb, seated on the stone he had rolled away.",
        "subject": "angel",
        "action": "sit",
        "target": "heaven",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "john_two_angels",
        "entityId": "angel",
        "verse": {
          "book": "John",
          "chapter": 20,
          "verse": 12,
          "reference": "John 20:12"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Mary sees 'two angels in white sitting where the body of Jesus had lain, one at the head and the other at the feet.' Two figures, not one — and inside the tomb, not seated on the stone.",
        "severity": 2,
        "verdict": "CONTRADICTION — John counts two angels, inside the tomb."
      },
      {
        "id": "luke_two_men",
        "entityId": "angel",
        "verse": {
          "book": "Luke",
          "chapter": 24,
          "verse": 4,
          "reference": "Luke 24:4"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Luke: 'suddenly two men in radiant apparel stood beside them.' Two figures again, described as men, standing beside the women — not one angel seated on the stone.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke counts two men, standing."
      },
      {
        "id": "mark_young_man",
        "entityId": "angel",
        "verse": {
          "book": "Mark",
          "chapter": 16,
          "verse": 5,
          "reference": "Mark 16:5"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Mark agrees on the count — one figure — and disagrees on everything else: 'a young man dressed in a white robe sitting on the right side' inside the tomb, not the angel of Matthew's account seated on the stone outside it.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's one figure is a young man inside the tomb, not Matthew's angel on the stone."
      }
    ],
    "severity": 2,
    "verdict": "Four Gospels visit the same tomb on the same morning and file four different reports of who was there: one angel on the stone, two angels inside, two men standing by, one young man within. The count never survives two tellings in a row.",
    "scoreImpact": -0.5
  },
]
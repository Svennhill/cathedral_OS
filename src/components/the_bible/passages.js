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
    "id": "stephens_tomb",
    "title": "Stephen's Tomb",
    "summary": "Checks Genesis 49:30 — Abraham purchased his burial field from Ephron the Hittite, at Machpelah — against Acts 7:16, where Stephen says Abraham bought the tomb from the sons of Hamor, at Shechem.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 49,
      "verse": 30,
      "reference": "Genesis 49:30"
    },
    "rulesItDefines": [
      {
        "id": "rule_ephron_purchase",
        "statement": "Abraham purchased the field and cave at Machpelah from Ephron the Hittite as a burial site.",
        "plain": "Jacob states it on his deathbed: 'This is the field Abraham purchased from Ephron the Hittite as a burial site' — the cave in the field of Machpelah, near Mamre, in Canaan. Genesis 23 records the purchase itself, from Ephron, in detail.",
        "subject": "abraham",
        "action": "purchase",
        "target": "ephron",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "acts_hamor",
        "entityId": "stephen",
        "verse": {
          "book": "Acts",
          "chapter": 7,
          "verse": 16,
          "reference": "Acts 7:16"
        },
        "violatesRule": "rule_ephron_purchase",
        "violationExplanation": "Stephen places the patriarchs' bones 'in the tomb that Abraham had bought from the sons of Hamor at Shechem.' Wrong seller and wrong place: the sons of Hamor sold a field to Jacob, at Shechem, generations later (Genesis 33:19); Abraham bought his tomb from Ephron the Hittite, at Machpelah. Stephen's sentence fuses the two purchases into one that neither account records.",
        "severity": 2,
        "verdict": "CONTRADICTION — Stephen gives Abraham Hamor's sons, at Shechem, as his sellers."
      }
    ],
    "severity": 2,
    "verdict": "Abraham's one recorded tomb purchase is from Ephron the Hittite, at Machpelah — recorded at the time in Genesis 23 and restated by Jacob in Genesis 49. Stephen's history gives Abraham a different seller (the sons of Hamor) in a different city (Shechem): the purchase Jacob made, credited to Abraham.",
    "scoreImpact": -0.5
  },
]
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
    "id": "absaloms_sons",
    "title": "Absalom's Sons",
    "summary": "Checks 2 Samuel 14:27 \u2014 three sons were born to Absalom \u2014 against 2 Samuel 18:18, where Absalom says: I have no son.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 14,
      "verse": 27,
      "reference": "2 Samuel 14:27"
    },
    "rulesItDefines": [
      {
        "id": "rule_three_sons",
        "statement": "Three sons were born to Absalom.",
        "plain": "2 Samuel's narrator states it as record: 'Three sons were born to Absalom, and a daughter named Tamar.'",
        "subject": "absalom",
        "action": "father",
        "target": "sons",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "absalom_no_son",
        "entityId": "absalom",
        "verse": {
          "book": "2 Samuel",
          "chapter": 18,
          "verse": 18,
          "reference": "2 Samuel 18:18"
        },
        "violatesRule": "rule_three_sons",
        "violationExplanation": "Four chapters later the same book explains Absalom's monument with his own words: he set up the pillar 'for he had said, \"I have no son to preserve the memory of my name.\"' The narrator's record and the man's own stated reason cannot both stand \u2014 either three sons were born to him, or he had no son.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Absalom says he has no son; the record gave him three."
      }
    ],
    "severity": 2,
    "verdict": "The same book, the same man. Chapter 14 records three sons born to Absalom. Chapter 18 records Absalom explaining his monument on the ground that he has no son at all. Nothing in the text records the sons dying, or the statement being mistaken.",
    "scoreImpact": -0.5
  },
]
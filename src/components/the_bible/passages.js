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
    "id": "no_one_seen_god",
    "title": "No One Has Seen God",
    "summary": "Checks John 1:18 — no one has ever seen God — against Exodus 24:10, Numbers 12:8, and Isaiah 6:1, where men see Him.",
    "ruleVerse": {
      "book": "John",
      "chapter": 1,
      "verse": 18,
      "reference": "John 1:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_never_seen",
        "statement": "No one has ever seen God.",
        "plain": "John's claim is universal and past-tense: 'No one has ever seen God.' No exception is offered for elders, prophets, or Moses.",
        "subject": "god",
        "action": "be_seen",
        "target": "human",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "elders_saw",
        "entityId": "moses",
        "verse": {
          "book": "Exodus",
          "chapter": 24,
          "verse": 10,
          "reference": "Exodus 24:10"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "Moses leads Aaron, Nadab, Abihu, and seventy elders up the mountain, and Exodus reports it in plain narration: 'and they saw the God of Israel.' Not a vision of glory or a form — they saw the God of Israel, and ate and drank (verse 11).",
        "severity": 3,
        "verdict": "CONTRADICTION — Seventy-four men saw God at Sinai."
      },
      {
        "id": "moses_form",
        "entityId": "moses",
        "verse": {
          "book": "Numbers",
          "chapter": 12,
          "verse": 8,
          "reference": "Numbers 12:8"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "God Himself describes Moses's access: 'I speak with him face to face, clearly and not in riddles; he sees the form of the LORD.' God states, in His own words, that Moses sees His form.",
        "severity": 3,
        "verdict": "CONTRADICTION — God says Moses sees His form."
      },
      {
        "id": "isaiah_saw",
        "entityId": "isaiah",
        "verse": {
          "book": "Isaiah",
          "chapter": 6,
          "verse": 1,
          "reference": "Isaiah 6:1"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "Isaiah opens his temple vision with a flat claim: 'In the year that King Uzziah died, I saw the Lord seated on a throne, high and exalted.' A prophet states in the first person that he saw the Lord.",
        "severity": 3,
        "verdict": "CONTRADICTION — Isaiah says he saw the Lord."
      }
    ],
    "severity": 3,
    "verdict": "John 1:18 states the rule absolutely: no one has ever seen God. The Old Testament records the elders of Israel seeing the God of Israel at Sinai, God testifying that Moses sees His form, and Isaiah testifying that he saw the Lord. The 'ever' does not survive its own canon.",
    "scoreImpact": -2.0
  },
]
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
    "id": "noah_animals",
    "title": "Two of Every Kind?",
    "summary": "Checks Genesis 6:19 — two of every living creature into the ark — against Genesis 7:2-3, where the clean animals and birds board seven pairs at a time.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 6,
      "verse": 19,
      "reference": "Genesis 6:19"
    },
    "rulesItDefines": [
      {
        "id": "rule_two_of_every",
        "statement": "Two of every living creature — male and female — are to be brought into the ark.",
        "plain": "The manifest as first given: two of everything, a pair of each kind.",
        "subject": "noah",
        "action": "bring",
        "target": "human",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "seven_pairs_clean",
        "entityId": "noah",
        "verse": {
          "book": "Genesis",
          "chapter": 7,
          "verse": 2,
          "reference": "Genesis 7:2"
        },
        "violatesRule": "rule_two_of_every",
        "violationExplanation": "One chapter later the manifest is rewritten: 'seven pairs of every kind of clean animal, a male and its mate; a pair of every kind of unclean animal.' For clean animals the count is seven pairs, not the two of every kind the first instruction set.",
        "severity": 2,
        "verdict": "CONTRADICTION — clean animals board seven pairs at a time, not two."
      },
      {
        "id": "seven_pairs_birds",
        "entityId": "noah",
        "verse": {
          "book": "Genesis",
          "chapter": 7,
          "verse": 3,
          "reference": "Genesis 7:3"
        },
        "violatesRule": "rule_two_of_every",
        "violationExplanation": "The revision extends to the birds: 'seven pairs of every kind of bird of the air, male and female' — again seven pairs where the original manifest allowed two.",
        "severity": 2,
        "verdict": "CONTRADICTION — the birds also board seven pairs at a time."
      }
    ],
    "severity": 2,
    "verdict": "The ark's manifest is issued twice. The first version admits two of every living creature; the second admits seven pairs of the clean animals and the birds. Both instructions come from the same speaker, one chapter apart.",
    "scoreImpact": -0.5
  },
]

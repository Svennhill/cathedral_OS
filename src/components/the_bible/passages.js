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
    "id": "priest_at_nob",
    "title": "The Priest at Nob",
    "summary": "Checks 1 Samuel 21:1 \u2014 David came to Ahimelech the priest \u2014 against Mark 2:26, where Jesus dates the same visit to the high priesthood of Abiathar.",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 21,
      "verse": 1,
      "reference": "1 Samuel 21:1"
    },
    "rulesItDefines": [
      {
        "id": "rule_ahimelech_priest",
        "statement": "The priest who received David at Nob was Ahimelech.",
        "plain": "1 Samuel names him at the head of the episode: 'Then David came to Nob, to Ahimelech the priest.' It is Ahimelech who gives David the consecrated bread in the verses that follow.",
        "subject": "ahimelech",
        "action": "serve",
        "target": "david",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_abiathar",
        "entityId": "ahimelech",
        "verse": {
          "book": "Mark",
          "chapter": 2,
          "verse": 26,
          "reference": "Mark 2:26"
        },
        "violatesRule": "rule_ahimelech_priest",
        "violationExplanation": "Recounting this same episode \u2014 David entering the house of God and eating the consecrated bread \u2014 Jesus dates it 'during the high priesthood of Abiathar.' Abiathar was Ahimelech's son, who fled to David only after Saul killed his father (1 Samuel 22). At the time of the visit, the priest at Nob was the father, not the son.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Mark dates the visit to Abiathar's priesthood; Samuel names his father Ahimelech."
      }
    ],
    "severity": 2,
    "verdict": "Samuel's account of the consecrated bread names Ahimelech as the priest at Nob, in the first verse of the episode. Jesus's retelling of the same episode in Mark places it under Ahimelech's son Abiathar \u2014 who was not priest yet, and whose flight to David came after his father's death over this very visit.",
    "scoreImpact": -0.5
  },
]
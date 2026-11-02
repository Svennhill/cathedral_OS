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
    "id": "cross_inscription",
    "title": "The Sign on the Cross",
    "summary": "Checks Matthew 27:37's wording of the posted charge — THIS IS JESUS, THE KING OF THE JEWS — against the different wordings given by Mark, Luke, and John for the same sign.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 27,
      "verse": 37,
      "reference": "Matthew 27:37"
    },
    "rulesItDefines": [
      {
        "id": "rule_matthew_sign",
        "statement": "The sign above Jesus's head read: THIS IS JESUS, THE KING OF THE JEWS.",
        "plain": "Matthew quotes the posted charge in full: 'Above His head they posted the written charge against Him: THIS IS JESUS, THE KING OF THE JEWS.'",
        "subject": "jesus",
        "action": "post_charge",
        "target": "sign",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_sign",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 15,
          "verse": 26,
          "reference": "Mark 15:26"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "Mark quotes the same inscription shorter: 'The charge inscribed against Him read: THE KING OF THE JEWS.' No 'this is,' no 'Jesus.' One sign, two texts.",
        "severity": 1,
        "verdict": "CONTRADICTION — Mark's sign omits words Matthew's sign carries."
      },
      {
        "id": "luke_sign",
        "entityId": "jesus",
        "verse": {
          "book": "Luke",
          "chapter": 23,
          "verse": 38,
          "reference": "Luke 23:38"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "Luke quotes it a third way: 'Above Him was posted an inscription: THIS IS THE KING OF THE JEWS.' Matthew's 'Jesus' is gone; Mark's bare title has gained a 'this is.'",
        "severity": 1,
        "verdict": "CONTRADICTION — Luke's sign is a third wording for the same board."
      },
      {
        "id": "john_sign",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 19,
          "verse": 19,
          "reference": "John 19:19"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "John quotes it a fourth way, and names the author: 'Pilate also had a notice posted on the cross. It read: JESUS OF NAZARETH, THE KING OF THE JEWS.' Nazareth appears in no other Gospel's version; 'this is' appears in none of John's.",
        "severity": 1,
        "verdict": "CONTRADICTION — John's sign is a fourth wording, with a word none of the others have."
      }
    ],
    "severity": 1,
    "verdict": "One cross, one posted charge, four Gospels quoting it — and no two quotations match. Matthew: THIS IS JESUS, THE KING OF THE JEWS. Mark: THE KING OF THE JEWS. Luke: THIS IS THE KING OF THE JEWS. John: JESUS OF NAZARETH, THE KING OF THE JEWS. The most public text in the story is the one its recorders cannot reproduce twice the same way.",
    "scoreImpact": -0.1
  },
]
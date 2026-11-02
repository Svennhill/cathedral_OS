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
    "id": "cross_carrier",
    "title": "Who Carried the Cross?",
    "summary": "Checks John 19:17 — Jesus went out carrying His own cross — against the three Synoptic Gospels, where Simon of Cyrene is forced to carry it.",
    "ruleVerse": {
      "book": "John",
      "chapter": 19,
      "verse": 17,
      "reference": "John 19:17"
    },
    "rulesItDefines": [
      {
        "id": "rule_jesus_carried",
        "statement": "Jesus went out to Golgotha carrying His own cross.",
        "plain": "John's account gives the cross to Jesus Himself, with no second carrier mentioned.",
        "subject": "jesus",
        "action": "carry",
        "target": "heaven",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_simon",
        "entityId": "simon",
        "verse": {
          "book": "Mark",
          "chapter": 15,
          "verse": 21,
          "reference": "Mark 15:21"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Mark: Simon of Cyrene 'was passing by on his way in from the country, and the soldiers forced him to carry the cross of Jesus.' The cross John gives to Jesus, Mark gives to a bystander.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's soldiers forced Simon to carry the cross."
      },
      {
        "id": "matthew_simon",
        "entityId": "simon",
        "verse": {
          "book": "Matthew",
          "chapter": 27,
          "verse": 32,
          "reference": "Matthew 27:32"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Matthew agrees with Mark: 'they found a man from Cyrene, named Simon, and they forced him to carry the cross of Jesus.'",
        "severity": 2,
        "verdict": "CONTRADICTION — Matthew also gives the cross to Simon."
      },
      {
        "id": "luke_simon",
        "entityId": "simon",
        "verse": {
          "book": "Luke",
          "chapter": 23,
          "verse": 26,
          "reference": "Luke 23:26"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Luke: 'they seized Simon of Cyrene on his way in from the country, and they put the cross on him to carry behind Jesus.' Three Synoptics, one carrier — and it is not the man John describes carrying it.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke puts the cross on Simon, behind Jesus."
      }
    ],
    "severity": 2,
    "verdict": "John's Jesus carries His own cross out of the city. In Matthew, Mark, and Luke the soldiers take a passing stranger and put the cross on him instead. The accounts cannot be merged without adding a handover none of them records.",
    "scoreImpact": -0.5
  },
]
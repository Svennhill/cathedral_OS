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
    "id": "zebedee_request",
    "title": "Who Brought the Request?",
    "summary": "Checks Matthew 20:20 — the mother of Zebedee's sons came to Jesus to make the request — against Mark 10:35, where James and John come and make it themselves.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 20,
      "verse": 20,
      "reference": "Matthew 20:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_mother_asks",
        "statement": "The request for the seats at Jesus's right and left was brought by the mother of Zebedee's sons.",
        "plain": "Matthew: 'Then the mother of Zebedee's sons came to Jesus with her sons and knelt down to make a request of Him' — and in verse 21 it is she who speaks it: 'Declare that in Your kingdom one of these two sons of mine may sit at Your right hand, and the other at Your left.'",
        "subject": "mother_of_zebedees_sons",
        "action": "request",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_sons_ask",
        "entityId": "zebedees_sons",
        "verse": {
          "book": "Mark",
          "chapter": 10,
          "verse": 35,
          "reference": "Mark 10:35"
        },
        "violatesRule": "rule_mother_asks",
        "violationExplanation": "Mark has no mother in the scene at all: 'Then James and John, the sons of Zebedee, came to Jesus and declared, \"Teacher, we want You to do for us whatever we ask\"' — and in verse 37 they speak the request themselves: 'Grant that one of us may sit at Your right hand.' The petitioner changes between the two accounts of the same conversation.",
        "severity": 2,
        "verdict": "CONTRADICTION — In Mark the sons ask for themselves; Matthew gives the asking to their mother."
      }
    ],
    "severity": 2,
    "verdict": "The request for the two seats is the same in both Gospels, word for word in substance. Who makes it is not: Matthew brings in the boys' mother to kneel and speak it while they stand by; Mark leaves her out entirely and has James and John ask on their own behalf.",
    "scoreImpact": -0.5
  },
]
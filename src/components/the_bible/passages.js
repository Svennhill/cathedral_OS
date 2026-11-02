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
    "id": "inherited_sin",
    "title": "Whose Sin Is It?",
    "summary": "Checks Exodus 20:5 — God visits the iniquity of the fathers on their children to the third and fourth generations — against Ezekiel 18:20: a son will not bear the iniquity of his father.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 20,
      "verse": 5,
      "reference": "Exodus 20:5"
    },
    "rulesItDefines": [
      {
        "id": "rule_visiting_iniquity",
        "statement": "God visits the iniquity of the fathers on their children, to the third and fourth generations.",
        "plain": "In the Ten Commandments God states His own practice: 'I, the LORD your God, am a jealous God, visiting the iniquity of the fathers on their children to the third and fourth generations of those who hate Me.'",
        "subject": "god",
        "action": "visit_iniquity",
        "target": "children",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "ezekiel_each_his_own",
        "entityId": "ezekiel",
        "verse": {
          "book": "Ezekiel",
          "chapter": 18,
          "verse": 20,
          "reference": "Ezekiel 18:20"
        },
        "violatesRule": "rule_visiting_iniquity",
        "violationExplanation": "Ezekiel states the opposite as God's own ruling, in a chapter given to overturning the proverb about fathers' sins landing on sons: 'The soul who sins is the one who will die. A son will not bear the iniquity of his father.' What Exodus says God does to the third and fourth generations, Ezekiel says does not happen to a son at all.",
        "severity": 3,
        "verdict": "CONTRADICTION — Ezekiel: a son will not bear his father's iniquity. Exodus: God visits it on him."
      }
    ],
    "severity": 3,
    "verdict": "Exodus has God announce, inside the Ten Commandments, that He visits the fathers' iniquity on their children for generations. Ezekiel has God announce that a son will not bear his father's iniquity — that the soul who sins is the one who will die. Both are presented as God's stated policy on the same question.",
    "scoreImpact": -2.0
  },
]
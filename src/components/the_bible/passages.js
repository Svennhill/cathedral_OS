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
    "id": "god_changes_mind",
    "title": "The Mind of God",
    "summary": "Checks Numbers 23:19 — God does not change His mind — against the passages where the LORD regrets what He has done.",
    "ruleVerse": {
      "book": "Numbers",
      "chapter": 23,
      "verse": 19,
      "reference": "Numbers 23:19"
    },
    "rulesItDefines": [
      {
        "id": "rule_no_mind_change",
        "statement": "God is not a man, that He should lie, nor a son of man, that He should change His mind.",
        "plain": "Changing His mind is something God, by His own statement, does not do.",
        "subject": "god",
        "action": "change_mind",
        "target": "god",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "flood_regret",
        "entityId": "god",
        "verse": {
          "book": "Genesis",
          "chapter": 6,
          "verse": 6,
          "reference": "Genesis 6:6"
        },
        "violatesRule": "rule_no_mind_change",
        "violationExplanation": "Before the flood: 'the LORD regretted that He had made man on the earth, and He was grieved in His heart.' Regret over a settled act is the rule's prohibited act, in narrative form.",
        "severity": 3,
        "verdict": "CONTRADICTION — the LORD regretted making man."
      },
      {
        "id": "saul_regret",
        "entityId": "god",
        "verse": {
          "book": "1 Samuel",
          "chapter": 15,
          "verse": 35,
          "reference": "1 Samuel 15:35"
        },
        "violatesRule": "rule_no_mind_change",
        "violationExplanation": "'The LORD regretted that He had made Saul king over Israel.' A second recorded regret, over a second settled decision.",
        "severity": 3,
        "verdict": "CONTRADICTION — the LORD regretted making Saul king."
      },
      {
        "id": "glory_of_israel",
        "entityId": "god",
        "verse": {
          "book": "1 Samuel",
          "chapter": 15,
          "verse": 29,
          "reference": "1 Samuel 15:29"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — Samuel restates the rule verbatim: the Glory of Israel 'does not lie or change His mind.' Six verses before the same chapter records the regret."
      }
    ],
    "severity": 3,
    "verdict": "The rule is stated twice, in Numbers and again in 1 Samuel 15:29. The regret is also recorded twice — once before the flood, and once in 1 Samuel 15:35, in the same chapter that restates the rule.",
    "scoreImpact": -2.0
  },
]
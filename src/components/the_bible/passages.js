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
    "id": "destroy_delight",
    "title": "Does God Delight in Destroying?",
    "summary": "Checks Deuteronomy 28:63 — it will please the LORD to annihilate and destroy you — against Ezekiel 33:11, God's oath that He takes no pleasure in the death of the wicked, and Lamentations 3:33, that He does not willingly afflict.",
    "ruleVerse": {
      "book": "Deuteronomy",
      "chapter": 28,
      "verse": 63,
      "reference": "Deuteronomy 28:63"
    },
    "rulesItDefines": [
      {
        "id": "rule_pleased_to_destroy",
        "statement": "It will please the LORD to annihilate and destroy His disobedient people.",
        "plain": "The covenant curse states God's pleasure in both directions: 'Just as it pleased the LORD to make you prosper and multiply, so also it will please Him to annihilate you and destroy you.'",
        "subject": "god",
        "action": "destroy",
        "target": "israel",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "ezekiel_no_pleasure",
        "entityId": "god",
        "verse": {
          "book": "Ezekiel",
          "chapter": 33,
          "verse": 11,
          "reference": "Ezekiel 33:11"
        },
        "violatesRule": "rule_pleased_to_destroy",
        "violationExplanation": "God swears against the attribute Deuteronomy assigns Him: '“As surely as I live, declares the Lord GOD, I take no pleasure in the death of the wicked, but rather that the wicked should turn from their ways and live.”' An oath, in the first person, that the pleasure Deuteronomy promises does not exist.",
        "severity": 3,
        "verdict": "CONTRADICTION — Ezekiel's God swears He takes no such pleasure."
      },
      {
        "id": "lamentations_not_willingly",
        "entityId": "god",
        "verse": {
          "book": "Lamentations",
          "chapter": 3,
          "verse": 33,
          "reference": "Lamentations 3:33"
        },
        "violatesRule": "rule_pleased_to_destroy",
        "violationExplanation": "Lamentations states the same limit as character: 'For He does not willingly afflict or grieve the sons of men.' Destruction that pleases and destruction that is unwilling cannot describe the same act of the same God.",
        "severity": 3,
        "verdict": "CONTRADICTION — Lamentations: He does not afflict willingly, let alone with pleasure."
      }
    ],
    "severity": 3,
    "verdict": "Deuteronomy promises Israel that their destruction will please God the way their prosperity did. Ezekiel records God swearing by His own life that He takes no pleasure in the death of the wicked. Lamentations adds that He does not even afflict willingly. The covenant curse and the sworn oath describe opposite Gods.",
    "scoreImpact": -2.0
  },
]
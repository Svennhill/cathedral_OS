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
    "id": "josiahs_death",
    "title": "Josiah's Peaceful Death",
    "summary": "Checks 2 Kings 22:20 — God's promise that Josiah would be gathered to his grave in peace — against the battle reports: killed by Pharaoh Neco at Megiddo (2 Kings 23:29), or carried wounded to die in Jerusalem (2 Chronicles 35:24).",
    "ruleVerse": {
      "book": "2 Kings",
      "chapter": 22,
      "verse": 20,
      "reference": "2 Kings 22:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_grave_in_peace",
        "statement": "Josiah would be gathered to his grave in peace.",
        "plain": "The prophetess Huldah delivers God's word to the king: 'you will be gathered to your grave in peace. Your eyes will not see all the calamity that I will bring on this place.'",
        "subject": "josiah",
        "action": "die",
        "target": "peace",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "killed_megiddo",
        "entityId": "josiah",
        "verse": {
          "book": "2 Kings",
          "chapter": 23,
          "verse": 29,
          "reference": "2 Kings 23:29"
        },
        "violatesRule": "rule_grave_in_peace",
        "violationExplanation": "Josiah's end, in the same book that carries the promise: he marched out to confront Pharaoh Neco, 'but Neco faced him and killed him at Megiddo.' A king killed in battle by a foreign pharaoh has not been gathered to his grave in peace in any sense the word carries.",
        "severity": 2,
        "verdict": "CONTRADICTION — The promised peaceful gathering ends in a battlefield killing."
      },
      {
        "id": "died_jerusalem",
        "entityId": "josiah",
        "verse": {
          "book": "2 Chronicles",
          "chapter": 35,
          "verse": 24,
          "reference": "2 Chronicles 35:24"
        },
        "violatesRule": "rule_grave_in_peace",
        "violationExplanation": "Chronicles agrees the death was violent — archers shot the king (35:23) — and moves it: his servants 'brought him to Jerusalem, where he died.' Wounded at Megiddo, dead at Jerusalem: the place of death itself changes between the two accounts of the promise's failure.",
        "severity": 2,
        "verdict": "CONTRADICTION — Chronicles also kills him violently, but in a different city."
      }
    ],
    "severity": 2,
    "verdict": "God promises Josiah a grave gathered in peace. Kings has him killed by Pharaoh Neco at Megiddo; Chronicles has him shot by archers and carried off to die in Jerusalem. The promise fails in both accounts — which cannot even agree on where the failure happened.",
    "scoreImpact": -0.5
  },
]
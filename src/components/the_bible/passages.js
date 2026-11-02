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
    "id": "sauls_death",
    "title": "How Did Saul Die?",
    "summary": "Checks 1 Samuel 31:4 — Saul fell on his own sword — against 2 Samuel 1:10, where a messenger tells David: I stood over him and killed him.",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 31,
      "verse": 4,
      "reference": "1 Samuel 31:4"
    },
    "rulesItDefines": [
      {
        "id": "rule_saul_suicide",
        "statement": "Saul took his own sword and fell on it.",
        "plain": "1 Samuel's account: Saul's armor-bearer refused to run him through, so Saul fell on his own sword and died by his own hand.",
        "subject": "saul",
        "action": "fall_on_sword",
        "target": "saul",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "amalekite_kill",
        "entityId": "saul",
        "verse": {
          "book": "2 Samuel",
          "chapter": 1,
          "verse": 10,
          "reference": "2 Samuel 1:10"
        },
        "violatesRule": "rule_saul_suicide",
        "violationExplanation": "The Amalekite messenger reports the same death to David in the first person: 'So I stood over him and killed him, because I knew that after he had fallen he could not survive.' David accepts the report and executes him on the strength of it (2 Samuel 1:16). If the messenger killed Saul, Saul did not die by his own sword; if Saul died by his own sword, the messenger killed no one.",
        "severity": 2,
        "verdict": "CONTRADICTION — 2 Samuel's messenger says he killed Saul himself."
      },
      {
        "id": "chronicles_saul",
        "entityId": "saul",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 10,
          "verse": 4,
          "reference": "1 Chronicles 10:4"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — Chronicles repeats the rule account word for word: Saul took his own sword and fell on it. The rule restated by a second book."
      }
    ],
    "severity": 2,
    "verdict": "1 Samuel and 1 Chronicles agree: Saul died by his own hand, on his own sword, after his armor-bearer refused. 2 Samuel opens with a man standing before David claiming the kill as his own act — and David has him executed for it. One death, two killers named.",
    "scoreImpact": -0.5
  },
]
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
    "id": "none_righteous",
    "title": "No One Righteous?",
    "summary": "Checks Romans 3:10 \u2014 there is no one righteous, not even one \u2014 against Luke 1:6, where Zechariah and Elizabeth are righteous in the sight of God, and Genesis 6:9, where Noah is a righteous man, blameless in his generation.",
    "ruleVerse": {
      "book": "Romans",
      "chapter": 3,
      "verse": 10,
      "reference": "Romans 3:10"
    },
    "rulesItDefines": [
      {
        "id": "rule_none_righteous",
        "statement": "There is no one righteous, not even one.",
        "plain": "Paul states it as written scripture and universal fact: 'There is no one righteous, not even one.' The category has zero members.",
        "subject": "human",
        "action": "be_righteous",
        "target": "anyone",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "luke_righteous_pair",
        "entityId": "elizabeth",
        "verse": {
          "book": "Luke",
          "chapter": 1,
          "verse": 6,
          "reference": "Luke 1:6"
        },
        "violatesRule": "rule_none_righteous",
        "violationExplanation": "Luke introduces John the Baptist's parents with the verdict Paul says no one can receive: 'Both of them were righteous in the sight of God, walking blamelessly in all the commandments and decrees of the Lord.' In the sight of God \u2014 the very vantage Romans writes from.",
        "severity": 3,
        "verdict": "CONTRADICTION \u2014 Luke counts two righteous where Paul counts none."
      },
      {
        "id": "genesis_noah",
        "entityId": "noah",
        "verse": {
          "book": "Genesis",
          "chapter": 6,
          "verse": 9,
          "reference": "Genesis 6:9"
        },
        "violatesRule": "rule_none_righteous",
        "violationExplanation": "Genesis introduces Noah with the same verdict: 'Noah was a righteous man, blameless in his generation; Noah walked with God.' Paul's quotation is drawn from the Psalms of this same canon, which elsewhere fills the empty category by name.",
        "severity": 3,
        "verdict": "CONTRADICTION \u2014 Genesis names a righteous man where Paul allows none."
      }
    ],
    "severity": 3,
    "verdict": "Romans empties the category completely: no one righteous, not even one. Luke fills it with a priest and his wife, righteous in God's own sight, blameless in every commandment. Genesis fills it with Noah. The universal statement and the named exceptions are both presented as fact.",
    "scoreImpact": -2.0
  },
]
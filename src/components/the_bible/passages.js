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
    "id": "name_not_known",
    "title": "The Name Not Known",
    "summary": "Checks Exodus 6:3 — God says that by His name the LORD He did not make Himself known to Abraham, Isaac, and Jacob — against Genesis 15:7 and 28:13, where He introduces Himself to Abraham and to Jacob by exactly that name.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 6,
      "verse": 3,
      "reference": "Exodus 6:3"
    },
    "rulesItDefines": [
      {
        "id": "rule_name_unknown",
        "statement": "God did not make Himself known to the patriarchs by His name the LORD (YHWH).",
        "plain": "God states His own revelation history to Moses: 'I appeared to Abraham, to Isaac, and to Jacob as God Almighty, but by My name the LORD I did not make Myself known to them.'",
        "subject": "god",
        "action": "reveal_name",
        "target": "patriarchs",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "genesis_abram_name",
        "entityId": "abraham",
        "verse": {
          "book": "Genesis",
          "chapter": 15,
          "verse": 7,
          "reference": "Genesis 15:7"
        },
        "violatesRule": "rule_name_unknown",
        "violationExplanation": "Generations before Exodus, God opens a speech to Abram with the name He later says He never made known to him: 'I am the LORD, who brought you out of Ur of the Chaldeans to give you this land to possess.'",
        "severity": 3,
        "verdict": "CONTRADICTION — God tells Abram 'I am the LORD' in Genesis."
      },
      {
        "id": "genesis_jacob_name",
        "entityId": "jacob",
        "verse": {
          "book": "Genesis",
          "chapter": 28,
          "verse": 13,
          "reference": "Genesis 28:13"
        },
        "violatesRule": "rule_name_unknown",
        "violationExplanation": "To Jacob at Bethel, the same introduction: 'I am the LORD, the God of your father Abraham and the God of Isaac.' Jacob is one of the three men Exodus 6:3 names as not having been made known the name.",
        "severity": 3,
        "verdict": "CONTRADICTION — God tells Jacob 'I am the LORD' in Genesis."
      }
    ],
    "severity": 3,
    "verdict": "Exodus 6:3 is God's own account of what He had and had not revealed: as God Almighty He appeared to the patriarchs; by the name LORD He did not make Himself known to them. Genesis records Him introducing Himself by that name, in direct speech, to Abraham and to Jacob both.",
    "scoreImpact": -2.0
  },
]

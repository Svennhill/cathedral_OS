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

export const PASSAGES = [{
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
    "id": "incited_david",
    "title": "Who Incited David?",
    "summary": "Checks 2 Samuel 24:1, where the LORD stirs David up to take a census, against 1 Chronicles 21:1, where Satan does it.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 24,
      "verse": 1,
      "reference": "2 Samuel 24:1"
    },
    "rulesItDefines": [
      {
        "id": "rule_lord_incited",
        "statement": "It was the LORD who incited David to number Israel.",
        "plain": "The census was God's idea before it was David's act: His anger burned, and He stirred David up to do it.",
        "subject": "god",
        "action": "incite",
        "target": "david",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "satan_incited",
        "entityId": "david",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 21,
          "verse": 1,
          "reference": "1 Chronicles 21:1"
        },
        "violatesRule": "rule_lord_incited",
        "violationExplanation": "The same census, retold: 'Then Satan rose up against Israel and incited David to take a census of Israel.' One act, two inciters — the LORD in Samuel, Satan in Chronicles.",
        "severity": 2,
        "verdict": "CONTRADICTION — Chronicles credits Satan with the incitement Samuel credits to the LORD."
      },
      {
        "id": "david_confesses",
        "entityId": "david",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 21,
          "verse": 8,
          "reference": "1 Chronicles 21:8"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — David confesses the census as his own sin; the verse names no inciter and breaks no rule."
      }
    ],
    "severity": 2,
    "verdict": "Samuel and Chronicles agree that David numbered Israel and that it was sin. They do not agree on whose idea it was — and both candidates are named in the text, one verse each.",
    "scoreImpact": -0.5
  },
{
    "id": "abiathar_priests",
    "title": "Banished, but Still Priest?",
    "summary": "Checks 1 Kings 2:27 \u2014 Solomon banished Abiathar from the priesthood of the LORD \u2014 against 1 Kings 4:4, Solomon's own officials list in the same book: Zadok and Abiathar were priests.",
    "ruleVerse": {
      "book": "1 Kings",
      "chapter": 2,
      "verse": 27,
      "reference": "1 Kings 2:27"
    },
    "rulesItDefines": [
      {
        "id": "rule_abiathar_banished",
        "statement": "Solomon banished Abiathar from the priesthood of the LORD.",
        "plain": "Kings states the removal and its finality: 'So Solomon banished Abiathar from the priesthood of the LORD and thus fulfilled the word that the LORD had spoken at Shiloh against the house of Eli.'",
        "subject": "abiathar",
        "action": "serve",
        "target": "priesthood",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "kings_officials_list",
        "entityId": "abiathar",
        "verse": {
          "book": "1 Kings",
          "chapter": 4,
          "verse": 4,
          "reference": "1 Kings 4:4"
        },
        "violatesRule": "rule_abiathar_banished",
        "violationExplanation": "Two chapters later, Solomon's official roster for the settled reign: 'Benaiah son of Jehoiada was in charge of the army; Zadok and Abiathar were priests.' The banished man holds the office he was banished from, in the same book, under the king who banished him.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 The banished Abiathar is listed among Solomon's priests."
      }
    ],
    "severity": 2,
    "verdict": "1 Kings removes Abiathar from the priesthood as the fulfillment of prophecy \u2014 and then, in its own list of Solomon's officials, seats Abiathar among the priests. (A different Abiathar problem from The Priest at Nob: there, Mark assigns his father's episode to him; here, Kings cannot decide whether Solomon fired him.)",
    "scoreImpact": -0.5
  },
]

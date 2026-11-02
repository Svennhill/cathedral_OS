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
    "id": "jericho_blind_men",
    "title": "The Blind Men of Jericho",
    "summary": "Checks Matthew 20:30 — two blind men beside the road out of Jericho — against Mark 10:46 and Luke 18:35, where one blind man sits there.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 20,
      "verse": 30,
      "reference": "Matthew 20:30"
    },
    "rulesItDefines": [
      {
        "id": "rule_two_blind",
        "statement": "Two blind men were sitting beside the road as Jesus left Jericho.",
        "plain": "Matthew counts them and quotes them together: 'there were two blind men sitting beside the road. When they heard that Jesus was passing by, they cried out, \"Lord, Son of David, have mercy on us!\"'",
        "subject": "bartimaeus",
        "action": "cry_out",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_bartimaeus",
        "entityId": "bartimaeus",
        "verse": {
          "book": "Mark",
          "chapter": 10,
          "verse": 46,
          "reference": "Mark 10:46"
        },
        "violatesRule": "rule_two_blind",
        "violationExplanation": "Mark tells the same departure from Jericho with one man, named and singled out: 'as Jesus and His disciples were leaving Jericho with a large crowd, a blind beggar named Bartimaeus, the son of Timaeus, was sitting beside the road.' The healing that follows is one man's, throughout.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark counts one blind man, and names him."
      },
      {
        "id": "luke_one_blind",
        "entityId": "bartimaeus",
        "verse": {
          "book": "Luke",
          "chapter": 18,
          "verse": 35,
          "reference": "Luke 18:35"
        },
        "violatesRule": "rule_two_blind",
        "violationExplanation": "Luke also counts one — 'a blind man was sitting beside the road, begging' — and moves the scene to the other end of the visit: 'As Jesus drew near to Jericho,' not as He left it. One man instead of two, on arrival instead of departure.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke counts one blind man, met on the way in, not out."
      }
    ],
    "severity": 2,
    "verdict": "Matthew's road out of Jericho has two blind men crying out together, and both are healed. Mark's same road has one, Bartimaeus. Luke's has one again — met while Jesus is still arriving. The crowd, the cry, and the healing agree; the number of men and the direction of travel do not.",
    "scoreImpact": -0.5
  },
]

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
    "id": "crucifixion_hour",
    "title": "The Hour of the Crucifixion",
    "summary": "Checks Mark 15:25 \u2014 it was the third hour when they crucified Him \u2014 against John 19:14, where at about the sixth hour Jesus is still standing before Pilate.",
    "ruleVerse": {
      "book": "Mark",
      "chapter": 15,
      "verse": 25,
      "reference": "Mark 15:25"
    },
    "rulesItDefines": [
      {
        "id": "rule_third_hour",
        "statement": "Jesus was crucified at the third hour.",
        "plain": "Mark timestamps the crucifixion itself: 'It was the third hour when they crucified Him.'",
        "subject": "jesus",
        "action": "crucify",
        "target": "third_hour",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "john_sixth_hour",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 19,
          "verse": 14,
          "reference": "John 19:14"
        },
        "violatesRule": "rule_third_hour",
        "violationExplanation": "John timestamps the trial's climax three hours later: 'It was the day of Preparation for the Passover, about the sixth hour. And Pilate said to the Jews, \"Here is your King!\"' The handover and the road to Golgotha still follow in John's account. At the hour Mark already has Jesus on the cross, John has Him not yet sentenced.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 At John's sixth hour the trial is still running; at Mark's third hour the crucifixion is done."
      }
    ],
    "severity": 2,
    "verdict": "Mark puts the crucifixion at the third hour. John's narrative reaches the sixth hour with Pilate still presenting Jesus to the crowd \u2014 the sentencing, the handover, and the procession all still to come. The two timelines overlap by three hours at the one moment both claim to clock.",
    "scoreImpact": -0.5
  },
]
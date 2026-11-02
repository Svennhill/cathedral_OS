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
    "id": "census_numbers",
    "title": "The Census Numbers",
    "summary": "Compares Joab's reported census totals: 2 Samuel 24:9 against 1 Chronicles 21:5 — the same count, two sets of figures.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 24,
      "verse": 9,
      "reference": "2 Samuel 24:9"
    },
    "rulesItDefines": [
      {
        "id": "rule_census_totals",
        "statement": "The census found 800,000 men of valor in Israel and 500,000 in Judah.",
        "plain": "Joab's report, as Samuel records it: eight hundred thousand in Israel, five hundred thousand in Judah.",
        "subject": "joab",
        "action": "report",
        "target": "david",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_totals",
        "entityId": "joab",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 21,
          "verse": 5,
          "reference": "1 Chronicles 21:5"
        },
        "violatesRule": "rule_census_totals",
        "violationExplanation": "Joab's report as Chronicles records it: 1,100,000 men in all Israel, including 470,000 in Judah. Israel's total is 300,000 higher and Judah's 30,000 lower than Samuel's figures for the same census.",
        "severity": 1,
        "verdict": "CONTRADICTION — the same report carries two different sets of numbers."
      }
    ],
    "severity": 1,
    "verdict": "One census, one commander, one report — and two totals that cannot both be the count. A scribal-scale discrepancy, recorded at full size.",
    "scoreImpact": -0.1
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
{
    "id": "absaloms_sons",
    "title": "Absalom's Sons",
    "summary": "Checks 2 Samuel 14:27 \u2014 three sons were born to Absalom \u2014 against 2 Samuel 18:18, where Absalom says: I have no son.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 14,
      "verse": 27,
      "reference": "2 Samuel 14:27"
    },
    "rulesItDefines": [
      {
        "id": "rule_three_sons",
        "statement": "Three sons were born to Absalom.",
        "plain": "2 Samuel's narrator states it as record: 'Three sons were born to Absalom, and a daughter named Tamar.'",
        "subject": "absalom",
        "action": "father",
        "target": "sons",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "absalom_no_son",
        "entityId": "absalom",
        "verse": {
          "book": "2 Samuel",
          "chapter": 18,
          "verse": 18,
          "reference": "2 Samuel 18:18"
        },
        "violatesRule": "rule_three_sons",
        "violationExplanation": "Four chapters later the same book explains Absalom's monument with his own words: he set up the pillar 'for he had said, \"I have no son to preserve the memory of my name.\"' The narrator's record and the man's own stated reason cannot both stand \u2014 either three sons were born to him, or he had no son.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Absalom says he has no son; the record gave him three."
      }
    ],
    "severity": 2,
    "verdict": "The same book, the same man. Chapter 14 records three sons born to Absalom. Chapter 18 records Absalom explaining his monument on the ground that he has no son at all. Nothing in the text records the sons dying, or the statement being mistaken.",
    "scoreImpact": -0.5
  },
{
    "id": "anger_forever",
    "title": "Forever, or Not Forever?",
    "summary": "Checks Micah 7:18 \u2014 God does not retain His anger forever \u2014 against Jeremiah 17:4, where God says of Judah: you have kindled My anger; it will burn forever.",
    "ruleVerse": {
      "book": "Micah",
      "chapter": 7,
      "verse": 18,
      "reference": "Micah 7:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_anger_not_forever",
        "statement": "God does not retain His anger forever.",
        "plain": "Micah grounds it in God's character: He 'does not retain His anger forever, because He delights in loving devotion.' Forever-retained anger is excluded by what God is like.",
        "subject": "god",
        "action": "retain_anger",
        "target": "forever",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "jeremiah_burn_forever",
        "entityId": "god",
        "verse": {
          "book": "Jeremiah",
          "chapter": 17,
          "verse": 4,
          "reference": "Jeremiah 17:4"
        },
        "violatesRule": "rule_anger_not_forever",
        "violationExplanation": "Jeremiah records God sentencing Judah in His own voice: 'for you have kindled My anger; it will burn forever.' Not anger that feels endless, or anger for an age \u2014 an anger stated to burn forever, by the God Micah says does not retain anger forever.",
        "severity": 3,
        "verdict": "CONTRADICTION \u2014 Jeremiah's anger burns forever; Micah's cannot."
      }
    ],
    "severity": 3,
    "verdict": "Micah defines God by the limit on His anger: He does not retain it forever, because He delights in mercy. Jeremiah quotes God promising Judah an anger that will burn forever. The attribute and the sentence cannot both be true of the same anger.",
    "scoreImpact": -2.0
  },
{
    "id": "answer_a_fool",
    "title": "Answer a Fool",
    "summary": "Checks Proverbs 26:4 — do not answer a fool according to his folly — against the very next verse, Proverbs 26:5: answer a fool according to his folly.",
    "ruleVerse": {
      "book": "Proverbs",
      "chapter": 26,
      "verse": 4,
      "reference": "Proverbs 26:4"
    },
    "rulesItDefines": [
      {
        "id": "rule_do_not_answer",
        "statement": "Do not answer a fool according to his folly.",
        "plain": "The proverb is an instruction, with its reason attached: answer him that way 'or you yourself will be like him.'",
        "subject": "human",
        "action": "answer",
        "target": "fool",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "answer_him",
        "entityId": "fool",
        "verse": {
          "book": "Proverbs",
          "chapter": 26,
          "verse": 5,
          "reference": "Proverbs 26:5"
        },
        "violatesRule": "rule_do_not_answer",
        "violationExplanation": "The next verse issues the opposite instruction, also with its reason attached: 'Answer a fool according to his folly, lest he become wise in his own eyes.' Same wording, same situation, opposite command — one verse apart, in a book presented as a single collection of wisdom.",
        "severity": 3,
        "verdict": "CONTRADICTION — Verse 5 commands exactly what verse 4 forbids."
      }
    ],
    "severity": 3,
    "verdict": "Proverbs 26:4 forbids answering a fool according to his folly, and gives a reason. Proverbs 26:5 commands answering a fool according to his folly, and gives a reason. The two instructions are word-for-word opposites, back to back, with no condition stated in either that would separate them.",
    "scoreImpact": -2.0
  },
{
    "id": "aramean_charioteers",
    "title": "Seven Hundred, or Seven Thousand?",
    "summary": "Checks 2 Samuel 10:18 — David killed seven hundred Aramean charioteers — against 1 Chronicles 19:18's count of the same battle: seven thousand.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 10,
      "verse": 18,
      "reference": "2 Samuel 10:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_700_charioteers",
        "statement": "David killed seven hundred Aramean charioteers in the battle.",
        "plain": "Samuel's battle report gives the figure alongside the rest of the tally: 'David killed seven hundred charioteers and forty thousand foot soldiers.'",
        "subject": "david",
        "action": "kill",
        "target": "charioteers",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_7000",
        "entityId": "david",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 19,
          "verse": 18,
          "reference": "1 Chronicles 19:18"
        },
        "violatesRule": "rule_700_charioteers",
        "violationExplanation": "Chronicles reports the same battle — same enemy, same commander killed, same forty thousand foot soldiers — and multiplies the charioteers by ten: 'David killed seven thousand of their charioteers.' Every other number in the sentence agrees; this one grows a zero.",
        "severity": 1,
        "verdict": "CONTRADICTION — Chronicles counts ten times Samuel's charioteers in the same battle."
      }
    ],
    "severity": 1,
    "verdict": "Both books tally the same Aramean battle, agree on its commander and on forty thousand foot soldiers, and differ by a factor of ten on its charioteers: seven hundred in Samuel, seven thousand in Chronicles.",
    "scoreImpact": -0.1
  },
{
    "id": "baasha_reign",
    "title": "Baasha's Impossible War",
    "summary": "Checks 1 Kings 15:33 — Baasha became king in Asa's third year and reigned twenty-four years — against 2 Chronicles 16:1, where Baasha attacks Judah in Asa's thirty-sixth year.",
    "ruleVerse": {
      "book": "1 Kings",
      "chapter": 15,
      "verse": 33,
      "reference": "1 Kings 15:33"
    },
    "rulesItDefines": [
      {
        "id": "rule_baasha_24",
        "statement": "Baasha's reign began in the third year of Asa and lasted twenty-four years.",
        "plain": "Kings gives both numbers in one verse: 'In the third year of Asa's reign over Judah, Baasha son of Ahijah became king of all Israel, and he reigned in Tirzah twenty-four years.' Year 3 plus 24 years of reign puts Baasha's death and his son's succession (1 Kings 16:6-8) at about Asa's 26th-27th year.",
        "subject": "baasha",
        "action": "reign",
        "target": "israel",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_year36",
        "entityId": "baasha",
        "verse": {
          "book": "2 Chronicles",
          "chapter": 16,
          "verse": 1,
          "reference": "2 Chronicles 16:1"
        },
        "violatesRule": "rule_baasha_24",
        "violationExplanation": "Nine or ten years after his reign ended, Chronicles has Baasha on campaign as king: 'In the thirty-sixth year of Asa's reign, Baasha king of Israel went up against Judah and fortified Ramah.' A king whose 24-year reign began in Asa's year 3 cannot be making war, as king, in Asa's year 36.",
        "severity": 1,
        "verdict": "CONTRADICTION — Baasha wars in Asa's 36th year, a decade after Kings ends his reign."
      }
    ],
    "severity": 1,
    "verdict": "Kings fixes Baasha's reign between Asa's 3rd year and its 24-year length — over by about Asa's 27th year, with his son Elah on the throne after him. Chronicles then dates a war by King Baasha to Asa's 36th year. The chronology gives the dead king a campaign.",
    "scoreImpact": -0.1
  },
{
    "id": "baptism_voice",
    "title": "The Voice at the Baptism",
    "summary": "Checks Matthew 3:17's words from heaven — 'This is My beloved Son' — against Mark 1:11 and Luke 3:22, where the voice addresses Jesus directly: 'You are My beloved Son.'",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 3,
      "verse": 17,
      "reference": "Matthew 3:17"
    },
    "rulesItDefines": [
      {
        "id": "rule_this_is",
        "statement": "The voice from heaven said: 'This is My beloved Son, in whom I am well pleased.'",
        "plain": "Matthew quotes the voice in the third person — an announcement about Jesus, to whoever was listening.",
        "subject": "god",
        "action": "declare",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_you_are",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 1,
          "verse": 11,
          "reference": "Mark 1:11"
        },
        "violatesRule": "rule_this_is",
        "violationExplanation": "Mark quotes the same voice, at the same moment, in the second person — an address to Jesus, not an announcement about Him: 'You are My beloved Son; in You I am well pleased.' The words spoken from heaven differ between the two records of one utterance.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's voice says 'You are'; Matthew's says 'This is.'"
      },
      {
        "id": "luke_you_are",
        "entityId": "jesus",
        "verse": {
          "book": "Luke",
          "chapter": 3,
          "verse": 22,
          "reference": "Luke 3:22"
        },
        "violatesRule": "rule_this_is",
        "violationExplanation": "Luke agrees with Mark's wording against Matthew's: 'You are My beloved Son; in You I am well pleased.' Two of the three records quote the voice speaking to Jesus; Matthew's quotes it speaking about Him.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke's voice also says 'You are,' not 'This is.'"
      }
    ],
    "severity": 2,
    "verdict": "One baptism, one voice from heaven, quoted in all three Synoptics. Matthew hears a public announcement in the third person: 'This is My beloved Son.' Mark and Luke hear a private address in the second: 'You are My beloved Son.' The voice cannot have been quoted correctly in both forms.",
    "scoreImpact": -0.5
  },
{
    "id": "cock_crow",
    "title": "Before the Rooster Crows",
    "summary": "Compares the prediction given to Peter: Matthew 26:34 allows one crowing; Mark 14:30 specifies two — and Mark 14:72 records the second.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 26,
      "verse": 34,
      "reference": "Matthew 26:34"
    },
    "rulesItDefines": [
      {
        "id": "rule_one_crow",
        "statement": "Peter will deny Jesus three times before the rooster crows.",
        "plain": "Matthew's prediction has a single crowing as its deadline: the denials come first, then the rooster.",
        "subject": "peter",
        "action": "deny",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_crows_twice",
        "entityId": "peter",
        "verse": {
          "book": "Mark",
          "chapter": 14,
          "verse": 30,
          "reference": "Mark 14:30"
        },
        "violatesRule": "rule_one_crow",
        "violationExplanation": "Mark's version of the same prediction adds a count Matthew doesn't have: 'before the rooster crows twice, you will deny Me three times.' A second crowing exists in Mark's deadline that Matthew's prediction never admits.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's rooster crows twice before the deadline."
      },
      {
        "id": "mark_second_crow",
        "entityId": "peter",
        "verse": {
          "book": "Mark",
          "chapter": 14,
          "verse": 72,
          "reference": "Mark 14:72"
        },
        "violatesRule": "rule_one_crow",
        "violationExplanation": "Mark then narrates the event his prediction required: 'immediately the rooster crowed a second time,' and Peter remembers the word about two crowings. The second crowing Matthew never predicted is, in Mark, the moment the prediction lands.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark records the second crowing itself."
      }
    ],
    "severity": 2,
    "verdict": "The prediction is quoted in both Gospels as Jesus's own words on the same night. Matthew's deadline is the rooster crowing; Mark's is the rooster crowing twice — and Mark's narrative duly supplies a second crowing Matthew's account has no room for.",
    "scoreImpact": -0.5
  },
]

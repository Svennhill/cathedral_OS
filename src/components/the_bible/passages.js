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
{
    "id": "creation_order",
    "title": "The Order of Creation",
    "summary": "Checks Genesis 1's sequence — beasts made (v.25) before man is created (v.27) — against Genesis 2, where man is formed first and the beasts are formed after him.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 1,
      "verse": 25,
      "reference": "Genesis 1:25"
    },
    "rulesItDefines": [
      {
        "id": "rule_animals_first",
        "statement": "The beasts of the earth were made before man was created.",
        "plain": "Genesis 1's order: animals first (v.25), then man (v.27).",
        "subject": "god",
        "action": "create",
        "target": "human",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "genesis_two_order",
        "entityId": "god",
        "verse": {
          "book": "Genesis",
          "chapter": 2,
          "verse": 19,
          "reference": "Genesis 2:19"
        },
        "violatesRule": "rule_animals_first",
        "violationExplanation": "Genesis 2 runs the sequence the other way: the man is already formed (2:7) and alone when 'out of the ground the LORD God formed every beast of the field and every bird of the air, and He brought them to the man.' In this account the animals are made after the man, in response to his being alone.",
        "severity": 2,
        "verdict": "CONTRADICTION — Genesis 2 forms the beasts after the man, to keep him company."
      }
    ],
    "severity": 2,
    "verdict": "Genesis 1 makes the animals first and man last. Genesis 2 forms man first and the animals after him, because he was alone. Both sequences are stated as narrative fact.",
    "scoreImpact": -0.5
  },
{
    "id": "cross_carrier",
    "title": "Who Carried the Cross?",
    "summary": "Checks John 19:17 — Jesus went out carrying His own cross — against the three Synoptic Gospels, where Simon of Cyrene is forced to carry it.",
    "ruleVerse": {
      "book": "John",
      "chapter": 19,
      "verse": 17,
      "reference": "John 19:17"
    },
    "rulesItDefines": [
      {
        "id": "rule_jesus_carried",
        "statement": "Jesus went out to Golgotha carrying His own cross.",
        "plain": "John's account gives the cross to Jesus Himself, with no second carrier mentioned.",
        "subject": "jesus",
        "action": "carry",
        "target": "heaven",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_simon",
        "entityId": "simon",
        "verse": {
          "book": "Mark",
          "chapter": 15,
          "verse": 21,
          "reference": "Mark 15:21"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Mark: Simon of Cyrene 'was passing by on his way in from the country, and the soldiers forced him to carry the cross of Jesus.' The cross John gives to Jesus, Mark gives to a bystander.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's soldiers forced Simon to carry the cross."
      },
      {
        "id": "matthew_simon",
        "entityId": "simon",
        "verse": {
          "book": "Matthew",
          "chapter": 27,
          "verse": 32,
          "reference": "Matthew 27:32"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Matthew agrees with Mark: 'they found a man from Cyrene, named Simon, and they forced him to carry the cross of Jesus.'",
        "severity": 2,
        "verdict": "CONTRADICTION — Matthew also gives the cross to Simon."
      },
      {
        "id": "luke_simon",
        "entityId": "simon",
        "verse": {
          "book": "Luke",
          "chapter": 23,
          "verse": 26,
          "reference": "Luke 23:26"
        },
        "violatesRule": "rule_jesus_carried",
        "violationExplanation": "Luke: 'they seized Simon of Cyrene on his way in from the country, and they put the cross on him to carry behind Jesus.' Three Synoptics, one carrier — and it is not the man John describes carrying it.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke puts the cross on Simon, behind Jesus."
      }
    ],
    "severity": 2,
    "verdict": "John's Jesus carries His own cross out of the city. In Matthew, Mark, and Luke the soldiers take a passing stranger and put the cross on him instead. The accounts cannot be merged without adding a handover none of them records.",
    "scoreImpact": -0.5
  },
{
    "id": "cross_inscription",
    "title": "The Sign on the Cross",
    "summary": "Checks Matthew 27:37's wording of the posted charge — THIS IS JESUS, THE KING OF THE JEWS — against the different wordings given by Mark, Luke, and John for the same sign.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 27,
      "verse": 37,
      "reference": "Matthew 27:37"
    },
    "rulesItDefines": [
      {
        "id": "rule_matthew_sign",
        "statement": "The sign above Jesus's head read: THIS IS JESUS, THE KING OF THE JEWS.",
        "plain": "Matthew quotes the posted charge in full: 'Above His head they posted the written charge against Him: THIS IS JESUS, THE KING OF THE JEWS.'",
        "subject": "jesus",
        "action": "post_charge",
        "target": "sign",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_sign",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 15,
          "verse": 26,
          "reference": "Mark 15:26"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "Mark quotes the same inscription shorter: 'The charge inscribed against Him read: THE KING OF THE JEWS.' No 'this is,' no 'Jesus.' One sign, two texts.",
        "severity": 1,
        "verdict": "CONTRADICTION — Mark's sign omits words Matthew's sign carries."
      },
      {
        "id": "luke_sign",
        "entityId": "jesus",
        "verse": {
          "book": "Luke",
          "chapter": 23,
          "verse": 38,
          "reference": "Luke 23:38"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "Luke quotes it a third way: 'Above Him was posted an inscription: THIS IS THE KING OF THE JEWS.' Matthew's 'Jesus' is gone; Mark's bare title has gained a 'this is.'",
        "severity": 1,
        "verdict": "CONTRADICTION — Luke's sign is a third wording for the same board."
      },
      {
        "id": "john_sign",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 19,
          "verse": 19,
          "reference": "John 19:19"
        },
        "violatesRule": "rule_matthew_sign",
        "violationExplanation": "John quotes it a fourth way, and names the author: 'Pilate also had a notice posted on the cross. It read: JESUS OF NAZARETH, THE KING OF THE JEWS.' Nazareth appears in no other Gospel's version; 'this is' appears in none of John's.",
        "severity": 1,
        "verdict": "CONTRADICTION — John's sign is a fourth wording, with a word none of the others have."
      }
    ],
    "severity": 1,
    "verdict": "One cross, one posted charge, four Gospels quoting it — and no two quotations match. Matthew: THIS IS JESUS, THE KING OF THE JEWS. Mark: THE KING OF THE JEWS. Luke: THIS IS THE KING OF THE JEWS. John: JESUS OF NAZARETH, THE KING OF THE JEWS. The most public text in the story is the one its recorders cannot reproduce twice the same way.",
    "scoreImpact": -0.1
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
{
    "id": "empty_tomb",
    "title": "The Empty Tomb Count",
    "summary": "Checks Matthew 28:2 — one angel, who sat on the stone — against the other Gospels' figures at the tomb: two angels, two men, one young man.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 28,
      "verse": 2,
      "reference": "Matthew 28:2"
    },
    "rulesItDefines": [
      {
        "id": "rule_one_angel",
        "statement": "One angel descended from heaven, rolled away the stone, and sat on it.",
        "plain": "Matthew's account: a single angel, outside the tomb, seated on the stone he had rolled away.",
        "subject": "angel",
        "action": "sit",
        "target": "heaven",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "john_two_angels",
        "entityId": "angel",
        "verse": {
          "book": "John",
          "chapter": 20,
          "verse": 12,
          "reference": "John 20:12"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Mary sees 'two angels in white sitting where the body of Jesus had lain, one at the head and the other at the feet.' Two figures, not one — and inside the tomb, not seated on the stone.",
        "severity": 2,
        "verdict": "CONTRADICTION — John counts two angels, inside the tomb."
      },
      {
        "id": "luke_two_men",
        "entityId": "angel",
        "verse": {
          "book": "Luke",
          "chapter": 24,
          "verse": 4,
          "reference": "Luke 24:4"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Luke: 'suddenly two men in radiant apparel stood beside them.' Two figures again, described as men, standing beside the women — not one angel seated on the stone.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke counts two men, standing."
      },
      {
        "id": "mark_young_man",
        "entityId": "angel",
        "verse": {
          "book": "Mark",
          "chapter": 16,
          "verse": 5,
          "reference": "Mark 16:5"
        },
        "violatesRule": "rule_one_angel",
        "violationExplanation": "Mark agrees on the count — one figure — and disagrees on everything else: 'a young man dressed in a white robe sitting on the right side' inside the tomb, not the angel of Matthew's account seated on the stone outside it.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's one figure is a young man inside the tomb, not Matthew's angel on the stone."
      }
    ],
    "severity": 2,
    "verdict": "Four Gospels visit the same tomb on the same morning and file four different reports of who was there: one angel on the stone, two angels inside, two men standing by, one young man within. The count never survives two tellings in a row.",
    "scoreImpact": -0.5
  },
{
    "id": "face_of_god",
    "title": "The Face of God Problem",
    "summary": "Checks Exodus 33:20's rule that no one can see God's face and live against the passages where men do exactly that.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 33,
      "verse": 20,
      "reference": "Exodus 33:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_no_face",
        "statement": "No one can see God's face and live.",
        "plain": "Seeing God's face is fatal to a human being — no exceptions are offered.",
        "subject": "human",
        "action": "see_face",
        "target": "god",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "jacob_peniel",
        "entityId": "jacob",
        "verse": {
          "book": "Genesis",
          "chapter": 32,
          "verse": 30,
          "reference": "Genesis 32:30"
        },
        "violatesRule": "rule_no_face",
        "violationExplanation": "Jacob names the place Peniel because, in his own words, 'I have seen God face to face, and yet my life was spared.' The rule allows no survivors; Jacob reports surviving.",
        "severity": 3,
        "verdict": "CONTRADICTION — Jacob saw God face to face and lived."
      },
      {
        "id": "moses_face_to_face",
        "entityId": "moses",
        "verse": {
          "book": "Exodus",
          "chapter": 33,
          "verse": 11,
          "reference": "Exodus 33:11"
        },
        "violatesRule": "rule_no_face",
        "violationExplanation": "The same book that states the rule also states, as routine narration, that 'the LORD would speak to Moses face to face, as a man speaks to his friend.'",
        "severity": 3,
        "verdict": "CONTRADICTION — Moses spoke with God face to face as a habit."
      },
      {
        "id": "moses_back_only",
        "entityId": "moses",
        "verse": {
          "book": "Exodus",
          "chapter": 33,
          "verse": 23,
          "reference": "Exodus 33:23"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — God shows Moses His back only: 'My face must not be seen.' The rule restated by its author."
      }
    ],
    "severity": 3,
    "verdict": "The rule is stated absolutely in Exodus 33:20, restated by God Himself in Exodus 33:23 — and broken by Exodus 33:11 and Genesis 32:30. Face-to-face encounters with God are recorded as survivable, habitual, and survivable again.",
    "scoreImpact": -2.0
  },
{
    "id": "faith_vs_works",
    "title": "Faith vs. Works",
    "summary": "Checks Romans 3:28 — justified by faith apart from works — against James 2:24, which answers in the same terms: not by faith alone.",
    "ruleVerse": {
      "book": "Romans",
      "chapter": 3,
      "verse": 28,
      "reference": "Romans 3:28"
    },
    "rulesItDefines": [
      {
        "id": "rule_faith_apart",
        "statement": "A man is justified by faith apart from works of the law.",
        "plain": "Faith justifies; works of the law are expressly excluded from the transaction.",
        "subject": "human",
        "action": "justified_by",
        "target": "faith",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "james_not_faith_alone",
        "entityId": "james",
        "verse": {
          "book": "James",
          "chapter": 2,
          "verse": 24,
          "reference": "James 2:24"
        },
        "violatesRule": "rule_faith_apart",
        "violationExplanation": "James draws the conclusion Paul excludes: 'a man is justified by his deeds and not by faith alone.' Same verb, same subject, opposite finding — stated as a general rule, not a comment on one case.",
        "severity": 3,
        "verdict": "CONTRADICTION — James justifies by deeds, and not by faith alone."
      },
      {
        "id": "galatians_agrees",
        "entityId": "paul",
        "verse": {
          "book": "Galatians",
          "chapter": 2,
          "verse": 16,
          "reference": "Galatians 2:16"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — Paul restates his own rule: justified by faith in Christ, 'because by works of the law no one will be justified.'"
      }
    ],
    "severity": 3,
    "verdict": "Paul and James use the same word — justified — and reach opposite conclusions about the same transaction, each stated as a standing rule. The contradiction is doctrinal, and it is exact.",
    "scoreImpact": -2.0
  },
{
    "id": "gadarene_demoniacs",
    "title": "How Many Demoniacs?",
    "summary": "Checks Matthew 8:28 \u2014 Jesus was met by two demon-possessed men \u2014 against Mark 5:2 and Luke 8:27, where He is met by one man.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 8,
      "verse": 28,
      "reference": "Matthew 8:28"
    },
    "rulesItDefines": [
      {
        "id": "rule_two_men",
        "statement": "Jesus was met by two demon-possessed men coming from the tombs.",
        "plain": "Matthew counts them: 'He was met by two demon-possessed men coming from the tombs. They were so violent that no one could pass that way.'",
        "subject": "demoniac",
        "action": "meet",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_one_man",
        "entityId": "demoniac",
        "verse": {
          "book": "Mark",
          "chapter": 5,
          "verse": 2,
          "reference": "Mark 5:2"
        },
        "violatesRule": "rule_two_men",
        "violationExplanation": "Mark's account of the same arrival, the same tombs, the same region: 'He was met by a man with an unclean spirit, who was coming from the tombs.' One man, in the singular, throughout Mark's long telling \u2014 spoken to, healed, and sent home as one.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Mark counts one man where Matthew counts two."
      },
      {
        "id": "luke_one_man",
        "entityId": "demoniac",
        "verse": {
          "book": "Luke",
          "chapter": 8,
          "verse": 27,
          "reference": "Luke 8:27"
        },
        "violatesRule": "rule_two_men",
        "violationExplanation": "Luke agrees with Mark against Matthew: 'He was met by a demon-possessed man from the town.' One man again \u2014 named legion, healed, and found sitting clothed as a single person in the verses that follow.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Luke also counts one man where Matthew counts two."
      }
    ],
    "severity": 2,
    "verdict": "The same landing, the same tombs, the same deliverance. Matthew's report has two demon-possessed men meeting Jesus; Mark's and Luke's each have one, and tell the whole story around a single man. The second man exists in only one of the three accounts.",
    "scoreImpact": -0.5
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
{
    "id": "how_many_donkeys",
    "title": "How Many Donkeys?",
    "summary": "Checks Mark 11:7 \u2014 one colt, and Jesus sat on it \u2014 against Matthew 21:7, where the disciples bring a donkey and a colt, spread cloaks on both, and Jesus sat on them.",
    "ruleVerse": {
      "book": "Mark",
      "chapter": 11,
      "verse": 7,
      "reference": "Mark 11:7"
    },
    "rulesItDefines": [
      {
        "id": "rule_one_colt",
        "statement": "Jesus rode one animal into Jerusalem: a colt.",
        "plain": "Mark is singular throughout: 'they led the colt to Jesus and threw their cloaks over it, and He sat on it.'",
        "subject": "jesus",
        "action": "ride",
        "target": "colt",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "matthew_two",
        "entityId": "jesus",
        "verse": {
          "book": "Matthew",
          "chapter": 21,
          "verse": 7,
          "reference": "Matthew 21:7"
        },
        "violatesRule": "rule_one_colt",
        "violationExplanation": "Matthew's disciples fetch two animals: 'They brought the donkey and the colt and laid their cloaks on them, and Jesus sat on them.' Cloaks on both, and the pronoun is plural \u2014 Jesus sits on 'them.' Matthew's entry has one more animal than Mark's, and Jesus mounted on the pair.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Matthew seats Jesus on two animals."
      },
      {
        "id": "luke_one_colt",
        "entityId": "jesus",
        "verse": {
          "book": "Luke",
          "chapter": 19,
          "verse": 35,
          "reference": "Luke 19:35"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT \u2014 Luke agrees with Mark: one colt, cloaks thrown over it, and they put Jesus on it."
      }
    ],
    "severity": 2,
    "verdict": "Mark and Luke bring Jesus one colt for the entry into Jerusalem. Matthew brings a donkey and her colt, spreads the cloaks across both, and seats Jesus on 'them.' The most staged arrival in the Gospels cannot agree on how many animals were under Him.",
    "scoreImpact": -0.5
  },
{
    "id": "inherited_sin",
    "title": "Whose Sin Is It?",
    "summary": "Checks Exodus 20:5 — God visits the iniquity of the fathers on their children to the third and fourth generations — against Ezekiel 18:20: a son will not bear the iniquity of his father.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 20,
      "verse": 5,
      "reference": "Exodus 20:5"
    },
    "rulesItDefines": [
      {
        "id": "rule_visiting_iniquity",
        "statement": "God visits the iniquity of the fathers on their children, to the third and fourth generations.",
        "plain": "In the Ten Commandments God states His own practice: 'I, the LORD your God, am a jealous God, visiting the iniquity of the fathers on their children to the third and fourth generations of those who hate Me.'",
        "subject": "god",
        "action": "visit_iniquity",
        "target": "children",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "ezekiel_each_his_own",
        "entityId": "ezekiel",
        "verse": {
          "book": "Ezekiel",
          "chapter": 18,
          "verse": 20,
          "reference": "Ezekiel 18:20"
        },
        "violatesRule": "rule_visiting_iniquity",
        "violationExplanation": "Ezekiel states the opposite as God's own ruling, in a chapter given to overturning the proverb about fathers' sins landing on sons: 'The soul who sins is the one who will die. A son will not bear the iniquity of his father.' What Exodus says God does to the third and fourth generations, Ezekiel says does not happen to a son at all.",
        "severity": 3,
        "verdict": "CONTRADICTION — Ezekiel: a son will not bear his father's iniquity. Exodus: God visits it on him."
      }
    ],
    "severity": 3,
    "verdict": "Exodus has God announce, inside the Ten Commandments, that He visits the fathers' iniquity on their children for generations. Ezekiel has God announce that a son will not bear his father's iniquity — that the soul who sins is the one who will die. Both are presented as God's stated policy on the same question.",
    "scoreImpact": -2.0
  },
{
    "id": "jacob_household_count",
    "title": "Seventy, or Seventy-Five?",
    "summary": "Checks Genesis 46:27 — Jacob's family who went to Egypt were seventy in all — against Acts 7:14, where Stephen counts seventy-five in all.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 46,
      "verse": 27,
      "reference": "Genesis 46:27"
    },
    "rulesItDefines": [
      {
        "id": "rule_seventy",
        "statement": "The members of Jacob's family who went to Egypt were seventy in all.",
        "plain": "Genesis closes its own headcount with a total: 'the members of Jacob's family who went to Egypt were seventy in all.'",
        "subject": "jacob",
        "action": "migrate",
        "target": "egypt",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "stephen_75",
        "entityId": "stephen",
        "verse": {
          "book": "Acts",
          "chapter": 7,
          "verse": 14,
          "reference": "Acts 7:14"
        },
        "violatesRule": "rule_seventy",
        "violationExplanation": "Stephen, recounting the same migration in his speech, gives the total as 'seventy-five in all': Joseph 'sent for his father Jacob and all his relatives, seventy-five in all.' Same family, same journey, same 'in all' — five more people.",
        "severity": 1,
        "verdict": "CONTRADICTION — Stephen counts seventy-five; Genesis counts seventy."
      }
    ],
    "severity": 1,
    "verdict": "Genesis totals Jacob's migrating household at seventy in all, at the end of its own list. Stephen, retelling the migration as inspired history, totals the same household at seventy-five in all. Five people appear in one count and not the other, and neither text notes a second group.",
    "scoreImpact": -0.1
  },
{
    "id": "jacob_renamed",
    "title": "Renamed Twice",
    "summary": "Checks Genesis 32:28 — 'Your name will no longer be Jacob, but Israel' — against Genesis 35:10, where God renames him again with the same words, three chapters later.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 32,
      "verse": 28,
      "reference": "Genesis 32:28"
    },
    "rulesItDefines": [
      {
        "id": "rule_renamed_peniel",
        "statement": "Jacob's name was changed to Israel at Peniel: it would no longer be Jacob.",
        "plain": "The man who wrestled him states it as done: 'Your name will no longer be Jacob, but Israel, because you have struggled with God and with men, and you have prevailed.'",
        "subject": "jacob",
        "action": "rename",
        "target": "israel",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "renamed_bethel",
        "entityId": "jacob",
        "verse": {
          "book": "Genesis",
          "chapter": 35,
          "verse": 10,
          "reference": "Genesis 35:10"
        },
        "violatesRule": "rule_renamed_peniel",
        "violationExplanation": "Three chapters later God performs the renaming again, in the same formula, as if for the first time: 'Though your name is Jacob, you will no longer be called Jacob. Instead, your name will be Israel.' So God named him Israel. The narrative has called him Jacob all the way between the two namings — and goes on calling him Jacob after both.",
        "severity": 2,
        "verdict": "CONTRADICTION — The renaming of Genesis 32 is given again, as new, in Genesis 35."
      }
    ],
    "severity": 2,
    "verdict": "Genesis renames Jacob to Israel at Peniel, keeps calling him Jacob, then at Bethel has God rename him to Israel again with the original formula — 'you will no longer be called Jacob' — and keeps calling him Jacob afterward anyway. One renaming, delivered twice, honored in neither.",
    "scoreImpact": -0.5
  },
{
    "id": "jairus_daughter",
    "title": "Dead, or Dying?",
    "summary": "Checks Matthew 9:18 — 'My daughter has just died' — against Mark 5:23 and Luke 8:42, where Jairus's daughter is still dying when he makes the same request.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 9,
      "verse": 18,
      "reference": "Matthew 9:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_already_dead",
        "statement": "Jairus's daughter had already died when he came to Jesus.",
        "plain": "Matthew quotes the request itself: a synagogue leader knelt and said, 'My daughter has just died. But come and place Your hand on her, and she will live.'",
        "subject": "jairus",
        "action": "request",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_near_death",
        "entityId": "jairus",
        "verse": {
          "book": "Mark",
          "chapter": 5,
          "verse": 23,
          "reference": "Mark 5:23"
        },
        "violatesRule": "rule_already_dead",
        "violationExplanation": "Mark quotes the same request in the opposite state: 'My little daughter is near death. Please come and place Your hands on her, so that she will be healed and live.' In Mark she dies later, on the road — messengers arrive in verse 35 to say so. A girl who has just died cannot also be a girl who is about to.",
        "severity": 2,
        "verdict": "CONTRADICTION — In Mark the daughter is dying, not dead, when Jairus asks."
      },
      {
        "id": "luke_dying",
        "entityId": "jairus",
        "verse": {
          "book": "Luke",
          "chapter": 8,
          "verse": 42,
          "reference": "Luke 8:42"
        },
        "violatesRule": "rule_already_dead",
        "violationExplanation": "Luke's narrator states her condition as Jesus sets out: his only daughter 'was dying.' As in Mark, the death is reported afterward (verse 49), while Jesus is still on the way.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke also has her dying when the request is made."
      }
    ],
    "severity": 2,
    "verdict": "Matthew's Jairus comes to Jesus because his daughter has just died, asking for her life back. Mark's and Luke's Jairus comes because she is dying, asking for her healing — and in both, she dies while Jesus is on the way. The errand that starts the story is a different errand in Matthew than in the other two.",
    "scoreImpact": -0.5
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
{
    "id": "jesses_sons",
    "title": "How Many Sons Did Jesse Have?",
    "summary": "Checks 1 Samuel 17:12 — Jesse had eight sons — against 1 Chronicles 2:13-15, where the birth-order list of Jesse's sons ends with David, the seventh.",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 17,
      "verse": 12,
      "reference": "1 Samuel 17:12"
    },
    "rulesItDefines": [
      {
        "id": "rule_eight_sons",
        "statement": "Jesse had eight sons.",
        "plain": "Samuel counts them in the introduction to the Goliath story: Jesse of Bethlehem 'had eight sons,' and David is the youngest of them (17:14).",
        "subject": "jesse",
        "action": "father",
        "target": "sons",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_seventh",
        "entityId": "david",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 2,
          "verse": 15,
          "reference": "1 Chronicles 2:15"
        },
        "violatesRule": "rule_eight_sons",
        "violationExplanation": "Chronicles lists Jesse's sons by birth order — Eliab, Abinadab, Shimea, Nethanel, Raddai, Ozem — and finishes: 'Ozem sixth, and David seventh.' Seven sons named, David last and seventh. Samuel's eighth son is nowhere in the count.",
        "severity": 1,
        "verdict": "CONTRADICTION — Chronicles makes David the seventh of seven; Samuel counts eight."
      }
    ],
    "severity": 1,
    "verdict": "Samuel introduces David as the youngest of Jesse's eight sons. Chronicles gives the family in birth order and stops at seven names, with David seventh. One son exists in one book's count and not the other's list.",
    "scoreImpact": -0.1
  },
{
    "id": "john_elijah",
    "title": "Was John Elijah?",
    "summary": "Checks John 1:21 — asked 'Are you Elijah?', John answers 'I am not' — against Matthew 11:14, where Jesus says of John: he is the Elijah who was to come.",
    "ruleVerse": {
      "book": "John",
      "chapter": 1,
      "verse": 21,
      "reference": "John 1:21"
    },
    "rulesItDefines": [
      {
        "id": "rule_john_not_elijah",
        "statement": "John is not Elijah.",
        "plain": "The delegation from Jerusalem puts the question directly and John answers it directly, twice in one verse: '“Are you Elijah?” He said, “I am not.”'",
        "subject": "john_the_baptist",
        "action": "be",
        "target": "elijah",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "jesus_says_elijah",
        "entityId": "john_the_baptist",
        "verse": {
          "book": "Matthew",
          "chapter": 11,
          "verse": 14,
          "reference": "Matthew 11:14"
        },
        "violatesRule": "rule_john_not_elijah",
        "violationExplanation": "Jesus identifies the same man for the crowds: 'And if you are willing to accept it, he is the Elijah who was to come.' Not a resemblance or a spirit of Elijah — he is the Elijah. The subject of the claim denies it; Jesus asserts it.",
        "severity": 2,
        "verdict": "CONTRADICTION — Jesus says John is Elijah; John says he is not."
      }
    ],
    "severity": 2,
    "verdict": "Asked to his face whether he is Elijah, John the Baptist says he is not. Jesus, preaching about John, says he is the Elijah who was to come. One of the two men in the exchange is wrong about the other's identity — and the text gives no third account to settle it.",
    "scoreImpact": -0.5
  },
{
    "id": "josephs_father",
    "title": "Joseph's Father",
    "summary": "Checks Matthew 1:16 — Jacob the father of Joseph — against Luke 3:23, where Joseph is the son of Heli.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 1,
      "verse": 16,
      "reference": "Matthew 1:16"
    },
    "rulesItDefines": [
      {
        "id": "rule_jacob_father",
        "statement": "Joseph's father was Jacob.",
        "plain": "Matthew's genealogy ends: 'Jacob the father of Joseph, the husband of Mary.'",
        "subject": "jacob",
        "action": "father",
        "target": "joseph",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "luke_heli",
        "entityId": "joseph",
        "verse": {
          "book": "Luke",
          "chapter": 3,
          "verse": 23,
          "reference": "Luke 3:23"
        },
        "violatesRule": "rule_jacob_father",
        "violationExplanation": "Luke's genealogy, run in the opposite direction, reaches the same man one generation later: Jesus 'was regarded as the son of Joseph, the son of Heli.' Joseph cannot be the son of Jacob in one genealogy and the son of Heli in the other without one list breaking.",
        "severity": 2,
        "verdict": "CONTRADICTION — Luke makes Joseph the son of Heli."
      }
    ],
    "severity": 2,
    "verdict": "Both genealogies are given to establish the same descent. At the last step before Jesus they name different fathers for the same man: Jacob in Matthew, Heli in Luke.",
    "scoreImpact": -0.5
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
{
    "id": "judas_death",
    "title": "The Death of Judas",
    "summary": "Compares the two deaths of Judas: Matthew 27:5, where he hanged himself, and Acts 1:18, where he fell headlong and burst open.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 27,
      "verse": 5,
      "reference": "Matthew 27:5"
    },
    "rulesItDefines": [
      {
        "id": "rule_judas_hanged",
        "statement": "Judas went away and hanged himself.",
        "plain": "Matthew's account: Judas threw the silver into the temple, left, and hanged himself.",
        "subject": "judas",
        "action": "die",
        "target": "judas",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "acts_judas_fell",
        "entityId": "judas",
        "verse": {
          "book": "Acts",
          "chapter": 1,
          "verse": 18,
          "reference": "Acts 1:18"
        },
        "violatesRule": "rule_judas_hanged",
        "violationExplanation": "Acts closes the account differently: Judas 'fell headlong and burst open in the middle, and all his intestines spilled out.' A fall and a bursting — not a hanging. The two deaths share a man and a payment and nothing else.",
        "severity": 2,
        "verdict": "CONTRADICTION — Acts kills Judas by a fall, not a rope."
      }
    ],
    "severity": 2,
    "verdict": "Matthew hangs Judas. Acts drops him headlong onto a field and bursts him open. One betrayer, two deaths, no shared detail between them beyond the silver that paid for both stories.",
    "scoreImpact": -0.5
  },
{
    "id": "judas_field",
    "title": "Who Bought the Field?",
    "summary": "Checks Matthew 27:7 — the priests bought the potter's field with the returned silver — against Acts 1:18, where Judas himself bought a field with it.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 27,
      "verse": 7,
      "reference": "Matthew 27:7"
    },
    "rulesItDefines": [
      {
        "id": "rule_priests_bought",
        "statement": "The chief priests used the returned money to buy the potter's field.",
        "plain": "In Matthew the silver changes hands first: Judas returns it, and the priests — not Judas — make the purchase.",
        "subject": "judas",
        "action": "buy",
        "target": "heaven",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "acts_judas_bought",
        "entityId": "judas",
        "verse": {
          "book": "Acts",
          "chapter": 1,
          "verse": 18,
          "reference": "Acts 1:18"
        },
        "violatesRule": "rule_priests_bought",
        "violationExplanation": "Acts assigns the same purchase to the other party: 'with the reward for his wickedness Judas bought a field.' In Matthew the buyer is the priests, spending money Judas had thrown back; in Acts the buyer is Judas himself.",
        "severity": 2,
        "verdict": "CONTRADICTION — Acts makes Judas the buyer of the field."
      }
    ],
    "severity": 2,
    "verdict": "The blood money buys one field in both accounts — but the buyer changes. Matthew: the priests, after Judas returned the silver. Acts: Judas, with the reward still in his hand.",
    "scoreImpact": -0.5
  },
{
    "id": "moses_speech",
    "title": "Slow of Speech?",
    "summary": "Checks Exodus 4:10 — Moses: I have never been eloquent; I am slow of speech and tongue — against Acts 7:22, where Stephen describes Moses as powerful in speech and action.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 4,
      "verse": 10,
      "reference": "Exodus 4:10"
    },
    "rulesItDefines": [
      {
        "id": "rule_slow_speech",
        "statement": "Moses was not eloquent; he was slow of speech and tongue.",
        "plain": "Moses states it about himself, in the past and present tense: 'I have never been eloquent, neither in the past nor since You have spoken to Your servant, for I am slow of speech and tongue.' It is his stated reason Aaron must speak for him.",
        "subject": "moses",
        "action": "speak",
        "target": "eloquence",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "stephen_powerful",
        "entityId": "moses",
        "verse": {
          "book": "Acts",
          "chapter": 7,
          "verse": 22,
          "reference": "Acts 7:22"
        },
        "violatesRule": "rule_slow_speech",
        "violationExplanation": "Stephen's history describes the same man before Pharaoh's court: 'Moses was educated in all the wisdom of the Egyptians and was powerful in speech and action.' Powerful in speech is the attribute Moses himself, in Exodus, says he has never had.",
        "severity": 2,
        "verdict": "CONTRADICTION — Stephen's Moses is powerful in the speech Exodus's Moses disowns."
      }
    ],
    "severity": 2,
    "verdict": "Exodus builds Aaron's whole role on Moses's own testimony: never eloquent, slow of speech and tongue. Acts has Stephen describe the Egyptian-educated Moses as powerful in speech. The spokesman was hired for a deficiency the later history says he never had.",
    "scoreImpact": -0.5
  },
{
    "id": "no_one_seen_god",
    "title": "No One Has Seen God",
    "summary": "Checks John 1:18 — no one has ever seen God — against Exodus 24:10, Numbers 12:8, and Isaiah 6:1, where men see Him.",
    "ruleVerse": {
      "book": "John",
      "chapter": 1,
      "verse": 18,
      "reference": "John 1:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_never_seen",
        "statement": "No one has ever seen God.",
        "plain": "John's claim is universal and past-tense: 'No one has ever seen God.' No exception is offered for elders, prophets, or Moses.",
        "subject": "god",
        "action": "be_seen",
        "target": "human",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "elders_saw",
        "entityId": "moses",
        "verse": {
          "book": "Exodus",
          "chapter": 24,
          "verse": 10,
          "reference": "Exodus 24:10"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "Moses leads Aaron, Nadab, Abihu, and seventy elders up the mountain, and Exodus reports it in plain narration: 'and they saw the God of Israel.' Not a vision of glory or a form — they saw the God of Israel, and ate and drank (verse 11).",
        "severity": 3,
        "verdict": "CONTRADICTION — Seventy-four men saw God at Sinai."
      },
      {
        "id": "moses_form",
        "entityId": "moses",
        "verse": {
          "book": "Numbers",
          "chapter": 12,
          "verse": 8,
          "reference": "Numbers 12:8"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "God Himself describes Moses's access: 'I speak with him face to face, clearly and not in riddles; he sees the form of the LORD.' God states, in His own words, that Moses sees His form.",
        "severity": 3,
        "verdict": "CONTRADICTION — God says Moses sees His form."
      },
      {
        "id": "isaiah_saw",
        "entityId": "isaiah",
        "verse": {
          "book": "Isaiah",
          "chapter": 6,
          "verse": 1,
          "reference": "Isaiah 6:1"
        },
        "violatesRule": "rule_never_seen",
        "violationExplanation": "Isaiah opens his temple vision with a flat claim: 'In the year that King Uzziah died, I saw the Lord seated on a throne, high and exalted.' A prophet states in the first person that he saw the Lord.",
        "severity": 3,
        "verdict": "CONTRADICTION — Isaiah says he saw the Lord."
      }
    ],
    "severity": 3,
    "verdict": "John 1:18 states the rule absolutely: no one has ever seen God. The Old Testament records the elders of Israel seeing the God of Israel at Sinai, God testifying that Moses sees His form, and Isaiah testifying that he saw the Lord. The 'ever' does not survive its own canon.",
    "scoreImpact": -2.0
  },
{
    "id": "noah_animals",
    "title": "Two of Every Kind?",
    "summary": "Checks Genesis 6:19 — two of every living creature into the ark — against Genesis 7:2-3, where the clean animals and birds board seven pairs at a time.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 6,
      "verse": 19,
      "reference": "Genesis 6:19"
    },
    "rulesItDefines": [
      {
        "id": "rule_two_of_every",
        "statement": "Two of every living creature — male and female — are to be brought into the ark.",
        "plain": "The manifest as first given: two of everything, a pair of each kind.",
        "subject": "noah",
        "action": "bring",
        "target": "human",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "seven_pairs_clean",
        "entityId": "noah",
        "verse": {
          "book": "Genesis",
          "chapter": 7,
          "verse": 2,
          "reference": "Genesis 7:2"
        },
        "violatesRule": "rule_two_of_every",
        "violationExplanation": "One chapter later the manifest is rewritten: 'seven pairs of every kind of clean animal, a male and its mate; a pair of every kind of unclean animal.' For clean animals the count is seven pairs, not the two of every kind the first instruction set.",
        "severity": 2,
        "verdict": "CONTRADICTION — clean animals board seven pairs at a time, not two."
      },
      {
        "id": "seven_pairs_birds",
        "entityId": "noah",
        "verse": {
          "book": "Genesis",
          "chapter": 7,
          "verse": 3,
          "reference": "Genesis 7:3"
        },
        "violatesRule": "rule_two_of_every",
        "violationExplanation": "The revision extends to the birds: 'seven pairs of every kind of bird of the air, male and female' — again seven pairs where the original manifest allowed two.",
        "severity": 2,
        "verdict": "CONTRADICTION — the birds also board seven pairs at a time."
      }
    ],
    "severity": 2,
    "verdict": "The ark's manifest is issued twice. The first version admits two of every living creature; the second admits seven pairs of the clean animals and the birds. Both instructions come from the same speaker, one chapter apart.",
    "scoreImpact": -0.5
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
{
    "id": "pauls_companions",
    "title": "What Paul's Companions Heard",
    "summary": "Compares the two tellings of the Damascus road: Acts 9:7 says the men heard the voice; Paul's own retelling in Acts 22:9 says they could not understand it.",
    "ruleVerse": {
      "book": "Acts",
      "chapter": 9,
      "verse": 7,
      "reference": "Acts 9:7"
    },
    "rulesItDefines": [
      {
        "id": "rule_heard_voice",
        "statement": "The men traveling with Saul heard the voice but did not see anyone.",
        "plain": "Luke's narration of the event: the companions heard the voice, and saw no one.",
        "subject": "human",
        "action": "hear",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "acts_22_retelling",
        "entityId": "paul",
        "verse": {
          "book": "Acts",
          "chapter": 22,
          "verse": 9,
          "reference": "Acts 22:9"
        },
        "violatesRule": "rule_heard_voice",
        "violationExplanation": "Paul's own retelling of the same journey: 'My companions saw the light, but they could not understand the voice of the One speaking to me.' In the BSB text the first account says they heard the voice; the retelling says the voice could not be understood by them. The machine flags the discrepancy as written — heard, versus not understood.",
        "severity": 2,
        "verdict": "CONTRADICTION — the retelling has the companions unable to understand the voice the first account says they heard."
      }
    ],
    "severity": 2,
    "verdict": "One journey, told twice in the same book: in the narration the companions hear the voice and see no one; in Paul's retelling they see the light and cannot understand the voice. The senses trade places between the tellings.",
    "scoreImpact": -0.5
  },
{
    "id": "pauls_posture",
    "title": "Standing, or Fallen?",
    "summary": "Checks Acts 9:7 — Paul's companions stood speechless on the Damascus road — against Acts 26:14, Paul's retelling: we all fell to the ground.",
    "ruleVerse": {
      "book": "Acts",
      "chapter": 9,
      "verse": 7,
      "reference": "Acts 9:7"
    },
    "rulesItDefines": [
      {
        "id": "rule_men_stood",
        "statement": "The men traveling with Saul stood there speechless.",
        "plain": "Luke's narration: 'The men traveling with Saul stood there speechless. They heard the voice but did not see anyone.' Standing, while Saul was on the ground (9:4).",
        "subject": "paul",
        "action": "stand",
        "target": "companions",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "all_fell",
        "entityId": "paul",
        "verse": {
          "book": "Acts",
          "chapter": 26,
          "verse": 14,
          "reference": "Acts 26:14"
        },
        "violatesRule": "rule_men_stood",
        "violationExplanation": "Paul retells the same moment to Agrippa: 'We all fell to the ground.' All — the companions included, in the speaker's own summary of the scene Luke narrated with the companions on their feet.",
        "severity": 2,
        "verdict": "CONTRADICTION — In the retelling, the standing men have fallen."
      }
    ],
    "severity": 2,
    "verdict": "The same road, the same light, the same voice. Luke's narrative leaves Paul's companions standing speechless; Paul's own courtroom retelling has the whole party on the ground. The posture of the eyewitnesses changes between the telling and the retelling.",
    "scoreImpact": -0.5
  },
{
    "id": "priest_at_nob",
    "title": "The Priest at Nob",
    "summary": "Checks 1 Samuel 21:1 \u2014 David came to Ahimelech the priest \u2014 against Mark 2:26, where Jesus dates the same visit to the high priesthood of Abiathar.",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 21,
      "verse": 1,
      "reference": "1 Samuel 21:1"
    },
    "rulesItDefines": [
      {
        "id": "rule_ahimelech_priest",
        "statement": "The priest who received David at Nob was Ahimelech.",
        "plain": "1 Samuel names him at the head of the episode: 'Then David came to Nob, to Ahimelech the priest.' It is Ahimelech who gives David the consecrated bread in the verses that follow.",
        "subject": "ahimelech",
        "action": "serve",
        "target": "david",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_abiathar",
        "entityId": "ahimelech",
        "verse": {
          "book": "Mark",
          "chapter": 2,
          "verse": 26,
          "reference": "Mark 2:26"
        },
        "violatesRule": "rule_ahimelech_priest",
        "violationExplanation": "Recounting this same episode \u2014 David entering the house of God and eating the consecrated bread \u2014 Jesus dates it 'during the high priesthood of Abiathar.' Abiathar was Ahimelech's son, who fled to David only after Saul killed his father (1 Samuel 22). At the time of the visit, the priest at Nob was the father, not the son.",
        "severity": 2,
        "verdict": "CONTRADICTION \u2014 Mark dates the visit to Abiathar's priesthood; Samuel names his father Ahimelech."
      }
    ],
    "severity": 2,
    "verdict": "Samuel's account of the consecrated bread names Ahimelech as the priest at Nob, in the first verse of the episode. Jesus's retelling of the same episode in Mark places it under Ahimelech's son Abiathar \u2014 who was not priest yet, and whose flight to David came after his father's death over this very visit.",
    "scoreImpact": -0.5
  },
{
    "id": "saul_inquired",
    "title": "Did Saul Ask God?",
    "summary": "Checks 1 Samuel 28:6 — Saul inquired of the LORD, but the LORD did not answer him — against 1 Chronicles 10:14: he failed to inquire of the LORD, so the LORD put him to death.",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 28,
      "verse": 6,
      "reference": "1 Samuel 28:6"
    },
    "rulesItDefines": [
      {
        "id": "rule_saul_inquired",
        "statement": "Saul inquired of the LORD.",
        "plain": "1 Samuel states it before the visit to the medium: 'He inquired of the LORD, but the LORD did not answer him by dreams or Urim or prophets.' The silence is why Saul went to Endor.",
        "subject": "saul",
        "action": "inquire",
        "target": "god",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_failed",
        "entityId": "saul",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 10,
          "verse": 14,
          "reference": "1 Chronicles 10:14"
        },
        "violatesRule": "rule_saul_inquired",
        "violationExplanation": "Chronicles gives Saul's death its official cause: 'and he failed to inquire of the LORD. So the LORD put him to death and turned the kingdom over to David.' Not 'he inquired and was not answered' — he failed to inquire, and died for the failure.",
        "severity": 2,
        "verdict": "CONTRADICTION — Chronicles says Saul died for failing to do what Samuel says he did."
      },
      {
        "id": "chronicles_medium",
        "entityId": "saul",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 10,
          "verse": 13,
          "reference": "1 Chronicles 10:13"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — Chronicles agrees with Samuel on the medium: Saul died 'because he did not keep the word of the LORD and even consulted a medium for guidance.' The visit to Endor is common ground; the inquiry to the LORD is not."
      }
    ],
    "severity": 2,
    "verdict": "Samuel records that Saul inquired of the LORD and received silence — the silence that drove him to a medium. Chronicles records the medium too, then gives the inquiry's absence as the reason God put Saul to death. He cannot have died for failing to inquire if he inquired.",
    "scoreImpact": -0.5
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
{
    "id": "sauls_reign",
    "title": "How Long Did Saul Reign?",
    "summary": "Checks Acts 13:21 — Saul ruled forty years — against 1 Samuel 13:1, where the BSB text gives his reign as forty-two years.",
    "ruleVerse": {
      "book": "Acts",
      "chapter": 13,
      "verse": 21,
      "reference": "Acts 13:21"
    },
    "rulesItDefines": [
      {
        "id": "rule_forty_years",
        "statement": "Saul son of Kish ruled for forty years.",
        "plain": "Paul's synagogue sermon gives the length plainly: God gave Israel Saul, 'who ruled forty years.'",
        "subject": "saul",
        "action": "reign",
        "target": "israel",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "samuel_forty_two",
        "entityId": "saul",
        "verse": {
          "book": "1 Samuel",
          "chapter": 13,
          "verse": 1,
          "reference": "1 Samuel 13:1"
        },
        "violatesRule": "rule_forty_years",
        "violationExplanation": "Samuel's own regnal formula, as the BSB prints it: 'Saul was thirty years old when he became king, and he reigned over Israel forty-two years.' Two years longer than Paul's figure — in the book that tells Saul's story.",
        "severity": 1,
        "verdict": "CONTRADICTION — Samuel gives Saul forty-two years; Paul gives forty."
      }
    ],
    "severity": 1,
    "verdict": "Paul rounds Saul's reign to forty years in a sermon summary. Samuel's regnal formula gives forty-two. The two-year difference is small; it is also exact, printed, and unreconciled in the text itself.",
    "scoreImpact": -0.1
  },
{
    "id": "solomons_overseers",
    "title": "Solomon's Overseers",
    "summary": "Checks 1 Kings 9:23 — 550 chief officers over Solomon's projects — against 2 Chronicles 8:10, which counts 250.",
    "ruleVerse": {
      "book": "1 Kings",
      "chapter": 9,
      "verse": 23,
      "reference": "1 Kings 9:23"
    },
    "rulesItDefines": [
      {
        "id": "rule_550_officers",
        "statement": "Solomon's chief officers numbered 550 supervisors.",
        "plain": "1 Kings counts them exactly: '550 supervisors over the people who did the work.'",
        "subject": "solomon",
        "action": "appoint",
        "target": "officers",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_250",
        "entityId": "solomon",
        "verse": {
          "book": "2 Chronicles",
          "chapter": 8,
          "verse": 10,
          "reference": "2 Chronicles 8:10"
        },
        "violatesRule": "rule_550_officers",
        "violationExplanation": "Chronicles describes the same office in the same words — 'the chief officers for King Solomon' — and counts '250 supervisors.' The office, the king, and the description agree; the headcount differs by 300.",
        "severity": 1,
        "verdict": "CONTRADICTION — Chronicles counts 250 of the officers Kings counts at 550."
      }
    ],
    "severity": 1,
    "verdict": "Both books describe Solomon's chief officers in nearly identical sentences. One counts 550 supervisors, the other 250. The text gives no second group, no recount, and no explanation for the missing 300.",
    "scoreImpact": -0.1
  },
{
    "id": "stephens_tomb",
    "title": "Stephen's Tomb",
    "summary": "Checks Genesis 49:30 — Abraham purchased his burial field from Ephron the Hittite, at Machpelah — against Acts 7:16, where Stephen says Abraham bought the tomb from the sons of Hamor, at Shechem.",
    "ruleVerse": {
      "book": "Genesis",
      "chapter": 49,
      "verse": 30,
      "reference": "Genesis 49:30"
    },
    "rulesItDefines": [
      {
        "id": "rule_ephron_purchase",
        "statement": "Abraham purchased the field and cave at Machpelah from Ephron the Hittite as a burial site.",
        "plain": "Jacob states it on his deathbed: 'This is the field Abraham purchased from Ephron the Hittite as a burial site' — the cave in the field of Machpelah, near Mamre, in Canaan. Genesis 23 records the purchase itself, from Ephron, in detail.",
        "subject": "abraham",
        "action": "purchase",
        "target": "ephron",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "acts_hamor",
        "entityId": "stephen",
        "verse": {
          "book": "Acts",
          "chapter": 7,
          "verse": 16,
          "reference": "Acts 7:16"
        },
        "violatesRule": "rule_ephron_purchase",
        "violationExplanation": "Stephen places the patriarchs' bones 'in the tomb that Abraham had bought from the sons of Hamor at Shechem.' Wrong seller and wrong place: the sons of Hamor sold a field to Jacob, at Shechem, generations later (Genesis 33:19); Abraham bought his tomb from Ephron the Hittite, at Machpelah. Stephen's sentence fuses the two purchases into one that neither account records.",
        "severity": 2,
        "verdict": "CONTRADICTION — Stephen gives Abraham Hamor's sons, at Shechem, as his sellers."
      }
    ],
    "severity": 2,
    "verdict": "Abraham's one recorded tomb purchase is from Ephron the Hittite, at Machpelah — recorded at the time in Genesis 23 and restated by Jacob in Genesis 49. Stephen's history gives Abraham a different seller (the sons of Hamor) in a different city (Shechem): the purchase Jacob made, credited to Abraham.",
    "scoreImpact": -0.5
  },
{
    "id": "lying_spirit",
    "title": "The Lying Spirit",
    "summary": "Checks Hebrews 6:18 — it is impossible for God to lie — against 1 Kings 22:23, where the LORD puts a lying spirit in the prophets' mouths, and 2 Thessalonians 2:11, where God sends a delusion so that people believe the lie.",
    "ruleVerse": {
      "book": "Hebrews",
      "chapter": 6,
      "verse": 18,
      "reference": "Hebrews 6:18"
    },
    "rulesItDefines": [
      {
        "id": "rule_god_cannot_lie",
        "statement": "It is impossible for God to lie.",
        "plain": "Hebrews states it as a property of God, not a habit: 'it is impossible for God to lie.' Deception is not merely something He does not do; it is something He cannot do.",
        "subject": "god",
        "action": "lie",
        "target": "anyone",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "kings_lying_spirit",
        "entityId": "god",
        "verse": {
          "book": "1 Kings",
          "chapter": 22,
          "verse": 23,
          "reference": "1 Kings 22:23"
        },
        "violatesRule": "rule_god_cannot_lie",
        "violationExplanation": "Micaiah's verdict on Ahab's prophets: 'the LORD has put a lying spirit in the mouths of all these prophets of yours.' The lie those prophets speak is false prophecy, and its author, by the prophet's own account, is the LORD.",
        "severity": 3,
        "verdict": "CONTRADICTION — God authors a lying spirit's message."
      },
      {
        "id": "thess_delusion",
        "entityId": "god",
        "verse": {
          "book": "2 Thessalonians",
          "chapter": 2,
          "verse": 11,
          "reference": "2 Thessalonians 2:11"
        },
        "violatesRule": "rule_god_cannot_lie",
        "violationExplanation": "Paul: 'For this reason God will send them a powerful delusion so that they believe the lie.' The delusion is sent by God, and its stated purpose is that its victims believe something false.",
        "severity": 3,
        "verdict": "CONTRADICTION — God sends a delusion whose purpose is belief in a lie."
      }
    ],
    "severity": 3,
    "verdict": "Hebrews makes it a definition: it is impossible for God to lie. Kings has the LORD placing a lying spirit in His own prophets' mouths to deceive a king to his death. Thessalonians has God sending a powerful delusion so that people will believe the lie. A God who cannot lie is doing the lying by instrument in both accounts.",
    "scoreImpact": -2.0
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
{
    "id": "threshing_floor_price",
    "title": "The Price of the Threshing Floor",
    "summary": "Checks 2 Samuel 24:24 — David bought the threshing floor and the oxen for fifty shekels of silver — against 1 Chronicles 21:25: six hundred shekels of gold for the site.",
    "ruleVerse": {
      "book": "2 Samuel",
      "chapter": 24,
      "verse": 24,
      "reference": "2 Samuel 24:24"
    },
    "rulesItDefines": [
      {
        "id": "rule_fifty_shekels",
        "statement": "David bought the threshing floor and the oxen for fifty shekels of silver.",
        "plain": "Samuel gives the price in the purchase itself: 'So David bought the threshing floor and the oxen for fifty shekels of silver.'",
        "subject": "david",
        "action": "purchase",
        "target": "threshing_floor",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "chronicles_six_hundred",
        "entityId": "david",
        "verse": {
          "book": "1 Chronicles",
          "chapter": 21,
          "verse": 25,
          "reference": "1 Chronicles 21:25"
        },
        "violatesRule": "rule_fifty_shekels",
        "violationExplanation": "Chronicles reports the same purchase, from the same seller (Araunah in Samuel, Ornan in Chronicles — the same man), at a different price in a different metal: 'So David paid Ornan six hundred shekels of gold for the site.' Fifty of silver for the floor and oxen; six hundred of gold for the site. The transaction is one; the bill is two.",
        "severity": 1,
        "verdict": "CONTRADICTION — Chronicles prices the purchase at 600 shekels of gold, not 50 of silver."
      }
    ],
    "severity": 1,
    "verdict": "One seller, one plague-stopping purchase, one altar site — the future temple mount. Samuel bills David fifty shekels of silver. Chronicles bills him six hundred shekels of gold. Neither text mentions a second payment.",
    "scoreImpact": -0.1
  },
{
    "id": "who_baptized",
    "title": "Who Baptized?",
    "summary": "Checks John 3:22 — Jesus spent time with His disciples and baptized — against John 4:2, the same Gospel's correction: it was not Jesus who baptized, but His disciples.",
    "ruleVerse": {
      "book": "John",
      "chapter": 3,
      "verse": 22,
      "reference": "John 3:22"
    },
    "rulesItDefines": [
      {
        "id": "rule_jesus_baptized",
        "statement": "Jesus baptized.",
        "plain": "John's narrator states it plainly: Jesus went into the Judean countryside, 'where He spent some time with them and baptized.' John's disciples repeat it in 3:26: 'He is baptizing, and everyone is going to Him.'",
        "subject": "jesus",
        "action": "baptize",
        "target": "disciples",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "not_jesus",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 4,
          "verse": 2,
          "reference": "John 4:2"
        },
        "violatesRule": "rule_jesus_baptized",
        "violationExplanation": "Two chapters after stating that Jesus baptized — and one verse after repeating that He was 'gaining and baptizing more disciples than John' (4:1) — the narrator stops to correct the record in a parenthesis: '(although it was not Jesus who baptized, but His disciples).' The correction negates the earlier statement in the same Gospel, by the same narrator.",
        "severity": 2,
        "verdict": "CONTRADICTION — John 4:2 takes back what John 3:22 stated: it was not Jesus who baptized."
      }
    ],
    "severity": 2,
    "verdict": "John's Gospel states that Jesus baptized, builds a comparison with John the Baptist on it, and then corrects itself in a parenthesis: it was not Jesus who baptized at all. Both versions stand in the finished text, two chapters apart.",
    "scoreImpact": -0.5
  },
{
    "id": "zebedee_request",
    "title": "Who Brought the Request?",
    "summary": "Checks Matthew 20:20 — the mother of Zebedee's sons came to Jesus to make the request — against Mark 10:35, where James and John come and make it themselves.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 20,
      "verse": 20,
      "reference": "Matthew 20:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_mother_asks",
        "statement": "The request for the seats at Jesus's right and left was brought by the mother of Zebedee's sons.",
        "plain": "Matthew: 'Then the mother of Zebedee's sons came to Jesus with her sons and knelt down to make a request of Him' — and in verse 21 it is she who speaks it: 'Declare that in Your kingdom one of these two sons of mine may sit at Your right hand, and the other at Your left.'",
        "subject": "mother_of_zebedees_sons",
        "action": "request",
        "target": "jesus",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_sons_ask",
        "entityId": "zebedees_sons",
        "verse": {
          "book": "Mark",
          "chapter": 10,
          "verse": 35,
          "reference": "Mark 10:35"
        },
        "violatesRule": "rule_mother_asks",
        "violationExplanation": "Mark has no mother in the scene at all: 'Then James and John, the sons of Zebedee, came to Jesus and declared, \"Teacher, we want You to do for us whatever we ask\"' — and in verse 37 they speak the request themselves: 'Grant that one of us may sit at Your right hand.' The petitioner changes between the two accounts of the same conversation.",
        "severity": 2,
        "verdict": "CONTRADICTION — In Mark the sons ask for themselves; Matthew gives the asking to their mother."
      }
    ],
    "severity": 2,
    "verdict": "The request for the two seats is the same in both Gospels, word for word in substance. Who makes it is not: Matthew brings in the boys' mother to kneel and speak it while they stand by; Mark leaves her out entirely and has James and John ask on their own behalf.",
    "scoreImpact": -0.5
  },
{
    "id": "zechariah_father",
    "title": "Zechariah's Father",
    "summary": "Checks 2 Chronicles 24:20 — Zechariah son of Jehoiada, the priest killed at the temple — against Matthew 23:35, where Jesus calls the temple-murdered Zechariah the son of Berechiah.",
    "ruleVerse": {
      "book": "2 Chronicles",
      "chapter": 24,
      "verse": 20,
      "reference": "2 Chronicles 24:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_zechariah_jehoiada",
        "statement": "The Zechariah who spoke at the temple and was killed there was the son of Jehoiada the priest.",
        "plain": "Chronicles names him as he stands up to speak: 'Zechariah son of Jehoiada the priest.' The next verse records his killing: stoned, by the king's order, 'in the courtyard of the house of the LORD' (24:21) — the Old Testament's one temple murder of a Zechariah.",
        "subject": "zechariah",
        "action": "prophesy",
        "target": "temple",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "matthew_berechiah",
        "entityId": "zechariah",
        "verse": {
          "book": "Matthew",
          "chapter": 23,
          "verse": 35,
          "reference": "Matthew 23:35"
        },
        "violatesRule": "rule_zechariah_jehoiada",
        "violationExplanation": "Jesus reaches for the same murder — a Zechariah killed 'between the temple and the altar,' the last righteous blood in his catalogue from Abel onward — and names a different father: 'the blood of Zechariah son of Berechiah, whom you murdered between the temple and the altar.' Berechiah is the father of a different Zechariah, the prophet, who was never murdered at the temple.",
        "severity": 2,
        "verdict": "CONTRADICTION — Matthew gives the temple victim Berechiah as a father; Chronicles gives Jehoiada."
      }
    ],
    "severity": 2,
    "verdict": "The temple-murdered Zechariah is a fixed point in both Testaments: Chronicles makes him Jehoiada's son, stoned in the house of the LORD. Jesus, citing that same murder as the closing entry in the record of righteous blood, makes him Berechiah's son. The victim is the same; the father is not.",
    "scoreImpact": -0.5
  },
{
    "id": "with_or_against",
    "title": "With Me, or Not Against Me?",
    "summary": "Checks Matthew 12:30 — Jesus: he who is not with Me is against Me — against Luke 9:50 and Mark 9:40, where Jesus states the reverse: whoever is not against you is for you.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 12,
      "verse": 30,
      "reference": "Matthew 12:30"
    },
    "rulesItDefines": [
      {
        "id": "rule_not_with_against",
        "statement": "Whoever is not with Jesus is against Him.",
        "plain": "Jesus states the rule without a middle: 'He who is not with Me is against Me, and he who does not gather with Me scatters.' Neutrality counts as opposition.",
        "subject": "human",
        "action": "stand_with",
        "target": "jesus",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "luke_not_against",
        "entityId": "jesus",
        "verse": {
          "book": "Luke",
          "chapter": 9,
          "verse": 50,
          "reference": "Luke 9:50"
        },
        "violatesRule": "rule_not_with_against",
        "violationExplanation": "Jesus applies the opposite rule to the same kind of case — an outsider casting out demons in His name: '“Do not stop him,” Jesus replied, “for whoever is not against you is for you.”' The man is not with the disciples; by Matthew's rule he is against them; by Luke's rule he is for them.",
        "severity": 3,
        "verdict": "CONTRADICTION — Luke's Jesus counts the neutral man as for Him."
      },
      {
        "id": "mark_not_against",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 9,
          "verse": 40,
          "reference": "Mark 9:40"
        },
        "violatesRule": "rule_not_with_against",
        "violationExplanation": "Mark records the same ruling in the same words: 'For whoever is not against us is for us.' Two Gospels preserve the maxim that reverses Matthew's — from the same speaker, about the same question of who counts as on His side.",
        "severity": 3,
        "verdict": "CONTRADICTION — Mark's maxim also reverses Matthew's."
      }
    ],
    "severity": 3,
    "verdict": "Matthew's Jesus abolishes the middle: not with Me means against Me. Luke's and Mark's Jesus install the middle as the rule: not against us means for us. The two maxims classify the same unaffiliated man into opposite camps, and both are given as Jesus's own teaching.",
    "scoreImpact": -2.0
  },
{
    "id": "ahaz_overcome",
    "title": "Could They Overcome Ahaz?",
    "summary": "Checks 2 Kings 16:5 — Rezin and Pekah besieged Ahaz but could not overcome him — against 2 Chronicles 28:5, where the LORD delivered Ahaz into their hands and they struck him with great force. Isaiah 7:1 sides with Kings.",
    "ruleVerse": {
      "book": "2 Kings",
      "chapter": 16,
      "verse": 5,
      "reference": "2 Kings 16:5"
    },
    "rulesItDefines": [
      {
        "id": "rule_could_not_overcome",
        "statement": "Rezin of Aram and Pekah of Israel could not overcome Ahaz.",
        "plain": "Kings states the campaign's limit plainly: 'They besieged Ahaz but could not overcome him.'",
        "subject": "ahaz",
        "action": "be_overcome",
        "target": "enemies",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "chronicles_delivered",
        "entityId": "ahaz",
        "verse": {
          "book": "2 Chronicles",
          "chapter": 28,
          "verse": 5,
          "reference": "2 Chronicles 28:5"
        },
        "violatesRule": "rule_could_not_overcome",
        "violationExplanation": "Chronicles reports the same war as a rout delivered by God: 'So the LORD his God delivered Ahaz into the hand of the king of Aram, who attacked him and took many captives to Damascus. Ahaz was also delivered into the hand of the king of Israel, who struck him with great force.' Delivered into their hands, struck with great force, captives taken — the outcome Kings says the attackers could not achieve.",
        "severity": 2,
        "verdict": "CONTRADICTION — Chronicles has Ahaz delivered into the hands Kings says could not overcome him."
      },
      {
        "id": "isaiah_could_not",
        "entityId": "ahaz",
        "verse": {
          "book": "Isaiah",
          "chapter": 7,
          "verse": 1,
          "reference": "Isaiah 7:1"
        },
        "violatesRule": null,
        "verdict": "CONSISTENT — Isaiah agrees with Kings: Rezin and Pekah marched on Jerusalem 'but he could not overpower the city.' The failed siege is common ground between Kings and the prophet."
      }
    ],
    "severity": 2,
    "verdict": "Kings and Isaiah agree the Aramean-Israelite campaign failed against Ahaz. Chronicles describes the same war as God delivering Ahaz into both kings' hands, with mass captivity and great slaughter. The war has two outcomes, and the books distribute them by author.",
    "scoreImpact": -0.5
  },
{
    "id": "ahabs_blood",
    "title": "Where the Dogs Licked",
    "summary": "Checks 1 Kings 21:19 — Elijah's prophecy: in the place where the dogs licked Naboth's blood, the dogs will lick Ahab's blood — against 1 Kings 22:38, where Ahab's blood is licked by dogs at the pool of Samaria, a day's journey from Naboth's vineyard in Jezreel.",
    "ruleVerse": {
      "book": "1 Kings",
      "chapter": 21,
      "verse": 19,
      "reference": "1 Kings 21:19"
    },
    "rulesItDefines": [
      {
        "id": "rule_same_place",
        "statement": "The dogs would lick Ahab's blood in the same place where they licked Naboth's.",
        "plain": "Elijah's sentence is place-specific: '“In the place where the dogs licked up the blood of Naboth, there also the dogs will lick up your blood—yes, yours!”' The place is the point of the prophecy: Naboth's stolen plot in Jezreel.",
        "subject": "ahab",
        "action": "bleed",
        "target": "naboths_vineyard",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "pool_of_samaria",
        "entityId": "ahab",
        "verse": {
          "book": "1 Kings",
          "chapter": 22,
          "verse": 38,
          "reference": "1 Kings 22:38"
        },
        "violatesRule": "rule_same_place",
        "violationExplanation": "Ahab falls at Ramoth-Gilead and his chariot is brought home: 'And the chariot was washed at the pool of Samaria where the prostitutes bathed, and the dogs licked up Ahab’s blood, according to the word that the LORD had spoken.' Dogs, blood — and the wrong city. The licking happens at Samaria's pool, not at Naboth's plot in Jezreel, while the narrator certifies the prophecy fulfilled.",
        "severity": 2,
        "verdict": "CONTRADICTION — The dogs lick Ahab's blood at Samaria, not where Naboth's was licked."
      }
    ],
    "severity": 2,
    "verdict": "Elijah's prophecy stakes everything on the place: where Naboth's blood was licked, there Ahab's will be. Kings dutifully records dogs licking Ahab's blood — at the pool of Samaria, after his body is carried home from another battlefield — and calls it fulfillment. The detail the prophecy is made of is the detail the fulfillment misses.",
    "scoreImpact": -0.5
  },
{
    "id": "eunuch_assembly",
    "title": "The Eunuch's Place",
    "summary": "Checks Deuteronomy 23:1 — no man with crushed or severed genitals may enter the assembly of the LORD — against Isaiah 56:4-5, where God promises faithful eunuchs a place in His house and an everlasting name.",
    "ruleVerse": {
      "book": "Deuteronomy",
      "chapter": 23,
      "verse": 1,
      "reference": "Deuteronomy 23:1"
    },
    "rulesItDefines": [
      {
        "id": "rule_eunuch_excluded",
        "statement": "No eunuch may enter the assembly of the LORD.",
        "plain": "The law is categorical and physical: 'No man with crushed or severed genitals may enter the assembly of the LORD.' No exception for faithfulness is stated.",
        "subject": "eunuch",
        "action": "enter",
        "target": "assembly",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "isaiah_eunuch_place",
        "entityId": "eunuch",
        "verse": {
          "book": "Isaiah",
          "chapter": 56,
          "verse": 5,
          "reference": "Isaiah 56:5"
        },
        "violatesRule": "rule_eunuch_excluded",
        "violationExplanation": "God's promise to the eunuchs who keep His Sabbaths and hold His covenant (verse 4): 'I will give them, in My house and within My walls, a memorial and a name better than that of sons and daughters. I will give them an everlasting name that will not be cut off.' The excluded class is given a place inside the walls the law kept them out of — permanently, by name.",
        "severity": 3,
        "verdict": "CONTRADICTION — Isaiah seats in God's house the men Deuteronomy bars from it."
      }
    ],
    "severity": 3,
    "verdict": "Deuteronomy bars the eunuch from the assembly of the LORD without exception. Isaiah has God promising the faithful eunuch a memorial inside His house and an everlasting name — a better place than sons get. The law excludes by body; the promise includes by covenant; both are given as God's word.",
    "scoreImpact": -2.0
  },
{
    "id": "abolish_law",
    "title": "Abolish the Law?",
    "summary": "Checks Matthew 5:17 — Jesus: I have not come to abolish the Law, and not a jot will disappear from it (5:18) — against Ephesians 2:15, where Christ makes peace 'by abolishing in His flesh the law of commandments and decrees.'",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 5,
      "verse": 17,
      "reference": "Matthew 5:17"
    },
    "rulesItDefines": [
      {
        "id": "rule_not_abolish",
        "statement": "Jesus did not come to abolish the Law.",
        "plain": "His own statement: 'Do not think that I have come to abolish the Law or the Prophets. I have not come to abolish them, but to fulfill them.' And verse 18 sets the term: until heaven and earth pass away, not a jot will disappear from the Law until everything is accomplished.",
        "subject": "jesus",
        "action": "abolish",
        "target": "law",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "ephesians_abolished",
        "entityId": "paul",
        "verse": {
          "book": "Ephesians",
          "chapter": 2,
          "verse": 15,
          "reference": "Ephesians 2:15"
        },
        "violatesRule": "rule_not_abolish",
        "violationExplanation": "Ephesians describes the finished act with the same verb Jesus disowns: Christ made peace 'by abolishing in His flesh the law of commandments and decrees.' The law of commandments is abolished — by the man who said He had not come to abolish the Law, while heaven and earth, by every account, still stand.",
        "severity": 3,
        "verdict": "CONTRADICTION — Ephesians credits Jesus with abolishing what He said He would not."
      }
    ],
    "severity": 3,
    "verdict": "Jesus denies the mission in advance: not abolish, but fulfill — with the Law's smallest stroke guaranteed until heaven and earth pass. Ephesians reports the mission accomplished by abolition: the law of commandments and decrees abolished in His flesh. Fulfillment is the word one text uses; abolition is the word the other insists on.",
    "scoreImpact": -2.0
  },
{
    "id": "forgiveness_flour",
    "title": "Forgiveness Without Blood",
    "summary": "Checks Hebrews 9:22 — without the shedding of blood there is no forgiveness — against Leviticus 5:11-13, where the poor man's sin offering is fine flour, no blood at all, 'and he will be forgiven.'",
    "ruleVerse": {
      "book": "Hebrews",
      "chapter": 9,
      "verse": 22,
      "reference": "Hebrews 9:22"
    },
    "rulesItDefines": [
      {
        "id": "rule_no_forgiveness_without_blood",
        "statement": "Without the shedding of blood there is no forgiveness.",
        "plain": "Hebrews states it as the law's own principle: 'According to the law, in fact, nearly everything must be purified with blood, and without the shedding of blood there is no forgiveness.'",
        "subject": "blood",
        "action": "forgive",
        "target": "sins",
        "permitted": false,
        "exclusive": true
      }
    ],
    "testCases": [
      {
        "id": "leviticus_flour",
        "entityId": "poor_offerer",
        "verse": {
          "book": "Leviticus",
          "chapter": 5,
          "verse": 13,
          "reference": "Leviticus 5:13"
        },
        "violatesRule": "rule_no_forgiveness_without_blood",
        "violationExplanation": "The law Hebrews summarizes provides the exception in its own text: the man too poor for birds brings 'a tenth of an ephah of fine flour as a sin offering' (5:11) — no animal, no blood — and the verdict follows: 'the priest will make atonement for him for any of these sins he has committed, and he will be forgiven.' Forgiveness, by the law, without a drop of blood shed.",
        "severity": 3,
        "verdict": "CONTRADICTION — Leviticus forgives a sin on flour alone."
      }
    ],
    "severity": 3,
    "verdict": "Hebrews lays down the principle it attributes to the law: no shedding of blood, no forgiveness. The law itself, in Leviticus 5, forgives the poor man's sin for a handful of flour. Either the principle misstates the law it claims to summarize, or the flour offering cannot do what Leviticus says it does.",
    "scoreImpact": -2.0
  },
{
    "id": "death_new_creation",
    "title": "Death in the New Creation",
    "summary": "Checks Revelation 21:4 — in the new creation there will be no more death — against Isaiah 65:20, where in God's new heavens and new earth (65:17) a youth will die at a hundred years and a sinner who falls short is accursed.",
    "ruleVerse": {
      "book": "Revelation",
      "chapter": 21,
      "verse": 4,
      "reference": "Revelation 21:4"
    },
    "rulesItDefines": [
      {
        "id": "rule_no_more_death",
        "statement": "In the new creation there will be no more death.",
        "plain": "John's vision closes the subject: 'there will be no more death or mourning or crying or pain, for the former things have passed away.' Death is among the former things.",
        "subject": "death",
        "action": "exist",
        "target": "new_creation",
        "permitted": false
      }
    ],
    "testCases": [
      {
        "id": "isaiah_dies_at_hundred",
        "entityId": "isaiah",
        "verse": {
          "book": "Isaiah",
          "chapter": 65,
          "verse": 20,
          "reference": "Isaiah 65:20"
        },
        "violatesRule": "rule_no_more_death",
        "violationExplanation": "Isaiah's new heavens and new earth (65:17) run on different physics: 'the youth will die at a hundred years, and he who fails to reach a hundred will be considered accursed.' People still die in Isaiah's new creation — they simply die old, and dying young is still a curse. Death has not passed away; it has been rescheduled.",
        "severity": 3,
        "verdict": "CONTRADICTION — Isaiah's new earth still has death in it."
      }
    ],
    "severity": 3,
    "verdict": "Both prophets describe God's new heavens and new earth. John's has no more death at all. Isaiah's has death deferred to a hundred years, with a curse on anyone who dies younger. The former things have either passed away, or they have been given a longer lease.",
    "scoreImpact": -2.0
  },
{
    "id": "passover_eaten",
    "title": "Had Passover Been Eaten?",
    "summary": "Checks Luke 22:15 — Jesus at the Last Supper: I have eagerly desired to eat this Passover with you before My suffering — against John 18:28, where on the morning after that supper the Jewish leaders avoid defilement so that they can eat the Passover.",
    "ruleVerse": {
      "book": "Luke",
      "chapter": 22,
      "verse": 15,
      "reference": "Luke 22:15"
    },
    "rulesItDefines": [
      {
        "id": "rule_supper_was_passover",
        "statement": "The Last Supper was the Passover meal, eaten the night before the crucifixion.",
        "plain": "Jesus names the meal as He sits at it: 'I have eagerly desired to eat this Passover with you before My suffering.' In Luke's chronology the Passover is eaten; what remains is the suffering.",
        "subject": "jesus",
        "action": "eat",
        "target": "passover",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "john_not_yet_eaten",
        "entityId": "jesus",
        "verse": {
          "book": "John",
          "chapter": 18,
          "verse": 28,
          "reference": "John 18:28"
        },
        "violatesRule": "rule_supper_was_passover",
        "violationExplanation": "The next morning, in John, the Passover has not been eaten: Jesus is led to the Praetorium early, 'and the Jews did not enter the Praetorium, to avoid being defiled and unable to eat the Passover.' If the feast still lies ahead on crucifixion morning, the meal of the night before was not it.",
        "severity": 2,
        "verdict": "CONTRADICTION — In John, Passover is still uneaten the morning after Luke's Passover supper."
      }
    ],
    "severity": 2,
    "verdict": "Luke's Jesus eats the Passover with His disciples and then suffers. John's Jerusalem has not eaten the Passover yet when the suffering is already underway the next morning — and John's own dating of the crucifixion (19:14, the day of Preparation for the Passover) keeps the lambs unslain at the hour of the cross. The two chronologies place the feast on opposite sides of the death.",
    "scoreImpact": -0.5
  },
{
    "id": "now_i_know",
    "title": "Now I Know",
    "summary": "Checks 1 John 3:20 — God knows all things — against Genesis 18:21, where God goes down to Sodom to find out, and Genesis 22:12, where the verdict on Abraham's test arrives as new knowledge: now I know that you fear God.",
    "ruleVerse": {
      "book": "1 John",
      "chapter": 3,
      "verse": 20,
      "reference": "1 John 3:20"
    },
    "rulesItDefines": [
      {
        "id": "rule_knows_all",
        "statement": "God knows all things.",
        "plain": "John states it without range or exception: 'God is greater than our hearts, and He knows all things.' What God knows has no outside.",
        "subject": "god",
        "action": "know",
        "target": "all_things",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "genesis_go_down",
        "entityId": "god",
        "verse": {
          "book": "Genesis",
          "chapter": 18,
          "verse": 21,
          "reference": "Genesis 18:21"
        },
        "violatesRule": "rule_knows_all",
        "violationExplanation": "God describes His own information-gathering about Sodom: 'I will go down to see if their actions fully justify the outcry that has reached Me. If not, I will find out.' A being who knows all things does not travel to check, and has no 'if not' to resolve.",
        "severity": 3,
        "verdict": "CONTRADICTION — God goes down to Sodom to find out what He does not yet know."
      },
      {
        "id": "genesis_now_i_know",
        "entityId": "god",
        "verse": {
          "book": "Genesis",
          "chapter": 22,
          "verse": 12,
          "reference": "Genesis 22:12"
        },
        "violatesRule": "rule_knows_all",
        "violationExplanation": "At the climax of the binding of Isaac, the angel of the LORD speaks God's verdict in the first person: 'now I know that you fear God, since you have not withheld your only son from me.' The test's outcome is announced as knowledge newly arrived — the thing the test was run to learn.",
        "severity": 3,
        "verdict": "CONTRADICTION — 'Now I know' is not something an all-knowing God can say."
      }
    ],
    "severity": 3,
    "verdict": "John's God knows all things, full stop. Genesis's God goes down to Sodom to see for Himself and find out, and closes Abraham's test with 'now I know.' Both Genesis scenes are structured as investigations whose outcomes God learns — conduct an omniscient being has no use for.",
    "scoreImpact": -2.0
  },
{
    "id": "son_knows_not",
    "title": "The Son Who Does Not Know",
    "summary": "Checks John 21:17 — Peter to the risen Jesus: Lord, You know all things — against Mark 13:32, where Jesus says of the day and hour: no one knows, not even the Son, but only the Father.",
    "ruleVerse": {
      "book": "John",
      "chapter": 21,
      "verse": 17,
      "reference": "John 21:17"
    },
    "rulesItDefines": [
      {
        "id": "rule_jesus_knows_all",
        "statement": "Jesus knows all things.",
        "plain": "Peter's confession, uncorrected by Jesus in the scene: '“Lord, You know all things. You know I love You.”' The claim is made to Jesus's face and stands in the text as true.",
        "subject": "jesus",
        "action": "know",
        "target": "all_things",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_son_does_not_know",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 13,
          "verse": 32,
          "reference": "Mark 13:32"
        },
        "violatesRule": "rule_jesus_knows_all",
        "violationExplanation": "Jesus draws the boundary Himself: 'No one knows about that day or hour, not even the angels in heaven, nor the Son, but only the Father.' The day and hour are a thing the Son does not know — knowledge held by the Father alone, in a sentence constructed to exclude everyone else, explicitly including the Son.",
        "severity": 3,
        "verdict": "CONTRADICTION — The Son who knows all things does not know the day or the hour."
      }
    ],
    "severity": 3,
    "verdict": "Peter tells Jesus to His face that He knows all things, and Jesus lets it stand as the ground of the restoration. Jesus elsewhere names a fact — the day and the hour — and places it outside His own knowledge, with the Father as its only holder. Both statements are spoken by the people who should know.",
    "scoreImpact": -2.0
  },
{
    "id": "livestock_twice",
    "title": "The Livestock That Died Twice",
    "summary": "Checks Exodus 9:6 — all the livestock of the Egyptians died in the fifth plague — against Exodus 9:25, three plagues later, where the hail strikes down the Egyptians' animals in the field all over again.",
    "ruleVerse": {
      "book": "Exodus",
      "chapter": 9,
      "verse": 6,
      "reference": "Exodus 9:6"
    },
    "rulesItDefines": [
      {
        "id": "rule_all_livestock_died",
        "statement": "All the livestock of the Egyptians died.",
        "plain": "The plague on livestock closes with a total: 'And the next day the LORD did just that. All the livestock of the Egyptians died, but not one animal belonging to the Israelites died.' All is the count.",
        "subject": "egyptian_livestock",
        "action": "die",
        "target": "plague",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "hail_kills_livestock",
        "entityId": "pharaoh",
        "verse": {
          "book": "Exodus",
          "chapter": 9,
          "verse": 25,
          "reference": "Exodus 9:25"
        },
        "violatesRule": "rule_all_livestock_died",
        "violationExplanation": "The seventh plague finds Egyptian animals alive to kill: 'Throughout the land of Egypt, the hail struck down everything in the field, both man and beast.' Moses has just warned Pharaoh to shelter 'your livestock' from the hail (9:19). Livestock that all died in plague five is standing in the fields, owned, warned over, and killed in plague seven — and Pharaoh's horses will be harnessed again for the pursuit in chapter 14.",
        "severity": 2,
        "verdict": "CONTRADICTION — Egypt's livestock is killed again three plagues after 'all' of it died."
      }
    ],
    "severity": 2,
    "verdict": "Exodus 9:6 spends the word 'all': every Egyptian animal died, with Israel's spared as the deliberate contrast. Exodus 9 then keeps going — a warning to bring the livestock in, and hail killing man and beast across the land. Total destruction does not leave stock for the next plague to destroy.",
    "scoreImpact": -0.5
  },
{
    "id": "saul_knew_david",
    "title": "Whose Son Are You?",
    "summary": "Checks 1 Samuel 16:21 — David entered Saul's service and became his armor-bearer, and Saul loved him very much — against 1 Samuel 17:58, where after the Goliath fight Saul asks David: whose son are you, young man?",
    "ruleVerse": {
      "book": "1 Samuel",
      "chapter": 16,
      "verse": 21,
      "reference": "1 Samuel 16:21"
    },
    "rulesItDefines": [
      {
        "id": "rule_david_in_service",
        "statement": "David was already in Saul's service, as his armor-bearer, before the Goliath fight.",
        "plain": "Samuel's sequence: David 'came to Saul and entered his service,' Saul 'loved him very much,' and David 'became his armor-bearer.' He plays the lyre for Saul's torment in the verses around it. Saul knows David — personally, by name, in his household.",
        "subject": "david",
        "action": "serve",
        "target": "saul",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "saul_asks_whose_son",
        "entityId": "saul",
        "verse": {
          "book": "1 Samuel",
          "chapter": 17,
          "verse": 58,
          "reference": "1 Samuel 17:58"
        },
        "violatesRule": "rule_david_in_service",
        "violationExplanation": "After Goliath falls, Saul has been asking his commander whose son the boy is (17:55-56) and now puts it to David directly: '“Whose son are you, young man?” asked Saul.' David answers with his father's name and town — as a stranger introducing himself to a king he has never served.",
        "severity": 2,
        "verdict": "CONTRADICTION — Saul interviews as a stranger the armor-bearer he loved."
      }
    ],
    "severity": 2,
    "verdict": "In chapter 16 David lives at court: Saul's armor-bearer, his lyre player, loved by the king. In chapter 17 Saul watches him fight, cannot place him, asks his general whose son he is, and has him brought in for an introduction. The book introduces David to Saul twice — once as family, once as a stranger.",
    "scoreImpact": -0.5
  },
{
    "id": "mark_isaiah_quote",
    "title": "As It Is Written in Isaiah",
    "summary": "Checks Malachi 3:1 — 'Behold, I will send My messenger, who will prepare the way before Me' — against Mark 1:2, which opens the Gospel by quoting that line as written in Isaiah the prophet.",
    "ruleVerse": {
      "book": "Malachi",
      "chapter": 3,
      "verse": 1,
      "reference": "Malachi 3:1"
    },
    "rulesItDefines": [
      {
        "id": "rule_malachi_messenger",
        "statement": "The words 'Behold, I will send My messenger, who will prepare the way before Me' are Malachi's.",
        "plain": "Malachi 3:1, in Malachi's book, in God's voice through Malachi: the messenger oracle stands at the head of his third chapter.",
        "subject": "malachi",
        "action": "prophesy",
        "target": "messenger",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_attributes_isaiah",
        "entityId": "john_the_baptist",
        "verse": {
          "book": "Mark",
          "chapter": 1,
          "verse": 2,
          "reference": "Mark 1:2"
        },
        "violatesRule": "rule_malachi_messenger",
        "violationExplanation": "Mark's second verse: 'As it is written in Isaiah the prophet: “Behold, I will send My messenger ahead of You, who will prepare Your way.”' The quoted line is Malachi's, word for word in substance — the Isaiah quotation (40:3) only begins in Mark's next verse. The Gospel's first citation credits the wrong prophet.",
        "severity": 1,
        "verdict": "CONTRADICTION — Mark attributes Malachi's words to Isaiah."
      }
    ],
    "severity": 1,
    "verdict": "Mark opens his Gospel with a citation and gets its author wrong: the first line he quotes as Isaiah is Malachi 3:1. (Matthew and Luke, copying the passage, quietly drop the attribution.) A scribal-level error, but it stands in the second verse of the book.",
    "scoreImpact": -0.1
  },
{
    "id": "fig_tree_withered",
    "title": "How Quickly Did the Tree Wither?",
    "summary": "Checks Matthew 21:19 — at Jesus's word, immediately the fig tree withered — against Mark 11:20, where the disciples pass the tree the next morning and see it withered from its roots.",
    "ruleVerse": {
      "book": "Matthew",
      "chapter": 21,
      "verse": 19,
      "reference": "Matthew 21:19"
    },
    "rulesItDefines": [
      {
        "id": "rule_immediately_withered",
        "statement": "The cursed fig tree withered immediately, in the disciples' presence.",
        "plain": "Matthew times it: He said 'May you never bear fruit again!' and 'immediately the tree withered.' The disciples ask about it on the spot: 'How did the fig tree wither so quickly?' (21:20).",
        "subject": "fig_tree",
        "action": "wither",
        "target": "immediately",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "mark_next_morning",
        "entityId": "jesus",
        "verse": {
          "book": "Mark",
          "chapter": 11,
          "verse": 20,
          "reference": "Mark 11:20"
        },
        "violatesRule": "rule_immediately_withered",
        "violationExplanation": "Mark spreads the same curse across two days, with the temple cleansing in between: the curse is spoken (11:14), and 'as they were walking back in the morning, they saw the fig tree withered from its roots' — Peter remembering the curse then, as a discovery. In Mark no one sees it wither at all; it is found withered the next day.",
        "severity": 2,
        "verdict": "CONTRADICTION — Mark's tree is discovered withered the next morning."
      }
    ],
    "severity": 2,
    "verdict": "Matthew's withering is a public instant miracle: curse, wither, question, all in one scene. Mark's is an overnight process discovered on the walk back, after a whole temple episode has intervened. The speed of the sign — the thing Matthew's disciples marvel at — is the thing Mark's account does not have.",
    "scoreImpact": -0.5
  },
{
    "id": "zedekiah_peace",
    "title": "Die in Peace?",
    "summary": "Checks Jeremiah 34:5 — God's word to Zedekiah: you will die in peace, with spices burned and lamentation — against Jeremiah 52:11, his actual end: eyes put out, bronze shackles, a Babylonian prison until his dying day.",
    "ruleVerse": {
      "book": "Jeremiah",
      "chapter": 34,
      "verse": 5,
      "reference": "Jeremiah 34:5"
    },
    "rulesItDefines": [
      {
        "id": "rule_die_in_peace",
        "statement": "Zedekiah would die in peace.",
        "plain": "Jeremiah delivers it as God's own spoken word, twice guaranteed: 'you will die in peace. As spices were burned for your fathers, so people will burn spices for you and lament, “Alas, O master!” For I Myself have spoken this word, declares the LORD.'",
        "subject": "zedekiah",
        "action": "die",
        "target": "peace",
        "permitted": true
      }
    ],
    "testCases": [
      {
        "id": "jeremiah_blinded_prison",
        "entityId": "zedekiah",
        "verse": {
          "book": "Jeremiah",
          "chapter": 52,
          "verse": 11,
          "reference": "Jeremiah 52:11"
        },
        "violatesRule": "rule_die_in_peace",
        "violationExplanation": "Zedekiah's recorded end, in the same prophetic book: Nebuchadnezzar 'put out Zedekiah’s eyes, bound him with bronze shackles, and took him to Babylon, where he kept him in custody until his dying day' — after his sons were slaughtered before his eyes (52:10), the last thing he ever saw. No spices, no lament, no peace: a blinded prisoner dying in custody.",
        "severity": 2,
        "verdict": "CONTRADICTION — The promised peaceful death arrives as blinding and a foreign prison."
      }
    ],
    "severity": 2,
    "verdict": "Jeremiah promises Zedekiah, in God's name and on God's oath of authorship, a death in peace with royal honors. Jeremiah also records the death: sons executed before his eyes, eyes put out, chains, and a Babylonian cell for life. The same prophet carries both the promise and its opposite.",
    "scoreImpact": -0.5
  },
]

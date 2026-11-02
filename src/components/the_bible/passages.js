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
]

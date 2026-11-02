// src/components/the_bible/entities.js

export const ENTITIES = {
  jesus: {
    id: "jesus",
    name: "Jesus",
    aka: ["Son of Man", "Son of God", "Christ"],
    type: "person",
    description: "Central figure of the New Testament. Claims exclusive descent from heaven.",
    visualType: "person",
  },
  enoch: {
    id: "enoch",
    name: "Enoch",
    aka: ["son of Jared"],
    type: "person",
    description: "Seventh patriarch from Adam. Genesis states God took him — widely interpreted as ascension to heaven without death.",
    visualType: "person",
  },
  elijah: {
    id: "elijah",
    name: "Elijah",
    aka: ["Elijah the Tishbite"],
    type: "person",
    description: "Hebrew prophet. Taken up to heaven in a whirlwind with a chariot of fire. 2 Kings 2:11.",
    visualType: "person",
  },
  heaven: {
    id: "heaven",
    name: "Heaven",
    aka: ["the heavens", "paradise"],
    type: "place",
    description: "The divine realm. Claimed by John 3:13 to be exclusively accessible by descent, not ascent.",
    visualType: "place",
  },
  human: {
    id: "human",
    name: "Human",
    aka: ["mortal", "man", "person"],
    type: "concept",
    description: "Any person who has not descended from heaven.",
    visualType: "concept",
  },
  god: {
    "id": "god",
    "name": "God",
    "aka": [
      "the LORD",
      "Yahweh"
    ],
    "type": "person",
    "description": "God as speaker and actor throughout both testaments. His statements about Himself are the rules other passages are tested against.",
    "visualType": "person"
  },
  abraham: {
    "id": "abraham",
    "name": "Abraham",
    "aka": [
      "the patriarch"
    ],
    "type": "person",
    "description": "The patriarch whose burial cave at Machpelah is the Old Testament's most carefully documented purchase — and whose tomb, in Stephen's retelling, moves to Shechem and changes seller.",
    "visualType": "person"
  },
  jacob: {
    "id": "jacob",
    "name": "Jacob",
    "aka": [
      "Israel"
    ],
    "type": "person",
    "description": "Patriarch who wrestled at Peniel and named the place for what he said happened there: he had seen God face to face, and lived.",
    "visualType": "person"
  },
}

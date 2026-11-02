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
  john_the_baptist: {
    "id": "john_the_baptist",
    "name": "John the Baptist",
    "aka": [
      "the forerunner"
    ],
    "type": "person",
    "description": "The prophet in the wilderness who baptized Jesus. Asked directly if he was Elijah, he said he was not; Jesus said he was.",
    "visualType": "person"
  },
}
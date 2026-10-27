// src/components/the_bible/severity.js

export const SEVERITY = {
  1: {
    level: 1,
    label: "Level 1 — Scribal",
    name: "Scribal",
    plain: "a copying or wording slip, the least serious kind",
    description: "Minor textual inconsistency. Likely a copyist error or translation variation.",
    scoreImpact: -0.1,
    color: "#ffaa00",
  },
  2: {
    level: 2,
    label: "Level 2 — Narrative",
    name: "Narrative",
    plain: "two accounts disagree about what happened",
    description: "A contradiction between two narrative accounts or events.",
    scoreImpact: -0.5,
    color: "#ff6600",
  },
  3: {
    level: 3,
    label: "Level 3 — Doctrinal",
    name: "Doctrinal",
    plain: "this breaks the rule itself, the most serious kind",
    description: "A direct contradiction of a core theological claim made by scripture itself.",
    scoreImpact: -2.0,
    color: "#ff4444",
  },
}
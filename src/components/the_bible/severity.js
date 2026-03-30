// src/components/the_bible/severity.js

export const SEVERITY = {
  1: {
    level: 1,
    label: "Level 1 — Scribal",
    description: "Minor textual inconsistency. Likely a copyist error or translation variation.",
    scoreImpact: -0.1,
    color: "#ffaa00",
  },
  2: {
    level: 2,
    label: "Level 2 — Narrative",
    description: "A contradiction between two narrative accounts or events.",
    scoreImpact: -0.5,
    color: "#ff6600",
  },
  3: {
    level: 3,
    label: "Level 3 — Doctrinal",
    description: "A direct contradiction of a core theological claim made by scripture itself.",
    scoreImpact: -2.0,
    color: "#ff4444",
  },
}
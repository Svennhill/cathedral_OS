// scoring.js — Logic Integrity Score and Bible Truth Index for an analyser case

import { SEVERITY } from "../../the_bible/severity"
import { TOTAL_VERSES } from "../../../data/bsb"

// Every case run starts from a clean score; each broken rule subtracts its
// severity's scoreImpact (L3 Doctrinal = −2.0).
export const LOGIC_INTEGRITY_START = 100.0

export { TOTAL_VERSES }

export function computeScores(caseData, testedIds) {
  const tested = caseData.testCases.filter(tc => testedIds.includes(tc.id))
  const broken = tested.filter(tc => tc.violatesRule)

  const impact = broken.reduce((sum, tc) => sum + SEVERITY[tc.severity].scoreImpact, 0)

  // Verses examined: the rule verse (once any passage has been checked
  // against it) plus each tested passage
  const versesTested = tested.length ? 1 + tested.length : 0

  // Verses caught in a contradiction: each passage that broke a rule, and the
  // rule verse itself if anything contradicted it
  const versesContradicted = broken.length ? 1 + broken.length : 0

  const truthIndex = versesTested
    ? ((versesTested - versesContradicted) / versesTested) * 100
    : null

  return {
    tested,
    broken,
    impact,
    logicIntegrity: LOGIC_INTEGRITY_START + impact,
    versesTested,
    versesContradicted,
    truthIndex,
  }
}

export const fmtScore  = (n) => n.toFixed(1)
export const fmtImpact = (n) => (n < 0 ? "−" : "+") + Math.abs(n).toFixed(1)
export const fmtCount  = (n) => n.toLocaleString("en-US")

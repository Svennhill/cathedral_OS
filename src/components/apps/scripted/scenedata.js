// scenedata.js — the visual layer's own data for scripted.exe
//
// Nothing here is case data. Everything a case already says (who the
// figures are, which place the rules talk about, which passage breaks which
// rule) is read from passages.js by derivescene.js. This file only holds
// what the case data has no reason to carry:
//
//   ACTIONS  how to stage a rule's `action` as a scene: the ground the
//            figures start on and the words for the outcome. A case whose
//            barring rule uses an action not listed here simply has no
//            visual view (it stays panel-only).
//   ROSTER   ordinary people with no scriptural record, mixed in with the
//            case's figures. Dropping one in the zone is an error, never a
//            contradiction, and never touches the score.
//   DECOYS   how many roster people stand in each scene.

export const ACTIONS = {
  ascend: {
    ground: "Earth",      // label of the plane the figures stand on
    past:   "ascended",   // "Yes — Enoch ascended to heaven."
    prep:   "to",
    verb:   "Send",       // "Send Enoch up to Heaven"
    dir:    "up",
  },
}

// Plain modern names, chosen so none of them belongs to a biblical figure
// (a "Mary" invites the Assumption of Mary; a "John" reads as the author of
// John 3:13). Each case shows the same DECOYS people every time, picked
// from this list by the case id, so the scene doesn't reshuffle between views.
export const ROSTER = [
  { id: "linda",  name: "Linda"  },
  { id: "dave",   name: "Dave"   },
  { id: "gary",   name: "Gary"   },
  { id: "brenda", name: "Brenda" },
  { id: "kevin",  name: "Kevin"  },
  { id: "tracy",  name: "Tracy"  },
]

export const DECOYS = 2

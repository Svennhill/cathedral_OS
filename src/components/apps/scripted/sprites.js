// sprites.js — the visual layer's sprite registry for scripted.exe scenes
//
// Figures are layered pixel sprites on a 16×26 grid (files in public/scene/,
// drawn at 4× and shown at 32×52 CSS px, image-rendering: pixelated). One
// registry entry per person, keyed by the figure's lowercase name — the name
// deriveScene() already puts on every figure, whatever case they came from.
//
// Each entry has two palettes, "green" (the phosphor panel palette) and
// "color" (the full-color variant). Switching the scene's palette is this
// one constant plus the --scene-* variables in scenestyle.js — that pair
// is the whole swing. A figure with a "heaven" sprite uses it while it is
// up; without one, the earth sprite is used in both zones (the .up glow in
// scenestyle.js marks the difference).
//
// A person with no entry here falls back to the Person glyph in
// casescene.jsx, so a case with un-drawn people still stages and scores
// exactly the same — drawing a new figure is adding one entry and its PNGs.

export const SCENE_PALETTE = "green"   // "green" | "color"

const P = (name) => `/scene/${name}.png`

export const SPRITES = {
  jesus: {
    green: { earth: P("jesus-earth"),       heaven: P("jesus-heaven") },
    color: { earth: P("jesus-earth-color"), heaven: P("jesus-heaven-color") },
  },
  elijah: {
    green: { earth: P("elijah-earth"),       heaven: P("elijah-heaven") },
    color: { earth: P("elijah-earth-color"), heaven: P("elijah-earth-color") },
  },
  enoch: {
    green: { earth: P("enoch-earth") },
    color: { earth: P("enoch-earth-color") },
  },
  kevin: {
    green: { earth: P("kevin-earth") },
    color: { earth: P("kevin-earth-color") },
  },
  gary: {
    green: { earth: P("gary-earth") },
    color: { earth: P("gary-earth-color") },
  },
}

// The sprite for a figure, or null when the person has none (glyph fallback)
export function spriteFor(figure, up) {
  const entry = SPRITES[figure.name.toLowerCase()]?.[SCENE_PALETTE]
  if (!entry) return null
  return (up && entry.heaven) || entry.earth
}

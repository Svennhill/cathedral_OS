// src/data/bsb.js
// Berean Standard Bible (BSB) — public domain (CC0). https://berean.bible
//
// Local verse store for cathedral_OS. Only the verses the analyser cases use
// are included for now. To swap in the full Bible later, replace VERSES with
// the complete dataset in the same shape — { [book]: { [chapter]: { [verse]: text } } } —
// and nothing that reads through lookupVerse() needs to change.

export const TRANSLATION = "BSB"

// Verse count of the full 66-book Protestant canon. Used as the denominator in
// "Based on X of N verses tested".
export const TOTAL_VERSES = 31086

const VERSES = {
  "Genesis": {
    5: {
      24: "Enoch walked with God, and then he was no more, because God had taken him away.",
    },
  },
  "2 Kings": {
    2: {
      11: "As they were walking along and talking together, suddenly a chariot of fire with horses of fire appeared and separated the two of them, and Elijah went up into heaven in a whirlwind.",
    },
  },
  "John": {
    3: {
      13: "No one has ascended into heaven except the One who descended from heaven—the Son of Man.",
    },
  },
}

// Book names are matched loosely ("2 Kings", "2kings", "2_Kings", "john")
const normalize = (book) => String(book).toLowerCase().replace(/[\s_+]/g, "")

const BOOK_INDEX = Object.fromEntries(
  Object.keys(VERSES).map(name => [normalize(name), name])
)

// Canonical book name as stored, or null if the book isn't in the dataset
export function resolveBook(book) {
  return BOOK_INDEX[normalize(book)] ?? null
}

// Text of a single verse, or null if it isn't in the dataset
export function lookupVerse(book, chapter, verse) {
  const name = resolveBook(book)
  if (!name) return null
  return VERSES[name][Number(chapter)]?.[Number(verse)] ?? null
}

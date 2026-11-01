// src/data/bsb.js
// Berean Standard Bible (BSB) — public domain (CC0). https://berean.bible
//
// The one verse store for cathedral_OS: the analyser cases and the Bible
// reader both read from here. Text is the HelloAO BSB dataset, one JSON file
// per book in ./bsb-books/ ({ [chapter]: { [verse]: text } }), plus
// INDEX.json listing the 66 books in canonical order.
//
// Books load lazily — each file becomes its own chunk and is fetched the first
// time something asks for that book, so the initial bundle carries only the
// 5 KB index, never the Bible text.
//
//   resolveBook(book)            sync  → canonical book name, or null
//   lookupVerse(book, ch, v)     sync  → verse text, or null if the verse
//                                        doesn't exist OR its book isn't
//                                        loaded yet (call loadBook first)
//   loadBook(book)               async → the book's chapters, cached
//   getChapterVerses(book, ch)   async → [{ verse, text }] in order

import INDEX from "./bsb-books/INDEX.json"

export const TRANSLATION = "BSB"

// Display names where the dataset's short name would puzzle a lay reader
const DISPLAY_NAMES = { SNG: "Song of Songs" }

// Old Testament is the first 39 books of the Protestant canon
const OT_COUNT = 39

export const BOOKS = INDEX.map((b, i) => ({
  id: b.id,
  name: DISPLAY_NAMES[b.id] ?? b.name,
  chapters: b.chapters,
  verses: b.verses,
  testament: i < OT_COUNT ? "OT" : "NT",
}))

// Verse count of the whole BSB text (31,086 — the BSB leaves a handful of
// verses out of the main text). Denominator in "Based on X of N verses tested".
export const TOTAL_VERSES = BOOKS.reduce((n, b) => n + b.verses, 0)

// One lazy loader per book file, keyed by book id ("GEN", "2KI", "JHN" …)
const LOADERS = Object.fromEntries(
  Object.entries(
    import.meta.glob(["./bsb-books/*.json", "!./bsb-books/INDEX.json"], { import: "default" })
  ).map(([path, load]) => [path.match(/([^/]+)\.json$/)[1], load])
)

// Book names are matched loosely ("2 Kings", "2kings", "2_Kings", "john", "2KI")
const normalize = (book) => String(book).toLowerCase().replace(/[\s_+.]/g, "")

const ALIASES = { SNG: ["Song of Solomon"] }

const BY_KEY = {}
BOOKS.forEach((b, i) => {
  for (const key of [b.id, b.name, INDEX[i].name, ...(ALIASES[b.id] ?? [])]) {
    BY_KEY[normalize(key)] = b
  }
})

const bookFor = (book) => BY_KEY[normalize(book)] ?? null

// Canonical book name, or null if no book of the BSB matches
export function resolveBook(book) {
  return bookFor(book)?.name ?? null
}

// Loaded books, and in-flight loads so two callers share one fetch
const cache = {}
const pending = {}

export function loadBook(book) {
  const b = bookFor(book)
  if (!b) return Promise.reject(new Error(`Unknown book: ${book}`))
  if (cache[b.id]) return Promise.resolve(cache[b.id])
  pending[b.id] ??= LOADERS[b.id]()
    .then(data => (cache[b.id] = data))
    .finally(() => { delete pending[b.id] })
  return pending[b.id]
}

// Text of a single verse, or null if it doesn't exist / its book isn't loaded
export function lookupVerse(book, chapter, verse) {
  const b = bookFor(book)
  if (!b) return null
  return cache[b.id]?.[String(Number(chapter))]?.[String(Number(verse))] ?? null
}

// Every verse of one chapter, in order. Empty array if the chapter doesn't exist.
export async function getChapterVerses(book, chapter) {
  const data = await loadBook(book)
  const ch = data[String(Number(chapter))] ?? {}
  return Object.keys(ch)
    .map(Number)
    .sort((a, b) => a - b)
    .map(verse => ({ verse, text: ch[verse] }))
}

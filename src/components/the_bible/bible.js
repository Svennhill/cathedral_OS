// src/components/the_bible/bible.js
// Verse access for the analyser. Text comes from the local BSB store
// (src/data/bsb.js) — no network calls. Signatures stay async so a larger or
// remote dataset can be dropped in later without changing callers.

import { lookupVerse, resolveBook } from "../../data/bsb"

export async function getVerse(book, chapter, verse) {
  return lookupVerse(book, chapter, verse)
}

// Returns [{ bookname, chapter, verse, text }] for each verse in the range
// that exists in the dataset (same shape the old labs.bible.org call returned)
export async function getVerseRange(book, chapter, verseStart, verseEnd) {
  const bookname = resolveBook(book) ?? book
  const out = []
  for (let v = Number(verseStart); v <= Number(verseEnd); v++) {
    const text = lookupVerse(book, chapter, v)
    if (text !== null) out.push({ bookname, chapter: String(chapter), verse: String(v), text })
  }
  return out
}

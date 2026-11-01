// src/components/the_bible/bible.js
// Verse access for the analyser and the reader. Text comes from the local BSB
// store (src/data/bsb.js) — no network calls beyond loading a book's file the
// first time it's needed.

import { getChapterVerses, loadBook, lookupVerse, resolveBook } from "../../data/bsb"

export { BOOKS } from "../../data/bsb"

export async function getVerse(book, chapter, verse) {
  if (!resolveBook(book)) return null
  await loadBook(book)
  return lookupVerse(book, chapter, verse)
}

// Returns [{ bookname, chapter, verse, text }] for each verse in the range
// that exists in the dataset (same shape the old labs.bible.org call returned)
export async function getVerseRange(book, chapter, verseStart, verseEnd) {
  const bookname = resolveBook(book)
  if (!bookname) return []
  await loadBook(book)
  const out = []
  for (let v = Number(verseStart); v <= Number(verseEnd); v++) {
    const text = lookupVerse(book, chapter, v)
    if (text !== null) out.push({ bookname, chapter: String(chapter), verse: String(v), text })
  }
  return out
}

// Every verse of one chapter: [{ verse, text }]
export function getChapter(book, chapter) {
  return getChapterVerses(book, chapter)
}

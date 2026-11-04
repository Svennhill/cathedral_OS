// readerstore.js — where the Bible reader is in scripted.exe
//
// Module level, like casestore.js, so minimizing the window keeps your place.
// Deliberately not saved to localStorage: the reader is for browsing only,
// with no bookmarks.

import { useSyncExternalStore } from "react"
import { BOOKS } from "../../../data/bsb"

const initial = {
  open: false,    // reader showing instead of the case list
  step: 0,        // 0 pick a book · 1 pick a chapter · 2 read
  book: null,     // book id ("GEN" …) last picked
  chapter: null,  // chapter number last picked
}

let state = initial
const listeners = new Set()

function set(next) {
  state = { ...state, ...next }
  listeners.forEach(fn => fn())
}

const bookIndex = (id) => BOOKS.findIndex(b => b.id === id)

// The chapter before / after the one given, crossing book boundaries.
// null at Genesis 1 and Revelation 22.
export function neighbour(bookId, chapter, dir) {
  const i = bookIndex(bookId)
  if (i < 0) return null
  const ch = chapter + dir
  if (ch >= 1 && ch <= BOOKS[i].chapters) return { book: BOOKS[i].id, chapter: ch }
  const nb = BOOKS[i + dir]
  if (!nb) return null
  return { book: nb.id, chapter: dir < 0 ? nb.chapters : 1 }
}

export const readerActions = {
  // Re-opening resumes where you left off
  open()  { set({ open: true }) },
  close() { set({ open: false }) },
  goTo(step) { set({ step }) },
  pickBook(book) {
    set({ book, chapter: book === state.book ? state.chapter : null, step: 1 })
  },
  pickChapter(chapter) { set({ chapter, step: 2 }) },
  read(book, chapter)  { set({ book, chapter, step: 2 }) },
  // Logout / power-off: the next user starts with a closed reader
  reset() { set(initial) },
}

export function useReaderState() {
  return useSyncExternalStore(
    fn => { listeners.add(fn); return () => listeners.delete(fn) },
    () => state,
  )
}

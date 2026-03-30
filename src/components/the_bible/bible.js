export async function getVerse(book, chapter, verse) {
  const passage = `${book}+${chapter}:${verse}`
  const res = await fetch(`https://labs.bible.org/api/?passage=${passage}&type=json`)
  const data = await res.json()
  return data[0]?.text ?? null
}

export async function getVerseRange(book, chapter, verseStart, verseEnd) {
  const passage = `${book}+${chapter}:${verseStart}-${verseEnd}`
  const res = await fetch(`https://labs.bible.org/api/?passage=${passage}&type=json`)
  const data = await res.json()
  return data
}
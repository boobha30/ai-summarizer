// Counts words in a piece of text. Only pieces containing a letter or number
// count, so bullet markers like "*", "-" or "•" aren't counted as words.
function countWords(text) {
  return text.split(/\s+/).filter((piece) => /[\p{L}\p{N}]/u.test(piece)).length
}

export default countWords

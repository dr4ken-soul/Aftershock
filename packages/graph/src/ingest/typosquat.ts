/** Computes a bounded Levenshtein distance for deterministic name adjacency. */
export function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0]
    previous[0] = row
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column]
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      previous[column] = Math.min(previous[column] + 1, previous[column - 1] + 1, diagonal + cost)
      diagonal = above
    }
  }
  return previous[right.length]
}

/** Returns suspicious non-exact name pairs in the distance band used by ingest. */
export function findTyposquatPairs(names: string[]): { left: string, right: string, distance: number }[] {
  const pairs: { left: string, right: string, distance: number }[] = []
  const popular = names.slice(0, 24)
  for (const left of popular) {
    for (const right of names) {
      if (left === right) continue
      const distance = levenshteinDistance(left, right)
      if (distance >= 1 && distance <= 2) pairs.push({ left, right, distance })
    }
  }
  return pairs
}

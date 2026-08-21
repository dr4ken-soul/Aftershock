import { describe, expect, it } from 'vitest'
import { findTyposquatPairs, levenshteinDistance } from './typosquat.js'

describe('typosquat ingest', () => {
  it('keeps exact names out of the suspicious band', () => {
    expect(levenshteinDistance('left-pad', 'left-pad')).toBe(0)
    expect(findTyposquatPairs(['left-pad', 'leftpadd'])).toHaveLength(2)
    expect(findTyposquatPairs(['left-pad', 'leftpadd']).every((pair) => pair.distance > 0)).toBe(true)
  })
})

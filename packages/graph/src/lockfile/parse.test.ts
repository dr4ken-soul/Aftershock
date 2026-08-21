import { describe, expect, it } from 'vitest'
import { parseLockfile } from './parse.js'

describe('lockfile parser', () => {
  it('normalises npm v3 package paths', () => {
    const packages = parseLockfile({ packages: {
      '': { dependencies: { app: '1.0.0' } },
      'node_modules/app': { version: '1.0.0', dependencies: { 'left-pad': '1.0.0' } },
      'node_modules/left-pad': { version: '1.0.0' },
    } })
    expect(packages.find((entry) => entry.name === 'left-pad')?.path).toEqual(['root', 'app@1.0.0', 'left-pad@1.0.0'])
  })
})

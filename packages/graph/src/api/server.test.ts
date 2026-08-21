import { describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { buildServer } from './server.js'

describe('graph API', () => {
  it('returns traversal evidence in offline verification mode', async () => {
    const fixture = fileURLToPath(new URL('../../fixtures/packages.jsonl', import.meta.url))
    const server = await buildServer(fixture, true)
    const response = await server.inject({ method: 'POST', url: '/api/exposure', payload: { package: 'left-pad' } })
    expect(response.statusCode).toBe(200)
    expect(response.json().totalExposed).toBe(84)
    expect(response.json().events[0].viaPath.length).toBeGreaterThan(2)
    await server.close()
  })
})

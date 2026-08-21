import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { GraphRuntime } from '../runtime.js'
import { healthcheck } from '../graph/client.js'

const packageBody = z.object({ package: z.string().min(1).max(128) })

/** Registers the five graph-backed API endpoints. */
export function registerRoutes(server: FastifyInstance, runtime: GraphRuntime, handlers: {
  getExposureReport: typeof import('../runtime.js').getExposureReport
  getNeighbourhood: typeof import('../runtime.js').getNeighbourhood
  getTyposquats: typeof import('../runtime.js').getTyposquats
  simulatePackage: typeof import('../commands/simulate.js').simulatePackage
  scanLockfile: typeof import('../commands/scan.js').scanLockfile
}): void {
  server.get('/health', async () => runtime.mode === 'offline' ? { ok: true, graph: 'offline' } : { ok: true, graph: 'bolt', roundTripMs: await healthcheck(runtime.driver!) })
  server.post('/api/simulate', async (request, reply) => {
    const body = packageBody.parse(request.body)
    return reply.send({ events: await handlers.simulatePackage(runtime, body.package) })
  })
  server.post('/api/exposure', async (request, reply) => {
    const body = packageBody.parse(request.body)
    return reply.send(await handlers.getExposureReport(runtime, body.package))
  })
  server.post('/api/scan', async (request, reply) => {
    const lockfile = z.record(z.unknown()).parse(request.body)
    const temporaryPath = `${process.cwd()}/.aftershock-lockfile.json`
    const { writeFile, unlink } = await import('node:fs/promises')
    await writeFile(temporaryPath, JSON.stringify(lockfile), 'utf8')
    try {
      return reply.send({ findings: await handlers.scanLockfile(runtime, temporaryPath) })
    } finally {
      await unlink(temporaryPath).catch(() => undefined)
    }
  })
  server.post('/api/neighbourhood', async (request, reply) => {
    const body = packageBody.parse(request.body)
    return reply.send({ package: body.package, neighbourhood: await handlers.getNeighbourhood(runtime, body.package) })
  })
  server.post('/api/typosquats', async (request, reply) => {
    const body = packageBody.parse(request.body)
    return reply.send({ package: body.package, typosquats: await handlers.getTyposquats(runtime, body.package) })
  })
}

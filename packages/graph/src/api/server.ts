import Fastify, { type FastifyInstance } from 'fastify'
import { resolve } from 'node:path'
import { createRuntime, closeRuntime, getExposureReport, getNeighbourhood, getTyposquats } from '../runtime.js'
import { scanLockfile } from '../commands/scan.js'
import { simulatePackage } from '../commands/simulate.js'
import { registerRoutes } from './routes.js'

/** Creates a Fastify API whose handlers delegate to graph traversals. */
export async function buildServer(fixturePath: string, offline = false): Promise<FastifyInstance> {
  const server = Fastify({ logger: false })
  const runtime = await createRuntime(resolve(fixturePath), offline)
  server.addHook('onClose', async () => closeRuntime(runtime))
  registerRoutes(server, runtime, { getExposureReport, getNeighbourhood, getTyposquats, simulatePackage, scanLockfile })
  return server
}

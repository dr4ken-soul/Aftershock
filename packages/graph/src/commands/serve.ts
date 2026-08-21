import { buildServer } from '../api/server.js'

/** Starts the Fastify exposure API on the configured port. */
export async function serveApi(fixturePath: string, offline = false, port = Number(process.env.PORT ?? 8787)): Promise<void> {
  const server = await buildServer(fixturePath, offline)
  await server.listen({ host: '0.0.0.0', port })
}

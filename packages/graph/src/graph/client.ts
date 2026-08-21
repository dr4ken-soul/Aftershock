import neo4j, { type Driver, type Record as Neo4jRecord } from 'neo4j-driver'

/** Returns a Bolt driver pointed at Hydradb, one instance per process. */
export function createDriver(): Driver {
  const uri = process.env.HYDRADB_URI
  if (!uri) {
    throw new Error('HYDRADB_URI is not set, default is bolt://localhost:7687')
  }
  return neo4j.driver(uri)
}

/** Runs a Cypher statement through the Hydradb Bolt endpoint. */
export async function runQuery<T = Record<string, unknown>>(
  driver: Driver,
  text: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const session = driver.session()
  try {
    const result = await session.run(text, params)
    return result.records.map((record: Neo4jRecord) => record.toObject() as T)
  } finally {
    await session.close()
  }
}

/** Measures the Bolt round trip for a minimal Hydradb health query. */
export async function healthcheck(driver: Driver): Promise<number> {
  const startedAt = performance.now()
  await runQuery(driver, 'RETURN 1 AS healthy')
  return Math.round((performance.now() - startedAt) * 100) / 100
}

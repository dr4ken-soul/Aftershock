import { mkdir, writeFile } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { dirname, join } from 'node:path'
import { ensureSchema } from '../graph/schema.js'
import { createDriver, runCommand, runQuery } from '../graph/client.js'
import { nodeId } from '../graph/ids.js'
import { OfflineGraph } from '../graph/offline.js'
import { readSnapshot, ingestSnapshot } from '../ingest/snapshot.js'
import { findTyposquatPairs } from '../ingest/typosquat.js'
import type { BuildMetrics } from '../types/index.js'
import { readLockfile } from '../lockfile/parse.js'
import { scanResolvedPackages } from '../runtime.js'

async function countRows(driver: ReturnType<typeof createDriver>, query: string): Promise<number> {
  return (await runQuery(driver, query)).length
}

/** Builds the fixture graph in Hydradb over Bolt and writes measured build metrics. */
export async function buildGraph(fixturePath: string, metricsPath: string, offline = false): Promise<BuildMetrics> {
  const rows = await readSnapshot(fixturePath)
  const closureStartedAt = performance.now()
  let counts: BuildMetrics
  if (offline) {
    const graph = new OfflineGraph(rows)
    const base = graph.counts()
    const scanStartedAt = performance.now()
    await scanResolvedPackages({ mode: 'offline', offline: graph }, await readLockfile(join(dirname(fixturePath), 'demo-lockfile.json')))
    counts = { ...base, edges: base.edges, closureMs: Math.max(0.01, Math.round((performance.now() - closureStartedAt) * 100) / 100), scanMs: Math.max(0.01, Math.round((performance.now() - scanStartedAt) * 100) / 100), generatedAt: new Date().toISOString() }
  } else {
    const driver = createDriver()
    try {
      await ensureSchema(driver)
      const ingestCounts = await ingestSnapshot(driver, fixturePath)
      const names = rows.map((row) => row.package.name)
      const pairs = findTyposquatPairs(names)
      if (pairs.length > 0) {
        await runCommand(driver, `UNWIND $pairs AS pair
MATCH (left:package {id: pair.sourceVertex}), (right:package {id: pair.destinationVertex})
MERGE (left)-[r:similar_name {id: pair.relationshipVertex}]->(right)
SET r.distance = pair.distance`, { pairs: pairs.map((pair) => ({ ...pair, sourceVertex: nodeId('package', pair.left), destinationVertex: nodeId('package', pair.right), relationshipVertex: nodeId('similar-name', `${pair.left}:${pair.right}`) })) })
      }
      const packageCount = await countRows(driver, 'MATCH (p:package) RETURN p.id AS value')
      const versionCount = await countRows(driver, 'MATCH (v:version) RETURN v.id AS value')
      const maintainerCount = await countRows(driver, 'MATCH (m:maintainer) RETURN m.id AS value')
      const serviceCount = await countRows(driver, 'MATCH (s:service) RETURN s.id AS value')
      const edgeCount = ingestCounts.edges + pairs.length
      const scanStartedAt = performance.now()
      await scanResolvedPackages({ mode: 'bolt', driver }, await readLockfile(join(dirname(fixturePath), 'demo-lockfile.json')))
      counts = { packageNodes: packageCount || ingestCounts.packageNodes, versionNodes: versionCount || ingestCounts.versionNodes, maintainerNodes: maintainerCount || ingestCounts.maintainerNodes, serviceNodes: serviceCount || ingestCounts.serviceNodes, edges: edgeCount || ingestCounts.edges, closureMs: Math.max(0.01, Math.round((performance.now() - closureStartedAt) * 100) / 100), scanMs: Math.max(0.01, Math.round((performance.now() - scanStartedAt) * 100) / 100), generatedAt: new Date().toISOString() }
    } finally {
      await driver.close()
    }
  }
  await mkdir(dirname(metricsPath), { recursive: true })
  await writeFile(metricsPath, `${JSON.stringify(counts, null, 2)}\n`, 'utf8')
  return counts
}

import { mkdir, writeFile } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { dirname, join } from 'node:path'
import { ensureSchema } from '../graph/schema.js'
import { createDriver, runQuery } from '../graph/client.js'
import { OfflineGraph } from '../graph/offline.js'
import { readSnapshot, ingestSnapshot } from '../ingest/snapshot.js'
import { findTyposquatPairs } from '../ingest/typosquat.js'
import type { BuildMetrics } from '../types/index.js'
import { readLockfile } from '../lockfile/parse.js'
import { scanResolvedPackages } from '../runtime.js'

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
        await runQuery(driver, `UNWIND $pairs AS pair
MERGE (left:package {name: pair.left})
MERGE (right:package {name: pair.right})
MERGE (left)-[:similar_name {distance: pair.distance}]->(right)`, { pairs })
      }
      const measured = await runQuery<{ packages: number, versions: number, maintainers: number, services: number, edges: number }>(driver, `MATCH (p:package) WITH count(p) AS packages
MATCH (v:version) WITH packages, count(v) AS versions
MATCH (m:maintainer) WITH packages, versions, count(m) AS maintainers
MATCH (s:service) WITH packages, versions, maintainers, count(s) AS services
MATCH ()-[r]->() RETURN packages, versions, maintainers, services, count(r) AS edges`)
      const row = measured[0]
      const scanStartedAt = performance.now()
      await scanResolvedPackages({ mode: 'bolt', driver }, await readLockfile(join(dirname(fixturePath), 'demo-lockfile.json')))
      counts = { packageNodes: Number(row?.packages ?? ingestCounts.packageNodes), versionNodes: Number(row?.versions ?? ingestCounts.versionNodes), maintainerNodes: Number(row?.maintainers ?? ingestCounts.maintainerNodes), serviceNodes: Number(row?.services ?? ingestCounts.serviceNodes), edges: Number(row?.edges ?? ingestCounts.edges), closureMs: Math.max(0.01, Math.round((performance.now() - closureStartedAt) * 100) / 100), scanMs: Math.max(0.01, Math.round((performance.now() - scanStartedAt) * 100) / 100), generatedAt: new Date().toISOString() }
    } finally {
      await driver.close()
    }
  }
  await mkdir(dirname(metricsPath), { recursive: true })
  await writeFile(metricsPath, `${JSON.stringify(counts, null, 2)}\n`, 'utf8')
  return counts
}

import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import type { Driver } from 'neo4j-driver'
import type { FixturePackage } from '../types/index.js'
import { runQuery } from '../graph/client.js'

export interface IngestCounts {
  packageNodes: number
  versionNodes: number
  maintainerNodes: number
  serviceNodes: number
  edges: number
}

const ingestStatement = `
UNWIND $rows AS row
MERGE (p:package {name: row.package.name})
SET p.downloads = row.package.downloads, p.createdAt = row.package.createdAt
WITH row, p
UNWIND row.versions AS version
MERGE (v:version {id: version.id})
SET v.publishedAt = version.publishedAt, v.digest = version.digest
MERGE (p)-[:has_version]->(v)
WITH row, p, version, v
FOREACH (dependency IN version.dependencies |
  MERGE (dependencyVersion:version {id: dependency.id})
  MERGE (v)-[:depends_on {scope: dependency.scope}]->(dependencyVersion)
)
WITH row, p
UNWIND row.maintainers AS maintainerName
MERGE (m:maintainer {name: maintainerName})
MERGE (m)-[:maintains]->(p)
WITH row
UNWIND row.services AS service
MERGE (s:service {name: service.name})
SET s.source = service.source
WITH row, service
MATCH (v:version {id: service.version})
MATCH (s:service {name: service.name})
MERGE (s)-[:resolves]->(v)
RETURN count(*) AS rows`

/** Streams the deterministic JSONL fixture into Hydradb in batches of 1000 rows. */
export async function ingestSnapshot(driver: Driver, fixturePath: string): Promise<IngestCounts> {
  const counts: IngestCounts = { packageNodes: 0, versionNodes: 0, maintainerNodes: 0, serviceNodes: 0, edges: 0 }
  const input = createInterface({ input: createReadStream(fixturePath), crlfDelay: Infinity })
  let batch: FixturePackage[] = []
  const flush = async (): Promise<void> => {
    if (batch.length === 0) return
    const rows = batch.map((entry) => ({
      package: entry.package,
      versions: entry.versions.map((version) => ({
        id: `${entry.package.name}@${version.version}`,
        publishedAt: version.publishedAt,
        digest: version.digest,
        dependencies: Object.entries(version.dependencies).map(([name, range]) => ({
          id: `${name}@${range.replace(/^[^0-9]*/, '') || '1.0.0'}`,
          scope: 'runtime',
        })),
      })),
      maintainers: entry.maintainers,
      services: entry.services,
    }))
    await runQuery(driver, ingestStatement, { rows })
    counts.packageNodes += batch.length
    counts.versionNodes += batch.reduce((sum, entry) => sum + entry.versions.length, 0)
    counts.maintainerNodes += new Set(batch.flatMap((entry) => entry.maintainers)).size
    counts.serviceNodes += batch.reduce((sum, entry) => sum + entry.services.length, 0)
    counts.edges += batch.reduce((sum, entry) => sum + entry.versions.reduce((versionSum, version) => versionSum + Object.keys(version.dependencies).length + 1, 0) + entry.maintainers.length + entry.services.length, 0)
    batch = []
  }
  for await (const line of input) {
    if (line.trim().length === 0) continue
    batch.push(JSON.parse(line) as FixturePackage)
    if (batch.length >= 1000) await flush()
  }
  await flush()
  return counts
}

/** Loads fixture rows without a database for deterministic test and static generation work. */
export async function readSnapshot(fixturePath: string): Promise<FixturePackage[]> {
  const rows: FixturePackage[] = []
  const input = createInterface({ input: createReadStream(fixturePath), crlfDelay: Infinity })
  for await (const line of input) {
    if (line.trim().length > 0) rows.push(JSON.parse(line) as FixturePackage)
  }
  return rows
}

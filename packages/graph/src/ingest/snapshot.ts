import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import type { Driver } from 'neo4j-driver'
import type { FixturePackage } from '../types/index.js'
import { runCommand } from '../graph/client.js'
import { nodeId } from '../graph/ids.js'

export interface IngestCounts {
  packageNodes: number
  versionNodes: number
  maintainerNodes: number
  serviceNodes: number
  edges: number
}

const packageVertexStatement = `
UNWIND $rows AS row
MERGE (p {id: row.vertex})
SET p:package, p.name = row.name, p.downloads = row.downloads, p.createdAt = row.createdAt
`

const versionVertexStatement = `
UNWIND $rows AS row
MERGE (v {id: row.vertex})
SET v:version, v.key = row.key, v.publishedAt = row.publishedAt, v.digest = row.digest
`

const maintainerVertexStatement = `
UNWIND $rows AS row
MERGE (m {id: row.vertex})
SET m:maintainer, m.name = row.name
`

const serviceVertexStatement = `
UNWIND $rows AS row
MERGE (s {id: row.vertex})
SET s:service, s.name = row.name, s.source = row.source
`

const packageVersionStatement = `
UNWIND $rows AS row
MATCH (p:package {id: row.sourceVertex}), (v:version {id: row.destinationVertex})
MERGE (p)-[r:has_version {id: row.relationshipVertex}]->(v)
`

const dependencyStatement = `
UNWIND $rows AS row
MATCH (v:version {id: row.sourceVertex}), (dependencyVersion:version {id: row.destinationVertex})
MERGE (v)-[r:depends_on {id: row.relationshipVertex}]->(dependencyVersion)
SET r.scope = row.scope
`

const reverseDependencyStatement = `
UNWIND $rows AS row
MATCH (v:version {id: row.sourceVertex}), (dependencyVersion:version {id: row.destinationVertex})
MERGE (dependencyVersion)-[r:required_by {id: row.reverseRelationshipVertex}]->(v)
`

const maintainerStatement = `
UNWIND $rows AS row
MATCH (m:maintainer {id: row.sourceVertex}), (p:package {id: row.destinationVertex})
MERGE (m)-[r:maintains {id: row.relationshipVertex}]->(p)
`

const serviceStatement = `
UNWIND $rows AS row
MATCH (s:service {id: row.sourceVertex}), (v:version {id: row.destinationVertex})
MERGE (s)-[r:resolves {id: row.relationshipVertex}]->(v)
`

async function runBatched<T extends Record<string, unknown>>(driver: Driver, statement: string, rows: T[]): Promise<void> {
  for (let offset = 0; offset < rows.length; offset += 512) {
    await runCommand(driver, statement, { rows: rows.slice(offset, offset + 512) })
  }
}

/** Streams the deterministic JSONL fixture into Hydradb in batches of 1000 rows. */
export async function ingestSnapshot(driver: Driver, fixturePath: string): Promise<IngestCounts> {
  const counts: IngestCounts = { packageNodes: 0, versionNodes: 0, maintainerNodes: 0, serviceNodes: 0, edges: 0 }
  const input = createInterface({ input: createReadStream(fixturePath), crlfDelay: Infinity })
  let batch: FixturePackage[] = []
  const flush = async (): Promise<void> => {
    if (batch.length === 0) return
    const packageRows = batch.map((entry) => ({ vertex: nodeId('package', entry.package.name), name: entry.package.name, downloads: entry.package.downloads, createdAt: entry.package.createdAt }))
    const versionRows = batch.flatMap((entry) => entry.versions.map((version) => ({
      vertex: nodeId('version', `${entry.package.name}@${version.version}`),
      key: `${entry.package.name}@${version.version}`,
      publishedAt: version.publishedAt,
      digest: version.digest,
    })))
    const packageVersionRows = batch.flatMap((entry) => entry.versions.map((version) => ({
      relationshipVertex: nodeId('has-version', `${entry.package.name}@${version.version}`),
      sourceVertex: nodeId('package', entry.package.name),
      destinationVertex: nodeId('version', `${entry.package.name}@${version.version}`),
    })))
    const dependencyRows = batch.flatMap((entry) => entry.versions.flatMap((version) => Object.entries(version.dependencies).map(([name, range]) => ({
      relationshipVertex: nodeId('depends-on', `${entry.package.name}@${version.version}:${name}@${range}`),
      reverseRelationshipVertex: nodeId('required-by', `${entry.package.name}@${version.version}:${name}@${range}`),
      sourceVertex: nodeId('version', `${entry.package.name}@${version.version}`),
      destinationVertex: nodeId('version', `${name}@${range.replace(/^[^0-9]*/, '') || '1.0.0'}`),
      dependencyKey: `${name}@${range.replace(/^[^0-9]*/, '') || '1.0.0'}`,
      scope: 'runtime',
    }))))
    const dependencyVersionRows = dependencyRows.map((row) => ({ vertex: row.destinationVertex, key: row.dependencyKey, publishedAt: 0, digest: 'dependency' }))
    const allVersionRows = [...new Map([...versionRows, ...dependencyVersionRows].map((row) => [row.key, row])).values()]
    const maintainerRows = batch.flatMap((entry) => entry.maintainers.map((name) => ({ relationshipVertex: nodeId('maintains', `${name}:${entry.package.name}`), sourceVertex: nodeId('maintainer', name), destinationVertex: nodeId('package', entry.package.name) })))
    const maintainerVertices = [...new Set(batch.flatMap((entry) => entry.maintainers))].map((name) => ({ vertex: nodeId('maintainer', name), name }))
    const serviceRows = batch.flatMap((entry) => entry.services.map((service) => ({ relationshipVertex: nodeId('resolves', `${service.name}:${service.version}`), sourceVertex: nodeId('service', service.name), destinationVertex: nodeId('version', service.version) })))
    const serviceVertices = batch.flatMap((entry) => entry.services.map((service) => ({ vertex: nodeId('service', service.name), name: service.name, source: service.source })))
    await runBatched(driver, packageVertexStatement, packageRows)
    await runBatched(driver, versionVertexStatement, allVersionRows)
    await runBatched(driver, maintainerVertexStatement, maintainerVertices)
    await runBatched(driver, serviceVertexStatement, serviceVertices)
    await runBatched(driver, packageVersionStatement, packageVersionRows)
    if (dependencyRows.length > 0) await runBatched(driver, dependencyStatement, dependencyRows)
    if (dependencyRows.length > 0) await runBatched(driver, reverseDependencyStatement, dependencyRows)
    if (maintainerRows.length > 0) await runBatched(driver, maintainerStatement, maintainerRows)
    if (serviceRows.length > 0) await runBatched(driver, serviceStatement, serviceRows)
    counts.packageNodes += batch.length
    counts.versionNodes += batch.reduce((sum, entry) => sum + entry.versions.length, 0)
    counts.maintainerNodes += new Set(batch.flatMap((entry) => entry.maintainers)).size
    counts.serviceNodes += batch.reduce((sum, entry) => sum + entry.services.length, 0)
    counts.edges += batch.reduce((sum, entry) => sum + entry.versions.reduce((versionSum, version) => versionSum + (Object.keys(version.dependencies).length * 2) + 1, 0) + entry.maintainers.length + entry.services.length, 0)
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

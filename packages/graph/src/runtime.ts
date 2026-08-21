import type { Driver } from 'neo4j-driver'
import { createDriver, runQuery } from './graph/client.js'
import { OfflineGraph } from './graph/offline.js'
import { exposureClosureQuery, lockfileJoinQuery, maintainerNeighbourhoodQuery, typosquatRingQuery, versionWindowQuery } from './graph/queries.js'
import { readSnapshot } from './ingest/snapshot.js'
import { buildSpreadEvents, maxSpreadDepth } from './sim/spread.js'
import type { ClosureRow, ExposureReport, FixturePackage, LockfileFinding } from './types/index.js'
import { toLockfileFindings, type ResolvedLockfilePackage } from './lockfile/parse.js'

export interface GraphRuntime {
  mode: 'bolt' | 'offline'
  driver?: Driver
  offline?: OfflineGraph
}

/** Creates the production Bolt runtime or the explicit offline fixture runtime. */
export async function createRuntime(fixturePath: string, offline = false): Promise<GraphRuntime> {
  if (offline) return { mode: 'offline', offline: new OfflineGraph(await readSnapshot(fixturePath)) }
  return { mode: 'bolt', driver: createDriver() }
}

/** Closes a runtime driver when a command or server has finished. */
export async function closeRuntime(runtime: GraphRuntime): Promise<void> {
  if (runtime.driver) await runtime.driver.close()
}

/** Runs one of the five graph queries through the selected runtime. */
export async function queryRuntime<T>(runtime: GraphRuntime, query: { text: string, params: Record<string, unknown> }): Promise<T[]> {
  if (runtime.mode === 'offline') return runtime.offline!.query<T>(query)
  return runQuery<T>(runtime.driver!, query.text, query.params)
}

/** Builds the exposure report from the versioned graph and query evidence. */
export async function getExposureReport(runtime: GraphRuntime, packageName: string): Promise<ExposureReport> {
  const versionRows = await queryRuntime<{ version: string, publishedAt: number }>(runtime, versionWindowQuery(packageName))
  if (versionRows.length === 0) throw new Error(`Package not found in graph: ${packageName}`)
  const flagged = versionRows[0]
  const version = flagged.version.includes('@') ? flagged.version.split('@').slice(1).join('@') : flagged.version
  const rows = await queryRuntime<ClosureRow>(runtime, exposureClosureQuery(packageName, version))
  const compromise = { package: packageName, version, flaggedAt: Number(flagged.publishedAt) }
  const events = buildSpreadEvents(rows.map((row) => ({ ...row, depth: Number(row.depth), publishedAt: Number(row.publishedAt) })), compromise, Number(process.env.AFTERSHOCK_SPREAD_SCALE ?? 10))
  const neighbourhood = await getNeighbourhood(runtime, packageName)
  const typosquats = await getTyposquats(runtime, packageName)
  return { comprom: compromise, totalExposed: events.length, maxDepth: maxSpreadDepth(events), events, maintainerNeighbourhood: neighbourhood, typosquats }
}

/** Returns the maintainer neighbourhood evidence for one package. */
export async function getNeighbourhood(runtime: GraphRuntime, packageName: string): Promise<string[]> {
  const rows = await queryRuntime<{ name: string }>(runtime, maintainerNeighbourhoodQuery(packageName))
  return rows.map((row) => row.name)
}

/** Returns the ranked similar-name ring evidence for one package. */
export async function getTyposquats(runtime: GraphRuntime, packageName: string): Promise<{ name: string, distance: number }[]> {
  const rows = await queryRuntime<{ name: string, distance: number }>(runtime, typosquatRingQuery(packageName))
  return rows.map((row) => ({ name: row.name, distance: Number(row.distance) }))
}

/** Joins parsed lockfile resolutions to graph services and returns only exposed findings. */
export async function scanResolvedPackages(runtime: GraphRuntime, packages: ResolvedLockfilePackage[], packageName = 'left-pad'): Promise<LockfileFinding[]> {
  const resolvedIds = packages.map((item) => item.resolved)
  const joins = await queryRuntime<{ service: string, resolved: string, path: string[] }>(runtime, lockfileJoinQuery(resolvedIds))
  const report = await getExposureReport(runtime, packageName)
  const exposedIds = new Set(report.events.map((event) => `${event.name}@${event.version}`))
  exposedIds.add(`${packageName}@${report.comprom.version}`)
  const joined = joins.map((row) => ({ resolved: row.resolved, path: packages.find((item) => item.resolved === row.resolved)?.path ?? row.path }))
  return toLockfileFindings(joined.filter((row) => exposedIds.has(row.resolved) || row.resolved === `${packageName}@${report.comprom.version}`), exposedIds)
}

/** Reads the snapshot into a package list for generation and diagnostics. */
export async function loadFixture(fixturePath: string): Promise<FixturePackage[]> {
  return readSnapshot(fixturePath)
}

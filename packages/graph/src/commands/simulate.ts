import { buildSpreadEvents } from '../sim/spread.js'
import { exposureClosureQuery, versionWindowQuery } from '../graph/queries.js'
import { queryRuntime, type GraphRuntime } from '../runtime.js'
import type { ClosureRow } from '../types/index.js'

/** Simulates a patient-zero compromise and returns the shared timed event stream. */
export async function simulatePackage(runtime: GraphRuntime, packageName: string) {
  const versions = await queryRuntime<{ version: string, publishedAt: number }>(runtime, versionWindowQuery(packageName))
  if (versions.length === 0) throw new Error(`Package not found in graph: ${packageName}`)
  const versionId = versions[0].version
  const version = versionId.split('@').slice(1).join('@')
  const rows = await queryRuntime<ClosureRow>(runtime, exposureClosureQuery(packageName, version))
  return buildSpreadEvents(rows.map((row) => ({ ...row, depth: Number(row.depth), publishedAt: Number(row.publishedAt) })), { package: packageName, version, flaggedAt: Number(versions[0].publishedAt) }, Number(process.env.AFTERSHOCK_SPREAD_SCALE ?? 10))
}

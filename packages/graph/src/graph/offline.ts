import type { FixturePackage, ClosureRow, LockfileFinding, QuerySpec } from '../types/index.js'
import { exposureClosureQuery, lockfileJoinQuery, maintainerNeighbourhoodQuery, typosquatRingQuery, versionWindowQuery } from './queries.js'
import { levenshteinDistance } from '../ingest/typosquat.js'

interface OfflineVersion {
  id: string
  packageName: string
  version: string
  publishedAt: number
  dependencies: string[]
}

/** Provides a deterministic fixture graph for tests when Hydradb is not available. */
export class OfflineGraph {
  private readonly packages = new Map<string, FixturePackage>()
  private readonly versions = new Map<string, OfflineVersion>()

  public constructor(rows: FixturePackage[]) {
    for (const row of rows) {
      this.packages.set(row.package.name, row)
      for (const version of row.versions) {
        this.versions.set(`${row.package.name}@${version.version}`, {
          id: `${row.package.name}@${version.version}`,
          packageName: row.package.name,
          version: version.version,
          publishedAt: version.publishedAt,
          dependencies: Object.entries(version.dependencies).map(([name, dependencyVersion]) => `${name}@${dependencyVersion}`),
        })
      }
    }
  }

  /** Executes the same logical graph operation represented by a production query. */
  public async query<T>(query: QuerySpec): Promise<T[]> {
    if (query.text.includes('target:version') || query.text.includes('required_by')) return this.closure(query.params.packageName as string, query.params.versionId as string) as T[]
    if (query.text.includes('ORDER BY v.publishedAt')) return this.versionWindow(query.params.packageName as string) as T[]
    if (query.text.includes('resolves')) return this.lockfileJoin([query.params.resolvedId as string]) as T[]
    if (query.text.includes('maintains')) return this.neighbourhood(query.params.packageName as string) as T[]
    if (query.text.includes('similar_name')) return this.typosquats(query.params.packageName as string) as T[]
    return []
  }

  /** Returns a count summary equivalent to the nodes and edges written by ingest. */
  public counts(): { packageNodes: number, versionNodes: number, maintainerNodes: number, serviceNodes: number, edges: number } {
    const maintainers = new Set<string>()
    let services = 0
    let edges = 0
    let versions = 0
    for (const row of this.packages.values()) {
      row.maintainers.forEach((name) => maintainers.add(name))
      services += row.services.length
      versions += row.versions.length
      edges += row.versions.reduce((sum, version) => sum + Object.keys(version.dependencies).length + 1, 0) + row.maintainers.length + row.services.length
    }
    const typoEdges = this.typoPairs().length
    return { packageNodes: this.packages.size, versionNodes: versions, maintainerNodes: maintainers.size, serviceNodes: services, edges: edges + typoEdges }
  }

  private closure(packageName: string, versionId: string): ClosureRow[] {
    if (!this.versions.has(versionId) || !this.packages.has(packageName)) return []
    const reverse = new Map<string, string[]>()
    for (const version of this.versions.values()) {
      for (const dependency of version.dependencies) {
        const dependents = reverse.get(dependency) ?? []
        dependents.push(version.id)
        reverse.set(dependency, dependents)
      }
    }
    const rows: ClosureRow[] = []
    const queue: { id: string, depth: number, path: string[] }[] = [{ id: versionId, depth: 0, path: [versionId] }]
    const seen = new Set<string>([versionId])
    while (queue.length > 0) {
      const current = queue.shift()!
      for (const dependent of reverse.get(current.id) ?? []) {
        if (seen.has(dependent)) continue
        seen.add(dependent)
        const nextPath = [...current.path, dependent]
        const version = this.versions.get(dependent)!
        rows.push({ exposed: dependent, depth: current.depth + 1, path: nextPath, publishedAt: version.publishedAt })
        queue.push({ id: dependent, depth: current.depth + 1, path: nextPath })
      }
    }
    return rows.sort((left, right) => left.depth - right.depth || left.exposed.localeCompare(right.exposed))
  }

  private versionWindow(packageName: string): { package: string, version: string, publishedAt: number }[] {
    const row = this.packages.get(packageName)
    if (!row) return []
    const first = [...row.versions].sort((left, right) => left.publishedAt - right.publishedAt)[0]
    return first ? [{ package: packageName, version: `${packageName}@${first.version}`, publishedAt: first.publishedAt }] : []
  }

  private lockfileJoin(resolvedIds: string[]): { service: string, resolved: string, path: string[] }[] {
    const found: { service: string, resolved: string, path: string[] }[] = []
    for (const row of this.packages.values()) {
      for (const service of row.services) {
        if (resolvedIds.includes(service.version)) found.push({ service: service.name, resolved: service.version, path: [service.name, service.version] })
      }
    }
    return found
  }

  private neighbourhood(packageName: string): { name: string, path: string[] }[] {
    const row = this.packages.get(packageName)
    if (!row) return []
    const maintainers = new Set(row.maintainers)
    const names = new Set<string>()
    for (const candidate of this.packages.values()) {
      if (candidate.package.name !== packageName && candidate.maintainers.some((name) => maintainers.has(name))) names.add(candidate.package.name)
    }
    return [...names].sort().map((name) => ({ name, path: [packageName, ...maintainers, name] }))
  }

  private typosquats(packageName: string): { name: string, distance: number, path: string[] }[] {
    return this.typoPairs().filter((pair) => pair.left === packageName).map((pair) => ({ name: pair.right, distance: pair.distance, path: [pair.left, pair.right] }))
  }

  private typoPairs(): { left: string, right: string, distance: number }[] {
    const names = [...this.packages.keys()]
    const popular = names.slice(0, 24)
    const pairs: { left: string, right: string, distance: number }[] = []
    for (const left of popular) {
      for (const right of names) {
        if (left === right) continue
        const distance = levenshteinDistance(left, right)
        if (distance >= 1 && distance <= 2) pairs.push({ left, right, distance })
      }
    }
    return pairs
  }
}

/** Creates all query specs used by the offline adapter, keeping query provenance visible. */
export function offlineQuerySpecs(packageName: string, version: string, resolvedIds: string[]): QuerySpec[] {
  return [exposureClosureQuery(packageName, version), versionWindowQuery(packageName), ...resolvedIds.map((resolvedId) => lockfileJoinQuery(resolvedId)), maintainerNeighbourhoodQuery(packageName), typosquatRingQuery(packageName)]
}

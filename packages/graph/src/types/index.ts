export interface PackageNode {
  name: string
  downloads: number
  createdAt: number
}

export interface VersionNode {
  id: string
  publishedAt: number
  digest: string
}

export interface CompromiseEvent {
  package: string
  version: string
  flaggedAt: number
}

export interface SpreadEvent {
  order: number
  name: string
  version: string
  depth: number
  elapsedMs: number
  viaPath: string[]
}

export interface ExposureReport {
  comprom: CompromiseEvent
  totalExposed: number
  maxDepth: number
  events: SpreadEvent[]
  maintainerNeighbourhood: string[]
  typosquats: { name: string, distance: number }[]
}

export interface LockfileFinding {
  resolved: string
  path: string[]
  reaches: boolean
  firstBadWindowOverlap: boolean
}

export interface FixtureVersion {
  version: string
  publishedAt: number
  digest: string
  dependencies: Record<string, string>
  optionalDependencies?: Record<string, string>
}

export interface FixturePackage {
  package: PackageNode
  versions: FixtureVersion[]
  maintainers: string[]
  services: { name: string, source: string, version: string }[]
}

export interface QuerySpec {
  text: string
  params: Record<string, unknown>
}

export interface ClosureRow {
  exposed: string
  depth: number
  path: string[]
  publishedAt: number
}

export interface BuildMetrics {
  packageNodes: number
  versionNodes: number
  maintainerNodes: number
  serviceNodes: number
  edges: number
  closureMs: number
  scanMs: number
  generatedAt: string
}

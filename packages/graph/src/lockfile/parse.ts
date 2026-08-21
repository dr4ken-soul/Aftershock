import { readFile } from 'node:fs/promises'
import type { LockfileFinding } from '../types/index.js'

export interface ResolvedLockfilePackage {
  name: string
  version: string
  resolved: string
  path: string[]
}

/** Normalises npm package-lock v2 and v3 package entries into resolved graph ids. */
export function parseLockfile(lockfile: Record<string, unknown>): ResolvedLockfilePackage[] {
  const packages = lockfile.packages as Record<string, { name?: string, version?: string, dependencies?: Record<string, string> }> | undefined
  if (packages) {
    const entries = Object.entries(packages).filter(([key, value]) => key !== '' && Boolean(value?.version))
    const byName = new Map<string, ResolvedLockfilePackage>()
    for (const [key, value] of entries) {
      const name = value.name ?? key.split('node_modules/').pop() ?? key
      const item = { name, version: value.version!, resolved: `${name}@${value.version}`, path: [name] }
      byName.set(name, item)
    }
    const root = packages['']
    const rootDependencies = root?.dependencies ?? {}
    const walk = (name: string, path: string[], seen: Set<string>): void => {
      const item = byName.get(name)
      if (!item || seen.has(name)) return
      item.path = [...path, item.resolved]
      for (const dependency of Object.keys(packages[`node_modules/${name}`]?.dependencies ?? {})) walk(dependency, [...item.path], new Set([...seen, name]))
    }
    for (const name of Object.keys(rootDependencies)) walk(name, ['root'], new Set())
    return [...byName.values()]
  }
  const legacy = lockfile.dependencies as Record<string, { version?: string, dependencies?: Record<string, unknown> }> | undefined
  if (!legacy) return []
  const result: ResolvedLockfilePackage[] = []
  const visit = (entries: Record<string, { version?: string, dependencies?: Record<string, unknown> }>, path: string[]): void => {
    for (const [name, entry] of Object.entries(entries)) {
      if (!entry.version) continue
      const resolved = `${name}@${entry.version}`
      result.push({ name, version: entry.version, resolved, path: [...path, resolved] })
      visit((entry.dependencies ?? {}) as Record<string, { version?: string, dependencies?: Record<string, unknown> }>, [...path, resolved])
    }
  }
  visit(legacy, ['root'])
  return result
}

/** Reads and parses an npm lockfile from disk. */
export async function readLockfile(filePath: string): Promise<ResolvedLockfilePackage[]> {
  const source = await readFile(filePath, 'utf8')
  return parseLockfile(JSON.parse(source) as Record<string, unknown>)
}

/** Converts graph join rows into the public finding shape without padding clean results. */
export function toLockfileFindings(rows: { resolved: string, path: string[] }[], exposedIds: Set<string>): LockfileFinding[] {
  return rows.map((row) => ({ resolved: row.resolved, path: row.path, reaches: exposedIds.has(row.resolved), firstBadWindowOverlap: exposedIds.has(row.resolved) }))
}

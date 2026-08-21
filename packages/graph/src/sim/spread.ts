import type { ClosureRow, CompromiseEvent, SpreadEvent } from '../types/index.js'

/** Converts ordered closure rows into the shared timed event stream used by CLI, API and canvas. */
export function buildSpreadEvents(rows: ClosureRow[], compromise: CompromiseEvent, spreadScale = 10): SpreadEvent[] {
  return rows.map((row, index) => ({
    order: index + 1,
    name: row.exposed.split('@')[0],
    version: row.exposed.split('@').slice(1).join('@'),
    depth: row.depth,
    elapsedMs: Math.round((index + 1) * spreadScale * 10),
    viaPath: [compromise.package, compromise.version, ...row.path],
  }))
}

/** Returns the maximum depth from a generated spread event stream. */
export function maxSpreadDepth(events: SpreadEvent[]): number {
  return events.reduce((maximum, event) => Math.max(maximum, event.depth), 0)
}

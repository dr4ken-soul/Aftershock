import type { Driver } from 'neo4j-driver'
import { runCommand } from './client.js'

const schemaStatements = [
  'CREATE CONSTRAINT ON (p:package) ASSERT p.name IS UNIQUE',
  'CREATE CONSTRAINT ON (v:version) ASSERT v.id IS UNIQUE',
  'CREATE CONSTRAINT ON (m:maintainer) ASSERT m.name IS UNIQUE',
  'CREATE CONSTRAINT ON (s:service) ASSERT s.name IS UNIQUE',
  'CREATE INDEX ON :version(publishedAt)',
]

/** Creates the natural-key constraints and query index used by Aftershock. */
export async function ensureSchema(driver: Driver): Promise<void> {
  for (const statement of schemaStatements) {
    try {
      await runCommand(driver, statement)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (/already exists|equivalent schema rule/i.test(message)) continue
      if (/parse error|expected query|unsupported|not supported|ERR_OUT_OF_RANGE|offset.*out of range/i.test(message)) {
        console.warn('Hydradb release does not support this Bolt schema statement; continuing with MERGE keys')
        continue
      }
      throw error
    }
  }
}

/** Returns the schema statements for inspection and self-checks. */
export function getSchemaStatements(): string[] {
  return [...schemaStatements]
}

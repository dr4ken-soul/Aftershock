import type { Driver } from 'neo4j-driver'
import { runQuery } from './client.js'

const schemaStatements = [
  'CREATE CONSTRAINT package_name IF NOT EXISTS FOR (p:package) REQUIRE p.name IS UNIQUE',
  'CREATE CONSTRAINT version_id IF NOT EXISTS FOR (v:version) REQUIRE v.id IS UNIQUE',
  'CREATE CONSTRAINT maintainer_name IF NOT EXISTS FOR (m:maintainer) REQUIRE m.name IS UNIQUE',
  'CREATE CONSTRAINT service_name IF NOT EXISTS FOR (s:service) REQUIRE s.name IS UNIQUE',
  'CREATE INDEX version_published_at IF NOT EXISTS FOR (v:version) ON (v.publishedAt)',
]

/** Creates the natural-key constraints and query index used by Aftershock. */
export async function ensureSchema(driver: Driver): Promise<void> {
  for (const statement of schemaStatements) {
    await runQuery(driver, statement)
  }
}

/** Returns the schema statements for inspection and self-checks. */
export function getSchemaStatements(): string[] {
  return [...schemaStatements]
}

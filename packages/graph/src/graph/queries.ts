import type { QuerySpec } from '../types/index.js'
import { nodeId } from './ids.js'

/** Builds the reverse dependency closure traversal for a compromised package. */
export function exposureClosureQuery(packageName: string, version: string, depth = 1): QuerySpec {
  const flaggedId = nodeId('version', `${packageName}@${version}`).toNumber()
  const traversal = Array.from({ length: depth }, (_, index) => `-[:required_by]->(${index === depth - 1 ? 'target' : `hop${index}`})`).join('')
  return {
    text: `MATCH (flagged {id: ${flaggedId}})${traversal}
RETURN target.key AS exposed, target.key AS path, target.publishedAt AS publishedAt
ORDER BY exposed ASC`,
    params: { packageName, versionId: `${packageName}@${version}`, versionKey: `${packageName}@${version}`, depth },
  }
}

/** Builds the earliest published version traversal for a flagged package. */
export function versionWindowQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH (p:package)-[:has_version]->(v:version)
WHERE p.name = $packageName
RETURN p.name AS package, v.key AS version, v.publishedAt AS publishedAt
ORDER BY v.publishedAt ASC
LIMIT 1`,
    params: { packageName },
  }
}

/** Builds the lockfile resolution join against service and version nodes. */
export function lockfileJoinQuery(resolvedId: string): QuerySpec {
  const graphId = nodeId('version', resolvedId).toNumber()
  return {
    text: `MATCH (service:service)-[:resolves]->(version:version {id: ${graphId}})
RETURN service.name AS service, version.key AS resolved, version.key AS path`,
    params: { resolvedId },
  }
}

/** Builds the two-hop maintainer neighbourhood traversal. */
export function maintainerNeighbourhoodQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH (p:package)<-[:maintains]-(m:maintainer)-[:maintains]->(neighbour:package)
WHERE p.name = $packageName
RETURN neighbour.name AS name
ORDER BY name ASC`,
    params: { packageName },
  }
}

/** Builds the suspicious-name ring traversal. */
export function typosquatRingQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH (p:package)-[r:similar_name]->(near:package)
WHERE p.name = $packageName
RETURN near.name AS name, r.distance AS distance
ORDER BY distance ASC, name ASC`,
    params: { packageName },
  }
}

import type { QuerySpec } from '../types/index.js'

/** Builds the reverse dependency closure traversal for a compromised package. */
export function exposureClosureQuery(packageName: string, version: string): QuerySpec {
  return {
    text: `MATCH (seed:package {name: $packageName})-[:has_version]->(flagged:version {id: $versionId})
MATCH path = (target:version)-[:depends_on*1..12]->(flagged)
RETURN target.id AS exposed, length(path) AS depth, [node IN nodes(path) | node.id] AS path, target.publishedAt AS publishedAt
ORDER BY depth ASC, exposed ASC`,
    params: { packageName, versionId: `${packageName}@${version}` },
  }
}

/** Builds the earliest published version traversal for a flagged package. */
export function versionWindowQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH (p:package {name: $packageName})-[:has_version]->(v:version)
RETURN p.name AS package, v.id AS version, v.publishedAt AS publishedAt
ORDER BY v.publishedAt ASC
LIMIT 1`,
    params: { packageName },
  }
}

/** Builds the lockfile resolution join against service and version nodes. */
export function lockfileJoinQuery(resolvedIds: string[]): QuerySpec {
  return {
    text: `UNWIND $resolvedIds AS resolvedId
MATCH path = (service:service)-[:resolves]->(version:version {id: resolvedId})
RETURN service.name AS service, version.id AS resolved, [node IN nodes(path) | coalesce(node.name, node.id)] AS path`,
    params: { resolvedIds },
  }
}

/** Builds the two-hop maintainer neighbourhood traversal. */
export function maintainerNeighbourhoodQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH (p:package {name: $packageName})<-[:maintains]-(m:maintainer)-[:maintains]->(neighbour:package)
MATCH path = (m)-[:maintains]->(neighbour)
RETURN neighbour.name AS name, [node IN nodes(path) | coalesce(node.name, node.id)] AS path
ORDER BY name ASC`,
    params: { packageName },
  }
}

/** Builds the suspicious-name ring traversal. */
export function typosquatRingQuery(packageName: string): QuerySpec {
  return {
    text: `MATCH path = (p:package {name: $packageName})-[:similar_name]->(near:package)
RETURN near.name AS name, relationships(path)[0].distance AS distance, [node IN nodes(path) | node.name] AS path
ORDER BY distance ASC, name ASC`,
    params: { packageName },
  }
}

import neo4j from 'neo4j-driver'

/** Returns a stable non-negative integer identity accepted by HydraDB. */
export function nodeId(kind: string, value: string): neo4j.Integer {
  let hash = 2166136261
  const text = `${kind}:${value}`
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return neo4j.int((hash >>> 0) + 1)
}

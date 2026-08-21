# aftershock — app blueprint

## product summary

aftershock answers the question every incident responder asks in the first minutes of a supply chain compromise, what can this package reach, it models the npm registry as a versioned graph in hydradb, packages, versions, maintainers and lockfile resolutions, then exposes a simulator that replays a compromise spreading through reverse dependencies with timestamps, an exposure api that answers the five track questions as pure graph traversals, and a lockfile scanner that maps a real project onto the graph, the landing page carries a live demo against a bundled snapshot so a judge touches the product in under a minute

hydradb is not decorative here, every headline answer is a traversal a vector index cannot express, remove the graph and the product is a spreadsheet

## market context

who pays attention to this

1. engineering leads at companies running node services, who discover compromises from the evening news and need transitive exposure answers in minutes, dependency scanners tell them a package is bad, nothing tells them the shape of their own exposure
2. security engineers during incident response, who need the compromised version window, the lockfile join, and the maintainer neighbourhood before they can scope rotation
3. open source maintainers and registries, who watch worm-style attacks self-propagate across maintainer accounts and need adjacency answers, which names sit near the popular one, which packages share infrastructure

what they use now, osv and github advisory databases for raw cve data, dependabot and snyk for version alerts, socket and phylum for package heuristics, none of these answer transitive reverse closure over a versioned ecosystem graph with a live time window, that gap is the product

## mvp feature set

### feature 1, graph builder

user story, as a security engineer i want the registry modelled as a graph so exposure questions are traversals, not guesses

how it works, `aftershock build` loads the bundled jsonl snapshot and streams nodes and edges into hydradb over bolt in batched write transactions, idempotent by merge keys so re-runs converge, optional `--live` fetches fresh packuments from the npm registry for any package missing from the snapshot

acceptance criteria, building the full fixture set completes and reports node and edge counts, re-running twice produces identical counts, hydradb holds every edge type from the schema in CLAUDE.md

complexity, medium

### feature 2, patient zero simulator

user story, as an incident responder i want to see the compromise spread in time order so i grasp the blast radius at a glance

how it works, from a seed package the engine walks the reverse depends_on closure breadth first, each hop annotated with depth and a spread clock scaled from the real worm dynamics, output is a timed event stream consumed identically by the cli, the api and the canvas player

acceptance criteria, simulating a fixture seed prints the closure in spread order with depth and elapsed time, total exposed count matches a direct cypher count on the same graph, the web player renders the identical sequence

complexity, high

### feature 3, exposure api

user story, as a judge i want endpoints answering the track questions so i can verify the graph does the work

how it works, fastify exposes post routes for simulate, exposure, maintainer neighbourhood, typosquat ring and version window, each maps one to one onto a parameterised cypher query in queries.ts, responses include the path evidence, not just counts

acceptance criteria, every endpoint answers against a fresh build in under 500 milliseconds on the fixture graph, and each response carries the traversal path used

complexity, medium

### feature 4, lockfile scanner

user story, as a developer i want to drop my lockfile and learn if i am exposed right now

how it works, parses package-lock v2 and v3 into resolved versions, joins them against the graph through the resolves relation, and reports any package whose closure includes a simulated or flagged compromise, printing the exact dependency path from root to the bad version

acceptance criteria, the bundled demo lockfile returns a known exposure with the correct path, a clean lockfile returns an honest all clear

complexity, medium

### feature 5, landing page with live demo

user story, as a judge i want to see the product working before i read a word

how it works, FRONTEND_SPEC.md governs every pixel, the hero canvas replays a spread in a loop, section three embeds the scanner against a static fixture answer set so the demo works even on the static deployment

acceptance criteria, page builds as a static site, hero replay loops seamlessly, the demo strip returns a report without a running server, every spec value matches the audit checklist

complexity, medium

## tech stack

| layer | choice | reason |
|---|---|---|
| graph store | hydradb | the sponsor repo and the only component that makes this real |
| graph access | neo4j js driver over bolt | hydradb speaks bolt, zero custom transport code |
| language | node 20 with typescript | one language across cli, api and landing |
| cli | commander | standard, boring, correct |
| api | fastify | fast, typed routes with zod schemas |
| landing | react 18, vite, typescript | static build, instant previews |
| styling | tailwind | velocity under deadline |
| animation | motion/react | the enforced import path for all entrances |
| canvas | hand-rolled 2d | full control over the replay clock, no dependency weight |
| llm, optional | groq gpt-oss-120b with gpt-oss-20b fallback | single key, blast path narration only, cached to disk |
| video | groq orpheus and whisper, ffmpeg | governed by VIDEO_PIPELINE.md |

## data structures

```typescript
interface PackageNode {
  name: string
  downloads: number
  createdAt: number
}

interface VersionNode {
  id: string            // name@version
  publishedAt: number
  digest: string
}

interface CompromiseEvent {
  package: string
  version: string
  flaggedAt: number
}

interface SpreadEvent {
  order: number
  name: string
  version: string
  depth: number
  elapsedMs: number     // scaled spread clock
  viaPath: string[]     // dependency path from seed
}

interface ExposureReport {
  comprom: CompromiseEvent
  totalExposed: number
  maxDepth: number
  events: SpreadEvent[]
  maintainerNeighbourhood: string[]
  typosquats: { name: string, distance: number }[]
}

interface LockfileFinding {
  resolved: string
  path: string[]
  reaches: boolean
  firstBadWindowOverlap: boolean
}
```

## cli and api surface

| command | description |
|---|---|
| `aftershock build` | loads the snapshot into hydradb, `--live` refreshes from the registry |
| `aftershock simulate <pkg>` | prints the timed reverse closure |
| `aftershock scan <lockfile>` | prints exposure findings with paths |
| `aftershock serve` | starts the exposure api |

| endpoint | body | answer |
|---|---|---|
| `POST /api/simulate` | `{package}` | SpreadEvent stream |
| `POST /api/exposure` | `{package}` | ExposureReport |
| `POST /api/scan` | lockfile json | finding list |
| `POST /api/neighbourhood` | `{package}` | maintainer adjacency |
| `POST /api/typosquats` | `{package}` | similar_name ring |

## environment variables

```
HYDRADB_URI=bolt://localhost:7687
AFTERSHOCK_FIXTURE=packages/graph/fixtures/packages.jsonl
AFTERSHOCK_SPREAD_SCALE=10
GROQ_API_KEY=                (optional, narration only)
GROQ_MODEL_PRIMARY=openai/gpt-oss-120b
GROQ_MODEL_FALLBACK=openai/gpt-oss-20b
```

## what is not being built in mvp

- pypi or any second ecosystem
- live osv or github advisory ingestion
- authentication, org workspaces, anything saas-shaped
- sbom export formats
- monorepo or workspace lockfile variants beyond npm v2 and v3
- any llm feature beyond optional blast path narration

every exclusion protects the deadline, additions after submission only

## build priority

1. hydradb running locally and accepting writes over bolt
2. fixture loading and schema creation, counts verified
3. the five queries correct against the fixture graph, closure counts cross-checked two ways
4. simulator event stream end to end in the cli
5. api serving simulate and scan
6. landing page sections per FRONTEND_SPEC.md
7. canvas replay player wired to a recorded event fixture, then to the api
8. clean machine test, clone, build, run, then the video per VIDEO_PIPELINE.md

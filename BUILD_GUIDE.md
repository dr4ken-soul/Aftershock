# aftershock — build guide

## before you write code

read CLAUDE.md, APP_BLUEPRINT.md and FRONTEND_SPEC.md first, they hold the schema, the rules and every pixel, this file only sequences the work, when a value in code disagrees with the spec, the spec wins

## prerequisites

- node 20 or later and pnpm
- docker, for the hydradb container
- hydradb running locally, follow its repo readme, then confirm the bolt endpoint answers

```bash
# expected a healthy response from the bolt handshake
echo $HYDRADB_URI   # bolt://localhost:7687
```

## repository setup

```bash
mkdir aftershock && cd aftershock
git init
pnpm init -w
```

create the workspace layout from the CLAUDE.md structure, two packages, `packages/graph` and `packages/landing`, plus `fixtures` inside the graph package, commit early so every commit timestamp sits inside the hackathon window naturally

## phase 1, graph core

### step 1.1, graph package setup

`packages/graph/package.json` with bin entry for `aftershock`, dependencies limited to commander, fastify, zod, neo4j-driver, and dev dependencies typescript, tsx and vitest, nothing else without a reason

### step 1.2, types

`src/types/index.ts`, copy the interfaces from APP_BLUEPRINT.md verbatim, PackageNode, VersionNode, CompromiseEvent, SpreadEvent, ExposureReport, LockfileFinding

### step 1.3, hydradb client

```typescript
import neo4j from 'neo4j-driver'

/**
 * returns a bolt driver pointed at hydradb, one instance per process
 * reads HYDRADB_URI from the environment and fails loudly when absent
 */
export function createDriver() {
  const uri = process.env.HYDRADB_URI
  if (!uri) throw new Error('HYDRADB_URI is not set, default is bolt://localhost:7687')
  return neo4j.driver(uri)
}
```

add a `healthcheck` export that runs `RETURN 1` and prints the round trip time, the demo video scene 7 uses this moment

### step 1.4, schema

`src/graph/schema.ts`, run at build start, uniqueness on Package.name, Version.id, Maintainer.name and Service.name, plus an index on Version.publishedAt for window queries

```cypher
CREATE CONSTRAINT package_name IF NOT EXISTS
FOR (p:package) REQUIRE p.name IS UNIQUE
CREATE CONSTRAINT version_id IF NOT EXISTS
FOR (v:version) REQUIRE v.id IS UNIQUE
```

### step 1.5, snapshot ingest

`src/ingest/snapshot.ts`, streams the jsonl fixture, batches of 1000 writes per transaction, merge keyed on natural keys so the build is idempotent, logs running counts every batch, ends by printing total nodes and edges, those numbers feed the metrics section

`src/ingest/typosquat.ts` runs last, computes name distance between popular packages and the rest of the snapshot, writes `similar_name` edges only where distance sits in the suspicious band, never on exact matches

### step 1.6, the five queries

`src/graph/queries.ts`, one exported parameterised function per track question, the closure is the heart of it

```cypher
MATCH (seed:package {name: $name})-[:has_version]->(v:version)
MATCH path = (target:version)-[:depends_on*1..12]->(v)
RETURN target.id AS exposed, length(path) AS depth
ORDER BY depth ASC
```

the version window query orders the flagged set by publishedAt and takes the earliest, the lockfile join matches resolved ids against the window, the neighbourhood walks maintains out to two hops, the typosquat ring reads similar_name edges ranked by distance

every query returns paths, not just counts, the ui and cli render the evidence

### step 1.7, spread engine

`src/sim/spread.ts`, consumes the closure, assigns each node an order, depth and elapsed value from the scaled clock, emits one SpreadEvent per tick, pure function over query output so cli, api and canvas share identical behaviour, this purity is what makes the demo trustworthy

### step 1.8, lockfile parser

`src/lockfile/parse.ts`, accepts v2 and v3 shapes, normalises to resolved version ids, joins through the graph, returns findings with the full dependency path per finding, an empty honest array when nothing reaches, never pad a report

### step 1.9, api

`src/api/server.ts` and routes.ts, the five endpoints from the blueprint, zod validated bodies, each handler calls the matching query and returns the evidence path, total handler logic stays thin, the graph does the work

### step 1.10, cli assembly and smoke test

wire the four commands in index.ts, then

```bash
pnpm --filter graph build
aftershock build
aftershock simulate left-pad
aftershock scan fixtures/demo-lockfile.json
aftershock serve
```

smoke test passes when build reports expected counts, simulate prints a timed closure, the demo lockfile returns its known finding, and the api answers with paths attached

## phase 2, landing page

### step 2.1, landing package setup

react 18, vite, typescript, tailwind, motion/react, lucide-react, scaffold per the CLAUDE.md tree

### step 2.2, globals.css

font links in index.html exactly as CLAUDE.md specifies, the neon terminal variable block pasted from CLAUDE.md without edits, the bento base classes, grid gap line system, cell hover lift and the css noise tile, the dot grid utility class, tailwind config maps font-display, font-sans and font-mono to satoshi, inter and space mono

### step 2.3, utility components

FadeIn implementing the spec entrance standard exactly, GrainOverlay fixed z-[3] at 0.03 opacity, Metric handling the count-up with tabular numerals, Magnet for the final cta only, built on useMotionValue never useState for cursor position

### step 2.4, hooks

useScrollReveal wrapping the viewport entrance config, useAttackReplay owning the canvas clock, requestAnimationFrame loop, event cursor, loop control and the 4 second hold

### step 2.5, canvas engine

canvas/layout.ts runs at build time over the fixture and freezes coordinates into a json module, canvas/AttackMap.tsx paints nodes and edges per the spec values, node 1.5px, edge alpha 0.08, infection pulses from the seed outward by event order, the ticker reads elapsed simulation time from useAttackReplay, the renderer reads css variables once on mount so the red law holds with a single source

verify the loop seams by watching three full cycles, the eye catches what tests will not

### step 2.6, nav

build state a and state b from the spec, the morph driven by scrollY crossing 80, crossfade 200ms ease with 60ms offset, confirm the pill never overlaps the hero ticker on any viewport

### step 2.7, sections in spec order

DemoStrip with the dropzone and fixture-backed report, Timeline with the four events and the pivot cell, Architecture referencing the recipe, QuestionsBento with the mini canvas in cell a at 60 percent scale, Metrics fed by real build numbers, HydraSplit with the static terminal reading, FinalCta, Footer, assemble in App.tsx in section order

### step 2.8, fixtures for static demo

export the demo lockfile answer map into src/data/demo-fixtures.ts at build time, the demo strip resolves against it with zero network, honest answers, no fabricated counts

### step 2.9, build and preview

```bash
pnpm --filter landing build
pnpm --filter landing preview
```

walk the page against FRONTEND_SPEC.md with the spec open beside the browser, class by class, do this before moving on

## phase 3, audit and submission

### step 3.1, quality audit

run the step 15 audit from FRONTEND_SKILL.md, hierarchy, motion quality, system consistency, background quality, typography, responsive, then the ai slop check, then the spec self-check list, fix what fails before considering the video

### step 3.2, clean machine test

fresh clone in an empty directory, hydradb up, `aftershock build`, simulate, scan, serve, landing build, if any step needs a fact that lives only in your head, write it into the readme and repeat until the clone passes

### step 3.3, the readme

readme covers the itemised hackathon requirements exactly, what it is, setup, run instructions, how hydradb is used with the schema and query examples, environment notes, attribution for every third party piece, license file, and the demo video link updated once the upload lands

### step 3.4, the video

hand off to VIDEO_PIPELINE.md exactly as written, scenes one to nine, the fitted voiceover workflow, hydra proof scene protected, three minute conform, private window verification after upload

### step 3.5, the form

fill the submission form from the same facts as the readme, project name aftershock, short description from the one-line pitch, problem being addressed from the timeline section, what you built from the five features, deployed link if the static build shipped, hydra usage answer quoting the five queries, tech stack from the blueprint table, team members and individual contributions, repo link, video link, submit before 11:59 pm pt and screenshot the confirmation

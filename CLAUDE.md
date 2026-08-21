# aftershock — agent context

## what this is

aftershock is a supply chain blast radius console built on hydradb, it models the npm public registry as a versioned graph, packages, versions, maintainers and lockfile resolutions, then answers the five questions the hack hydra track 02 statement asks, which services are transitively exposed when a package is compromised, which version introduced the compromise, which applications resolved the compromised version while it was live, which packages share maintainers or infrastructure with it, and whether typosquat names sit nearby

the centrepiece is a patient zero simulator, drop a compromise on any package and watch the reverse dependency closure spread through the graph with timestamps, then upload a package-lock.json and get your own exposure report in seconds

built for hack hydra, the hydradb open source hackathon, august 12 to 20 2026, submission deadline august 20 at 11:59 pm pt, track 02 supply chain blast radius

## one-line pitch

when a package turns malicious, aftershock shows every service it can reach, in seconds

## mvp features

1. graph builder cli — `aftershock build` ingests a curated registry snapshot and writes the versioned package graph into hydradb over bolt, nodes for packages, versions and maintainers, edges for has_version, depends_on, maintains, resolves and similar_name
2. patient zero simulator — `aftershock simulate <package>` computes the reverse dependency closure from a seed package and emits a timed event stream, nodes light up in spread order with depth and elapsed time
3. exposure api — a small fastify service exposing simulate, exposure and maintainer neighbourhood queries over the hydradb graph, every answer is a graph traversal, no vector search anywhere
4. lockfile analyser — `aftershock scan <lockfile>` or drag onto the web console, parses package-lock v2 and v3, joins resolved versions against the graph and reports exposure with the exact dependency path
5. landing page with live demo — the canvas hero replays a worm-style spread in a loop, and section three lets a judge upload a lockfile and get a real report against the bundled snapshot

post-hackathon, pypi support, osv advisory feed ingestion, org dashboards, ci gating

## stack

| layer | technology |
|---|---|
| graph database | hydradb open source repo, bolt protocol, object storage engine |
| bolt client | neo4j js driver pointed at hydradb bolt endpoint |
| cli and api | node 20+, typescript, commander, fastify |
| registry data | curated npm snapshot bundled as jsonl fixtures so the demo runs offline |
| landing page | react 18, vite, typescript |
| styling | tailwind css |
| animation | motion/react |
| icons | lucide react |
| attack map | custom canvas 2d renderer, layout coordinates precomputed offline |
| llm, optional | groq only, gpt-oss-120b primary with gpt-oss-20b fallback, used at most for blast path narration, never in the demo hot path |
| video tooling | groq orpheus tts and whisper via one groq key, ffmpeg for assembly |

## project structure

```
aftershock/
├── packages/
│   ├── graph/                        (cli, ingest, simulator, queries)
│   │   ├── src/
│   │   │   ├── index.ts              (cli entry, bin target)
│   │   │   ├── commands/
│   │   │   │   ├── build.ts          (snapshot to hydradb ingest)
│   │   │   │   ├── simulate.ts       (patient zero spread replay)
│   │   │   │   ├── scan.ts           (lockfile exposure report)
│   │   │   │   └── serve.ts          (starts the api)
│   │   │   ├── ingest/
│   │   │   │   ├── snapshot.ts       (jsonl fixture loader)
│   │   │   │   ├── registry.ts       (optional live npm fetcher)
│   │   │   │   └── typosquat.ts      (name distance edges)
│   │   │   ├── graph/
│   │   │   │   ├── client.ts         (hydradb bolt client)
│   │   │   │   ├── schema.ts         (constraints and indexes)
│   │   │   │   └── queries.ts        (the five track queries, cypher)
│   │   │   ├── sim/
│   │   │   │   └── spread.ts         (timed closure engine)
│   │   │   ├── lockfile/
│   │   │   │   └── parse.ts          (package-lock v2 and v3)
│   │   │   ├── api/
│   │   │   │   ├── server.ts         (fastify entry)
│   │   │   │   └── routes.ts         (simulate, exposure, scan)
│   │   │   └── types/index.ts
│   │   ├── fixtures/
│   │   │   ├── packages.jsonl        (curated registry snapshot)
│   │   │   └── demo-lockfile.json    (known-exposed lockfile for demos)
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── landing/                      (marketing page and live demo console)
│       ├── public/
│       │   └── favicon.ico           (comment slot until provided)
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/ (FadeIn, GrainOverlay, Magnet, Metric)
│       │   │   ├── layout/Nav.tsx
│       │   │   └── sections/
│       │   │       ├── Hero.tsx
│       │   │       ├── DemoStrip.tsx
│       │   │       ├── Timeline.tsx
│       │   │       ├── Architecture.tsx
│       │   │       ├── QuestionsBento.tsx
│       │   │       ├── Metrics.tsx
│       │   │       ├── HydraSplit.tsx
│       │   │       ├── FinalCta.tsx
│       │   │       └── Footer.tsx
│       │   ├── canvas/
│       │   │   ├── AttackMap.tsx     (canvas renderer)
│       │   │   ├── layout.ts         (precomputed coordinates)
│       │   │   └── replay.ts         (spread event player)
│       │   ├── hooks/ (useScrollReveal, useAttackReplay)
│       │   ├── styles/globals.css
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── video/                            (cap recordings and assembled demo)
├── FRONTEND_SPEC.md
├── APP_BLUEPRINT.md
├── BUILD_GUIDE.md
├── VIDEO_PIPELINE.md
├── CLAUDE.md
└── README.md
```

## design system

all decisions below were confirmed across the seven gates, do not deviate

aesthetic: bento grid operational

nav: a2 scroll-morph pill, wide transparent bar at hero top, collapses into a compact floating pill after 80px of scroll

background treatment: coded animated canvas in the hero, the attack map replay is the only active animation system, sections use the dot grid texture and staggered viewport reveals

fonts:
- display: satoshi
- body: inter
- mono, data only: space mono

```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```

colour palette, neon terminal block as curated:

```css
--bg-primary:     #0a0a0a;
--bg-secondary:   #0f0f0f;
--bg-surface:     #151515;
--bg-elevated:    #1a1a1a;
--accent:         #00f0ff;
--accent-hover:   #33f5ff;
--accent-glow:    rgba(0, 240, 255, 0.12);
--text-primary:   #e0e0e0;
--text-secondary: #8a8a8a;
--text-muted:     #4a4a4a;
--border-subtle:  rgba(0, 240, 255, 0.06);
--border-default: rgba(0, 240, 255, 0.12);
--success:        #00ff88;
--error:          #ff3366;
```

one rule above all, the red error tone belongs to the attack state only, nothing else on the page may use it, cyan marks your tooling, red marks compromise

## page sections, in order

1. nav, a2 scroll-morph pill, wordmark left as text, run the live demo cta
2. hero, full-viewport attack map canvas, image-as-canvas composition, eyebrow, two-line headline, one-line sub, two ctas
3. demo strip, drop a package-lock.json, get a blast radius report against the bundled snapshot, the judge must be able to touch the product
4. timeline, the worm story as a scroll of timed events, 84 artifacts, 42 packages, six minutes
5. architecture, layers recipe, registry snapshot to graph builder to hydradb to the five queries
6. questions bento, asymmetric cells, one per track question, each cell shows the real query and a live answer from the bundled snapshot
7. metrics band, mono numerals, nodes, edges, closure time, lockfile scan time
8. hydra split, bolt console output beside prose on why a graph traversal answers what similarity search cannot
9. final cta, full-width statement with the two clone-and-run commands
10. footer, wordmark, repo link, built on hydradb attribution

## logo and favicon

no logo or favicon exists yet, both slots are code comments only, text wordmark reads aftershock in satoshi, never substitute an icon, symbol or emoji in either slot

## hydradb integration

the graph is the product, hydradb connects over bolt at `HYDRADB_URI`, default `bolt://localhost:7687`

node shapes, `(:package {name, downloads, createdAt})`, `(:version {id, publishedAt, digest})`, `(:maintainer {name})`, `(:service {name, source})`

edge shapes, `(:package)-[:has_version]->(:version)`, `(:version)-[:depends_on {scope}]->(:version)`, `(:maintainer)-[:maintains]->(:package)`, `(:service)-[:resolves]->(:version)`, `(:package)-[:similar_name {distance}]->(:package)`

the five track queries live in queries.ts as parameterised cypher, reverse closure for exposure, earliest malicious version by publishedAt, lockfile join on resolves, maintainer neighbourhood traversal, similar_name ring walk, every answer in the ui and cli traces to one of these queries

## code rules

- camelCase for all variables and functions, jsdoc on every exported function
- css variables from the design system, never hardcoded hex in components, the one exception is inline canvas rendering code which reads the variables once at runtime
- no inline styles in react except motion values and the canvas element
- no onmouseenter or onmouseleave styling logic, css class transitions only
- no localstorage or sessionstorage
- no console.log in production paths
- skeleton shimmer for loading, never spinners
- british english in visible copy, no em dashes anywhere, periods only when necessary
- lower confidence claims get deleted not softened, if a number is on the page it came from a real measurement

## hackathon checklist

- repo public, all participant commits on or after august 12 2026
- readme with setup and run instructions, hydra usage explanation, env notes, attribution, mit license file
- demo video maximum 3 minutes, production pipeline lives in VIDEO_PIPELINE.md
- form answers drafted before recording starts so the video script and form tell one story
- deployed landing link if time allows, vercel static build, api mocked from fixtures if no server budget
- never claim a feature that is not in the repository

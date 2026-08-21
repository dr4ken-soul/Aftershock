# aftershock — submission form answers

## how to use this file

every answer below is drafted to match the readme and the narration script so the form, the repo and the video tell one story, fields marked [fill] are placeholders only you can complete, paste answers as written after filling those, submit before 11:59 pm pt on august 20 and keep a screenshot of the confirmation

## project name

```
aftershock
```

## short project description

```
when a package turns malicious, aftershock shows every service it can reach in seconds, it models the npm registry as a versioned graph in hydradb and answers the questions a breach actually asks, transitive exposure, the version that introduced it, lockfiles resolved while it was live, the maintainer neighbourhood and the typosquat ring, each one a single graph traversal
```

## problem being addressed

```
supply chain attacks stopped being a nuisance and became an automated worm problem, one breached ci pipeline pushed 84 malicious artifacts across 42 packages within six minutes and the worm persisted past uninstalls, the defenders problem is speed and shape, dependency scanners tell you a package is bad but nothing tells you which of your services are transitively exposed, which version introduced the compromise and which lockfiles resolved it while it was live, that answer is a reverse dependency closure over a versioned ecosystem graph, a question semantic similarity tools cannot express at all
```

## what you built

```
a supply chain blast radius console with five parts

the graph builder cli streams a curated npm snapshot into hydradb over bolt with idempotent merges and computes typosquat similarity edges at ingest

the patient zero simulator replays a compromise spreading through the reverse dependency closure with depth and a spread clock on every node

the exposure api answers each track question as one parameterised cypher traversal and returns the evidence path, not just counts

the lockfile scanner parses package-lock v2 and v3, joins resolved versions against the graph and prints the exact dependency path to any exposure

the landing page runs a live demo against the bundled snapshot, the hero canvas replays a worm spread in a loop and the scanner works on the static deployment so judges can test it without a server
```

## deployed project link, if available

```
[fill, vercel static url if shipped, otherwise state: demo runs locally via one script, ./scripts/demo.sh, verified from a clean clone]
```

## how the project uses the hydradb open source repo

```
hydradb is the entire product, not a supporting store, the registry graph lives in hydradb as packages, versions, maintainers and service nodes with has_version, depends_on, maintains, resolves and similar_name edges, written over the bolt protocol

all five headline answers are hydradb traversals over that graph, the reverse closure for transitive exposure, publishedAt ordering for the version window, a resolves join for lockfiles live during the window, a two hop maintains walk for the maintainer neighbourhood and a similar_name ring walk for typosquats, path evidence returns with every answer

the demo video proves this live in scenes 7 and 8, the closure runs as a single query against hydradb in milliseconds, and the same question is shown failing as a similarity lookup, remove hydradb and nothing in this project works
```

## tech stack used

```
hydradb open source repo via the bolt protocol, node 20 with typescript, neo4j driver, commander, fastify, zod, react 18, vite, tailwind css, motion for entrances, lucide icons, hand rolled canvas 2d for the attack map, groq api used only for the demo video tooling, orpheus for the voiceover and whisper for optional captions
```

## team members and individual contributions

```
[fill, your name and handles, and if solo state it plainly, solo build, all parts, ingest, simulator, api, scanner, landing, video]
```

## github repository link

```
[fill, public repo url, verify in a private window before submitting]
```

## 3-minute demo video link

```
[fill, youtube unlisted url, verify it plays in a private window, confirm the runtime is under 3:00 including end card]
```

## final checks before submit

- repo public with all commits on or after august 12 2026
- readme covers setup, run instructions, hydra usage, environment notes, attribution and the mit license
- the answers above match the readme and the video word for word in their claims
- every claim points at something a judge can run or watch

# aftershock

When a package turns malicious, Aftershock shows every service it can reach in seconds.

Aftershock is a supply chain blast radius console for Hack Hydra track 02. It stores a deterministic npm registry fixture as a versioned graph in Hydradb, connects over Bolt, and answers exposure questions with Cypher traversals. The static landing page includes the same known lockfile report used by the CLI.

## What is included

- A graph builder that writes package, version, maintainer, service, dependency, resolution, and name adjacency data to Hydradb
- A patient zero simulator that walks reverse `depends_on` closure and emits timed path evidence
- Five graph query surfaces for exposure, version window, lockfile joins, maintainer neighbourhood, and typosquat adjacency
- An npm package-lock v2 and v3 parser
- A Fastify API with `/api/simulate`, `/api/exposure`, `/api/scan`, `/api/neighbourhood`, and `/api/typosquats`
- A static React landing page with a canvas replay and fixture-backed lockfile demo

The fixture generator is deterministic. It creates 1,500 package nodes, 3,000 version nodes, and a measured 42-package attack story with 84 exposed version artifacts. The generated JSONL is committed so the demo can run offline.

## Requirements

- Node 20 or newer
- pnpm 9 or newer through Corepack
- Hydradb running with a Bolt endpoint for the production graph path

Official links:

- [HydraDB repository and Docker instructions](https://github.com/hydra-db/hydradb)
- [HydraDB container package](https://github.com/hydra-db/hydradb/pkgs/container/hydradb)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Groq API key page](https://console.groq.com/keys)

Hydradb is the source of truth for the production CLI and API. The local verification mode is explicit with `--offline`; it is only for machines that do not have Hydradb available and is never used by the static demo to claim a live database query.

## Setup

```bash
corepack enable
pnpm install
pnpm generate
pnpm --filter graph build
```

The generator writes `packages/graph/fixtures/packages.jsonl`, the known exposed `demo-lockfile.json`, the canvas layout, and the static demo answer data.

## Run against Hydradb

Start Hydradb using its official repository instructions, then set the Bolt endpoint. The default is not inferred because a missing database should fail loudly.

```bash
export HYDRADB_URI=bolt://127.0.0.1:7687
export HYDRADB_USERNAME=neo4j
export HYDRADB_AUTH_TOKEN=local-development-token-32-bytes
pnpm aftershock build
pnpm aftershock simulate left-pad
pnpm aftershock scan packages/graph/fixtures/demo-lockfile.json
pnpm aftershock serve
```

On PowerShell, use `$env:HYDRADB_URI = 'bolt://localhost:7687'` before the commands. The API listens on port `8787` unless `PORT` is set.

The builder creates unique constraints for `package.name`, `version.id`, `maintainer.name`, and `service.name`, plus an index on `version.publishedAt`. Re-running the build uses merge keys and converges to the same graph.

### Start a real local HydraDB node on Windows

Install Docker Desktop, then run this in PowerShell from the repository root:

```powershell
New-Item -ItemType Directory -Force .\hydradb-data\store, .\hydradb-data\cache | Out-Null
Set-Content -NoNewline .\hydradb-data\auth-token 'local-development-token-32-bytes'
docker pull ghcr.io/hydra-db/hydradb:latest
docker run --rm --user 10001:10001 -p 7687:7687 -p 8443:8443 -p 9090:9090 -v "${PWD}\hydradb-data:/data" -e CLOUD_PROVIDER=local -e LOCAL_PATH=/data/store -e GRAPH_NAMESPACE=default -e GRAPH_ID=default -e GRAPH_CELL_ID=cell-0 -e GRAPH_CELLS=cell-0 -e GRAPH_NODE_ID=node-0 -e GRAPH_BOLT_NODE_ADDRESSES=node-0=127.0.0.1:7687 -e GRAPH_ADVERTISED_BOLT_ADDR=127.0.0.1:7687 -e GRAPH_DATA_CACHE_DIR=/data/cache -e GRAPH_AUTH_TOKEN_FILE=/data/auth-token -e GRAPH_ALLOW_PLAINTEXT=true -e RUST_MIN_STACK=33554432 ghcr.io/hydra-db/hydradb:latest
```

Leave that terminal running. The URI is now exactly `bolt://127.0.0.1:7687`. In a second PowerShell terminal:

```powershell
$env:HYDRADB_URI = 'bolt://127.0.0.1:7687'
$env:HYDRADB_USERNAME = 'neo4j'
$env:HYDRADB_AUTH_TOKEN = 'local-development-token-32-bytes'
corepack pnpm aftershock build
corepack pnpm aftershock simulate left-pad
corepack pnpm aftershock serve
```

HydraDB's own Bolt smoke uses the `neo4j` username and the auth token as its password. For a public deployment, replace the local URI with the TLS Bolt address assigned to the host, normally `neo4j+s://your-hydradb-host:7687`, and keep the token private.

## Run the complete local check

This path needs no database and makes the adapter choice visible in every command.

```bash
./scripts/demo.sh
```

On Windows PowerShell:

```powershell
.\scripts\demo.ps1
```

The script generates the fixture, builds both packages, runs the offline build, simulates `left-pad`, scans the known lockfile, runs the graph tests, runs the spec self-check, and produces the static landing build.

## Hydradb query model

The graph uses these node shapes:

```cypher
(:package {name, downloads, createdAt})
(:version {id, publishedAt, digest})
(:maintainer {name})
(:service {name, source})
```

The dependency and evidence edges are `has_version`, `depends_on`, `maintains`, `resolves`, and `similar_name`. The central exposure query is a reverse traversal:

```cypher
MATCH (seed:package {name: $packageName})-[:has_version]->(flagged:version {id: $versionId})
MATCH path = (target:version)-[:depends_on*1..12]->(flagged)
RETURN target.id AS exposed, length(path) AS depth,
  [node IN nodes(path) | node.id] AS path
ORDER BY depth ASC, exposed ASC
```

The other query functions are parameterised in `packages/graph/src/graph/queries.ts`. No vector index or similarity search is used for a headline answer. Name proximity is represented only by measured `similar_name` graph edges.

## Landing page

```bash
pnpm --filter landing dev
pnpm --filter landing build
pnpm --filter landing preview
```

The landing build is static and its lockfile interaction reads the generated fixture answer map. It does not require a running API or network request. The hero canvas uses generated coordinates and dependency edges from the same fixture.

## Deploy the landing page to Vercel

The repository includes `vercel.json` for the static landing package. Import the repository into Vercel with the repository root as the Root Directory. Vercel will use the Vite preset, run the fixture generation and landing build, then serve `packages/landing/dist`.

```bash
vercel --prod
```

The Vercel deployment intentionally uses the generated fixture answer map. It does not connect the browser directly to Hydradb, so deploying the landing page does not switch the demo to live graph mode and does not need a `.env` file or Vercel environment variables.

The page now supports both modes. Leave `VITE_AFTERSHOCK_API_URL` empty for the fixture-backed static demo. Set it to the public URL of the Fastify API before the Vercel build and the lockfile demo calls `/api/scan` and `/api/exposure` against the live graph, with the fixture as a fallback if the API is unavailable.

For a public live API, run the Fastify process on a Docker-capable VM such as a [DigitalOcean Droplet](https://www.digitalocean.com/products/droplets), run HydraDB beside it, and expose the API through HTTPS. Set these API host variables: `HYDRADB_URI`, `HYDRADB_USERNAME`, `HYDRADB_AUTH_TOKEN`, and `PORT`. Then set `VITE_AFTERSHOCK_API_URL` in Vercel to the HTTPS API URL and redeploy. A Vercel static project cannot itself provide the persistent HydraDB process.

## Environment

No `.env` file is required for the static landing page. Copy `.env.example` only when running the production CLI or API locally, then export the values in your shell. The application reads `process.env` directly and does not load dotenv files.

```text
HYDRADB_URI=bolt://localhost:7687
HYDRADB_USERNAME=neo4j
HYDRADB_AUTH_TOKEN=local-development-token-32-bytes
AFTERSHOCK_FIXTURE=packages/graph/fixtures/packages.jsonl
AFTERSHOCK_SPREAD_SCALE=10
PORT=8787
VITE_AFTERSHOCK_API_URL=
GROQ_API_KEY=
GROQ_MODEL_PRIMARY=openai/gpt-oss-120b
GROQ_MODEL_FALLBACK=openai/gpt-oss-20b
```

Groq is the only supported language model provider. It is optional, reserved for future cached blast path narration, and is not called by the CLI, API, or landing demo hot path.

## Measured fixture output

The latest local verification generated these values from the actual fixture and query functions:

| measurement | value |
|---|---:|
| package nodes | 1,500 |
| version nodes | 3,000 |
| maintainer nodes | 32 |
| service nodes | 1,501 |
| graph edges | 9,087 |
| exposed version artifacts | 84 |
| affected packages | 42 |

Build and query timings are written to `packages/graph/fixtures/build-metrics.json` whenever `aftershock build` runs. The landing metrics are regenerated from a real fixture query measurement by `pnpm generate`.

## Attribution

Hydradb provides the graph database. `neo4j-driver` provides the Bolt client. Commander, Fastify, Zod, TypeScript, and Vitest support the graph package. React, Vite, Tailwind CSS, Motion, and Lucide React support the landing page. Satoshi, Inter, and Space Mono are loaded from Fontshare and Google Fonts. The fixture and layout are generated by this repository.

## Repository

[github.com/dr4ken-soul/Aftershock](https://github.com/dr4ken-soul/Aftershock)

Built on Hydradb for Hack Hydra track 02.

## License

MIT. See [LICENSE](LICENSE).

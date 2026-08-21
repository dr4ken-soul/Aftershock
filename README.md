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

The dependency and evidence edges are `has_version`, `depends_on`, `required_by`, `maintains`, `resolves`, and `similar_name`. The central exposure query is a reverse traversal over the real Bolt graph. HydraDB 0.1.0 supports fixed-depth relationship patterns, so the runtime issues one fixed-depth traversal per depth:

```cypher
MATCH (flagged {id: 123})-[:required_by]->(target)
RETURN target.key AS exposed, target.key AS path, target.publishedAt AS publishedAt
ORDER BY exposed ASC
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

With no `VITE_AFTERSHOCK_API_URL`, the Vercel deployment uses the generated fixture answer map and needs no `.env` file. It does not connect the browser directly to Hydradb.

The page now supports both modes. Leave `VITE_AFTERSHOCK_API_URL` empty for the fixture-backed static demo. Set it to the public URL of the Fastify API before the Vercel build and the lockfile demo calls `/api/scan` and `/api/exposure` against the live graph, with the fixture as a fallback if the API is unavailable.

### Deploy the live path on Railway

Railway hosts the HydraDB graph service and the public Aftershock API service. The Vercel landing page remains the browser-facing frontend.

1. Create a Railway service from the official HydraDB image, `ghcr.io/hydra-db/hydradb:latest`. Add a persistent volume mounted at `/data`. Set the service start command to the following, replacing the token with a secret you create:

   ```sh
   /bin/sh -c "echo YOUR_GRAPH_TOKEN > /data/auth-token && mkdir -p /data/store /data/cache && exec /usr/local/bin/graph-node"
   ```

   Set the HydraDB variables below. Replace `<hydradb-internal-hostname>` with the hostname Railway shows for the HydraDB service. In the verified deployment it is `hydradb.railway.internal`.

   ```text
   CLOUD_PROVIDER=local
   LOCAL_PATH=/data/store
   GRAPH_NAMESPACE=default
   GRAPH_ID=default
   GRAPH_CELL_ID=cell-0
   GRAPH_CELLS=cell-0
   GRAPH_NODE_ID=node-0
   GRAPH_BOLT_NODE_ADDRESSES=node-0=<hydradb-internal-hostname>:7687
   GRAPH_ADVERTISED_BOLT_ADDR=<hydradb-internal-hostname>:7687
   GRAPH_DATA_CACHE_DIR=/data/cache
   GRAPH_AUTH_TOKEN_FILE=/data/auth-token
   GRAPH_ALLOW_PLAINTEXT=true
   RUST_MIN_STACK=33554432
   ```

2. Create a second Railway service from this repository. Use the repository root and the committed `railway.json`. The service build command is `corepack pnpm install --frozen-lockfile && corepack pnpm generate && corepack pnpm --filter graph build`, and its start command builds the graph over Bolt before starting the API.
3. Set the API service variables exactly as follows:

   ```text
   HYDRADB_URI=bolt://<hydradb-internal-hostname>:7687
   HYDRADB_USERNAME=neo4j
   HYDRADB_AUTH_TOKEN=<the exact same token used by HydraDB>
   AFTERSHOCK_FIXTURE=packages/graph/fixtures/packages.jsonl
   ```

   Railway supplies `PORT`; the API listens on `0.0.0.0`. `GROQ_API_KEY` is not required for this live graph path.
4. Generate a public domain for the API service. The verified deployment uses `https://aftershock-api-production.up.railway.app`. Check it with `/health`, which measures a real Bolt package-node round trip.
5. In Vercel, add the build-time variable `VITE_AFTERSHOCK_API_URL=https://<your-api-domain>`, then redeploy the landing page. The browser calls Railway, Railway calls HydraDB over Bolt, and the headline answers come from graph traversals.

Railway's [deployment guide](https://docs.railway.com/deploy/deployments), [volumes guide](https://docs.railway.com/reference/volumes), and [private networking guide](https://docs.railway.com/guides/private-networking) cover the deployment settings. A Vercel project cannot itself provide the persistent HydraDB process.

### Local live recording path

The three-terminal sequence below is local live verification, not a deployment. It uses a real local HydraDB process, the real Aftershock Fastify API, and a Vite development server. The deployed recording path uses the Railway API URL above instead.

Terminal 1 runs HydraDB with Docker. Terminal 2 builds the graph through Bolt and serves the API. Terminal 3 starts the landing page with `VITE_AFTERSHOCK_API_URL=http://localhost:8787`. When the demo reports `live hydradb graph`, the browser has called the API and the API has queried HydraDB. The local sequence does not require Vercel or Railway.

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

Groq is the only supported language model provider. The current build does not make a model call. Its variables are reserved for a future cached blast path narration job, and it is not called by the CLI, API, or landing demo hot path. The graph findings are computed by Hydradb traversals, not generated by an LLM.

## Measured fixture output

The latest local verification generated these values from the actual fixture and query functions:

| measurement | value |
|---|---:|
| package nodes | 1,500 |
| version nodes | 3,000 |
| maintainer nodes | 32 |
| service nodes | 1,501 |
| graph edges | 12,167 |
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

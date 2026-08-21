import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGraph } from '../packages/graph/src/commands/build.js'
import { createRuntime, closeRuntime, getExposureReport } from '../packages/graph/src/runtime.js'
import { scanLockfile } from '../packages/graph/src/commands/scan.js'
import { simulatePackage } from '../packages/graph/src/commands/simulate.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const fixture = resolve(root, 'packages/graph/fixtures/packages.jsonl')
const lockfile = resolve(root, 'packages/graph/fixtures/demo-lockfile.json')
const metricsPath = resolve(root, 'packages/graph/fixtures/build-metrics.json')
const runtime = await createRuntime(fixture, true)
try {
  const metrics = await buildGraph(fixture, metricsPath, true)
  const events = await simulatePackage(runtime, 'left-pad')
  const findings = await scanLockfile(runtime, lockfile)
  const report = await getExposureReport(runtime, 'left-pad')
  if (metrics.packageNodes !== 1500 || events.length !== 84 || findings.length !== 1 || !findings[0].reaches || report.totalExposed !== events.length) throw new Error('offline smoke assertions failed')
  await readFile(metricsPath, 'utf8')
  process.stdout.write(`smoke passed: ${metrics.packageNodes} packages, ${metrics.edges} edges, ${events.length} exposed, ${findings.length} finding\n`)
} finally {
  await closeRuntime(runtime)
}

#!/usr/bin/env node
import { Command } from 'commander'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGraph } from './commands/build.js'
import { scanLockfile } from './commands/scan.js'
import { serveApi } from './commands/serve.js'
import { simulatePackage } from './commands/simulate.js'
import { createRuntime, closeRuntime } from './runtime.js'

const program = new Command()
const defaultFixture = process.env.AFTERSHOCK_FIXTURE ?? fileURLToPath(new URL('../fixtures/packages.jsonl', import.meta.url))

program.name('aftershock').description('Supply chain blast radius console')
program.command('build').option('--offline', 'use the bundled graph adapter for local verification').action(async (options: { offline?: boolean }) => {
  const metrics = await buildGraph(defaultFixture, fileURLToPath(new URL('../fixtures/build-metrics.json', import.meta.url)), Boolean(options.offline))
  process.stdout.write(`${JSON.stringify(metrics)}\n`)
})
program.command('simulate <packageName>').option('--offline', 'use the bundled graph adapter for local verification').action(async (packageName: string, options: { offline?: boolean }) => {
  const runtime = await createRuntime(defaultFixture, Boolean(options.offline))
  try {
    const events = await simulatePackage(runtime, packageName)
    for (const event of events) process.stdout.write(`${event.order}\t${event.elapsedMs}ms\tdepth ${event.depth}\t${event.name}@${event.version}\t${event.viaPath.join(' > ')}\n`)
    process.stdout.write(`total exposed: ${events.length}\n`)
  } finally {
    await closeRuntime(runtime)
  }
})
program.command('scan <lockfile>').option('--offline', 'use the bundled graph adapter for local verification').action(async (lockfile: string, options: { offline?: boolean }) => {
  const runtime = await createRuntime(defaultFixture, Boolean(options.offline))
  try {
    const findings = await scanLockfile(runtime, resolve(lockfile))
    process.stdout.write(`${JSON.stringify({ findings }, null, 2)}\n`)
  } finally {
    await closeRuntime(runtime)
  }
})
program.command('serve').option('--offline', 'use the bundled graph adapter for local verification').action(async (options: { offline?: boolean }) => {
  await serveApi(defaultFixture, Boolean(options.offline))
})

await program.parseAsync()

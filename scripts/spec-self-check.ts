import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const files = ['packages/landing/src/App.tsx', 'packages/landing/src/styles/globals.css', 'packages/landing/src/components/sections/Hero.tsx', 'packages/landing/src/components/sections/DemoStrip.tsx', 'packages/landing/src/components/sections/Timeline.tsx', 'packages/landing/src/components/sections/Architecture.tsx', 'packages/landing/src/components/sections/QuestionsBento.tsx', 'packages/landing/src/components/sections/Metrics.tsx', 'packages/landing/src/components/sections/HydraSplit.tsx', 'packages/landing/src/components/sections/FinalCta.tsx', 'packages/landing/src/components/sections/Footer.tsx']
const source = (await Promise.all(files.map(async (file) => [file, await readFile(resolve(root, file), 'utf8')] as const))).map(([file, content]) => `${file}\n${content}`).join('\n')
const required = ['aftershock', 'run the live demo', 'your lockfile, put on the map', 'six minutes is the new response window', 'from registry to answer in one graph', 'the five questions a breach actually asks', 'a question similarity search cannot answer', 'map yours before the next one', 'built on hydradb']
const banned = ['localStorage', 'sessionStorage', 'onMouseEnter', 'onMouseLeave', 'JetBrains Mono', 'console.log', '\u2014', 'gradient-text']
const missing = required.filter((value) => !source.toLowerCase().includes(value.toLowerCase()))
const present = banned.filter((value) => source.includes(value))
if (missing.length || present.length) throw new Error(`spec self-check failed: missing=${missing.join(',')} banned=${present.join(',')}`)
process.stdout.write(`spec self-check passed: ${files.length} page source files audited\n`)

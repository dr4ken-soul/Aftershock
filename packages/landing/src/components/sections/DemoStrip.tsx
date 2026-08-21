import { useState, type DragEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { demoFinding, demoReport } from '../../data/demo-fixtures'
import type { ExposureReport, LockfileFinding } from '@aftershock/graph/types'

interface ScanResponse { findings: LockfileFinding[] }

const apiUrl = (import.meta.env.VITE_AFTERSHOCK_API_URL ?? '').replace(/\/$/, '')

/** Renders the live Hydradb lockfile interaction or the explicit fixture mode. */
export function DemoStrip() {
  const [finding, setFinding] = useState<LockfileFinding | null>(null)
  const [report, setReport] = useState<ExposureReport>(demoReport)
  const [live, setLive] = useState(Boolean(apiUrl))
  const [liveError, setLiveError] = useState(false)
  const [loading, setLoading] = useState(false)

  const scanDemo = async () => {
    if (!apiUrl) {
      setFinding(demoFinding)
      return
    }
    await scanLive({ name: 'aftershock-demo', lockfileVersion: 3, packages: { '': { dependencies: { 'demo-service': '1.0.0' } }, 'node_modules/demo-service': { version: '1.0.0', dependencies: { 'left-pad': '1.0.0' } }, 'node_modules/left-pad': { version: '1.0.0' } } })
  }

  const scanLive = async (lockfile: Record<string, unknown>) => {
    setLoading(true)
    try {
      const [scanResponse, exposureResponse] = await Promise.all([
        fetch(`${apiUrl}/api/scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lockfile) }),
        fetch(`${apiUrl}/api/exposure`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ package: 'left-pad' }) }),
      ])
      if (!scanResponse.ok || !exposureResponse.ok) throw new Error('live API request failed')
      const scan = await scanResponse.json() as ScanResponse
      const exposure = await exposureResponse.json() as ExposureReport
      setFinding(scan.findings[0] ?? { resolved: 'clean lockfile', path: ['root'], reaches: false, firstBadWindowOverlap: false })
      setReport(exposure)
      setLive(true)
      setLiveError(false)
    } catch {
      setLiveError(true)
      setFinding(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return
    try {
      const lockfile = JSON.parse(await file.text()) as Record<string, unknown>
      if (apiUrl) {
        await scanLive(lockfile)
        return
      }
      const packages = lockfile.packages as Record<string, { version?: string }> | undefined
      const exposed = Object.values(packages ?? {}).some((entry) => entry.version === demoReport.comprom.version)
      setFinding(exposed ? demoFinding : { resolved: 'clean lockfile', path: ['root'], reaches: false, firstBadWindowOverlap: false })
    } catch {
      setFinding({ resolved: 'unreadable lockfile', path: ['root'], reaches: false, firstBadWindowOverlap: false })
    }
  }

  return <section id="demo" className="bg-[var(--bg-secondary)] px-4 py-[8rem]"><div className="mx-auto flex max-w-4xl flex-col gap-[3rem]">
    <FadeIn><div><h2 className="font-display text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] md:text-[3rem]">your lockfile, put on the map</h2><p className="mt-4 max-w-lg font-sans text-base leading-[1.6] text-[var(--text-secondary)]">drop a package-lock.json, the scanner joins every resolved version against the graph and reports what a compromise could reach</p></div></FadeIn>
    <FadeIn delay={0.1}><div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="flex flex-col items-center gap-4 rounded-[8px] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center transition-colors duration-200 hover:border-[var(--accent)]"><UploadCloud size={20} className="text-[var(--text-secondary)]" /><span className="font-sans text-sm font-light leading-[1.6] text-[var(--text-secondary)]">drop a lockfile or run it on ours</span><button type="button" disabled={loading} onClick={scanDemo} className="rounded-[4px] border border-[var(--border-default)] px-4 py-2 font-sans text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-wait disabled:opacity-60">{loading ? 'scanning graph' : 'scan the demo lockfile'}</button></div></FadeIn>
    {liveError && <FadeIn delay={0.2}><div className="rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 font-sans text-sm text-[var(--text-secondary)]">live hydradb graph unavailable</div></FadeIn>}
    {finding && <FadeIn delay={0.2}><div className="grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-3"><div className="bg-[var(--bg-surface)] p-6 md:col-span-3"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">{live ? 'live hydradb graph' : 'fixture graph'}</div></div><div className="cell-hover bg-[var(--bg-surface)] p-6 md:col-span-2"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">exposure</div><div className={`mt-3 font-mono text-[2.5rem] font-bold leading-none ${finding.reaches ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}>{finding.reaches ? `${report.totalExposed} artifacts` : '0 artifacts'}</div><p className="mt-2 font-sans text-sm font-light leading-[1.6] text-[var(--text-secondary)]">reachable from the flagged version</p></div><div className="cell-hover bg-[var(--bg-surface)] p-6"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">depth</div><div className="mt-3 font-mono text-[2.5rem] font-bold leading-none text-[var(--text-primary)]">{finding.reaches ? `${report.maxDepth} hops` : '0 hops'}</div></div><div className="bg-[var(--bg-surface)] p-6 md:col-span-3"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">dependency path</div><code className="mt-3 block font-mono text-sm leading-7 text-[var(--text-primary)]">{finding.path.map((hop, index) => <span key={`${hop}-${index}`} className="block"><span className={`mr-2 inline-block h-1.5 w-1.5 ${index === finding.path.length - 1 && finding.reaches ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'}`} />{hop}</span>)}</code></div></div></FadeIn>}
  </div></section>
}

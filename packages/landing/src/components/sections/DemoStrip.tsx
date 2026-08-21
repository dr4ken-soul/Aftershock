import { useState, type DragEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { demoFinding, demoReport } from '../../data/demo-fixtures'
import type { LockfileFinding } from '@aftershock/graph/types'

/** Renders the static lockfile interaction powered by the bundled graph answer. */
export function DemoStrip() {
  const [finding, setFinding] = useState<LockfileFinding | null>(null)
  const scanDemo = () => setFinding(demoFinding)
  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return
    try {
      const value = JSON.parse(await file.text()) as { packages?: Record<string, { version?: string }> }
      const exposed = Object.values(value.packages ?? {}).some((entry) => entry.version === demoReport.comprom.version)
      setFinding(exposed ? demoFinding : { resolved: 'clean lockfile', path: ['root'], reaches: false, firstBadWindowOverlap: false })
    } catch {
      setFinding({ resolved: 'unreadable lockfile', path: ['root'], reaches: false, firstBadWindowOverlap: false })
    }
  }
  return <section id="demo" className="bg-[var(--bg-secondary)] px-4 py-[8rem]"><div className="mx-auto flex max-w-4xl flex-col gap-[3rem]">
    <FadeIn><div><h2 className="font-display text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] md:text-[3rem]">your lockfile, put on the map</h2><p className="mt-4 max-w-lg font-sans text-base leading-[1.6] text-[var(--text-secondary)]">drop a package-lock.json, the scanner joins every resolved version against the graph and reports what a compromise could reach</p></div></FadeIn>
    <FadeIn delay={0.1}><div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="flex flex-col items-center gap-4 rounded-[8px] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center transition-colors duration-200 hover:border-[var(--accent)]"><UploadCloud size={20} className="text-[var(--text-secondary)]" /><span className="font-sans text-sm font-light leading-[1.6] text-[var(--text-secondary)]">drop a lockfile or run it on ours</span><button type="button" onClick={scanDemo} className="rounded-[4px] border border-[var(--border-default)] px-4 py-2 font-sans text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">scan the demo lockfile</button></div></FadeIn>
    {finding && <FadeIn delay={0.2}><div className="grid grid-cols-1 gap-px overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-3"><div className="cell-hover bg-[var(--bg-surface)] p-6 md:col-span-2"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">exposure</div><div className={`mt-3 font-mono text-[2.5rem] font-bold leading-none ${finding.reaches ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}>{finding.reaches ? `${demoReport.totalExposed} artifacts` : '0 artifacts'}</div><p className="mt-2 font-sans text-sm font-light leading-[1.6] text-[var(--text-secondary)]">reachable from the flagged version</p></div><div className="cell-hover bg-[var(--bg-surface)] p-6"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">depth</div><div className="mt-3 font-mono text-[2.5rem] font-bold leading-none text-[var(--text-primary)]">{finding.reaches ? `${demoReport.maxDepth} hops` : '0 hops'}</div></div><div className="bg-[var(--bg-surface)] p-6 md:col-span-3"><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">dependency path</div><code className="mt-3 block font-mono text-sm leading-7 text-[var(--text-primary)]">{finding.path.map((hop, index) => <span key={`${hop}-${index}`} className="block"><span className={`mr-2 inline-block h-1.5 w-1.5 ${index === finding.path.length - 1 && finding.reaches ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'}`} />{hop}</span>)}</code></div></div></FadeIn>}
  </div></section>
}

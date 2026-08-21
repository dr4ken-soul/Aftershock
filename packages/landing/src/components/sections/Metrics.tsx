import { Metric } from '../ui/Metric'
import { fixtureMetrics } from '../../data/demo-fixtures'

/** Displays the measured fixture graph and query timings in the metrics band. */
export function Metrics() {
  return <section className="border-y border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-16"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-4"><Metric value={fixtureMetrics.packageNodes} label="package nodes" /><Metric value={fixtureMetrics.edges} label="graph edges" /><Metric value={fixtureMetrics.closureMs} label="closure query" suffix="ms" /><Metric value={fixtureMetrics.scanMs} label="lockfile scan" suffix="ms" /></div></section>
}

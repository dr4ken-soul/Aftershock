import { motion } from 'motion/react'
import type { SpreadEvent } from '@aftershock/graph/types'
import { AttackMap } from '../../canvas/AttackMap'

const repoUrl = 'https://github.com/dr4ken-soul/Aftershock'

/** Renders the full viewport patient-zero replay and hero copy. */
export function Hero({ events }: { events: SpreadEvent[] }) {
  return <section className="relative min-h-[100dvh] overflow-hidden bg-[var(--bg-primary)]">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 }} className="absolute inset-0 z-0 opacity-40 md:opacity-100"><AttackMap events={events} /></motion.div>
    <div aria-hidden="true" className="hero-veil absolute inset-0 z-0 pointer-events-none" />
    <div className="relative z-10 flex min-h-[100dvh] items-center">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <motion.span initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 }} className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">track 02 · supply chain blast radius</motion.span>
          <motion.h1 initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] md:text-[5rem]">every dependency<br />is a door</motion.h1>
          <motion.p initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="max-w-md font-sans text-lg font-light leading-[1.6] text-[var(--text-secondary)]">aftershock maps your dependency graph in hydradb so a compromised package shows its full blast radius in seconds</motion.p>
          <motion.div initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="flex gap-3">
            <a href="#demo" className="rounded-[4px] bg-[var(--accent)] px-6 py-3 font-sans text-sm font-medium text-[var(--bg-primary)] transition-colors duration-200 hover:bg-[var(--accent-hover)]">run the live demo</a>
            <a href={repoUrl} className="rounded-[4px] border border-[var(--border-default)] px-6 py-3 font-sans text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">view on github</a>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
}

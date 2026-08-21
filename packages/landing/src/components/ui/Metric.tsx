import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

export interface MetricProps {
  value: number
  label: string
  suffix?: string
}

/** Counts a measured build metric once when its cell enters the viewport. */
export function Metric({ value, label, suffix = '' }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!visible) return
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 600)
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, visible])
  return <div ref={ref} className="bg-[var(--bg-surface)] p-6"><motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="font-mono text-[2.5rem] leading-none font-bold tracking-[-0.02em] tabular-nums text-[var(--text-primary)]">{display}{suffix}</motion.div><div className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</div></div>
}

import { useMotionValue, useSpring } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { useRef } from 'react'

/** Adds the restrained cursor pull used only by the final call to action. */
export function Magnet({ children }: { children: ReactNode }) {
  const target = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 250, damping: 20 })
  const springY = useSpring(y, { stiffness: 250, damping: 20 })
  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    const bounds = target.current?.getBoundingClientRect()
    if (!bounds) return
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12)
  }
  const reset = () => { x.set(0); y.set(0) }
  return <a ref={target} onPointerMove={move} onPointerLeave={reset} style={{ x: springX, y: springY }} className="inline-flex items-center justify-center border border-[var(--border-default)] rounded-[4px] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-[border-color,color] duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">{children}</a>
}

import { motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

const repoUrl = 'https://github.com/dr4ken-soul/Aftershock'

/** Renders the wide hero bar and scroll-morphed compact navigation pill. */
export function Nav() {
  const scrollY = useMotionValue(0)
  const compactOpacity = useTransform(scrollY, [0, 80], [0, 1])
  const wideOpacity = useTransform(scrollY, [0, 80], [1, 0])
  useEffect(() => {
    const update = () => scrollY.set(window.scrollY)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [scrollY])
  return <>
    <motion.header style={{ opacity: wideOpacity }} className="fixed left-0 top-0 z-50 w-full transition-all duration-300">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-[var(--text-primary)]">aftershock</span>
        <a href="#demo" className="rounded-[4px] border border-[var(--border-default)] px-4 py-2 font-sans text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">run the live demo</a>
      </nav>
    </motion.header>
    <motion.header style={{ opacity: compactOpacity }} className="fixed left-1/2 top-4 z-40 -translate-x-1/2 transition-all duration-200">
      <nav className="flex items-center gap-4 rounded-[9999px] border border-[var(--border-default)] bg-[var(--bg-surface)]/80 px-5 py-2.5 backdrop-blur-[16px]">
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-[var(--text-primary)]">aftershock</span>
        <a href="#demo" className="rounded-[4px] border border-[var(--border-default)] px-4 py-2 font-sans text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]">run the live demo</a>
      </nav>
    </motion.header>
    <a className="sr-only" href={repoUrl}>view on github</a>
  </>
}

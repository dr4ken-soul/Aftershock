const repoUrl = 'https://github.com/dr4ken-soul/Aftershock'

/** Renders the plain text wordmark, repository links, and attribution row. */
export function Footer() {
  return <footer className="border-t border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-16"><div className="mx-auto flex max-w-6xl flex-col items-center gap-6"><div className="font-display text-xl text-[var(--text-primary)]">aftershock</div><div className="flex gap-4 font-sans text-sm font-light text-[var(--text-secondary)]"><a href={repoUrl} className="transition-colors duration-100 hover:text-[var(--text-primary)]">view on github</a><span className="text-[var(--text-muted)]">·</span><a href="https://github.com/hydradatabase/hydradb" className="transition-colors duration-100 hover:text-[var(--text-primary)]">built on hydradb</a><span className="text-[var(--text-muted)]">·</span><a href="https://hackhydra.com" className="transition-colors duration-100 hover:text-[var(--text-primary)]">hack hydra</a></div><div className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">august 2026 · track 02 · mit</div></div></footer>
}

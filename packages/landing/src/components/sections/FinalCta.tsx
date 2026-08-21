import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { Magnet } from '../ui/Magnet'

const command = 'git clone https://github.com/dr4ken-soul/Aftershock.git && cd Aftershock && ./scripts/demo.sh'

/** Renders the clone command and copy action at the end of the page. */
export function FinalCta() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return <section className="bg-[var(--bg-secondary)] px-4 py-[8rem] text-center"><div className="mx-auto flex max-w-3xl flex-col items-center gap-8"><FadeIn><h2 className="font-display text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] md:text-[5rem]">map yours before the next one</h2></FadeIn><FadeIn delay={0.1}><div className="flex min-w-[320px] items-center justify-between gap-4 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3.5"><code className="text-left font-mono text-sm text-[var(--text-primary)]">git clone ... && ./scripts/demo.sh</code><button type="button" aria-label="copy clone command" onClick={copy} className="text-[var(--text-secondary)] transition-colors duration-100 hover:text-[var(--accent)]">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div></FadeIn><Magnet>run the live demo</Magnet></div></section>
}

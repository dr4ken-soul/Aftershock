import { FadeIn } from '../ui/FadeIn'
import { fixtureStory } from '../../data/demo-fixtures'

/** Tells the six minute incident story as the approved timeline composition. */
export function Timeline() {
  const events = [
    ['09:00', 'ci pipeline breached', 'the worm\'s first artifacts publish within seconds of the breach'],
    ['09:02', 'first artifacts live', `${fixtureStory.artifacts / 7} artifacts cross the package boundary`],
    ['09:04', `${fixtureStory.artifacts} artifacts across ${fixtureStory.packages} packages`, 'the reverse closure is now visible in the graph'],
    ['09:06', 'worm persists inside ide config directories', 'the compromise outlives the original release window'],
  ]
  return <section className="bg-[var(--bg-primary)] px-4 py-[8rem]"><div className="mx-auto max-w-3xl"><FadeIn><span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">the problem</span><h2 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] md:text-[3rem]">six minutes is the new response window</h2></FadeIn><div className="mt-12 border-l border-[var(--border-default)] pl-6">{events.map(([time, heading, body], index) => <FadeIn key={time} delay={index * 0.08}><div className="relative pb-8"><span className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-[2px] border ${index < 3 ? 'border-[var(--error)] bg-[var(--error)]' : 'border-[var(--border-default)] bg-[var(--bg-elevated)]'}`} /><div className="flex items-baseline gap-4"><span className="w-16 shrink-0 font-mono text-sm text-[var(--accent)]">{time}</span><div><p className="font-sans text-base font-medium text-[var(--text-primary)]">{heading}</p><p className="mt-1 font-sans text-sm font-light leading-[1.6] text-[var(--text-secondary)]">{body}</p></div></div></div></FadeIn>)}<FadeIn delay={0.32}><div className="border border-[var(--error)] bg-[var(--bg-surface)] p-6"><p className="font-sans text-xl font-medium leading-[1.3] text-[var(--text-primary)]">anything you cannot map in those six minutes, you learn about from the news</p></div></FadeIn></div></div></section>
}

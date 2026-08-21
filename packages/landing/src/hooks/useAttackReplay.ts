import { useEffect, useState } from 'react'
import type { SpreadEvent } from '@aftershock/graph/types'

export interface ReplayState { elapsedMs: number, eventIndex: number, playing: boolean }

/** Owns the seeded replay clock, hop cursor, and four second loop hold. */
export function useAttackReplay(events: SpreadEvent[], scale = 10, holdMs = 4000): ReplayState {
  const [state, setState] = useState<ReplayState>({ elapsedMs: 0, eventIndex: -1, playing: true })
  useEffect(() => {
    let frame = 0
    let startedAt = performance.now()
    const duration = (events[events.length - 1]?.elapsedMs ?? 28000) + holdMs
    const tick = (now: number) => {
      const elapsed = (now - startedAt) * (scale / 10)
      const loopElapsed = elapsed % duration
      const index = events.reduce((found, event, eventIndex) => event.elapsedMs <= loopElapsed ? eventIndex : found, -1)
      setState({ elapsedMs: Math.round(loopElapsed), eventIndex: index, playing: loopElapsed < duration - holdMs })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [events, holdMs, scale])
  return state
}

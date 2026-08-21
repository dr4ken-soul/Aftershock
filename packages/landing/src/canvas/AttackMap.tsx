import { useEffect, useRef } from 'react'
import type { SpreadEvent } from '@aftershock/graph/types'
import { layoutEdges, layoutPoints } from './layout'
import { useAttackReplay } from '../hooks/useAttackReplay'

export interface AttackMapProps { events: SpreadEvent[], mini?: boolean }

/** Paints the fixture layout and timed infection state in the hand-rolled canvas layer. */
export function AttackMap({ events, mini = false }: AttackMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const replay = useAttackReplay(events)
  const replayRef = useRef(replay)
  replayRef.current = replay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim()
    const error = getComputedStyle(canvas).getPropertyValue('--error').trim()
    const background = getComputedStyle(canvas).getPropertyValue('--bg-primary').trim()
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * ratio
      canvas.height = canvas.clientHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.fillStyle = background
      context.fillRect(0, 0, width, height)
      const pointMap = new Map(layoutPoints.map((point) => [point.id, point]))
      context.lineWidth = mini ? 0.35 : 0.5
      for (const edge of layoutEdges) {
        const from = pointMap.get(edge.from)
        const to = pointMap.get(edge.to)
        if (!from || !to) continue
        context.strokeStyle = `${accent}14`
        context.beginPath()
        context.moveTo(from.x * width, from.y * height)
        context.lineTo(to.x * width, to.y * height)
        context.stroke()
      }
      const currentReplay = replayRef.current
      const infected = new Set(events.slice(0, currentReplay.eventIndex + 1).map((event) => `${event.name}@${event.version}`))
      const seed = events[0] ? `${events[0].viaPath[0]}@${events[0].viaPath[1]}` : 'left-pad@1.0.0'
      for (const point of layoutPoints) {
        const isSeed = point.id === seed
        const isInfected = isSeed || infected.has(point.id)
        context.globalAlpha = isInfected ? 0.9 : 0.3
        context.fillStyle = isInfected ? error : accent
        context.beginPath()
        context.arc(point.x * width, point.y * height, mini ? 0.8 : 1.5, 0, Math.PI * 2)
        context.fill()
        if (isSeed && currentReplay.playing) {
          context.globalAlpha = 0.14
          context.beginPath()
          context.arc(point.x * width, point.y * height, mini ? 7 : 16, 0, Math.PI * 2)
          context.fill()
        }
      }
      context.globalAlpha = 1
      context.fillStyle = accent
      context.font = `${mini ? 9 : 12}px Space Mono`
      context.fillText(`${String(Math.round(currentReplay.elapsedMs / 1000)).padStart(2, '0')}s`, width - (mini ? 28 : 42), 24)
      frame = requestAnimationFrame(draw)
    }
    let frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [events, mini])
  return <canvas ref={canvasRef} aria-label="animated dependency attack map" className="block h-full w-full" />
}

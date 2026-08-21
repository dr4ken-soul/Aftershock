/** Renders the fixed low-opacity grain layer required by the visual system. */
export function GrainOverlay() {
  return <div aria-hidden="true" className="grain fixed inset-0 z-[3] pointer-events-none opacity-[0.03]" />
}

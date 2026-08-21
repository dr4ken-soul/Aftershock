import { Nav } from './components/layout/Nav'
import { GrainOverlay } from './components/ui/GrainOverlay'
import { Hero } from './components/sections/Hero'
import { DemoStrip } from './components/sections/DemoStrip'
import { Timeline } from './components/sections/Timeline'
import { Architecture } from './components/sections/Architecture'
import { QuestionsBento } from './components/sections/QuestionsBento'
import { Metrics } from './components/sections/Metrics'
import { HydraSplit } from './components/sections/HydraSplit'
import { FinalCta } from './components/sections/FinalCta'
import { Footer } from './components/sections/Footer'
import { demoReport } from './data/demo-fixtures'

/** Assembles the landing page in the exact order defined by the frontend specification. */
export default function App() {
  return <><Nav /><GrainOverlay /><main><Hero events={demoReport.events} /><DemoStrip /><Timeline /><Architecture /><QuestionsBento /><Metrics /><HydraSplit /><FinalCta /></main><Footer /></>
}

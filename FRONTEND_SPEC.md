# aftershock — frontend spec

## overview

this is the authoritative visual and interaction specification for the aftershock landing page, it sits beside CLAUDE.md, APP_BLUEPRINT.md, BUILD_GUIDE.md and VIDEO_PIPELINE.md, CLAUDE.md holds the design system and code rules, APP_BLUEPRINT.md holds the product surface, BUILD_GUIDE.md holds implementation order, this file holds every pixel and every motion value, read all of them before writing a component

quality benchmark, the cinematic video hero golden reference from step 3c, adapted so the background layer is a coded animated canvas instead of video, plus the composition recipes referenced per section, bento grid operational is the approved aesthetic, every section obeys the bento discipline, single pixel borders, no decorative shadow, noise via css only, asymmetric cells

## global rules

typography scale:

```
display-xl:  font-display (satoshi), 3.5rem (56px) / 1.05 leading, font-weight 700, tracking -0.02em, md: 5rem (80px)
display-lg:  font-display, 2.5rem (40px) / 1.1 leading, font-weight 700, tracking -0.01em, md: 3rem (48px)
heading:     font-sans (inter), 1.25rem (20px) / 1.3 leading, font-weight 500
body-lg:     font-sans, 1.125rem (18px) / 1.6 leading, font-weight 300
body:        font-sans, 1rem (16px) / 1.6 leading, font-weight 400
body-sm:     font-sans, 0.875rem (14px) / 1.6 leading, font-weight 300
data:        font-mono (space mono), 0.875rem (14px) / 1.5 leading, font-weight 400
metric:      font-mono, 2.5rem (40px) / 1 leading, font-weight 700, tracking -0.02em
label:       font-mono, 0.75rem (12px) / 1 leading, font-weight 400, tracking 0.15em, uppercase
```

spacing tokens, use these, never arbitrary values:

```
xs 4px, sm 8px, md 16px, lg 24px, xl 32px, 2xl 48px, 3xl 64px, 4xl 96px, 5xl 128px
```

radius tokens, neon terminal block:

```
sm 2px, md 4px, lg 8px, xl 12px, 2xl 16px, pill 9999px
```

transition standard:

```
fast:    100ms ease
default: 200ms ease
slow:    400ms cubic-bezier(0.16, 1, 0.3, 1)
```

entrance standard, all below-fold elements:

```
initial:    { opacity: 0, filter: 'blur(8px)', y: 20 }
animate:    { opacity: 1, filter: 'blur(0px)', y: 0 }
viewport:   { once: false, margin: '-80px' }
transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
```

replays on scroll return because the approved transition behaviour is staggered viewport reveal

stagger containers, staggerChildren 0.08 on the parent, children supply variants

motion import path, `import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react'`

bento discipline, css grid with named areas, gap 1px over a border-default background so gaps become grid lines, cells use `--bg-surface`, hover lifts translateY(-2px) and shifts border, never scale, never shadow

colour law, `--error #ff3366` exists only inside the attack state, canvas infection, timeline breach markers and the exposure findings, everything else lives on cyan, white and the neutral ramp

no inline styles except motion values and the canvas element, no onmouseenter or onmouseleave styling logic, no localstorage, no spinners, no logo or favicon beyond comment slots

## z-index map, page wide

```
z-0:   section backgrounds and canvas layers
z-[3]: grain overlay, fixed, pointer-events-none
z-10:  section content layers
z-40:  scroll-morph pill in collapsed state
z-50:  grain overlay top copy aside, nav in full bar state
```

## section 1, nav

component, src/components/layout/Nav.tsx

pattern, a2 scroll-morph pill, two states driven by a scrollY threshold of 80px, no state library, a single useMotionValue plus useTransform on scrollY

state a, full bar, renders while scrollY < 80:

```
<header> fixed top-0 left-0 w-full z-50 transition-all duration-300
  <nav> max-w-6xl mx-auto flex items-center justify-between px-6 py-5
    <span> wordmark, font-display text-lg font-bold tracking-[-0.01em] text-[var(--text-primary)]
      "aftershock"
    <a href="#demo"> ghost cta
      font-sans text-sm font-medium text-[var(--text-primary)]
      border border-[var(--border-default)] rounded-[4px] px-4 py-2
      hover:border-[var(--accent)] hover:text-[var(--accent)] transition-default
      "run the live demo"
```

state b, collapsed pill, scrollY >= 80, crossfade and morph via layout animation:

```
<header> fixed top-4 left-1/2 -translate-x-1/2 z-40
  <nav> rounded-[9999px] px-5 py-2.5 flex items-center gap-4
        bg-[var(--bg-surface)]/80 backdrop-blur-[16px]
        border border-[var(--border-default)]
    wordmark same treatment, cta identical button
```

behaviour rules, never paints a solid background, the blur does the separation, active state on links would need an underline or dot but the page has no centre links so no active state exists, morph transition 200ms ease with a 60ms opacity crossfade between states

## section 2, hero

component, src/components/sections/Hero.tsx, with canvas/AttackMap.tsx as the background layer

dimensions, min-h-[100dvh], relative, overflow-hidden

layer 1, attack map canvas, z-0:

```
<motion.div> absolute inset-0, no parallax, the canvas owns motion
  <canvas> w-full h-full block
```

the canvas renders the precomputed dependency layout, node dots at 1.5px, edges at 0.5px alpha 0.08, on load the replay engine plays the fixture spread sequence once then loops with a 4 second pause, seed node pulses error red, spread propagates hop by hop at spread scale 10, unaffected nodes dim to 30 percent, a timestamp ticker top right of the canvas in mono counts elapsed simulation time, canvas reads css variables once on mount

layer 2, tonal veil, z-0 stacked above canvas:

```
<div> absolute inset-0 pointer-events-none
  background: linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 45%, transparent 70%)
```

layer 3, grain, z-[3], GrainOverlay fixed, opacity 0.03, 128px fractalNoise tile, pointer-events-none

layer 4, content, z-10, image-as-canvas composition, copy in the left safe area:

```
<div> relative z-10 flex items-center min-h-[100dvh]
  <div> max-w-6xl mx-auto w-full px-6
    <div> max-w-xl flex flex-col items-start gap-6

      <motion.span> FadeIn delay 0
        label style, text-[var(--accent)]
        "track 02 · supply chain blast radius"

      <motion.h1> FadeIn delay 0.1
        display-xl text-[var(--text-primary)]
        line 1: "every dependency"
        <br />
        line 2: "is a door"

      <motion.p> FadeIn delay 0.2
        body-lg text-[var(--text-secondary)] max-w-md
        "aftershock maps your dependency graph in hydradb so a compromised package shows its full blast radius in seconds"

      <motion.div> FadeIn delay 0.3, flex gap-3
        primary cta, <a href="#demo">
          bg-[var(--accent)] text-[#0a0a0a] font-sans text-sm font-medium
          rounded-[4px] px-6 py-3
          hover:bg-[var(--accent-hover)] transition-default
          "run the live demo"
        secondary cta, <a repo link>
          border border-[var(--border-default)] text-[var(--text-primary)]
          rounded-[4px] px-6 py-3
          hover:border-[var(--accent)] hover:text-[var(--accent)] transition-default
          "view on github"
```

hero discipline check, four text elements exactly, eyebrow, headline, sub, cta pair, no scroll cue, no trust strip, no stats

responsive, below md the canvas dims to 40 percent opacity, copy stacks full width, headline drops to 2.5rem via display scale, the ticker moves below the fold content

asset brief:

```
ASSET BRIEF:
  type: coded canvas animation, no media file
  description: force layout of ~1500 nodes from the bundled fixture, positions precomputed in layout.ts, edges faint, infection replay in error red
  motion: seeded pulse then hop-by-hop spread on a 10x clock, 28 second full replay, 4 second hold, seamless loop
  mood: operational, watchtower, calm until the red arrives
  fallback: if webgl or canvas fails, render a static frame div using bg-[var(--bg-primary)] with the dot grid pattern, hero copy unchanged
```

## section 3, demo strip

component, src/components/sections/DemoStrip.tsx, id="demo"

purpose, the judge touches the product, a lockfile in, a blast radius report out, static deployment answers from a precomputed fixture map so the demo works with no server

wrapper:

```
<section> bg-[var(--bg-secondary)] py-[8rem] px-4
  <div> max-w-4xl mx-auto flex flex-col gap-[3rem]
```

header block, FadeIn, no eyebrow, one focused message:

```
<h2> display-lg text-[var(--text-primary)]
  "your lockfile, put on the map"
<p> body text-[var(--text-secondary)] mt-md max-w-lg
  "drop a package-lock.json, the scanner joins every resolved version against the graph and reports what a compromise could reach"
```

dropzone, FadeIn delay 0.1:

```
<div> border border-dashed border-[var(--border-default)] rounded-[8px]
      bg-[var(--bg-surface)] p-[2rem]
      flex flex-col items-center gap-md text-center
      transition-default hover:border-[var(--accent)]
  <UploadCloud> lucide, 20px, text-[var(--text-secondary)]
  <span> body-sm text-[var(--text-secondary)]
    "drop a lockfile or run it on ours"
  <button> ghost button, same classes as nav cta
    "scan the demo lockfile"
```

report output, FadeIn delay 0.2, renders after scan, bento discipline:

```
<div> grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-default)]
      border border-[var(--border-default)] rounded-[8px] overflow-hidden

  cell 1, col-span-2, bg-[var(--bg-surface)] p-6
    label "exposure"
    <div> metric style, red if exposed, success green if clean
      e.g. "14 services"
    body-sm text-[var(--text-secondary)] "reachable from the flagged version"

  cell 2, bg-[var(--bg-surface)] p-6
    label "depth"
    metric text-[var(--text-primary)] "4 hops"

  cell 3, full width spanning the grid, bg-[var(--bg-surface)] p-6
    label "dependency path"
    <code> data text-[var(--text-primary)] leading-7
      root pkg to bad version chain, one hop per line, each hop prefixed by a mono 6px square marker in accent, final hop marker in error red
```

empty state, before any scan the report grid is hidden entirely, no placeholder shell

asset brief, none, live product surface

## section 4, timeline

component, src/components/sections/Timeline.tsx

purpose, the worm story told as timed events, layout family timeline/steps, used exactly here and nowhere else

wrapper, bg-[var(--bg-primary)] py-[8rem] px-4, max-w-3xl mx-auto

header, FadeIn:

```
<span> label text-[var(--accent)] "the problem"   (second and final eyebrow on the page)
<h2> display-lg text-[var(--text-primary)] mt-md
  "six minutes is the new response window"
```

timeline body, each event is a row, FadeIn stagger 0.08:

```
<div> border-l border-[var(--border-default)] pl-6 relative

  per event:
  <div> relative pb-[2rem]
    <span> absolute left-[-25px] top-1.5 w-2 h-2 rounded-[2px] bg-[var(--bg-elevated)] border border-[var(--border-default)]
    first three events use bg-[var(--error)] border-[var(--error)] instead, breach markers
    
    <div> flex items-baseline gap-4
      <span> data text-[var(--accent)] w-16 shrink-0  "09:00"
      <div>
        <p> heading text-[var(--text-primary)] "ci pipeline breached"
        <p> body-sm text-[var(--text-secondary)] mt-xs "the worms first artifacts publish within seconds of the breach"
```

event data, 09:00 ci pipeline breached, 09:02 first 12 artifacts live, 09:04 84 artifacts across 42 packages, 09:06 worm persists inside ide config directories, then the pivot row after the last event, a bordered cell in surface holding the statement "anything you cannot map in those six minutes, you learn about from the news", heading style, edge in error red

## section 5, architecture

component, src/components/sections/Architecture.tsx

recipe, architecture-layers from COMPOSITION_RECIPES.md, used as referenced there, customised to the palette

wrapper, bg-[var(--bg-secondary)] py-[8rem] px-4, max-w-5xl mx-auto

header, FadeIn, no eyebrow:

```
<h2> display-lg text-[var(--text-primary)]
  "from registry to answer in one graph"
```

layer stack, four layers, each a full width cell, stacked with the 1px gap system, stagger FadeIn 0.08:

```
<div> grid grid-cols-1 gap-px bg-[var(--border-default)]
      border border-[var(--border-default)] rounded-[8px] overflow-hidden

  layer cell, grid grid-cols-1 md:grid-cols-[64px_1fr_2fr] items-center
              bg-[var(--bg-surface)] p-6 hover:bg-[var(--bg-elevated)] transition-default
    <span> metric style, text-[var(--text-muted)]  "01"
    <div> heading text-[var(--text-primary)]        "registry snapshot"
    <p>  body-sm text-[var(--text-secondary)]       "curated npm metadata, versions, maintainers, publish times, bundled so the demo runs offline"
```

layers in order, 01 registry snapshot, 02 graph builder, body "streams nodes and edges into hydradb over bolt, idempotent merges, re-runnable", 03 hydradb, body "versioned package graph on object storage, traversals return in milliseconds", 04 the five questions, body "reverse closure, version window, lockfile join, maintainer neighbourhood, typosquat ring", the hydra cell carries a left accent border, border-l-2 border-l-[var(--accent)]

## section 6, questions bento

component, src/components/sections/QuestionsBento.tsx

recipe, asymmetric-bento-grid from COMPOSITION_RECIPES.md, the signature section

wrapper, bg-[var(--bg-primary)] py-[8rem] px-4, max-w-6xl mx-auto

header, FadeIn, no eyebrow:

```
<h2> display-lg text-[var(--text-primary)] max-w-xl
  "the five questions a breach actually asks"
```

grid, named areas via arbitrary grid classes, 12 columns, stagger FadeIn 0.08:

```
<div> grid grid-cols-1 md:grid-cols-12 gap-px bg-[var(--border-default)]
      border border-[var(--border-default)] rounded-[8px] overflow-hidden

  cell a, transitive exposure, md:col-span-7 row-span-2, bg-[var(--bg-surface)] p-[1.5rem] min-h-[360px]
    label "question 01"
    heading "which services are transitively exposed"
    body-sm "a reverse depends_on closure over the versioned graph, depth and elapsed time on every node"
    inset mini canvas, h-[180px] rounded-[4px] border border-[var(--border-subtle)], replays the same spread player at 60 percent scale, loop without pause

  cell b, version window, md:col-span-5, "which version introduced it"
    answer line in data style, "first seen in 1.4.0, publishedAt ordering across the flagged set"

  cell c, lockfiles live in the window, md:col-span-5, "which apps resolved it while it was live"
    answer line, "resolves edges joined against the publish window, path attached"

  cell d, maintainer neighbourhood, md:col-span-4, "what else does this maintainer touch"
    answer line, "one and two hop maintains traversal, shared infrastructure surfaces with it"

  cell e, typosquat ring, md:col-span-8 but row 3 right side, "which names sit close enough to trick you"
    answer line, "similar_name edges from ingest time string distance, ranked"

  cell f, cta cell, md:col-span-4, bg-[var(--bg-elevated)]
    body-sm text-[var(--text-secondary)] "every answer is one query"
    <a> ghost cta "read the queries", links to repo queries.ts
```

the mini canvas inside cell a is the only repeated motion element on the page, everything else animates entrance only

## section 7, metrics band

component, src/components/sections/Metrics.tsx

recipe, metrics-section from COMPOSITION_RECIPES.md, 4 cells, mono numerals, layout family full width band

wrapper, bg-[var(--bg-secondary)] border-y border-[var(--border-default)], py-[4rem] px-4

```
<div> max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-default)]
      border border-[var(--border-default)] rounded-[8px] overflow-hidden

  per metric cell, bg-[var(--bg-surface)] p-6
    <div> metric text-[var(--text-primary)], count-up on viewport entry
    <div> label text-[var(--text-muted)] mt-xs
```

metrics, real measured numbers only, package nodes, graph edges, closure query time in ms, lockfile scan time in ms, the count-up runs once per entry, 600ms, ease [0.16, 1, 0.3, 1], mono tabular via font-feature-settings "tnum"

## section 8, hydra split

component, src/components/sections/HydraSplit.tsx

purpose, the best use of hydradb argument, layout family split text plus terminal, the only split section on the page so the zigzag cap is trivially satisfied

wrapper, bg-[var(--bg-primary)] py-[8rem] px-4, max-w-6xl mx-auto

```
<div> grid grid-cols-1 lg:grid-cols-2 gap-[3rem] items-center

  left, FadeIn
    <h2> display-lg text-[var(--text-primary)]
      "a question similarity search cannot answer"
    <p> body text-[var(--text-secondary)] mt-lg max-w-md
      "reverse dependency closure is a traversal, not an embedding lookup, hydradb holds the versioned graph on object storage so the closure, the window join and the neighbourhood walk all return as paths, that is why the repo carries this project"
    <a> ghost cta mt-xl "hydradb on github"

  right, FadeIn delay 0.15
    terminal frame, border border-[var(--border-default)] rounded-[8px] overflow-hidden
    title bar, bg-[var(--bg-surface)] px-4 py-3 border-b border-[var(--border-subtle)]
      three dots w-2.5 h-2.5 rounded-[2px] in #3a3a3a #4a4a4a #5a5a5a
      title mono data text-[var(--text-muted)] "bolt — hydradb"
    body, bg-[var(--bg-elevated)] p-6 data leading-7
      line 1, muted prompt span "bolt> " then query line, the reverse closure cypher, error-red only on the flagged package name literal within the query string if styled, otherwise accent on the keyword MATCH
      line 2, muted "..." trimmed result rows in text-primary
      line 3, accent "784 nodes in 41 ms"
```

all terminal text static, no typewriter, a paused video frame must read complete

## section 9, final cta

component, src/components/sections/FinalCta.tsx

recipe, full-width-statement from COMPOSITION_RECIPES.md

wrapper, bg-[var(--bg-secondary)] py-[8rem] px-4 text-center

```
<div> max-w-3xl mx-auto flex flex-col items-center gap-[2rem]
  <h2> FadeIn, display-lg md:display-xl text-[var(--text-primary)]
    "map yours before the next one"
  command block, FadeIn delay 0.1
    .surface block, bg-[var(--bg-surface)] border border-[var(--border-default)]
    rounded-[8px] px-5 py-3.5 flex items-center justify-between gap-4 min-w-[320px]
    <code> data text-[var(--text-primary)]
      "git clone <repo> && cd aftershock && ./scripts/demo.sh"
    copy button, lucide Copy 16px text-[var(--text-secondary)]
      hover:text-[var(--accent)] transition-fast, swaps to Check for 1500ms
```

## section 10, footer

component, src/components/sections/Footer.tsx

```
<footer> bg-[var(--bg-primary)] border-t border-[var(--border-default)] py-[4rem] px-4
  <div> max-w-6xl mx-auto flex flex-col items-center gap-lg

  row 1, wordmark, font-display text-xl text-[var(--text-primary)] "aftershock"
    {/* logo slot, replace when an asset exists */}

  row 2, links, flex gap-md
    <a> body-sm font-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-fast "view on github"
    <span> text-[var(--text-muted)] "·"
    <a> same style "built on hydradb"
    <span> "·"
    <a> same style "hack hydra"

  row 3, label text-[var(--text-muted)] "august 2026 · track 02 · mit"
```

## responsive map

| element | mobile | desktop |
|---|---|---|
| hero copy | full width stack, canvas 40 percent | left safe area, max-w-xl |
| demo report grid | 1 column | 3 cells as specified |
| architecture layer | single column stack | 64px index, title, body |
| questions bento | 1 column, canvas cell first | 12 column named areas |
| metrics | 2 columns | 4 columns |
| hydra split | prose then terminal | two columns |
| nav full bar | wordmark and cta only | identical, no links exist |

## asset checklist

| asset | location | status |
|---|---|---|
| attack map layout data | src/canvas/layout.ts | generated at build from fixture, agent produces |
| demo fixture answers | src/data/demo-fixtures.ts | agent produces from the snapshot |
| logo svg | public/logo.svg | comment slot until the user provides |
| favicon | public/favicon.ico | comment slot until the user provides |
| repo url | nav, footer, cta links | update once the repo exists |

## banned patterns

the following never appear in this codebase, jetbrains mono, localstorage or sessionstorage, onmouseenter styling logic, hardcoded hex outside globals.css and the single canvas reader, console.log, lorem or placeholder copy, round vanity numbers, gradient text on headings, outer neon glows except the accent glow token inside defined hover states, custom cursors, form elements, spinner loaders, zigzag image text section pairs, a second eyebrow beyond the two declared, any use of error red outside the attack state, ai-generated icon symbols or emoji as visual accents

## spec self-check

- every element carries exact tailwind classes, verified section by section
- every animation states initial, animate, duration, ease and delay
- every section declares its z-index placement and page wide map exists above
- sections needing media hold asset briefs, the only media-like asset is the coded canvas which holds one
- positional classes carry responsive variants where the layout changes
- recipes referenced by name, architecture-layers, asymmetric-bento-grid, metrics-section, full-width-statement, hero adapted from the cinematic video hero golden reference
- a junior developer could build from this file without a design question

# aftershock — narration script

## how the agent uses this file

this is the voiceover source of truth, one block per scene from VIDEO_PIPELINE.md, every block was written to read 2 to 4 seconds shorter than its scene so the picture leads and silence frames each cut, the sync cues are intent, the agent verifies them against the real footage during pipeline step 2 and adjusts placement to what is actually on screen

synthesise each block with groq orpheus v1 english, `canopylabs/orpheus-v1-english`, using the project groq key only, requests stay under 200 characters per call so blocks marked as two chunks are produced as two wavs and joined with ffmpeg concat before duration measurement, cache every wav in video/voice/ and never regenerate a chunk that already exists on disk, tier limits are 10 requests per minute and 100 requests per day so this whole video costs about a dozen requests

after synthesis run the fit step from VIDEO_PIPELINE.md step 5 with the true durations, if a block runs long, trim the line here in this file first and regenerate only that chunk, never push audio past 3 percent speed

## scene 1, the problem, target 15s

```
supply chain attacks stopped being a nuisance and became a worm problem

[chunk]

one breached pipeline pushed eighty four artifacts across forty two packages in six minutes, and the only question that matters is what it can reach
```

sync cue, the numbers land as the second headline card appears, the final clause lands on the cut

## scene 2, the hero, target 12s

```
this is aftershock, the npm registry modelled as a graph inside hydradb, every package, every version, every maintainer, and what you are watching is a compromise replaying through it
```

sync cue, the word replaying lands as the first red pulse fires on the canvas

## scene 3, cli build, target 15s

```
the graph builder streams the snapshot straight into hydradb over bolt, idempotent merges, so a rerun always lands on the same graph
```

sync cue, the counter in the terminal keeps climbing while the line plays, cut on the final word

## scene 4, patient zero, target 25s

```
flag one package as patient zero and the reverse dependency closure walks outward hop by hop, depth and a spread clock on every node

[chunk]

what took the worm six minutes on the live registry takes seconds to map here, and every lit node is a service an attacker could touch
```

sync cue, hop by hop lands as the first ring lights up, the second chunk starts as the spread crosses mid graph

## scene 5, lockfile scan, target 20s

```
then it gets personal, drop in any package lock and aftershock joins every resolved version against the graph

[chunk]

this scan finds exposure four hops deep, with the exact path from the root dependency to the flagged version
```

sync cue, the word personal lands at the drop animation, the path line lands as the path prints

## scene 6, the five questions, target 20s

```
the five questions a breach actually asks, each one a single traversal, transitively exposed services, the version that introduced it, lockfiles resolved while it was live, what else this maintainer touches

[chunk]

and the names sitting close enough to trick you
```

sync cue, slow scroll, each question lands as its cell crosses viewport centre, replay rule from the spec means cells animate again on the way back

## scene 7, the hydra proof, target 25s

```
here is the point of the graph, that same closure as one cypher query over bolt, seven hundred and eighty four nodes back in forty one milliseconds

[chunk]

hydradb holds the versioned graph on object storage, so the traversal is the product, not a preprocessing step
```

sync cue, the latency number lands exactly as the result returns in the bolt console, note for the agent, the spoken numbers must match the real measured numbers from the clean machine run, if the build differs, edit this line and the spec metrics together, never overdub a claim

## scene 8, the contrast, target 15s

```
try asking that of a similarity search and it fails quietly, exposure is a path through dependencies, and paths are graphs
```

sync cue, the empty result card fades in on fails quietly, hold one beat of silence before the cut

## scene 9, the card, target 10s

```
aftershock is open source, clone it, run the demo script, map yours before the next one
```

sync cue, the clone command is fully on screen before the voice starts the second clause

## production totals

about 250 spoken words, roughly 105 seconds of voice across a 157 second picture, the remaining time is deliberate silence, scene transitions, the worm ticker and the hydra result moment, if the conformed cut runs long, protect scenes 7 and 8 and shorten scene 3 first

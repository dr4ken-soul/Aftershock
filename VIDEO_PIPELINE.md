# aftershock — video pipeline

## purpose

this file is the contract between you and the coding agent for producing the demo video, follow it exactly, the rule that matters most is that the voiceover is fitted to the picture, never slammed on top of it

## what the video must cover, from the hackathon site

1. the problem you are trying to solve
2. what you actually built
3. a demo of the project working
4. how you used the hydradb repo and why it matters

hard limits, three minutes maximum, anything past the mark may not be reviewed, judges must be able to watch without asking for access, so youtube unlisted or a direct file link both work

## capture plan

recording happens first, the user records in cap unless the agent is doing the recording itself

if the user records, the raw file lands in the project storage under `video/raw/`, the agent watches for it there

capture settings, 1920x1080, 60fps where the machine allows, system theme dark, cursor halo enabled in cap so attention tracks without narration, hide desktop notifications, close every tab and window not in the shot, one take per scene is fine because scenes are cut independently

the nine scenes to record, in order

| scene | content | target seconds |
|---|---|---|
| 1 | the problem, a real advisory headline for a compromised package, then a human trying to trace dependents by hand in npm pages | 15 |
| 2 | the hero, aftershock page loads, attack map replay spreading red through the canvas | 12 |
| 3 | cli build, `aftershock build`, counter climbing to the full fixture count | 15 |
| 4 | patient zero, `aftershock simulate` on a known package, the map lights up with the timestamp ticker | 25 |
| 5 | lockfile scan, the demo lockfile drops in, exposure report with the dependency path prints | 20 |
| 6 | the five questions bento, slow scroll, pause 2s per cell | 20 |
| 7 | hydra proof, bolt console running the reverse closure query live against hydradb, result returns in milliseconds | 25 |
| 8 | the same question failing as a naive table scan or similarity lookup, shown side by side | 15 |
| 9 | card with repo link and the two commands | 10 |

total 157 seconds which leaves a 23 second buffer under the cap, scenes 7 and 8 are the hydra beat and they must be unmistakable

## assembly plan, agent side

step 1, locate and watch, the user will point you at the recording, either the default drop at `video/raw/` or whatever path they give you, before touching anything you must watch the footage end to end, probe it with ffprobe for duration, resolution and audio, and write down what is actually on screen at each moment, your notes from this watch, not assumptions, drive every later decision

step 2, analyse and map, split the take at real cuts using scene score analysis, then watch each segment and label it against the nine-scene plan above, if a scene is missing, reordered or runs long, record that, the script sync cues in NARRATION_SCRIPT.md describe intent, the footage in front of you is the truth, where they disagree, adjust the voiceover placement and padding to fit the footage, and only edit script lines when a scene genuinely cannot carry them

step 3, script, read the narration from NARRATION_SCRIPT.md in the project root, it is the source of truth with one approved block per scene already timed 2 to 4 seconds short of each scene, do not rewrite blocks, changes go through the script file first so the words, the spec numbers and the form answers never drift apart, silence at the head and tail of a scene is deliberate and what makes the result feel fitted

step 4, voice, synthesise each block with groq orpheus v1 english through the shared groq key, chunks stay under 200 characters per request because of the tier limits, 10 requests per minute and 100 per day, so batch sensibly and cache every wav to disk, regenerate nothing twice, measure each produced wav with ffprobe and record its true duration

step 5, fit, this is the step that stops the slam, for each scene compare wav duration against scene duration, if audio is longer than the scene minus one second, first tighten the script line, never speed audio beyond 3 percent, if audio is shorter, pad the scene with a hold on the final frame up to 20 percent of scene length and only then consider re-cutting, the picture leads, the voice follows, and scene transitions land on sentence ends, not mid sentence

step 6, mix, lay narration over the recording placed where your footage analysis says each block belongs, with the padding and hold rules from the fit step applied so every sentence lands on its visual, any original mic audio from cap is dropped unless the user kept useful clicks and keys, ambient level at minus 28 db under narration, loudness normalise the whole track with the loudnorm filter to minus 16 lufs

step 7, captions optional, if captions are wanted, transcribe the final narration wav with groq whisper turbo to get an aligned srt, burn it in with the subtitles filter at 4 percent bottom margin, captions off by default because clean picture wins with this audience

step 8, conform and export, trim to under 180 seconds exactly, export `video/dist/aftershock-demo.mp4`, h264 high profile, aac 160k, then verify by watching the whole file start to finish with a timer in hand, verify again in a private browser window after upload

## reference commands

```bash
# probe
ffprobe -v quiet -show_format -show_streams raw.mov

# split at real cuts
ffmpeg -i raw.mov -vf "select='gt(scene,0.35)',showinfo" -f null - 2> cuts.txt

# scene to intermediate
ffmpeg -i in.mov -vf scale=1920:1080 -c:v libx264 -crf 18 -preset slow -an out.mp4

# hold a final frame for 2 seconds
ffmpeg -i scene.mp4 -vf "tpad=stop_mode=clone:stop_duration=2" -c:a copy padded.mp4

# mux fitted voiceover
ffmpeg -i scene.mp4 -i voice.wav -c:v copy -c:a aac -shortest scene_voiced.mp4

# loudness normalise final
ffmpeg -i concat.mp4 -af "loudnorm=I=-16:LRA=11:TP=-1.5" -c:v copy -c:a aac final.mp4
```

## failure rules

- if a render fails, fix the shortest scene first, never trim the hydra proof scene to save time, scenes 7 and 8 are the award scene
- if tts quota runs out at 100 requests, stop, keep finished scenes, and finish the rest the next day rather than switching voice mid-video
- if the recording is unusable, the fallback is a scripted capture driven by playwright against the local build, same scenes, same timings, same pipeline from step 2 onward
- the finished video never claims anything the repo cannot do, if a scene needs a feature that does not exist yet, the feature gets built or the scene gets cut

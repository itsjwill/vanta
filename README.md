# PRISM STUDIO

### The AI-Powered Programmatic Video Engine

> Remotion + Voice Cloning + AI Avatars + Auto-Captions + Generative Effects + AI Music.
> All open source. All in one engine.

[![Join The Agentic Advantage](https://img.shields.io/badge/JOIN_THE_AGENTIC_ADVANTAGE-000000?style=for-the-badge&logoColor=white)](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Built with Remotion](https://img.shields.io/badge/Built_with-Remotion-6366f1?style=for-the-badge)](https://remotion.dev)

---

**Prism Studio** combines 40+ open-source repositories into a single video creation engine that replaces Synthesia ($30/video), Runway ML ($12/mo), Descript ($24/mo), and HeyGen ($48/mo) — for $0.

Type a script. Get a fully produced video with AI voice, AI presenter, auto-captions, custom soundtrack, and cinematic effects. In minutes, not hours.

---

## What's Inside

| Capability | Powered By | Stars |
|---|---|---|
| **Programmatic Video** | [Remotion](https://github.com/remotion-dev/remotion) | 35,600+ |
| **Voice Cloning** | [GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS) | 54,800+ |
| **Instant Voice Transfer** | [OpenVoice](https://github.com/myshell-ai/OpenVoice) | 35,900+ |
| **AI Talking Head** | [SadTalker](https://github.com/OpenTalker/SadTalker) | 7,200+ |
| **Lip Sync** | [Wav2Lip](https://github.com/Rudrabha/Wav2Lip) | Top-cited |
| **Video Re-dubbing** | [VideoReTalking](https://github.com/OpenTalker/video-retalking) | 7,200+ |
| **Expression Control** | [V-Express](https://github.com/tencent-ailab/V-Express) | 2,300+ |
| **Text-to-Video** | [Open-Sora](https://github.com/hpcaitech/Open-Sora) | Active |
| **Animate Images** | [AnimateDiff](https://github.com/guoyww/AnimateDiff) | Official |
| **Background Removal** | [background-removal-js](https://github.com/imgly/background-removal-js) | 6,900+ |
| **Auto-Captions** | [transcribee](https://github.com/bugbakery/transcribee) + Whisper | 470+ |
| **Audio Waveforms** | [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | 10,000+ |
| **AI Music** | [ace-step-ui](https://github.com/fspecii/ace-step-ui) | 470+ |
| **Particle Effects** | [tsparticles](https://github.com/tsparticles/tsparticles) | 8,600+ |
| **FFmpeg in Browser** | [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) | 17,100+ |
| **Visual Editor** | [react-video-editor](https://github.com/designcombo/react-video-editor) | 1,300+ |
| **Face Swap** | [roop](https://github.com/s0md3v/roop) | 19,000+ |
| **Data Viz** | [D3.js](https://d3js.org/) | 108,000+ |
| **Auto-Edit** | [auto-editor](https://github.com/WyattBlue/auto-editor) | Active |
| **All-in-One Audio** | [AudioGPT](https://github.com/AIGC-Audio/AudioGPT) | 10,200+ |

**Combined: 250,000+ GitHub stars** worth of capability. One engine.

---

## The Pipeline

```
Script Input
    |
    v
GPT-SoVITS -----> AI Voiceover (cloned voice, 60s sample)
    |
    v
SadTalker -------> AI Presenter (single photo → talking head)
    |
    v
Open-Sora -------> AI B-Roll (text → video clips)
    |
    v
AnimateDiff -----> Animate Stills (logos, charts, images)
    |
    v
bg-removal-js ---> Composite (layer subjects over new backgrounds)
    |
    v
tsparticles -----> Effects (particles, confetti, fireworks)
    |
    v
ace-step-ui -----> AI Soundtrack (custom music from text prompt)
    |
    v
auto-editor -----> Smart Cuts (remove silence, dead frames)
    |
    v
transcribee -----> Auto-Captions (Whisper word-level timestamps)
    |
    v
Remotion --------> Final Render (React components → MP4)
    |
    v
Polished video in 5 minutes. Cost: $0.
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/itsjwill/prism-studio.git
cd prism-studio

# Install
npm install

# Open Remotion Studio (preview in browser)
npm start

# Render the showcase video
npm run build
# Output: out/prism-showcase.mp4
```

---

## Sample Compositions

### PrismShowcase (15 seconds, 1080p)

The hero video. Five scenes demonstrating core capabilities:

| Time | Scene | What It Shows |
|---|---|---|
| 0-3s | Logo Reveal | Animated prism logo with particle field |
| 3-6s | Kinetic Text | Spring-animated letter-by-letter typography |
| 6-9s | Data Viz | Animated bar chart with counter labels |
| 9-12s | Waveform | 64-bar audio-reactive visualization |
| 12-15s | Feature Cards | 6 capability cards with staggered entrance |

### Individual Scenes

```bash
# Render just the particles
npx remotion render src/index.ts Particles out/particles.mp4

# Render kinetic text
npx remotion render src/index.ts KineticText out/kinetic.mp4

# Render data viz
npx remotion render src/index.ts DataViz out/dataviz.mp4

# Render waveform
npx remotion render src/index.ts Waveform out/waveform.mp4
```

---

## Integration Guides

Each integration has its own file in `src/integrations/` with setup instructions and usage examples.

### Voice Cloning (GPT-SoVITS)

```typescript
import { cloneVoice } from "./integrations/voice-clone";

const voice = await cloneVoice({
  serverUrl: "http://localhost:9880",
  sampleAudioPath: "./my-voice-sample.wav",
});

const audioUrl = await voice.speak("Welcome to Prism Studio");
// Use in Remotion: <Audio src={audioUrl} />
```

### AI Avatar (SadTalker)

```typescript
import { createAvatar } from "./integrations/ai-avatar";

const avatar = await createAvatar({
  serverUrl: "http://localhost:8080",
  imagePath: "./headshot.jpg",
});

const videoUrl = await avatar.speak("./voiceover.wav");
// Use in Remotion: <OffthreadVideo src={videoUrl} />
```

### Auto-Captions (Whisper)

```typescript
import { transcribe } from "./integrations/auto-captions";

const captions = await transcribe("./audio.wav", { model: "large" });
// Returns word-level timestamps for animated captions
// [{ word: "Hello", start: 0.0, end: 0.5, confidence: 0.98 }]
```

### AI Video Generation (Open-Sora)

```typescript
import { generateVideo } from "./integrations/ai-video";

const clip = await generateVideo("A sunset over the ocean, cinematic 4K", {
  serverUrl: "http://localhost:7860",
});
// Use in Remotion: <OffthreadVideo src={clip.url} />
```

### AI Music (ACE-Step)

```typescript
import { generateMusic } from "./integrations/ai-music";

const track = await generateMusic("upbeat corporate tech background", {
  serverUrl: "http://localhost:8000",
});
// Use in Remotion: <Audio src={track.url} />
```

---

## Killer Combos

### 1. Synthesia Killer — AI Presenter Videos

```
Voice Cloning + AI Avatar + Lip Sync + Remotion
= Unlimited presenter videos from one photo + 60s of voice
= Replaces Synthesia ($30/video) with $0
```

### 2. Multilingual Video Factory

```
OpenVoice (50+ languages) + VideoReTalking + Auto-Captions
= Create once, auto-generate localized versions in 50 languages
= Perfect lip sync + subtitles, no reshooting
```

### 3. Data Storytelling Engine

```
D3.js + Airtable/CSV data + Voice Clone + Particles
= Feed a spreadsheet → get a narrated video with animated charts
= Automated reporting as video
```

### 4. Full AI Studio (No-Code Mode)

```
react-video-editor (visual UI) + Open-Sora (AI B-roll)
+ ace-step-ui (AI music) + auto-editor (smart cuts)
= Type a script → AI generates everything → drag-and-drop polish
```

---

## Project Structure

```
prism-studio/
├── src/
│   ├── index.ts                    # Remotion entry point
│   ├── Root.tsx                    # Composition registry
│   ├── components/
│   │   ├── PrismLogo.tsx           # Animated prism logo
│   │   ├── FeatureCards.tsx        # Capability showcase cards
│   │   └── GradientBackground.tsx  # Animated gradient + grid
│   ├── scenes/
│   │   ├── PrismShowcase.tsx       # Main hero video (15s)
│   │   ├── ParticleScene.tsx       # 120-particle network field
│   │   ├── KineticText.tsx         # Spring-animated typography
│   │   ├── DataVizScene.tsx        # Animated bar chart
│   │   └── WaveformScene.tsx       # Audio-reactive bars
│   └── integrations/
│       ├── voice-clone.ts          # GPT-SoVITS / OpenVoice
│       ├── ai-avatar.ts           # SadTalker / Wav2Lip
│       ├── auto-captions.ts       # Whisper transcription
│       ├── ai-video.ts            # Open-Sora / AnimateDiff
│       ├── ai-music.ts            # ACE-Step / AudioGPT
│       └── background-removal.ts  # Client-side bg removal
├── public/                         # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

## Why Prism vs Everything Else

| Feature | Remotion (alone) | Synthesia | Runway ML | **Prism Studio** |
|---|---|---|---|---|
| Programmatic video | Yes | No | No | **Yes** |
| Voice cloning | No | $30/vid | No | **Yes (free)** |
| AI avatars | No | Yes ($) | No | **Yes (free)** |
| AI video gen | No | No | Yes ($) | **Yes (free)** |
| Auto-captions | Basic | Yes | No | **Yes (free)** |
| AI music | No | No | No | **Yes (free)** |
| Visual editor | No | Limited | Yes | **Yes (free)** |
| Particle FX | Basic | No | No | **Yes** |
| Data → Video | Manual | No | No | **Yes** |
| Background removal | No | No | Yes ($) | **Yes (free)** |
| Open source | Yes | No | No | **Yes** |
| Cost | Free* | $30+/vid | $12/mo | **$0** |

*Remotion requires a company license for business use.

---

## Roadmap

- [ ] Docker Compose for one-command setup of all AI services
- [ ] Web UI for non-coders (drag-and-drop + Remotion backend)
- [ ] Template marketplace (wedding, corporate, social media)
- [ ] Real-time preview with live voice + lip sync
- [ ] WebGPU-accelerated effects pipeline
- [ ] Batch rendering API (100 videos from CSV)
- [ ] Plugin system for community integrations

---

## Want to Go Deeper?

> Building with AI video, agents, and automation is where the money is heading.
> Reading repos is step one. **Shipping products** is where it counts.

**[The Agentic Advantage](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)** is where serious builders:

- Ship AI products weekly (not just read about them)
- Get implementation help from people who are actually building
- Access exclusive templates, workflows, and blueprints
- Turn tools like Prism Studio into revenue

This isn't a newsletter. It's a build lab.

[![Join The Agentic Advantage](https://img.shields.io/badge/JOIN_THE_AGENTIC_ADVANTAGE-000000?style=for-the-badge&logoColor=white)](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)

---

## Contributing

PRs welcome. The goal is to make every integration production-ready.

Priority areas:
1. Docker Compose setup for AI services
2. More Remotion scene templates
3. Integration tests
4. Documentation for each AI service setup

---

## License

MIT. Use it for anything. Build a SaaS on it. Sell videos made with it. Go wild.

---

**Built by [@itsjwill](https://github.com/itsjwill)** | Powered by [Remotion](https://remotion.dev) + 40 open-source projects

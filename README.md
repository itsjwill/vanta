# VANTA

### Open Source Video Engine

> 40+ open source repositories. One render pipeline. $0.

[![Join The Agentic Advantage](https://img.shields.io/badge/THE_AGENTIC_ADVANTAGE-000000?style=for-the-badge&logoColor=white)](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Built with Remotion](https://img.shields.io/badge/Remotion-6366f1?style=for-the-badge)](https://remotion.dev)

---

Vanta is a programmatic video engine built on [Remotion](https://github.com/remotion-dev/remotion) that integrates voice cloning, AI avatars, auto-captions, generative video, AI music, particle effects, background removal, and a visual editor into a single pipeline.

Every integration runs locally. No API keys, no subscriptions, no per-video charges. You own the entire stack.

---

## Quick Start

```bash
git clone https://github.com/itsjwill/vanta.git
cd vanta
npm install
npm start          # Opens Remotion Studio in browser
npm run render     # Renders showcase → out/vanta-showcase.mp4
```

---

## The Integrations

Each integration below has a working TypeScript module in `src/integrations/` and connects to Remotion's render pipeline through standard React components.

---

### Voice Cloning — GPT-SoVITS & OpenVoice

**What it does:** Give it 60 seconds of anyone's voice. It creates a clone that can say anything you type, in real-time, in any language.

**How it works:** GPT-SoVITS (54K+ stars) uses a two-stage pipeline. First, it extracts speaker embeddings from your audio sample — pitch contour, timbre, speaking rhythm, breathing patterns. Then it feeds your text through a VITS (Variational Inference Text-to-Speech) model conditioned on those embeddings. The result is natural speech that sounds like the original speaker, not a robotic TTS voice.

OpenVoice (35K+ stars) takes a different approach with instant voice transfer. Instead of training on a sample, it decouples style (tone, emotion, accent) from content, letting you transfer voice characteristics in a single forward pass. This means zero training time — upload a sample, get a clone instantly.

**How it connects to Vanta:** The `voice-clone.ts` integration runs a local GPT-SoVITS or OpenVoice server. You call `cloneVoice()` with a WAV sample, then `voice.speak("your text")` returns an audio URL. Drop that URL into Remotion's `<Audio>` component and your video has a cloned voiceover.

```typescript
import { cloneVoice } from "./integrations/voice-clone";

const voice = await cloneVoice({
  serverUrl: "http://localhost:9880",
  sampleAudioPath: "./my-voice.wav",
});
const audioUrl = await voice.speak("Welcome to the future of video.");
// <Audio src={audioUrl} /> in your Remotion composition
```

**What it replaces:** ElevenLabs ($5/mo for 30 min), PlayHT ($31.20/mo), Murf ($26/mo)

**Repos:**
- [GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS) — 54,800+ stars
- [OpenVoice](https://github.com/myshell-ai/OpenVoice) — 35,900+ stars

---

### AI Avatars — SadTalker, Wav2Lip, V-Express

**What it does:** One headshot photo becomes a talking presenter. Upload a photo, feed it audio, and get a video of that person speaking with natural head movements and perfect lip sync.

**How it works:** SadTalker (7K+ stars) generates 3D motion coefficients from audio, then applies them to a still image using a face renderer. It predicts head pose (yaw, pitch, roll) and expression coefficients (blink, eyebrow, jaw) from the audio waveform, so the talking head looks natural — not like a static image with moving lips.

Wav2Lip focuses specifically on lip sync accuracy. It uses a pre-trained discriminator that can tell if audio and lip movements match, then trains a generator to produce frames where the lips perfectly match the audio. This means you can take any existing video and re-dub it with new audio and the lips will match.

V-Express (2.3K+ stars) adds expression control on top of this. You can specify emotions (happy, serious, excited) and the avatar will express them while speaking. Useful for creating presenters with personality, not just talking heads.

**How it connects to Vanta:** The `ai-avatar.ts` integration sends your headshot and audio to a local SadTalker or Wav2Lip server. It returns a video URL that you use with Remotion's `<OffthreadVideo>` component. The avatar video composites directly into your scene layout.

```typescript
import { createAvatar } from "./integrations/ai-avatar";

const avatar = await createAvatar({
  serverUrl: "http://localhost:8080",
  imagePath: "./headshot.jpg",
});
const videoUrl = await avatar.speak("./voiceover.wav");
// <OffthreadVideo src={videoUrl} /> in your composition
```

**What it replaces:** Synthesia ($22/mo, $30/video for custom avatars), HeyGen ($48/mo), D-ID ($5.90/min)

**Repos:**
- [SadTalker](https://github.com/OpenTalker/SadTalker) — 7,200+ stars
- [Wav2Lip](https://github.com/Rudrabha/Wav2Lip) — Top-cited lip sync paper
- [VideoReTalking](https://github.com/OpenTalker/video-retalking) — 7,200+ stars
- [V-Express](https://github.com/tencent-ailab/V-Express) — 2,300+ stars

---

### Auto-Captions — Whisper + Remotion

**What it does:** Drop in any audio file. Get word-level timestamps with timing accurate to the millisecond. Render them as animated captions in your video — TikTok-style word highlights, karaoke scrolls, whatever you want.

**How it works:** OpenAI's Whisper model runs locally through transcribee (an open-source transcription platform). Whisper uses an encoder-decoder transformer trained on 680K hours of multilingual audio. The key feature for video work is word-level timestamps — not just "this sentence starts at 2.3s" but "the word 'future' starts at 2.31s and ends at 2.58s." This precision is what makes animated captions possible.

The transcription feeds into Remotion's rendering system where each word becomes a React component positioned in the timeline. You can style them however you want — scale, color, position, animation — because they're just React elements with frame-accurate timing.

**How it connects to Vanta:** The `auto-captions.ts` integration sends audio to a local Whisper server and returns an array of `CaptionWord` objects with `start`, `end`, and `confidence` values. Map over these in a Remotion `<Sequence>` and you have animated captions.

```typescript
import { transcribe } from "./integrations/auto-captions";

const captions = await transcribe("./audio.wav", { model: "large" });
// Returns: [{ word: "Hello", start: 0.0, end: 0.5, confidence: 0.98 }, ...]
// Map over these in a Remotion Sequence for animated captions
```

**What it replaces:** Descript ($24/mo), Rev.ai ($0.02/min), manual SRT editing

**Repos:**
- [transcribee](https://github.com/bugbakery/transcribee) — Open-source transcription
- [Whisper](https://github.com/openai/whisper) — OpenAI speech recognition
- [@remotion/captions](https://www.remotion.dev/docs/captions) — Official Remotion captions

---

### AI Video Generation — Open-Sora & AnimateDiff

**What it does:** Type a text prompt. Get a video clip. "Aerial shot of a city at sunset, cinematic lighting" becomes actual footage you can use as B-roll in your production.

**How it works:** Open-Sora replicates the architecture behind OpenAI's Sora using a Diffusion Transformer (DiT). It operates in a compressed latent space — video frames are encoded into latents, noise is added, then a transformer iteratively denoises them conditioned on your text prompt. The spatial-temporal attention mechanism ensures consistency between frames so you get smooth motion, not flickering images.

AnimateDiff takes a different approach. Instead of generating from scratch, it takes a still image and adds motion to it. It inserts motion modules into a Stable Diffusion pipeline, so you can animate logos, product shots, or any static image with controllable motion (pan, zoom, rotation, organic movement).

**How it connects to Vanta:** The `ai-video.ts` integration talks to a local Open-Sora or AnimateDiff server. `generateVideo()` takes a text prompt and returns a clip URL. `animateImage()` takes a still image and motion description and returns an animated version. Both feed directly into Remotion's `<OffthreadVideo>`.

```typescript
import { generateVideo, animateImage } from "./integrations/ai-video";

// Generate B-roll from text
const clip = await generateVideo("A sunset over the ocean, cinematic 4K", {
  serverUrl: "http://localhost:7860",
});

// Animate a still image
const animated = await animateImage("./product.png", "slow zoom with particles", {
  serverUrl: "http://localhost:7860",
});
```

**What it replaces:** Runway ML ($12/mo), Pika Labs ($8/mo), stock footage libraries ($15-$300/clip)

**Repos:**
- [Open-Sora](https://github.com/hpcaitech/Open-Sora) — Open-source Sora
- [AnimateDiff](https://github.com/guoyww/AnimateDiff) — Animate still images
- [Allegro](https://github.com/rhymes-ai/Allegro) — 6-second video generation

---

### AI Music — ACE-Step

**What it does:** Describe the music you want. "Upbeat lo-fi hip hop with soft piano and vinyl crackle, 90 BPM." Get a fully produced track, royalty-free, unlimited generations.

**How it works:** ACE-Step is a local Suno alternative. It uses a music generation model that understands genre, tempo, mood, and instrumentation from text descriptions. Unlike Suno or Udio which run in the cloud and charge per generation, ACE-Step runs on your GPU. A single RTX 3090 generates a 30-second track in under a minute.

AudioGPT (10K+ stars) is the broader audio AI framework that handles not just music generation but sound effects, audio editing, speech enhancement, and audio understanding. It connects multiple audio AI models through a unified interface.

**How it connects to Vanta:** The `ai-music.ts` integration sends a text prompt to a local ACE-Step server and returns a track URL with BPM metadata. Drop it into Remotion's `<Audio>` component for a custom soundtrack on every video.

```typescript
import { generateMusic } from "./integrations/ai-music";

const track = await generateMusic("cinematic orchestral tension building", {
  serverUrl: "http://localhost:8000",
});
// <Audio src={track.url} /> — custom soundtrack for your video
```

**What it replaces:** Suno ($8/mo), Udio ($10/mo), Epidemic Sound ($15/mo), stock music ($15-$50/track)

**Repos:**
- [ace-step-ui](https://github.com/fspecii/ace-step-ui) — Local Suno alternative
- [AudioGPT](https://github.com/AIGC-Audio/AudioGPT) — 10,200+ stars

---

### Background Removal — imgly

**What it does:** Remove backgrounds from photos and video frames in the browser. No server, no API calls, no upload. Runs entirely client-side using WebAssembly.

**How it works:** imgly's background-removal-js (6.9K+ stars) uses a U2-Net segmentation model compiled to ONNX and executed via ONNX Runtime Web. The model identifies foreground subjects (people, objects) at the pixel level and produces an alpha matte. Because it runs in WebAssembly, there's no server round-trip — a 1080p image processes in about 2 seconds on a modern browser.

This is the same technology powering the background removal in apps like Canva and Remove.bg, except it's running locally in your pipeline with no usage limits.

**How it connects to Vanta:** The `background-removal.ts` integration wraps imgly's library. Call `removeBackground()` with an image and get back a transparent PNG as an object URL. Use it as an `<Img>` source in Remotion to composite subjects over any background — generated scenes, gradients, video footage.

```typescript
import { removeBackground } from "./integrations/background-removal";

const result = await removeBackground("./presenter-photo.jpg");
// result.url is a transparent PNG — composite over any background
// <Img src={result.url} /> layered over your Remotion scene
```

**What it replaces:** Remove.bg ($0.20/image), Canva Pro background remover, manual Photoshop masking

**Repos:**
- [background-removal-js](https://github.com/imgly/background-removal-js) — 6,900+ stars, client-side

---

### Visual Editor — react-video-editor

**What it does:** A drag-and-drop CapCut-style video editor built on Remotion. Non-coders can edit timelines, add clips, trim, and arrange scenes visually. Developers can extend it with custom components.

**How it works:** react-video-editor (1.3K+ stars) provides a timeline UI, property panels, and a preview player — all running on top of Remotion's rendering engine. The editor outputs the same Remotion composition format that the rest of Vanta uses, so anything created in the visual editor can be rendered programmatically, customized with code, or batch-processed.

This is the bridge between "code-first" and "no-code" video creation. Developers build templates and integrations in code. Clients and non-technical users edit them in the visual editor.

**Repos:**
- [react-video-editor](https://github.com/designcombo/react-video-editor) — 1,300+ stars

---

### Particle Effects — tsparticles

**What it does:** Adds particle systems to video scenes — confetti, fireworks, snow, floating orbs, constellation networks, smoke, custom shapes. GPU-accelerated, runs at 60fps.

**How it works:** tsparticles (8.6K+ stars) is a JavaScript particle engine that renders via Canvas or WebGL. It supports attractors, collision detection, custom shapes, image particles, and trail effects. In Vanta, particles render as React components inside Remotion compositions, so they're frame-accurate and deterministic — the same render always produces the same output.

**Repos:**
- [tsparticles](https://github.com/tsparticles/tsparticles) — 8,600+ stars

---

### Audio Visualization — wavesurfer.js

**What it does:** Takes any audio file and produces real-time waveform and spectrogram visualizations. Beat-synced bars, frequency analysis, audio-reactive motion.

**How it works:** wavesurfer.js (10K+ stars) uses the Web Audio API to decode audio and extract amplitude, frequency, and time-domain data. In Vanta, this data drives visual elements in Remotion scenes — bar heights, particle velocities, color shifts, text reveals — all synced to the audio.

**Repos:**
- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) — 10,000+ stars

---

### Additional Integrations

| Integration | Repo | Stars | Use Case |
|---|---|---|---|
| **FFmpeg in Browser** | [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) | 17,100+ | Client-side video processing, transcoding, format conversion |
| **Face Swap** | [roop](https://github.com/s0md3v/roop) | 19,000+ | One-click face replacement in video |
| **Data Visualization** | [D3.js](https://d3js.org/) | 108,000+ | Animated charts, graphs, infographics from live data |
| **Smart Cuts** | [auto-editor](https://github.com/WyattBlue/auto-editor) | Active | Auto-remove silence, dead frames, bad takes |

---

## The Pipeline

This is how a full production runs through Vanta:

```
                    YOUR SCRIPT
                        |
          +-------------+-------------+
          |                           |
    GPT-SoVITS                   Open-Sora
    Clone your voice             Generate B-roll
    from 60s sample              from text prompts
          |                           |
          v                           v
     SadTalker                  AnimateDiff
     Photo → talking            Animate logos,
     head video                 product shots
          |                           |
          +-------------+-------------+
                        |
                  bg-removal-js
                  Composite subjects
                  over new backgrounds
                        |
                   tsparticles
                   Add particle effects
                   confetti, networks
                        |
                   ace-step-ui
                   Generate custom
                   soundtrack
                        |
                   auto-editor
                   Cut silence,
                   dead frames
                        |
                   transcribee
                   Word-level captions
                   with animations
                        |
                     REMOTION
                   React → MP4
                   Final render
                        |
                   FINISHED VIDEO
                   Cost: $0
```

---

## Compositions

### VantaShowcase (15 seconds, 1080p)

The hero video. Five scenes:

| Time | Scene | Description |
|---|---|---|
| 0-3s | Logo Reveal | Geometric V mark with constellation particles |
| 3-6s | Kinetic Typography | Wipe-reveal type with mixed weights |
| 6-9s | Data Visualization | Horizontal bar chart with animated counters |
| 9-12s | Waveform | 48-bar audio-reactive visualization |
| 12-15s | Feature List | Two-column layout with staggered reveals |

### Render Individual Scenes

```bash
npx remotion render src/index.ts Particles out/particles.mp4
npx remotion render src/index.ts KineticText out/kinetic.mp4
npx remotion render src/index.ts DataViz out/dataviz.mp4
npx remotion render src/index.ts Waveform out/waveform.mp4
```

---

## Project Structure

```
vanta/
├── src/
│   ├── index.ts                    # Remotion entry point
│   ├── Root.tsx                    # Composition registry
│   ├── components/
│   │   ├── VantaLogo.tsx           # Animated V mark + wordmark
│   │   ├── FeatureCards.tsx        # Two-column capability list
│   │   └── GradientBackground.tsx  # Cinematic background + film grain
│   ├── scenes/
│   │   ├── VantaShowcase.tsx       # Main hero video (15s)
│   │   ├── ParticleScene.tsx       # Constellation particle field
│   │   ├── KineticText.tsx         # Wipe-reveal typography
│   │   ├── DataVizScene.tsx        # Horizontal bar chart
│   │   └── WaveformScene.tsx       # Audio-reactive bars
│   └── integrations/
│       ├── voice-clone.ts          # GPT-SoVITS / OpenVoice
│       ├── ai-avatar.ts           # SadTalker / Wav2Lip / V-Express
│       ├── auto-captions.ts       # Whisper transcription
│       ├── ai-video.ts            # Open-Sora / AnimateDiff
│       ├── ai-music.ts            # ACE-Step / AudioGPT
│       └── background-removal.ts  # Client-side bg removal
├── package.json
├── tsconfig.json
└── README.md
```

---

## What Vanta Replaces

| Tool | Monthly Cost | Vanta Equivalent |
|---|---|---|
| Synthesia | $22/mo + $30/video | Voice clone + AI avatar |
| Runway ML | $12/mo | Open-Sora video generation |
| Descript | $24/mo | Whisper captions + auto-editor |
| HeyGen | $48/mo | SadTalker + Wav2Lip |
| ElevenLabs | $5/mo | GPT-SoVITS voice clone |
| Suno | $8/mo | ACE-Step music generation |
| Remove.bg | $0.20/image | imgly background removal |
| Epidemic Sound | $15/mo | ACE-Step + AudioGPT |
| **Total saved** | **$134+/mo** | **$0** |

---

## Roadmap

- [ ] Docker Compose for one-command AI service setup
- [ ] Web UI for non-coders (visual editor + Remotion backend)
- [ ] Template marketplace (corporate, social media, e-commerce)
- [ ] Real-time preview with live voice + lip sync
- [ ] Batch rendering API (100 personalized videos from a CSV)
- [ ] Plugin system for community integrations
- [ ] WebGPU-accelerated effects pipeline

---

## Want to Go Further?

Reading open source repos is step one. Shipping products that make money is where it counts.

**[The Agentic Advantage](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)** is where builders turn tools like this into revenue:

- Ship AI products weekly, not just read about them
- Get implementation help from people actively building
- Access exclusive templates, workflows, and deployment guides
- Turn open source into closed deals

[![Join The Agentic Advantage](https://img.shields.io/badge/THE_AGENTIC_ADVANTAGE-000000?style=for-the-badge&logoColor=white)](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)

---

## Contributing

PRs welcome. Priority areas:

1. Docker Compose setup for AI services
2. More Remotion scene templates
3. Integration tests for each module
4. Setup documentation per AI service

---

## License

MIT. Build a SaaS on it. Sell videos made with it. Fork it and rename it. Do whatever you want.

---

**Built by [@itsjwill](https://github.com/itsjwill)** | 40+ open-source repos, one engine

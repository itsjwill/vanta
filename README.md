# VANTA — Open Source AI Video Engine

### Free alternative to Adobe Creative Cloud, Synthesia, Runway ML, Descript, HeyGen, ElevenLabs, and the Remotion Pro Store

> Voice cloning + talking-head avatars + animated captions + video generation + music generation + background removal + image editing + vector graphics + visual editor + timeline + transitions + motion graphics. 40+ open source repos, one render pipeline. $0.

[![Join The Agentic Advantage](https://img.shields.io/badge/THE_AGENTIC_ADVANTAGE-000000?style=for-the-badge&logoColor=white)](https://www.skool.com/ai-elite-9507/about?ref=67521860944147018da6145e3db6e51c)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Built with Remotion](https://img.shields.io/badge/Remotion-6366f1?style=for-the-badge)](https://remotion.dev)

---

Vanta is a programmatic video engine built on [Remotion](https://github.com/remotion-dev/remotion) that combines 40+ open source repositories into a single creation pipeline. Voice cloning (GPT-SoVITS), talking-head avatars (SadTalker), animated captions (Whisper), video generation (Open-Sora), music generation (ACE-Step), background removal, image editing (Sharp), vector graphics (SVG.js), drag-and-drop editor, video timeline, 100+ GPU-accelerated transitions, and motion graphics — all running locally.

It replaces everything in the [Remotion Pro Store](https://www.remotion.pro/store) — Editor ($600), Animated Captions ($100), Timeline ($300), Cube Transition ($10), Colors & Shapes ($20), Watercolor Map ($50) — and most of the Adobe Creative Cloud suite. **$1,080+ in paid features and $55+/mo in subscriptions, free.**

No API keys. No subscriptions. No per-video charges. You own the entire stack.

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

### Video Editor — DesignCombo + Twick

**What it does:** A full CapCut/Canva-style drag-and-drop video editor built on Remotion. Timeline, layers, effects, font picker, asset uploads — the complete editing experience. Non-coders get a visual interface. Developers get 80+ feature flags to customize everything.

**How it works:** DesignCombo's react-video-editor (1.4K+ stars) is built ON TOP of Remotion's rendering engine. Every edit in the visual UI maps to Remotion compositions under the hood. The editor serializes your timeline into JSON that Remotion renders to MP4. This means anything created visually can also be generated programmatically, batch-processed from a CSV, or extended with custom React components.

Twick takes a different approach — a video editor SDK that uses Canvas API rendering with built-in auto-captions and serverless MP4 export. Standalone, less configuration, no Remotion dependency.

**How it connects to Vanta:** The `video-editor.ts` integration provides a project format that bridges the editor UI and Remotion's renderer. Create a project in the editor, export it, and render it — or build projects programmatically with `createEditor()` and feed them into the same pipeline.

```typescript
import { createEditor, projectToRemotionProps } from "./integrations/video-editor";

const editor = createEditor({ width: 1920, height: 1080, fps: 30 });
// Add tracks programmatically or via the visual editor
const props = projectToRemotionProps(editor);
// Feed props into Remotion <Composition> for rendering
```

**What it replaces:** Remotion Pro Editor Starter ($600), CapCut Pro ($7.99/mo), Canva Pro video editor ($13/mo)

**Repos:**
- [react-video-editor](https://github.com/designcombo/react-video-editor) — 1,400+ stars, built on Remotion
- [twick](https://github.com/ncounterspecialist/twick) — AI video editor SDK with Canvas timeline

---

### Animated Captions — Styled Caption Rendering

**What it does:** TikTok-style word-by-word highlights, karaoke scrolls, pop-in effects, typewriter reveals. This is the visual presentation layer on top of the Whisper transcription from `auto-captions.ts`. The part Remotion Pro charges $100 for.

**How it works:** Remotion-subtitles takes your SRT/word timestamps and renders them as animated React components with pre-built caption templates. Each word is a positioned element with frame-accurate timing powered by Remotion's `interpolate()`. The active word gets scale, color, and glow effects while surrounding words dim — the exact effect you see on TikTok, Instagram Reels, and YouTube Shorts.

Vidstack Captions (~5KB) handles format parsing — VTT, SRT, SSA — if you need to work with existing subtitle files. Vista automates the full pipeline from audio to animated captions using AssemblyAI + ffmpeg-wasm.

**How it connects to Vanta:** The `animated-captions.ts` integration takes word timestamps from `auto-captions.ts` and provides style presets (TikTok, YouTube, Reels, Karaoke) plus helper functions for determining which word is active, which words are visible, and what CSS styles to apply at each frame.

```typescript
import { transcribe } from "./integrations/auto-captions";
import { getActiveWordIndex, CAPTION_PRESETS } from "./integrations/animated-captions";

const captions = await transcribe("./audio.wav");
const currentTime = frame / fps;
const activeWord = getActiveWordIndex(captions.segments[0].words, currentTime);
const style = CAPTION_PRESETS.tiktok; // or youtube, reels, karaoke
```

**What it replaces:** Remotion Pro Animated Captions ($100), Captions app ($10/mo), CapCut auto-captions

**Repos:**
- [remotion-subtitles](https://github.com/ahgsql/remotion-subtitles) — Animated subtitles for Remotion
- [vista](https://github.com/zernonia/vista) — Auto-generate animated subtitles
- [captions](https://github.com/vidstack/captions) — 130+ stars, lightweight parser/renderer

---

### Timeline — React Timeline Editor

**What it does:** A video editing timeline component with drag-and-drop tracks, clip trimming, split/join, keyframe editing, and playhead scrubbing. Syncs with Remotion's player for real-time preview.

**How it works:** react-timeline-editor (661 stars) provides a multi-track timeline where each track holds clips (video, audio, image, text). Clips can be dragged to reposition, edges dragged to trim, and the playhead scrubbed to any point. Keyframe diamonds on clips control property animation (opacity, scale, position) over time. The timeline data exports as JSON that maps directly to Remotion `<Sequence>` components.

**How it connects to Vanta:** The `timeline.ts` integration provides a full timeline data model — create timelines, add/remove/split clips, add keyframes, and convert the whole thing to Remotion-compatible sequence data with `toRemotionSequences()`.

```typescript
import { createTimeline, addClip, toRemotionSequences } from "./integrations/timeline";

let timeline = createTimeline({ fps: 30, durationInFrames: 300 });
timeline = addClip(timeline, {
  trackIndex: 0, type: "video", src: "clip.mp4",
  startFrame: 0, endFrame: 150,
});
const sequences = toRemotionSequences(timeline);
// Each sequence maps to a Remotion <Sequence> component
```

**What it replaces:** Remotion Pro Timeline ($300)

**Repos:**
- [react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor) — 661 stars, drag-and-drop
- [timeline-editor-react](https://github.com/kevintech/timeline-editor-react) — Lightweight (~13KB)

---

### Transitions — GL Transitions (100+ Effects)

**What it does:** GPU-accelerated video transitions — crossfade, cube rotate, pixelate, morph, kaleidoscope, glitch, film burn, and 100+ more. Each transition is a WebGL shader that runs on the GPU for instant rendering.

**How it works:** GL Transitions (1.2K+ stars) is an open collection of GLSL fragment shaders. Each shader takes two textures (outgoing scene, incoming scene) and a progress value (0→1), then blends them using the transition algorithm. A cube transition rotates the outgoing scene away like a 3D cube face revealing the incoming scene. A pixelate transition breaks the image into blocks that reform as the new scene. All of them run at 60fps because they execute on the GPU, not the CPU.

The BBC's VideoContext (1.3K+ stars) provides a higher-level composition API with shader-based transitions built in. Curtains.js (4.5K+ stars) converts DOM elements into WebGL textured planes for 3D transition effects.

**How it connects to Vanta:** The `transitions.ts` integration provides a `applyTransition()` function that returns configuration for Remotion's `<TransitionSeries>`. Choose from 30+ named transitions or pass custom GLSL shader code.

```typescript
import { applyTransition, listTransitions } from "./integrations/transitions";

// Use a named transition
const cube = applyTransition("cube", { duration: 30 });
const glitch = applyTransition("glitch", { duration: 15, intensity: 0.8 });

// See all available transitions by category
const all = listTransitions();
// { geometric: [...], "3d": [...], creative: [...], film: [...], ... }
```

**What it replaces:** Remotion Pro Cube Transition ($10) — but you get 100+ transitions instead of just one

**Repos:**
- [gl-transitions](https://github.com/gl-transitions/gl-transitions) — 1,200+ stars, 100+ WebGL shaders
- [VideoContext](https://github.com/bbc/VideoContext) — 1,300+ stars, BBC video composition
- [curtains.js](https://github.com/martinlaxenaire/curtainsjs) — 4,500+ stars, WebGL DOM transitions

---

### Motion Graphics — Shapes, Animations, Data Viz

**What it does:** SVG shapes with animation (circles, bursts, stars, blobs), path drawing effects, particle bursts, lower thirds, countdowns, confetti, progress bars — the building blocks of professional motion design. No After Effects needed.

**How it works:** This integration bridges four massive animation libraries into Remotion's frame-based rendering:

- **Motion** (30.2K+ stars, formerly Framer Motion) — React-native animations with spring physics, SVG path morphing, and layout animations. Drop Motion components directly into Remotion compositions.
- **Anime.js** (46.5K+ stars) — Lightweight engine for SVG, DOM, and JavaScript object animations. Handles complex choreography with timeline sequencing.
- **Mo.js** (18.6K+ stars) — Purpose-built for motion graphics. Pre-made shape primitives (burst, swirl, stagger) that would take hours to code from scratch.
- **GSAP** (23.2K+ stars) — Industry standard. SVG morphing (MorphSVGPlugin), draw-SVG line animations, motion paths, and stagger effects used in every major studio.

**How it connects to Vanta:** The `motion-graphics.ts` integration provides `animateShape()` for individual elements, `createBurst()` for particle effects, `animatePath()` for SVG line drawing, and pre-built templates for common motion graphics (lower thirds, countdowns, confetti, progress bars).

```typescript
import { animateShape, createBurst, TEMPLATES } from "./integrations/motion-graphics";

// Animate a shape
const circle = animateShape("circle", {
  from: { scale: 0, opacity: 0, x: 0, y: 0 },
  to: { scale: 1, opacity: 1, x: 200, y: 100 },
  duration: 30, easing: "spring",
});

// Create a confetti burst
const confetti = TEMPLATES.confetti(["#FFD700", "#FF4444", "#44FF44"]);

// Lower third title
const title = TEMPLATES.lowerThird("John Smith — CEO", "#FFD700");
```

**What it replaces:** Remotion Pro Colors and Shapes ($20), Remotion Pro Watercolor Map ($50), After Effects shape layers, Motion Array templates ($30/mo)

**Repos:**
- [motion](https://github.com/motiondivision/motion) — 30,200+ stars (Framer Motion)
- [anime.js](https://github.com/juliangarnier/anime) — 46,500+ stars
- [mo.js](https://github.com/mojs/mojs) — 18,600+ stars
- [GSAP](https://github.com/greensock/GSAP) — 23,200+ stars

---

### Image Editor — Sharp & JIMP

**What it does:** Programmatic image editing — resize, crop, color correct, apply filters, composite layers, batch process thousands of photos. The Photoshop and Lightroom replacement.

**How it works:** Sharp (31.8K+ stars) is the fastest image processing library in Node.js. It's backed by libvips (C++), which means operations that take Photoshop seconds take Sharp milliseconds. Resize a 4K photo in 20ms. Batch color-correct 500 images in under a minute. Apply LUT color grades, adjust exposure/contrast/saturation, sharpen, blur — everything Lightroom does, but scriptable.

JIMP (14.6K+ stars) is the pure JavaScript alternative. Zero native dependencies means it runs everywhere — browser, Node, serverless functions. It handles compositing, filters, text overlay, and format conversion without compiling anything.

Fabric.js bridges both into a visual canvas editor with layers, blend modes, and real-time preview — the Photoshop layer panel, in the browser.

**How it connects to Vanta:** The `image-editor.ts` integration provides `processImage()` for single edits, `batchProcess()` for folder-level operations, `createComposition()` for layered compositing, and 17 filter presets (cinematic, noir, chrome, warm-vintage, etc.) that apply directly to images before they enter the Remotion render pipeline.

```typescript
import { processImage, FILTER_RECIPES } from "./integrations/image-editor";

// Color grade a photo
await processImage("./photo.jpg", {
  resize: { width: 1920 },
  colorCorrect: FILTER_RECIPES.cinematic,
  sharpen: true,
  output: "./photo-graded.jpg",
});

// Use in Remotion: <Img src="./photo-graded.jpg" />
```

**What it replaces:** Adobe Photoshop ($22.99/mo), Adobe Lightroom ($9.99/mo), Canva Pro image editing ($13/mo)

**Repos:**
- [sharp](https://github.com/lovell/sharp) — 31,800+ stars, fastest Node.js image processor
- [jimp](https://github.com/jimp-dev/jimp) — 14,600+ stars, pure JavaScript
- [fabric.js](https://github.com/fabricjs/fabric.js) — Canvas compositing with layers
- [vue-fabric-editor](https://github.com/ikuaitu/vue-fabric-editor) — 7,700+ stars, full editor UI

---

### Vector Graphics — SVG.js & Paper.js

**What it does:** Create, edit, and animate vector graphics — logos, icons, illustrations, infographics, data visualizations. Export as SVG for infinite scaling or convert to PNG/WebP at any resolution.

**How it works:** SVG.js provides a clean API for building SVG documents programmatically. Instead of hand-writing XML, you call `addCircle()`, `addPath()`, `addText()` and get a valid SVG document. Paper.js adds boolean operations (union, subtract, intersect) — the core of vector illustration work that lets you combine shapes into complex forms.

SVG-Edit gives you a full browser-based editor when you need visual control. Fabric.js bridges vector and raster, letting you mix SVG elements with bitmap images on the same canvas.

**How it connects to Vanta:** The `vector-graphics.ts` integration provides document creation, shape helpers (circle, rect, path, text), gradient definitions, boolean path operations, and SVG export. The output plugs directly into Remotion as inline SVG inside `<AbsoluteFill>` components, or converts to PNG via Sharp for raster rendering.

```typescript
import { createSVG, addCircle, addText, addLinearGradient, exportSVG } from "./integrations/vector-graphics";

let doc = createSVG(1920, 1080);
doc = addLinearGradient(doc, "bg", [
  { offset: "0%", color: "#0a0a0a" },
  { offset: "100%", color: "#1a1a2e" },
], 135);
doc = addCircle(doc, { cx: 960, cy: 540, r: 200, fill: "url(#bg)", stroke: "#FFD700", strokeWidth: 2 });
doc = addText(doc, { content: "VANTA", x: 960, y: 560, fontSize: 120, fontWeight: 100, fill: "#FFFFFF" });

const svg = exportSVG(doc);
// Use in Remotion: <div dangerouslySetInnerHTML={{ __html: svg }} />
```

**What it replaces:** Adobe Illustrator ($22.99/mo), Figma Pro ($15/mo for full features), Canva vector tools

**Repos:**
- [svg.js](https://github.com/svgdotjs/svg.js) — Lightweight SVG manipulation
- [SVG-Edit](https://github.com/SVG-Edit/svgedit) — Full browser-based SVG editor
- [paper.js](https://github.com/paperjs/paper.js) — Vector graphics scripting with boolean ops
- [fabric.js](https://github.com/fabricjs/fabric.js) — Canvas + SVG hybrid rendering

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
| **Silence Removal** | [auto-editor](https://github.com/WyattBlue/auto-editor) | Active | Cut silence, dead frames, bad takes automatically |

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
│       ├── animated-captions.ts   # TikTok/karaoke styled captions (replaces $100)
│       ├── ai-video.ts            # Open-Sora / AnimateDiff
│       ├── ai-music.ts            # ACE-Step / AudioGPT
│       ├── background-removal.ts  # Client-side bg removal
│       ├── video-editor.ts        # Drag-and-drop editor (replaces $600)
│       ├── timeline.ts            # Multi-track timeline (replaces $300)
│       ├── transitions.ts         # 100+ WebGL transitions (replaces $10)
│       ├── motion-graphics.ts     # Shapes, bursts, paths (replaces $70)
│       ├── image-editor.ts        # Photo editing + color grading (replaces Photoshop/Lightroom)
│       └── vector-graphics.ts     # SVG creation + editing (replaces Illustrator)
├── package.json
├── tsconfig.json
└── README.md
```

---

## What Vanta Replaces

### SaaS Subscriptions

| Tool | Monthly Cost | Vanta Equivalent |
|---|---|---|
| Adobe Photoshop | $22.99/mo | `image-editor.ts` — Sharp + JIMP + Fabric.js |
| Adobe Illustrator | $22.99/mo | `vector-graphics.ts` — SVG.js + Paper.js |
| Adobe Lightroom | $9.99/mo | `image-editor.ts` — Sharp color correction + filter presets |
| Synthesia | $22/mo + $30/video | Voice clone + talking-head avatar |
| Runway ML | $12/mo | Open-Sora video generation |
| Descript | $24/mo | Whisper captions + auto-editor |
| HeyGen | $48/mo | SadTalker + Wav2Lip |
| ElevenLabs | $5/mo | GPT-SoVITS voice clone |
| Suno | $8/mo | ACE-Step music generation |
| Remove.bg | $0.20/image | imgly background removal |
| Epidemic Sound | $15/mo | ACE-Step + AudioGPT |
| **Total saved** | **$190+/mo** | **$0** |

### Remotion Pro Store (one-time purchases)

| Store Item | Price | Vanta Equivalent |
|---|---|---|
| Editor Starter | $600 | `video-editor.ts` — DesignCombo react-video-editor (1.4K stars) |
| Animated Captions | $100 | `animated-captions.ts` — remotion-subtitles + style presets |
| Timeline | $300 | `timeline.ts` — react-timeline-editor (661 stars) |
| Cube Transition | $10 | `transitions.ts` — GL Transitions (100+ effects, 1.2K stars) |
| Colors and Shapes | $20 | `motion-graphics.ts` — Motion + Anime.js + Mo.js (95K+ combined stars) |
| Watercolor Map | $50 | `motion-graphics.ts` — SVG path animations + GSAP morphing |
| **Total saved** | **$1,080** | **$0** |

**Combined savings: $190+/month in subscriptions + $1,080 in one-time purchases = $3,360+ in the first year.**

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

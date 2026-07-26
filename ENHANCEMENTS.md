# VANTA Enhancement Roadmap

> **Pipeline status: verified ✅** — `npm install`, `tsc --noEmit`, and full `npm run render` (450/450 frames → `out/vanta-showcase.mp4`) all pass clean as of 2026-07-25.
>
> Deep-dive audit of the current integration stack + verified GitHub research for what to add next.
> Every repo below was verified live via the GitHub API on **2026-07-25** — stars, last push date, and license checked. Nothing here is from memory.
>
> License legend: ✅ safe for MIT/commercial · ⚠️ conditional (revenue caps, copyleft-as-a-service OK) · ❌ non-commercial / incompatible

---

## 1. Urgent: License Landmines in the Current Stack

VANTA is pitched as a **free commercial** Adobe/Synthesia/Runway alternative under MIT. These current picks break that pitch:

| Current pick | Problem | Action |
|---|---|---|
| **Wav2Lip** (Rudrabha/Wav2Lip) | No license file. README: "any form of commercial use is strictly prohibited" (LRS2 training data). | **Remove.** Replace with MuseTalk / LatentSync (below). |
| **V-Express** (tencent-ailab) | Released checkpoints "for research purposes only" + stale since Jan 2025. | **Remove.** |
| **transcribee** (bugbakery) | AGPL-3.0, 506 stars. Copyleft-viral for an MIT project. | **Replace with WhisperX** (BSD-2). |
| **twick** | "Sustainable Use License v1.0" — fair-code, **not open source**. Restricts commercial use/redistribution. | Remove as dependency; inspiration-only. |
| **designcombo/react-video-editor** | Renamed to `openvideodev/react-video-editor` and **relicensed** — two-tier "OpenVideo License": free for individuals/small cos, **paid license for larger for-profits**. Not MIT anymore. | Keep as pattern reference only; document the license change. |
| **ace-step-ui** (fspecii) | **No license file** = legally all-rights-reserved. Also just a wrapper. | Switch to official [`ace-step/ACE-Step-1.5`](https://github.com/ace-step/ACE-Step-1.5) — MIT, first-party REST API. |
| **GSAP** | Free since the Webflow acquisition, but the GSAP standard license is **not OSI open source**. | Fine to use; never vendor source. Note in docs. |
| **Remotion itself** | Source-available "Remotion License" — free for individuals/small teams; **company license required for 4+ employee for-profits**. | Known tradeoff. Document honestly so users aren't surprised. |

## 2. Dead / Stale Current Picks (verified push dates)

| Pick | Last push | Verdict |
|---|---|---|
| SadTalker | 2024-06-26 | **Dead 2+ years.** Replace. |
| VideoReTalking | 2024-08-05 | **Dead ~2 years.** Replace. |
| AnimateDiff | 2024-07-31 | **Dead 2 years.** Replace with Wan2.2 / LTX-Video. |
| AudioGPT | 2024-07-06 | **Dead 2 years**, license "Other". Remove — ACE-Step-1.5 + MMAudio cover its lanes. |
| fluent-ffmpeg | — | **ARCHIVED by upstream.** Migrate to mediabunny / node-av if used anywhere. |
| editly | 2025-05-12 | Dormant 14 months. Drop as dependency. |
| OpenVoice | 2025-04-19 | Quiet 15 months. MIT so no legal issue, but quality lapped — demote to fallback. |
| Open-Sora (hpcaitech) | 2026-04-09 | Alive but coasting; quality behind Wan2.2/LTX. Demote to fallback. |
| react-timeline-editor (xzdarcy) | 2026-01-25 | **Revived** — v1.0.0 Jan 2026 after 3-year sleep. Safe to keep; OpenCut is the richer reference. |
| GPT-SoVITS | 2026-07-22 | ✅ Healthy, 60K★, MIT. Keep. |

---

## 3. Recommended Swaps — Lane by Lane

### 3.1 Avatars / Lip Sync (current stack dead AND partly illegal)

| Repo | Stars | License | What it adds | Integration |
|---|---|---|---|---|
| [MuseTalk](https://github.com/TMElyralab/MuseTalk) | 6.2K | ✅ MIT | **Real-time (30fps+) video dubbing/lip-sync** — the modern Wav2Lip | Real-time pipeline + Gradio |
| [LatentSync](https://github.com/bytedance/LatentSync) | 5.9K | ✅ Apache-2.0 | SOTA diffusion lip sync on existing video, temporal consistency | gradio_app + CLI |
| [InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk) | 7.5K | ✅ Apache-2.0 | **Unlimited-length** audio-driven talking video (I2V + dubbing) | CLI / ComfyUI (heavy GPU) |
| [EchoMimicV3](https://github.com/antgroup/echomimic_v3) | 1K | ✅ Apache-2.0 | 1.3B full/half-body audio-driven animation, runs on **12GB VRAM** | Gradio + ComfyUI |
| [ditto-talkinghead](https://github.com/antgroup/ditto-talkinghead) | 842 | ✅ Apache-2.0 | Real-time **streaming** talking head, ships ONNX + TensorRT | Production-latency SDK |

⚠️ Avoid: **Sonic** (CC-NC), **FLOAT** (CC-NC), **Duix.Heygem** (free only <1,000 MAU), **HunyuanVideo-Avatar** (license void in EU/UK/South Korea). **LivePortrait** is MIT but depends on InsightFace models (non-commercial) — swap the face detector before commercial use.

### 3.2 Captions / ASR (flagship feature — biggest quality win)

| Repo | Stars | License | What it adds | Integration |
|---|---|---|---|---|
| [WhisperX](https://github.com/m-bain/whisperX) | 23.3K | ✅ BSD-2 | **wav2vec2 forced alignment → truly accurate word-level timestamps** (raw Whisper interpolates and drifts), 70x realtime batching, free diarization | Python lib — wrap in ~30-line FastAPI |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | 24.5K | ✅ MIT | 4x faster CTranslate2 engine (what WhisperX runs on) | Via [speaches](https://github.com/speaches-ai/speaches) (3.5K★, MIT) = OpenAI-compatible REST server |
| [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) | 13.8K | ✅ Apache-2.0 | **Native Node.js bindings (npm)** — run Whisper/Parakeet ONNX inside the TS process, no Python sidecar | npm package |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | 52.3K | ✅ MIT | CPU/Metal inference, zero Python, ships HTTP server example + node addon | CLI / HTTP / node addon |

⚠️ Avoid: **whisper-timestamped** (AGPL), **stable-ts** (archived).

### 3.3 Voice Cloning / TTS

| Repo | Stars | License | What it adds | Integration |
|---|---|---|---|---|
| [VoxCPM](https://github.com/OpenBMB/VoxCPM) (VoxCPM2) | 34.2K | ✅ Apache-2.0, explicitly commercial-ready | Tokenizer-free zero-shot cloning, 30 languages, streaming RTF ~0.13 | **vLLM-Omni OpenAI-compatible REST API** |
| [kokoro](https://github.com/hexgrad/kokoro) + `kokoro-js` npm | 8.1K | ✅ Apache-2.0 / MIT | 82M-param instant TTS. **Pure-TypeScript ONNX — zero Python server.** No cloning (fixed voices) — perfect zero-install default tier | npm `kokoro-js`; REST via [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) (5.3K★) |
| [Chatterbox](https://github.com/resemble-ai/chatterbox) | 25.7K | ✅ MIT | SOTA English cloning + emotion exaggeration control | Gradio (note: output carries PerTh watermark) |
| [CosyVoice](https://github.com/FunAudioLLM/CosyVoice) | 22.4K | ✅ Apache-2.0 (verified — NOT non-commercial) | CosyVoice2/3 multilingual + instruct control | **Official FastAPI + gRPC + vLLM servers** |
| [F5-TTS](https://github.com/SWivid/F5-TTS) | 15K | ✅ MIT | Fast flow-matching cloning from ~10s reference | Gradio API + Triton/TensorRT runtime |
| [IndexTTS2](https://github.com/index-tts/index-tts) | 22.2K | ⚠️ free commercial below 100M MAU / ¥1B revenue | Best-in-class emotional fidelity + duration control | Gradio + CLI |

⚠️ Avoid: **fish-speech/OpenAudio** (paid commercial license since Mar 2026), **XTTS weights** (Coqui CPML non-commercial), **MegaTTS3** (WaveVAE encoder withheld — cannot clone arbitrary voices locally), **ChatTTS** (AGPL). Stale: Spark-TTS, Zonos (~15 mo quiet).

### 3.4 Video Generation (replaces Open-Sora + dead AnimateDiff)

| Repo | Stars | License | What it adds | Integration |
|---|---|---|---|---|
| [Wan2.2](https://github.com/Wan-Video/Wan2.2) | 16.8K | ✅ **Apache-2.0 code AND weights** | Only SOTA-tier open video model fully permissive. T2V + I2V + TI2V-5B that fits a single 4090 | ComfyUI native + [WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper) (6.6K★) |
| [LTX-Video](https://github.com/Lightricks/LTX-Video) | 10.7K | ⚠️ Apache code; weights community license (commercial OK below ~$10M revenue) | **Real-time-class generation** — preview-while-you-edit inside a timeline editor | First-party ComfyUI nodes |
| [FramePack](https://github.com/lllyasviel/FramePack) | 17.1K | ✅ Apache-2.0 | Long-video I2V on **6GB VRAM** — consumer-hardware king | Gradio + CLI |
| [LongCat-Video](https://github.com/meituan-longcat/LongCat-Video) | 5.3K | ✅ MIT | 13.6B unified T2V/I2V/continuation, minutes-long, 720p24 — rare MIT at this tier | CLI research code |
| [FastVideo](https://github.com/hao-ai-lab/FastVideo) | 3.9K | ✅ Apache-2.0 | Inference accelerator for Wan/Hunyuan (sliding-tile attention, distilled ckpts) — force multiplier | Python API/CLI |

⚠️ **HunyuanVideo**: license **void in EU/UK/South Korea** + <100M MAU cap — document if mentioned. **LTX-2** (joint audio+video, 4K): watch, but revenue-gated license needs review. SkyReels: custom restricted license.

### 3.5 Image Generation (new lane)

| Repo | Stars | License | What it adds |
|---|---|---|---|
| [FLUX.1-schnell](https://github.com/black-forest-labs/flux) | 25.8K | ✅ schnell weights Apache-2.0 (**dev weights = non-commercial — use schnell**) | SOTA-tier 4-step image gen for storyboards/keyframes |
| [Z-Image](https://github.com/Tongyi-MAI/Z-Image) | 11.8K | ✅ Apache-2.0 | 6B single-DiT, sub-second on consumer GPUs |
| [Qwen-Image](https://github.com/QwenLM/Qwen-Image) | 8.2K | ✅ Apache-2.0 | Best-in-class **text rendering inside images** — titles/captions for ad content |
| [Sana](https://github.com/NVlabs/Sana) | 8.6K | ✅ Apache code (check per-checkpoint) | 4K generation <1s on consumer GPUs |

### 3.6 Music & Audio Generation

| Repo | Stars | License | What it adds | Integration |
|---|---|---|---|---|
| [ACE-Step-1.5](https://github.com/ace-step/ACE-Step-1.5) | 11.8K | ✅ MIT | Official successor to the ace-step-ui wrapper. Mac/AMD/Intel/CUDA (MLX on Apple Silicon), LoRA training | **First-party REST API: `uv run acestep-api` → localhost:8001** (docs/en/API.md). Easiest drop-in in this doc |
| [MMAudio](https://github.com/hkchengrex/MMAudio) | 2.2K | ✅ MIT incl. weights | SOTA **video-to-audio foley** — synchronized SFX from video+text. Lane VANTA lacks entirely | Gradio + CLI + [ComfyUI-MMAudio](https://github.com/kijai/ComfyUI-MMAudio) |
| [YuE](https://github.com/multimodal-art-projection/YuE) | 6.3K | ✅ Apache-2.0 (weights relicensed 2025) | Full songs with **vocals + lyrics** (Suno-style) | CLI + community UIs |
| [stable-audio-tools](https://github.com/Stability-AI/stable-audio-tools) | 3.8K | ⚠️ MIT code; weights <$1M revenue free | Stable Audio Open Small: text-to-SFX <1s, CPU-capable | Python/gradio |
| [DiffRhythm](https://github.com/ASLP-lab/DiffRhythm) | 2.3K | ✅ Apache-2.0 | Full 4m45s song in ~10s | Gradio + ComfyUI node |

⚠️ **MusicGen/AudioCraft**: MIT code but **weights CC-BY-NC** — flag if mentioned. AudioLDM2/AudioX/ThinkSound: non-commercial.

---

## 4. New Lanes — "Topaz + Audition Replacement" (all missing today)

These extend the "$190/mo replaced" pitch. Every pick is commercial-safe, and most ship as **portable CLI binaries** callable from Node `child_process` — no Python servers.

| Capability | Pick | Stars | License | Notes |
|---|---|---|---|---|
| Upscale 2x/4x | [Real-ESRGAN-ncnn-vulkan](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan) | 2.2K | ✅ MIT | Single portable GPU executable (Win/Mac/Linux, Apple Silicon). Half of Topaz Video AI ($299) |
| Frame interpolation / slow-mo | [Practical-RIFE](https://github.com/hzwer/Practical-RIFE) + [rife-ncnn-vulkan](https://github.com/nihui/rife-ncnn-vulkan) | 1K–5.5K | ✅ MIT | 60fps conversion + slow-mo. Other half of Topaz. Same binary pattern |
| Face restoration | [GFPGAN](https://github.com/TencentARC/GFPGAN) | 37.6K | ✅ Apache-2.0 | Fixes AI-garbled faces. Native `--face_enhance` flag inside Real-ESRGAN. (**CodeFormer is S-Lab non-commercial — do not use**) |
| Stem splitting | [python-audio-separator](https://github.com/nomadkaraoke/python-audio-separator) | 1.3K | ✅ MIT | One headless CLI wrapping all UVR/Demucs/MDX models. Also: [adefossez/demucs](https://github.com/adefossez/demucs) (maintained fork, MIT) |
| Audio denoise | [DeepFilterNet](https://github.com/Rikorose/DeepFilterNet) | 4.5K | ✅ MIT/Apache dual | Ships `deep-filter` **Rust binary** — zero Python. Adobe Podcast-style enhance button. Pair with [resemble-enhance](https://github.com/resemble-ai/resemble-enhance) (MIT) for bandwidth extension |
| Rotoscoping / video matting | [SAM2](https://github.com/facebookresearch/sam2) + [BiRefNet](https://github.com/ZhengPeng7/BiRefNet) | 19.6K / 3.9K | ✅ Apache / MIT | Click object → masks across all frames = AE Roto Brush. BiRefNet = MIT answer to BRIA RMBG-2.0 (paywalled commercial). BiRefNet has ONNX export → onnxruntime-node |
| Object / watermark removal | [IOPaint](https://github.com/Sanster/IOPaint) | 23.3K | ✅ Apache-2.0 (archived but stable) | `iopaint start` = instant localhost REST API. (**ProPainter, MatAnyone, E2FGVI all non-commercial** — per-frame LaMa + SAM2 mask propagation is the commercial-safe video path) |
| Color grading / LUTs | FFmpeg `lut3d`/`haldclut` + [parse-cube-lut](https://github.com/thibauts/parse-cube-lut) + [glsl-lut](https://github.com/mattdesl/glsl-lut) | — | ✅ MIT (JS) | Near-zero integration cost. glsl-lut applies LUTs **inside Remotion compositions** at preview time. [lutgen-rs](https://github.com/ozwaldorf/lutgen-rs) (MIT) generates LUTs from palettes |
| Auto rough-cut | [auto-editor](https://github.com/WyattBlue/auto-editor) | 4.6K | ✅ **Unlicense** (public domain) | Silence/motion cutting; EDL/JSON output → drive the VANTA timeline for one-command rough cuts |
| Scene detection | [PySceneDetect](https://github.com/Breakthrough/PySceneDetect) | 5K | ✅ BSD-3 | Auto-split source footage into clips |
| BG removal (server-grade) | [rembg](https://github.com/danielgatis/rembg) | 24K | ✅ MIT | `rembg s` REST server mode; complements the existing imgly client-side path |

⚠️ AGPL (suggest, never bundle): Upscayl, video2x. GPL: APISR, RobustVideoMatting (its ONNX/TF.js exports still carry GPL).

---

## 5. Strategic Infrastructure (biggest leverage)

1. **[ComfyUI](https://github.com/comfyanonymous/ComfyUI) as universal AI backend** — 122K★, pushed daily. One localhost HTTP API (`POST /prompt` on :8188 + websocket progress) runs nearly every model in this doc: Wan2.2, LTX, FLUX, Qwen-Image, SD3.5, MMAudio, ACE-Step. Turns N bespoke server integrations into **one TypeScript client**. GPL-3.0 is a non-issue across a process/HTTP boundary. Best TS client: [StableCanvas/comfyui-client](https://github.com/StableCanvas/comfyui-client) (MIT, http+ws).
2. **[mediabunny](https://github.com/Vanilagy/mediabunny)** — 6.8K★, MPL-2.0, pure-TS media read/write/convert in browser + Node on WebCodecs. The modern replacement for **archived** fluent-ffmpeg and heavyweight ffmpeg.wasm. Server-side native alternative: [node-av](https://github.com/seydx/node-av) (MIT).
3. **[Remocn](https://github.com/Remocn/remocn)** — 1K★, MIT, shadcn-style registry of ready-made Remotion animations/transitions/backgrounds/scenes. Direct drop-ins for the motion-graphics layer.
4. **[remotion-dev/skills](https://github.com/remotion-dev/skills)** + official templates ([template-tiktok](https://github.com/remotion-dev/template-tiktok) word-timed captions, template-prompt-to-motion-graphics-saas) — VANTA is an AI video engine; shipping Remotion's own agent skills in-repo makes every coding agent a competent VANTA operator.
5. **[OpenCut](https://github.com/OpenCut-app/OpenCut)** — 78.7K★, MIT. The richest modern timeline/preview architecture to study (react-timeline-editor revived Jan 2026 but moves slowly). Also MIT: [omniclip](https://github.com/omni-media/omniclip), [freecut](https://github.com/walterlow/freecut), [clip-js](https://github.com/mohyware/clip-js) (Remotion + ffmpeg.wasm, same stack).
6. **[sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx)** — strategic: native Node bindings for ASR (and k2's OmniVoice TTS) enable a **"no localhost servers" mode** where everything runs in-process.

### Pipeline patterns worth studying (not vendoring)

- [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) (99K★, MIT) — topic→short full pipeline architecture
- [FunClip](https://github.com/modelscope/FunClip) (6K★, MIT) — LLM-assisted clip extraction sidecar
- [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) (1.8K★, Apache) — Remotion agent skill for product videos
- [NarratoAI](https://github.com/linyqh/NarratoAI) (10.4K★, MIT) — LLM auto-narration + editing

## 6. Competitor Alert

**[OpenMontage](https://github.com/calesthio/OpenMontage)** — 42K★, created Mar 2026, AGPL-3.0. "Agentic video production system": 12 pipelines, 100+ tools, 700+ agent skills. Direct competitor. Study the agent-orchestration design; AGPL blocks any code reuse — **VANTA's MIT license is the differentiator**.

---

## 7. Priority Roadmap

| # | Move | Effort | Impact |
|---|---|---|---|
| 1 | **Legal cleanup** — remove Wav2Lip/V-Express/twick/transcribee references, swap ace-step-ui → ACE-Step-1.5, document Remotion/GSAP/designcombo license realities | Low | Protects the entire pitch |
| 2 | **WhisperX** swap for captions | Low | Flagship feature, straight quality upgrade |
| 3 | **MuseTalk + LatentSync** avatar lane | Medium | Current lane dead AND non-commercial |
| 4 | **Enhance module**: Real-ESRGAN + RIFE + GFPGAN ncnn-vulkan binaries via child_process | Low-Medium | New Topaz-replacement pitch, portable binaries, no Python |
| 5 | **ComfyUI backend + Wan2.2** (one TS client, many models) | Medium-High | Biggest architecture leverage; kills N-servers problem |
| 6 | **Audio suite**: MMAudio (foley) + DeepFilterNet (denoise) + audio-separator (stems) + ACE-Step-1.5 REST | Medium | Full Audition/Adobe-Podcast replacement |
| 7 | **mediabunny + Remocn + remotion-dev/skills** | Low | Modern infra + instant component vocabulary + agent-native docs |

## Fully Clean List (Apache/MIT code AND weights — safe defaults)

Wan2.2 · ACE-Step-1.5 · MMAudio · YuE · Z-Image · Qwen-Image · FLUX.1-schnell · LongCat-Video · DiffRhythm · MuseTalk · LatentSync · InfiniteTalk · EchoMimicV3 · Ditto · VoxCPM2 · Kokoro · Chatterbox · CosyVoice · F5-TTS · WhisperX · faster-whisper · whisper.cpp · sherpa-onnx · Real-ESRGAN · Practical-RIFE · GFPGAN · SAM2 · BiRefNet · IOPaint · rembg · Demucs · python-audio-separator · DeepFilterNet · resemble-enhance · auto-editor · PySceneDetect · mediabunny (MPL) · Remocn · OpenCut

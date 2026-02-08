/**
 * VANTA — AI Video Generation Integration
 *
 * Text-to-video and image-to-video generation using open-source models.
 * Generate B-roll, backgrounds, and scene footage from text prompts.
 *
 * Usage:
 *   const clip = await generateVideo("A sunset over the ocean, cinematic");
 *   // Use clip.url in Remotion's <OffthreadVideo> component
 *
 * Repos:
 *   - https://github.com/hpcaitech/Open-Sora — Open-source Sora (text → video)
 *   - https://github.com/showlab/Tune-A-Video (4,377 stars) — One-shot T2V
 *   - https://github.com/guoyww/AnimateDiff — Animate still images
 *   - https://github.com/rhymes-ai/Allegro (1,116 stars) — 6s video clips
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface VideoGenerationConfig {
  serverUrl: string;
  model?: "open-sora" | "animatediff" | "allegro";
}

export interface GeneratedClip {
  url: string;
  duration: number;
  width: number;
  height: number;
  prompt: string;
}

export async function generateVideo(
  prompt: string,
  config: VideoGenerationConfig
): Promise<GeneratedClip> {
  const { serverUrl, model = "open-sora" } = config;

  const response = await fetch(`${serverUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      model,
      duration: 6,
      width: 1280,
      height: 720,
      fps: 24,
    }),
  });

  return response.json();
}

export async function animateImage(
  imagePath: string,
  motionPrompt: string,
  config: VideoGenerationConfig
): Promise<GeneratedClip> {
  const { serverUrl } = config;

  const response = await fetch(`${serverUrl}/animate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imagePath, prompt: motionPrompt }),
  });

  return response.json();
}

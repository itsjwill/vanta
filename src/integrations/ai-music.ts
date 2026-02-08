/**
 * VANTA — AI Music Generation Integration
 *
 * Generate custom soundtracks on demand using open-source models.
 * Free, local, unlimited — no Suno subscription needed.
 *
 * Usage:
 *   const track = await generateMusic("upbeat corporate tech background");
 *   // Use track.url in Remotion's <Audio> component
 *
 * Repos:
 *   - https://github.com/fspecii/ace-step-ui (471 stars) — Suno alternative
 *   - https://github.com/AIGC-Audio/AudioGPT (10,210 stars) — All-in-one audio AI
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface MusicConfig {
  serverUrl: string;
  model?: "ace-step" | "audiogpt";
}

export interface GeneratedTrack {
  url: string;
  duration: number;
  bpm: number;
  prompt: string;
}

export async function generateMusic(
  prompt: string,
  config: MusicConfig
): Promise<GeneratedTrack> {
  const { serverUrl, model = "ace-step" } = config;

  const response = await fetch(`${serverUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model, duration: 30 }),
  });

  return response.json();
}

/**
 * PRISM STUDIO — AI Avatar Integration
 *
 * Integrates SadTalker and Wav2Lip for turning a single photo
 * into a talking-head video with perfect lip sync.
 *
 * Usage:
 *   const avatar = await createAvatar("./headshot.jpg");
 *   const videoUrl = await avatar.speak("./voiceover.wav");
 *   // Use videoUrl in Remotion's <OffthreadVideo> component
 *
 * Repos:
 *   - https://github.com/OpenTalker/SadTalker (7,212 stars) — Photo → talking head
 *   - https://github.com/Rudrabha/Wav2Lip — Perfect lip sync
 *   - https://github.com/OpenTalker/video-retalking (7,212 stars) — Re-dub any video
 *   - https://github.com/tencent-ailab/V-Express (2,365 stars) — Expression control
 *
 * This replaces Synthesia ($30/video) with unlimited free generation.
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface AvatarConfig {
  serverUrl: string;
  imagePath: string;
  method?: "sadtalker" | "wav2lip" | "v-express";
}

export interface Avatar {
  speak: (audioPath: string) => Promise<string>; // Returns video URL
  speakWithExpression: (audioPath: string, emotion: string) => Promise<string>;
}

export async function createAvatar(config: AvatarConfig): Promise<Avatar> {
  const { serverUrl, imagePath, method = "sadtalker" } = config;

  return {
    speak: async (audioPath: string) => {
      const response = await fetch(`${serverUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath, audio: audioPath, method }),
      });
      const { video_url } = await response.json();
      return video_url;
    },
    speakWithExpression: async (audioPath: string, emotion: string) => {
      const response = await fetch(`${serverUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath, audio: audioPath, method: "v-express", emotion }),
      });
      const { video_url } = await response.json();
      return video_url;
    },
  };
}

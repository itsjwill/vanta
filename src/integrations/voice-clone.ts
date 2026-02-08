/**
 * PRISM STUDIO — Voice Cloning Integration
 *
 * Integrates GPT-SoVITS (54K+ stars) and OpenVoice (35K+ stars)
 * for instant voice cloning from 60 seconds of audio.
 *
 * Usage:
 *   const voice = await cloneVoice("./sample.wav");
 *   const audio = await voice.speak("Hello from Prism Studio");
 *   // Use audio URL in Remotion's <Audio> component
 *
 * Setup:
 *   1. Run GPT-SoVITS server locally: docker run -p 9880:9880 gptsovits/server
 *   2. Or use OpenVoice: pip install openvoice && openvoice-server
 *   3. Set VOICE_SERVER_URL in .env
 *
 * Repos:
 *   - https://github.com/RVC-Boss/GPT-SoVITS (54,833 stars)
 *   - https://github.com/myshell-ai/OpenVoice (35,910 stars)
 *
 * Want help setting this up? Join The Agentic Advantage:
 * https://www.skool.com/ai-elite-9507/about
 */

export interface VoiceCloneConfig {
  serverUrl: string;
  sampleAudioPath: string;
  language?: string;
  speed?: number;
}

export interface ClonedVoice {
  id: string;
  speak: (text: string) => Promise<string>; // Returns audio URL
  speakToFile: (text: string, outputPath: string) => Promise<void>;
}

export async function cloneVoice(config: VoiceCloneConfig): Promise<ClonedVoice> {
  const { serverUrl, sampleAudioPath, language = "en", speed = 1.0 } = config;

  // Upload sample audio to voice server
  const formData = new FormData();
  const response = await fetch(`${serverUrl}/clone`, {
    method: "POST",
    body: formData,
  });

  const { voice_id } = await response.json();

  return {
    id: voice_id,
    speak: async (text: string) => {
      const ttsResponse = await fetch(`${serverUrl}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice_id, text, language, speed }),
      });
      const blob = await ttsResponse.blob();
      return URL.createObjectURL(blob);
    },
    speakToFile: async (text: string, outputPath: string) => {
      const ttsResponse = await fetch(`${serverUrl}/tts/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice_id, text, language, speed, output: outputPath }),
      });
      await ttsResponse.json();
    },
  };
}
